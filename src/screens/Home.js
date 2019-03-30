import React, { Component } from 'react';
import { Text, View, Button, Platform, StyleSheet, TouchableOpacity, Image, FlatList, Share } from 'react-native';
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import Auth0 from "react-native-auth0";

export default class Home extends Component {

  state = {
    memes: []
  }
  logToken = () => {
    SInfo.getItem('accessToken', {}).then(accessToken => {
      return accessToken
    })
  }

  componentDidMount() {
    fetch('http://192.168.0.19:3000/api/memes/', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-auth': this.logToken()
      }),
      cache: 'default'
    })
    .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
    .then(response => {
      if (!response || response.status !== 200){
        throw new Error(response.json.message)
      }
      console.log('i am the response')
      console.log(response)
    })
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home</Text>
        <Button onPress={this.logToken} title="Log" />
      </View>
    );
  }
}
