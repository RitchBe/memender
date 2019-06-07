import React, { Component } from 'react';
import { Text, View, Button, Platform, StyleSheet, TouchableOpacity, Image, FlatList, Share, Modal } from 'react-native';
import {connect} from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Octicons';
import {mainColor, mainColor2, details, logo, menuHamburger} from '../utils/colors'
import LinearGradient from "react-native-linear-gradient";





class Header extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Header"
    };
  };

  state = {
    modalOpen: false
  }

showModal = () => {
  this.setState({
    modalOpen: !this.state.modalOpen
  })
}

sortOrder = (order) => {
  this.props.sortMemes(order)
  this.showModal()
}

  render() {
    if (this.props.home == true) {
       rightBtn =
               <View style={{zIndex: 500000}}>
               <TouchableOpacity onPress={this.showModal}>
                {/*<Icon name="award" size={25} color={mainColor2} style={{marginRight: 15}}/>*/}
              </TouchableOpacity>
              <Modal visible={this.state.modalOpen} transparent={false} animationType='none'>
                <LinearGradient colors={[mainColor,mainColor2]} style={{flex: 1}} >

                   <View style={styles.dropdown}>

                     <TouchableOpacity  style={styles.closeModal} onPress={this.showModal}>
                       <Text style={styles.closeFont}>x</Text>
                     </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSort}  onPress={() => this.sortOrder('random')}>
                      <Text style={styles.modalText}>Random</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSort} onPress={() => this.sortOrder('bestOfAllTime')}>
                      <Text style={styles.modalText}>All Time 100</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSort} onPress={() => this.sortOrder('monthlyBest')}>
                      <Text style={styles.modalText}>Monthly'100</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSort} onPress={() => this.sortOrder('weeklyBest')}>
                      <Text style={styles.modalText}>Weekly'100</Text>

                    </TouchableOpacity>

                  </View>
                </LinearGradient>

                </Modal>
            </View>
    } else if (this.props.uploaded == true) {
        rightBtn = <View style={{width: 25, height: 25, marginRight: 15}}></View>
    } else if (this.props.saved == true) {
       rightBtn = <View style={{width: 25, height: 25, marginRight: 15}}></View>
    }

    return(
      <View style={styles.headerContainer}>
        <View style={styles.header}>

        <TouchableOpacity onPress={this.props.onOpenDrawer}>
          <Image style={{width: 25, height: 25, marginLeft: 15, padding: 5}} source={menuHamburger}/>
        </TouchableOpacity>
        <Image source={logo} style={styles.logo}/>

          <TouchableOpacity style={styles.infoBtn} onPress={this.props.onGoToInfo}>
            <Icon name="info" size={28} color={mainColor2} />
          </TouchableOpacity>


        </View>
      </View>
    )
  }

}

export default connect()(Header)


const styles = StyleSheet.create({
  headerContainer: {
    width: wp('100%'),
    height: 60,
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: 'pink',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      width: 5,
      height: 5
    },
    zIndex: 15,
  },
  header:{
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleLogo: {
    fontFamily: 'ConcertOne-Regular',
  },
  logo: {
    height: 30,
    width: 193,
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  dropdown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSort: {
    color: "white",
  },
  closeModal: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 20
  },
  closeFont: {
    color: "white",
    fontSize: 25
  },
  modalText: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold'
  },
  btnSort: {
    padding: 15,
  },
  infoBtn: {
    padding: 15
  }
})
