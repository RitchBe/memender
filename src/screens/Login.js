import React, { Component } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import RNRestart from "react-native-restart";
import CheckBox from 'react-native-checkbox';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {mainColor, mainColor2, details, lightColor, logo, textDetail, mainFont} from '../utils/colors'
import Carousel, {Pagination} from 'react-native-snap-carousel';




const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID
});

class Login extends Component {
  // static navigationOptions = ({navigation}) => {
  //   headerTitle: "Login"
  // }

  state = {
    hasInitialized: false,
    termAccept: false,
    currentIndex: 0,
    cardData: ['https://res.cloudinary.com/dmbqzuhic/image/upload/v1557317584/ysq8rmllbdzdk46whh6s.jpg','https://res.cloudinary.com/dmbqzuhic/image/upload/v1557317584/kbtftc37fxi0vuesvifv.jpg','https://res.cloudinary.com/dmbqzuhic/image/upload/v1557317581/aa5enup62npm6cbltohn.jpg'],
    activeSlide: 0
  };

  componentDidMount() {
    SInfo.getItem("accessToken", {}).then(accessToken => {
      if (accessToken) {
        console.log('i am the token')
        console.log(accessToken)
        auth0.auth
          .userInfo({token: accessToken})
          .then(data => {
            this.props.userConnect(data.sub)
          })
          .catch(err => {
            SInfo.getItem("refreshToken", {}).then(refreshToken => {
              console.log(refreshToken)
              if (refreshToken == null) {
                this.setState({
                  hasInitialized: true
                })
              } else {
                auth0.auth
                  .refreshToken({refreshToken: refreshToken})
                  .then(newAccessToken => {
                    console.log(newAccessToken)
                    SInfo.setItem('accessToken', newAccessToken.accessToken, {});
                  })
                  .catch(accessTokenErr => {
                    this.setState({
                      hasInitialized: true
                    });
                    console.log("error getting new accessToken: ", accessTokenErr)
                    this.props.userNotConnected();
                  })
              }

            })
          })
      } else {
        this.setState({
          hasInitialized: true
        });
        this.props.userNotConnected();
      }
    })
  }



  _renderItem({item, index}) {
    console.log(item)
    return(
      <View style={{backgroundColor: mainColor, height: hp('55%'), borderRadius: 30}}>
        <Image source={{uri: item}} style={styles.images} />
      </View>
    )
  }

  get pagination () {
    const {cardData, activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={cardData.length}
        activeDotIndex={activeSlide}
        dotStyle={{width: 10, height: 10, borderRadius: 5, backgroundColor: textDetail}}
        inactiveDotStyle={{backgroundColor: 'lightgray'}}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        containerStyle={{height: 10, width: 40, marginVertical: 0}}
        />
    );
  }

  render() {
    const {termAccept, hasInitialized, currentIndex} = this.state

    if (termAccept) {
      btns = <View style={{flexDirection: 'row'}}>
                  {/*<TouchableOpacity style={styles.btnContainer, {marginRight: 5}} onPress={this.login}>
                    <Text style={styles.btnText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnContainer, {marginLeft: 5}} onPress={this.login}>
                    <Text style={styles.btnText}>Signup</Text>
                  </TouchableOpacity>*/}
                  <TouchableOpacity onPress={this.login}>
                  <Image style={{width: 50, height: 50}} source={require('../assets/loginArrow.png')}/>
                  </TouchableOpacity>
                </View>
    } else {
      btns = <View style={{flexDirection: 'row',marginBottom: 20}}>
                  {/*<TouchableOpacity style={styles.btnContainer, {marginRight: 5}}>
                    <Text style={[styles.btnText, styles.btnTextNotAccepted]}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnContainer, {marginLeft: 5}}>
                    <Text style={[styles.btnText, styles.btnTextNotAccepted]}>Signup</Text>
                  </TouchableOpacity>*/}
                  <Image style={{width: 50, height: 50}} source={require('../assets/noLoginArrow.png')}/>
                </View>
    }

    return (
      <View style={styles.container}>
        {hasInitialized && (
          <View style={styles.wrapper}>
            <Image style={styles.logo} source={logo}/>

            <Text style={styles.textCard}>
              Find the best memes, funny picture around. Swipe for the one you like
            </Text>

        <View style={styles.carouselContainer}>
        <Carousel
          ref={(c) => {this._carousel = c;}}
          data={this.state.cardData}
          renderItem={this._renderItem}
          sliderWidth={wp('100%')}
          itemWidth={wp('65%')}
          onSnapToItem={(index) => this.setState({activeSlide: index})}
        />
        {this.pagination}
      </View>


        <View style={styles.terms}>
          <CheckBox
            checked={termAccept}
            checkboxStyle={{width: 31, height: 31}}
            labelStyle={{width: 0,marginRight: 25}}
            checkedImage={require('../assets/checked.png')}
            uncheckedImage={require('../assets/unchecked.png')}
            onChange={(checked) =>this.setState({termAccept: !termAccept})}
          />
          <Text style={{color: 'darkgray', fontFamily: mainFont, fontSize: 14}}>I have read and accepted the <Text style={{color: textDetail, textDecorationLine: 'underline'}}>Privacy Policy</Text> and the <Text style={{color: textDetail, textDecorationLine: 'underline'}}>Term and conditions</Text> of Memender</Text>
        </View>
        {btns}
        </View>
        )}
      </View>
    )
  }

  login = () => {
    if (this.state.termAccept) {
      auth0.webAuth
        .authorize({
          scope: Config.AUTHO_SCOPE,
          audience: Config.AUTH0_AUDIENCE,
          device: DeviceInfo.getUniqueID(),
          prompt: "login"
        })
        .then(res => {
          console.log(' i am tje res')
          console.log(res)
          auth0.auth
            .userInfo({token: res.accessToken})
            .then(data => {
              this.createUser(data);
              // RNRestart.Restart()
              this.props.userConnect(data.sub)
            })
            .catch(err => {
              console.log("err: ");
              console.log(JSON.stringify(err));
              this.props.userNotConnected();
            });

          SInfo.setItem("accessToken", res.accessToken, {});
          SInfo.setItem("refreshToken", res.refreshToken, {});

        })
        .catch(error => {
          console.log("Error while trying to authenticate", error);
          this.props.userNotConnected();
        });
    } else {
      console.log('Accepet')
    }
  };

  createUser = data => {
    console.log('hi from createuser')
    console.log(data)
    fetch('https://www.memender.io/api/users', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      cache: 'default',
      body: JSON.stringify({
        userSub: data.sub,
        nickname: data.nickname,
        picture: data.picture,

      })
    })
    .then( r => r.json().then(json => ({ok: r.ok, status: r.status, json: json})))
    .then(response => {
      if (!response.ok || response.status !== 201){
        console.log('ok')
        throw new Error(response.json.message)
      }
    })
    .catch(error => {
      console.log(error)
      console.log('not working')
    })
  }
}

function mapStateToProps(state){
  return {
    userIsLogged: state.userIsLogged
  }
}

function mapDispatchToProps(dispatch) {
  return {
    userConnect: (sub) => dispatch({type: 'USER_CONNECT', sub}),
    userNotConnected: () => dispatch({type: 'USER_NOT_CONNECTED'}),
    getMemes: () => dispatch({type: 'GET_MEMES'}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('100%')
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30
  },
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('65%')
  },
  terms: {
    flexDirection: 'row',
    width: wp('70%'),
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  btnContainer:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: 'white',
    backgroundColor:mainColor2,
    paddingHorizontal: 8,
    paddingVertical: 9,
    width: 110,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 8,
    fontSize: 17,
  },
  btnTextNotAccepted: {
    backgroundColor: 'rgba(220,220,220,0.4)',
    color: 'white'
  },
  card: {
    padding: 15,
    width: wp('90%'),
    height: hp('75%'),
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 0,
  },
  logo: {
    height: 35,
    width: 226,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20
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
  cardContent: {
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center'
  },
  textCard: {
    fontSize: 18,
    color: '#A7A7A7',
    width: wp('75%'),
    fontFamily: mainFont,
    textAlign: 'center',
    marginBottom: 20
  },


  cardSwipe: {
    backgroundColor: 'white',
  },

  images: {
    resizeMode: "contain",
    alignSelf: 'stretch',
    flex: 1,
    height: undefined,
    width: undefined
  },

})
