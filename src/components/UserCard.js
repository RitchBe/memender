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
          <Text style={[styles.textVotes, styles.upvote, styles.icon]}>{item.upvote} ❤️</Text>
          <Text style={[styles.textVotes, styles.downvote, styles.icon]}>{item.downvote} 👎</Text>
          <TouchableOpacity onPress={this.handleDelete}>
            <Text style={styles.icon}>🗑️</Text>
          </TouchableOpacity>
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
    borderRadius: 5
  },
  images: {
    resizeMode: "contain",
    alignSelf: 'stretch',
    flex: 1,
    height: hp('40%'),
    width: wp('80%')
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
  }
})
