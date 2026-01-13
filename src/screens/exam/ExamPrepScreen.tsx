// Exam Prep Screen - Goethe and Telc exam practice
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { CEFRLevel, Exercise } from '../../types';
import {
    GoetheExamStructure,
    goetheA1ReadingExercises,
    getGoetheExercises,
} from '../../data/content/goethe-exam';
import {
    TelcExamStructure,
    telcReadingExercises,
    getTelcExercises,
} from '../../data/content/telc-exam';

type ScreenState = 'select-exam' | 'select-section' | 'practice' | 'results';
type ExamType = 'goethe' | 'telc';

interface ExamResult {
    correct: number;
    total: number;
    timeSpent: number;
    answers: { exerciseId: string; answer: string; isCorrect: boolean }[];
}

export const ExamPrepScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const { progress } = useUserStore();
    const styles = getStyles(theme, isDark);

    const [screenState, setScreenState] = useState<ScreenState>('select-exam');
    const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(progress.level);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [examResult, setExamResult] = useState<ExamResult | null>(null);
    const [answers, setAnswers] = useState<{ exerciseId: string; answer: string; isCorrect: boolean }[]>([]);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<Date | null>(null);

    // Timer effect
    useEffect(() => {
        if (screenState === 'practice' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        finishExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [screenState]);

    const currentExercise = exercises[currentIndex];

    const getExamStructure = () => {
        if (selectedExam === 'goethe') {
            return GoetheExamStructure[selectedLevel];
        } else if (selectedExam === 'telc') {
            return TelcExamStructure[selectedLevel];
        }
        return null;
    };

    const handleSelectExam = (exam: ExamType) => {
        setSelectedExam(exam);
        setScreenState('select-section');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSelectSection = (section: string) => {
        setSelectedSection(section);

        // Load exercises for this section
        let loadedExercises: Exercise[] = [];
        if (selectedExam === 'goethe') {
            loadedExercises = getGoetheExercises(selectedLevel, section);
        } else if (selectedExam === 'telc') {
            loadedExercises = getTelcExercises(selectedLevel, section);
        }

        // If no specific exercises, use a fallback
        if (loadedExercises.length === 0) {
            loadedExercises = goetheA1ReadingExercises;
        }

        setExercises(loadedExercises);

        // Get time limit from structure
        const structure = getExamStructure();
        const sectionInfo = structure?.sections.find(s =>
            s.name.includes(section) || s.name.toLowerCase().includes(section.toLowerCase())
        );
        setTimeLeft((sectionInfo?.duration || 10) * 60); // Convert to seconds

        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setAnswers([]);
        startTimeRef.current = new Date();
        setScreenState('practice');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleAnswer = (answer: string) => {
        if (showExplanation) return;

        setSelectedAnswer(answer);
        const isCorrect = answer === currentExercise.correctAnswer;

        setAnswers(prev => [...prev, {
            exerciseId: currentExercise.id,
            answer,
            isCorrect,
        }]);

        setShowExplanation(true);
        Haptics.impactAsync(
            isCorrect
                ? Haptics.ImpactFeedbackStyle.Light
                : Haptics.ImpactFeedbackStyle.Heavy
        );
    };

    const handleNext = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            finishExam();
        }
    };

    const finishExam = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const endTime = new Date();
        const timeSpent = startTimeRef.current
            ? Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000)
            : 0;

        const correct = answers.filter(a => a.isCorrect).length;

        setExamResult({
            correct,
            total: exercises.length,
            timeSpent,
            answers,
        });

        setScreenState('results');
    };

    const handleRestart = () => {
        setScreenState('select-exam');
        setSelectedExam(null);
        setSelectedSection(null);
        setExercises([]);
        setCurrentIndex(0);
        setAnswers([]);
        setExamResult(null);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderExamSelect = () => (
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.sectionTitle}>Choose Exam Type</Text>
            <Text style={styles.sectionSubtitle}>
                Practice with official exam formats
            </Text>

            {/* Goethe Card */}
            <TouchableOpacity
                style={styles.examCard}
                onPress={() => handleSelectExam('goethe')}
            >
                <View style={styles.examHeader}>
                    <Ionicons name="school-outline" size={40} color={Colors.primary[500]} style={styles.examIcon} />
                    <View style={styles.examInfo}>
                        <Text style={styles.examName}>Goethe-Institut</Text>
                        <Text style={styles.examDesc}>Official German language certification</Text>
                    </View>
                </View>
                <View style={styles.examLevels}>
                    {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((level) => (
                        <View
                            key={level}
                            style={[
                                styles.levelChip,
                                level === selectedLevel && styles.levelChipActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.levelChipText,
                                    level === selectedLevel && styles.levelChipTextActive,
                                ]}
                            >
                                {level}
                            </Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>

            {/* Telc Card */}
            <TouchableOpacity
                style={styles.examCard}
                onPress={() => handleSelectExam('telc')}
            >
                <View style={styles.examHeader}>
                    <Ionicons name="document-text-outline" size={40} color={Colors.primary[500]} style={styles.examIcon} />
                    <View style={styles.examInfo}>
                        <Text style={styles.examName}>telc</Text>
                        <Text style={styles.examDesc}>The European Language Certificates</Text>
                    </View>
                </View>
                <View style={styles.examLevels}>
                    {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((level) => (
                        <View
                            key={level}
                            style={[
                                styles.levelChip,
                                level === selectedLevel && styles.levelChipActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.levelChipText,
                                    level === selectedLevel && styles.levelChipTextActive,
                                ]}
                            >
                                {level}
                            </Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>

            {/* Level Selector */}
            <Text style={styles.levelSelectTitle}>Select Your Level</Text>
            <View style={styles.levelSelector}>
                {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((level) => (
                    <TouchableOpacity
                        key={level}
                        style={[
                            styles.levelButton,
                            selectedLevel === level && styles.levelButtonActive,
                        ]}
                        onPress={() => setSelectedLevel(level)}
                    >
                        <Text
                            style={[
                                styles.levelButtonText,
                                selectedLevel === level && styles.levelButtonTextActive,
                            ]}
                        >
                            {level}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderSectionSelect = () => {
        const structure = getExamStructure();
        if (!structure) return null;

        return (
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.examBadge}>
                    <Text style={styles.examBadgeText}>
                        {selectedExam === 'goethe' ? 'Goethe-Institut' : 'telc'} {selectedLevel}
                    </Text>
                </View>

                <Text style={styles.examFullName}>{structure.name}</Text>

                <Text style={styles.sectionTitle}>Choose Section</Text>

                {structure.sections.map((section, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.sectionCard}
                        onPress={() => handleSelectSection(section.name)}
                    >
                        <View style={styles.sectionInfo}>
                            <Ionicons
                                name={
                                    section.name.includes('Lesen') || section.name.includes('Reading')
                                        ? 'book-outline'
                                        : section.name.includes('Hören') || section.name.includes('Listening')
                                            ? 'headset-outline'
                                            : section.name.includes('Schreiben') || section.name.includes('Writing')
                                                ? 'create-outline'
                                                : 'mic-outline'
                                }
                                size={28}
                                color={Colors.primary[500]}
                            />
                            <View style={styles.sectionText}>
                                <Text style={styles.sectionName}>{section.name}</Text>
                                <Text style={styles.sectionMeta}>
                                    {section.duration} min • {section.points} points
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={theme.text.tertiary} />
                    </TouchableOpacity>
                ))}

                <View style={styles.examMeta}>
                    <Text style={styles.examMetaText}>
                        Total duration: {structure.totalDuration} min
                    </Text>
                    <Text style={styles.examMetaText}>
                        Passing score: {structure.passingScore}%
                    </Text>
                </View>
            </ScrollView>
        );
    };

    const renderPractice = () => {
        if (!currentExercise) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            );
        }

        return (
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.practiceContainer}>
                {/* Timer */}
                <View style={styles.timerBar}>
                    <View style={styles.timerLeft}>
                        <Ionicons
                            name="time"
                            size={20}
                            color={timeLeft < 60 ? Colors.error[500] : Colors.primary[500]}
                        />
                        <Text
                            style={[
                                styles.timerText,
                                timeLeft < 60 && styles.timerTextWarning,
                            ]}
                        >
                            {formatTime(timeLeft)}
                        </Text>
                    </View>
                    <Text style={styles.progressText}>
                        {currentIndex + 1} / {exercises.length}
                    </Text>
                </View>

                {/* Question */}
                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{currentExercise.question}</Text>
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {currentExercise.options?.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentExercise.correctAnswer;
                        const showCorrect = showExplanation && isCorrect;
                        const showWrong = showExplanation && isSelected && !isCorrect;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    isSelected && styles.optionSelected,
                                    showCorrect && styles.optionCorrect,
                                    showWrong && styles.optionWrong,
                                ]}
                                onPress={() => handleAnswer(option)}
                                disabled={showExplanation}
                            >
                                <View style={styles.optionIndex}>
                                    <Text style={styles.optionIndexText}>
                                        {String.fromCharCode(65 + index)}
                                    </Text>
                                </View>
                                <Text style={styles.optionText}>{option}</Text>
                                {showCorrect && (
                                    <Ionicons name="checkmark-circle" size={24} color={Colors.success[500]} />
                                )}
                                {showWrong && (
                                    <Ionicons name="close-circle" size={24} color={Colors.error[500]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Explanation */}
                {showExplanation && currentExercise.explanation && (
                    <View style={styles.explanationCard}>
                        <Ionicons name="bulb" size={20} color={Colors.warning[500]} />
                        <Text style={styles.explanationText}>{currentExercise.explanation}</Text>
                    </View>
                )}

                {/* Next Button */}
                {showExplanation && (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>
                            {currentIndex < exercises.length - 1 ? 'Next Question' : 'Finish Exam'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.white} />
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    };

    const renderResults = () => {
        if (!examResult) return null;

        const percentage = Math.round((examResult.correct / examResult.total) * 100);
        const passed = percentage >= 60;

        return (
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.resultCard}>
                    <Ionicons
                        name={passed ? "trophy" : "library"}
                        size={64}
                        color={passed ? Colors.gold[500] : Colors.primary[500]}
                        style={styles.resultIcon}
                    />
                    <Text style={styles.resultTitle}>
                        {passed ? 'Well Done!' : 'Keep Practicing!'}
                    </Text>

                    <View style={styles.scoreCircle}>
                        <Text style={styles.scorePercentage}>{percentage}%</Text>
                        <Text style={styles.scoreLabel}>Score</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxValue}>{examResult.correct}</Text>
                            <Text style={styles.statBoxLabel}>Correct</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxValue}>{examResult.total - examResult.correct}</Text>
                            <Text style={styles.statBoxLabel}>Wrong</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxValue}>{formatTime(examResult.timeSpent)}</Text>
                            <Text style={styles.statBoxLabel}>Time</Text>
                        </View>
                    </View>

                    <View style={[styles.passStatus, passed ? styles.passStatusPassed : styles.passStatusFailed]}>
                        <Ionicons
                            name={passed ? 'checkmark-circle' : 'close-circle'}
                            size={24}
                            color={passed ? Colors.success[600] : Colors.error[600]}
                        />
                        <Text style={[styles.passStatusText, passed ? styles.passStatusTextPassed : styles.passStatusTextFailed]}>
                            {passed ? 'Passing Grade Achieved!' : 'Below Passing Grade (60%)'}
                        </Text>
                    </View>
                </View>

                <View style={styles.resultActions}>
                    <TouchableOpacity
                        style={styles.tryAgainButton}
                        onPress={() => handleSelectSection(selectedSection || '')}
                    >
                        <Ionicons name="refresh" size={20} color={Colors.white} />
                        <Text style={styles.tryAgainButtonText}>Try Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.exitButton} onPress={handleRestart}>
                        <Text style={styles.exitButtonText}>Back to Exams</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (screenState === 'select-exam') {
                            navigation.goBack();
                        } else if (screenState === 'select-section') {
                            setScreenState('select-exam');
                        } else if (screenState === 'practice') {
                            finishExam();
                        } else {
                            handleRestart();
                        }
                    }}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Exam Prep</Text>
                <View style={styles.headerRight}>
                    <Text style={styles.levelBadge}>{selectedLevel}</Text>
                </View>
            </View>

            {screenState === 'select-exam' && renderExamSelect()}
            {screenState === 'select-section' && renderSectionSelect()}
            {screenState === 'practice' && renderPractice()}
            {screenState === 'results' && renderResults()}
        </View>
    );
};

const getStyles = (theme: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.primary,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing.md,
            paddingTop: 50,
            paddingBottom: Spacing.md,
            backgroundColor: theme.background.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.border.light,
        },
        backButton: {
            padding: Spacing.xs,
        },
        headerTitle: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        headerRight: {
            width: 50,
            alignItems: 'flex-end',
        },
        levelBadge: {
            backgroundColor: Colors.primary[500],
            color: Colors.white,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: BorderRadius.sm,
            fontSize: FontSize.sm,
            fontWeight: FontWeight.bold,
            overflow: 'hidden',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        scrollContent: {
            flex: 1,
        },
        scrollContainer: {
            padding: Spacing.md,
            paddingBottom: Spacing['2xl'],
        },
        sectionTitle: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.xs,
        },
        sectionSubtitle: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.lg,
        },
        examCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.md,
            ...Shadows.sm,
        },
        examHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.md,
        },
        examIcon: {
            marginRight: Spacing.md,
        },
        resultIcon: {
            marginBottom: Spacing.md,
        },
        examInfo: {
            flex: 1,
        },
        examName: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        examDesc: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },
        examLevels: {
            flexDirection: 'row',
            gap: Spacing.xs,
        },
        levelChip: {
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            backgroundColor: theme.background.tertiary,
            borderRadius: BorderRadius.sm,
        },
        levelChipActive: {
            backgroundColor: Colors.primary[100],
        },
        levelChipText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },
        levelChipTextActive: {
            color: Colors.primary[600],
            fontWeight: FontWeight.bold,
        },
        levelSelectTitle: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginTop: Spacing.lg,
            marginBottom: Spacing.sm,
        },
        levelSelector: {
            flexDirection: 'row',
            gap: Spacing.sm,
        },
        levelButton: {
            flex: 1,
            paddingVertical: Spacing.md,
            alignItems: 'center',
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.md,
        },
        levelButtonActive: {
            backgroundColor: Colors.primary[500],
        },
        levelButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.secondary,
        },
        levelButtonTextActive: {
            color: Colors.white,
        },
        examBadge: {
            alignSelf: 'flex-start',
            backgroundColor: Colors.primary[100],
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            borderRadius: BorderRadius.sm,
            marginBottom: Spacing.sm,
        },
        examBadgeText: {
            fontSize: FontSize.sm,
            color: Colors.primary[700],
            fontWeight: FontWeight.bold,
        },
        examFullName: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.lg,
        },
        sectionCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.sm,
            ...Shadows.sm,
        },
        sectionInfo: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.md,
        },
        sectionText: {
            flex: 1,
        },
        sectionName: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        sectionMeta: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },
        examMeta: {
            marginTop: Spacing.lg,
            padding: Spacing.md,
            backgroundColor: theme.background.tertiary,
            borderRadius: BorderRadius.md,
        },
        examMetaText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: 4,
        },
        practiceContainer: {
            padding: Spacing.md,
            paddingBottom: Spacing['2xl'],
        },
        timerBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.md,
        },
        timerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
        },
        timerText: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: Colors.primary[500],
        },
        timerTextWarning: {
            color: Colors.error[500],
        },
        progressText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
        },
        questionCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
            ...Shadows.sm,
        },
        questionText: {
            fontSize: FontSize.md,
            color: theme.text.primary,
            lineHeight: 24,
        },
        optionsContainer: {
            gap: Spacing.sm,
            marginBottom: Spacing.lg,
        },
        optionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        optionSelected: {
            borderColor: Colors.primary[500],
            backgroundColor: Colors.primary[50],
        },
        optionCorrect: {
            borderColor: Colors.success[500],
            backgroundColor: Colors.success[50],
        },
        optionWrong: {
            borderColor: Colors.error[500],
            backgroundColor: Colors.error[50],
        },
        optionIndex: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.background.tertiary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.sm,
        },
        optionIndexText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.secondary,
        },
        optionText: {
            flex: 1,
            fontSize: FontSize.md,
            color: theme.text.primary,
        },
        explanationCard: {
            flexDirection: 'row',
            backgroundColor: Colors.warning[50],
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            marginBottom: Spacing.lg,
            gap: Spacing.sm,
        },
        explanationText: {
            flex: 1,
            fontSize: FontSize.sm,
            color: Colors.warning[700],
        },
        nextButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.md,
            gap: Spacing.xs,
        },
        nextButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        resultCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.xl,
            padding: Spacing.xl,
            alignItems: 'center',
            marginBottom: Spacing.lg,
            ...Shadows.lg,
        },
        resultEmoji: {
            fontSize: 64,
            marginBottom: Spacing.md,
        },
        resultTitle: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.lg,
        },
        scoreCircle: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: Colors.primary[100],
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.lg,
        },
        scorePercentage: {
            fontSize: 36,
            fontWeight: FontWeight.bold,
            color: Colors.primary[600],
        },
        scoreLabel: {
            fontSize: FontSize.sm,
            color: Colors.primary[500],
        },
        statsRow: {
            flexDirection: 'row',
            gap: Spacing.lg,
            marginBottom: Spacing.lg,
        },
        statBox: {
            alignItems: 'center',
        },
        statBoxValue: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        statBoxLabel: {
            fontSize: FontSize.xs,
            color: theme.text.secondary,
        },
        passStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderRadius: BorderRadius.md,
            gap: Spacing.xs,
        },
        passStatusPassed: {
            backgroundColor: Colors.success[100],
        },
        passStatusFailed: {
            backgroundColor: Colors.error[100],
        },
        passStatusText: {
            fontSize: FontSize.sm,
            fontWeight: FontWeight.medium,
        },
        passStatusTextPassed: {
            color: Colors.success[700],
        },
        passStatusTextFailed: {
            color: Colors.error[700],
        },
        resultActions: {
            gap: Spacing.md,
        },
        tryAgainButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.md,
            gap: Spacing.sm,
        },
        tryAgainButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        exitButton: {
            alignItems: 'center',
            paddingVertical: Spacing.md,
        },
        exitButtonText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
        },
    });

export default ExamPrepScreen;
