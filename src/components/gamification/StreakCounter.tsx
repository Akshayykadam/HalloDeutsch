// StreakCounter Component - Animated flame streak display
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSize, FontWeight, Shadows } from '../../theme';

interface StreakCounterProps {
    streak: number;
    size?: 'small' | 'medium' | 'large';
}

export const StreakCounter: React.FC<StreakCounterProps & { style?: any }> = ({
    streak,
    size = 'medium',
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse animation for active streaks
        if (streak > 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [streak]);

    useEffect(() => {
        // Bounce animation on streak change
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.2,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [streak]);

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { iconSize: 16, fontSize: FontSize.md, padding: Spacing.sm };
            case 'large':
                return { iconSize: 32, fontSize: FontSize['2xl'], padding: Spacing.lg };
            default:
                return { iconSize: 24, fontSize: FontSize.xl, padding: Spacing.md };
        }
    };

    const sizeStyles = getSizeStyles();
    const isActive = streak > 0;

    return (
        <Animated.View
            style={[
                styles.container,
                style,
                { transform: [{ scale: scaleAnim }] },
            ]}
        >
            <LinearGradient
                colors={
                    isActive
                        ? [Colors.secondary[400], Colors.secondary[600]]
                        : [Colors.neutral[300], Colors.neutral[400]]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.gradient,
                    {
                        paddingHorizontal: sizeStyles.padding,
                        paddingVertical: sizeStyles.padding / 2,
                    },
                ]}
            >
                <Ionicons
                    name="flame"
                    size={sizeStyles.iconSize}
                    color={Colors.white}
                    style={styles.flame}
                />
                <Text style={[styles.count, { fontSize: sizeStyles.fontSize }]}>
                    {streak}
                </Text>
            </LinearGradient>
        </Animated.View>
    );
};

// XP Counter Component - Animated XP display with gain effect
interface XPCounterProps {
    xp: number;
    dailyGoal?: number;
    size?: 'small' | 'medium' | 'large';
}

export const XPCounter: React.FC<XPCounterProps> = ({
    xp,
    dailyGoal,
    size = 'medium',
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { fontSize: FontSize.sm, iconSize: 14, padding: Spacing.xs };
            case 'large':
                return { fontSize: FontSize.xl, iconSize: 24, padding: Spacing.md };
            default:
                return { fontSize: FontSize.base, iconSize: 18, padding: Spacing.sm };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <View style={styles.xpContainer}>
            <LinearGradient
                colors={[Colors.gold[400], Colors.gold[500]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.xpGradient,
                    { paddingHorizontal: sizeStyles.padding, paddingVertical: sizeStyles.padding / 2 },
                ]}
            >
                <Ionicons
                    name="flash"
                    size={sizeStyles.iconSize}
                    color={Colors.white}
                    style={styles.xpIcon}
                />
                <Text style={[styles.xpValue, { fontSize: sizeStyles.fontSize }]}>
                    {xp}
                </Text>
                {dailyGoal && (
                    <Text style={[styles.xpGoal, { fontSize: sizeStyles.fontSize * 0.7 }]}>
                        / {dailyGoal}
                    </Text>
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        ...Shadows.sm,
    },
    flame: {
        marginRight: Spacing.xxs,
    },
    count: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
    },
    xpContainer: {
        alignSelf: 'flex-start',
    },
    xpGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        ...Shadows.sm,
    },
    xpIcon: {
        marginRight: Spacing.xxs,
        marginTop: 1,
    },
    xpValue: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
    },
    xpGoal: {
        color: Colors.white,
        opacity: 0.8,
        marginLeft: 2,
    },
});
