import React from "react"
import {
  View,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native"

import { Card, Text } from 'native-base'

const ModalPosts = (props) => (
  <Modal
    animationType="slide"
    transparent={false}
    onRequestClose={() => { return }}
    visible={props.modalVisible}>
    <View style={styles.modalContainer}>
      <View style={styles.postCardStyle}>
        <Card>
          <TextInput
            onChangeText={props.onChangeText}
            placeholder="Tell us your best..."
            value={props.postContent}
            multiline={true}
            maxLength={150}
            autoFocus={true} // check for performance issue when true
            style={{ height: 150, fontSize: 20, padding: 13 }}
          />
          <View style={{ alignItems: 'flex-end', padding: 5 }}>
            <Text style={{ color: '#fb7777', fontWeight: 'bold' }}>
              {150 - props.postContent.length}
            </Text>
          </View>
        </Card>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={props.hideModal}
            style={[styles.twinButtonStyle, { backgroundColor: '#5017AE' }]}>
            <Text style={styles.buttonText}>
              Cancel
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.createPost}
            style={[styles.twinButtonStyle, { backgroundColor: '#f16f69' }]}>
            <Text style={styles.buttonText}>
              Submit
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)
export default ModalPosts

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#eadee4'
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  twinButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 3,
    width: 130,
    height: 48,
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff",
  },
  postCardStyle: {
    marginTop: 45,
    padding: 20
  },
})
