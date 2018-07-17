import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {Text, Toolbar, ToolbarAction, ToolbarBackAction, ToolbarContent} from "react-native-paper";

class LogoTitle extends React.Component {
    render() {
        return (
            <Toolbar style={styles.toolbar}>
                <ToolbarAction icon="menu" onPress={this._toggleDrawer} />
                <ToolbarContent
                    title="Lightning Turnovers"
                />
            </Toolbar>
        );
    }
    _toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    };
}

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Home Drawer Label',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
    };

    render() {
        return (

            <LogoTitle navigation={this.props.navigation}/>

        );
    }


}

const styles = StyleSheet.create({
    bigblue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    red: {
        color: 'red',
    },
    listitem: {
        flex: 1,
        paddingVertical: 0,
        paddingHorizontal: 8,
        marginHorizontal: 8
    },
    toolbar: {
        backgroundColor: '#FF0266',
    }
});

