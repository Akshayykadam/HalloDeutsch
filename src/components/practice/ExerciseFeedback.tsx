// Exercise Feedback Component - Detailed, educational feedback for exercises
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, Shadows } from '../../theme';

// ============================================
// Exercise Result Feedback
// ============================================
interface ExerciseFeedbackProps {
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    grammarRuleId?: string;
    commonMistake?: string;
    onContinue: () => void;
    onViewGrammar?: () => void;
}

export const ExerciseFeedback: React.FC<ExerciseFeedbackProps> = ({
    isCorrect,
    userAnswer,
    correctAnswer,
    explanation,
    grammarRuleId,
    commonMistake,
    onContinue,
    onViewGrammar,
}) => {
    return (
        <View style={[
            styles.container,
            isCorrect ? styles.containerCorrect : styles.containerIncorrect,
        ]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={[
                    styles.iconContainer,
                    isCorrect ? styles.iconCorrect : styles.iconIncorrect,
                ]}>
                    <Ionicons
                        name={isCorrect ? 'checkmark' : 'close'}
                        size={24}
                        color={Colors.white}
                    />
                </View>
                <View style={styles.headerText}>
                    <Text style={[
                        styles.headerTitle,
                        isCorrect ? styles.textCorrect : styles.textIncorrect,
                    ]}>
                        {isCorrect ? 'Correct!' : 'Not quite right'}
                    </Text>
                    <Text style={[
                        styles.headerTitleDe,
                        isCorrect ? styles.textCorrect : styles.textIncorrect,
                    ]}>
                        {isCorrect ? 'Richtig!' : 'Nicht ganz richtig'}
                    </Text>
                </View>
            </View>

            {/* Answer Comparison (only for incorrect) */}
            {!isCorrect && (
                <View style={styles.answerComparison}>
                    <View style={styles.answerRow}>
                        <Ionicons name="close-circle" size={16} color={Colors.error[500]} />
                        <Text style={styles.answerLabel}>Your answer:</Text>
                        <Text style={styles.answerWrong}>{userAnswer}</Text>
                    </View>
                    <View style={styles.answerRow}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.success[500]} />
                        <Text style={styles.answerLabel}>Correct answer:</Text>
                        <Text style={styles.answerCorrect}>{correctAnswer}</Text>
                    </View>
                </View>
            )}

            {/* Explanation */}
            <View style={styles.explanationContainer}>
                <Text style={styles.explanationLabel}>
                    {isCorrect ? 'Why this is correct:' : 'Why this is incorrect:'}
                </Text>
                <Text style={styles.explanationText}>{explanation}</Text>
            </View>

            {/* Common Mistake Warning (only for incorrect) */}
            {!isCorrect && commonMistake && (
                <View style={styles.commonMistakeContainer}>
                    <Ionicons name="alert-circle" size={16} color={Colors.warning[600]} />
                    <Text style={styles.commonMistakeText}>{commonMistake}</Text>
                </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
                {grammarRuleId && onViewGrammar && (
                    <TouchableOpacity
                        style={styles.grammarButton}
                        onPress={onViewGrammar}
                    >
                        <Ionicons name="book-outline" size={16} color={Colors.primary[500]} />
                        <Text style={styles.grammarButtonText}>Review Grammar</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        isCorrect ? styles.continueButtonCorrect : styles.continueButtonIncorrect,
                    ]}
                    onPress={onContinue}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ============================================
// Weak Point Indicator
// ============================================
interface WeakPointIndicatorProps {
    concept: string;
    correctRate: number; // 0-100
    onPractice?: () => void;
}

export const WeakPointIndicator: React.FC<WeakPointIndicatorProps> = ({
    concept,
    correctRate,
    onPractice,
}) => {
    const isWeak = correctRate < 60;
    const color = isWeak ? Colors.error[500] : Colors.warning[500];

    return (
        <View style={styles.weakPointContainer}>
            <View style={styles.weakPointHeader}>
                <Ionicons
                    name={isWeak ? 'trending-down' : 'trending-up'}
                    size={16}
                    color={color}
                />
                <Text style={[styles.weakPointConcept, { color }]}>{concept}</Text>
                <Text style={styles.weakPointRate}>{correctRate}% correct</Text>
            </View>
            <View style={styles.weakPointProgress}>
                <View style={styles.weakPointProgressBg}>
                    <View
                        style={[
                            styles.weakPointProgressFill,
                            { width: `${correctRate}%`, backgroundColor: color },
                        ]}
                    />
                </View>
            </View>
            {onPractice && (
                <TouchableOpacity style={styles.practiceButton} onPress={onPractice}>
                    <Text style={styles.practiceButtonText}>Practice this</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// ============================================
// Progress Summary Card
// ============================================
interface ProgressSummaryProps {
    totalExercises: number;
    correctCount: number;
    weakPoints: Array<{ concept: string; correctRate: number }>;
    onRetryWeak?: () => void;
    onContinue: () => void;
}

export const LessonProgressSummary: React.FC<ProgressSummaryProps> = ({
    totalExercises,
    correctCount,
    weakPoints,
    onRetryWeak,
    onContinue,
}) => {
    const accuracy = Math.round((correctCount / totalExercises) * 100);
    const passed = accuracy >= 80;

    return (
        <View style={styles.summaryContainer}>
            {/* Score Circle */}
            <View style={styles.scoreSection}>
                <View style={[
                    styles.scoreCircle,
                    passed ? styles.scoreCirclePassed : styles.scoreCircleFailed,
                ]}>
                    <Text style={styles.scoreNumber}>{accuracy}%</Text>
                    <Text style={styles.scoreLabel}>Accuracy</Text>
                </View>
                <Text style={[
                    styles.scoreStatus,
                    passed ? styles.textSuccess : styles.textError,
                ]}>
                    {passed ? 'Lesson Completed!' : 'Need more practice'}
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{correctCount}</Text>
                    <Text style={styles.statLabel}>Correct</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{totalExercises - correctCount}</Text>
                    <Text style={styles.statLabel}>Incorrect</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{totalExercises}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
            </View>

            {/* Weak Points */}
            {weakPoints.length > 0 && (
                <View style={styles.weakPointsSection}>
                    <Text style={styles.weakPointsTitle}>Areas to Review</Text>
                    {weakPoints.map((wp, idx) => (
                        <WeakPointIndicator
                            key={idx}
                            concept={wp.concept}
                            correctRate={wp.correctRate}
                        />
                    ))}
                </View>
            )}

            {/* Actions */}
            <View style={styles.summaryActions}>
                {!passed && onRetryWeak && weakPoints.length > 0 && (
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={onRetryWeak}
                    >
                        <Ionicons name="refresh" size={16} color={Colors.primary[500]} />
                        <Text style={styles.retryButtonText}>Practice Weak Points</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        passed ? styles.nextButtonPassed : styles.nextButtonFailed,
                    ]}
                    onPress={onContinue}
                >
                    <Text style={styles.nextButtonText}>
                        {passed ? 'Next Lesson' : 'Try Again'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
    // Exercise Feedback
    container: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        marginVertical: Spacing.md,
        ...Shadows.md,
    },
    containerCorrect: {
        backgroundColor: Colors.success[50],
        borderWidth: 1,
        borderColor: Colors.success[200],
    },
    containerIncorrect: {
        backgroundColor: Colors.error[50],
        borderWidth: 1,
        borderColor: Colors.error[200],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCorrect: {
        backgroundColor: Colors.success[500],
    },
    iconIncorrect: {
        backgroundColor: Colors.error[500],
    },
    headerText: {
        marginLeft: Spacing.md,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    headerTitleDe: {
        fontSize: FontSize.sm,
        fontStyle: 'italic',
    },
    textCorrect: {
        color: Colors.success[700],
    },
    textIncorrect: {
        color: Colors.error[700],
    },
    textSuccess: {
        color: Colors.success[600],
    },
    textError: {
        color: Colors.error[600],
    },
    answerComparison: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    answerLabel: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        marginLeft: Spacing.xs,
        marginRight: Spacing.sm,
    },
    answerWrong: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.error[700],
        textDecorationLine: 'line-through',
    },
    answerCorrect: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.success[700],
    },
    explanationContainer: {
        marginBottom: Spacing.md,
    },
    explanationLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.secondary,
        textTransform: 'uppercase',
        marginBottom: Spacing.xs,
    },
    explanationText: {
        fontSize: FontSize.sm,
        color: LightTheme.text.primary,
        lineHeight: 20,
    },
    commonMistakeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.warning[100],
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.md,
    },
    commonMistakeText: {
        fontSize: FontSize.sm,
        color: Colors.warning[800],
        marginLeft: Spacing.xs,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
    },
    grammarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.primary[500],
    },
    grammarButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary[500],
        marginLeft: Spacing.xs,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
    },
    continueButtonCorrect: {
        backgroundColor: Colors.success[500],
    },
    continueButtonIncorrect: {
        backgroundColor: Colors.error[500],
    },
    continueButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        marginRight: Spacing.xs,
    },

    // Weak Point Indicator
    weakPointContainer: {
        backgroundColor: LightTheme.background.primary,
        borderRadius: BorderRadius.sm,
        padding: Spacing.sm,
        marginBottom: Spacing.sm,
        borderLeftWidth: 3,
        borderLeftColor: Colors.warning[500],
    },
    weakPointHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    weakPointConcept: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        marginLeft: Spacing.xs,
        flex: 1,
    },
    weakPointRate: {
        fontSize: FontSize.xs,
        color: LightTheme.text.tertiary,
    },
    weakPointProgress: {
        marginBottom: Spacing.xs,
    },
    weakPointProgressBg: {
        height: 4,
        backgroundColor: Colors.neutral[200],
        borderRadius: 2,
    },
    weakPointProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    practiceButton: {
        alignSelf: 'flex-start',
    },
    practiceButtonText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.primary[500],
    },

    // Progress Summary
    summaryContainer: {
        backgroundColor: LightTheme.background.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        ...Shadows.md,
    },
    scoreSection: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    scoreCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    scoreCirclePassed: {
        backgroundColor: Colors.success[100],
        borderWidth: 3,
        borderColor: Colors.success[500],
    },
    scoreCircleFailed: {
        backgroundColor: Colors.error[100],
        borderWidth: 3,
        borderColor: Colors.error[500],
    },
    scoreNumber: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    scoreLabel: {
        fontSize: FontSize.xs,
        color: LightTheme.text.secondary,
    },
    scoreStatus: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    statNumber: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: LightTheme.text.secondary,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: LightTheme.border.light,
    },
    weakPointsSection: {
        marginBottom: Spacing.lg,
    },
    weakPointsTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.secondary,
        marginBottom: Spacing.sm,
    },
    summaryActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.primary[500],
    },
    retryButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary[500],
        marginLeft: Spacing.xs,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.md,
    },
    nextButtonPassed: {
        backgroundColor: Colors.success[500],
    },
    nextButtonFailed: {
        backgroundColor: Colors.primary[500],
    },
    nextButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        marginRight: Spacing.xs,
    },
});
