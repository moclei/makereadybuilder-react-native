import React from 'react';
import { TouchableHighlight, View, Text, Image} from 'react-native';
import {
    getTheme,
    MKButton,
    MKColor,
    MKIconToggle,
} from 'react-native-material-kit';

const theme = getTheme();
const styles = require('./styles');

export default class MakeReady extends React.PureComponent {
    // toggle a todo as completed or not via update()
    toggleComplete() {
        this.props.doc.ref.update({
            complete: !this.props.complete,
        });
    }

    render() {

        var base64Icon = 'http://www.getmdl.io/assets/demos/welcome_card.jpg';
        var action = (<Text> My action</Text>);
        var menu = (
            <MKIconToggle
                checked={true}
                onCheckedChange={this._onIconChecked}
                onPress={this._onIconClicked}
            >
                <Text pointerEvents="none"
                      style={styles.toggleTextOff}>Off</Text>
                <Text state_checked={true}
                      pointerEvents="none"
                      style={[styles.toggleText, styles.toggleTextOn]}>On</Text>
            </MKIconToggle>
        );
        return (
            <TouchableHighlight
                onPress={() => this.toggleComplete()}>
            <View style={theme.cardStyle}>
                <Image source={{uri : base64Icon}} style={theme.cardImageStyle} />
                <Text style={theme.cardTitleStyle}>Welcome</Text>
                <Text style={theme.cardContentStyle}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris sagittis pellentesque lacus eleifend lacinia...
                </Text>
                <View style={theme.cardMenuStyle}>{menu}</View>
                <Text style={theme.cardActionStyle}>My Action</Text>
            </View>
            </TouchableHighlight>

            /*<TouchableHighlight
                onPress={() => this.toggleComplete()}>
                <View style={{ flex: 1, height: 48, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 8 }}>
                        <Text>Timestamp: {this.props.timestamp}</Text>
                        <Text>Email: {this.props.email}</Text>
                        <Text>Property: {this.props.propertyName}</Text>
                        <Text>Unit: {this.props.unit.unitName}</Text>
                        <Text>Scope: {this.props.scope.scopeDescription}</Text>
                        <Text>Contracts: {this.props.contracts.length}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        {this.props.complete && (
                            <Text>COMPLETE</Text>
                        )}
                    </View>
                </View>
            </TouchableHighlight>*/

        );
    }
}
