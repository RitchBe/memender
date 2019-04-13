import React, { Component } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import RNRestart from "react-native-restart";
import {connect} from 'react-redux';


const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID
});

class Login extends Component {
  // static navigationOptions = ({navigation}) => {
  //   headerTitle: "Login"
  // }

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
            this.props.userConnect(data.sub)
          })
          .catch(err => {
            SInfo.getItem("refreshToken", {}).then(refreshToken => {
              auth0.auth
                .refreshToken({refreshToken: refreshToken})
                .then(newAccessToken => {
                  SInfo.setItem('accessToken', newAccessToken.accessToken, {});

                })
                .catch(accessTokenErr => {
                  this.login()
                  console.log("error getting new accessToken: ", accessTokenErr)
                  this.props.userNotConnected();
                })
            })
          })
      } else {
        this.setState({
          hasInitialized: true
        });
        this.props.userNotConnected();
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <ActivityIndicator
          size="large"
          color="#05a5d1"
          animation={!this.state.hasInitialized}
        /> */}
        {this.state.hasInitialized && (

          <TouchableOpacity style={styles.btnContainer} onPress={this.login}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

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
            RNRestart.Restart()
            this.props.userConnect(data.sub)
          })
          .catch(err => {
            console.log("err: ");
            console.log(JSON.stringify(err));
            this.props.userNotConnected();
          });

        SInfo.setItem("accessToken", res.accessToken, {});
        SInfo.setItem("refreshToken", res.refreshToken, {});

      })
      .catch(error => {
        console.log("Error while trying to authenticate", error);
        this.props.userNotConnected();
      });
  };

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
        console.log('ok')
        throw new Error(response.json.message)
      }
    })
    .catch(error => {
      console.log(error)
      console.log('not working')
    })
  }
}

function mapStateToProps(state){
  return {
    userIsLogged: state.userIsLogged
  }
}

function mapDispatchToProps(dispatch) {
  return {
    userConnect: (sub) => dispatch({type: 'USER_CONNECT', sub}),
    userNotConnected: () => dispatch({type: 'USER_NOT_CONNECTED'}),
    getMemes: () => dispatch({type: 'GET_MEMES'}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnContainer:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: 'rgb(240,240,240)',
    backgroundColor: '#9FA8DA',
    paddingHorizontal: 8,
    paddingVertical: 9,
    width: 110,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 8,
    fontSize: 17,
  }
})
