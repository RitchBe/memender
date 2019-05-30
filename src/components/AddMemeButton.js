import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import * as cloudinary from 'cloudinary-core';
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import DropdownAlert from 'react-native-dropdownalert';
import {connect} from 'react-redux';




class AddMemeButton extends Component {

  addMeme = () => {
    var options ={
      title: "Select Meme",
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.openPicker({
      width: 700,
      height: 900,
      avoidEmptySpaceAroundImage: false,
      cropping: false,
      includeBase64: true,
    }).then(image => {
      let source = {uri: image.path};
      this.setState({
        uploadingImg: true,
      });
      uploadFile(image)
      .then(image => image.json())
      .then(result => {
        console.log('result:')
        console.log(result)
        this.onMemeCreation(result);
        this.setState({
          uploadingImg: false
        })
      })
    })
  }

  onMemeCreation = result => {
    console.log('i am the url')
    console.log(result)
    SInfo.getItem('accessToken', {}).then(accessToken => {
      if (accessToken) {
            fetch('http://192.168.1.108:3000/api/memes/', {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'authorization': accessToken,
              }),
              cache: 'default',
              body: JSON.stringify({
                url: result.secure_url,
                userSub: this.props.userSub
              })
            })
            .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
            .then(response => {
              if (!response || response.status !== 201) {
                this.dropdown.alertWithType('error', 'Error', 'Error while updating the meme.')
                throw new Error(response.json.message)
            }
            this.dropdown.alertWithType('success', 'Success', 'Meme Updated')


        })
      }
    })
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity  style={styles.btnContainer} onPress={this.addMeme}>
        <Image source={require('../assets/addMeme.png')} style={styles.button} />
      </TouchableOpacity>
      <DropdownAlert style={{position: 'absolute'}} ref={ref => this.dropdown = ref} />

      </View>
    );
  }
}

function uploadFile(file) {
  console.log(file)
  console.log(file.path)
  console.log(file.modificationDate)

    const YOUR_CLOUDINARY_NAME = Config.CLOUDINARY_NAME;
    const YOUR_CLOUDINARY_PRESET = Config.CLOUDINARY_PRESET;
    return RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/' + YOUR_CLOUDINARY_NAME + '/image/upload?upload_preset=' + YOUR_CLOUDINARY_PRESET, {
        'Content-Type': 'multipart/form-data',
    }, [
            { name: 'file', filename: file.modificationDate, data: file.data }
        ])
}

function mapStateToProps(state){
  return {
    userSub: state.userSub
  }
}
export default connect(mapStateToProps)(AddMemeButton)



const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80
  },
  btnContainer: {
    marginBottom: 30
  }
})
