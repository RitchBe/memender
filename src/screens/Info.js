import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import Header from '../components/Header'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {mainColor, mainColor2, details, lightColor, mainFont} from '../utils/colors'


export default class Info extends Component {
  openDrawer = () => {
    this.props.navigation.toggleDrawer();
  }

  render() {
    return (
      <View style={styles.infoContainer}>
      <Header onOpenDrawer={this.openDrawer} saved={true} />
      <View style={styles.scrollViewContainer}>
      <ScrollView style={styles.info} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/privacy.png')} style={{width: 150, height: 30, marginLeft: 15, padding: 5}}/>
        </View>
        <View style={styles.infoWrapper}>
        <Text style={styles.infoText}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis dolor doloremque minima iusto, nemo quasi exercitationem ad laborum rerum explicabo rem praesentium asperiores porro necessitatibus distinctio itaque. Reprehenderit officia, culpa? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum possimus tempore minima ipsum quam nostrum similique rerum molestiae aliquid quos consequuntur harum, quidem voluptatem fugit totam soluta error laborum et.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis dolor doloremque minima iusto, nemo quasi exercitationem ad laborum rerum explicabo rem praesentium asperiores porro necessitatibus distinctio itaque. Reprehenderit officia, culpa? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum possimus tempore minima ipsum quam nostrum similique rerum molestiae aliquid quos consequuntur harum, quidem voluptatem fugit totam soluta error laborum et
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis dolor doloremque minima iusto, nemo quasi exercitationem ad
          molestiae aliquid quos consequuntur harum, quidem voluptatem fugit totam soluta error laborum et
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis dolor doloremque minima iusto, nemo quasi exercitationem admolestiae aliquid quos consequuntur harum, quidem voluptatem fugit totam soluta error laborum et
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis dolor doloremque minima iusto, nemo quasi exercitationem admolestiae aliquid quos consequuntur harum, quidem voluptatem fugit totam soluta error laborum et
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis dolor doloremque minima iusto, nemo quasi exercitationem ad
        </Text>
        <Text style={[styles.infoText, styles.infoUnderline]}>info@memender.io</Text>
        <Text style={[styles.name, styles.infoText]}>-Richard</Text>
      </View>
    </ScrollView>
  </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    height: hp('80%'),
    paddingTop: 25
  },
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%')
  },
  infoText: {
    color: '#A7A7A7',
    fontFamily: mainFont,
    fontSize: 17,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  infoUnderline: {
    textDecorationLine: 'underline',
    textAlign: 'left'
  },
  infoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%')
  },
  name: {
    alignSelf: 'flex-end',
    marginTop: 20
  }
})
