import React, { Component } from 'react';
import { Text, View, Button, Platform, StyleSheet, TouchableOpacity, Image, FlatList, Share, Modal } from 'react-native';
import {connect} from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';








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
                <Icon name="award" size={25} color="#9FA8DA" style={{marginRight: 15}}/>
              </TouchableOpacity>
              <Modal visible={this.state.modalOpen} transparent={false} animationType='none'>
                   <View style={styles.dropdown}>
                     <TouchableOpacity  style={styles.closeModal} onPress={this.showModal}>
                       <Text style={styles.closeFont}>x</Text>
                     </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSort}  onPress={() => this.sortOrder('random')}>
                      <Text style={styles.modalText}>Random</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSort} onPress={() => this.sortOrder('bestOfAllTime')}>
                      <Text style={styles.modalText}>Best of all Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSort} onPress={() => this.sortOrder('monthlyBest')}>
                      <Text style={styles.modalText}>Monthly Best</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSort} onPress={() => this.sortOrder('weeklyBest')}>
                      <Text style={styles.modalText}>Weekly Best</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
            </View>
    } else if (this.props.uploaded == true) {
       rightBtn = <TouchableOpacity onPress={this.sortPlaceHolder}>
                <Icon name="award" size={25} color="#9FA8DA" style={{marginRight: 15}}/>
              </TouchableOpacity>
    } else if (this.props.saved == true) {
       rightBtn = <View style={{width: 25, height: 25, marginRight: 15}}></View>
    }

    return(
      <View style={styles.headerContainer}>
        <View style={styles.header}>
        <TouchableOpacity onPress={this.props.onOpenDrawer}>
          <Image style={{width: 25, height: 25, marginLeft: 15, padding: 5}} source={require('../assets/menu2.png')}/>
        </TouchableOpacity>

        <Image source={require('../assets/logo.png')} style={styles.logo}/>

        {rightBtn}

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
  },
  dropdown: {
    flex: 1,
    backgroundColor: '#9fa8da',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSort: {
    color: "#E8EAF6",
  },
  closeModal: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 20
  },
  closeFont: {
    color: "#E8EAF6",
    fontSize: 25
  },
  modalText: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold'
  },
  btnSort: {
    padding: 15,

  }
})
