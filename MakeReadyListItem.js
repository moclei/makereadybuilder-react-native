import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import {
    Title,
    Paragraph,
    TouchableRipple
} from 'react-native-paper';

export default class MakeReadyListItem extends React.PureComponent {
    _onPress = () => {
        console.log("MakeReadyListItem onPress,this.props.mr: " + this.props.item);
        this.props.onPressItem(this.props.item);
    };
    render() {
        let createdOn = this.props.item.timestamp.split(',')[0];
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.listitem}>
                <TouchableRipple
                    onPress={this._onPress}
                    // onPress={(item) => navigate('Detail', { data: item})}
                    rippleColor="rgba(0, 0, 0, .32)">
                    <View>
                        <Title>{this.props.item.propertyName} {this.props.item.unit.unitName}, {this.props.item.scope.mrType}</Title>
                        <Paragraph>{createdOn}</Paragraph>
                        <Paragraph>Prepared by {this.props.item.preparerName} ({this.props.item.email})</Paragraph>
                    </View>
                </TouchableRipple>
            </View>
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

    }
});