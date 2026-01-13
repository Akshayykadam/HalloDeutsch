console.log('JS Bundle Executing - index.ts loaded');
import { registerRootComponent } from 'expo';

import App from './App';

console.log('Imported App component:', App);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
try {
    console.log('Calling registerRootComponent(App)...');
    registerRootComponent(App);
    console.log('registerRootComponent returned');
} catch (error) {
    console.error('Failed to register root component:', error);
}
