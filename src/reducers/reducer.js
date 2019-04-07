import SInfo from "react-native-sensitive-info";
import Config from "react-native-config";
import Auth0 from "react-native-auth0";



import {getMemes} from '../utils/utils';
import {getUserMemes} from '../utils/utils';

import * as cloudinary from 'cloudinary-core';





const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID
});


const initialState = {
  userSub: '',
  userIsLogged: false
}


onSubscriptionChange = () => {
  console.log('i change')
};


export const reducer = (state=initialState, action) => {
  switch(action.type)
  {
    case 'GET_MEMES':
      const memeArray = []
      getMemes(memeArray);
      console.log('iam the array')
      console.log(memeArray)
      state = Object.assign({}, state, {memesFromStore: memeArray})
      return state
    case 'DELETE_MEME':
      console.log('To delte')

    case 'USER_CONNECT':
      return {
        ...state,
        userIsLogged: true,
        userSub: action.sub
        }

    case 'USER_NOT_CONNECTED':
      return {
        ...state,
        userIsLogged: false,
        userSub: ''
      }
  }

  return state
}
