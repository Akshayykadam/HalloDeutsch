// Haptics utility - centralized haptic feedback for the app
// Wraps expo-haptics with semantic feedback types

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptics = {
    // Light tap - for button presses, navigation
    light: () => {
        if (isHapticsAvailable) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    },

    // Medium tap - for selections, toggles
    medium: () => {
        if (isHapticsAvailable) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    },

    // Heavy tap - for important actions
    heavy: () => {
        if (isHapticsAvailable) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    },

    // Correct answer - success notification
    success: () => {
        if (isHapticsAvailable) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    },

    // Wrong answer - error notification
    error: () => {
        if (isHapticsAvailable) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    },

    // Warning - caution notification
    warning: () => {
        if (isHapticsAvailable) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    },

    // Selection changed
    selection: () => {
        if (isHapticsAvailable) {
            Haptics.selectionAsync();
        }
    },
};
