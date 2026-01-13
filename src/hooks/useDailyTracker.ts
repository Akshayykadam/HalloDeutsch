import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useUserStore } from '../store';

export const useDailyTracker = () => {
    const { addMinutes, resetDailyProgress, progress } = useUserStore();
    const appState = useRef(AppState.currentState);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check for new day
    const checkNewDay = () => {
        const today = new Date().toISOString().split('T')[0];
        if (progress.lastActiveDate !== today) {
            resetDailyProgress();
        }
    };

    // Start tracking
    const startTracking = () => {
        if (intervalRef.current) return;

        // Check day on start
        checkNewDay();

        intervalRef.current = setInterval(() => {
            addMinutes(1);
        }, 60000); // Every minute
    };

    // Stop tracking
    const stopTracking = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        // Initial check and start
        checkNewDay();
        startTracking();

        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App has come to the foreground
                checkNewDay();
                startTracking();
            } else if (nextAppState.match(/inactive|background/)) {
                // App has gone to the background
                stopTracking();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
            stopTracking();
        };
    }, []);
};
