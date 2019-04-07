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


const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID
});

class CustomDrawer extends Component {

  logOut = () => {
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
      this.props.userNotConnected
      RNRestart.Restart()
  };
  render() {
    return (
      <ScrollView>
        <View style={styles.drawerContainer}>
        <View style={styles.logOutContainer}>
        <TouchableOpacity style={styles.logOutBtn} onPress={this.logOut}>
          <Icon name="sign-out" size={20} color='#E8EAF6' />
        </TouchableOpacity>
        </View>
        <DrawerItems
        inactiveTintColor='#E8EAF6'
        activeTintColor='#9FA8DA'
        labelStyle={{fontSize: 20}}
        activeBackgroundColor='#E8EAF6'
        itemsContainerStyle={{marginVertical: 60}}
        iconContainerStyle={{marginVertical: 60}}

        {...this.props} />

        </View>
        </ScrollView>
    );
  }
}

function mapStateToProps(state){
  return {
    user: state.user,
    userIsLogged: state.userIsLogged
  }
}

function mapDispatchToProps(dispatch) {
  return {
      userNotConnected: () => dispatch({type: 'USER_NOT_CONNECTED'})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomDrawer)

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#9FA8DA',
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1,
    height: hp('100%')
  },
  label: {
    color: 'white'
  },
  logOutContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    position: 'absolute',
    top:20,
    right: 0,
    marginRight: 10
  }
})
