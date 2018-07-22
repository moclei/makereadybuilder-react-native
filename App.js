/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MakeReadyList from './MakeReadyList';
import MakeReadyDetail from "./MakeReadyDetail";
import {
  createDrawerNavigator,
  createStackNavigator, createSwitchNavigator,
} from 'react-navigation';
import HomeScreen from "./HomeScreen";
import SignInScreen from "./SignInScreen";
import AuthLoadingScreen from "./AuthLoadingScreen";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import SignOutScreen from "./SignOutScreen";

class LogoTitle extends React.Component {
  render() {
    return (
      <View style={styles.toolbar}>
        <Icon name="bars" size={24} color="#000"/>
        <Text>Make Ready Title</Text>
      </View>
    );
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
      navigationOptions: {
        drawerLabel: 'Sign Out',
      },
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

const App = createSwitchNavigator(
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

/*
const App = createStackNavigator({
    Home: {
        screen: MakeReady,
        navigationOptions: {
            drawerLabel: 'Home',
            title: 'Turnovers',
            drawerIcon: () => (
                <Icon name={'bars'} size={25} />
            )
        },

    },
    Detail: {
        screen: MakeReadyDetail,
        navigationOptions: {
            drawerLabel: 'Turnovers: Detail',
            title: 'Turnovers: Detail',
            drawerIcon: () => (
                <Icon name={'md-arrow-back'} size={25} />
            )
        },
    },
});
*/
export default App;

