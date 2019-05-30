import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import {connect} from 'react-redux';
import { NavigationActions, StackActions } from "react-navigation";
import RNRestart from "react-native-restart";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Octicons';
import LinearGradient from "react-native-linear-gradient";
import {mainColor, mainColor2, details} from '../utils/colors'


class CustomDrawer extends Component {
  componentDidMount() {
    console.log('the props')
    console.log(this.props)
  }
  render() {
    return (
      <View>
        {this.props[0]}
      </View>
    )
  }

}


export default CustomDrawer
