// Polyfills for Gemini Live API WebSocket support in React Native
// This file should be imported at the top of App.tsx

import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

// Ensure global WebSocket is available (React Native has it, but may need explicit reference)
if (typeof global.WebSocket === 'undefined' && typeof WebSocket !== 'undefined') {
    global.WebSocket = WebSocket;
}

// Polyfill for setImmediate (used in some async operations)
if (typeof global.setImmediate === 'undefined') {
    (global as any).setImmediate = (fn: () => void) => setTimeout(fn, 0);
}

console.log('Polyfills loaded for Gemini Live API');
