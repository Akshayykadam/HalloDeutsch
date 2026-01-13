// Badge Component - Achievement and status badges
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, FontSize, FontWeight, LevelColors } from '../../theme';
import { CEFRLevel } from '../../types';

interface BadgeProps {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'level';
    level?: CEFRLevel;
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'default',
    level,
    size = 'medium',
    icon,
    style,
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    paddingHorizontal: Spacing.xs,
                    paddingVertical: 2,
                    fontSize: FontSize.xs,
                };
            case 'large':
                return {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.xs,
                    fontSize: FontSize.base,
                };
            default:
                return {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 3,
                    fontSize: FontSize.sm,
                };
        }
    };

    const getVariantStyles = () => {
        if (variant === 'level' && level) {
            return {
                backgroundColor: LevelColors[level],
                textColor: Colors.white,
            };
        }

        switch (variant) {
            case 'success':
                return {
                    backgroundColor: Colors.success[100],
                    textColor: Colors.success[700],
                };
            case 'warning':
                return {
                    backgroundColor: Colors.warning[100],
                    textColor: Colors.warning[700],
                };
            case 'error':
                return {
                    backgroundColor: Colors.error[100],
                    textColor: Colors.error[700],
                };
            case 'info':
                return {
                    backgroundColor: Colors.primary[100],
                    textColor: Colors.primary[700],
                };
            default:
                return {
                    backgroundColor: Colors.neutral[200],
                    textColor: Colors.neutral[700],
                };
        }
    };

    const sizeStyles = getSizeStyles();
    const variantStyles = getVariantStyles();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: variantStyles.backgroundColor,
                    paddingHorizontal: sizeStyles.paddingHorizontal,
                    paddingVertical: sizeStyles.paddingVertical,
                },
                style,
            ]}
        >
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text
                style={[
                    styles.label,
                    {
                        color: variantStyles.textColor,
                        fontSize: sizeStyles.fontSize,
                    },
                ]}
            >
                {label}
            </Text>
        </View>
    );
};

// XP Badge with special styling
export const XPBadge: React.FC<{ xp: number; size?: 'small' | 'medium' | 'large' }> = ({
    xp,
    size = 'medium',
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { padding: Spacing.xs, fontSize: FontSize.sm };
            case 'large':
                return { padding: Spacing.md, fontSize: FontSize.lg };
            default:
                return { padding: Spacing.sm, fontSize: FontSize.base };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <LinearGradient
            colors={[Colors.gold[400], Colors.gold[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.xpBadge, { paddingHorizontal: sizeStyles.padding, paddingVertical: sizeStyles.padding / 2 }]}
        >
            <Text style={[styles.xpText, { fontSize: sizeStyles.fontSize }]}>
                +{xp} XP
            </Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    iconContainer: {
        marginRight: Spacing.xs,
    },
    label: {
        fontWeight: FontWeight.medium,
    },
    xpBadge: {
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    xpText: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
    },
});
