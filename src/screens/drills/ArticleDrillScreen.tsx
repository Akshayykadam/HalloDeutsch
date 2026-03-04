// Article Drill Screen - Rapid-fire Der/Die/Das game
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ScrollView,
} from 'react-native';
import ReAnimated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { getLevelTitle } from '../../utils/levelUtils';
import { useEntranceAnimation } from '../../hooks/useAnimations';
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
    const s = getStyles(theme, isDark);

    // Entrance animation for idle state
    const idleEntrance = useEntranceAnimation(80);

    const [gameState, setGameState] = useState<GameState>('idle');
    const [nouns, setNouns] = useState<ArticleNoun[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
    const [showPattern, setShowPattern] = useState(false);

    const shakeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const streakAnim = useRef(new Animated.Value(1)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const currentNoun = nouns[currentIndex];

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endGame();
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
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
            const streakBonus = Math.floor(streak / 5);
            setScore(prev => prev + 10 + streakBonus * 5);
            setStreak(prev => prev + 1);
            setLastResult('correct');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.08, duration: 100, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start();
            if (streak > 0 && streak % 5 === 4) {
                Animated.sequence([
                    Animated.timing(streakAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
                    Animated.timing(streakAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
                ]).start();
            }
        } else {
            setStreak(0);
            setLastResult('wrong');
            setShowPattern(true);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
            setTimeout(() => setShowPattern(false), 1500);
        }
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

    const getArticleColor = (article: 'der' | 'die' | 'das') => {
        switch (article) {
            case 'der': return Colors.primary[500];
            case 'die': return Colors.error[500];
            case 'das': return Colors.success[500];
        }
    };

    const articleGradients: Record<string, string[]> = {
        der: ['#6366F1', '#4F46E5'],
        die: ['#F43F5E', '#E11D48'],
        das: ['#10B981', '#059669'],
    };

    /* ============= IDLE STATE ============= */
    const renderIdleState = () => (
        <ReAnimated.View style={[{ flex: 1 }, idleEntrance]}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={s.idleContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <LinearGradient colors={isDark ? ['#312E81', '#1E1B4B'] : ['#EEF2FF', '#E0E7FF']} style={s.heroBanner}>
                    <Ionicons name="flash" size={48} color={Colors.primary[500]} />
                    <Text style={s.heroTitle}>Article Drill</Text>
                    <Text style={s.heroSub}>Der • Die • Das</Text>
                    <Text style={s.heroDesc}>
                        30 seconds. As many articles as you can. Go!
                    </Text>
                </LinearGradient>

                {/* Stats */}
                <View style={s.statsRow}>
                    <View style={s.statBox}>
                        <Ionicons name="trophy" size={20} color={Colors.warning[500]} />
                        <Text style={s.statBoxValue}>{highScore}</Text>
                        <Text style={s.statBoxLabel}>Best</Text>
                    </View>
                    <View style={s.statBox}>
                        <Ionicons name="school-outline" size={20} color={Colors.primary[500]} />
                        <Text style={s.statBoxValue}>{getLevelTitle(progress.level)}</Text>
                        <Text style={s.statBoxLabel}>Level</Text>
                    </View>
                    <View style={s.statBox}>
                        <Ionicons name="time-outline" size={20} color={Colors.success[500]} />
                        <Text style={s.statBoxValue}>30s</Text>
                        <Text style={s.statBoxLabel}>Timer</Text>
                    </View>
                </View>

                {/* Start Button */}
                <TouchableOpacity onPress={startGame} activeOpacity={0.85}>
                    <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={s.startBtn}>
                        <Ionicons name="play" size={22} color={Colors.white} />
                        <Text style={s.startBtnText}>Start Game</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Quick Tips */}
                <View style={s.tipsSection}>
                    <View style={s.tipsHeader}>
                        <Ionicons name="bulb-outline" size={16} color={Colors.warning[500]} />
                        <Text style={s.tipsTitle}>Quick Tips</Text>
                    </View>
                    <View style={s.tipsList}>
                        {genderPatterns.slice(0, 6).map((p, i) => (
                            <View key={i} style={s.tipChip}>
                                <Text style={[s.tipArticle, { color: getArticleColor(p.article as 'der' | 'die' | 'das') }]}>{p.article}</Text>
                                <Text style={s.tipPattern}>{p.pattern}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </ReAnimated.View>
    );

    /* ============= PLAYING STATE ============= */
    const renderPlayingState = () => (
        <View style={s.playWrap}>
            {/* Game HUD */}
            <View style={s.hud}>
                <View style={s.hudItem}>
                    <Ionicons name="time-outline" size={18} color={getTimerColor()} />
                    <Text style={[s.hudValue, { color: getTimerColor() }]}>{timeLeft}s</Text>
                </View>
                <View style={[s.hudItem, s.hudCenter]}>
                    <Text style={s.hudLabel}>Score</Text>
                    <Text style={s.hudScoreValue}>{score}</Text>
                </View>
                <Animated.View style={[s.hudItem, { transform: [{ scale: streakAnim }] }]}>
                    <Ionicons name="flame" size={18} color={Colors.warning[500]} />
                    <Text style={[s.hudValue, { color: Colors.warning[500] }]}>{streak}</Text>
                </Animated.View>
            </View>

            {/* Timer Bar */}
            <View style={s.timerBarBg}>
                <View style={[s.timerBarFill, { width: `${(timeLeft / 30) * 100}%`, backgroundColor: getTimerColor() }]} />
            </View>

            {/* Noun Card */}
            {currentNoun && (
                <Animated.View
                    style={[
                        s.nounCard,
                        lastResult === 'correct' && s.nounCorrect,
                        lastResult === 'wrong' && s.nounWrong,
                        { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] },
                    ]}
                >
                    <Text style={s.nounText}>{currentNoun.german}</Text>
                    <Text style={s.nounTrans}>{currentNoun.english}</Text>
                    {showPattern && currentNoun.pattern && (
                        <View style={s.patternHint}>
                            <Text style={s.patternHintText}>Tip: {currentNoun.pattern}</Text>
                        </View>
                    )}
                    {lastResult === 'wrong' && (
                        <Text style={s.correctAns}>Correct: {currentNoun.article}</Text>
                    )}
                </Animated.View>
            )}

            {/* Article Buttons */}
            <View style={s.btnRow}>
                {(['der', 'die', 'das'] as const).map(article => (
                    <TouchableOpacity key={article} onPress={() => handleAnswer(article)} disabled={lastResult !== null} activeOpacity={0.8}>
                        <LinearGradient colors={articleGradients[article] as any} style={s.articleBtn}>
                            <Text style={s.articleBtnText}>{article}</Text>
                            <Text style={s.articleBtnSub}>{article === 'der' ? 'masc' : article === 'die' ? 'fem' : 'neut'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={s.progressText}>{currentIndex + 1} / {nouns.length}</Text>
        </View>
    );

    /* ============= FINISHED STATE ============= */
    const renderFinishedState = () => {
        const accuracy = Math.round((score / Math.max((currentIndex + 1) * 10, 1)) * 100);
        const isNewHigh = score >= highScore && score > 0;
        return (
            <View style={s.finishWrap}>
                <View style={s.resultCard}>
                    <LinearGradient
                        colors={isNewHigh ? ['#F59E0B', '#D97706'] : [Colors.primary[500], Colors.primary[600]]}
                        style={s.resultIconCircle}
                    >
                        <Ionicons name={isNewHigh ? 'trophy' : score > 50 ? 'star' : 'fitness'} size={36} color={Colors.white} />
                    </LinearGradient>

                    {isNewHigh && (
                        <View style={s.newHighBadge}>
                            <Ionicons name="trophy" size={14} color={Colors.warning[600]} />
                            <Text style={s.newHighText}>New High Score!</Text>
                        </View>
                    )}

                    <Text style={s.resultTitle}>Game Over</Text>
                    <Text style={s.resultScoreValue}>{score}</Text>
                    <Text style={s.resultScoreLabel}>points</Text>

                    <View style={s.resultStatsRow}>
                        <View style={s.resultStatItem}>
                            <Text style={s.resultStatValue}>{currentIndex + 1}</Text>
                            <Text style={s.resultStatLabel}>Answered</Text>
                        </View>
                        <View style={[s.resultStatDivider]} />
                        <View style={s.resultStatItem}>
                            <Text style={s.resultStatValue}>{accuracy}%</Text>
                            <Text style={s.resultStatLabel}>Accuracy</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={startGame} activeOpacity={0.85}>
                    <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={s.playAgainBtn}>
                        <Ionicons name="refresh" size={20} color={Colors.white} />
                        <Text style={s.playAgainText}>Play Again</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={s.exitBtn} onPress={() => navigation.goBack()}>
                    <Text style={s.exitBtnText}>Exit</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                    <Ionicons name="chevron-back" size={22} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>
                    {gameState === 'playing' ? 'Choose the article!' : 'Article Drill'}
                </Text>
                <View style={{ width: 30 }} />
            </View>

            {gameState === 'idle' && renderIdleState()}
            {gameState === 'playing' && renderPlayingState()}
            {gameState === 'finished' && renderFinishedState()}
        </View>
    );
};

const getStyles = (theme: any, isDark: boolean) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background.primary },

        /* Header */
        header: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingHorizontal: Spacing.md, paddingTop: 52, paddingBottom: 12,
        },
        backBtn: { padding: 4 },
        headerTitle: { fontSize: 18, fontWeight: FontWeight.bold, color: theme.text.primary },

        /* ===== IDLE ===== */
        idleContent: { padding: Spacing.md, paddingBottom: 32 },
        heroBanner: {
            borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 20,
        },
        heroTitle: { fontSize: 28, fontWeight: FontWeight.bold, color: theme.text.primary, marginTop: 12 },
        heroSub: { fontSize: 16, color: Colors.primary[500], fontWeight: FontWeight.medium, marginTop: 4 },
        heroDesc: { fontSize: 14, color: theme.text.secondary, textAlign: 'center', marginTop: 10, lineHeight: 20 },

        statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
        statBox: {
            flex: 1, alignItems: 'center', gap: 4,
            backgroundColor: theme.background.secondary, borderRadius: 14, paddingVertical: 14,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
        },
        statBoxValue: { fontSize: 16, fontWeight: FontWeight.bold, color: theme.text.primary },
        statBoxLabel: { fontSize: 11, color: theme.text.tertiary },

        startBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            paddingVertical: 16, borderRadius: 14,
            ...Shadows.md,
        },
        startBtnText: { fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white },

        tipsSection: { marginTop: 24 },
        tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
        tipsTitle: { fontSize: 14, fontWeight: FontWeight.bold, color: theme.text.primary },
        tipsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
        tipChip: {
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.neutral[50],
            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
        },
        tipArticle: { fontSize: 13, fontWeight: FontWeight.bold },
        tipPattern: { fontSize: 12, color: theme.text.secondary },

        /* ===== PLAYING ===== */
        playWrap: { flex: 1, padding: Spacing.md },
        hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
        hudItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
        hudCenter: { flexDirection: 'column', alignItems: 'center', gap: 0 },
        hudLabel: { fontSize: 10, color: theme.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
        hudValue: { fontSize: 18, fontWeight: FontWeight.bold },
        hudScoreValue: { fontSize: 26, fontWeight: FontWeight.bold, color: theme.text.primary },

        timerBarBg: { height: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[200], borderRadius: 2, marginBottom: 20, overflow: 'hidden' },
        timerBarFill: { height: '100%', borderRadius: 2 },

        nounCard: {
            backgroundColor: theme.background.secondary, borderRadius: 20,
            paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center',
            marginBottom: 24, borderWidth: 2, borderColor: 'transparent',
            ...Shadows.md,
        },
        nounCorrect: { borderColor: Colors.success[500], backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : Colors.success[50] },
        nounWrong: { borderColor: Colors.error[500], backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : Colors.error[50] },
        nounText: { fontSize: 42, fontWeight: FontWeight.bold, color: theme.text.primary, marginBottom: 6 },
        nounTrans: { fontSize: 16, color: theme.text.secondary },
        patternHint: {
            marginTop: 12, paddingHorizontal: 14, paddingVertical: 6,
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50], borderRadius: 8,
        },
        patternHintText: { fontSize: 13, color: Colors.primary[500], fontWeight: FontWeight.medium },
        correctAns: { marginTop: 10, fontSize: 16, fontWeight: FontWeight.bold, color: Colors.success[500] },

        btnRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
        articleBtn: {
            width: 105, paddingVertical: 18, borderRadius: 14,
            alignItems: 'center', ...Shadows.sm,
        },
        articleBtnText: { fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white },
        articleBtnSub: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
        progressText: { fontSize: 12, color: theme.text.tertiary, textAlign: 'center' },

        /* ===== FINISHED ===== */
        finishWrap: { flex: 1, padding: Spacing.lg, justifyContent: 'center' },
        resultCard: {
            backgroundColor: theme.background.secondary, borderRadius: 24,
            padding: 28, alignItems: 'center', marginBottom: 20,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
        },
        resultIconCircle: {
            width: 72, height: 72, borderRadius: 36,
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        },
        newHighBadge: {
            flexDirection: 'row', alignItems: 'center', gap: 5,
            backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB',
            paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 12,
            borderWidth: 1, borderColor: isDark ? 'rgba(245,158,11,0.2)' : '#FEF3C7',
        },
        newHighText: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.warning[600] },
        resultTitle: { fontSize: 22, fontWeight: FontWeight.bold, color: theme.text.primary, marginBottom: 4 },
        resultScoreValue: { fontSize: 52, fontWeight: FontWeight.bold, color: Colors.primary[500] },
        resultScoreLabel: { fontSize: 14, color: theme.text.tertiary, marginBottom: 20 },

        resultStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
        resultStatItem: { alignItems: 'center' },
        resultStatValue: { fontSize: 20, fontWeight: FontWeight.bold, color: theme.text.primary },
        resultStatLabel: { fontSize: 11, color: theme.text.tertiary, marginTop: 2 },
        resultStatDivider: { width: 1, height: 28, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.neutral[200] },

        playAgainBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            paddingVertical: 16, borderRadius: 14, ...Shadows.md,
        },
        playAgainText: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white },
        exitBtn: { alignItems: 'center', paddingVertical: 14 },
        exitBtnText: { fontSize: 14, color: theme.text.secondary },
    });

export default ArticleDrillScreen;
