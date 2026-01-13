// Card Component - Elevated container for content
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'flat' | 'outlined' | 'gradient';
    padding?: 'none' | 'small' | 'medium' | 'large';
    gradientColors?: string[];
    style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'elevated',
    padding = 'medium',
    gradientColors,
    style,
}) => {
    const { theme, isDark } = useTheme();

    const getPaddingValue = (): number => {
        switch (padding) {
            case 'none':
                return 0;
            case 'small':
                return Spacing.sm;
            case 'large':
                return Spacing.xl;
            default:
                return Spacing.base;
        }
    };

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'flat':
                return {
                    backgroundColor: theme.background.secondary,
                };
            case 'outlined':
                return {
                    backgroundColor: theme.background.primary,
                    borderWidth: 1,
                    borderColor: theme.border.light,
                };
            default:
                // Elevated variant - different styles for light and dark mode
                if (isDark) {
                    return {
                        backgroundColor: theme.background.primary,
                        borderWidth: 1,
                        borderColor: theme.border.light,
                        shadowOpacity: 0,
                        shadowRadius: 0,
                        shadowOffset: { width: 0, height: 0 },
                        elevation: 0,
                    };
                }
                return {
                    backgroundColor: theme.background.primary,
                    borderWidth: 0,
                    borderColor: 'transparent',
                    ...Shadows.md,
                };
        }
    };

    if (variant === 'gradient') {
        const colors = gradientColors || [Colors.primary[500], Colors.primary[600]];
        return (
            <LinearGradient
                colors={colors as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.container,
                    { padding: getPaddingValue() },
                    style,
                ]}
            >
                {children}
            </LinearGradient>
        );
    }

    return (
        <View
            style={[
                styles.container,
                getVariantStyles(),
                { padding: getPaddingValue() },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
});
