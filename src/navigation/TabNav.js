import React, {Component} from 'react';
import {Button, View, ScrollView, Text, Image} from 'react-native';
import {StackNavigator, createStackNavigator, createAppContainer, createDrawerNavigator} from "react-navigation";


import LoginScreen from '../screens/Login';
import ProfilScreen from '../screens/Profil';
import HomeScreen from '../screens/Home';
import Info from '../screens/Info';
import CustomTabNav from '../components/CustomTabNav';
import SavedMemes from '../screens/SavedMemes'
import Following from '../screens/Following'
import AddMemeButton from '../components/AddMemeButton'

import HomeDrawer from '../screens/HomeDrawer';

import Drawer from './Drawer'


import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import {connect, Provider} from 'react-redux';

import {checkUser} from '../utils/utils'
import { createBottomTabNavigator, SafeAreaView } from 'react-navigation';


const TabNav = createBottomTabNavigator(
  {
    Home: {
      screen: HomeDrawer,
      navigationOptions: ({navigation}) => ({
        tabBarIcon: ({tintColor, focused}) => (
          focused ?
            <Image source={require('../assets/homeFocused.png')} style={{width: 20, height: 20}} />
            :
            <Image source={require('../assets/home.png')} style={{width: 20, height: 20}} />
        )
      })
    },
    Profil: {
      screen: ProfilScreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor, focused}) => (
          focused ?
            <Image source={require('../assets/userFocused.png')} style={{width: 20, height: 20}} />
            :
            <Image source={require('../assets/user.png')} style={{width: 20, height: 20}} />
        )
      })
    },
    Adding: {
      screen: () => null,
      navigationOptions: () => ({
        tabBarIcon: <AddMemeButton />
      })
    },
    Saved: {
      screen: SavedMemes,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor, focused}) => (
          focused ?
            <Image source={require('../assets/savedFocused.png')} style={{width: 20, height: 20}} />
            :
            <Image source={require('../assets/saved.png')} style={{width: 20, height: 20}} />
        )
      })
    },
    Following: {
      screen: Following,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor, focused}) => (
          focused ?
            <Image source={require('../assets/searchFocused.png')} style={{width: 20, height: 20}} />
            :
            <Image source={require('../assets/search.png')} style={{width: 20, height: 20}} />
        )
      })
    },
    Info: {
      screen: Info,
      navigationOptions: () => ({
        tabBarButtonComponent: () => (
          null
        )
      })
    }
  }, {
    tabBarOptions: {
      showLabel: false,
      style: {
        borderTopColor: 'transparent'
      }
    },
  }
);



export default createAppContainer(TabNav)
