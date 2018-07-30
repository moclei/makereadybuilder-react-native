import React, { Component } from 'react'
import MakeReadyList from './MakeReadyList';
import MakeReadyDetail from "./MakeReadyDetail";
import {
  createDrawerNavigator,
  createStackNavigator, createSwitchNavigator,
} from 'react-navigation';
import HomeScreen from "./HomeScreen";
import SignInScreen from "./SignInScreen";
import AuthLoadingScreen from "./AuthLoadingScreen";
import SignOutScreen from "./SignOutScreen";
import {Provider} from "react-redux";
import * as Platform from "react-native/Libraries/Utilities/Platform.android";
import 'es6-symbol/implement';

if (Platform.OS === 'android') {
  console.log('Platform is android');
  if (typeof Symbol === 'undefined') {
    if (Array.prototype['@@iterator'] === undefined) {
      Array.prototype['@@iterator'] = function() {
        let i = 0;
        return {
          next: () => ({
            done: i >= this.length,
            value: this[i++],
          }),
        };
      };
    }
  }
}

// START React Native Firestore Redux
import { createStore, combineReducers, compose } from 'redux'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import firebase from 'react-native-firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDS3GHD2j5cxhv3vyZMaFAmkRDIxBrwf_k",
  authDomain: "hcpdash-frontend.firebaseapp.com",
  databaseURL: "https://hcpdash-frontend.firebaseio.com",
  projectId: "hcpdash-frontend",
  storageBucket: "hcpdash-frontend.appspot.com",
  messagingSenderId: "603056598967"
}; // from Firebase Console
const rfConfig = {}; // optional redux-firestore Config Options

// Initialize firebase instance
// firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore through Firebase

firebase.firestore();

// Add reduxFirestore store enhancer to store creator
const createStoreWithFirebase = compose(
  reduxFirestore(firebase, rfConfig), // firebase instance as first argument, rfConfig as optional second
)(createStore);

// Add Firebase to reducers
const rootReducer = combineReducers({
  firestore: firestoreReducer
});

// Create store with reducers and initial state
const initialState = {};
const myFireStore = createStoreWithFirebase(rootReducer, initialState);
// END

class Navigator extends React.Component {
  render() {
    return <Provider store={myFireStore}><RootNavigator /></Provider>;
  }
}

const MakeReadyStack = createStackNavigator({
  MakeReadyList: {
    screen: MakeReadyList,
  },
  MakeReadyDetail: {
    screen: MakeReadyDetail,

  },
});

MakeReadyStack.navigationOptions = {
  drawerLabel: 'Make Ready List',
};

const AppStack = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    MakeReadyStack: {
      screen: MakeReadyStack,
    },
    SignOutScreen: {
      screen: SignOutScreen,
    },
  },
  {
    //initialRouteName: 'AuthAppLoading',
    initialRouteName: 'Home',
  },
);

const AuthStack = createStackNavigator(
  {
    SignIn: SignInScreen,
  },
);

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    //initialRouteName: 'AuthAppLoading',
    // initialRouteName: 'App',
    initialRouteName: 'Auth',
  },
);

export default Navigator;