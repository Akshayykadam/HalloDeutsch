// Input Component - Text inputs with validation states
import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TextInputProps,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, FontWeight, Layout, LightTheme } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerStyle,
    inputStyle,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return Colors.error[500];
        if (isFocused) return Colors.primary[500];
        return LightTheme.border.medium;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    { borderColor: getBorderColor() },
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? { paddingLeft: 0 } : undefined,
                        rightIcon ? { paddingRight: 0 } : undefined,
                        inputStyle,
                    ]}
                    placeholderTextColor={Colors.neutral[400]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...textInputProps}
                />
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.base,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: LightTheme.text.primary,
        marginBottom: Spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Layout.inputHeight,
        borderWidth: 1.5,
        borderRadius: BorderRadius.md,
        backgroundColor: LightTheme.background.primary,
        paddingHorizontal: Spacing.md,
    },
    inputFocused: {
        borderWidth: 2,
    },
    inputError: {
        borderColor: Colors.error[500],
    },
    input: {
        flex: 1,
        fontSize: FontSize.base,
        color: LightTheme.text.primary,
        paddingVertical: 0,
    },
    iconLeft: {
        marginRight: Spacing.sm,
    },
    iconRight: {
        marginLeft: Spacing.sm,
    },
    errorText: {
        fontSize: FontSize.sm,
        color: Colors.error[500],
        marginTop: Spacing.xs,
    },
    hintText: {
        fontSize: FontSize.sm,
        color: LightTheme.text.tertiary,
        marginTop: Spacing.xs,
    },
});
