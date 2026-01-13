// ProgressBar Component - Animated progress indicator
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '../../theme';

interface ProgressBarProps {
    progress: number; // 0 to 100
    height?: number;
    showLabel?: boolean;
    variant?: 'default' | 'gradient' | 'success' | 'warning' | 'error';
    animated?: boolean;
    style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 8,
    variant = 'default',
    animated = true,
    style,
}) => {
    const animatedProgress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            Animated.spring(animatedProgress, {
                toValue: Math.min(Math.max(progress, 0), 100),
                useNativeDriver: false,
                friction: 8,
                tension: 40,
            }).start();
        } else {
            animatedProgress.setValue(progress);
        }
    }, [progress, animated]);

    const getColors = (): string[] => {
        switch (variant) {
            case 'success':
                return [Colors.success[400], Colors.success[500]];
            case 'warning':
                return [Colors.warning[400], Colors.warning[500]];
            case 'error':
                return [Colors.error[400], Colors.error[500]];
            case 'gradient':
                return [Colors.primary[400], Colors.secondary[500]];
            default:
                return [Colors.primary[400], Colors.primary[500]];
        }
    };

    const widthInterpolate = animatedProgress.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    return (
        <View style={[styles.container, { height }, style]}>
            <Animated.View
                style={[
                    styles.progressContainer,
                    {
                        width: widthInterpolate,
                        height,
                    },
                ]}
            >
                <LinearGradient
                    colors={getColors() as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.neutral[200],
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    progressContainer: {
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
    },
});
