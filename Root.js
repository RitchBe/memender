import React from "react";
import {StackNavigator, createStackNavigator,createAppContainer, createDrawerNavigator} from "react-navigation";

import LoginScreen from './src/screens/Login';
import AccountScreen from './src/screens/Account';
import HomeScreen from './src/screens/Home';

const Stack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Account: {
      screen: AccountScreen
    },
    Home: {
      screen: HomeScreen
    }
  },
  {
  initialRouteName: "Login"
  }
);

// export default createDrawerNavigator(Stack);
export default createAppContainer(Stack);
