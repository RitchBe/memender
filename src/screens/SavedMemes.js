import React, { Component } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  View } from 'react-native';

import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import SInfo from "react-native-sensitive-info";

import Header from '../components/Header';
import SavedCard from '../components/SavedCard';

import {connect} from 'react-redux';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// var userSub;

// const auth0 = new Auth0({
//   domain: Config.AUTH0_DOMAIN,
//   clientId: Config.AUTH0_CLIENT_ID
// })

// SInfo.getItem('accessToken', {}).then(accessToken => {
// if (accessToken) {
//   auth0.auth
//     .userInfo({token: accessToken})
//     .then(data => {
//       userSub = data.sub
//     })
//     .catch(err => {
//       console.log('error is here?')
//       console.log(err)
//       })
//     } else {
//       console.log('user not log in')
//     }
//   })

 class SavedMemes extends Component {
  state = {
    savedMemes: []
  }

  renderItem = ({item}) => (
    <SavedCard item={item} onDelete={this.deleteSavedMeme}/>
  )

  fetchSavedMemes = () => {
    fetch('http://192.168.0.19:3000/api/users/' + this.props.userSub + '/savedmemes', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.props.userSub,
      }),
      cache: 'default'
    })
    .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
    .then(response => {
      if (!response || response.status !== 200) {
        throw new Error(response.json.message)
      }
      console.log('get saved meme');
      console.log(response)
      response.json.map((meme) => (
        this.setState({
          savedMemes: [...this.state.savedMemes, meme],
        })

      ))
    })
  }

  deleteSavedMeme = (meme) => {
    fetch('http://192.168.0.19:3000/api/users/' + this.props.userSub + '/savedmemes/' + meme.memeId, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.props.userSub,
      }),
      cache: 'default'
    })
    .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
    .then(response => {
      if (!response || response.status !== 200) {
        throw new Error(response.json.message)
      }
      this.setState({
        savedMemes: this.state.savedMemes.filter(x => x.memeId !== meme.memeId)
      })
    })
  }

  componentDidMount() {
    this.fetchSavedMemes()
  }

  openDrawer = () => {
    this.props.navigation.toggleDrawer();
  }
  render() {
    const {savedMemes} = this.state;
    return (
      <View style={styles.savedMemesContainer}>
        <Header onOpenDrawer={this.openDrawer} saved={true} />
        <FlatList
          style={{flex: 1}}
          data= {savedMemes}
          renderItem = {this.renderItem}
          keyExtractor = {meme => meme.memeId}
          showsVerticalScrollIndicator={false}
          // onEndReached={this.fetchSavedMemes}
          // onEndReachedThreshold={0}
        />
      </View>
    );
  }
}
function mapStateToProps(state){
  return {
    userSub: state.userSub
  }
}

export default connect(mapStateToProps)(SavedMemes)


const styles = StyleSheet.create({
  savedMemesContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#E8EAF6"
  },

  memeContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  images: {
    resizeMode: "contain",
    alignSelf: 'stretch',
    flex: 1,
    height: 300,
    width: 300
  },

  votes: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  icon: {
    padding: 15,
    fontSize: 17,
  },
  header:{
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'white',
    width: wp('100%')
  }

});
