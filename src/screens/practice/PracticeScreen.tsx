// Practice Screen - Quiz practice with level selection (A1, A2, B1, B2)
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, Badge, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LevelColors, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext'
import { useUserStore, useSettingsStore } from '../../store';
import { generateQuizBatch } from '../../services/geminiService';
import { CEFRLevel, Exercise } from '../../types';

// Practice topics for each level
const PRACTICE_TOPICS: Record<CEFRLevel, string[]> = {
    'A1': ['Alphabet & Numbers', 'Greetings', 'Basic Vocabulary', 'Simple Sentences', 'Articles (der, die, das)'],
    'A2': ['Past Tense (Perfekt)', 'Modal Verbs', 'Dative Case', 'Comparatives', 'Daily Routines'],
    'B1': ['Relative Clauses', 'Konjunktiv II', 'Passive Voice', 'Indirect Speech', 'Complex Sentences'],
    'B2': ['Konjunktiv I', 'Advanced Passive', 'Nominalization', 'Professional German', 'Idiomatic Expressions'],
};

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

export const PracticeScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme, isDark } = useTheme();
    const styles = getStyles(theme, isDark);
    const { progress } = useUserStore();
    const { settings } = useSettingsStore();

    // State
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(progress.level);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [inQuiz, setInQuiz] = useState(false);
    const [questions, setQuestions] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [batchNumber, setBatchNumber] = useState(1);
    const [loadingNextBatch, setLoadingNextBatch] = useState(false);

    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

    const startPractice = async (topic: string) => {
        setSelectedTopic(topic);
        setLoading(true);
        setScore(0);
        setTotalAnswered(0);
        setBatchNumber(1);

        try {
            const newQuestions = await generateQuizBatch(topic, selectedLevel, 20);
            if (newQuestions && newQuestions.length > 0) {
                setQuestions(newQuestions);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setInQuiz(true);
            } else {
                // Fallback questions
                setQuestions(getFallbackQuestions(selectedLevel, topic));
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setInQuiz(true);
            }
        } catch (error) {
            console.error('Failed to generate questions:', error);
            // Use fallback
            setQuestions(getFallbackQuestions(selectedLevel, topic));
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setIsCorrect(null);
            setInQuiz(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;

        setSelectedAnswer(answer);
        const currentQuestion = questions[currentIndex];
        const correct = answer === currentQuestion.correctAnswer;

        setIsCorrect(correct);
        setTotalAnswered(prev => prev + 1);

        if (correct) {
            setScore(prev => prev + 1);
            if (settings.hapticEnabled) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } else {
            if (settings.hapticEnabled) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }
    };

    const handleNext = async () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            // Load next batch of 20 questions (unlimited practice)
            setLoadingNextBatch(true);
            try {
                const newQuestions = await generateQuizBatch(selectedTopic!, selectedLevel, 20);
                if (newQuestions && newQuestions.length > 0) {
                    setQuestions(newQuestions);
                    setCurrentIndex(0);
                    setSelectedAnswer(null);
                    setIsCorrect(null);
                    setBatchNumber(prev => prev + 1);
                } else {
                    // Use fallback if AI fails
                    setQuestions(getFallbackQuestions(selectedLevel, selectedTopic!));
                    setCurrentIndex(0);
                    setSelectedAnswer(null);
                    setIsCorrect(null);
                    setBatchNumber(prev => prev + 1);
                }
            } catch (error) {
                console.error('Failed to load next batch:', error);
                setQuestions(getFallbackQuestions(selectedLevel, selectedTopic!));
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setBatchNumber(prev => prev + 1);
            } finally {
                setLoadingNextBatch(false);
            }
        }
    };

    const exitQuiz = () => {
        setInQuiz(false);
        setSelectedTopic(null);
        setQuestions([]);
        setCurrentIndex(0);
    };

    // Topic Selection Screen
    if (!inQuiz) {
        return (
            <SafeArea style={styles.container}>
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Practice</Text>
                        <Text style={styles.headerSubtitle}>Test your German knowledge</Text>
                    </View>

                    {/* Level Tabs */}
                    <View style={styles.levelTabs}>
                        {levels.map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.levelTab,
                                    selectedLevel === level && { backgroundColor: LevelColors[level] }
                                ]}
                                onPress={() => setSelectedLevel(level)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.levelTabText,
                                    selectedLevel === level && styles.levelTabTextActive
                                ]}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Stats Card */}
                    <View style={styles.statsCard}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{score}</Text>
                            <Text style={styles.statLabel}>Correct</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.border.light }]} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{totalAnswered}</Text>
                            <Text style={styles.statLabel}>Answered</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.border.light }]} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%
                            </Text>
                            <Text style={styles.statLabel}>Accuracy</Text>
                        </View>
                    </View>





                    {/* Topics */}
                    <View style={styles.topicsList}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="list" size={20} color={LevelColors[selectedLevel]} />
                            <Text style={styles.sectionTitle}>Quiz Topics</Text>
                        </View>

                        {PRACTICE_TOPICS[selectedLevel].map((topic, index) => (
                            <TouchableOpacity
                                key={topic}
                                activeOpacity={0.8}
                                onPress={() => startPractice(topic)}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[LevelColors[selectedLevel], LevelColors[selectedLevel] + 'DD']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.topicCard}
                                >
                                    <View style={styles.topicLeft}>
                                        <View style={styles.topicNumber}>
                                            <Text style={styles.topicNumberText}>{index + 1}</Text>
                                        </View>
                                        <Text style={styles.topicTitle}>{topic}</Text>
                                    </View>
                                    {loading && selectedTopic === topic ? (
                                        <ActivityIndicator color={Colors.white} />
                                    ) : (
                                        <Ionicons name="play-circle" size={28} color="rgba(255,255,255,0.9)" />
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeArea>
        );
    }

    // Quiz Screen
    const currentQuestion = questions[currentIndex];
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;

    return (
        <SafeArea style={styles.container}>
            {/* Quiz Header */}
            <View style={styles.quizHeader}>
                <TouchableOpacity onPress={exitQuiz} style={styles.backButton}>
                    <Ionicons name="close" size={26} color={theme.text.primary} />
                </TouchableOpacity>
                <View style={styles.quizHeaderCenter}>
                    <Badge label={selectedLevel} variant="level" level={selectedLevel} />
                    <Text style={styles.quizTopic}>{selectedTopic}</Text>
                </View>
                <Text style={styles.quizProgress}>{currentIndex + 1}/{questions.length}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progressPercent}%`, backgroundColor: LevelColors[selectedLevel] }]} />
            </View>

            {/* Question */}
            <ScrollView style={styles.quizContent} contentContainerStyle={styles.quizContentContainer}>
                <Card style={styles.questionCard}>
                    <Text style={styles.questionLabel}>Question {currentIndex + 1}</Text>
                    <Text style={styles.questionText}>{currentQuestion?.question}</Text>
                </Card>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {currentQuestion?.options?.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectAnswer = option === currentQuestion.correctAnswer;
                        const showResult = selectedAnswer !== null;

                        let optionStyle = styles.optionButton;
                        let textStyle = styles.optionText;

                        if (showResult) {
                            if (isCorrectAnswer) {
                                optionStyle = { ...styles.optionButton, ...styles.optionCorrect };
                            } else if (isSelected && !isCorrectAnswer) {
                                optionStyle = { ...styles.optionButton, ...styles.optionIncorrect };
                            }
                        }

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[optionStyle, isSelected && !showResult && styles.optionSelected]}
                                onPress={() => handleAnswer(option)}
                                disabled={selectedAnswer !== null}
                                activeOpacity={0.8}
                            >
                                <View style={styles.optionLetter}>
                                    <Text style={styles.optionLetterText}>
                                        {String.fromCharCode(65 + index)}
                                    </Text>
                                </View>
                                <Text style={[textStyle, showResult && isCorrectAnswer && { color: Colors.success[700] }]}>
                                    {option}
                                </Text>
                                {showResult && isCorrectAnswer && (
                                    <Ionicons name="checkmark-circle" size={22} color={Colors.success[500]} style={{ marginLeft: 'auto' }} />
                                )}
                                {showResult && isSelected && !isCorrectAnswer && (
                                    <Ionicons name="close-circle" size={22} color={Colors.error[500]} style={{ marginLeft: 'auto' }} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Explanation after answering */}
                {selectedAnswer && currentQuestion?.explanation && (
                    <Card style={styles.explanationCard}>
                        <View style={styles.explanationHeader}>
                            <Ionicons
                                name={isCorrect ? "checkmark-circle" : "information-circle"}
                                size={22}
                                color={isCorrect ? Colors.success[500] : Colors.warning[500]}
                            />
                            <Text style={styles.explanationTitle}>
                                {isCorrect ? 'Correct!' : 'Explanation'}
                            </Text>
                        </View>
                        <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                    </Card>
                )}

                {/* Next Button */}
                {selectedAnswer && (
                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: LevelColors[selectedLevel] }]}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                    </TouchableOpacity>
                )}

                {/* Score Display */}
                <View style={styles.scoreDisplay}>
                    <Text style={styles.scoreText}>Score: {score}/{totalAnswered}</Text>
                </View>
            </ScrollView>
        </SafeArea>
    );
};

// Fallback questions when AI fails
const getFallbackQuestions = (level: CEFRLevel, topic: string): Exercise[] => {
    const fallbackQuestions: Exercise[] = [
        {
            id: '1',
            type: 'multiple_choice',
            question: 'What is "hello" in German?',
            options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'],
            correctAnswer: 'Hallo',
            explanation: '"Hallo" is the most common way to say hello in German.',
            xpReward: 10,
        },
        {
            id: '2',
            type: 'multiple_choice',
            question: 'What is "thank you" in German?',
            options: ['Bitte', 'Danke', 'Hallo', 'Guten Tag'],
            correctAnswer: 'Danke',
            explanation: '"Danke" means thank you. "Danke schön" is a more formal version.',
            xpReward: 10,
        },
        {
            id: '3',
            type: 'multiple_choice',
            question: 'Which article goes with "Buch" (book)?',
            options: ['der', 'die', 'das', 'den'],
            correctAnswer: 'das',
            explanation: '"Buch" is a neuter noun, so it uses "das".',
            xpReward: 10,
        },
        {
            id: '4',
            type: 'multiple_choice',
            question: 'How do you say "goodbye" in German?',
            options: ['Hallo', 'Guten Morgen', 'Auf Wiedersehen', 'Bitte'],
            correctAnswer: 'Auf Wiedersehen',
            explanation: '"Auf Wiedersehen" is a formal goodbye. "Tschüss" is more casual.',
            xpReward: 10,
        },
        {
            id: '5',
            type: 'multiple_choice',
            question: 'What does "Ich heiße" mean?',
            options: ['I am from', 'My name is', 'I live in', 'I like'],
            correctAnswer: 'My name is',
            explanation: '"Ich heiße" literally means "I am called" and is used to introduce yourself.',
            xpReward: 10,
        },
    ];
    return fallbackQuestions;
};

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    header: {
        padding: Spacing.lg,
        paddingTop: Spacing.xl,
        backgroundColor: theme.background.primary,
    },
    headerTitle: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: 4,
    },
    levelTabs: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
        backgroundColor: theme.background.primary,
    },
    levelTab: {
        flex: 1,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        backgroundColor: theme.background.tertiary,
        alignItems: 'center',
    },
    levelTabText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: theme.text.secondary,
    },
    levelTabTextActive: {
        color: Colors.white,
    },
    statsCard: {
        flexDirection: 'row',
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        ...Shadows.sm,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: theme.text.secondary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: '100%',
    },
    topicsContainer: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    topicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md,
    },
    topicLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    topicNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    topicNumberText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    topicTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
        flex: 1,
    },
    // Quiz styles
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        backgroundColor: theme.background.primary,
    },
    backButton: {
        padding: Spacing.xs,
    },
    quizHeaderCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    quizTopic: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
    },
    quizProgress: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: theme.background.tertiary,
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    quizContent: {
        flex: 1,
    },
    quizContentContainer: {
        padding: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },
    questionCard: {
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    questionLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: theme.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    },
    questionText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: theme.text.primary,
        lineHeight: 28,
    },
    optionsContainer: {
        gap: Spacing.sm,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 2,
        borderColor: theme.border.light,
    },
    optionSelected: {
        borderColor: Colors.primary[400],
        backgroundColor: Colors.primary[50],
    },
    optionCorrect: {
        borderColor: Colors.success[500],
        backgroundColor: Colors.success[50],
    },
    optionIncorrect: {
        borderColor: Colors.error[500],
        backgroundColor: Colors.error[50],
    },
    optionLetter: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.background.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    optionLetterText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    optionText: {
        flex: 1,
        fontSize: FontSize.base,
        color: theme.text.primary,
    },
    explanationCard: {
        marginTop: Spacing.lg,
        padding: Spacing.lg,
        backgroundColor: isDark ? theme.background.primary : Colors.neutral[50],
    },
    explanationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    explanationTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    explanationText: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        lineHeight: 22,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    nextButtonText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
    },
    scoreDisplay: {
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    scoreText: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
    },
    // Styles for refactored scrollable layout
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120, // Space for tab bar
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },

    topicsList: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
    },
});
