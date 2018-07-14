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
    ToolbarAndroid,
    View
} from 'react-native';
import MakeReadyListItem from './MakeReadyListItem';

type Props = {};
export default class App extends Component<Props> {
    static navigationOptions = {
        title: 'Welcome'
    };
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
                <ToolbarAndroid
                    style={styles.toolbar}
                    title={this.props.title}
                    titleColor={'#FFFFFF'}/>
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
        this.props.navigation.navigate('Detail', {mr: mr})
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
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
