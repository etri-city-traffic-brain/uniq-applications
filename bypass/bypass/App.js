/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {BackHandler, Alert} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import RootRouter from './src/Router';
import {NavigationService} from './src/navigation';
import store from './src/mods/store';
import axios from './src/mods/axios';
import messaging from '@react-native-firebase/messaging';

function ShowPopup(remoteMessage) {
  var params = {
    title: remoteMessage.data.title,
    subtitle: remoteMessage.data.subtitle,
    imgSrc: remoteMessage.data.imgSrc,
    message: remoteMessage.data.message,
  };

  NavigationService.navigate('ByPassView', params);
}

const App: () => Node = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    async function fetchData() {
      var jsonValue = await store.getData();
      if (jsonValue == null || jsonValue.phoneNumber == null) {
        return;
      } else {
        console.log(jsonValue);
        // NavigationService.navigate('Map', null);
      }

      const fcmToken = await messaging().getToken();
      console.log(fcmToken);
      var params = {token: fcmToken};

      await axios
        .patch(`/user/${jsonValue.phoneNumber}`, params)
        .catch(function (error) {
          console.log(error);
        });
    }

    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (NavigationService.getRouteName() == 'Map') {
        Alert.alert('', '앱을 종료하시겠습니까?', [
          {
            text: '취소',
            onPress: () => null,
          },
          {text: '확인', onPress: () => BackHandler.exitApp()},
        ]);
      } else {
        NavigationService.back();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background! in app.js', remoteMessage);
    ShowPopup(remoteMessage);
  });

  // Foreground 상태인 경우
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'Message handled in the foreground! in app.js',
        remoteMessage,
      );

      var msg = null;
      if (remoteMessage.notification) {
        msg = remoteMessage.notification;
      } else {
        msg = remoteMessage.data;
      }

      if (remoteMessage.data.bypass === 'true') {
        ShowPopup(remoteMessage);
      } else {
        Alert.alert(msg.title, msg.body, [
          {
            text: '닫기',
          },
        ]);
      }
    });
    return unsubscribe;
  });

  return <RootRouter />;
};

export default App;
