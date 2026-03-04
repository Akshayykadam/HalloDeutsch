// Reusable Reanimated animation hooks for smooth UI
import { useEffect } from 'react';
import {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSpring,
    Easing,
    SharedValue,
    AnimatedStyle,
} from 'react-native-reanimated';

/**
 * Fade-in + slide-up entrance animation for a single element.
 * Returns an animated style to spread onto an Animated.View.
 */
export const useEntranceAnimation = (delay = 0, duration = 400) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(18);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
        translateY.value = withDelay(delay, withTiming(0, { duration, easing: Easing.out(Easing.cubic) }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return animatedStyle;
};

/**
 * Returns an array of animated styles for N items, each staggered by `staggerMs`.
 * Each item fades in + slides up. Great for card grids and lists.
 *
 * Usage:
 *   const itemStyles = useStaggeredList(items.length, 60, 100);
 *   items.map((item, i) => <Animated.View style={itemStyles[i]}>{...}</Animated.View>)
 */
export const useStaggeredList = (
    count: number,
    staggerMs = 60,
    baseDelay = 80,
    duration = 350,
) => {
    // Pre-allocate shared values for max items (capped to avoid excess)
    const MAX = Math.min(count, 20);
    const opacities: SharedValue<number>[] = [];
    const translates: SharedValue<number>[] = [];

    for (let i = 0; i < MAX; i++) {
        opacities.push(useSharedValue(0));
        translates.push(useSharedValue(16));
    }

    useEffect(() => {
        for (let i = 0; i < MAX; i++) {
            const delay = baseDelay + i * staggerMs;
            opacities[i].value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
            translates[i].value = withDelay(delay, withTiming(0, { duration, easing: Easing.out(Easing.cubic) }));
        }
    }, []);

    // Build animated styles – these are stable because hook count is fixed
    const styles: ReturnType<typeof useAnimatedStyle>[] = [];
    for (let i = 0; i < MAX; i++) {
        const idx = i; // capture
        styles.push(
            useAnimatedStyle(() => ({
                opacity: opacities[idx].value,
                transform: [{ translateY: translates[idx].value }],
            }))
        );
    }

    return styles;
};

/**
 * Spring-based scale bounce. Returns [sharedValue, animatedStyle].
 * Call `scale.value = withSpring(...)` to trigger.
 */
export const useScaleAnimation = (initial = 1) => {
    const scale = useSharedValue(initial);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return [scale, animatedStyle] as const;
};
