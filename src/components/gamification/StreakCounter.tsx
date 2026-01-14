// StreakCounter Component - Animated flame streak display
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSize, FontWeight, Shadows } from '../../theme';

interface StreakCounterProps {
    streak: number;
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'card';
    label?: string;
    vertical?: boolean;
}

// Enhanced StreakCounter with cleaner UI
export const StreakCounter: React.FC<StreakCounterProps & { style?: any }> = ({
    streak,
    size = 'medium',
    variant = 'default',
    label,
    vertical = false,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Only animate on changes
    useEffect(() => {
        if (streak > 0) {
            Animated.sequence([
                Animated.spring(scaleAnim, { toValue: 1.1, useNativeDriver: true, friction: 3 }),
                Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
            ]).start();
        }
    }, [streak]);

    const getSizeStyles = () => {
        switch (size) {
            case 'small': return { iconSize: 20, fontSize: FontSize.lg, padding: 0 };
            case 'large': return { iconSize: 32, fontSize: FontSize['2xl'], padding: Spacing.md };
            default: return { iconSize: 24, fontSize: FontSize.xl, padding: Spacing.sm };
        }
    };

    const s = getSizeStyles();
    const isActive = streak > 0;

    return (
        <Animated.View style={[styles.container, style, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[
                styles.pill,
                variant === 'default'
                    ? (isActive ? styles.firePill : styles.inactivePill)
                    : styles.transparentPill,
                vertical && styles.verticalContainer,
                variant === 'default' && { paddingHorizontal: s.padding + (size === 'small' ? Spacing.xs : 0), paddingVertical: s.padding / 2 }
            ]}>
                <View style={styles.row}>
                    <Ionicons name="flame" size={s.iconSize} color={isActive ? Colors.warning[500] : (variant === 'card' ? Colors.white : Colors.neutral[500])} />
                    <Text style={[styles.valueText, {
                        fontSize: s.fontSize,
                        color: isActive ? Colors.warning[500] : (variant === 'card' ? Colors.white : Colors.neutral[600]),
                        marginLeft: 4
                    }]}>
                        {streak}
                    </Text>
                </View>
                {label && (
                    <Text style={[styles.labelText, {
                        fontSize: FontSize.xs,
                        color: variant === 'card' ? 'rgba(255,255,255,0.8)' : Colors.neutral[500],
                        marginTop: vertical ? 2 : 0,
                        marginLeft: vertical ? 0 : 6
                    }]}>
                        {label}
                    </Text>
                )}
            </View>
        </Animated.View >
    );
};

// XP Counter Component - Animated XP display with gain effect
interface XPCounterProps {
    xp: number;
    dailyGoal?: number;
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'card';
    label?: string;
    vertical?: boolean;
}

// Enhanced XPCounter with Daily Goal support
export const XPCounter: React.FC<XPCounterProps> = ({
    xp,
    dailyGoal,
    size = 'medium',
    variant = 'default',
    label,
    vertical = false,
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small': return { fontSize: FontSize.lg, iconSize: 20, padding: 0 };
            case 'large': return { fontSize: FontSize['2xl'], iconSize: 28, padding: Spacing.md };
            default: return { fontSize: FontSize.xl, iconSize: 24, padding: Spacing.sm };
        }
    };

    const s = getSizeStyles();

    return (
        <View style={styles.xpContainer}>
            <View style={[
                styles.pill,
                variant === 'default' ? styles.xpPill : styles.transparentPill,
                vertical && styles.verticalContainer,
                variant === 'default' && { paddingHorizontal: s.padding + (size === 'small' ? Spacing.xs : 0), paddingVertical: s.padding / 2 }
            ]}>
                <View style={styles.row}>
                    <Ionicons name="flash" size={s.iconSize} color={Colors.gold[400]} />
                    <Text style={[styles.valueText, {
                        fontSize: s.fontSize,
                        color: variant === 'card' ? Colors.white : Colors.secondary[700],
                        marginLeft: 4
                    }]}>
                        {xp}
                    </Text>
                    {dailyGoal && (
                        <Text style={[styles.goalText, {
                            fontSize: s.fontSize * 0.6,
                            color: variant === 'card' ? 'rgba(255,255,255,0.7)' : Colors.neutral[500],
                            alignSelf: 'flex-end',
                            marginBottom: 2,
                            marginLeft: 2
                        }]}>
                            /{dailyGoal}
                        </Text>
                    )}
                </View>
                {label && (
                    <Text style={[styles.labelText, {
                        fontSize: FontSize.xs,
                        color: variant === 'card' ? 'rgba(255,255,255,0.8)' : Colors.neutral[500],
                        marginTop: vertical ? 2 : 0,
                        marginLeft: vertical ? 0 : 6
                    }]}>
                        {label}
                    </Text>
                )}
            </View>
        </View>
    );
};

// New GoalCounter for Daily Time Goal
interface GoalCounterProps {
    current: number;
    target: number;
    size?: 'small' | 'medium';
}

export const GoalCounter: React.FC<GoalCounterProps> = ({ current, target, size = 'medium' }) => {
    const s = size === 'small'
        ? { iconSize: 16, fontSize: FontSize.sm, padding: Spacing.xs + 2 }
        : { iconSize: 20, fontSize: FontSize.base, padding: Spacing.sm };

    const isComplete = current >= target;

    return (
        <View style={styles.xpContainer}>
            <View style={[
                styles.pill,
                isComplete ? styles.successPill : styles.goalPill,
                { paddingHorizontal: s.padding, paddingVertical: s.padding / 2 }
            ]}>
                <Ionicons name={isComplete ? "checkmark-circle" : "time"} size={s.iconSize} color={isComplete ? Colors.success[600] : Colors.primary[500]} />
                <Text style={[styles.valueText, { fontSize: s.fontSize, color: isComplete ? Colors.success[700] : Colors.primary[700] }]}>
                    {current}
                </Text>
                <Text style={[styles.goalText, { fontSize: s.fontSize * 0.8 }]}>
                    /{target}m
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
    },
    verticalContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transparentPill: {
        backgroundColor: 'transparent',
    },
    firePill: {
        backgroundColor: Colors.warning[100],
        borderColor: Colors.warning[200],
        borderWidth: 1,
    },
    inactivePill: {
        backgroundColor: Colors.neutral[100],
        borderColor: Colors.neutral[200],
        borderWidth: 1,
    },
    xpPill: {
        backgroundColor: Colors.secondary[100],
        borderColor: Colors.secondary[200],
        borderWidth: 1,
    },
    goalPill: {
        backgroundColor: Colors.primary[100],
        borderColor: Colors.primary[200],
        borderWidth: 1,
    },
    successPill: {
        backgroundColor: Colors.success[100],
        borderColor: Colors.success[200],
        borderWidth: 1,
    },
    valueText: {
        fontWeight: FontWeight.bold,
    },
    goalText: {
        color: Colors.neutral[500],
        fontWeight: FontWeight.medium,
    },
    labelText: {
        fontWeight: FontWeight.medium,
    },
    xpContainer: {
        alignSelf: 'flex-start',
    }
});
