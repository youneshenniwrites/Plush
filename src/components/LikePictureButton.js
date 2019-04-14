import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native"

import { Ionicons } from '@expo/vector-icons'

const LikePictureButton = ({ toggleLikePicture, color, name, likes, uri } = props) => (
  <View style={styles.container}>
    <TouchableOpacity
      onPress={toggleLikePicture}>
      <Ionicons
        name={name}
        style={{ fontSize: 45, color: color }}
      />
    </TouchableOpacity>
    {/* Show number of likes. Example: 1 likes , 2 likes */}
    {
      (likes.filter(pic => pic.file.uri === uri)[0].likes.items.length !== 1) ?
        <Text style={styles.manyLikes}>
          {likes.filter(pic => pic.file.uri === uri)[0].likes.items.length} likes
        </Text> :
        <Text style={styles.oneLike}>
          {likes.filter(pic => pic.file.uri === uri)[0].likes.items.length} like
        </Text>
    }
  </View>
)
export default LikePictureButton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 5,
    flexDirection: 'row'
  },
  oneLike: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 30,
    color: '#5017AE'
  },
  manyLikes: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#5017AE'
  },
})