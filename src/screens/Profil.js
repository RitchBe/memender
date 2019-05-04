import React from 'react';
import { Text, View, Image, Icon, StyleSheet } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import UploadedScreen from './Uploaded';
import SavedMemeScreen from './SavedMemes';
import {mainColor, mainColor2, details} from '../utils/colors'




const TabNavigator = createBottomTabNavigator(
  {
  Uploaded: {
    screen: UploadedScreen,
    navigationOptions: {
      tabBarLabel: "Uploaded",
      tabBarIcon: ({focused, tintColor}) => (
        focused ?
        <Text style={[styles.label, styles.labelFocused]}>Uploaded</Text>
         :
        <Text style={[styles.label, styles.labelNotFocused]}>Uploaded</Text>

      ),
    }
  },
  Saved: {
    screen: SavedMemeScreen,
    navigationOptions: {
      tabBarLabel: "Gallery",
      tabBarIcon: ({focused, tintColor}) => (
        focused ?
        <Text style={[styles.label, styles.labelFocused]}>Gallery</Text>
        :
        <Text style={[styles.label, styles.labelNotFocused]}>Gallery</Text>

      )
    }
  },
}, {
  tabBarOptions: {
    activeTintColor: 'white',
    inactiveTintColor: mainColor2,
    activeBackgroundColor: mainColor2,
    showLabel: false,
    style: {
      height: 55,
    },
    labelStyle: {
      fontSize: 10,
      fontWeight: 'bold'
    }

  }
}
);
const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  labelFocused: {
    color: 'white'
  },
  labelNotFocused: {
    color: mainColor2
  }
})
export default createAppContainer(TabNavigator);
