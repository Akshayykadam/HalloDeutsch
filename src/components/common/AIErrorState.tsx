// AI Error State - Friendly error UI with retry button for AI-dependent screens

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface AIErrorStateProps {
    message?: string;
    onRetry: () => void;
    compact?: boolean;
}

export const AIErrorState: React.FC<AIErrorStateProps> = ({
    message = "Couldn't load content. Please check your connection and try again.",
    onRetry,
    compact = false,
}) => {
    const { theme } = useTheme();

    if (compact) {
        return (
            <View style={[compactStyles.container, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Ionicons name="cloud-offline-outline" size={20} color={Colors.error[400]} />
                <Text style={[compactStyles.message, { color: Colors.error[400] }]} numberOfLines={1}>
                    {message}
                </Text>
                <TouchableOpacity onPress={onRetry} style={compactStyles.retryBtn}>
                    <Ionicons name="refresh" size={18} color={Colors.primary[500]} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.iconCircle, { backgroundColor: theme.background.tertiary }]}>
                <Ionicons name="cloud-offline-outline" size={40} color={Colors.error[400]} />
            </View>

            <Text style={[styles.title, { color: theme.text.primary }]}>
                Something went wrong
            </Text>
            <Text style={[styles.message, { color: theme.text.secondary }]}>
                {message}
            </Text>

            <TouchableOpacity
                style={styles.retryButton}
                onPress={onRetry}
                activeOpacity={0.8}
            >
                <Ionicons name="refresh" size={20} color={Colors.white} />
                <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: FontSize.sm,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: Spacing.xl,
        maxWidth: 280,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.primary[600],
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    retryText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
    },
});

const compactStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
        margin: Spacing.md,
    },
    message: {
        flex: 1,
        fontSize: FontSize.sm,
    },
    retryBtn: {
        padding: Spacing.xs,
    },
});
