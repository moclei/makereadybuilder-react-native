/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MakeReady from './MakeReady';
import MakeReadyDetail from "./MakeReadyDetail";
import {
    createStackNavigator,
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

let DrawerStack = createDrawerNavigator({ A });
let LoginStack = createSwitchNavigator({ B });

const MakeReadyStack = = createStackNavigator({
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

const AppStack = createDrawerNavigator({ Home: HomeScreen, Other: MakeReadyStack });

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
);


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

export default App;

