/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import Home from './src/pages/Home';
import {name as appName} from './app.json';
import {ApplicationProvider} from '@ui-kitten/components';
import {mapping, light as lightTheme} from '@eva-design/eva';

const App = () => (
  <ApplicationProvider mapping={mapping} theme={lightTheme}>
    <Home />
  </ApplicationProvider>
);

AppRegistry.registerComponent(appName, () => App);
