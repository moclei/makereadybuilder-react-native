import React from 'react';
import {GoogleSignin} from 'react-native-google-signin';
import {
  View,
  Text,
  StyleSheet,
  Platform, TouchableOpacity,
} from 'react-native';
import {Toolbar, ToolbarBackAction, ToolbarContent} from "react-native-paper";

class LogoTitle extends React.Component {
  render() {
    return (
      <Toolbar style={styles.toolbar}>

        <ToolbarContent
          title="Lightning Turnovers"
        />
      </Toolbar>
    );
  }
}


export default class SignOutScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle navigation={navigation}/>,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      error: null,
    };
  }

  render() {
    const user = this.props.navigation.getParam('user', {});
    // console.log('User: ' + user.name);
    // const { user, error } = this.state;
    if (!user) {
      console.log('SignOutScreen !user');
      //this._goToSignin();
      return (
        <View style={styles.container}>
          <Text>
              User is not signed in. Redirecting..
            </Text>
        </View>
      );


    } else {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
            Welcome {user.name}
          </Text>
          <Text>Your are signed in as: {user.email}</Text>

          <TouchableOpacity onPress={this._signOut}>
            <View style={{ marginTop: 50 }}>
              <Text>Log out</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }



  /*
  Below from Example app
   */

  async componentDidMount() {
  }

  async _getCurrentUser() {
    try {
      console.log('SignOutScreen getCurrentUser');
      const user = await GoogleSignin.currentUserAsync();
      this.setState({ user, error: null });
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async _configureGoogleSignIn() {
    console.log('SignOutScreen _configureGoogleSignIn');
    await GoogleSignin.hasPlayServices({ autoResolve: true });
    const configPlatform = {
      ...Platform.select({
        ios: {
          iosClientId: {},
        },
        android: {},
      }),
    };

    await GoogleSignin.configure({
      ...configPlatform,
      webClientId: '603056598967-i65l4teqm0kk7k18steg7i0vt9k2253i.apps.googleusercontent.com',
      offlineAccess: false,
      hostedDomain: 'hcptexas.com',
    });
  }

  _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  _goToHome(user) {
    // this.props.navigation.navigate('Home', {user: user});
  }
  _goToSignin() {
    // this.props.navigation.navigate('SignIn', {});
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
  toolbar: {
    flex: 1,
    backgroundColor: '#FF0266',
  },
});

