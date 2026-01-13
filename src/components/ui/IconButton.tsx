// IconButton Component - Circular icon buttons
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Shadows, Layout } from '../../theme';
import { useSettingsStore } from '../../store';

interface IconButtonProps {
    icon: React.ReactNode;
    onPress: () => void;
    variant?: 'filled' | 'outlined' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    color?: string;
    disabled?: boolean;
    style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    onPress,
    variant = 'ghost',
    size = 'medium',
    color = Colors.primary[500],
    disabled = false,
    style,
}) => {
    const { settings } = useSettingsStore();

    const handlePress = () => {
        if (settings.hapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    const getSizeValue = (): number => {
        switch (size) {
            case 'small':
                return 32;
            case 'large':
                return 56;
            default:
                return 44;
        }
    };

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'filled':
                return {
                    backgroundColor: color,
                    ...Shadows.sm,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: color,
                };
            default:
                return {
                    backgroundColor: 'transparent',
                };
        }
    };

    const sizeValue = getSizeValue();

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.7}
            style={[
                styles.container,
                getVariantStyles(),
                {
                    width: sizeValue,
                    height: sizeValue,
                    borderRadius: sizeValue / 2,
                },
                disabled && styles.disabled,
                style,
            ]}
        >
            {icon}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
});
