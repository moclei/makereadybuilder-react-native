/** @format */

import {AppRegistry} from 'react-native';
import Navigator from './Navigator';
import {name as appName} from './app.json';
import React from "react";
import App from "./App";


export default function Main() {
  return (
    <App/>
  );
}

AppRegistry.registerComponent(appName, () => Navigator);
