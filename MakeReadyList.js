/**
 * Copyright Marc O Cleirigh 2018
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {
    FlatList,
    StyleSheet,
    View
} from 'react-native';
import MakeReadyListItem from './MakeReadyListItem';
import {Toolbar, ToolbarAction, ToolbarContent} from "react-native-paper";

type Props = {};

class LogoTitle extends React.Component {
    render() {
        return (
            <Toolbar style={styles.toolbar}>
                <ToolbarAction icon="menu" onPress={this._toggleDrawer} />
                    <ToolbarContent
                        title="Make Ready List"
                    />
            </Toolbar>
        );
    }
    _toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    };
}

export default class App extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
          drawerLabel: 'Make Ready List',
          headerTitle: <LogoTitle navigation={navigation}/>,
        };
    };


    constructor() {
        super();
        this.ref = firebase.firestore().collection('makereadies');
        this.unsubscribe = null;
        this.state = {
            textInput: '',
            loading: true,
            makereadies: []
        };
    }

    componentDidMount() {
         this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      // this.unsubscribe = this.ref.orderBy("population", "desc")
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    onCollectionUpdate = (querySnapshot) => {
        const unsortedMakereadies = [];
        querySnapshot.forEach((doc) => {
            const { timestamp, email, propertyName, preparerName, unit,
                scope, contracts,  } = doc.data();
          unsortedMakereadies.push({
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
      const makereadies = [...unsortedMakereadies]
      makereadies.sort((a, b) => {

        let timeA = new Date(a.timestamp.split(',')[0]);
        let timeB = new Date(b.timestamp.split(',')[0]);
        const result = timeA < timeB;
        //console.log('sort:a : ' + timeA + ', b: ' + timeB + ' result ' + result);
        return timeA > timeB ? -1 : timeA < timeB ? 1 : 0;
      });

      // console.log('makereadies sorted: ' + makereadies);
      this.setState({
        makereadies: makereadies,
        loading: false,
      });
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    render() {
        if (this.state.loading) {
            return null; // or render a loading icon
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.makereadies}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </View>
        );
    }
    _renderItem = ({item}) => (
        <MakeReadyListItem
            item={item}
            navigation={this.props.navigation}
            onPressItem={this._onPressItem}
            ItemSeparatorComponent={this.renderSeparator}
        />
    );
    _onPressItem = (mr) => {
        console.log('onPressItem: item: ' +  mr );
        this.props.navigation.navigate('MakeReadyDetail', {mr: mr})
    };
    _toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    };
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
    toolbar: {
        flex: 1,
        backgroundColor: '#FF0266',
    },
    title: {
        color: '#FFF',
        fontSize: 20,
    },
    titleButton: {
        paddingLeft: 0,
        marginLeft: 0,
        color: '#FFF',
        fontSize: 20,
    }
});
