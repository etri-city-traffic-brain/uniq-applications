/**
 * @format
 */
import firebase from '@react-native-firebase/app';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background! index.js', remoteMessage);
});

// Firebase 구성 객체
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

console.log(firebase.apps.length + "firebase.apps.length");
if (firebase.apps.length === 0) {
   firebase.initializeApp(firebaseConfig);
} else {
 firebase.app();
}

const db = firebase.firestore();
const auth = firebase.auth();

if (Platform.OS === 'web') {
  const rootTag =
    document.getElementById('root') || document.getElementById('X');
  AppRegistry.runApplication('X', {rootTag});
}

AppRegistry.registerComponent(appName, () => App);
