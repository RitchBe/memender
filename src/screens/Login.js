import React, { Component } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import RNRestart from "react-native-restart";


const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID
});

export default class Login extends Component {
  static navigationOptions = ({navigation}) => {
    headerTitle: "Login"
  }

  state = {
    hasInitialized: false
  };

  componentDidMount() {
    SInfo.getItem("accessToken", {}).then(accessToken => {
      if (accessToken) {
        console.log('i am the token')
        console.log(accessToken)
        auth0.auth
          .userInfo({token: accessToken})
          .then(data => {
            this.gotoAccount(data);
            console.log(data)
          })
          .catch(err => {
            SInfo.getItem("refreshToken", {}).then(refreshToken => {
              auth0.auth
                .refreshToken({refreshToken: refreshToken})
                .then(newAccessToken => {
                  SInfo.setItem('accessToken', newAccessToken);
                  RNRestart.Restart();
                })
                .catch(accessTokenErr => {
                  this.login()
                  console.log("error getting new accessToken: ", accessTokenErr)
                })
            })
          })
      } else {
        this.setState({
          hasInitialized: true
        });
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#05a5d1"
          animation={!this.state.hasInitialized}
        />
        {this.state.hasInitialized && (
          <Button onPress={this.login} title="Login" color='pink'/>
        )}
      </View>
    )
  }

  login = () => {
    auth0.webAuth
      .authorize({
        scope: Config.AUTHO_SCOPE,
        audience: Config.AUTH0_AUDIENCE,
        device: DeviceInfo.getUniqueID(),
        prompt: "login"
      })
      .then(res => {
        console.log(' i am tje res')
        console.log(res)
        auth0.auth
          .userInfo({token: res.accessToken})
          .then(data => {
            this.createUser(data);
            this.gotoAccount(data);
            console.log(data)

          })
          .catch(err => {
            console.log("err: ");
            console.log(JSON.stringify(err));
          });

        SInfo.setItem("accessToken", res.accessToken, {});
        SInfo.setItem("refreshToken", res.refreshToken, {});

      })
      .catch(error => {
        console.log("Error while trying to authenticate", error);
      });
  };

  gotoAccount = data => {
    this.setState({
      hasInitialized: true
    });

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "Home",
          params: {
            name: data.name,
            picture: data.picture
          }
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  createUser = data => {
    console.log('hi from createuser')
    fetch('http://192.168.0.19:3000/api/users', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      cache: 'default',
      body: JSON.stringify({
        userSub: data.sub,
        nickname: data.nickname,
        picture: data.picture,

      })
    })
    .then( r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
    .then(response => {
      if (!response.ok || response.status !== 201){
        throw new Error(response.json.message)
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

}

const styles = StyleSheet.create({

})
