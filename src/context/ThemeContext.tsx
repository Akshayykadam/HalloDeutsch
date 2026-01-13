import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '../theme/colors';
import { useSettingsStore } from '../store';

type ThemeType = typeof LightTheme;

interface ThemeContextType {
    theme: ThemeType;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const { settings, toggleTheme, updateSettings } = useSettingsStore();

    const activeThemeMode = settings.theme === 'system' ? systemScheme : settings.theme;
    const isDark = activeThemeMode === 'dark';
    const theme = isDark ? DarkTheme : LightTheme;

    const querySetTheme = (mode: 'light' | 'dark' | 'system') => {
        updateSettings({ theme: mode });
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme: querySetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
