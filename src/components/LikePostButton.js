import React from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native"

import { Ionicons } from '@expo/vector-icons'

const LikePostButton = ({ toggleLikePost, color } = props) => (
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
export default LikePostButton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
})