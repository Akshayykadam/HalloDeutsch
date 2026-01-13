// Dictation Screen - Listen and Write practice
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as audioService from '../../services/audioService';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import {
    DictationItem,
    getDictationByDifficulty,
    getRandomDictation,
    compareDictation,
} from '../../data/content/dictation-content';

type Difficulty = 'word' | 'phrase' | 'sentence';

export const DictationScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const { progress } = useUserStore();
    const styles = getStyles(theme, isDark);

    const [difficulty, setDifficulty] = useState<Difficulty>('word');
    const [items, setItems] = useState<DictationItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState<{
        isCorrect: boolean;
        accuracy: number;
        differences: { char: string; correct: boolean }[];
    } | null>(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(0);

    useEffect(() => {
        loadItems();
    }, [difficulty, progress.level]);

    // Cleanup: Stop audio when navigating away
    useEffect(() => {
        return () => {
            audioService.stopAudio();
        };
    }, []);

    const loadItems = () => {
        const newItems = getDictationByDifficulty(progress.level, difficulty);
        setItems(newItems.sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setUserInput('');
        setShowResult(false);
        setResult(null);
        setHasPlayed(false);
    };

    const currentItem = items[currentIndex];

    const playAudio = async (slow: boolean = false) => {
        if (isPlaying || !currentItem) return;

        setIsPlaying(true);
        setHasPlayed(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const success = await audioService.speak(currentItem.german, { slow });
        setIsPlaying(false);
    };

    const handleCheck = async () => {
        if (!currentItem || !userInput.trim()) return;

        const checkResult = compareDictation(userInput, currentItem.german);
        setResult(checkResult);
        setShowResult(true);

        if (checkResult.isCorrect) {
            setScore(prev => prev + 1);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        setCompleted(prev => prev + 1);
    };

    const handleNext = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setUserInput('');
            setShowResult(false);
            setResult(null);
            setHasPlayed(false);
        }
    };

    const handleSkip = () => {
        setCompleted(prev => prev + 1);
        handleNext();
    };

    const renderDifficultyTabs = () => (
        <View style={styles.difficultyContainer}>
            {(['word', 'phrase', 'sentence'] as Difficulty[]).map((level) => (
                <TouchableOpacity
                    key={level}
                    style={[
                        styles.difficultyTab,
                        difficulty === level && styles.difficultyTabActive,
                    ]}
                    onPress={() => setDifficulty(level)}
                >
                    <Text
                        style={[
                            styles.difficultyText,
                            difficulty === level && styles.difficultyTextActive,
                        ]}
                    >
                        {level.charAt(0).toUpperCase() + level.slice(1)}s
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderCharComparison = () => {
        if (!result || !currentItem) return null;

        return (
            <View style={styles.comparisonContainer}>
                <Text style={styles.comparisonLabel}>Correct spelling:</Text>
                <View style={styles.charContainer}>
                    {result.differences.map((diff, index) => (
                        <Text
                            key={index}
                            style={[
                                styles.charText,
                                diff.correct ? styles.charCorrect : styles.charWrong,
                            ]}
                        >
                            {diff.char}
                        </Text>
                    ))}
                </View>
                <Text style={styles.translationText}>{currentItem.english}</Text>
            </View>
        );
    };

    if (items.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Dictation</Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No dictation items available for this level.</Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dictation</Text>
                <View style={styles.headerRight}>
                    <Text style={styles.levelBadge}>{progress.level}</Text>
                </View>
            </View>

            {/* Difficulty Tabs */}
            {renderDifficultyTabs()}

            {/* Progress */}
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${((currentIndex + 1) / Math.max(items.length, 1)) * 100}%` },
                    ]}
                />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Instructions */}
                <View style={styles.instructionCard}>
                    <Text style={styles.instructionIcon}>🎧</Text>
                    <Text style={styles.instructionText}>
                        Listen carefully and type what you hear
                    </Text>
                </View>

                {/* Audio Controls */}
                <View style={styles.audioSection}>
                    <TouchableOpacity
                        style={[styles.playButton, isPlaying && styles.playButtonActive]}
                        onPress={() => playAudio(false)}
                        disabled={isPlaying || showResult}
                    >
                        <Ionicons
                            name={isPlaying ? 'pause' : 'volume-high'}
                            size={40}
                            color={Colors.white}
                        />
                    </TouchableOpacity>

                    <View style={styles.audioOptions}>
                        <TouchableOpacity
                            style={styles.audioOptionButton}
                            onPress={() => playAudio(true)}
                            disabled={isPlaying || showResult}
                        >
                            <Ionicons
                                name="speedometer-outline"
                                size={20}
                                color={isPlaying ? Colors.neutral[400] : Colors.primary[500]}
                            />
                            <Text style={styles.audioOptionText}>Slow</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.audioOptionButton}
                            onPress={() => playAudio(false)}
                            disabled={isPlaying || showResult}
                        >
                            <Ionicons
                                name="repeat"
                                size={20}
                                color={isPlaying ? Colors.neutral[400] : Colors.primary[500]}
                            />
                            <Text style={styles.audioOptionText}>Repeat</Text>
                        </TouchableOpacity>
                    </View>

                    {!hasPlayed && (
                        <Text style={styles.tapToPlay}>Tap to play audio</Text>
                    )}
                </View>

                {/* Input Area */}
                {!showResult ? (
                    <View style={styles.inputSection}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={`Type the ${difficulty} you hear...`}
                            placeholderTextColor={theme.text.tertiary}
                            value={userInput}
                            onChangeText={setUserInput}
                            editable={hasPlayed}
                            autoCapitalize="none"
                            autoCorrect={false}
                            multiline={difficulty === 'sentence'}
                        />

                        {currentItem?.hints && currentItem.hints.length > 0 && (
                            <View style={styles.hintsContainer}>
                                <Ionicons name="bulb-outline" size={16} color={Colors.warning[500]} />
                                <Text style={styles.hintText}>{currentItem.hints[0]}</Text>
                            </View>
                        )}

                        <View style={styles.inputActions}>
                            <TouchableOpacity
                                style={styles.skipButton}
                                onPress={handleSkip}
                            >
                                <Text style={styles.skipButtonText}>Skip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.checkButton,
                                    (!userInput.trim() || !hasPlayed) && styles.checkButtonDisabled,
                                ]}
                                onPress={handleCheck}
                                disabled={!userInput.trim() || !hasPlayed}
                            >
                                <Text style={styles.checkButtonText}>Check</Text>
                                <Ionicons name="checkmark" size={20} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.resultSection}>
                        {/* Result Card */}
                        <View
                            style={[
                                styles.resultCard,
                                result?.isCorrect ? styles.resultCorrect : styles.resultWrong,
                            ]}
                        >
                            <View style={styles.resultHeader}>
                                <Text style={styles.resultEmoji}>
                                    {result?.isCorrect ? '🎉' : '📝'}
                                </Text>
                                <Text style={styles.resultTitle}>
                                    {result?.isCorrect ? 'Perfect!' : 'Almost there!'}
                                </Text>
                            </View>

                            {!result?.isCorrect && (
                                <>
                                    <View style={styles.yourAnswerSection}>
                                        <Text style={styles.yourAnswerLabel}>Your answer:</Text>
                                        <Text style={styles.yourAnswerText}>{userInput}</Text>
                                    </View>
                                    {renderCharComparison()}
                                </>
                            )}

                            {result?.isCorrect && (
                                <View style={styles.correctSection}>
                                    <Text style={styles.correctGerman}>{currentItem?.german}</Text>
                                    <Text style={styles.correctEnglish}>{currentItem?.english}</Text>
                                </View>
                            )}

                            <View style={styles.accuracyBar}>
                                <Text style={styles.accuracyLabel}>Accuracy:</Text>
                                <View style={styles.accuracyBarBg}>
                                    <View
                                        style={[
                                            styles.accuracyBarFill,
                                            { width: `${result?.accuracy || 0}%` },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.accuracyValue}>
                                    {Math.round(result?.accuracy || 0)}%
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={handleNext}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentIndex < items.length - 1 ? 'Next' : 'Finish'}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Stats Footer */}
            <View style={styles.statsFooter}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{score}</Text>
                    <Text style={styles.statLabel}>Correct</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{completed}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {completed > 0 ? Math.round((score / completed) * 100) : 0}%
                    </Text>
                    <Text style={styles.statLabel}>Accuracy</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
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
        difficultyContainer: {
            flexDirection: 'row',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            gap: Spacing.sm,
        },
        difficultyTab: {
            flex: 1,
            paddingVertical: Spacing.sm,
            alignItems: 'center',
            borderRadius: BorderRadius.md,
            backgroundColor: theme.background.secondary,
        },
        difficultyTabActive: {
            backgroundColor: Colors.primary[500],
        },
        difficultyText: {
            fontSize: FontSize.sm,
            fontWeight: FontWeight.medium,
            color: theme.text.secondary,
        },
        difficultyTextActive: {
            color: Colors.white,
        },
        progressBar: {
            height: 4,
            backgroundColor: theme.background.tertiary,
        },
        progressFill: {
            height: '100%',
            backgroundColor: Colors.primary[500],
        },
        content: {
            flex: 1,
        },
        contentContainer: {
            padding: Spacing.md,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: Spacing.xl,
        },
        emptyText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
            textAlign: 'center',
        },
        instructionCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.primary[50],
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadius.md,
            marginBottom: Spacing.lg,
            gap: Spacing.sm,
        },
        instructionIcon: {
            fontSize: 24,
        },
        instructionText: {
            fontSize: FontSize.sm,
            color: Colors.primary[700],
            flex: 1,
        },
        audioSection: {
            alignItems: 'center',
            marginBottom: Spacing.xl,
        },
        playButton: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: Colors.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadows.lg,
        },
        playButtonActive: {
            backgroundColor: Colors.primary[600],
        },
        audioOptions: {
            flexDirection: 'row',
            marginTop: Spacing.md,
            gap: Spacing.lg,
        },
        audioOptionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
        },
        audioOptionText: {
            fontSize: FontSize.sm,
            color: Colors.primary[500],
        },
        tapToPlay: {
            marginTop: Spacing.sm,
            fontSize: FontSize.sm,
            color: theme.text.tertiary,
        },
        inputSection: {
            marginBottom: Spacing.lg,
        },
        textInput: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            fontSize: FontSize.lg,
            color: theme.text.primary,
            borderWidth: 2,
            borderColor: theme.border.light,
            minHeight: 60,
        },
        hintsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: Spacing.sm,
            gap: Spacing.xs,
        },
        hintText: {
            fontSize: FontSize.sm,
            color: Colors.warning[600],
            fontStyle: 'italic',
        },
        inputActions: {
            flexDirection: 'row',
            marginTop: Spacing.md,
            gap: Spacing.md,
        },
        skipButton: {
            flex: 1,
            paddingVertical: Spacing.md,
            alignItems: 'center',
            borderRadius: BorderRadius.md,
            backgroundColor: theme.background.secondary,
        },
        skipButtonText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
        },
        checkButton: {
            flex: 2,
            flexDirection: 'row',
            paddingVertical: Spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: BorderRadius.md,
            backgroundColor: Colors.primary[500],
            gap: Spacing.xs,
        },
        checkButtonDisabled: {
            backgroundColor: Colors.neutral[400],
        },
        checkButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        resultSection: {
            gap: Spacing.md,
        },
        resultCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            borderWidth: 2,
        },
        resultCorrect: {
            borderColor: Colors.success[500],
        },
        resultWrong: {
            borderColor: Colors.warning[500],
        },
        resultHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing.md,
        },
        resultEmoji: {
            fontSize: 32,
        },
        resultTitle: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        yourAnswerSection: {
            marginBottom: Spacing.md,
        },
        yourAnswerLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.xs,
        },
        yourAnswerText: {
            fontSize: FontSize.md,
            color: Colors.error[500],
            textDecorationLine: 'line-through',
        },
        comparisonContainer: {
            marginBottom: Spacing.md,
        },
        comparisonLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.xs,
        },
        charContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        charText: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
        },
        charCorrect: {
            color: Colors.success[600],
        },
        charWrong: {
            color: Colors.error[500],
            backgroundColor: Colors.error[100],
        },
        translationText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            fontStyle: 'italic',
            marginTop: Spacing.xs,
        },
        correctSection: {
            alignItems: 'center',
            marginBottom: Spacing.md,
        },
        correctGerman: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            color: Colors.success[600],
            marginBottom: Spacing.xs,
        },
        correctEnglish: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
            fontStyle: 'italic',
        },
        accuracyBar: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
        },
        accuracyLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },
        accuracyBarBg: {
            flex: 1,
            height: 8,
            backgroundColor: theme.background.tertiary,
            borderRadius: BorderRadius.full,
            overflow: 'hidden',
        },
        accuracyBarFill: {
            height: '100%',
            backgroundColor: Colors.success[500],
        },
        accuracyValue: {
            fontSize: FontSize.sm,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            width: 40,
            textAlign: 'right',
        },
        nextButton: {
            flexDirection: 'row',
            paddingVertical: Spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: BorderRadius.md,
            backgroundColor: Colors.primary[500],
            gap: Spacing.xs,
        },
        nextButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        statsFooter: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.md,
            backgroundColor: theme.background.secondary,
            borderTopWidth: 1,
            borderTopColor: theme.border.light,
        },
        statItem: {
            alignItems: 'center',
        },
        statValue: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        statLabel: {
            fontSize: FontSize.xs,
            color: theme.text.secondary,
        },
        statDivider: {
            width: 1,
            backgroundColor: theme.border.light,
        },
    });

export default DictationScreen;
