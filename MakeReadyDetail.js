import React from 'react';
import {
    View,
    StyleSheet,
    ToolbarAndroid
} from 'react-native';
import {
    Title,
    Paragraph,
    TouchableRipple, Text
} from 'react-native-paper';

export default class MakeReadyDetail extends React.PureComponent {
    render() {
        const data = this.props.navigation.getParam('mr', {});
        let createdOn = data.timestamp.split(',')[0];
        let servAgs = data.contracts.filter(contract => contract);
        return (

            <View >
                    <View>
                        <Title>{data.propertyName} {data.unit.unitName}, {data.scope.mrType}</Title>
                        <Paragraph>{createdOn}</Paragraph>
                        <Paragraph>Prepared by {data.preparerName} ({data.email})</Paragraph>
                    </View>
            </View>
        );
    }
}

function showObject(obj, append: string) {
    let result = "";
    for (let p in obj) {
        if( obj.hasOwnProperty(p) ) {
            result += append + ": " + p + " , " + obj[p] + "\n";
        }
    }
    console.log(result);
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
    containerToolbar: {
        flex: 1,
        //justifyContent: 'center',
        justifyContent: 'flex-start',
        // https://github.com/facebook/react-native/issues/2957#event-417214498
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
});
/*<Icon.ToolbarAndroid
                   title="Make Ready Details"
                   titleColor="black"
                   style={styles.toolbar}
                   navIconName="md-arrow-back"
                   onIconClicked={() => navigate('Home', { data: 'Jane' })}
               >
               </Icon.ToolbarAndroid>*/