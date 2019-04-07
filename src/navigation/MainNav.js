import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';

import {connect, Provider} from 'react-redux';
import { createStore, applyMiddleWaer, compose, applyMiddleware} from 'redux';
import {reducer} from '../reducers/reducer';

import thunk from 'redux-thunk'





import Root from './Root';
import Drawer from './Drawer';



const RouterWithRedux = connect()(Drawer)


class MainNav extends Component {
  render() {
    if (this.props.userIsLogged == true) {
      console.log('you r almost there')
      nav = <Drawer/>
    } else {
      console.log('this root')
      nav = <Root/>
    }

  return (
    <View style={{flex: 1}}>
      {nav}
    </View>
  )
}
}


function mapStateToProps(state){
  return {
    userIsLogged: state.userIsLogged,
    userSub: state.userSub
  }
}

function mapDispatchToProps(dispatch) {
  return {
      getMemes: () => dispatch({type: 'GET_MEMES'})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MainNav)
