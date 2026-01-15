import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../theme';

export const ConnectivityGuard = ({ children }: { children: React.ReactNode }) => {
    const { theme, isDark } = useTheme();
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        // Initial check
        NetInfo.fetch().then(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    const handleRetry = async () => {
        setIsRefreshing(true);
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected);
        // Small delay to show activity indicator
        setTimeout(() => setIsRefreshing(false), 800);
    };

    if (isConnected === false) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
                <View style={styles.content}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}>
                        <Ionicons
                            name="cloud-offline-outline"
                            size={80}
                            color={Colors.primary[500]}
                        />
                    </View>

                    <Text style={[styles.title, { color: theme.text.primary }]}>Connection Lost</Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
                        HalloDeutsch needs an internet connection to sync your progress and use AI features.
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: Colors.primary[500] }]}
                        onPress={handleRetry}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <ActivityIndicator color={Colors.white} size="small" />
                        ) : (
                            <>
                                <Ionicons name="refresh" size={20} color={Colors.white} />
                                <Text style={styles.buttonText}>Try Again</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Default to children if connected or still checking (to avoid flash)
    // Actually, usually it's better to wait for first check if we want to be strict
    return <>{children}</>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    content: {
        alignItems: 'center',
        maxWidth: 320,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.md,
        textAlign: 'center',
        marginBottom: Spacing['3xl'],
        lineHeight: 24,
        paddingHorizontal: Spacing.md,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing['2xl'],
        borderRadius: BorderRadius.full,
        gap: Spacing.sm,
        minWidth: 180,
        height: 56,
        elevation: 4,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    buttonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
});
