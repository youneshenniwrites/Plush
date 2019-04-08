import React from "react"
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native"

import { Card, Text } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import LikePictureButton from './LikePictureButton'

const PictureCard = ({ pictures, uri, user, toggleLikePicture, optionsPicture } = props) => (
  <Card style={styles.cardStyle}>
    {/* Logged in user flagged this picture */}
    {
      pictures.filter(
        pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
      )[0].flags.items.length !== 0 &&
      pictures.filter(
        pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
      )[0].flags.items.filter(obj => obj.flagOwnerId === user).length === 1 &&
      <Text style={[styles.postUsername, { padding: 10 }]}>Content removed.</Text>
    }
    {/* Logged in user did not flag this picture */}
    {
      pictures.filter(
        pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
      )[0].flags.items.length !== 0 &&
      pictures.filter(
        pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
      )[0].flags.items.filter(obj => obj.flagOwnerId === user).length === 0 &&
      <Image style={styles.image} source={{ uri: uri }} />
    }
    {/* Picture has no flags */}
    {
      pictures.filter(
        pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
      )[0].flags.items.length === 0 &&
      <Image style={styles.image} source={{ uri: uri }} />
    }
    <View style={styles.cardFooterStyle}>
      <TouchableOpacity onPress={optionsPicture}>
        <Ionicons
          style={{ color: '#1f267e', fontSize: 45, marginLeft: 10 }}
          name="md-more"
        />
      </TouchableOpacity>
      {/* Show username of picture owner */}
      <Text style={styles.postUsername}>
        {
          pictures.filter(
            pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
          )[0].pictureOwnerUsername
        }
      </Text>
      {/* Logged in user liked this picture */}
      {
        pictures.filter(
          pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
        )[0].likes.items.length !== 0 &&
        pictures.filter(
          pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
        )[0].likes.items.filter(obj => obj.likeOwnerId === user).length === 1 &&
        <LikePictureButton color='#FB7777' toggleLikePicture={toggleLikePicture} />
      }
      {/* Logged in user did not like this picture */}
      {
        pictures.filter(
          pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
        )[0].likes.items.length !== 0 &&
        pictures.filter(
          pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
        )[0].likes.items.filter(obj => obj.likeOwnerId === user).length === 0 &&
        <LikePictureButton color='#69FB' toggleLikePicture={toggleLikePicture} />
      }
      {/* Picture has no likes */}
      {
        pictures.filter(
          pic => pic.file.key === uri.substring(uri.indexOf('public/') + 7)
        )[0].likes.items.length === 0 &&
        <LikePictureButton color='#69FB' toggleLikePicture={toggleLikePicture} />
      }
    </View>
  </Card >
)

export default PictureCard

let width = Dimensions.get('window').width

const styles = StyleSheet.create({
  cardStyle: {
    flex: 1,
    backgroundColor: '#d0d9ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  image: {
    width: width,
    height: width,
    marginBottom: 24
  },
  cardFooterStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  postUsername: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#1f267e'
  },
})
