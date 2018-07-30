import React, { Component } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Navigator from './Navigator'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
  },
};

export default class App extends Component {
  render() {
    return (
        <PaperProvider theme={theme}>
          <Navigator />
        </PaperProvider>
    );
  }
}