// XP Toast - Animated toast showing XP earned
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface XPToastProps {
    xp: number;
    visible: boolean;
    onHide: () => void;
}

export const XPToast: React.FC<XPToastProps> = ({ xp, visible, onHide }) => {
    const { theme } = useTheme();
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            // Animate in
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
            ]).start();

            // Auto hide after 2.5 seconds
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start(() => onHide());
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }, { scale }],
                    opacity,
                    backgroundColor: theme.background.elevated,
                },
            ]}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="star" size={24} color={Colors.gold[500]} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.label, { color: theme.text.secondary }]}>XP Earned</Text>
                <Text style={[styles.xpValue, { color: Colors.gold[500] }]}>+{xp} XP</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: Spacing.lg,
        right: Spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.gold[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: FontSize.sm,
    },
    xpValue: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
    },
});
