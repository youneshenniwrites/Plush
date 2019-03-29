import React from "react"
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native"

import { Card, Text } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import LikeButton from './LikeButton'

const PictureCard = ({ picture, user, toggleLikePost, deletePostAlert } = props) => (
  <Card style={styles.cardStyle}>
    <Image key={index} style={styles.image} source={{ uri: uri }} />
    <LikeButton color='#69FB' toggleLikePost={toggleLikePost} />
  </Card>
)

export default PictureCard

const styles = StyleSheet.create({
  cardStyle: {
    flex: 1,
    backgroundColor: '#d0d9ed',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooterStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  postUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f267e'
  },
  postBody: {
    fontSize: 20,
    color: '#1f267e',
    padding: 12
  },
})
