
import { Actions } from 'react-native-router-flux';
import React, { Component } from 'react';

import {
   PermissionsAndroid,
   Platform,
   Text,
   findNodeHandle,
   TouchableOpacity,
} from 'react-native';

import ZegoExpressEngine, {
   ZegoScenario,
   ZegoUpdateType,
} from 'zego-express-engine-reactnative';
import { ZegoExpressManager } from './ZegoExpressManager';

const config = {
   // Get your AppID from ZEGOCLOUD Console
   //[My Projects] : https://console.zegocloud.com/project
   appID: 1719562607,
 };

 
// Check if the specified permission has been granted
let grantedAudio, grantedCamera;
if (Platform.OS === 'android') {
   grantedAudio = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
   );
   grantedCamera = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
   );
}

class Welcome extends Component {
   goToHome = () => {
      Actions.home()
   }
   // Initialize SDK
   initSDK = () => {
      console.warn('init SDK');
      const profile = {
         appID: config.appID,
         scenario: ZegoScenario.General,
      };
      ZegoExpressManager.createEngine(profile).then(async () => {
         // Android: Dynamically obtaining device permissions
         if (Platform.OS === 'android') {
            const permissions = [];
            try {
               const result1 = await grantedAudio;
               const result2 = await grantedCamera;
               if (!result1) {
                  permissions.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
               }
               if (!result2) {
                  permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
               }
            } catch (error) {
               permissions.push(
                  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                  PermissionsAndroid.PERMISSIONS.CAMERA,
               );
            }
            PermissionsAndroid.requestMultiple(permissions).then(data => {
               console.warn('requestMultiple', data);
            });
         }
         // Register callback
         ZegoExpressManager.instance().onRoomUserUpdate(
            (updateType, userList, roomID) => {
               console.warn('out roomUserUpdate', updateType, userList, roomID);
               userList.forEach(userID => {
                  if (updateType === ZegoUpdateType.Add) {
                     this.setState({ showPlay: true }, () => {
                        ZegoExpressManager.instance().setRemoteVideoView(
                           userID,
                           findNodeHandle(this.zegoPlayViewRef.current),
                        );
                     });
                  } else {
                     this.setState({ showPlay: false });
                  }
               });
            },
         );
         ZegoExpressManager.instance().onRoomUserDeviceUpdate(
            (updateType, userID, roomID) => {
               console.warn('out roomUserDeviceUpdate', updateType, userID, roomID);
            },
         );
         ZegoExpressManager.instance().onRoomTokenWillExpire(
            async (roomID, remainTimeInSecond) => {
               console.warn('out roomTokenWillExpire', roomID, remainTimeInSecond);
               const token = (await generateToken()).token;
               ZegoExpressEngine.instance().renewToken(roomID, token);
            },
         );
      });
   };

   render() {
      return (
         <TouchableOpacity style={{ margin: 128 }} onPress={this.goToHome} >
            <Text>Welcome! Click Go Home Page!</Text>
         </TouchableOpacity >
      )
   }


   componentDidMount() {
      console.warn(' Welcome componentDidMount');
      this.initSDK();
   }
}
export default Welcome