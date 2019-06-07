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
import {mainColor, mainColor2, details, mainFont} from '../utils/colors'





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
  changingOrder = (order) => {
    console.log('i am the order')
    console.log(this.props.order)
    this.props.changeOrder(order)
    console.log(this.props.order)
    this.props.navigation.closeDrawer();
  }
  render() {


    return (


        <View style={styles.drawerContainer}>

        <View style={styles.transparentHeader}>
        </View>


      {/*<View style={styles.logOutContainer}>
        <TouchableOpacity style={styles.infoBtn} onPress={() => this.props.navigation.navigate('Info')}>
        <Icon name="info" size={20} color={details} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logOutBtn} onPress={this.logOut}>
          <Icon name="sign-out" size={20} color={details} />
        </TouchableOpacity>
      </View>*/}

      <View style={styles.ordering}>
            <TouchableOpacity onPress={() => {this.changingOrder('random')}} style={styles.btn}>
              <Text style={styles.btnText}>Random</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.changingOrder('bestOfAllTime')}} style={[styles.btn, styles.btnExceptFirst]}>
              <Text style={styles.btnText}>All Time 100</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.changingOrder('monthlyBest')}} style={[styles.btn, styles.btnExceptFirst]}>
              <Text style={styles.btnText}>Monthly 100</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.changingOrder('weeklyBest')}} style={[styles.btn, styles.btnExceptFirst]}>
              <Text style={styles.btnText}>Weekly 100</Text>
            </TouchableOpacity>
        </View>
      </View>




    );
  }
}

function mapStateToProps(state){
  return {
    user: state.user,
    userIsLogged: state.userIsLogged,
    order: state.order
  }
}

function mapDispatchToProps(dispatch) {
  return {
      userNotConnected: () => dispatch({type: 'USER_NOT_CONNECTED'}),
      changeOrder: (order) => dispatch({type: 'CHANGE_ORDER', order: order})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomDrawer)

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: hp('50%'),
    elevation: 4
  },
  transparentHeader: {
    height: 60,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  ordering: {
    backgroundColor: 'white',
    borderBottomWidth: 3,
    borderColor: 'rgba(140, 34, 198, 0.1)',
    borderRightWidth: 3,
    height: hp('30%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerWrapper: {
    height: 40
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
  },
  btnText: {
    color: mainColor2,
    fontFamily: mainFont,
    fontSize: 16,
  },
  btn: {
    borderBottomWidth: 0.5,
    borderColor: mainColor2,
    paddingBottom: 3,
    paddingLeft: 3,
    width: wp('30%'),
  },
  btnExceptFirst: {
    marginTop: 16
  }
})
