import React, {Component} from 'react';
import {Button, View, ScrollView, Text} from 'react-native';
import {StackNavigator, createStackNavigator, createAppContainer, createDrawerNavigator} from "react-navigation";

import LoginScreen from '../screens/Login';
import ProfilScreen from '../screens/Profil';
import HomeScreen from '../screens/Home';
import CustomDrawer from '../components/CustomDrawer';


import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import {connect, Provider} from 'react-redux';

import {checkUser} from '../utils/utils'
import { DrawerItems, SafeAreaView } from 'react-navigation';


const Drawer = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Profil: {
      screen: ProfilScreen
    },

  },
  {
    initialRouteName: "Home",
    contentComponent: props =>
      <CustomDrawer {...props} />
  }
);



export default createAppContainer(Drawer)
