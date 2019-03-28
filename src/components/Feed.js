import React from 'react'
import {
  View,
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native'

// Amplify
import API, { graphqlOperation } from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Amplify from '@aws-amplify/core'
import Storage from '@aws-amplify/storage'

// Third party libs
import { RNS3 } from 'react-native-aws3'; // for sending pics to S3
import { ImagePicker, Permissions } from 'expo'
import { v4 as uuid } from 'uuid';

// Local components
import Header from './Header';
import PostCard from './PostCard'
import ModalPosts from './ModalPosts'
import config from '../aws-exports'
import keys from '../keys'

// GraphQL components
import CreatePost from '../graphQL/CreatePost'
import CreatePicture from '../graphQL/CreatePicture'
// import DeletePicture from '../graphQL/DeletePicture'
import CreateLike from '../graphQL/CreateLike'
import DeleteLike from '../graphQL/DeleteLike'
import DeletePost from '../graphQL/DeletePost'
import listPosts from '../graphQL/listPosts'
import listPictures from '../graphQL/listPictures'

// Apollo components
import { graphql, compose } from 'react-apollo'

Amplify.configure(config)

class Feed extends React.Component {
  state = {
    modalVisible: false,
    posts: [],
    pictures: [],
    allPicsURIs: [],
    postOwnerId: '',
    likeOwnerId: '',
    postContent: '',
    postOwnerUsername: '',
    likeOwnerUsername: '',
    image: null,
  }


  componentDidMount = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState(
          {
            postOwnerUsername: user.username,
            likeOwnerUsername: user.username,
            postOwnerId: user.attributes.sub,
            likeOwnerId: user.attributes.sub,
          }
        )
      })
      .catch(err => console.log(err))
    await this.listPosts()
    await this.allPicsURIs()
    // console.log('List of posts: ', this.state.posts)
    // console.log('List of pictures: ', this.state.pictures)
  }

  // Modal posts methods
  showModal = () => {
    this.setState({ modalVisible: true })
  }

  hideModal = () => {
    this.setState({ modalVisible: false, postContent: '' })
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    this.componentDidMount()
      .then(() => {
        this.setState({ refreshing: false })
      })
  }

  listPosts = async () => {
    try {
      const postsData = await API.graphql(graphqlOperation(listPosts))
      const picturesData = await API.graphql(graphqlOperation(listPictures))
      const listOfAllposts = await postsData.data.listPosts.items
      const listOfAllpictures = await picturesData.data.listPictures.items
      this.setState({ posts: listOfAllposts, pictures: listOfAllpictures })
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

  // Get pictures from device then upload them to AWS S3 and store their records in DynamobDB
  createPicture = async () => {
    await this.askPermissionsAsync()
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync(
      {
        allowsEditing: false,
      }
    )
    if (!cancelled) {
      this.setState({ image: uri })
      await this.uploadToS3AndRecordInDynamodb(this.state.image)
      await this.componentDidMount()
    }
  }

  // Give Expo access to device library
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL)
  }

  uploadToS3AndRecordInDynamodb = async (uri) => {
    const { bucket, region } = this.props.options
    let picture = {
      uri: uri,
      name: uuid(),
      type: "image/jpeg",
      bucket,
      region,
    }
    const config = {
      keyPrefix: "images/public/",
      bucket,
      region,
      accessKey: keys.accessKey,
      secretKey: keys.secretKey,
      successActionStatus: 201
    }
    const folder = 'images'
    const visibility = 'public'
    RNS3.put(picture, config)
      .then(response => {
        if (response.status !== 201) {
          throw new Error("Failed to upload image to S3");
        } else {
          console.log('The following file has been uploaded to AWS S3:', response)
          const { type: mimeType } = response;
          const key = `${folder}/${visibility}/${picture.name}`;
          const file = {
            bucket,
            region,
            key,
            mimeType
          }
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
		Perform a get call with Storage API to retrieve the URI of each picture.
		We then store all uris in the state to be called in the render method.
		*/
    let access = { level: 'public' }
    this.state.pictures.map((picture, index) => {
      let key = picture.file.key
      Storage.get(key, access)
        .then((response) => {
          // Extract uri from response
          let uriPartOne = response.substring(0, response.indexOf('public/'))
          let uriPartTwo = response.substring(response.indexOf('images/'), response.indexOf('?'))
          let uri = uriPartOne + uriPartTwo
          if (this.state.allPicsURIs.includes(uri)) {
            console.log('KO')
            return
          } else {
            console.log('OK')
            this.setState(prevState => ({
              allPicsURIs: [...prevState.allPicsURIs, uri]
            }))
          }
        })
        .catch(err => console.log(err))
    })
  }

  toggleLikePost = async (post) => {
    const loggedInUser = await this.state.postOwnerId
    const likeUserObject = await post.likes.items.filter(
      obj => obj.likeOwnerId === loggedInUser
    )
    if (likeUserObject.length !== 0) {
      await this.deleteLike(likeUserObject)
      return
    }
    await this.createLike(post)
  }

  createLike = async (post) => {
    const postId = await post['id']
    const like = {
      likeOwnerId: this.state.likeOwnerId,
      likeOwnerUsername: this.state.likeOwnerUsername,
      id: postId,
    }
    try {
      await API.graphql(graphqlOperation(CreateLike, like))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error creating like.', err)
    }
  }

  deleteLike = async (likeUserObject) => {
    const likeId = await likeUserObject[0]['id']
    try {
      await API.graphql(graphqlOperation(DeleteLike, { id: likeId }))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error deleting like.', err)
    }
  }

  render() {
    let loggedInUser = this.state.postOwnerId
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
            modalVisible={this.state.modalVisible}
            postContent={this.state.postContent}
            hideModal={this.hideModal}
            createPost={this.createPost}
            onChangeText={val => this.onChangeText('postContent', val)}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            {/* Posts */}
            {
              this.state.posts.map((post, index) => (
                <PostCard
                  key={index}
                  post={post}
                  user={loggedInUser}
                  deletePostAlert={() => this.deletePostAlert(post)}
                  toggleLikePost={() => this.toggleLikePost(post)}
                />
              ))
            }
            {/* Pictures */}
            {
              this.state.allPicsURIs.map((uri, index) => (
                <Image key={index} style={styles.image} source={{ uri: uri }} />
              ))
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

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
  // graphql(DeletePicture, {
  //   props: (props) => ({
  //     onRemovePost: (picture) => {
  //       props.mutate({
  //         variables: picture,
  //         optimisticResponse: () => ({
  //           deletePost: { ...picture, __typename: 'Picture' }
  //         }),
  //       })
  //     }
  //   }),
  // }),
)(Feed)

export default ApolloWrapper

let width = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStyle: {
    padding: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: width,
    height: width,
    marginBottom: 24
  },
})
