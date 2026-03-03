// Skeleton Loader - Shimmer loading placeholder
// Use this to show loading states for AI-generated content

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BorderRadius, Spacing } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = BorderRadius.sm,
    style,
}) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const { isDark } = useTheme();

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        );
        animation.start();
        return () => animation.stop();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    const bgColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const shimmerColors = isDark
        ? ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0)'] as const
        : ['rgba(0,0,0,0)', 'rgba(0,0,0,0.04)', 'rgba(0,0,0,0)'] as const;

    return (
        <View
            style={[
                {
                    width: width as any,
                    height,
                    borderRadius,
                    backgroundColor: bgColor,
                    overflow: 'hidden',
                },
                style,
            ]}
        >
            <Animated.View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    transform: [{ translateX }],
                }}
            >
                <LinearGradient
                    colors={[...shimmerColors]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                />
            </Animated.View>
        </View>
    );
};

// Pre-built skeleton layouts for common screens
export const CardSkeleton: React.FC = () => {
    const { theme } = useTheme();
    return (
        <View style={[skeletonStyles.card, { backgroundColor: theme.background.elevated }]}>
            <View style={skeletonStyles.cardHeader}>
                <Skeleton width={80} height={24} borderRadius={BorderRadius.full} />
                <Skeleton width={60} height={16} />
            </View>
            <Skeleton width="70%" height={22} style={{ marginBottom: Spacing.sm }} />
            <Skeleton width="90%" height={16} style={{ marginBottom: Spacing.md }} />
            <Skeleton width="100%" height={8} borderRadius={4} style={{ marginBottom: Spacing.sm }} />
            <Skeleton width="100%" height={44} borderRadius={BorderRadius.md} />
        </View>
    );
};

export const GridSkeleton: React.FC = () => (
    <View style={skeletonStyles.grid}>
        {[0, 1, 2, 3].map((i) => (
            <View key={i} style={skeletonStyles.gridItem}>
                <Skeleton width="100%" height={130} borderRadius={BorderRadius.xl} />
            </View>
        ))}
    </View>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <View>
        {Array.from({ length: count }).map((_, i) => (
            <View key={i} style={skeletonStyles.listItem}>
                <Skeleton width={44} height={44} borderRadius={22} />
                <View style={skeletonStyles.listText}>
                    <Skeleton width="60%" height={18} style={{ marginBottom: Spacing.xs }} />
                    <Skeleton width="40%" height={14} />
                </View>
            </View>
        ))}
    </View>
);

const skeletonStyles = StyleSheet.create({
    card: {
        padding: Spacing.base,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    gridItem: {
        width: '47%',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.md,
    },
    listText: {
        flex: 1,
    },
});
