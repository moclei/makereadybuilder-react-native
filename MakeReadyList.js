/**
 * Copyright Marc O Cleirigh 2018
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import MakeReadyListItem from './MakeReadyListItem';
import {Card, CardContent, Toolbar, ToolbarAction, ToolbarContent} from "react-native-paper";
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

type Props = {};

class LogoTitle extends React.Component {
  render() {
    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarAction icon="menu" onPress={this._toggleDrawer}/>
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

class MakeReadyList extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      drawerLabel: 'Make Ready List',
      headerTitle: <LogoTitle navigation={navigation}/>,
    };
  };
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      textInput: '',
      loading: true,
      makereadies: []
    };
  }

  componentDidMount() {
    const {firestore} = this.context.store;
    //firestore.get('makereadies');
    firestore.get({
      collection: 'makereadies',
      orderBy: ['timestamp', 'asc'],
      // orderBy: 'state' // string notation can also be used
    },);
    // this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

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
    return (
      <View style={styles.container}>
        {this.renderList()}
      </View>
    );
  }

  renderList() {
    if(this.props.makereadyData) {
        const makereadies = [...this.props.makereadyData];
        console.log('Make readies loaded');
        makereadies.sort((a, b) => {
          let timeA = new Date(a.timestamp.split(',')[0]);
          let timeB = new Date(b.timestamp.split(',')[0]);
          const result = timeA < timeB;
          return timeA > timeB ? -1 : timeA < timeB ? 1 : 0;
        });
      return (
        <View >
          <FlatList
            data={makereadies}
            renderItem={this._renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )
    } else {
      return (
        <Card>
          <CardContent>
            <ActivityIndicator size="large" color="#0000ff"/>
          </CardContent>
        </Card>
      )
    }
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
    console.log('onPressItem: item: ' + mr);
    this.props.navigation.navigate('MakeReadyDetail', {mr: mr})
  };
  _toggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  };
}


const mapStateToProps = (state) => {
  let orderedData = state.firestore.ordered.makereadies;
  return {
    makereadyData: orderedData
  }
};
export default connect(mapStateToProps)(MakeReadyList)

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
