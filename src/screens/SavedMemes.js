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

import {mainColor, mainColor2, details, lightColor} from '../utils/colors'


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
    this.setState({
      savedMemes: []
    })
    SInfo.getItem('accessToken' ,{}).then(accessToken => {
      if (accessToken) {
        fetch('https://www.memender.io/api/users/' + this.props.userSub + '/savedmemes', {
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
              fetch('https://www.memender.io/api/users/' + this.props.userSub + '/savedmemes?next=' + this.state.count, {
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
        fetch('https://www.memender.io/api/users/' + this.props.userSub + '/savedmemes/' + meme.memeId, {
          method: 'DELETE',
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
          this.setState({
            savedMemes: this.state.savedMemes.filter(x => x.memeId !== meme.memeId)
          })
        })
      }
    });

  }

  componentDidMount() {
    const { navigation } = this.props;

    this.willFocusListener = navigation.addListener(
      'willFocus',
      () => {
        this.fetchSavedMemes()

      }
    )
  }

  componentWillUnmount() {
    this.willFocusListener.remove();
  }

  openDrawer = () => {
    this.props.navigation.toggleDrawer();
  }

  renderFooter = () => {
    if (this.state.fetching_from_server === true) {
      return <ActivityIndicator color={mainColor2} style={{margin: 100}} size="large" />
    } else {
      return null;
    }
  }
  render() {
    const {savedMemes} = this.state;
    console.log(savedMemes)
    console.log(savedMemes.length)

    if (savedMemes.length > 0) {
      content = <FlatList
        style={{flex: 1}}
        renderItem = {this.renderItem}
        data= {savedMemes}
        keyExtractor = {meme => meme.memeId}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={this.fetchMoreSaved}
        ListFooterComponent={this.renderFooter}
        initialNumToRender={10}
      />
    } else {
       content = <View style={styles.noSavedMeme}>
                   <Text style={styles.placeholderText}>You don't have any meme saved yet.</Text>
                 </View>
    }
    return (
      <View style={styles.savedMemesContainer}>
        <Header onOpenDrawer={this.openDrawer} saved={true} />
        {content}
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
    backgroundColor: lightColor
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
  },
  noSavedMeme: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: mainColor2,
    fontWeight: 'bold'
  }

});
