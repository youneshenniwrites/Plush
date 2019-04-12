import React from 'react'
import {
  View,
  Alert,
  Keyboard,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActionSheetIOS,
  Platform,
} from 'react-native'

// Amplify
import API, { graphqlOperation } from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Amplify from '@aws-amplify/core'
import Storage from '@aws-amplify/storage'

// Third party libs
import { RNS3 } from 'react-native-aws3' // For sending pics to S3 instead of Storage.put()
import { ImagePicker, Permissions } from 'expo'
import { v4 as uuid } from 'uuid'

// Local components
import Header from './Header';
import PostCard from './PostCard'
import PictureCard from './PictureCard'
import ModalPosts from './ModalPosts'
import OptionsAndroid from './OptionsAndroid'

// Config imports
import config from '../aws-exports'
import keys from '../keys'

// GraphQL mutations and queries
import CreatePost from '../graphQL/CreatePost'
import CreatePicture from '../graphQL/CreatePicture'
import DeletePicture from '../graphQL/DeletePicture'
import CreateLikePost from '../graphQL/CreateLikePost'
import CreateLikePicture from '../graphQL/CreateLikePicture'
import DeleteLikePost from '../graphQL/DeleteLikePost'
import CreateFlagPicture from '../graphQL/CreateFlagPicture'
import DeletePost from '../graphQL/DeletePost'
import listPosts from '../graphQL/listPosts'
import listPictures from '../graphQL/listPictures'

// Apollo components
import { graphql, compose } from 'react-apollo'

Amplify.configure(config)

class Feed extends React.Component {
  state = {
    modalVisible: false,
    optionsVisible: false,
    posts: [],
    pictures: [],
    allPicsURIs: [],
    postOwnerId: '',
    likeOwnerId: '',
    postContent: '',
    postOwnerUsername: '',
    likeOwnerUsername: '',
  }

  componentDidMount = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState(
          {
            postOwnerUsername: user.username,
            likeOwnerUsername: user.username,
            flagOwnerUsername: user.username,
            postOwnerId: user.attributes.sub,
            likeOwnerId: user.attributes.sub,
            flagOwnerId: user.attributes.sub,
          }
        )
      })
      .catch(err => console.log(err))
    await this.listPosts()
    await this.allPicsURIs()
    // console.log(this.state.pictures)
  }

  // Two methods for Modal posts.
  showModal = () => {
    this.setState({ modalVisible: true })
  }

  hideModal = () => {
    this.setState({ modalVisible: false, postContent: '' })
  }

  // Two methods for Modal options. Used only in Android.
  showOptions = () => {
    this.setState({ optionsVisible: true })
  }

  hideOptions = () => {
    this.setState({ optionsVisible: false })
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  // Pull to refresh the feed
  _onRefresh = () => {
    this.setState({ refreshing: true })
    this.componentDidMount()
      .then(() => {
        this.setState({ refreshing: false })
      })
  }

  // Query both posts and pictures 
  listPosts = async () => {
    try {
      const picturesData = await API.graphql(graphqlOperation(listPictures))
      const listOfAllpictures = await picturesData.data.listPictures.items
      this.setState({ pictures: listOfAllpictures })
      // const postsData = await API.graphql(graphqlOperation(listPosts))
      // const listOfAllposts = await postsData.data.listPosts.items
      // this.setState({ posts: listOfAllposts, pictures: listOfAllpictures })
    }
    catch (err) {
      console.log('error: ', err)
    }
  }

  createPost = async () => {
    const post = this.state
    if (post.postContent === '') {
      Alert.alert('Write something!')
      return
    }
    try {
      await API.graphql(graphqlOperation(CreatePost, post))
      await this.componentDidMount()
      Keyboard.dismiss()
      this.hideModal()
    } catch (err) {
      console.log('Error creating post.', err)
    }
  }

  // Two methods to delete posts
  deletePostAlert = async (post) => {
    await Alert.alert(
      'Delete Post',
      'Are you sure you wanna delete this post?',
      [
        { text: 'Cancel', onPress: () => { return }, style: 'cancel' },
        { text: 'OK', onPress: () => this.deletePost(post) },
      ],
      { cancelable: false }
    )
  }

  deletePost = async (post) => {
    const postId = await post['id']
    try {
      await API.graphql(graphqlOperation(DeletePost, { id: postId }))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error deleting post.', err)
    }
  }

  /* 
  Two methods to get pictures from the user's device then upload them to AWS-S3 
  and store their records in AWS-DynamobDB
  */
  createPicture = async () => {
    await this.askPermissionsAsync()
    const result = await ImagePicker.launchImageLibraryAsync(
      {
        allowsEditing: false,
      }
    )
    if (!result.cancelled) {
      await this.uploadToS3AndRecordInDynamodb(result.uri)
        .then(Alert.alert(
          'Success',
          'Your picture was uploaded to the contest.',
          [
            { text: 'Done', onPress: () => this.componentDidMount() },
          ],
          { cancelable: false }
        ))
    }
  }

  uploadToS3AndRecordInDynamodb = async (uri) => {
    const { bucket, region } = this.props.options
    const visibility = 'public'
    let picture = {
      uri: uri,
      name: uuid() + '.jpeg',
      type: "image/jpeg",
      bucket,
      region,
    }
    const config = {
      keyPrefix: "public/",
      accessKey: keys.accessKey,
      secretKey: keys.secretKey,
      successActionStatus: 201,
      bucket,
      region,
    }
    RNS3.put(picture, config)
      .then(response => {
        if (response.status !== 201) {
          throw new Error("Failed to upload image to S3")
        } else {
          const uri = response.headers.Location
          const key = `${picture.name}`
          const file = { bucket, region, key, uri }
          // Apollo mutation to create a picture
          this.props.onAddPicture(
            {
              id: uuid(),
              pictureOwnerId: this.state.postOwnerId,
              pictureOwnerUsername: this.state.postOwnerUsername,
              visibility: visibility,
              file: file
            }
          )
        }
      })
  }

  allPicsURIs = () => {
    /* 
    Load all uris of images in the state.
    */
    let uris = this.state.pictures.map(picture => picture.file.uri)
    this.setState({ allPicsURIs: uris })
  }

  /* 
  This method allows you to:
  1 - Report inappropriate content.
  2 - Delete your own pictures.
  */
  optionsPicture = (uri) => {
    // iOS: Use the ActionSheetIOS component
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Report', 'Remove'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          // Flag inappropriate content
          if (buttonIndex === 1) {
            this.createFlagPictureAlert(uri)
          }
          // Allow owners to delete their pictures
          if (
            buttonIndex === 2 &&
            this.state.pictures.filter(
              pic => pic.file.key === uri.substring(uri.indexOf('2F') + 2)
            )[0].pictureOwnerId === this.state.postOwnerId
          ) {
            this.deletePictureAlert(uri)
          } else if (buttonIndex === 2) {
            Alert.alert('You do not have permission')
          }
        },
      )
    } else {
      // Android: open custom Modal for options
      this.showOptions()
    }
  }

  // Two methods to hide inappropriate content
  createFlagPictureAlert = (uri) => {
    Alert.alert(
      'Report picture',
      'Are you sure you want to flag this picture as inappropriate?',
      [
        { text: 'Cancel', onPress: () => { return }, style: 'cancel' },
        { text: 'OK', onPress: () => this.createFlagPicture(uri) },
      ],
      { cancelable: false }
    )
  }

  createFlagPicture = async (uri) => {
    const key = await uri.substring(uri.indexOf('2F') + 2)
    const pictureObject = await this.state.pictures.filter(photo => photo.file.key === key)
    const pictureId = await pictureObject[0].id
    const flag = {
      id: pictureId,
      flagOwnerId: this.state.flagOwnerId,
      flagOwnerUsername: this.state.flagOwnerUsername,
    }
    try {
      await API.graphql(graphqlOperation(CreateFlagPicture, flag))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error creating like.', err)
    }
  }

  // Three methods below to let users delete their pictures 
  deletePictureAlert = (uri) => {
    Alert.alert(
      'Remove picture',
      'Are you sure you want to delete this picture?',
      [
        { text: 'Cancel', onPress: () => { return }, style: 'cancel' },
        { text: 'OK', onPress: () => this.deletePicture(uri) },
      ],
      { cancelable: false }
    )
  }

  deletePicture = async (uri) => {
    const key = await uri.substring(uri.indexOf('2F') + 2)
    const pictureObject = await this.state.pictures.filter(photo => photo.file.key === key)
    const pictureId = await pictureObject[0].id
    try {
      await this.props.onRemovePicture({ id: pictureId })
      await this.removeImageFromS3(key)
      this.setState(prevState => ({
        allPicsURIs: prevState.allPicsURIs.filter(item => item !== uri)
      }))
      await this.listPosts()
      Alert.alert(
        'Success',
        'Your picture was removed from the contest.',
        [
          { text: 'Done', onPress: () => this.componentDidMount() },
        ],
        { cancelable: false }
      )
    } catch (err) {
      console.log('Error deleting post.', err)
    }
  }

  removeImageFromS3 = async (key) => {
    await Storage.remove(key)
      .then(result => console.log('Picture deleted', result))
      .catch(err => console.log(err))
  }

  // Give Expo access to device library
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL)
  }

  // Two methods to create/delete likes for posts
  toggleLikePost = async (post) => {
    const loggedInUser = await this.state.postOwnerId
    const likeUserObject = await post.likes.items.filter(
      obj => obj.likeOwnerId === loggedInUser
    )
    if (likeUserObject.length !== 0) {
      await this.deleteLikePost(likeUserObject)
      return
    }
    await this.createLikePost(post)
  }

  createLikePost = async (post) => {
    const postId = await post['id']
    const like = {
      id: postId,
      likeOwnerId: this.state.likeOwnerId,
      likeOwnerUsername: this.state.likeOwnerUsername,
    }
    try {
      await API.graphql(graphqlOperation(CreateLikePost, like))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error creating like.', err)
    }
  }

  // Two methods to create/delete likes for pictures
  toggleLikePicture = async (uri) => {
    const key = await uri.substring(uri.indexOf('2F') + 2)
    const pictureObject = await this.state.pictures.filter(photo => photo.file.key === key)
    const loggedInUser = await this.state.postOwnerId
    const likeUserObject = await pictureObject[0].likes.items.filter(
      obj => obj.likeOwnerId === loggedInUser
    )
    if (likeUserObject.length !== 0) {
      await this.deleteLikePost(likeUserObject)
      return
    }
    await this.createLikePicture(uri)
  }

  createLikePicture = async (uri) => {
    const key = await uri.substring(uri.indexOf('2F') + 2)
    const pictureObject = await this.state.pictures.filter(photo => photo.file.key === key)
    const pictureId = await pictureObject[0].id
    const like = {
      id: pictureId,
      likeOwnerId: this.state.likeOwnerId,
      likeOwnerUsername: this.state.likeOwnerUsername,
    }
    try {
      await API.graphql(graphqlOperation(CreateLikePicture, like))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error creating like.', err)
    }
  }

  // Delete likes. Works for both posts and pictures
  deleteLikePost = async (likeUserObject) => {
    const likeId = await likeUserObject[0]['id']
    try {
      await API.graphql(graphqlOperation(DeleteLikePost, { id: likeId }))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error deleting like.', err)
    }
  }

  render() {
    let loggedInUser = this.state.postOwnerId
    let uris = this.state.pictures.map(picture => picture.file.uri)
    let { posts, pictures, allPicsURIs, postContent, modalVisible, refreshing, optionsVisible } = this.state
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerStyle}>
          {/* Header */}
          <Header
            showModal={this.showModal}
            accessDevice={this.createPicture}
            refresh={this.componentDidMount}
          />
          {/* Open Modal component to write a post */}
          <ModalPosts
            modalVisible={modalVisible}
            postContent={postContent}
            hideModal={this.hideModal}
            createPost={this.createPost}
            onChangeText={val => this.onChangeText('postContent', val)}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {/* Pictures component */}
          {
            uris.map((uri, index) => (
              <PictureCard
                key={index}
                uri={uri}
                pictures={pictures}
                user={loggedInUser}
                optionsPicture={() => this.optionsPicture(uri)}
                toggleLikePicture={() => this.toggleLikePicture(uri)}
              />
            ))
          }
          {/* Renders only for Android */}
          {
            Platform.OS === 'android' &&
            allPicsURIs.map((uri, index) => (
              <OptionsAndroid
                key={index}
                options={optionsVisible}
                flag={() => this.createFlagPictureAlert(uri)}
                remove={() => this.deletePictureAlert(uri)}
                close={this.hideOptions}
              />
            ))
          }
          {/* Posts component */}
          {
            posts.map((post, index) => (
              <PostCard
                key={index}
                post={post}
                user={loggedInUser}
                deletePostAlert={() => this.deletePostAlert(post)}
                toggleLikePost={() => this.toggleLikePost(post)}
              />
            ))
          }
        </ScrollView>
      </View>
    )
  }
}

// Decorate our Feed component with the Apollo mutations.
const ApolloWrapper = compose(
  graphql(CreatePicture, {
    props: (props) => ({
      onAddPicture: (picture) => {
        props.mutate({
          variables: { input: picture },
          optimisticResponse: () => ({
            createPicture: {
              ...picture,
              __typename: 'Picture',
              file: { ...picture.file, __typename: 'S3Object' }
            }
          }),
        })
      }
    }),
  }),
  graphql(DeletePicture, {
    props: (props) => ({
      onRemovePicture: (picture) => {
        props.mutate({
          variables: { input: picture },
          optimisticResponse: () => ({
            deletePicture: { ...picture, __typename: 'Picture' }
          }),
        })
      }
    }),
  }),
)(Feed)

export default ApolloWrapper

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerStyle: {
    padding: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
