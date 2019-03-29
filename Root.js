import React from "react";
import {StackNavigator, createStackNavigator,createAppContainer} from "react-navigation";

import LoginScreen from './src/screens/Login';
import AccountScreen from './src/screens/Account';

const Stack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Account: {
      screen: AccountScreen
    }
  },
  {
  initialRouteName: "Login"
  }
);

export default createAppContainer(Stack);
