// Pronunciation Coach Screen - Practice speaking German with feedback
import React, { useState, useEffect } from 'react';
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
import * as audioService from '../../services/audioService';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import {
    pronunciationSentences,
    getSentencesByLevel,
    PronunciationSentence,
} from '../../data/content/pronunciation-sentences';

type ScoreType = 'great' | 'good' | 'tryAgain' | null;

export const PronunciationCoachScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const { progress } = useUserStore();
    const styles = getStyles(theme, isDark);

    const [sentences, setSentences] = useState<PronunciationSentence[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [score, setScore] = useState<ScoreType>(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        // Load sentences for user's level
        const levelSentences = getSentencesByLevel(progress.level);
        setSentences(levelSentences);
    }, [progress.level]);

    // Cleanup: Stop audio when navigating away
    useEffect(() => {
        return () => {
            audioService.stopAudio();
        };
    }, []);

    const currentSentence = sentences[currentIndex];

    const playAudio = async () => {
        if (isPlaying || !currentSentence) return;

        setIsPlaying(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const success = await audioService.speak(currentSentence.german);
        setIsPlaying(false);
    };

    const playSlowly = async () => {
        if (isPlaying || !currentSentence) return;

        setIsPlaying(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const success = await audioService.speak(currentSentence.german, { slow: true });
        setIsPlaying(false);
    };

    const stopAudio = () => {
        audioService.stopAudio();
        setIsPlaying(false);
    };

    const startRecording = async () => {
        setIsRecording(true);
        setScore(null);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Simulate recording for 3 seconds
        // In a real app, you would use expo-av to record audio
        // and then send it to a speech recognition API
        setTimeout(() => {
            stopRecording();
        }, 3000);
    };

    const stopRecording = async () => {
        setIsRecording(false);

        // Simulate pronunciation scoring
        // In a real implementation, this would analyze the audio
        const randomScore = Math.random();
        let result: ScoreType;

        if (randomScore > 0.7) {
            result = 'great';
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (randomScore > 0.3) {
            result = 'good';
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            result = 'tryAgain';
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        setScore(result);
        if (result !== 'tryAgain') {
            setCompletedCount(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < sentences.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setScore(null);
            setShowTranslation(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setScore(null);
            setShowTranslation(false);
        }
    };

    const getScoreDisplay = () => {
        switch (score) {
            case 'great':
                return {
                    text: '🎉 Great Job!',
                    color: Colors.success[500],
                    subtext: 'Your pronunciation sounds excellent!',
                };
            case 'good':
                return {
                    text: '👍 Good!',
                    color: Colors.primary[500],
                    subtext: 'Keep practicing to perfect it!',
                };
            case 'tryAgain':
                return {
                    text: '🔄 Try Again',
                    color: Colors.warning[500],
                    subtext: 'Listen carefully and try once more.',
                };
            default:
                return null;
        }
    };

    const scoreDisplay = getScoreDisplay();

    if (sentences.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pronunciation Coach</Text>
                <View style={styles.headerRight}>
                    <Text style={styles.levelBadge}>{progress.level}</Text>
                </View>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${((currentIndex + 1) / sentences.length) * 100}%` },
                        ]}
                    />
                </View>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>
                        {currentIndex + 1} / {sentences.length}
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Focus Sounds */}
                <View style={styles.focusContainer}>
                    <Text style={styles.focusLabel}>Focus Sounds:</Text>
                    <View style={styles.focusTags}>
                        {currentSentence.focusSounds.map((sound, index) => (
                            <View key={index} style={styles.focusTag}>
                                <Text style={styles.focusTagText}>{sound}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Sentence Card */}
                <View style={styles.sentenceCard}>
                    <View style={styles.sentenceAccent} />
                    <Text style={styles.germanText}>{currentSentence.german}</Text>

                    {showTranslation && (
                        <Text style={styles.englishText}>{currentSentence.english}</Text>
                    )}

                    <TouchableOpacity
                        style={styles.translationToggle}
                        onPress={() => setShowTranslation(!showTranslation)}
                    >
                        <Ionicons
                            name={showTranslation ? 'eye-off-outline' : 'language-outline'}
                            size={18}
                            color={Colors.primary[500]}
                        />
                        <Text style={styles.translationToggleText}>
                            {showTranslation ? 'Hide Translation' : 'Show Translation'}
                        </Text>
                    </TouchableOpacity>

                    {/* Pronunciation Tip */}
                    <View style={styles.pronunciationTip}>
                        <Ionicons name="bulb-outline" size={16} color={Colors.warning[600]} />
                        <Text style={styles.pronunciationTipText}>
                            Focus on the sounds: {currentSentence.focusSounds.join(', ')}
                        </Text>
                    </View>
                </View>

                {/* Audio Controls */}
                <View style={styles.audioControlsContainer}>
                    <Text style={styles.audioControlsLabel}>Listen & Learn</Text>
                    <View style={styles.audioControls}>
                        <TouchableOpacity
                            style={[styles.audioButton, styles.slowButton, isPlaying && styles.audioButtonDisabled]}
                            onPress={playSlowly}
                            disabled={isPlaying}
                        >
                            <View style={styles.audioButtonIcon}>
                                <Ionicons
                                    name="speedometer-outline"
                                    size={22}
                                    color={isPlaying ? Colors.neutral[400] : Colors.primary[600]}
                                />
                            </View>
                            <Text style={[styles.audioButtonText, isPlaying && styles.audioButtonTextDisabled]}>Slow</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.audioButton, styles.playButton, isPlaying && styles.playingButton]}
                            onPress={isPlaying ? stopAudio : playAudio}
                        >
                            <Ionicons
                                name={isPlaying ? 'stop' : 'volume-high'}
                                size={32}
                                color={Colors.white}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.audioButton, styles.repeatButton, isPlaying && styles.audioButtonDisabled]}
                            onPress={playAudio}
                            disabled={isPlaying}
                        >
                            <View style={styles.audioButtonIcon}>
                                <Ionicons
                                    name="repeat"
                                    size={22}
                                    color={isPlaying ? Colors.neutral[400] : Colors.primary[600]}
                                />
                            </View>
                            <Text style={[styles.audioButtonText, isPlaying && styles.audioButtonTextDisabled]}>Repeat</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recording Section */}
                <View style={styles.recordingSection}>
                    <Text style={styles.recordingSectionTitle}>Your Turn to Speak</Text>
                    <View style={styles.recordButtonContainer}>
                        {isRecording && <View style={styles.recordingRing} />}
                        <TouchableOpacity
                            style={[styles.recordButton, isRecording && styles.recordingActive]}
                            onPress={isRecording ? stopRecording : startRecording}
                            disabled={isPlaying}
                        >
                            <View style={[styles.recordInner, isRecording && styles.recordInnerActive]}>
                                <Ionicons
                                    name={isRecording ? 'stop' : 'mic'}
                                    size={36}
                                    color={Colors.white}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.recordText}>
                        {isRecording ? 'Recording... Tap to Stop' : 'Tap to Record'}
                    </Text>
                </View>

                {/* Score Display */}
                {scoreDisplay && (
                    <View style={[styles.scoreCard, { borderColor: scoreDisplay.color }]}>
                        <Text style={[styles.scoreText, { color: scoreDisplay.color }]}>
                            {scoreDisplay.text}
                        </Text>
                        <Text style={styles.scoreSubtext}>{scoreDisplay.subtext}</Text>
                    </View>
                )}

                {/* Navigation Buttons */}
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                        onPress={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={currentIndex === 0 ? Colors.neutral[400] : theme.text.primary}
                        />
                        <Text
                            style={[
                                styles.navButtonText,
                                currentIndex === 0 && styles.navButtonTextDisabled,
                            ]}
                        >
                            Previous
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            styles.nextButton,
                            currentIndex === sentences.length - 1 && styles.navButtonDisabled,
                        ]}
                        onPress={handleNext}
                        disabled={currentIndex === sentences.length - 1}
                    >
                        <Text
                            style={[
                                styles.navButtonText,
                                styles.nextButtonText,
                                currentIndex === sentences.length - 1 && styles.navButtonTextDisabled,
                            ]}
                        >
                            Next
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color={
                                currentIndex === sentences.length - 1
                                    ? Colors.neutral[400]
                                    : Colors.white
                            }
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Stats Bar */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.success[500]} />
                    </View>
                    <Text style={styles.statText}>{completedCount} Completed</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                        <Ionicons name="flash" size={18} color={Colors.warning[500]} />
                    </View>
                    <Text style={styles.statText}>
                        {currentSentence.difficulty.charAt(0).toUpperCase() +
                            currentSentence.difficulty.slice(1)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const getStyles = (theme: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.primary,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
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
        },
        progressContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            gap: Spacing.sm,
        },
        progressBar: {
            flex: 1,
            height: 6,
            backgroundColor: theme.background.tertiary,
            borderRadius: BorderRadius.full,
            overflow: 'hidden',
        },
        progressFill: {
            height: '100%',
            backgroundColor: Colors.primary[500],
            borderRadius: BorderRadius.full,
        },
        progressText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            fontWeight: FontWeight.medium,
        },
        progressTextContainer: {
            backgroundColor: Colors.primary[100],
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: BorderRadius.sm,
        },
        content: {
            flex: 1,
        },
        contentContainer: {
            padding: Spacing.md,
            paddingBottom: Spacing['2xl'],
        },
        focusContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.md,
            flexWrap: 'wrap',
        },
        focusLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginRight: Spacing.sm,
        },
        focusTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: Spacing.xs,
        },
        focusTag: {
            backgroundColor: Colors.primary[100],
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: BorderRadius.sm,
        },
        focusTagText: {
            fontSize: FontSize.sm,
            color: Colors.primary[700],
            fontWeight: FontWeight.medium,
        },
        sentenceCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
            overflow: 'hidden',
            position: 'relative',
            ...Shadows.md,
        },
        sentenceAccent: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: Colors.primary[500],
        },
        germanText: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            textAlign: 'center',
            lineHeight: 36,
            marginBottom: Spacing.md,
        },
        englishText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
            textAlign: 'center',
            fontStyle: 'italic',
            marginBottom: Spacing.md,
        },
        translationToggle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.xs,
        },
        translationToggleText: {
            fontSize: FontSize.sm,
            color: Colors.primary[500],
        },
        pronunciationTip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            marginTop: Spacing.md,
            paddingTop: Spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.border.light,
        },
        pronunciationTipText: {
            flex: 1,
            fontSize: FontSize.sm,
            color: Colors.warning[700],
            fontWeight: FontWeight.medium,
        },
        audioControls: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: Spacing.lg,
        },
        audioControlsContainer: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.xl,
        },
        audioControlsLabel: {
            fontSize: FontSize.sm,
            fontWeight: FontWeight.medium,
            color: theme.text.secondary,
            textAlign: 'center',
            marginBottom: Spacing.md,
        },
        audioButton: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        audioButtonDisabled: {
            opacity: 0.5,
        },
        audioButtonIcon: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: Colors.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
        },
        audioButtonTextDisabled: {
            color: Colors.neutral[400],
        },
        slowButton: {
            width: 60,
        },
        repeatButton: {
            width: 60,
        },
        audioButtonText: {
            fontSize: FontSize.xs,
            color: Colors.primary[600],
            marginTop: 4,
        },
        playButton: {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: Colors.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadows.md,
        },
        playingButton: {
            backgroundColor: Colors.error[500],
        },
        recordingSection: {
            backgroundColor: Colors.error[50],
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
            alignItems: 'center',
        },
        recordingSectionTitle: {
            fontSize: FontSize.sm,
            fontWeight: FontWeight.medium,
            color: Colors.error[700],
            marginBottom: Spacing.md,
        },
        recordButtonContainer: {
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
        },
        recordingRing: {
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: Colors.error[300],
            opacity: 0.6,
        },
        recordButton: {
            alignItems: 'center',
        },
        recordingActive: {
            transform: [{ scale: 1.05 }],
        },
        recordInner: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: Colors.error[500],
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadows.lg,
        },
        recordInnerActive: {
            backgroundColor: Colors.error[600],
            borderWidth: 4,
            borderColor: Colors.error[300],
        },
        recordText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginTop: Spacing.sm,
        },
        scoreCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
            borderWidth: 2,
            alignItems: 'center',
        },
        scoreText: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            marginBottom: Spacing.xs,
        },
        scoreSubtext: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
            textAlign: 'center',
        },
        navigation: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: Spacing.md,
        },
        navButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.md,
            backgroundColor: theme.background.secondary,
            gap: Spacing.xs,
        },
        navButtonDisabled: {
            opacity: 0.5,
        },
        navButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.medium,
            color: theme.text.primary,
        },
        navButtonTextDisabled: {
            color: Colors.neutral[400],
        },
        nextButton: {
            backgroundColor: Colors.primary[500],
        },
        nextButtonText: {
            color: Colors.white,
        },
        statsBar: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.md,
            backgroundColor: theme.background.secondary,
            borderTopWidth: 1,
            borderTopColor: theme.border.light,
        },
        statItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
        },
        statIconContainer: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: theme.background.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        statDivider: {
            width: 1,
            height: 24,
            backgroundColor: theme.border.light,
        },
        statText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },
    });

export default PronunciationCoachScreen;
