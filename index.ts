import { registerRootComponent } from 'expo';
import * as WebBrowser from 'expo-web-browser';

import App from './App';

WebBrowser.maybeCompleteAuthSession();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
