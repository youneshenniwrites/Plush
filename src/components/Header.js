import React from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native"

import { Ionicons } from '@expo/vector-icons'

const Header = (props) => (
  <View style={styles.headerStyle}>
    <TouchableOpacity onPress={props.accessDevice}>
      <Ionicons style={styles.iconStyle} name="ios-camera" />
    </TouchableOpacity>
    <TouchableOpacity onPress={props.refresh}>
      <Ionicons style={styles.iconStyle} name="ios-refresh" />
    </TouchableOpacity>
  </View>
)
export default Header

const styles = StyleSheet.create({
  iconStyle: {
    color: '#5017ae',
    fontSize: 38
  },
  headerStyle: {
    flex: 1,
    padding: 5,
    marginTop: 30,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})