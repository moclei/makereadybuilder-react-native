import React from 'react';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {
  View,
  Text,
  StyleSheet,
  Platform, TouchableOpacity,
} from 'react-native';
import {Toolbar, ToolbarContent} from "react-native-paper";

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


export default class SignInScreen extends React.PureComponent {
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
    const { user, error } = this.state;
    if (!user) {
      return (
        <View style={styles.container}>
          <GoogleSigninButton
            style={{ width: 212, height: 48 }}
            size={GoogleSigninButton.Size.Standard}
            color={GoogleSigninButton.Color.Auto}
            onPress={this._signIn}
          />
          {error && (
            <Text>
              {error.toString()} code: {error.code}
            </Text>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
            Welcome {user.name}
          </Text>
          <Text>Your email is: {user.email}</Text>

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
    await this._configureGoogleSignIn();
    await this._getCurrentUser().then(() => {
      //console.log('SignIngScreen componentDidMount: ' + this.state.user);
      this._goToHome(this.state.user);
    });
  }

  async _configureGoogleSignIn() {
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

  async _getCurrentUser() {
    try {
      const user = await GoogleSignin.currentUserAsync();
      this.setState({ user, error: null });
      console.log('SignIngScreen componentDidMount: ' + this.state.user);
      // this._goToHome(this.state.user);
    } catch (error) {
      this.setState({
        error,
      });
    }
  }


  _signIn = async () => {
    try {
      const user = await GoogleSignin.signIn();
      this.setState({ user, error: null });
      console.log('This should show once');
    } catch (error) {
      if (error.code === 'CANCELED') {
        error.message = 'user canceled the login flow';
      }
      this.setState({
        error,
      });
    }
  };

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
    console.log('SignInScreen user: ' + user);
    this.props.navigation.navigate('Home', {user: user});
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

