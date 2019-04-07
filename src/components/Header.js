import React, { Component } from 'react';
import { Text, View, Button, Platform, StyleSheet, TouchableOpacity, Image, FlatList, Share } from 'react-native';
import {connect} from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';






class Header extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Header"
    };
  };


  render() {
    return(
      <View style={styles.headerContainer}>
        <View style={styles.header}>
        <TouchableOpacity onPress={this.props.onOpenDrawer}>
          <Image style={{width: 25, height: 25, marginLeft: 15, padding: 5}} source={require('../assets/menu2.png')}/>
        </TouchableOpacity>

        <Image source={require('../assets/logo.png')} style={styles.logo}/>
        <TouchableOpacity onPress={this.sortPlaceHolder}>
        <Icon name="award" size={25} color="#9FA8DA" style={{marginRight: 15}}/>
      </TouchableOpacity>
        </View>
      </View>
    )
  }

}

export default connect()(Header)


const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 50,
    width: wp('100%'),
    height: 60,
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: 'lightgrey',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      width: 5,
      height: 5
    },
  },
  header:{
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',

  },
  logo: {
    height: 30,
    width: 150,
    alignSelf: 'center',
    justifyContent: 'center',
  }
})
