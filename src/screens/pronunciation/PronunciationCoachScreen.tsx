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
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as audioService from '../../services/audioService';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { getLevelTitle } from '../../utils/levelUtils';
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
    const s = getStyles(theme, isDark);

    const [sentences, setSentences] = useState<PronunciationSentence[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [score, setScore] = useState<ScoreType>(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        const levelSentences = getSentencesByLevel(progress.level);
        setSentences(levelSentences);
    }, [progress.level]);

    useEffect(() => {
        return () => { audioService.stopAudio(); };
    }, []);

    const currentSentence = sentences[currentIndex];

    const playAudio = async () => {
        if (isPlaying || !currentSentence) return;
        setIsPlaying(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await audioService.speak(currentSentence.german);
        setIsPlaying(false);
    };

    const playSlowly = async () => {
        if (isPlaying || !currentSentence) return;
        setIsPlaying(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await audioService.speak(currentSentence.german, { slow: true });
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
        setTimeout(() => { stopRecording(); }, 3000);
    };

    const stopRecording = async () => {
        setIsRecording(false);
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
        if (result !== 'tryAgain') setCompletedCount(prev => prev + 1);
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

    const scoreConfig: Record<string, { icon: any; label: string; sub: string; colors: string[] }> = {
        great: { icon: 'checkmark-circle', label: 'Great Job!', sub: 'Your pronunciation sounds excellent!', colors: [Colors.success[500], Colors.success[600]] },
        good: { icon: 'thumbs-up', label: 'Good!', sub: 'Keep practicing to perfect it!', colors: [Colors.primary[500], Colors.primary[600]] },
        tryAgain: { icon: 'refresh', label: 'Try Again', sub: 'Listen carefully and try once more.', colors: [Colors.warning[500], Colors.warning[600]] },
    };

    if (sentences.length === 0) {
        return (
            <View style={s.loading}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
            </View>
        );
    }

    const pct = ((currentIndex + 1) / sentences.length) * 100;

    return (
        <View style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                    <Ionicons name="chevron-back" size={22} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Pronunciation</Text>
                <View style={s.headerPill}>
                    <Ionicons name="school-outline" size={13} color={Colors.primary[500]} />
                    <Text style={s.headerPillText}>{getLevelTitle(progress.level)}</Text>
                </View>
            </View>

            {/* Progress */}
            <View style={s.progressWrap}>
                <View style={s.progressBg}>
                    <LinearGradient colors={[Colors.primary[400], Colors.primary[600]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.progressFill, { width: `${pct}%` }]} />
                </View>
                <Text style={s.progressLabel}>{currentIndex + 1}/{sentences.length}</Text>
            </View>

            <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Sentence Card */}
                <View style={s.sentenceCard}>
                    {/* Focus Sound pills */}
                    <View style={s.focusRow}>
                        <Ionicons name="ear-outline" size={14} color={Colors.primary[400]} />
                        {currentSentence.focusSounds.map((sound, i) => (
                            <View key={i} style={s.focusPill}>
                                <Text style={s.focusPillText}>{sound}</Text>
                            </View>
                        ))}
                    </View>

                    {/* German text */}
                    <Text style={s.germanText}>{currentSentence.german}</Text>

                    {/* Translation toggle */}
                    {showTranslation && (
                        <Text style={s.englishText}>{currentSentence.english}</Text>
                    )}
                    <TouchableOpacity style={s.translateBtn} onPress={() => setShowTranslation(!showTranslation)}>
                        <Ionicons name={showTranslation ? 'eye-off-outline' : 'language-outline'} size={16} color={Colors.primary[400]} />
                        <Text style={s.translateBtnText}>{showTranslation ? 'Hide' : 'Translate'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Audio Controls — compact row */}
                <View style={s.audioRow}>
                    <TouchableOpacity style={[s.audioSmallBtn, isPlaying && s.audioDisabled]} onPress={playSlowly} disabled={isPlaying}>
                        <Ionicons name="speedometer-outline" size={20} color={isPlaying ? Colors.neutral[500] : Colors.primary[400]} />
                        <Text style={[s.audioSmallLabel, isPlaying && { color: Colors.neutral[500] }]}>Slow</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.playBtn} onPress={isPlaying ? stopAudio : playAudio} activeOpacity={0.8}>
                        <LinearGradient colors={isPlaying ? [Colors.error[500], Colors.error[600]] : [Colors.primary[400], Colors.primary[600]]} style={s.playBtnGrad}>
                            <Ionicons name={isPlaying ? 'stop' : 'volume-high'} size={28} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={[s.audioSmallBtn, isPlaying && s.audioDisabled]} onPress={playAudio} disabled={isPlaying}>
                        <Ionicons name="repeat" size={20} color={isPlaying ? Colors.neutral[500] : Colors.primary[400]} />
                        <Text style={[s.audioSmallLabel, isPlaying && { color: Colors.neutral[500] }]}>Repeat</Text>
                    </TouchableOpacity>
                </View>

                {/* Record Section */}
                <View style={s.recordSection}>
                    <Text style={s.recordLabel}>Your Turn</Text>
                    <View style={s.recordRow}>
                        <TouchableOpacity
                            style={[s.micBtn, isRecording && s.micBtnActive]}
                            onPress={isRecording ? stopRecording : startRecording}
                            disabled={isPlaying}
                            activeOpacity={0.8}
                        >
                            {isRecording && <View style={s.micRing} />}
                            <LinearGradient
                                colors={isRecording ? [Colors.error[500], Colors.error[600]] : ['#EF4444', '#DC2626']}
                                style={s.micBtnGrad}
                            >
                                <Ionicons name={isRecording ? 'stop' : 'mic'} size={28} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={s.micHint}>{isRecording ? 'Listening…' : 'Tap to speak'}</Text>
                    </View>
                </View>

                {/* Score Feedback */}
                {score && scoreConfig[score] && (
                    <LinearGradient colors={scoreConfig[score].colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.scoreCard}>
                        <Ionicons name={scoreConfig[score].icon} size={28} color={Colors.white} />
                        <View style={{ flex: 1 }}>
                            <Text style={s.scoreTitle}>{scoreConfig[score].label}</Text>
                            <Text style={s.scoreSub}>{scoreConfig[score].sub}</Text>
                        </View>
                    </LinearGradient>
                )}

                {/* Tip */}
                <View style={s.tipRow}>
                    <Ionicons name="bulb-outline" size={15} color={Colors.warning[500]} />
                    <Text style={s.tipText}>Focus on: {currentSentence.focusSounds.join(', ')}</Text>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={s.bottomBar}>
                <View style={s.statsRow}>
                    <View style={s.statChip}>
                        <Ionicons name="checkmark-circle" size={15} color={Colors.success[500]} />
                        <Text style={s.statChipText}>{completedCount} done</Text>
                    </View>
                    <View style={s.statChip}>
                        <Ionicons name="flash" size={15} color={Colors.warning[500]} />
                        <Text style={s.statChipText}>
                            {currentSentence.difficulty.charAt(0).toUpperCase() + currentSentence.difficulty.slice(1)}
                        </Text>
                    </View>
                </View>
                <View style={s.navRow}>
                    <TouchableOpacity
                        style={[s.navBtn, currentIndex === 0 && s.navBtnDisabled]}
                        onPress={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <Ionicons name="chevron-back" size={20} color={currentIndex === 0 ? Colors.neutral[500] : theme.text.primary} />
                        <Text style={[s.navBtnText, currentIndex === 0 && { color: Colors.neutral[500] }]}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[s.navBtnNext, currentIndex === sentences.length - 1 && s.navBtnDisabled]}
                        onPress={handleNext}
                        disabled={currentIndex === sentences.length - 1}
                    >
                        <Text style={s.navBtnNextText}>Next</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const getStyles = (theme: any, isDark: boolean) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background.primary },
        loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background.primary },

        /* Header */
        header: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingHorizontal: Spacing.md, paddingTop: 52, paddingBottom: 12,
        },
        backBtn: { padding: 4 },
        headerTitle: { fontSize: 18, fontWeight: FontWeight.bold, color: theme.text.primary },
        headerPill: {
            flexDirection: 'row', alignItems: 'center', gap: 4,
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50],
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        },
        headerPillText: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.primary[500] },

        /* Progress */
        progressWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, gap: 10, marginBottom: 4 },
        progressBg: { flex: 1, height: 5, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[200], borderRadius: 4, overflow: 'hidden' },
        progressFill: { height: '100%', borderRadius: 4 },
        progressLabel: { fontSize: 11, color: theme.text.tertiary, fontWeight: FontWeight.medium, minWidth: 32 },

        /* ScrollView */
        scroll: { flex: 1 },
        scrollContent: { padding: Spacing.md, paddingBottom: 12 },

        /* Sentence Card */
        sentenceCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: 20, padding: 20, marginBottom: 16,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
        },
        focusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
        focusPill: {
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50],
            paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12,
        },
        focusPillText: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.primary[500] },
        germanText: {
            fontSize: 26, fontWeight: FontWeight.bold, color: theme.text.primary,
            textAlign: 'center', lineHeight: 36, marginBottom: 8,
        },
        englishText: {
            fontSize: 14, color: theme.text.secondary, textAlign: 'center',
            fontStyle: 'italic', marginBottom: 8,
        },
        translateBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
            paddingVertical: 6,
        },
        translateBtnText: { fontSize: 13, color: Colors.primary[400], fontWeight: FontWeight.medium },

        /* Audio Controls */
        audioRow: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 20, marginBottom: 16,
        },
        audioSmallBtn: { alignItems: 'center', gap: 3 },
        audioSmallLabel: { fontSize: 11, color: Colors.primary[400], fontWeight: FontWeight.medium },
        audioDisabled: { opacity: 0.4 },
        playBtn: {},
        playBtnGrad: {
            width: 62, height: 62, borderRadius: 31,
            alignItems: 'center', justifyContent: 'center',
            ...Shadows.md,
        },

        /* Record Section */
        recordSection: {
            backgroundColor: isDark ? 'rgba(239,68,68,0.08)' : '#FEF2F2',
            borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'center',
            borderWidth: 1, borderColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2',
        },
        recordLabel: { fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? Colors.error[400] : Colors.error[600], marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
        recordRow: { alignItems: 'center', gap: 8 },
        micBtn: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
        micBtnActive: {},
        micRing: {
            position: 'absolute', width: 76, height: 76, borderRadius: 38,
            borderWidth: 2, borderColor: Colors.error[300], opacity: 0.5,
        },
        micBtnGrad: {
            width: 64, height: 64, borderRadius: 32,
            alignItems: 'center', justifyContent: 'center',
            ...Shadows.md,
        },
        micHint: { fontSize: 12, color: theme.text.tertiary },

        /* Score Card */
        scoreCard: {
            flexDirection: 'row', alignItems: 'center', gap: 12,
            borderRadius: 14, padding: 14, marginBottom: 16,
        },
        scoreTitle: { fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white },
        scoreSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 1 },

        /* Tip */
        tipRow: {
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
            borderWidth: 1, borderColor: isDark ? 'rgba(245,158,11,0.15)' : '#FEF3C7',
        },
        tipText: { flex: 1, fontSize: 12, color: isDark ? Colors.warning[400] : Colors.warning[700], fontWeight: FontWeight.medium },

        /* Bottom Bar */
        bottomBar: {
            paddingHorizontal: Spacing.md, paddingBottom: 20, paddingTop: 10,
            borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
            backgroundColor: theme.background.primary,
        },
        statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 10 },
        statChip: {
            flexDirection: 'row', alignItems: 'center', gap: 5,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.neutral[50],
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
        },
        statChipText: { fontSize: 11, color: theme.text.secondary, fontWeight: FontWeight.medium },
        navRow: { flexDirection: 'row', gap: 10 },
        navBtn: {
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
            paddingVertical: 12, borderRadius: 12,
            backgroundColor: theme.background.secondary,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
        },
        navBtnDisabled: { opacity: 0.4 },
        navBtnText: { fontSize: 14, fontWeight: FontWeight.medium, color: theme.text.primary },
        navBtnNext: {
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
            paddingVertical: 12, borderRadius: 12,
            backgroundColor: Colors.primary[500],
        },
        navBtnNextText: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white },
    });

export default PronunciationCoachScreen;
