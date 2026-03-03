// Error Boundary - Catches JS errors and shows a friendly fallback UI
// React error boundaries must be class components

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="warning-outline" size={48} color={Colors.warning[500]} />
                        </View>

                        <Text style={styles.title}>Oops! Something went wrong</Text>
                        <Text style={styles.subtitle}>
                            Don't worry — your progress is saved. Try restarting the screen.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <ScrollView style={styles.errorBox}>
                                <Text style={styles.errorText}>
                                    {this.state.error.toString()}
                                </Text>
                            </ScrollView>
                        )}

                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={this.handleReset}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="refresh" size={20} color={Colors.white} />
                            <Text style={styles.retryText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F23',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    content: {
        alignItems: 'center',
        maxWidth: 320,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSize.md,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.xl,
    },
    errorBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        maxHeight: 120,
        width: '100%',
    },
    errorText: {
        fontSize: FontSize.xs,
        color: Colors.error[400],
        fontFamily: 'monospace',
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
