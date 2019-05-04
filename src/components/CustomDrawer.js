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





const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID
});

class CustomDrawer extends Component {

  componentDidMount() {
    console.log('here')
    console.log(this.props)
  }
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
        <LinearGradient
            colors={[
              mainColor,
              mainColor2
            ]}
            style={{flex: 1}}
            >
        <View style={styles.drawerContainer}>
        <View style={styles.logOutContainer}>
        <TouchableOpacity style={styles.infoBtn} onPress={() => this.props.navigation.navigate('Info')}>
        <Icon name="info" size={20} color={details} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logOutBtn} onPress={this.logOut}>
          <Icon name="sign-out" size={20} color={details} />
        </TouchableOpacity>
        </View>
        <DrawerItems
        inactiveTintColor={details}
        activeTintColor={mainColor2}
        labelStyle={{fontSize: 20}}
        activeBackgroundColor={details}
        itemsContainerStyle={{marginVertical: 60}}
        iconContainerStyle={{marginVertical: 60}}
        {...this.props}
         />
        </View>
      </LinearGradient>

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
    // backgroundColor: '#9FA8DA',
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
    marginRight: 10,
    flexDirection: 'row'
  },
  infoBtn: {
    marginRight: 10,
    padding: 5
  },
  logOutBtn: {
    padding: 5
  }
})
