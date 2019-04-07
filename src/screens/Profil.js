import React from 'react';
import { Text, View, Image, Icon } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import UploadedScreen from './Uploaded';
import SavedMemeScreen from './SavedMemes';



const TabNavigator = createBottomTabNavigator(
  {
  Uploaded: {
    screen: UploadedScreen,
    navigationOptions: {
      tabBarLabel: "Uploaded",
      tabBarIcon: ({focused, tintColor}) => (
        focused ?
         <Image style={{height: 30, width: 30, marginTop: 5}} source={require('../assets/box.png')}/>
         :
        <Image style={{height: 30, width: 30, marginTop: 5}} source={require('../assets/box-gray.png')}/>
      ),
    }
  },
  Saved: {
    screen: SavedMemeScreen,
    navigationOptions: {
      tabBarLabel: "Saved",
      tabBarIcon: ({focused, tintColor}) => (
        focused ?
        <Image style={{height: 30, width: 30, marginTop: 5}} source={require('../assets/safebox.png')}/>
        :
        <Image style={{height: 30, width: 30, marginTop: 5}} source={require('../assets/safebox-gray.png')}/>
      )
    }
  },
}, {
  tabBarOptions: {
    activeTintColor: 'white',
    inactiveTintColor: '#9fa8da',
    activeBackgroundColor: '#9fa8da',
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

export default createAppContainer(TabNavigator);
