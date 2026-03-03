import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '../../components/ui';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { FILL_IN_BLANK_TOPICS, FillInBlankTopic } from '../../data/content/fillInBlankTopics';
import { generateFillInBlankQuestions, FillInBlankQuestion } from '../../services/geminiService';
import { CEFRLevel } from '../../types';

const { width } = Dimensions.get('window');

type ScreenMode = 'topics' | 'quiz' | 'results';

export const FillInBlankScreen: React.FC = () => {
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const styles = getStyles(theme, isDark);

    const [mode, setMode] = useState<ScreenMode>('topics');
    const [customTopic, setCustomTopic] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [questions, setQuestions] = useState<FillInBlankQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userLevel] = useState<CEFRLevel>('A1'); // Could be from user profile

    const loadQuestions = useCallback(async (topicName: string) => {
        setIsLoading(true);
        setSelectedTopic(topicName);
        try {
            const generatedQuestions = await generateFillInBlankQuestions(topicName, userLevel, 10);
            if (generatedQuestions.length > 0) {
                setQuestions(generatedQuestions);
                setMode('quiz');
                setCurrentIndex(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                // Fallback if AI fails
                console.warn('No questions generated');
            }
        } catch (error) {
            console.error('Error loading questions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userLevel]);

    const handleTopicSelect = (topic: FillInBlankTopic) => {
        loadQuestions(topic.name);
    };

    const handleCustomTopicSubmit = () => {
        if (customTopic.trim()) {
            loadQuestions(customTopic.trim());
        }
    };

    const handleAnswerSelect = (answer: string) => {
        if (showResult) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        if (answer === questions[currentIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setMode('results');
        }
    };

    const handleRestart = () => {
        setMode('topics');
        setQuestions([]);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setCustomTopic('');
    };

    const renderTopicSelection = () => (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Custom Topic Input */}
            <View style={styles.customTopicContainer}>
                <Text style={styles.sectionTitle}>Create Your Own Topic</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter a topic (e.g., 'Travel vocabulary')"
                        placeholderTextColor={theme.text.tertiary}
                        value={customTopic}
                        onChangeText={setCustomTopic}
                        onSubmitEditing={handleCustomTopicSubmit}
                    />
                    <TouchableOpacity
                        style={styles.goButton}
                        onPress={handleCustomTopicSubmit}
                        disabled={!customTopic.trim()}
                    >
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Grammar Topics */}
            <Text style={styles.sectionTitle}>Grammar</Text>
            <View style={styles.topicsGrid}>
                {FILL_IN_BLANK_TOPICS.filter(t => t.category === 'grammar').map(topic => (
                    <TouchableOpacity
                        key={topic.id}
                        style={styles.topicCard}
                        onPress={() => handleTopicSelect(topic)}
                    >
                        <View style={[styles.topicIcon, { backgroundColor: '#4F46E5' }]}>
                            <Ionicons name={topic.icon as any} size={24} color="#fff" />
                        </View>
                        <Text style={styles.topicName}>{topic.name}</Text>
                        <Text style={styles.topicLevel}>{topic.level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Vocabulary Topics */}
            <Text style={styles.sectionTitle}>Vocabulary</Text>
            <View style={styles.topicsGrid}>
                {FILL_IN_BLANK_TOPICS.filter(t => t.category === 'vocabulary').map(topic => (
                    <TouchableOpacity
                        key={topic.id}
                        style={styles.topicCard}
                        onPress={() => handleTopicSelect(topic)}
                    >
                        <View style={[styles.topicIcon, { backgroundColor: '#10B981' }]}>
                            <Ionicons name={topic.icon as any} size={24} color="#fff" />
                        </View>
                        <Text style={styles.topicName}>{topic.name}</Text>
                        <Text style={styles.topicLevel}>{topic.level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Everyday Topics */}
            <Text style={styles.sectionTitle}>Everyday German</Text>
            <View style={styles.topicsGrid}>
                {FILL_IN_BLANK_TOPICS.filter(t => t.category === 'everyday').map(topic => (
                    <TouchableOpacity
                        key={topic.id}
                        style={styles.topicCard}
                        onPress={() => handleTopicSelect(topic)}
                    >
                        <View style={[styles.topicIcon, { backgroundColor: '#F59E0B' }]}>
                            <Ionicons name={topic.icon as any} size={24} color="#fff" />
                        </View>
                        <Text style={styles.topicName}>{topic.name}</Text>
                        <Text style={styles.topicLevel}>{topic.level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Intermediate Topics */}
            <Text style={styles.sectionTitle}>Intermediate</Text>
            <View style={styles.topicsGrid}>
                {FILL_IN_BLANK_TOPICS.filter(t => t.category === 'intermediate').map(topic => (
                    <TouchableOpacity
                        key={topic.id}
                        style={styles.topicCard}
                        onPress={() => handleTopicSelect(topic)}
                    >
                        <View style={[styles.topicIcon, { backgroundColor: '#EF4444' }]}>
                            <Ionicons name={topic.icon as any} size={24} color="#fff" />
                        </View>
                        <Text style={styles.topicName}>{topic.name}</Text>
                        <Text style={styles.topicLevel}>{topic.level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );

    const renderQuiz = () => {
        const currentQuestion = questions[currentIndex];
        if (!currentQuestion) return null;

        return (
            <View style={styles.quizContainer}>
                {/* Progress */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((currentIndex + 1) / questions.length) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {currentIndex + 1} / {questions.length}
                    </Text>
                </View>

                {/* Score */}
                <View style={styles.scoreContainer}>
                    <Ionicons name="star" size={20} color="#F59E0B" />
                    <Text style={styles.scoreText}>{score}</Text>
                </View>

                {/* Question Card */}
                <View style={styles.questionCard}>
                    <Text style={styles.sentenceText}>
                        {currentQuestion.sentence}
                    </Text>

                    {showResult && (
                        <Text style={styles.translationText}>
                            {currentQuestion.translation}
                        </Text>
                    )}
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => {
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const isSelected = option === selectedAnswer;

                        let optionStyle = styles.optionButton;
                        let textStyle = styles.optionText;

                        if (showResult) {
                            if (isCorrect) {
                                optionStyle = { ...optionStyle, ...styles.optionCorrect };
                                textStyle = { ...textStyle, color: '#fff' };
                            } else if (isSelected && !isCorrect) {
                                optionStyle = { ...optionStyle, ...styles.optionWrong };
                                textStyle = { ...textStyle, color: '#fff' };
                            }
                        } else if (isSelected) {
                            optionStyle = { ...optionStyle, ...styles.optionSelected };
                        }

                        return (
                            <TouchableOpacity
                                key={index}
                                style={optionStyle}
                                onPress={() => handleAnswerSelect(option)}
                                disabled={showResult}
                            >
                                <Text style={textStyle}>{option}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Explanation */}
                {showResult && currentQuestion.explanation && (
                    <View style={styles.explanationContainer}>
                        <Ionicons name="information-circle" size={20} color={theme.accent} />
                        <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                    </View>
                )}

                {/* Next Button */}
                {showResult && (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <LinearGradient
                            colors={[theme.accent, theme.accent]}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderResults = () => {
        const percentage = Math.round((score / questions.length) * 100);
        let message = '';
        let iconName: 'trophy' | 'ribbon' | 'fitness' | 'library' = 'library';

        if (percentage >= 90) {
            message = 'Excellent! Outstanding performance!';
            iconName = 'trophy';
        } else if (percentage >= 70) {
            message = 'Great job! Keep it up!';
            iconName = 'ribbon';
        } else if (percentage >= 50) {
            message = 'Good effort! Practice more!';
            iconName = 'fitness';
        } else {
            message = 'Keep practicing! You\'ll improve!';
            iconName = 'library';
        }

        return (
            <View style={styles.resultsContainer}>
                <Ionicons name={iconName} size={56} color={theme.accent} style={{ marginBottom: 16 }} />
                <Text style={styles.resultsTitle}>Quiz Complete!</Text>
                <Text style={styles.resultsMessage}>{message}</Text>

                <View style={styles.scoreCard}>
                    <Text style={styles.scoreBig}>{score}</Text>
                    <Text style={styles.scoreOf}>out of</Text>
                    <Text style={styles.scoreBig}>{questions.length}</Text>
                </View>

                <Text style={styles.percentageText}>{percentage}% correct</Text>

                <View style={styles.resultsButtons}>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => loadQuestions(selectedTopic)}
                    >
                        <Ionicons name="refresh" size={20} color={theme.accent} />
                        <Text style={styles.retryText}>Try Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.newTopicButton} onPress={handleRestart}>
                        <LinearGradient
                            colors={[theme.accent, theme.accent]}
                            style={styles.newTopicGradient}
                        >
                            <Ionicons name="apps" size={20} color="#fff" />
                            <Text style={styles.newTopicText}>New Topic</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeArea style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (mode === 'topics') {
                        navigation.goBack();
                    } else {
                        handleRestart();
                    }
                }}>
                    <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {mode === 'topics' ? 'Fill in the Blank' : selectedTopic}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Loading Overlay */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={theme.accent} />
                        <Text style={styles.loadingText}>Generating questions...</Text>
                        <Text style={styles.loadingSubtext}>AI is creating your quiz</Text>
                    </View>
                </View>
            )}

            {/* Content */}
            {mode === 'topics' && renderTopicSelection()}
            {mode === 'quiz' && renderQuiz()}
            {mode === 'results' && renderResults()}
        </SafeArea>
    );
};

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.text.primary,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    customTopicContainer: {
        marginBottom: 24,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.text.primary,
        marginBottom: 12,
        marginTop: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: isDark ? theme.background.elevated : '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: theme.text.primary,
    },
    goButton: {
        backgroundColor: theme.accent,
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topicsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    topicCard: {
        width: (width - 52) / 2,
        backgroundColor: isDark ? theme.background.elevated : '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    topicIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    topicName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.text.primary,
        textAlign: 'center',
        marginBottom: 4,
    },
    topicLevel: {
        fontSize: 12,
        color: theme.text.tertiary,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    loadingCard: {
        backgroundColor: isDark ? theme.background.elevated : '#fff',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        width: width * 0.8,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.text.primary,
        marginTop: 16,
    },
    loadingSubtext: {
        fontSize: 14,
        color: theme.text.tertiary,
        marginTop: 4,
    },
    quizContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: isDark ? theme.background.elevated : '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.accent,
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.text.tertiary,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F59E0B',
    },
    questionCard: {
        backgroundColor: isDark ? theme.background.elevated : '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    sentenceText: {
        fontSize: 22,
        fontWeight: '600',
        color: theme.text.primary,
        textAlign: 'center',
        lineHeight: 32,
    },
    translationText: {
        fontSize: 16,
        color: theme.text.tertiary,
        textAlign: 'center',
        marginTop: 16,
        fontStyle: 'italic',
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        backgroundColor: isDark ? theme.background.elevated : '#fff',
        borderRadius: 16,
        padding: 18,
        borderWidth: 2,
        borderColor: isDark ? theme.border.medium : '#E5E7EB',
    },
    optionSelected: {
        borderColor: theme.accent,
        backgroundColor: isDark ? `${theme.accent}20` : `${theme.accent}10`,
    },
    optionCorrect: {
        borderColor: '#10B981',
        backgroundColor: '#10B981',
    },
    optionWrong: {
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
    },
    optionText: {
        fontSize: 18,
        fontWeight: '500',
        color: theme.text.primary,
        textAlign: 'center',
    },
    explanationContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: isDark ? `${theme.accent}20` : `${theme.accent}10`,
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    explanationText: {
        flex: 1,
        fontSize: 14,
        color: theme.text.primary,
        lineHeight: 20,
    },
    nextButton: {
        marginTop: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 18,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    resultsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    resultsTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.text.primary,
        marginBottom: 8,
    },
    resultsMessage: {
        fontSize: 16,
        color: theme.text.tertiary,
        marginBottom: 32,
    },
    scoreCard: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 8,
    },
    scoreBig: {
        fontSize: 48,
        fontWeight: '700',
        color: theme.accent,
    },
    scoreOf: {
        fontSize: 20,
        color: theme.text.tertiary,
    },
    percentageText: {
        fontSize: 18,
        color: theme.text.tertiary,
        marginBottom: 40,
    },
    resultsButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: isDark ? theme.background.elevated : '#F3F4F6',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
    },
    retryText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.accent,
    },
    newTopicButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    newTopicGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    newTopicText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default FillInBlankScreen;
