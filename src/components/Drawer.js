import React, {Component} from 'react';
import {Button, View} from 'react-native';
import {StackNavigator, createStackNavigator, createAppContainer, createDrawerNavigator} from "react-navigation";

import LoginScreen from '../screens/Login';
import AccountScreen from '../screens/Account';
import HomeScreen from '../screens/Home';

import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";



const Drawer = createDrawerNavigator(
  {
    Account: {
      screen: AccountScreen
    },
    Home: {
      screen: HomeScreen
    },
    Login: {
      screen: LoginScreen
    }
  }
);

export default createAppContainer(Drawer)
