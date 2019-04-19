import React, { Component } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  View,
  ActivityIndicator } from 'react-native';

import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import SInfo from "react-native-sensitive-info";

import Header from '../components/Header';
import SavedCard from '../components/SavedCard';

import {connect} from 'react-redux';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


class SavedMemes extends Component {
  state = {
    savedMemes: [],
    loading: false,
    isListEnd: false,
    fetching_from_server: false,
    count: 0
  }

  renderItem = ({item}) => (
    <SavedCard item={item} onDelete={this.deleteSavedMeme}/>
  )

  fetchSavedMemes = () => {
    SInfo.getItem('accessToken' ,{}).then(accessToken => {
      if (accessToken) {
        fetch('http://192.168.0.19:3000/api/users/' + this.props.userSub + '/savedmemes', {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            'authorization': accessToken,
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
    })
  }


  fetchMoreSaved = () => {
    SInfo.getItem('accessToken' ,{}).then(accessToken => {
      if (accessToken) {
        this.setState({
          count: this.state.count + 10
        })
        const {savedMemes} = this.state;
        if (!this.state.fetching_from_server && !this.state.isListEnd) {

            if (savedMemes.length % 10 === 0 && savedMemes.length !== 0) {
              this.setState({fetching_from_server: true}, () => {
              console.log('should be here')
              fetch('http://192.168.0.19:3000/api/users/' + this.props.userSub + '/savedmemes?next=' + this.state.count, {
                method: 'GET',
                headers: new Headers({
                  'Content-Type': 'application/json',
                  'authorization': accessToken,
                }),
                cache: 'default'
              })
              .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
              .then(response => {
                if (!response || response.status !== 200){
                  throw new Error(response.json.message)
                }
                console.log('and the response')
                console.log(response)
                response.json.map((meme) => {
                  this.setState( {
                    savedMemes: [...this.state.savedMemes, meme],
                    fetching_from_server: false,
                  })
                }
              )
              })
            })

            }
        } else {
          this.setState({
            fetching_from_server: true,
            isListEnd: false
          })
        }
      }
    });
  }

  deleteSavedMeme = (meme) => {
    SInfo.getItem('accessToken' ,{}).then(accessToken => {
      if (accessToken) {
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
    });

  }

  componentDidMount() {
    this.fetchSavedMemes()
  }

  openDrawer = () => {
    this.props.navigation.toggleDrawer();
  }

  renderFooter = () => {
    if (this.state.fetching_from_server === true) {
      return <ActivityIndicator color="#9FA8DA" style={{margin: 100}} size="large" />
    } else {
      return null;
    }
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
          onEndReachedThreshold={0.5}
          onEndReached={this.fetchMoreSaved}
          ListFooterComponent={this.renderFooter}
          initialNumToRender={10}
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
