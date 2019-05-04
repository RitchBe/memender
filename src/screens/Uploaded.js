import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";

import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import SInfo from "react-native-sensitive-info";

import UserCard from '../components/UserCard'
import Header from '../components/Header'

import {connect} from 'react-redux';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { NativeAdsManager, AdSettings, BannerView} from 'react-native-fbads';
import AdComponent from '../components/AdComponent';

import {mainColor, mainColor2, details, lightColor} from '../utils/colors'




const adsManager = new NativeAdsManager('432030290881411_432032567547850', 10)


class Uploaded extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Uploaded",
    };
  };

  state = {
    userMemes: [],
    loading: false,
    isListEnd: false,
    fetching_from_server: false,
  }

  renderItem = ({item}) => (
    <UserCard item={item} onDelete={this.deleteMeme}/>
  )

  fetchUserMemes = () => {
    this.setState({
      userMemes: []
    })
    SInfo.getItem('accessToken' ,{}).then(accessToken => {
      if (accessToken) {
        const {userMemes} = this.state;
          fetch('https://www.memender.io/api/users/' + this.props.userSub + '/memes', {
                  method: 'GET',
                  headers: new Headers({
                    'Content-Type': 'application/json',
                    'authorization':accessToken,
                  }),
                  cache: 'default'
                })
                .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
                .then(response => {
                  if (!response || response.status !== 200){
                    throw new Error(response.json.message)
                  }

                  response.json.map((meme) => (
                    this.setState({
                      userMemes: [...this.state.userMemes, meme],
                    })
                  ))
                })
      }
    });
    }

    fetchMore = () => {
      SInfo.getItem('accessToken' ,{}).then(accessToken => {
        if (accessToken) {
          const {userMemes} = this.state;
          console.log(userMemes.length)
          if (!this.state.fetching_from_server && !this.state.isListEnd) {

              if (userMemes.length % 10 === 0 && userMemes.length !== 0) {
                this.setState({fetching_from_server: true}, () => {
                console.log('should be here')
                fetch('https://www.memender.io/api/users/' + this.props.userSub + '/memes?next=' + userMemes[userMemes.length -1].date, {
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
                      userMemes: [...this.state.userMemes, meme],
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

  deleteMeme = (meme) => {
    SInfo.getItem('accessToken' ,{}).then(accessToken => {
      if (accessToken) {
        fetch('https://www.memender.io/api/users/' + this.props.userSub + '/memes/' + meme._id, {
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
            userMemes: this.state.userMemes.filter(x => x._id !== meme._id)
          })
        })
      }
    });

  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willFocusListener = navigation.addListener(
      'willFocus',
      () => {
        this.fetchUserMemes()
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

  // next: add code for rendering the component
  render() {
   const { userMemes } = this.state;
   if (userMemes.length > 0) {
    content =  <FlatList
            style={{flex: 1}}
            data={this.state.userMemes}
            extraData={this.state}
            renderItem = {this.renderItem}
            keyExtractor={meme => meme._id}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={this.fetchMore}
            ListFooterComponent={this.renderFooter}
            initialNumToRender={10}
          />
   } else {
     content = <View style={styles.noSavedMeme}>
                 <Text style={styles.placeholderText}>You didn't uploaded any images yet.</Text>
               </View>
   }

   return (
     <View style={styles.list}>
    <Header onOpenDrawer={this.openDrawer} uploaded={true}/>
      {content}
     </View>
   );
 }
}


function mapStateToProps(state) {
  return {
    userSub: state.userSub
  }
}

function mapDispatchToProps(dispatch){
  return {
    // deleteMeme: (meme) => dispatch({type: 'DELETE_MEME', meme})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploaded)


const styles = StyleSheet.create({
  list: {
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
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
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
