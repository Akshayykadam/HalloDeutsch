// Button Component - Primary, Secondary, Ghost variants
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, FontSize, FontWeight, Layout } from '../../theme';
import { useSettingsStore } from '../../store';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    style,
    textStyle,
}) => {
    const { settings } = useSettingsStore();

    const handlePress = () => {
        if (settings.hapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (size) {
            case 'small':
                return {
                    container: {
                        height: Layout.smallButtonHeight,
                        paddingHorizontal: Spacing.md,
                    },
                    text: { fontSize: FontSize.sm },
                };
            case 'large':
                return {
                    container: {
                        height: 56,
                        paddingHorizontal: Spacing.xl,
                    },
                    text: { fontSize: FontSize.md },
                };
            default:
                return {
                    container: {
                        height: Layout.buttonHeight,
                        paddingHorizontal: Spacing.lg,
                    },
                    text: { fontSize: FontSize.base },
                };
        }
    };

    const getVariantStyles = (): {
        container: ViewStyle;
        text: TextStyle;
        gradient?: string[];
    } => {
        switch (variant) {
            case 'secondary':
                return {
                    container: {
                        backgroundColor: Colors.primary[100],
                        borderWidth: 0,
                    },
                    text: { color: Colors.primary[600] },
                };
            case 'ghost':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderColor: Colors.primary[500],
                    },
                    text: { color: Colors.primary[500] },
                };
            case 'danger':
                return {
                    container: {},
                    text: { color: Colors.white },
                    gradient: [Colors.error[500], Colors.error[600]],
                };
            case 'success':
                return {
                    container: {},
                    text: { color: Colors.white },
                    gradient: [Colors.success[500], Colors.success[600]],
                };
            default:
                return {
                    container: {},
                    text: { color: Colors.white },
                    gradient: [Colors.primary[500], Colors.primary[600]],
                };
        }
    };

    const sizeStyles = getSizeStyles();
    const variantStyles = getVariantStyles();
    const isDisabled = disabled || loading;

    const content = (
        <>
            {loading ? (
                <ActivityIndicator
                    color={variantStyles.text.color}
                    size="small"
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <>{icon}</>
                    )}
                    <Text
                        style={[
                            styles.text,
                            sizeStyles.text,
                            variantStyles.text,
                            icon ? { marginLeft: iconPosition === 'left' ? Spacing.sm : 0 } : undefined,
                            icon ? { marginRight: iconPosition === 'right' ? Spacing.sm : 0 } : undefined,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <>{icon}</>
                    )}
                </>
            )}
        </>
    );

    if (variantStyles.gradient && !isDisabled) {
        return (
            <TouchableOpacity
                onPress={handlePress}
                disabled={isDisabled}
                activeOpacity={0.8}
                style={[
                    fullWidth && styles.fullWidth,
                    style,
                ]}
            >
                <LinearGradient
                    colors={variantStyles.gradient as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.container,
                        sizeStyles.container,
                        isDisabled && styles.disabled,
                    ]}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={[
                styles.container,
                sizeStyles.container,
                variantStyles.container,
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
    },
    text: {
        fontWeight: FontWeight.semibold,
        textAlign: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
});
