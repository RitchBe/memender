import React from "react";
import {StackNavigator, createStackNavigator,createAppContainer, createDrawerNavigator} from "react-navigation";

import LoginScreen from '../screens/Login';
import UploadedScreen from '../screens/Uploaded';
import HomeScreen from '../screens/Home';

const Stack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    }
  },
  {
  initialRouteName: "Login",
  headerMode: 'none'
  }
);


export default createAppContainer(Stack);
