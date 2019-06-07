import React, {PureComponent} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {mainColor, mainColor2, details, lightColor, mainFont} from '../utils/colors'


export default class UserCard extends PureComponent {

  handleDelete = () => {
    this.props.onDelete(this.props.item);
  }

  render() {
    const {item} = this.props
    console.log(item)
    return (
      <View  key={item._id} style={styles.memeContainer}>
        <Image style={styles.images} source={{uri: item.url}}/>
        <View style={styles.votes}>

          <View style={styles.votesContainer}>
            <Image source={require('../assets/love.png')} style={styles.loveIcon}/>
            <Text style={[styles.textVotes, styles.upvote, styles.icon]}>{item.upvote}</Text>
          </View>

          <View style={styles.votesContainer}>
            <Image source={require('../assets/unlove.png')} style={styles.unloveIcon}/>
            <Text style={[styles.textVotes, styles.upvote, styles.icon]}>{item.downvote}</Text>
          </View>

        {this.props.userMeme &&
            <TouchableOpacity onPress={this.handleDelete}>
              <Text style={styles.icon}>🗑️</Text>
            </TouchableOpacity>
          }


        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  memeContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
    elevation: 5,
    marginHorizontal: 5
  },
  images: {
    resizeMode: "contain",
    alignSelf: 'stretch',
    flex: 1,
    height: hp('30%'),
    width: wp('80%')
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  votes: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  icon: {
    fontSize: 17,
    padding: 3,
    fontFamily: mainFont,
    color: mainColor2,
  },
  loveIcon: {
    width: 23,
    height: 20,
  },
  unloveIcon: {
    width: 23,
    height: 27,
  },
})
