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
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as audioService from '../../services/audioService';
import { getLevelTitle } from '../../utils/levelUtils';

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
    const s = getStyles(theme, isDark);

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

    useEffect(() => { loadItems(); }, [difficulty, progress.level]);
    useEffect(() => { return () => { audioService.stopAudio(); }; }, []);

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
        await audioService.speak(currentItem.german, { slow });
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

    const renderCharComparison = () => {
        if (!result || !currentItem) return null;
        return (
            <View style={s.compWrap}>
                <Text style={s.compLabel}>Correct spelling:</Text>
                <View style={s.charRow}>
                    {result.differences.map((diff, i) => (
                        <Text key={i} style={[s.charText, diff.correct ? s.charOk : s.charBad]}>{diff.char}</Text>
                    ))}
                </View>
                <Text style={s.tranText}>{currentItem.english}</Text>
            </View>
        );
    };

    if (items.length === 0) {
        return (
            <View style={s.container}>
                <View style={s.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <Ionicons name="chevron-back" size={22} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={s.headerTitle}>Dictation</Text>
                    <View style={{ width: 30 }} />
                </View>
                <View style={s.emptyWrap}>
                    <Ionicons name="volume-mute-outline" size={48} color={theme.text.tertiary} />
                    <Text style={s.emptyText}>No items available for this level.</Text>
                </View>
            </View>
        );
    }

    const pct = ((currentIndex + 1) / Math.max(items.length, 1)) * 100;

    return (
        <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                    <Ionicons name="chevron-back" size={22} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Dictation</Text>
                <View style={s.headerPill}>
                    <Ionicons name="school-outline" size={13} color={Colors.primary[500]} />
                    <Text style={s.headerPillText}>{getLevelTitle(progress.level)}</Text>
                </View>
            </View>

            {/* Difficulty Tabs */}
            <View style={s.tabRow}>
                {(['word', 'phrase', 'sentence'] as Difficulty[]).map(lvl => (
                    <TouchableOpacity
                        key={lvl}
                        style={[s.tab, difficulty === lvl && s.tabActive]}
                        onPress={() => setDifficulty(lvl)}
                    >
                        <Text style={[s.tabText, difficulty === lvl && s.tabTextActive]}>
                            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}s
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Progress */}
            <View style={s.progressBg}>
                <LinearGradient colors={[Colors.primary[400], Colors.primary[600]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.progressFill, { width: `${pct}%` }]} />
            </View>

            <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Instruction */}
                <View style={s.instrRow}>
                    <Ionicons name="headset-outline" size={16} color={Colors.primary[400]} />
                    <Text style={s.instrText}>Listen carefully and type what you hear</Text>
                </View>

                {/* Audio Player */}
                <View style={s.audioCard}>
                    <TouchableOpacity
                        style={s.playBtn}
                        onPress={() => playAudio(false)}
                        disabled={isPlaying || showResult}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={isPlaying ? [Colors.primary[600], Colors.primary[700]] : [Colors.primary[400], Colors.primary[600]]}
                            style={s.playBtnGrad}
                        >
                            <Ionicons name={isPlaying ? 'pause' : 'volume-high'} size={32} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={s.audioOpts}>
                        <TouchableOpacity style={s.audioOptBtn} onPress={() => playAudio(true)} disabled={isPlaying || showResult}>
                            <Ionicons name="speedometer-outline" size={18} color={isPlaying ? Colors.neutral[500] : Colors.primary[400]} />
                            <Text style={[s.audioOptText, isPlaying && { color: Colors.neutral[500] }]}>Slow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.audioOptBtn} onPress={() => playAudio(false)} disabled={isPlaying || showResult}>
                            <Ionicons name="repeat" size={18} color={isPlaying ? Colors.neutral[500] : Colors.primary[400]} />
                            <Text style={[s.audioOptText, isPlaying && { color: Colors.neutral[500] }]}>Repeat</Text>
                        </TouchableOpacity>
                    </View>

                    {!hasPlayed && <Text style={s.tapHint}>Tap to play audio</Text>}
                </View>

                {/* Input or Result */}
                {!showResult ? (
                    <View style={s.inputSection}>
                        <TextInput
                            style={s.textInput}
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
                            <View style={s.hintRow}>
                                <Ionicons name="bulb-outline" size={14} color={Colors.warning[500]} />
                                <Text style={s.hintText}>{currentItem.hints[0]}</Text>
                            </View>
                        )}

                        <View style={s.actionRow}>
                            <TouchableOpacity style={s.skipBtn} onPress={handleSkip}>
                                <Text style={s.skipBtnText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.checkBtn, (!userInput.trim() || !hasPlayed) && s.checkBtnOff]}
                                onPress={handleCheck}
                                disabled={!userInput.trim() || !hasPlayed}
                                activeOpacity={0.85}
                            >
                                <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={s.checkBtnGrad}>
                                    <Text style={s.checkBtnText}>Check</Text>
                                    <Ionicons name="checkmark" size={18} color={Colors.white} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={s.resultSection}>
                        {/* Result Card */}
                        <View style={[s.resultCard, result?.isCorrect ? s.resultOk : s.resultBad]}>
                            <View style={s.resultHeader}>
                                <View style={[s.resultIconCircle, { backgroundColor: result?.isCorrect ? Colors.success[500] : Colors.warning[500] }]}>
                                    <Ionicons name={result?.isCorrect ? 'checkmark' : 'close'} size={20} color={Colors.white} />
                                </View>
                                <Text style={s.resultTitle}>
                                    {result?.isCorrect ? 'Perfect!' : 'Almost there!'}
                                </Text>
                            </View>

                            {!result?.isCorrect && (
                                <>
                                    <View style={s.yourAns}>
                                        <Text style={s.yourAnsLabel}>Your answer:</Text>
                                        <Text style={s.yourAnsText}>{userInput}</Text>
                                    </View>
                                    {renderCharComparison()}
                                </>
                            )}

                            {result?.isCorrect && (
                                <View style={s.correctSection}>
                                    <Text style={s.correctGerman}>{currentItem?.german}</Text>
                                    <Text style={s.correctEnglish}>{currentItem?.english}</Text>
                                </View>
                            )}

                            {/* Accuracy bar */}
                            <View style={s.accRow}>
                                <Text style={s.accLabel}>Accuracy</Text>
                                <View style={s.accBarBg}>
                                    <View style={[s.accBarFill, { width: `${result?.accuracy || 0}%` }]} />
                                </View>
                                <Text style={s.accValue}>{Math.round(result?.accuracy || 0)}%</Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
                            <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={s.nextBtn}>
                                <Text style={s.nextBtnText}>
                                    {currentIndex < items.length - 1 ? 'Next' : 'Finish'}
                                </Text>
                                <Ionicons name="chevron-forward" size={18} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Stats Footer */}
            <View style={s.footer}>
                <View style={s.footerItem}>
                    <Text style={s.footerValue}>{score}</Text>
                    <Text style={s.footerLabel}>Correct</Text>
                </View>
                <View style={s.footerDiv} />
                <View style={s.footerItem}>
                    <Text style={s.footerValue}>{completed}</Text>
                    <Text style={s.footerLabel}>Done</Text>
                </View>
                <View style={s.footerDiv} />
                <View style={s.footerItem}>
                    <Text style={s.footerValue}>{completed > 0 ? Math.round((score / completed) * 100) : 0}%</Text>
                    <Text style={s.footerLabel}>Accuracy</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
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
        headerPill: {
            flexDirection: 'row', alignItems: 'center', gap: 4,
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50],
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        },
        headerPillText: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.primary[500] },

        /* Tabs */
        tabRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: 8, marginBottom: 4 },
        tab: {
            flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.neutral[50],
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
        },
        tabActive: { backgroundColor: Colors.primary[500], borderColor: Colors.primary[500] },
        tabText: { fontSize: 13, fontWeight: FontWeight.medium, color: theme.text.secondary },
        tabTextActive: { color: Colors.white, fontWeight: FontWeight.bold },

        /* Progress */
        progressBg: { height: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[200], overflow: 'hidden', marginTop: 6 },
        progressFill: { height: '100%' },

        /* Scroll */
        scroll: { flex: 1 },
        scrollContent: { padding: Spacing.md, paddingBottom: 20 },

        /* Empty */
        emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
        emptyText: { fontSize: 14, color: theme.text.secondary, textAlign: 'center' },

        /* Instruction */
        instrRow: {
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : Colors.primary[50],
            paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginBottom: 16,
        },
        instrText: { fontSize: 13, color: isDark ? Colors.primary[300] : Colors.primary[700], flex: 1 },

        /* Audio Card */
        audioCard: { alignItems: 'center', marginBottom: 20 },
        playBtn: {},
        playBtnGrad: {
            width: 80, height: 80, borderRadius: 40,
            alignItems: 'center', justifyContent: 'center', ...Shadows.md,
        },
        audioOpts: { flexDirection: 'row', marginTop: 12, gap: 24 },
        audioOptBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
        audioOptText: { fontSize: 12, color: Colors.primary[400], fontWeight: FontWeight.medium },
        tapHint: { marginTop: 8, fontSize: 12, color: theme.text.tertiary },

        /* Input */
        inputSection: { marginBottom: 16 },
        textInput: {
            backgroundColor: theme.background.secondary, borderRadius: 14,
            padding: 16, fontSize: 17, color: theme.text.primary,
            borderWidth: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[200],
            minHeight: 56,
        },
        hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
        hintText: { fontSize: 12, color: Colors.warning[600], fontStyle: 'italic' },
        actionRow: { flexDirection: 'row', marginTop: 14, gap: 10 },
        skipBtn: {
            flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12,
            backgroundColor: theme.background.secondary,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
        },
        skipBtnText: { fontSize: 14, color: theme.text.secondary, fontWeight: FontWeight.medium },
        checkBtn: { flex: 2, borderRadius: 12, overflow: 'hidden' },
        checkBtnOff: { opacity: 0.4 },
        checkBtnGrad: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
            paddingVertical: 14,
        },
        checkBtnText: { fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white },

        /* Result */
        resultSection: { gap: 14 },
        resultCard: {
            backgroundColor: theme.background.secondary, borderRadius: 16,
            padding: 18, borderWidth: 1.5,
        },
        resultOk: { borderColor: Colors.success[500] },
        resultBad: { borderColor: Colors.warning[500] },
        resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
        resultIconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
        resultTitle: { fontSize: 18, fontWeight: FontWeight.bold, color: theme.text.primary },
        yourAns: { marginBottom: 12 },
        yourAnsLabel: { fontSize: 12, color: theme.text.tertiary, marginBottom: 3 },
        yourAnsText: { fontSize: 15, color: Colors.error[500], textDecorationLine: 'line-through' },

        compWrap: { marginBottom: 12 },
        compLabel: { fontSize: 12, color: theme.text.tertiary, marginBottom: 3 },
        charRow: { flexDirection: 'row', flexWrap: 'wrap' },
        charText: { fontSize: 17, fontWeight: FontWeight.bold },
        charOk: { color: Colors.success[600] },
        charBad: { color: Colors.error[500], backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : Colors.error[50] },
        tranText: { fontSize: 12, color: theme.text.secondary, fontStyle: 'italic', marginTop: 4 },

        correctSection: { alignItems: 'center', marginBottom: 12 },
        correctGerman: { fontSize: 20, fontWeight: FontWeight.bold, color: Colors.success[500], marginBottom: 3 },
        correctEnglish: { fontSize: 14, color: theme.text.secondary, fontStyle: 'italic' },

        accRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
        accLabel: { fontSize: 12, color: theme.text.tertiary },
        accBarBg: { flex: 1, height: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[200], borderRadius: 3, overflow: 'hidden' },
        accBarFill: { height: '100%', backgroundColor: Colors.success[500], borderRadius: 3 },
        accValue: { fontSize: 13, fontWeight: FontWeight.bold, color: theme.text.primary, width: 36, textAlign: 'right' },

        nextBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
            paddingVertical: 14, borderRadius: 12,
        },
        nextBtnText: { fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white },

        /* Footer */
        footer: {
            flexDirection: 'row', justifyContent: 'space-around',
            paddingVertical: 12, paddingHorizontal: Spacing.md,
            borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
            backgroundColor: theme.background.primary,
        },
        footerItem: { alignItems: 'center' },
        footerValue: { fontSize: 16, fontWeight: FontWeight.bold, color: theme.text.primary },
        footerLabel: { fontSize: 10, color: theme.text.tertiary, marginTop: 1 },
        footerDiv: { width: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[200] },
    });

export default DictationScreen;
