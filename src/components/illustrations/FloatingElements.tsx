// Floating Elements - Animated floating bubbles with German-themed content
// Uses React Native Animated API for gentle bobbing motion
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme';

interface FloatingElementsProps {
    variant?: 'light' | 'dark';
}

interface BubbleConfig {
    emoji?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    size: number;
    left: string;
    top: string;
    delay: number;
    duration: number;
    amplitude: number;
    bgColor: string;
}

const bubbles: BubbleConfig[] = [
    { emoji: '🇩🇪', size: 44, left: '5%', top: '10%', delay: 0, duration: 3000, amplitude: 12, bgColor: 'rgba(255,255,255,0.15)' },
    { icon: 'book', size: 36, left: '75%', top: '5%', delay: 500, duration: 3500, amplitude: 10, bgColor: 'rgba(255,255,255,0.12)' },
    { emoji: '✏️', size: 32, left: '85%', top: '45%', delay: 1000, duration: 2800, amplitude: 14, bgColor: 'rgba(255,255,255,0.10)' },
    { icon: 'school', size: 40, left: '10%', top: '55%', delay: 1500, duration: 3200, amplitude: 11, bgColor: 'rgba(255,255,255,0.13)' },
    { emoji: '📚', size: 34, left: '50%', top: '70%', delay: 800, duration: 2600, amplitude: 13, bgColor: 'rgba(255,255,255,0.11)' },
    { emoji: '🎓', size: 38, left: '30%', top: '20%', delay: 1200, duration: 3400, amplitude: 9, bgColor: 'rgba(255,255,255,0.14)' },
    { icon: 'chatbubble', size: 30, left: '65%', top: '60%', delay: 600, duration: 2900, amplitude: 12, bgColor: 'rgba(255,255,255,0.09)' },
    { emoji: '⭐', size: 28, left: '45%', top: '35%', delay: 900, duration: 3100, amplitude: 10, bgColor: 'rgba(255,255,255,0.11)' },
];

const FloatingBubble: React.FC<{ config: BubbleConfig; variant: 'light' | 'dark' }> = ({ config, variant }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in
        const fadeIn = Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            delay: config.delay,
            useNativeDriver: true,
        });

        // Bobbing animation
        const bob = Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -config.amplitude,
                    duration: config.duration / 2,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: config.amplitude,
                    duration: config.duration / 2,
                    useNativeDriver: true,
                }),
            ])
        );

        fadeIn.start(() => bob.start());

        return () => {
            fadeIn.stop();
            bob.stop();
        };
    }, []);

    const iconColor = variant === 'light' ? Colors.white : Colors.primary[300];

    return (
        <Animated.View
            style={[
                styles.bubble,
                {
                    width: config.size,
                    height: config.size,
                    borderRadius: config.size / 2,
                    left: config.left as any,
                    top: config.top as any,
                    backgroundColor: config.bgColor,
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            {config.emoji ? (
                <Text style={{ fontSize: config.size * 0.45 }}>{config.emoji}</Text>
            ) : config.icon ? (
                <Ionicons name={config.icon} size={config.size * 0.4} color={iconColor} />
            ) : null}
        </Animated.View>
    );
};

export const FloatingElements: React.FC<FloatingElementsProps> = ({ variant = 'light' }) => {
    return (
        <View style={styles.container} pointerEvents="none">
            {bubbles.map((config, index) => (
                <FloatingBubble key={index} config={config} variant={variant} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    bubble: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
});
