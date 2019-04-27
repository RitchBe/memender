import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Header from '../components/Header'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Info extends Component {
  openDrawer = () => {
    this.props.navigation.toggleDrawer();
  }

  render() {
    return (
      <View style={styles.infoContainer}>
      <Header onOpenDrawer={this.openDrawer} saved={true} />
      <View style={styles.info}>
        <View style={styles.infoWrapper}>
        <Text style={styles.infoText}>I've created Memender for people how loves funny images and memes. I hope you enjoy it and if could let me a review on the stores that will be super helpful!
        Also if you have any complain or want to contact me please send me an email.</Text>
        <Text style={[styles.infoText, styles.infoUnderline]}>info@memender.io</Text>
        <Text style={[styles.name, styles.infoText]}>-Richard</Text>
      </View>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('90%')
  },
  infoText: {
    color: '#F2C94C',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center'
  },
  infoUnderline: {
    textDecorationLine: 'underline',
    textAlign: 'left'
  },
  infoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('80%')
  },
  name: {
    alignSelf: 'flex-end',
    marginTop: 20
  }
})
