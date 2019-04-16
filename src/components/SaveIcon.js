import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import RNFetchBlob from 'react-native-fetch-blob';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';




export default class SaveIcon extends Component {
  state= {
    checked: false
  }

  saveButton = (meme) => {
    this.setState({checked: true})
      //saving inside Picture folder
      console.log('saving')
      console.log(meme)
      if (Platform.OS === "android") {
        const PictureDir = RNFetchBlob.fs.dirs.PictureDir;
        RNFetchBlob.fetch('GET', meme.url )
          .then((response) => {
            let base64Str = response.data;
            let imageLocation = PictureDir+'/'+meme._id+'.png';
            RNFetchBlob.fs.writeFile(imageLocation, base64Str, 'base64')
              .then((res) => {
                console.log(res)
              })
              .catch((err) => {
                console.log(err)
              })
            RNFetchBlob.fs.scanFile([{path: imageLocation, mime: 'png'}])
            .then(() => {
              console.log("scan sucess")
            })
          }).catch((error) => {
            console.log(error)
          })
      } else if (Platform.OS === 'ios') {
        console.log('saving on ios')
      }

      //save in savedMemes Array
      fetch('http://192.168.0.19:3000/api/users/' + this.props.userSub + '/savedmemes', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': "application/json",
          'authorization': this.props.userSub,
        }),
        cache: 'default',
        body: JSON.stringify({
          userSub: this.props.userSub,
          memeId: meme._id,
          url: meme.url,
          date: new Date(meme.date)
        })
      })
      .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
      .then(response => {
        if (!response || response.status !== 200) {
          throw new Error(response.json.message)
        }
      })
    }

  render() {
    let saveIcon;
    if (this.state.checked === false) {
      saveIcon = <Icon name="star" size={20} color='#E8EAF6' backgroundColor='rgba(0,0,0,0)' style={styles.icon}/>
    } else {
      saveIcon = <Icon name="star" size={20} color='#f9ca24' backgroundColor='rgba(0,0,0,0)' style={styles.icon}/>
    }
    return(
      <View style={styles.saveContainer}>
        <TouchableOpacity onPress={() => {this.saveButton(this.props.meme)}}>
        {saveIcon}
        </TouchableOpacity>
      </View>
    )

  }
}


const styles = StyleSheet.create({
  saveContainer: {
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: wp('80%')
  },
  icon: {
    padding: 8
  }
})
