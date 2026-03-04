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
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, Badge, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LevelColors, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext'
import { useUserStore, useSettingsStore } from '../../store';
import { generateQuizBatch } from '../../services/geminiService';
import { getLevelTitle } from '../../utils/levelUtils';
import { CEFRLevel, Exercise } from '../../types';
import { useStaggeredList } from '../../hooks/useAnimations';

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

    // Staggered entrance for topic selection view (3 sections)
    const sectionAnims = useStaggeredList(3, 80, 50);

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
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Practice</Text>
                    </View>

                    {/* Level Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.levelTabs}>
                        {levels.map((level) => {
                            const isActive = selectedLevel === level;
                            const LEVEL_GRADS: Record<string, [string, string]> = {
                                A1: [Colors.success[400], Colors.success[600]],
                                A2: [Colors.primary[400], Colors.primary[600]],
                                B1: ['#8B5CF6', '#6D28D9'],
                                B2: [Colors.secondary[400], Colors.secondary[600]],
                            };
                            const LEVEL_NAMES: Record<string, string> = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Advanced' };
                            return (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setSelectedLevel(level)}
                                    activeOpacity={0.7}
                                >
                                    {isActive ? (
                                        <LinearGradient
                                            colors={LEVEL_GRADS[level]}
                                            style={styles.levelTab}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <Text style={styles.levelTabTextActive}>{LEVEL_NAMES[level]}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={[styles.levelTab, { backgroundColor: theme.background.tertiary }]}>
                                            <Text style={styles.levelTabText}>{LEVEL_NAMES[level]}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Stats Row */}
                    <Animated.View style={sectionAnims[0]}>
                        <View style={styles.statsRow}>
                            {[
                                { label: 'Correct', value: score, icon: 'checkmark-circle' as const, color: Colors.success[500] },
                                { label: 'Answered', value: totalAnswered, icon: 'documents' as const, color: Colors.primary[500] },
                                { label: 'Accuracy', value: `${totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%`, icon: 'analytics' as const, color: Colors.secondary[500] },
                            ].map((stat) => (
                                <View key={stat.label} style={[styles.statCard, { backgroundColor: theme.background.primary }]}>
                                    <Ionicons name={stat.icon} size={20} color={stat.color} />
                                    <Text style={[styles.statValue, { color: theme.text.primary }]}>{stat.value}</Text>
                                    <Text style={[styles.statLabel, { color: theme.text.tertiary }]}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Topics */}
                    <Animated.View style={sectionAnims[1]}>
                        <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>Quiz Topics</Text>

                        <View style={styles.topicsList}>
                            {PRACTICE_TOPICS[selectedLevel].map((topic, index) => {
                                const LEVEL_GRADS: Record<string, [string, string]> = {
                                    A1: [Colors.success[400], Colors.success[600]],
                                    A2: [Colors.primary[400], Colors.primary[600]],
                                    B1: ['#8B5CF6', '#6D28D9'],
                                    B2: [Colors.secondary[400], Colors.secondary[600]],
                                };
                                return (
                                    <TouchableOpacity
                                        key={topic}
                                        activeOpacity={0.7}
                                        onPress={() => startPractice(topic)}
                                        disabled={loading}
                                        style={[styles.topicCard, { backgroundColor: theme.background.primary }]}
                                    >
                                        <LinearGradient
                                            colors={LEVEL_GRADS[selectedLevel]}
                                            style={styles.topicIcon}
                                        >
                                            <Text style={styles.topicNumberText}>{index + 1}</Text>
                                        </LinearGradient>
                                        <Text style={[styles.topicTitle, { color: theme.text.primary }]}>{topic}</Text>
                                        {loading && selectedTopic === topic ? (
                                            <ActivityIndicator size="small" color={LevelColors[selectedLevel]} />
                                        ) : (
                                            <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>
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
                    <Badge label={getLevelTitle(selectedLevel)} variant="level" level={selectedLevel} />
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
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    levelTabs: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        paddingVertical: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    levelTab: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    levelTabText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: theme.text.secondary,
    },
    levelTabTextActive: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    statValue: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginTop: Spacing.sm,
    },
    statLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        marginTop: 2,
    },
    topicsContainer: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    topicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    topicIcon: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    topicNumberText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    topicTitle: {
        flex: 1,
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
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
    topicsList: {
        marginTop: Spacing.xs,
    },
});
