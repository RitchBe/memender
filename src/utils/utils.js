import SInfo from "react-native-sensitive-info";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import RNRestart from "react-native-restart";




export function vote(upOrDown, meme, userSub) {
  SInfo.getItem('accessToken' ,{}).then(accessToken => {
    if (accessToken) {
      fetch('https://www.memender.io/api/memes/' + meme._id + '/' + upOrDown, {
            method: 'PUT',
            headers: new Headers({
              'Content-Type': 'application/json',
              'authorization': accessToken
            }),
            cache: 'default',
            body: JSON.stringify({
              memeId: meme._id,
              userSub: userSub
            })
          })
          .then( r => r.json().then(json => ({ok: r.ok, status: r.status, json})))
          .then(response => {
            if (!response.ok || response.status !== 200){
              throw new Error(response.json.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
    }
  });

    }
