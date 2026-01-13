import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    FadeInDown, // Easier to use layout animations if applicable, but explicit is fine too
} from 'react-native-reanimated';

interface FadeInViewProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    style?: ViewStyle | ViewStyle[];
    slideUp?: boolean;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
    children,
    delay = 0,
    duration = 500,
    style,
    slideUp = true,
}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(slideUp ? 20 : 0);

    useEffect(() => {
        opacity.value = withDelay(
            delay,
            withTiming(1, {
                duration,
                easing: Easing.out(Easing.cubic),
            })
        );

        if (slideUp) {
            translateY.value = withDelay(
                delay,
                withTiming(0, {
                    duration,
                    easing: Easing.out(Easing.cubic),
                })
            );
        }
    }, [delay, duration, slideUp]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <Animated.View style={[style, animatedStyle]}>
            {children}
        </Animated.View>
    );
};
