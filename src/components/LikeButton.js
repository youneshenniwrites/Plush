import React from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native"

import { Ionicons } from '@expo/vector-icons'

const LikeButton = ({ toggleLikePost, color } = props) => (
  <View style={styles.container}>
    <TouchableOpacity
      onPress={toggleLikePost}>
      <Ionicons
        name='md-heart'
        style={{ fontSize: 45, color: color }}
      />
    </TouchableOpacity>
  </View>
)
export default LikeButton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
})