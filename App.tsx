// German Learner App - Main Entry Point
// Import polyfills first for Gemini Live API support
import './src/polyfills';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation';

import { ThemeProvider } from './src/context/ThemeContext';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { ConnectivityGuard } from './src/components/common/ConnectivityGuard';

import { useDailyTracker } from './src/hooks';
import { initializeTTS, isModelDownloaded, downloadModel } from './src/services/audioService';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  useDailyTracker();

  useEffect(() => {
    const setupTTS = async () => {
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

    setupTTS();
  }, []);

  if (showSplash) {
    return (
      <AnimatedSplash onAnimationComplete={() => setShowSplash(false)} />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ConnectivityGuard>
          <StatusBar style="auto" />
          <AppNavigator />
        </ConnectivityGuard>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
