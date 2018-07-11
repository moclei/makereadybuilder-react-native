/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {Button, FlatList, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import MakeReady from './MakeReady';
import {getTheme} from 'react-native-material-kit';

const theme = getTheme();

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

    constructor() {
        super();
        this.ref = firebase.firestore().collection('makereadies');
        this.unsubscribe = null;
        this.state = {
            textInput: '',
            loading: true,
            makereadies: [],
        };
    }
    updateTextInput(value) {
        this.setState({ textInput: value });
    }
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    onCollectionUpdate = (querySnapshot) => {
        const makereadies = [];
        querySnapshot.forEach((doc) => {
            const { timestamp, email, propertyName, preparerName, unit,
                    scope, contracts,  } = doc.data();
            makereadies.push({
                key: doc.id,
                doc, // DocumentSnapshot
                timestamp,
                email,
                propertyName,
                preparerName,
                unit,
                scope,
                contracts,
            });
        });
        this.setState({
            makereadies,
            loading: false,
        });
    };
    addTodo() {
        /*
        this.ref.add({
            title: this.state.textInput,
            complete: false,
        });
        this.setState({
            textInput: '',
        });
        */
    }

  render() {

      if (this.state.loading) {
          return null; // or render a loading icon
      }

    return (
    /*    <div>
          <View style={styles.container}>
            <Text style={styles.welcome}>Welcome to React Native Marc!</Text>
            <Text style={styles.instructions}>To get started, edit App.js</Text>
            <Text style={styles.instructions}>{instructions}</Text>
          </View>*/

            <View style={{ flex: 1 }}>

                <FlatList
                    data={this.state.makereadies}
                    renderItem={({ item }) => <MakeReady {...item} />}
                />
                <TextInput
                    placeholder={'Add TODO'}
                    value={this.state.textInput}
                    onChangeText={(text) => this.updateTextInput(text)}
                />
                <Button
                    title={'Add TODO'}
                    disabled={!this.state.textInput.length}
                    onPress={() => this.addTodo()}
                />
            </View>
       // </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
