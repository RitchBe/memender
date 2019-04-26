import React, { Component } from 'react';
import { Text, View, Button, Platform, StyleSheet, TouchableOpacity, Image, FlatList, Share, ActivityIndicator } from 'react-native';
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";


import CardStack, {Card} from 'react-native-card-stack-swiper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as cloudinary from 'cloudinary-core';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { v4 as uuid } from "uuid";
import PinchZoomView from 'react-native-pinch-zoom-view';
import Icon from 'react-native-vector-icons/Octicons';
import {connect} from 'react-redux';
import { NavigationActions, StackActions } from "react-navigation";
import RNRestart from "react-native-restart";
import DropdownAlert from 'react-native-dropdownalert';
import LinearGradient from "react-native-linear-gradient";



import { NativeAdsManager} from 'react-native-fbads';
import AdComponent from '../components/AdComponent';

import {vote} from '../utils/utils'
import {checkUser} from '../utils/utils'

import Header from '../components/Header';
import SaveIcon from '../components/SaveIcon'



const memeKeyExtractor= meme => meme._id
const adsManager = new NativeAdsManager('432030290881411_432032567547850', 10)

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Home"
    };
  };

  state= {
    memesTest: [],
    seenMeme: [],
    order: 'random',
    countBest: 1,
    count: 0,
    countAds: 0
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

    ImagePicker.openPicker({
      width: 700,
      height: 900,
      avoidEmptySpaceAroundImage: false,
      cropping: false,
      includeBase64: true,
    }).then(image => {
      let source = {uri: image.path};
      this.setState({
        uploadingImg: true,
      });
      uploadFile(image)
      .then(image => image.json())
      .then(result => {
        console.log('result:')
        console.log(result)
        this.onMemeCreation(result);
        this.setState({
          uploadingImg: false
        })
      })
    })
  }

  onMemeCreation = result => {
    console.log('i am the url')
    console.log(result)
    SInfo.getItem('accessToken', {}).then(accessToken => {
      if (accessToken) {
            fetch('http://192.168.0.19:3000/api/memes/', {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'authorization': accessToken,
              }),
              cache: 'default',
              body: JSON.stringify({
                url: result.secure_url,
                userSub: this.props.userSub
              })
            })
            .then(r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
            .then(response => {
              if (!response || response.status !== 201) {
                this.dropdown.alertWithType('error', 'Error', 'Error while updating the meme.')
                throw new Error(response.json.message)
            }
            this.dropdown.alertWithType('success', 'Success', 'Meme Updated')


        })
      }
    })
  }

 fetchMemes = () => {
   SInfo.getItem('accessToken' ,{}).then(accessToken => {
     if (accessToken) {
       console.log(' i am the sub from reducer');
       console.log(this.props.userSub)
       //http://192.168.0.19:3000
        fetch('http://192.168.0.19:3000/api/memes/' + this.props.userSub, {
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
          console.log('i am reponsee')
          console.log(response)
           response.json.map((meme) => (
            this.setState({
              memesTest: [...this.state.memesTest, meme],
            })
          ))
        })
     }
   })

  }

  checkCountMemes = (meme, index) => {
    const {count, countBest} = this.state
    this.setState({
      seenMeme: [...this.state.seenMeme , meme]
    });

    if (this.state.order === "random"){
      this.setState({
        count: count + 1,
      })
      if (count === 3) {
        this.fetchMemes();
        this.setState({
          count: 0,
        })
      }
    } else {
      console.log(countBest)
      this.setState({
        countBest: countBest + 1
      })
      if (countBest % 5 === 0 && countBest > 0 ) {
        console.log('while take some new now')
        this.getSortedMeme(this.state.order);
      }
    }
  }


  componentDidMount() {
    this.fetchMemes()
  }

  getSortedMeme = (order) => {
    SInfo.getItem('accessToken' ,{}).then(accessToken => {
      if (accessToken) {
        fetch('http://192.168.0.19:3000/api/memes/' + this.props.userSub + '/' + order + '?next=' + this.state.countBest, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            'authorization': accessToken,
          }),
          cache: 'default'
        })
        .then(r => r.json().then(json => ({pk: r.ok, status: r.status, json: json})))
        .then(response => {
          if (!response || response.status !== 200) {
            throw Error(response.json.message)
          }
          console.log(response)
          response.json.map((meme) => (
            this.setState({
              memesTest: [...this.state.memesTest, meme]
            })
          ))
        })
      }
    })

  }

  sortMemes = (order) => {
    console.log(order)
    if (order === "random") {
      this.setState({order: 'random'})
      this.setState({memesTest: []})

      this.fetchMemes();
    }
    else if (order === "bestOfAllTime") {
      this.setState({
        memesTest: [],
        order: "bestOfAllTime",
        countBest: 1
      })
      this.getSortedMeme('bestofalltime')
    }
    else if (order === "monthlyBest") {
      this.setState({
        memesTest: [],
        order: "monthlyBest",
        countBest: 1
      })
      this.getSortedMeme('monthlybest')
    }
    else if (order === "weeklyBest") {
      this.setState({
        memesTest: [],
        order: "weeklyBest",
        countBest: 1
      })
      this.getSortedMeme('weeklybest')
    }
  }

  checkForAds = () => {
    const {countAds} = this.state
    this.setState({countAds: countAds + 1})
    if (countAds % 4 === 0 && countAds > 0) {
      const ad = {
        id: uuid(),
        name: 'ads'
      }
      this.setState({
        memesTest: [...this.state.memesTest, ad]
      })
    }
  }



openDrawer = () => {
  console.log('hei')
  this.props.navigation.toggleDrawer();
}

  render() {
    var cl = new cloudinary.Cloudinary({cloud_name: "db7eqzno0", secure: true, context: true,image_metadata: "true"});
    const {memesTest} = this.state;

    return (
      <View style={styles.container}>
      <Header onOpenDrawer={this.openDrawer} home={true} sortMemes={(order) => {this.sortMemes(order)}}/>


        <CardStack style={styles.content} renderNoMoreCards={() =>
          <ActivityIndicator color="#9FA8DA" style={{margin: 100}} size="large" />} ref={swiper => {
            this.swiper = swiper
          }}
          onSwipedRight={() => {
          }}
          onSwipedLeft={() => {


          }}
          >

            {this.state.memesTest.map(
              (meme, index) => (
              // meme.name ? (
              //       <Card
              //        key={meme.id}
              //        style={[styles.card, styles.card1]}
              //        >
              //        <View>
              //           <AdComponent adsManager={adsManager} />
              //        </View>
              //      </Card>
              //      ) : (

              this.state.seenMeme.indexOf(meme) === -1 &&
                <Card
                  key={meme._id}
                  style={[styles.card, styles.card1]}
                  onSwipedRight={() => {
                    // This will be for the ads when deploy
                    // this.checkForAds()
                    this.checkCountMemes(meme, index)
                    vote('upvote', meme, this.props.userSub)

                  }
                }
                  onSwipedLeft={() => {
                    // This will be for the ads when deploy
                    // this.checkForAds()
                    this.checkCountMemes(meme, index)
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
                )
               // )
             }

      </CardStack>

      <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footer} onPress={this.submit}>
       <Text style={styles.footerTitle}>Add yours</Text>
     </TouchableOpacity>
      </View>

      <DropdownAlert ref={ref => this.dropdown = ref} />
      </View>
    );
  }
}

function uploadFile(file) {
  console.log(file)
  console.log(file.path)
  console.log(file.modificationDate)

    const YOUR_CLOUDINARY_NAME = Config.CLOUDINARY_NAME;
    const YOUR_CLOUDINARY_PRESET = Config.CLOUDINARY_PRESET;
    return RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/' + YOUR_CLOUDINARY_NAME + '/image/upload?upload_preset=' + YOUR_CLOUDINARY_PRESET, {
        'Content-Type': 'multipart/form-data',
    }, [
            { name: 'file', filename: file.modificationDate, data: file.data }
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
