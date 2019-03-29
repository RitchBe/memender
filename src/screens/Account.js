import React, { Component } from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";

import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import SInfo from "react-native-sensitive-info";

const auth0 = new Auth0({
 domain: Config.AUTH0_DOMAIN,
 clientId: Config.AUTH0_CLIENT_ID
});

export default class Account extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Account",
    };
  };

  // next: add code for rendering the component
  render() {
   const { navigation } = this.props;
   const name = navigation.getParam("name");
   const picture = navigation.getParam("picture");

   return (
     <View style={styles.container}>
       {name && (
         <View style={styles.profileContainer}>
           <Image style={styles.picture} source={{ uri: picture }} />

           <Text style={styles.usernameText}>{name}</Text>
           <Button onPress={this.logout} title="Logout" color='pink' />
         </View>
       )}
     </View>
   );
 }

 logout = () => {
  SInfo.deleteItem("accessToken", {});
  SInfo.deleteItem("refreshToken", {});

  auth0.webAuth
    .clearSession()
    .then(res => {
      console.log("clear session ok");
    })
    .catch(err => {
      console.log("error clearing session: ", err);
    });

  this.gotoLogin(); // go to login screen
};
gotoLogin = () => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: "Login"
      })
    ]
  });

  this.props.navigation.dispatch(resetAction);
};

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  profileContainer: {
    alignItems: "center"
  },
  usernameText: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  picture: {
    width: 50,
    height: 50
  }
})
