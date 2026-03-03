// Article Drill Screen - Rapid-fire Der/Die/Das game
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import * as Haptics from 'expo-haptics';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { getLevelTitle } from '../../utils/levelUtils';
import { useUserStore } from '../../store';
import {
    ArticleNoun,
    getRandomNounsForGame,
    genderPatterns,
} from '../../data/content/article-drill-data';

type GameState = 'idle' | 'playing' | 'finished';

export const ArticleDrillScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const { progress } = useUserStore();
    const styles = getStyles(theme, isDark);

    // Game state
    const [gameState, setGameState] = useState<GameState>('idle');
    const [nouns, setNouns] = useState<ArticleNoun[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
    const [showPattern, setShowPattern] = useState(false);

    // Animations
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const streakAnim = useRef(new Animated.Value(1)).current;

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const currentNoun = nouns[currentIndex];

    // Timer effect
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endGame();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [gameState, timeLeft]);

    const startGame = () => {
        const gameNouns = getRandomNounsForGame(progress.level, 50);
        setNouns(gameNouns);
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setTimeLeft(30);
        setLastResult(null);
        setGameState('playing');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const endGame = () => {
        setGameState('finished');
        if (score > highScore) {
            setHighScore(score);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    };

    const handleAnswer = async (answer: 'der' | 'die' | 'das') => {
        if (gameState !== 'playing' || !currentNoun) return;

        const isCorrect = answer === currentNoun.article;

        if (isCorrect) {
            // Correct answer
            const streakBonus = Math.floor(streak / 5);
            const points = 10 + streakBonus * 5;
            setScore(prev => prev + points);
            setStreak(prev => prev + 1);
            setLastResult('correct');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            // Scale animation for correct
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();

            // Streak animation
            if (streak > 0 && streak % 5 === 4) {
                Animated.sequence([
                    Animated.timing(streakAnim, {
                        toValue: 1.3,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(streakAnim, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        } else {
            // Wrong answer
            setStreak(0);
            setLastResult('wrong');
            setShowPattern(true);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            // Shake animation for wrong
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();

            // Show pattern briefly for learning
            setTimeout(() => setShowPattern(false), 1500);
        }

        // Move to next noun after a brief delay
        setTimeout(() => {
            if (currentIndex < nouns.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setLastResult(null);
            } else {
                endGame();
            }
        }, isCorrect ? 200 : 1000);
    };

    const getTimerColor = () => {
        if (timeLeft <= 5) return Colors.error[500];
        if (timeLeft <= 10) return Colors.warning[500];
        return Colors.success[500];
    };

    const renderIdleState = () => (
        <View style={styles.idleContainer}>
            <View style={styles.iconContainer}>
                <Ionicons name="flash" size={72} color={Colors.warning[500]} />
            </View>
            <Text style={styles.title}>Article Drill</Text>
            <Text style={styles.subtitle}>Der • Die • Das</Text>
            <Text style={styles.description}>
                Master German articles with rapid-fire practice!{'\n'}
                You have 30 seconds to answer as many as you can.
            </Text>

            <View style={styles.statsCard}>
                <View style={styles.statRow}>
                    <Ionicons name="trophy" size={24} color={Colors.warning[500]} />
                    <Text style={styles.statLabel}>High Score:</Text>
                    <Text style={styles.statValue}>{highScore}</Text>
                </View>
                <View style={styles.statRow}>
                    <Ionicons name="school" size={24} color={Colors.primary[500]} />
                    <Text style={styles.statLabel}>Level:</Text>
                    <Text style={styles.statValue}>{getLevelTitle(progress.level)}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Ionicons name="play" size={24} color={Colors.white} />
                <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>

            {/* Pattern Hints */}
            <View style={styles.patternSection}>
                <Text style={styles.patternTitle}><Ionicons name="bulb" size={16} color={Colors.warning[500]} /> Quick Tips</Text>
                <View style={styles.patternList}>
                    {genderPatterns.slice(0, 4).map((pattern, index) => (
                        <View key={index} style={styles.patternItem}>
                            <Text style={[styles.patternArticle, { color: getArticleColor(pattern.article as 'der' | 'die' | 'das') }]}>
                                {pattern.article}
                            </Text>
                            <Text style={styles.patternEnding}>{pattern.pattern}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const getArticleColor = (article: 'der' | 'die' | 'das') => {
        switch (article) {
            case 'der': return Colors.primary[500];
            case 'die': return Colors.error[500];
            case 'das': return Colors.success[500];
        }
    };

    const renderPlayingState = () => (
        <View style={styles.playingContainer}>
            {/* Timer and Score */}
            <View style={styles.gameHeader}>
                <View style={styles.timerContainer}>
                    <Ionicons name="time" size={24} color={getTimerColor()} />
                    <Text style={[styles.timerText, { color: getTimerColor() }]}>{timeLeft}s</Text>
                </View>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Score</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                </View>
                <Animated.View style={[styles.streakContainer, { transform: [{ scale: streakAnim }] }]}>
                    <Ionicons name="flame" size={22} color={Colors.warning[500]} />
                    <Text style={styles.streakValue}>{streak}</Text>
                </Animated.View>
            </View>

            {/* Current Noun */}
            {currentNoun && (
                <Animated.View
                    style={[
                        styles.nounCard,
                        lastResult === 'correct' && styles.nounCardCorrect,
                        lastResult === 'wrong' && styles.nounCardWrong,
                        {
                            transform: [
                                { translateX: shakeAnim },
                                { scale: scaleAnim },
                            ],
                        },
                    ]}
                >
                    <Text style={styles.nounText}>{currentNoun.german}</Text>
                    <Text style={styles.nounTranslation}>{currentNoun.english}</Text>

                    {showPattern && currentNoun.pattern && (
                        <View style={styles.patternHint}>
                            <Text style={styles.patternHintText}>
                                Tip: {currentNoun.pattern}
                            </Text>
                        </View>
                    )}

                    {lastResult === 'wrong' && (
                        <Text style={styles.correctAnswer}>
                            Correct: {currentNoun.article}
                        </Text>
                    )}
                </Animated.View>
            )}

            {/* Article Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.articleButton, styles.derButton]}
                    onPress={() => handleAnswer('der')}
                    disabled={lastResult !== null}
                >
                    <Text style={styles.articleButtonText}>der</Text>
                    <Text style={styles.articleSubtext}>masculine</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.articleButton, styles.dieButton]}
                    onPress={() => handleAnswer('die')}
                    disabled={lastResult !== null}
                >
                    <Text style={styles.articleButtonText}>die</Text>
                    <Text style={styles.articleSubtext}>feminine</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.articleButton, styles.dasButton]}
                    onPress={() => handleAnswer('das')}
                    disabled={lastResult !== null}
                >
                    <Text style={styles.articleButtonText}>das</Text>
                    <Text style={styles.articleSubtext}>neuter</Text>
                </TouchableOpacity>
            </View>

            {/* Progress */}
            <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                    {currentIndex + 1} / {nouns.length}
                </Text>
            </View>
        </View>
    );

    const renderFinishedState = () => (
        <View style={styles.finishedContainer}>
            <View style={styles.resultsCard}>
                <Ionicons name={score > highScore * 0.8 ? 'trophy' : score > highScore * 0.5 ? 'star' : 'fitness'} size={56} color={Colors.warning[500]} style={{ marginBottom: Spacing.md }} />
                <Text style={styles.resultsTitle}>Game Over!</Text>

                <View style={styles.finalScoreContainer}>
                    <Text style={styles.finalScoreLabel}>Final Score</Text>
                    <Text style={styles.finalScoreValue}>{score}</Text>
                </View>

                {score >= highScore && score > 0 && (
                    <View style={styles.newHighScoreBadge}>
                        <Ionicons name="trophy" size={20} color={Colors.warning[500]} />
                        <Text style={styles.newHighScoreText}>New High Score!</Text>
                    </View>
                )}

                <View style={styles.statsGrid}>
                    <View style={styles.statGridItem}>
                        <Text style={styles.statGridValue}>{currentIndex + 1}</Text>
                        <Text style={styles.statGridLabel}>Questions</Text>
                    </View>
                    <View style={styles.statGridItem}>
                        <Text style={styles.statGridValue}>
                            {Math.round((score / Math.max((currentIndex + 1) * 10, 1)) * 100)}%
                        </Text>
                        <Text style={styles.statGridLabel}>Accuracy</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
                    <Ionicons name="refresh" size={24} color={Colors.white} />
                    <Text style={styles.playAgainButtonText}>Play Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.exitButtonText}>Exit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {gameState === 'playing' ? 'Quick! Choose the article!' : 'Article Drill'}
                </Text>
                <View style={styles.headerRight} />
            </View>

            {gameState === 'idle' && renderIdleState()}
            {gameState === 'playing' && renderPlayingState()}
            {gameState === 'finished' && renderFinishedState()}
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
            width: 40,
        },
        headerTitle: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            textAlign: 'center',
            flex: 1,
        },
        headerRight: {
            width: 40,
        },

        // Idle State
        idleContainer: {
            flex: 1,
            padding: Spacing.lg,
            alignItems: 'center',
        },
        iconContainer: {
            marginTop: Spacing.xl,
            marginBottom: Spacing.lg,
        },
        gameEmoji: {
            fontSize: 80,
        },
        title: {
            fontSize: FontSize['3xl'],
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.xs,
        },
        subtitle: {
            fontSize: FontSize.lg,
            color: Colors.primary[500],
            fontWeight: FontWeight.medium,
            marginBottom: Spacing.md,
        },
        description: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: Spacing.xl,
        },
        statsCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            width: '100%',
            marginBottom: Spacing.xl,
            ...Shadows.sm,
        },
        statRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.sm,
            gap: Spacing.sm,
        },
        statLabel: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
            flex: 1,
        },
        statValue: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        startButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing['2xl'],
            borderRadius: BorderRadius.lg,
            gap: Spacing.sm,
            ...Shadows.md,
        },
        startButtonText: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        patternSection: {
            marginTop: Spacing.xl,
            width: '100%',
        },
        patternTitle: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.md,
            textAlign: 'center',
        },
        patternList: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: Spacing.sm,
        },
        patternItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background.secondary,
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.sm,
            borderRadius: BorderRadius.md,
            gap: Spacing.xs,
        },
        patternArticle: {
            fontSize: FontSize.sm,
            fontWeight: FontWeight.bold,
        },
        patternEnding: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },

        // Playing State
        playingContainer: {
            flex: 1,
            padding: Spacing.md,
        },
        gameHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.lg,
        },
        timerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
        },
        timerText: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
        },
        scoreContainer: {
            alignItems: 'center',
        },
        scoreLabel: {
            fontSize: FontSize.xs,
            color: theme.text.secondary,
        },
        scoreValue: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        streakContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        streakEmoji: {
            fontSize: 24,
        },
        streakValue: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: Colors.warning[500],
        },
        nounCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.xl,
            padding: Spacing['2xl'],
            alignItems: 'center',
            marginBottom: Spacing.xl,
            borderWidth: 3,
            borderColor: 'transparent',
            ...Shadows.lg,
        },
        nounCardCorrect: {
            borderColor: Colors.success[500],
            backgroundColor: isDark ? Colors.success[900] : Colors.success[50],
        },
        nounCardWrong: {
            borderColor: Colors.error[500],
            backgroundColor: isDark ? Colors.error[900] : Colors.error[50],
        },
        nounText: {
            fontSize: 48,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.sm,
        },
        nounTranslation: {
            fontSize: FontSize.lg,
            color: theme.text.secondary,
        },
        patternHint: {
            marginTop: Spacing.md,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.xs,
            backgroundColor: Colors.primary[100],
            borderRadius: BorderRadius.md,
        },
        patternHintText: {
            fontSize: FontSize.sm,
            color: Colors.primary[700],
            fontWeight: FontWeight.medium,
        },
        correctAnswer: {
            marginTop: Spacing.md,
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: Colors.success[600],
        },
        buttonContainer: {
            flexDirection: 'row',
            gap: Spacing.md,
            marginBottom: Spacing.lg,
        },
        articleButton: {
            flex: 1,
            paddingVertical: Spacing.lg,
            borderRadius: BorderRadius.lg,
            alignItems: 'center',
            ...Shadows.md,
        },
        derButton: {
            backgroundColor: Colors.primary[500],
        },
        dieButton: {
            backgroundColor: Colors.error[500],
        },
        dasButton: {
            backgroundColor: Colors.success[500],
        },
        articleButtonText: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        articleSubtext: {
            fontSize: FontSize.xs,
            color: Colors.white,
            opacity: 0.8,
        },
        progressInfo: {
            alignItems: 'center',
        },
        progressText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },

        // Finished State
        finishedContainer: {
            flex: 1,
            padding: Spacing.lg,
            justifyContent: 'center',
        },
        resultsCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.xl,
            padding: Spacing.xl,
            alignItems: 'center',
            marginBottom: Spacing.xl,
            ...Shadows.lg,
        },
        resultsEmoji: {
            fontSize: 64,
            marginBottom: Spacing.md,
        },
        resultsTitle: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.lg,
        },
        finalScoreContainer: {
            alignItems: 'center',
            marginBottom: Spacing.md,
        },
        finalScoreLabel: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
        },
        finalScoreValue: {
            fontSize: 56,
            fontWeight: FontWeight.bold,
            color: Colors.primary[500],
        },
        newHighScoreBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.warning[100],
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadius.md,
            gap: Spacing.xs,
            marginBottom: Spacing.lg,
        },
        newHighScoreText: {
            fontSize: FontSize.md,
            color: Colors.warning[700],
            fontWeight: FontWeight.bold,
        },
        statsGrid: {
            flexDirection: 'row',
            gap: Spacing.xl,
        },
        statGridItem: {
            alignItems: 'center',
        },
        statGridValue: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        statGridLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },
        actionButtons: {
            gap: Spacing.md,
        },
        playAgainButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.lg,
            gap: Spacing.sm,
            ...Shadows.md,
        },
        playAgainButtonText: {
            fontSize: FontSize.lg,
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

export default ArticleDrillScreen;
