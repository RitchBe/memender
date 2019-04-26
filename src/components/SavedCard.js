import React, {Component} from 'react';
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




export default class SavedCard extends Component {
  constructor(props) {
    super(props)
  }

  handleDelete = () => {
    const {onDelete, item} = this.props;
    onDelete(item);
    console.log('Delete this saved memes')
  }

  render() {
    const {item} = this.props
    return (
      <View  key={item._id} style={styles.memeContainer}>
      <View style={styles.votes}>
        <TouchableOpacity onPress={this.handleDelete}>
          <Text style={styles.icon}>🗑️</Text>
        </TouchableOpacity>
      </View>
        <Image style={styles.images} source={{uri: item.url}}/>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: wp('80%')
  },
  icon: {
    padding: 15,
    fontSize: 17,
  }
})
