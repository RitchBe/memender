/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import SInfo from "react-native-sensitive-info";
import { NavigationActions, StackActions } from "react-navigation";


import Root from './Root';
import Drawer from './src/components/Drawer';


const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID
});

export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Home",
    };
  };
  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
      <View>

      </View>
      <Drawer>
      <Root/>
    </Drawer>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
})
