// Lesson Complete Modal - Success celebration with XP summary
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface LessonCompleteModalProps {
    visible: boolean;
    lessonTitle: string;
    xpEarned: number;
    wordsLearned?: number;
    onContinue: () => void;
    onClose: () => void;
    hasNextLesson?: boolean;
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
    visible,
    lessonTitle,
    xpEarned,
    wordsLearned = 0,
    onContinue,
    onClose,
    hasNextLesson = true,
}) => {
    const { theme, isDark } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            rotateAnim.setValue(0);

            // Star burst animation
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 5,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.background.elevated,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Success Icon */}
                    <Animated.View
                        style={[
                            styles.iconCircle,
                            { transform: [{ rotate: spin }] }
                        ]}
                    >
                        <LinearGradient
                            colors={[Colors.success[400], Colors.success[600]]}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="checkmark" size={48} color={Colors.white} />
                        </LinearGradient>
                    </Animated.View>

                    {/* Title */}
                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        Lesson Complete!
                    </Text>
                    <Text style={[styles.lessonTitle, { color: theme.text.secondary }]}>
                        {lessonTitle}
                    </Text>

                    {/* Stats */}
                    <View style={[styles.statsContainer, { backgroundColor: theme.background.tertiary }]}>
                        <View style={styles.statItem}>
                            <Ionicons name="star" size={24} color={Colors.gold[500]} />
                            <Text style={[styles.statValue, { color: Colors.gold[500] }]}>+{xpEarned}</Text>
                            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>XP Earned</Text>
                        </View>
                        {wordsLearned > 0 && (
                            <View style={styles.statItem}>
                                <Ionicons name="book" size={24} color={Colors.primary[500]} />
                                <Text style={[styles.statValue, { color: Colors.primary[500] }]}>+{wordsLearned}</Text>
                                <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Words</Text>
                            </View>
                        )}
                    </View>

                    {/* Buttons */}
                    {hasNextLesson ? (
                        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                            <LinearGradient
                                colors={[Colors.primary[500], Colors.primary[600]]}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Continue to Next Lesson</Text>
                                <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.continueButton} onPress={onClose}>
                            <LinearGradient
                                colors={[Colors.success[500], Colors.success[600]]}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Back to Lessons</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={[styles.closeText, { color: theme.text.tertiary }]}>
                            Maybe Later
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
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
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.xs,
    },
    lessonTitle: {
        fontSize: FontSize.base,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing['2xl'],
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        width: '100%',
        marginBottom: Spacing.lg,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginTop: Spacing.xs,
    },
    statLabel: {
        fontSize: FontSize.sm,
    },
    continueButton: {
        width: '100%',
        marginBottom: Spacing.md,
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
    closeButton: {
        padding: Spacing.sm,
    },
    closeText: {
        fontSize: FontSize.sm,
    },
});
