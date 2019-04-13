import React, { Component } from 'react';
import { Text, View, Button, Platform, StyleSheet, TouchableOpacity, Image, FlatList, Share } from 'react-native';
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";


import CardStack, {Card} from 'react-native-card-stack-swiper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as cloudinary from 'cloudinary-core';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { v4 as uuid } from "uuid";
import PinchZoomView from 'react-native-pinch-zoom-view';
import Icon from 'react-native-vector-icons/Octicons';
import {connect} from 'react-redux';

import { NavigationActions, StackActions } from "react-navigation";

import RNRestart from "react-native-restart";



import {vote} from '../utils/utils'
import {checkUser} from '../utils/utils'

import Header from '../components/Header';
import SaveIcon from '../components/SaveIcon'



const memeKeyExtractor= meme => meme.memeId
var count = 0;

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Home"
    };
  };

  state= {
    memesTest: [],
    order: 'random'
  }

  handleShare = currentMemes => {
    Share.share({
      message: currentMemes.url,
      url: currentMemes.url
    })
  }

  submit = () => {
    var options ={
      title: "Select Meme",
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
        console.log(response.uri)
        if (response.didCancel) {
          console.log('user cancelled');
        }
        else if (response.error) {
          console.log('image picker error:', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button', response.customButton);
        }
        else {
          let source = {uri: response.uri};
          this.setState({
            uploadingImg: true,
          });
          uploadFile(response)
            .then(response => response.json())
            .then(result => {
              console.log('i an rte result');
              console.log(result);
              this.onMemeCreation(result)
              this.setState({
                uploadingImg: false
              });
            })
        }
      });
  }

  onMemeCreation = result => {
    SInfo.getItem('accessToken', {}).then(accessToken => {
      if (accessToken) {
        auth0.auth
          .userInfo({token: accessToken})
          .then(data => {
            fetch('http://192.168.0.19:3000/api/memes/', {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'authorization': data.sub,
              }),
              cache: 'default',
              body: JSON.stringify({
                url: result.url,
                userSub: data.sub
              })
            })
            .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
            .then(response => {
              if (!response || response.status !== 201) {
                throw new Error(response,json.message)
              }

            })
          })
      }
    })
  }

 fetchMemes = () => {

   console.log(' i am the sub from reducer');
   console.log(this.props.userSub)
    fetch('http://192.168.0.19:3000/api/memes/' + this.props.userSub, {
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
      console.log('i am reponsee')
      console.log(response)
       response.json.map((meme) => (
        this.setState({
          memesTest: [...this.state.memesTest, meme],
        })
      ))
    })
  }

  checkCountMemes = (meme, index) => {
    count += 1;
    if (count === 3) {
      this.fetchMemes();
      count = 0
    }
  }


  componentDidMount() {
    this.fetchMemes()
  }

  getSortedMeme = (order) => {
    fetch('http://192.168.0.19:3000/api/memes/' + this.props.userSub + '/' + order , {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.props.userSub,
      }),
      cache: 'default'
    })
    .then(r => r.json().then(json => ({pk: r.ok, status: r.status, json: json})))
    .then(response => {
      if (!response || response.status !== 200) {
        throw Error(response.json.message)
      }
      console.log('state')
      console.log(this.state.memesTest)
      console.log('i am the response')
      console.log(response)
      response.json.map((meme) => (

        this.setState({
          memesTest: [...this.state.memesTest, meme]
        })
      ))

    })
  }

  sortMemes = (order) => {
    if (order === "random") {
      this.setState({order: 'random'})
      this.setState({memesTest: []})

      this.fetchMemes();
    }
    else if (order === "bestOfAllTime") {
      this.setState({memesTest: []})
      this.setState({order: "bestOfAllTime"})
      this.getSortedMeme('bestofalltime')
    }
    else if (order === "monthlyBest") {
      this.setState({memesTest: []})
      this.setState({order: "monthlyBest"})
      this.getSortedMeme('monthlybest')
    }
    else if (order === "weeklyBest") {
      this.setState({memesTest: []})
      this.setState({order: "weeklyBest"})
      this.getSortedMeme('weeklybest')
    }
  }



openDrawer = () => {
  console.log('hei')
  this.props.navigation.toggleDrawer();
}

  render() {
    var cl = new cloudinary.Cloudinary({cloud_name: "db7eqzno0", secure: true, context: true,image_metadata: "true"});

    return (
      <View style={styles.container}>
      <Header onOpenDrawer={this.openDrawer} home={true} sortMemes={(order) => {this.sortMemes(order)}}/>


        <CardStack style={styles.content} renderNoMoreCards={() => <Text style={{
              fontWeight: '700',
              fontSize: 18,
              color: 'gray'
            }}>Come back for more fdp :(</Text>} ref={swiper => {
            this.swiper = swiper
          }}
          onSwipedRight={() => {
          }}
          onSwipedLeft={() => {


          }}
          >
      {this.state.memesTest.map(
       (meme, index) => (

         <Card
           key={meme._id}
           style={[styles.card, styles.card1]}
           onSwipedRight={() => {
             console.log(meme._id)
             if (this.state.order == 'random') {
               this.checkCountMemes(meme, index)
           }
             vote('upvote', meme, this.props.userSub)

           }
         }
           onSwipedLeft={() => {
             console.log(meme._id)
             if (this.state.order == 'random') {
               this.checkCountMemes(meme, index)
           }

             vote('downvote', meme, this.props.userSub)
           }}
           >
            <View style={styles.saveWrapper} >
              <SaveIcon userSub={this.props.userSub} meme={meme}/>
            </View>
         <View style={{flex: 1}}>
           <Image style={styles.images} source={{uri: meme.url}}/>
         </View>

          <View style={styles.votesContainer}>
         <View style={styles.votes}>
           <TouchableOpacity style={styles.iconButton}>
             <Text style={[styles.textVotes, styles.upvote, styles.icon]} onPress={() => {
               this.swiper.swipeRight();

             }}>{meme.upvote} ❤️</Text>
           </TouchableOpacity>

           <TouchableOpacity onPress={() => {
             this.handleShare(meme)
           }}>
             <Text style={[styles.textVotes, styles.upvote, styles.icon]}>🎁</Text>
         </TouchableOpacity>

           <TouchableOpacity>

             <Text style={[styles.textVotes, styles.downvote, styles.icon]} onPress={() => {
               // this.handleDownvote(meme)
               this.swiper.swipeLeft();
               }}>
                 {meme.downvote} 👎</Text>
           </TouchableOpacity>
         </View>
       </View>

         </Card>
       )
      )}
      </CardStack>


      <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footer} onPress={this.submit}>
       <Text style={styles.footerTitle}>Add yours</Text>
      </TouchableOpacity>
      </View>
      </View>
    );
  }
}

function uploadFile(file) {
    const YOUR_CLOUDINARY_NAME = "db7eqzno0";
    const YOUR_CLOUDINARY_PRESET = "dssyruybqw";
    return RNFetchBlob.fetch('POST', 'httpss://api.cloudinary.com/v1_1/' + YOUR_CLOUDINARY_NAME + '/image/upload?upload_preset=' + YOUR_CLOUDINARY_PRESET, {
        'Content-Type': 'multipart/form-data',
    }, [
            { name: 'file', filename: file.fileName, data: RNFetchBlob.wrap(file.uri) }
        ])
}

function mapStateToProps(state){
  return {
    userSub: state.userSub
  }
}

function mapDispatchToProps(dispatch) {
  return {
      getMemes: () => dispatch({type: 'GET_MEMES'}),
      userNotConnected: () => dispatch({type: 'USER_NOT_CONNECTED'})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6'
  },
  navText: {
    color: "#C5CAE9",
    fontSize: 18,
    position: 'absolute',
    margin: 0,
  },
  images: {
    resizeMode: "contain",
    alignSelf: 'stretch',
    flex: 1,
    height: undefined,
    width: undefined
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 15,
    width: wp('90%'),
    height: hp('75%'),
    alignSelf: 'stretch',
    flex: 5,
    backgroundColor: '#FE474C',
    borderRadius: 5,
    zIndex: 0
  },
  card1: {
    backgroundColor: 'white'
  },
  card2: {
    backgroundColor: 'white'
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  button: {
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    padding: 15,
    borderRadius: 62
  },
  votesContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  votes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('70%')
  },
  icon: {
    padding: 15,
    fontSize: 17,
  },
  saveWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: wp('90%')
  },
  saveButton: {
    width: 60,
    height: 60,
  },


  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    width: wp('100%'),
  },
  footerContainer: {
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTitle: {
    color: '#9FA8DA',
    fontWeight: '900',
    fontSize: 15,
  },


})
