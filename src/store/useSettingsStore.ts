// Settings store - handles app preferences and theme
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

interface SettingsState {
    settings: AppSettings;
    updateSettings: (updates: Partial<AppSettings>) => void;
    toggleTheme: () => void;
    reset: () => void;
}

const defaultSettings: AppSettings = {
    theme: 'dark',
    notificationsEnabled: true,
    reminderTime: '09:00',
    soundEnabled: true,
    hapticEnabled: true,
    autoPlayAudio: true,
    showTransliteration: false,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            settings: defaultSettings,

            updateSettings: (updates) =>
                set((state) => ({
                    settings: { ...state.settings, ...updates },
                })),

            toggleTheme: () =>
                set((state) => ({
                    settings: {
                        ...state.settings,
                        theme: state.settings.theme === 'dark' ? 'light' : 'dark',
                    },
                })),

            reset: () => set({ settings: defaultSettings }),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
