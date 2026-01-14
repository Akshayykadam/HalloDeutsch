import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import * as Haptics from 'expo-haptics';
import { Card, Button, ProgressBar, Badge, SafeArea } from '../../components/ui';
import { QuizCompleteModal, ModuleCompleteModal } from '../../components/gamification';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { getLessonById, getModuleForLesson, isLastLessonInModule } from '../../data/content/curriculum-service';
import { generateQuizBatch } from '../../services/geminiService';
import { Exercise } from '../../types';

const GERMAN_FACTS = [
    "Did you know? German has three genders: masculine, feminine, and neuter.",
    "Tip: Always capitalize every Noun in German.",
    "Fun Fact: The letter 'ß' (Eszett) is unique to German.",
    "Did you know? About 60% of German vocabulary is similar to English.",
    "Tip: 'Guten Appetit' means 'Enjoy your meal'!",
    "Fun Fact: German is the most widely spoken native language in Europe.",
    "Tip: Listen to German music to improve your pronunciation.",
    "Did you know? Berlin has more bridges than Venice.",
];

export const QuizScreen: React.FC = () => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { lessonId } = route.params;
    const { progress: userProgress } = useUserStore(); // Destructure properly


    const lesson = getLessonById(lessonId);

    // State
    const [questions, setQuestions] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [batchCount, setBatchCount] = useState(1);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showModuleComplete, setShowModuleComplete] = useState(false);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    // Rotation logic for tips
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            interval = setInterval(() => {
                setCurrentTipIndex((prev) => (prev + 1) % GERMAN_FACTS.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Get current module for navigation
    const currentModule = lessonId ? getModuleForLesson(lessonId) : undefined;
    const isLastLesson = lessonId ? isLastLessonInModule(lessonId) : false;

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        if (!lesson) return;
        setLoading(true);
        try {
            const newQuestions = await generateQuizBatch(lesson.title, 'A1', 10);
            if (newQuestions && newQuestions.length > 0) {
                setQuestions(newQuestions);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                Alert.alert('Error', 'Failed to generate questions. Please try again.');
            }
        } catch (error) {
            console.error('Failed to load questions:', error);
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return; // Already answered

        setSelectedAnswer(answer);
        const currentQuestion = questions[currentIndex];
        const correct = answer === currentQuestion.correctAnswer;

        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Play success sound logic here if needed
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            // End of batch - show modal
            setShowCompleteModal(true);
        }
    };

    const handleContinueBatch = () => {
        setShowCompleteModal(false);
        setBatchCount(prev => prev + 1);
        setScore(0);
        loadQuestions();
    };

    const handleFinishQuiz = () => {
        setShowCompleteModal(false);

        // Check if this is the last lesson in the module
        if (isLastLesson) {
            setShowModuleComplete(true);
        } else {
            // Navigate back to module detail
            if (currentModule) {
                (navigation as any).navigate('ModuleDetail', { moduleId: currentModule.id });
            } else {
                navigation.goBack();
            }
        }
    };

    const handleModuleCompleteClose = () => {
        setShowModuleComplete(false);
        (navigation as any).navigate('LearnHome');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const speakText = (text: string) => {
        audioService.speak(text);
    };

    if (loading) {
        return (
            <SafeArea style={styles.container}>
                <View style={[styles.loadingContainer, { backgroundColor: theme.background.primary }]}>
                    <View style={styles.loadingContent}>
                        <View style={styles.loadingIconContainer}>
                            <ActivityIndicator size="large" color={Colors.primary[500]} />
                        </View>
                        <Text style={[styles.loadingText, { color: theme.text.primary }]}>
                            Generating AI Questions...
                        </Text>

                        <View style={[styles.tipContainer, { backgroundColor: theme.background.secondary }]}>
                            <Ionicons name="bulb-outline" size={24} color={Colors.warning[500]} style={{ marginBottom: Spacing.sm }} />
                            <Text style={[styles.tipText, { color: theme.text.secondary }]}>
                                {GERMAN_FACTS[currentTipIndex]}
                            </Text>
                        </View>
                    </View>
                </View>
            </SafeArea>
        );
    }

    if (!lesson || questions.length === 0) {
        return (
            <SafeArea style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text>Could not load quiz.</Text>
                    <Button title="Go Back" onPress={() => navigation.goBack()} />
                </View>
            </SafeArea>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = (currentIndex + 1) / questions.length;

    return (
        <SafeArea style={styles.container}>
            {/* Module Complete Modal */}
            <ModuleCompleteModal
                visible={showModuleComplete}
                moduleTitle={currentModule?.title || 'Module'}
                moduleTitleDe={currentModule?.titleDe}
                lessonsCompleted={currentModule?.lessons.length || 0}
                onClose={handleModuleCompleteClose}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={theme.text.tertiary} />
                </TouchableOpacity>
                <ProgressBar progress={progress} style={styles.progressBar} />
                <Badge label={`Batch ${batchCount}`} variant="info" />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Question Card */}
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                    <TouchableOpacity onPress={() => speakText(currentQuestion.question)} style={styles.speakerButton}>
                        <Ionicons name="volume-high" size={24} color={Colors.primary[500]} />
                    </TouchableOpacity>
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {currentQuestion.options?.map((option, idx) => {
                        let buttonVariant: 'outline' | 'success' | 'danger' = 'outline';
                        const isSelected = selectedAnswer === option;
                        const isCorrectAnswer = option === currentQuestion.correctAnswer;

                        if (selectedAnswer) {
                            if (isCorrectAnswer) buttonVariant = 'success';
                            else if (isSelected && !isCorrectAnswer) buttonVariant = 'danger';
                        }

                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.optionButton,
                                    isSelected && styles.optionSelected,
                                    isCorrectAnswer && selectedAnswer && styles.optionCorrect,
                                    isSelected && !isCorrectAnswer && styles.optionWrong
                                ]}
                                onPress={() => handleAnswer(option)}
                                disabled={!!selectedAnswer}
                            >
                                <View style={styles.optionLetterContainer}>
                                    <Text style={styles.optionLetter}>{String.fromCharCode(65 + idx)}</Text>
                                </View>
                                <Text style={styles.optionText}>{option}</Text>
                                {selectedAnswer && isCorrectAnswer && (
                                    <Ionicons name="checkmark-circle" size={24} color={Colors.success[600]} />
                                )}
                                {selectedAnswer && isSelected && !isCorrectAnswer && (
                                    <Ionicons name="close-circle" size={24} color={Colors.error[600]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Feedback / Explanation */}
                {selectedAnswer && (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.feedbackTitle}>
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                        </Text>
                        <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                        <Button
                            title={currentIndex < questions.length - 1 ? "Next Question" : "Finish Batch"}
                            onPress={handleNext}
                            variant="primary"
                            fullWidth
                            size="large"
                            style={styles.nextButton}
                        />
                    </View>
                )}

            </ScrollView>

            {/* Quiz Complete Modal */}
            <QuizCompleteModal
                visible={showCompleteModal}
                score={score}
                total={questions.length}
                xpEarned={score * 5}
                onContinue={handleContinueBatch}
                onFinish={handleFinishQuiz}
            />
        </SafeArea>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContent: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    loadingIconContainer: {
        marginBottom: Spacing.lg,
    },
    loadingText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    tipContainer: {
        width: '100%',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        ...Shadows.md,
    },
    tipText: {
        fontSize: FontSize.md,
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        gap: Spacing.md,
        backgroundColor: theme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
    },
    closeButton: {
        padding: 4,
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4,
    },
    content: {
        padding: Spacing.lg,
        flexGrow: 1,
    },
    questionContainer: {
        marginBottom: Spacing.xl,
        alignItems: 'center',
    },
    questionText: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    speakerButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionsContainer: {
        gap: Spacing.md,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: theme.border.light,
        ...Shadows.sm,
    },
    optionSelected: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[500] + '15',
    },
    optionCorrect: {
        borderColor: Colors.success[500],
        backgroundColor: Colors.success[500] + '15',
    },
    optionWrong: {
        borderColor: Colors.error[500],
        backgroundColor: Colors.error[500] + '15',
    },
    optionLetterContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.background.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    optionLetter: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: theme.text.secondary,
    },
    optionText: {
        flex: 1,
        fontSize: FontSize.md,
        color: theme.text.primary,
    },
    feedbackContainer: {
        marginTop: Spacing.xl,
        padding: Spacing.md,
        backgroundColor: theme.background.secondary,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    feedbackTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.xs,
        color: theme.text.primary,
    },
    explanationText: {
        fontSize: FontSize.md,
        color: theme.text.secondary,
        marginBottom: Spacing.lg,
    },
    nextButton: {
        marginTop: Spacing.sm,
    },
});
