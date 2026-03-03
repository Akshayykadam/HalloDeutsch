// Quiz Complete Modal - Score summary and celebration
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { ConfettiOverlay } from './ConfettiOverlay';
import { haptics } from '../../utils/haptics';

interface QuizCompleteModalProps {
    visible: boolean;
    score: number;
    total: number;
    xpEarned: number;
    onContinue: () => void;
    onFinish: () => void;
}

export const QuizCompleteModal: React.FC<QuizCompleteModalProps> = ({
    visible,
    score,
    total,
    xpEarned,
    onContinue,
    onFinish,
}) => {
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const starScale = useRef(new Animated.Value(0)).current;
    const [showConfetti, setShowConfetti] = useState(false);

    const percentage = Math.round((score / total) * 100);
    const isPassing = percentage >= 60;

    useEffect(() => {
        if (visible) {
            if (isPassing) {
                haptics.success();
                setShowConfetti(true);
            } else {
                haptics.warning();
            }
            scaleAnim.setValue(0);
            starScale.setValue(0);

            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 5,
                }),
                Animated.spring(starScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 5,
                }),
            ]).start();
        }
    }, [visible]);

    const getStarCount = () => {
        if (percentage >= 90) return 3;
        if (percentage >= 70) return 2;
        if (percentage >= 50) return 1;
        return 0;
    };

    const stars = getStarCount();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                {isPassing && (
                    <ConfettiOverlay
                        visible={showConfetti}
                        onComplete={() => setShowConfetti(false)}
                        count={40}
                    />
                )}
                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.background.elevated,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Stars */}
                    <Animated.View style={[styles.starsRow, { transform: [{ scale: starScale }] }]}>
                        {[0, 1, 2].map((i) => (
                            <Ionicons
                                key={i}
                                name={i < stars ? 'star' : 'star-outline'}
                                size={40}
                                color={i < stars ? Colors.gold[500] : Colors.neutral[300]}
                                style={styles.star}
                            />
                        ))}
                    </Animated.View>

                    {/* Title */}
                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        {isPassing ? 'Great Job!' : 'Keep Practicing!'}
                    </Text>

                    {/* Score Card */}
                    <View style={[styles.scoreCard, { backgroundColor: isPassing ? Colors.success[50] : Colors.warning[50] }]}>
                        <Text style={[styles.scoreValue, { color: isPassing ? Colors.success[600] : Colors.warning[600] }]}>
                            {score}/{total}
                        </Text>
                        <Text style={[styles.scoreLabel, { color: isPassing ? Colors.success[700] : Colors.warning[700] }]}>
                            {percentage}% Correct
                        </Text>
                    </View>

                    {/* XP Earned */}
                    <View style={styles.xpRow}>
                        <Ionicons name="star" size={20} color={Colors.gold[500]} />
                        <Text style={[styles.xpText, { color: Colors.gold[600] }]}>+{xpEarned} XP Earned</Text>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                        <LinearGradient
                            colors={[Colors.primary[500], Colors.primary[600]]}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>Next 10 Questions</Text>
                            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onFinish} style={styles.finishButton}>
                        <Text style={[styles.finishText, { color: theme.text.tertiary }]}>Finish Quiz</Text>
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
    starsRow: {
        flexDirection: 'row',
        marginBottom: Spacing.lg,
    },
    star: {
        marginHorizontal: 4,
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.lg,
    },
    scoreCard: {
        width: '100%',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    scoreValue: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
    },
    scoreLabel: {
        fontSize: FontSize.base,
        marginTop: Spacing.xs,
    },
    xpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    xpText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
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
    finishButton: {
        padding: Spacing.sm,
    },
    finishText: {
        fontSize: FontSize.sm,
    },
});
