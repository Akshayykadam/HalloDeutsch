// Module Complete Modal - Celebration when finishing a module
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface ModuleCompleteModalProps {
    visible: boolean;
    moduleTitle: string;
    moduleTitleDe?: string;
    lessonsCompleted: number;
    onClose: () => void;
}

export const ModuleCompleteModal: React.FC<ModuleCompleteModalProps> = ({
    visible,
    moduleTitle,
    moduleTitleDe,
    lessonsCompleted,
    onClose,
}) => {
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const confettiAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            rotateAnim.setValue(0);
            confettiAnim.setValue(0);

            // Trophy burst animation
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 5,
                }),
                Animated.parallel([
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(confettiAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        }
    }, [visible]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const confettiOpacity = confettiAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0.7],
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Confetti particles */}
                <Animated.View style={[styles.confettiContainer, { opacity: confettiOpacity }]}>
                    {[...Array(12)].map((_, i) => (
                        <Ionicons
                            key={i}
                            name="star"
                            size={16}
                            color={i % 3 === 0 ? Colors.gold[400] : i % 3 === 1 ? Colors.primary[400] : Colors.success[400]}
                            style={[
                                styles.confetti,
                                {
                                    left: `${(i * 8) + 5}%`,
                                    top: `${10 + (i % 4) * 5}%`,
                                    transform: [{ rotate: `${i * 30}deg` }],
                                },
                            ]}
                        />
                    ))}
                </Animated.View>

                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.background.elevated,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Trophy Icon */}
                    <Animated.View
                        style={[
                            styles.iconCircle,
                            { transform: [{ rotate: spin }] }
                        ]}
                    >
                        <LinearGradient
                            colors={[Colors.gold[400], Colors.gold[600]]}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="trophy" size={48} color={Colors.white} />
                        </LinearGradient>
                    </Animated.View>

                    {/* Title */}
                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        Module Complete!
                    </Text>
                    <Text style={[styles.moduleTitle, { color: Colors.primary[500] }]}>
                        {moduleTitle}
                    </Text>
                    {moduleTitleDe && (
                        <Text style={[styles.moduleTitleDe, { color: theme.text.tertiary }]}>
                            {moduleTitleDe}
                        </Text>
                    )}

                    {/* Stats */}
                    <View style={[styles.statsContainer, { backgroundColor: theme.background.tertiary }]}>
                        <View style={styles.statItem}>
                            <Ionicons name="checkmark-circle" size={28} color={Colors.success[500]} />
                            <Text style={[styles.statValue, { color: Colors.success[500] }]}>{lessonsCompleted}</Text>
                            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Lessons Completed</Text>
                        </View>
                    </View>

                    {/* Encouragement */}
                    <Text style={[styles.encouragement, { color: theme.text.secondary }]}>
                        Fantastic work! You've mastered this module. Keep up the great progress!
                    </Text>

                    {/* Back to Modules Button */}
                    <TouchableOpacity style={styles.continueButton} onPress={onClose}>
                        <LinearGradient
                            colors={[Colors.primary[500], Colors.primary[600]]}
                            style={styles.buttonGradient}
                        >
                            <Ionicons name="arrow-back" size={20} color={Colors.white} />
                            <Text style={styles.buttonText}>Back to Modules</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    confettiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    confetti: {
        position: 'absolute',
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.xl,
        alignItems: 'center',
    },
    iconCircle: {
        marginBottom: Spacing.lg,
    },
    iconGradient: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.xs,
    },
    moduleTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        marginBottom: 4,
        textAlign: 'center',
    },
    moduleTitleDe: {
        fontSize: FontSize.sm,
        fontStyle: 'italic',
        marginBottom: Spacing.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        width: '100%',
        marginBottom: Spacing.lg,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.neutral[200],
    },
    statValue: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginTop: Spacing.xs,
    },
    statLabel: {
        fontSize: FontSize.sm,
    },
    encouragement: {
        fontSize: FontSize.sm,
        textAlign: 'center',
        marginBottom: Spacing.lg,
        lineHeight: 20,
    },
    continueButton: {
        width: '100%',
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
    },
    buttonText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
    },
});
