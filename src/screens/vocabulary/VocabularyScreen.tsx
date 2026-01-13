// Vocabulary Flashcard Screen with Spaced Repetition
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import * as audioService from '../../services/audioService';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Button, ProgressBar, Badge, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore, useSettingsStore } from '../../store';
import { VocabularyWord } from '../../types';
import { a1Vocabulary } from '../../data/content';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FlashcardProps {
    word: VocabularyWord;
    onNext: () => void;
    theme: any;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onNext, theme }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;
    const { settings } = useSettingsStore();

    // Reset flip when word changes
    useEffect(() => {
        setIsFlipped(false);
        flipAnim.setValue(0);
    }, [word]);

    const flipCard = () => {
        if (settings.hapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        Animated.spring(flipAnim, {
            toValue: isFlipped ? 0 : 1,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();

        setIsFlipped(!isFlipped);
    };

    const speakWord = async () => {
        await audioService.initializeTTS();
        await audioService.speak(word.german);
    };

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    const styles = getStyles(theme);

    return (
        <View style={styles.flashcardWrapper}>
            {/* Flashcard */}
            <TouchableOpacity activeOpacity={0.95} onPress={flipCard}>
                {/* Front of card - German word */}
                <Animated.View style={[styles.flashcard, styles.flashcardFront, frontAnimatedStyle]}>
                    <LinearGradient
                        colors={[Colors.primary[500], Colors.primary[700]]}
                        style={styles.flashcardGradient}
                    >
                        {word.gender && (
                            <Badge
                                label={word.gender}
                                variant="info"
                                size="large"
                                style={styles.genderBadge}
                            />
                        )}
                        <Text style={styles.germanWord}>{word.german}</Text>
                        <Text style={styles.pronunciation}>[{word.pronunciation}]</Text>

                        {/* Example on front */}
                        {word.exampleSentence && (
                            <View style={styles.exampleContainerFront}>
                                <Text style={styles.exampleTextFront}>„{word.exampleSentence}"</Text>
                            </View>
                        )}

                        <View style={styles.tapHintContainer}>
                            <Ionicons name="hand-right-outline" size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.tapHint}>Tap to reveal meaning</Text>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Back of card - English meaning */}
                <Animated.View style={[styles.flashcard, styles.flashcardBack, backAnimatedStyle]}>
                    <LinearGradient
                        colors={[Colors.success[500], Colors.success[700]]}
                        style={styles.flashcardGradient}
                    >
                        <Badge
                            label={word.partOfSpeech}
                            variant="default"
                            style={styles.posBadge}
                        />

                        <Text style={styles.englishWord}>{word.english}</Text>

                        <View style={styles.germanReminder}>
                            <Ionicons name="language" size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.germanReminderText}>{word.german}</Text>
                        </View>

                        {word.exampleSentence && (
                            <View style={styles.exampleContainer}>
                                <Text style={styles.exampleGerman}>„{word.exampleSentence}"</Text>
                                <Text style={styles.exampleEnglish}>{word.exampleTranslation}</Text>
                            </View>
                        )}

                        <View style={styles.tapHintContainer}>
                            <Ionicons name="hand-right-outline" size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.tapHint}>Tap to flip back</Text>
                        </View>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>

            {/* Sound button - outside the card */}
            <TouchableOpacity onPress={speakWord} style={styles.soundButton}>
                <Ionicons name="volume-high" size={28} color={Colors.primary[500]} />
                <Text style={styles.soundButtonText}>Listen to pronunciation</Text>
            </TouchableOpacity>

            {/* Single Next button */}
            <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <LinearGradient
                    colors={[Colors.primary[500], Colors.primary[600]]}
                    style={styles.nextButtonGradient}
                >
                    <Text style={styles.nextButtonText}>Next Word</Text>
                    <Ionicons name="arrow-forward" size={22} color={Colors.white} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export const VocabularyScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { progress } = useUserStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [sessionWords, setSessionWords] = useState<VocabularyWord[]>([]);

    const styles = getStyles(theme);

    // Initialize session with random words
    useEffect(() => {
        startNewSession();
    }, []);

    const startNewSession = () => {
        const allWords = a1Vocabulary.filter(w => w.level === progress.level || w.level === 'A1');
        const shuffled = [...allWords].sort(() => 0.5 - Math.random());
        setSessionWords(shuffled.slice(0, 10));
        setCurrentIndex(0);
        setSessionComplete(false);
    };

    const currentWord = sessionWords[currentIndex];
    const totalCards = sessionWords.length;
    const progressPercent = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

    const handleNext = () => {
        if (currentIndex + 1 >= totalCards) {
            setSessionComplete(true);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    if (sessionComplete) {
        return (
            <SafeArea style={styles.container}>
                <View style={styles.completionContainer}>
                    <Ionicons name="trophy" size={80} color={Colors.gold[500]} style={{ marginBottom: Spacing.lg }} />
                    <Text style={styles.completionTitle}>Session Complete!</Text>
                    <Text style={styles.completionSubtitle}>Great job practicing your vocabulary!</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Ionicons name="checkmark-circle" size={32} color={Colors.success[500]} />
                            <Text style={styles.statNumber}>{totalCards}</Text>
                            <Text style={styles.statLabel}>Words Practiced</Text>
                        </View>
                    </View>

                    <Button title="Practice More" onPress={startNewSession} size="large" fullWidth />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Back to Lessons</Text>
                    </TouchableOpacity>
                </View>
            </SafeArea>
        );
    }

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                        <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Vocabulary</Text>
                </View>
                <Badge label={`${currentIndex + 1}/${totalCards}`} variant="info" />
            </View>

            <ProgressBar progress={progressPercent} height={6} />

            <View style={styles.content}>
                <View style={styles.levelInfo}>
                    <Badge label={progress.level} variant="level" level={progress.level} />
                    <Text style={styles.domainText}>{currentWord?.domain}</Text>
                </View>

                {currentWord && (
                    <Flashcard
                        word={currentWord}
                        onNext={handleNext}
                        theme={theme}
                    />
                )}
            </View>
        </SafeArea>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: theme.background.primary,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    backIcon: {
        padding: 4,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    content: {
        flex: 1,
        padding: Spacing.base,
    },
    levelInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    domainText: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        textTransform: 'capitalize',
    },
    flashcardWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    flashcard: {
        width: SCREEN_WIDTH - 32,
        height: SCREEN_HEIGHT * 0.42,
        borderRadius: BorderRadius.xl,
        backfaceVisibility: 'hidden',
        ...Shadows.lg,
    },
    flashcardFront: {
        position: 'absolute',
    },
    flashcardBack: {
        backgroundColor: theme.background.primary,
    },
    flashcardGradient: {
        flex: 1,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    genderBadge: {
        position: 'absolute',
        top: Spacing.lg,
        right: Spacing.lg,
    },
    germanWord: {
        fontSize: 36,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    pronunciation: {
        fontSize: FontSize.lg,
        color: Colors.white,
        opacity: 0.8,
        marginBottom: Spacing.lg,
    },
    exampleContainerFront: {
        marginTop: Spacing.md,
        padding: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BorderRadius.lg,
        width: '100%',
    },
    exampleTextFront: {
        fontSize: FontSize.base,
        color: Colors.white,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    tapHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: Spacing.lg,
    },
    tapHint: {
        fontSize: FontSize.sm,
        color: Colors.white,
        opacity: 0.7,
    },
    englishWord: {
        fontSize: 36,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    posBadge: {
        position: 'absolute',
        top: Spacing.lg,
        left: Spacing.lg,
    },
    germanReminder: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BorderRadius.full,
    },
    germanReminderText: {
        fontSize: FontSize.md,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: FontWeight.medium,
    },
    exampleContainer: {
        marginTop: Spacing.sm,
        padding: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BorderRadius.lg,
        width: '100%',
    },
    exampleGerman: {
        fontSize: FontSize.base,
        color: Colors.white,
        fontStyle: 'italic',
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    exampleEnglish: {
        fontSize: FontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    soundButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.full,
        borderWidth: 2,
        borderColor: Colors.primary[500],
        ...Shadows.sm,
    },
    soundButtonText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.primary[500],
    },
    nextButton: {
        width: '100%',
        marginTop: Spacing.lg,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadows.md,
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    nextButtonText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    completionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    completionTitle: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginBottom: Spacing.xs,
    },
    completionSubtitle: {
        fontSize: FontSize.base,
        color: theme.text.secondary,
        marginBottom: Spacing.xl,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statBox: {
        backgroundColor: theme.background.primary,
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        minWidth: 150,
        ...Shadows.md,
    },
    statNumber: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary[500],
        marginTop: Spacing.sm,
    },
    statLabel: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: Spacing.xs,
    },
    backButton: {
        marginTop: Spacing.md,
        padding: Spacing.md,
    },
    backButtonText: {
        color: Colors.primary[500],
        fontWeight: FontWeight.medium,
        fontSize: FontSize.base,
    },
});
