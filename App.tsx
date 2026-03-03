// German Learner App - Main Entry Point
// Import polyfills first for Gemini Live API support
import './src/polyfills';
import { startTransition, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation';
import { Text, TextInput } from 'react-native';

// Disable system font scaling to maintain consistent UI
// @ts-ignore
if (Text.defaultProps == null) Text.defaultProps = {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;

// @ts-ignore
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

import { ThemeProvider } from './src/context/ThemeContext';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { ConnectivityGuard } from './src/components/common/ConnectivityGuard';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';

import { useDailyTracker } from './src/hooks';
import { initializeTTS, isModelDownloaded, downloadModel } from './src/services/audioService';
import { seedDatabase } from './src/services/adminService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Increment this version to force re-sync on next app launch
const CONTENT_VERSION = '1.1';
const CONTENT_VERSION_KEY = '@content_version';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  useDailyTracker();

  useEffect(() => {
    const setupApp = async () => {
      try {
        // Auto-sync content disabled - triggers Firestore permission errors
        // To re-enable, uncomment the block below and ensure Firestore rules allow writes
        // const storedVersion = await AsyncStorage.getItem(CONTENT_VERSION_KEY);
        // if (storedVersion !== CONTENT_VERSION) {
        //   console.log(`Content sync needed: ${storedVersion} → ${CONTENT_VERSION}`);
        //   await seedDatabase((status, progress) => {
        //     // Silent background sync
        //   });
        //   await AsyncStorage.setItem(CONTENT_VERSION_KEY, CONTENT_VERSION);
        //   console.log('Content sync complete');
        // }
      } catch (error) {
        console.error('Auto-sync error:', error);
      }

      // TTS Setup
      try {
        const modelExists = await isModelDownloaded();

        if (!modelExists) {
          // Download in background - don't block the app
          downloadModel((progress) => {
            // Optional: minimal logging or remove entirely
          }).then((success) => {
            if (success) {
              initializeTTS();
            }
          });
        }

        // Initialize TTS immediately (will use fallback if model not ready)
        await initializeTTS();
      } catch (error) {
        console.error('TTS setup error:', error);
      }
    };

    setupApp();
  }, []);

  if (showSplash) {
    return (
      <AnimatedSplash onAnimationComplete={() => setShowSplash(false)} />
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ConnectivityGuard>
            <StatusBar style="auto" />
            <AppNavigator />
          </ConnectivityGuard>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
