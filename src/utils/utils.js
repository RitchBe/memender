import SInfo from "react-native-sensitive-info";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import RNRestart from "react-native-restart";



// var userSub;
// const auth0 = new Auth0({
//   domain: Config.AUTH0_DOMAIN,
//   clientId: Config.AUTH0_CLIENT_ID
// });
//
// SInfo.getItem('accessToken', {}).then(accessToken => {
// if (accessToken) {
//   auth0.auth
//     .userInfo({token: accessToken})
//     .then(data => {
//       userSub = data.sub
//     })
//     .catch(err => {
//       console.log('error is here?')
//       console.log(err)
//       })
//     } else {
//       console.log('user not log in')
//     }
//   })


export function vote(upOrDown, meme, userSub) {
  SInfo.getItem('accessToken' ,{}).then(accessToken => {
    if (accessToken) {
      fetch('http://192.168.0.19:3000/api/memes/' + meme._id + '/' + upOrDown, {
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



export function checkUser(signedIn) {

}
