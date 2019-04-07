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
import DeviceInfo from "react-native-device-info";

import RNRestart from "react-native-restart";
import { NavigationActions, StackActions } from "react-navigation";

import {connect, Provider} from 'react-redux';
import { createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk'
import {reducer} from './src/reducers/reducer';

const store = createStore(reducer, applyMiddleware(thunk));
const RouterWithRedux = connect()(MainNav)


import MainNav from './src/navigation/MainNav';


import {checkUser} from './src/utils/utils'


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

  state = {
    isLoggedIn: true,
  }



  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
      <View>

      </View>
      <Provider store={store}>
        <MainNav/>
      </Provider>
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
