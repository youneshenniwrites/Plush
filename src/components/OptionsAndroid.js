import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet
} from "react-native";

const OptionsAndroid = ({ user, pictures, uri, options, flag, remove, close } = props) => (
  <Modal
    animationType="slide"
    transparent={true}
    onRequestClose={() => !options}
    visible={options}>
    <View style={styles.modalContainer}>
      <View style={styles.pictureCardStyle}>
        {/* Report inappropriate content */}
        <TouchableOpacity
          onPress={flag}
          style={[styles.twinButtonStyle, { backgroundColor: '#f16f69' }]}>
          <Text style={styles.buttonText}>
            Report
          </Text>
        </TouchableOpacity>
        {/* Remove picture */}
        {
          pictures.filter(pic => pic.file.uri === uri)[0].pictureOwnerId === user &&
          <TouchableOpacity
            onPress={remove}
            style={[styles.twinButtonStyle, { backgroundColor: '#f16f69' }]}>
            <Text style={styles.buttonText}>
              Remove
            </Text>
          </TouchableOpacity>
        }
        {/* Close options modal */}
        <TouchableOpacity
          onPress={close}
          style={[styles.twinButtonStyle, { backgroundColor: '#5017AE' }]}>
          <Text style={styles.buttonText}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)
export default OptionsAndroid

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  twinButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 3,
    padding: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff",
  },
  pictureCardStyle: {
    marginTop: 45,
    padding: 20
  },
})