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
    const {userMemes} = this.state;
      fetch('http://192.168.0.19:3000/api/users/' + this.props.userSub + '/memes', {
              method: 'GET',
              headers: new Headers({
                'Content-Type': 'application/json',
                'authorization': this.props.userSub,
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

    fetchMore = () => {
      const {userMemes} = this.state;
      console.log('begining')
      console.log(this.state.userMemes)
      if (!this.state.fetching_from_server && !this.state.isListEnd) {

          if (userMemes.length % 10 === 0 && userMemes.length !== 0) {
            this.setState({fetching_from_server: true}, () => {

            console.log('gettinh meme')
            console.log(userMemes.length)

            fetch('http://192.168.0.19:3000/api/users/' + this.props.userSub + '/memes?next=' + userMemes[userMemes.length -1]._id, {
              method: 'GET',
              headers: new Headers({
                'Content-Type': 'application/json',
                'authorization': this.props.userSub,
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
                if (meme._id === userMemes[userMemes.length -1]._id) {
                  return
                }
                this.setState( {
                  userMemes: [...this.state.userMemes, meme],
                  fetching_from_server: false,
                  isListEnd: false

                })
              }
            )
            })
          })

          }
      } else {
        this.setState({
          fetching_from_server: false,
          isListEnd: true
        })
      }
      console.log(this.state.fetching_from_server)

    }

  deleteMeme = (meme) => {
    fetch('http://192.168.0.19:3000/api/users/' + this.props.userSub + '/memes/' + meme._id, {
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

  componentDidMount() {
    this.fetchUserMemes()
}

  openDrawer = () => {
    this.props.navigation.toggleDrawer();
  }
  renderFooter = () => {
    if (this.state.fetching_from_server === true) {
      return <ActivityIndicator color="black" style={{margin: 100}} size="large" />
    } else {
      return null;
    }

  }

  // next: add code for rendering the component
  render() {
   const { userMemes } = this.state;

   return (
     <View style={styles.list}>
    <Header onOpenDrawer={this.openDrawer} upladed={true}/>

      <FlatList
        style={{flex: 1}}
        data={this.state.userMemes}
        extraData={this.state}
        renderItem = {this.renderItem}
        keyExtractor={meme => meme._id}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        onEndReached={this.fetchMore}
        ListFooterComponent={this.renderFooter}
        initialNumToRender={10}
      />

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
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  }

});
