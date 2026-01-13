// Hearts Display - Lives system for lessons
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight } from '../../theme';

interface HeartsDisplayProps {
    hearts: number;
    maxHearts?: number;
    size?: 'small' | 'medium' | 'large';
}

export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({
    hearts,
    maxHearts = 5,
    size = 'medium',
}) => {
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const prevHearts = useRef(hearts);

    useEffect(() => {
        // Shake animation when losing a heart
        if (hearts < prevHearts.current) {
            Animated.sequence([
                Animated.timing(shakeAnim, {
                    toValue: 10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: -10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true,
                }),
            ]).start();
        }
        prevHearts.current = hearts;
    }, [hearts]);

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { heartSize: 16, gap: 2 };
            case 'large':
                return { heartSize: 28, gap: 6 };
            default:
                return { heartSize: 22, gap: 4 };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateX: shakeAnim }] },
            ]}
        >
            {Array.from({ length: maxHearts }).map((_, index) => (
                <Ionicons
                    key={index}
                    name={index < hearts ? 'heart' : 'heart-outline'}
                    size={sizeStyles.heartSize}
                    color={index < hearts ? Colors.error[500] : Colors.neutral[400]}
                    style={{
                        marginHorizontal: sizeStyles.gap / 2,
                        opacity: index < hearts ? 1 : 0.5,
                    }}
                />
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },

});
