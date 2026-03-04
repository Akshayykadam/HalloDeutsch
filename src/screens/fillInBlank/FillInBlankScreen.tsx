import React, { useState, useCallback } from 'react';
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
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '../../components/ui';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { FILL_IN_BLANK_TOPICS, FillInBlankTopic } from '../../data/content/fillInBlankTopics';
import { generateFillInBlankQuestions, FillInBlankQuestion } from '../../services/geminiService';
import { CEFRLevel } from '../../types';
import { Colors, FontWeight, Spacing, Shadows } from '../../theme';
import { useEntranceAnimation, useStaggeredList } from '../../hooks/useAnimations';

const { width } = Dimensions.get('window');

type ScreenMode = 'topics' | 'quiz' | 'results';

const categoryColors: Record<string, [string, string]> = {
    grammar: ['#6366F1', '#4F46E5'],
    vocabulary: ['#10B981', '#059669'],
    everyday: ['#F59E0B', '#D97706'],
    intermediate: ['#EF4444', '#DC2626'],
};

export const FillInBlankScreen: React.FC = () => {
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const s = getStyles(theme, isDark);

    // Entrance animation for topic selection
    const topicEntrance = useEntranceAnimation(80);

    const [mode, setMode] = useState<ScreenMode>('topics');
    const [customTopic, setCustomTopic] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [questions, setQuestions] = useState<FillInBlankQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userLevel] = useState<CEFRLevel>('A1');

    const loadQuestions = useCallback(async (topicName: string) => {
        setIsLoading(true);
        setSelectedTopic(topicName);
        try {
            const generated = await generateFillInBlankQuestions(topicName, userLevel, 10);
            if (generated.length > 0) {
                setQuestions(generated);
                setMode('quiz');
                setCurrentIndex(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                console.warn('No questions generated');
            }
        } catch (error) {
            console.error('Error loading questions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userLevel]);

    const handleTopicSelect = (topic: FillInBlankTopic) => loadQuestions(topic.name);
    const handleCustomTopicSubmit = () => { if (customTopic.trim()) loadQuestions(customTopic.trim()); };

    const handleAnswerSelect = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        setShowResult(true);
        if (answer === questions[currentIndex].correctAnswer) setScore(prev => prev + 1);
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

    const renderTopicCategory = (category: string, label: string) => {
        const topics = FILL_IN_BLANK_TOPICS.filter(t => t.category === category);
        if (topics.length === 0) return null;
        const colors = categoryColors[category] || (['#6366F1', '#4F46E5'] as [string, string]);
        return (
            <View key={category}>
                <Text style={s.sectionTitle}>{label}</Text>
                <View style={s.topicsGrid}>
                    {topics.map(topic => (
                        <TouchableOpacity key={topic.id} style={s.topicCard} onPress={() => handleTopicSelect(topic)} activeOpacity={0.8}>
                            <LinearGradient colors={colors} style={s.topicIconWrap}>
                                <Ionicons name={topic.icon as any} size={22} color="#fff" />
                            </LinearGradient>
                            <Text style={s.topicName} numberOfLines={2}>{topic.name}</Text>
                            <Text style={s.topicLevel}>{topic.level}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    /* ===== TOPICS ===== */
    const renderTopicSelection = () => (
        <Animated.View style={[{ flex: 1 }, topicEntrance]}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
                {/* Custom Topic */}
                <View style={s.customWrap}>
                    <Text style={s.sectionTitle}>Create Your Own</Text>
                    <View style={s.inputRow}>
                        <TextInput
                            style={s.input}
                            placeholder="e.g. Travel vocabulary"
                            placeholderTextColor={theme.text.tertiary}
                            value={customTopic}
                            onChangeText={setCustomTopic}
                            onSubmitEditing={handleCustomTopicSubmit}
                        />
                        <TouchableOpacity onPress={handleCustomTopicSubmit} disabled={!customTopic.trim()} activeOpacity={0.8}>
                            <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={s.goBtn}>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                {renderTopicCategory('grammar', 'Grammar')}
                {renderTopicCategory('vocabulary', 'Vocabulary')}
                {renderTopicCategory('everyday', 'Everyday German')}
                {renderTopicCategory('intermediate', 'Intermediate')}
                <View style={{ height: 32 }} />
            </ScrollView>
        </Animated.View>
    );

    /* ===== QUIZ ===== */
    const renderQuiz = () => {
        const q = questions[currentIndex];
        if (!q) return null;
        const pct = ((currentIndex + 1) / questions.length) * 100;
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
                {/* Progress */}
                <View style={s.progressRow}>
                    <View style={s.progressBg}>
                        <LinearGradient colors={[Colors.primary[400], Colors.primary[600]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.progressFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={s.progressLabel}>{currentIndex + 1}/{questions.length}</Text>
                </View>

                {/* Score pill */}
                <View style={s.scorePill}>
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text style={s.scorePillText}>{score}</Text>
                </View>

                {/* Question Card */}
                <View style={s.questionCard}>
                    <Text style={s.sentenceText}>{q.sentence}</Text>
                    {showResult && <Text style={s.tranText}>{q.translation}</Text>}
                </View>

                {/* Options */}
                <View style={s.optionsWrap}>
                    {q.options.map((opt, i) => {
                        const isCorrect = opt === q.correctAnswer;
                        const isSelected = opt === selectedAnswer;
                        const correctShown = showResult && isCorrect;
                        const wrongShown = showResult && isSelected && !isCorrect;
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    s.optionBtn,
                                    correctShown && s.optionCorrect,
                                    wrongShown && s.optionWrong,
                                    !showResult && isSelected && s.optionSel,
                                ]}
                                onPress={() => handleAnswerSelect(opt)}
                                disabled={showResult}
                                activeOpacity={0.8}
                            >
                                <Text style={[s.optionText, (correctShown || wrongShown) && { color: '#fff' }]}>{opt}</Text>
                                {correctShown && <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ position: 'absolute', right: 16 }} />}
                                {wrongShown && <Ionicons name="close-circle" size={20} color="#fff" style={{ position: 'absolute', right: 16 }} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Explanation */}
                {showResult && q.explanation && (
                    <View style={s.explRow}>
                        <Ionicons name="information-circle-outline" size={18} color={Colors.primary[400]} />
                        <Text style={s.explText}>{q.explanation}</Text>
                    </View>
                )}

                {/* Next */}
                {showResult && (
                    <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={{ marginTop: 16 }}>
                        <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={s.nextBtnGrad}>
                            <Text style={s.nextBtnText}>
                                {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                            </Text>
                            <Ionicons name="arrow-forward" size={18} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    };

    /* ===== RESULTS ===== */
    const renderResults = () => {
        const pct = Math.round((score / questions.length) * 100);
        let message = '';
        let iconName: 'trophy' | 'ribbon' | 'fitness' | 'library' = 'library';
        let gradColors: [string, string] = [Colors.primary[500], Colors.primary[600]];
        if (pct >= 90) { message = 'Excellent! Outstanding!'; iconName = 'trophy'; gradColors = ['#F59E0B', '#D97706']; }
        else if (pct >= 70) { message = 'Great job! Keep it up!'; iconName = 'ribbon'; gradColors = ['#10B981', '#059669']; }
        else if (pct >= 50) { message = 'Good effort!'; iconName = 'fitness'; }
        else { message = 'Keep practicing!'; iconName = 'library'; }

        return (
            <View style={s.resultsWrap}>
                <View style={s.resultCard}>
                    <LinearGradient colors={gradColors} style={s.resultIconCircle}>
                        <Ionicons name={iconName} size={32} color="#fff" />
                    </LinearGradient>
                    <Text style={s.resultTitle}>Quiz Complete!</Text>
                    <Text style={s.resultMsg}>{message}</Text>
                    <Text style={s.resultScore}>{score}<Text style={s.resultOf}> / {questions.length}</Text></Text>
                    <Text style={s.resultPct}>{pct}% correct</Text>
                </View>

                <View style={s.resultBtns}>
                    <TouchableOpacity style={s.retryBtn} onPress={() => loadQuestions(selectedTopic)}>
                        <Ionicons name="refresh" size={18} color={Colors.primary[500]} />
                        <Text style={s.retryBtnText}>Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRestart} activeOpacity={0.85} style={{ flex: 1 }}>
                        <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={s.newTopicBtn}>
                            <Ionicons name="apps-outline" size={18} color="#fff" />
                            <Text style={s.newTopicBtnText}>New Topic</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeArea style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => mode === 'topics' ? navigation.goBack() : handleRestart()} style={s.backBtn}>
                    <Ionicons name="chevron-back" size={22} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>{mode === 'topics' ? 'Fill in the Blank' : selectedTopic}</Text>
                <View style={{ width: 30 }} />
            </View>

            {/* Loading Overlay */}
            {isLoading && (
                <View style={s.loadingOverlay}>
                    <View style={s.loadingCard}>
                        <ActivityIndicator size="large" color={Colors.primary[500]} />
                        <Text style={s.loadingTitle}>Generating questions...</Text>
                        <Text style={s.loadingSub}>AI is creating your quiz</Text>
                    </View>
                </View>
            )}

            {mode === 'topics' && renderTopicSelection()}
            {mode === 'quiz' && renderQuiz()}
            {mode === 'results' && renderResults()}
        </SafeArea>
    );
};

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },

    /* Header */
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.md, paddingVertical: 12,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: FontWeight.bold, color: theme.text.primary },

    scrollPad: { paddingHorizontal: Spacing.md, paddingBottom: 20 },

    /* Custom topic */
    customWrap: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: FontWeight.bold, color: theme.text.primary, marginBottom: 10, marginTop: 6 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    input: {
        flex: 1, backgroundColor: theme.background.secondary, borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: theme.text.primary,
        borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
    },
    goBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

    /* Topics */
    topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
    topicCard: {
        width: (width - 50) / 2,
        backgroundColor: theme.background.secondary, borderRadius: 14, padding: 14, alignItems: 'center',
        borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
    },
    topicIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    topicName: { fontSize: 13, fontWeight: FontWeight.bold, color: theme.text.primary, textAlign: 'center', marginBottom: 3 },
    topicLevel: { fontSize: 11, color: theme.text.tertiary },

    /* Loading */
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', justifyContent: 'center', zIndex: 100,
    },
    loadingCard: {
        backgroundColor: theme.background.secondary, borderRadius: 20, padding: 32,
        alignItems: 'center', width: width * 0.78,
        borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
    },
    loadingTitle: { fontSize: 17, fontWeight: FontWeight.bold, color: theme.text.primary, marginTop: 16 },
    loadingSub: { fontSize: 13, color: theme.text.tertiary, marginTop: 4 },

    /* Quiz Progress */
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    progressBg: { flex: 1, height: 5, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[200], borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    progressLabel: { fontSize: 12, color: theme.text.tertiary, fontWeight: FontWeight.medium },

    scorePill: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 16,
    },
    scorePillText: { fontSize: 16, fontWeight: FontWeight.bold, color: '#F59E0B' },

    questionCard: {
        backgroundColor: theme.background.secondary, borderRadius: 18, padding: 22, marginBottom: 20,
        borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
        ...Shadows.sm,
    },
    sentenceText: { fontSize: 20, fontWeight: FontWeight.bold, color: theme.text.primary, textAlign: 'center', lineHeight: 30 },
    tranText: { fontSize: 14, color: theme.text.tertiary, textAlign: 'center', marginTop: 12, fontStyle: 'italic' },

    optionsWrap: { gap: 10 },
    optionBtn: {
        backgroundColor: theme.background.secondary, borderRadius: 14, padding: 16,
        borderWidth: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[200],
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    },
    optionSel: { borderColor: Colors.primary[500], backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : Colors.primary[50] },
    optionCorrect: { borderColor: '#10B981', backgroundColor: '#10B981' },
    optionWrong: { borderColor: '#EF4444', backgroundColor: '#EF4444' },
    optionText: { fontSize: 16, fontWeight: FontWeight.medium, color: theme.text.primary, textAlign: 'center' },

    explRow: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 8,
        backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : Colors.primary[50],
        borderRadius: 12, padding: 14, marginTop: 16,
        borderWidth: 1, borderColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[100],
    },
    explText: { flex: 1, fontSize: 13, color: theme.text.primary, lineHeight: 19 },

    nextBtnGrad: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingVertical: 15, borderRadius: 12,
    },
    nextBtnText: { fontSize: 16, fontWeight: FontWeight.bold, color: '#fff' },

    /* Results */
    resultsWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.md },
    resultCard: {
        backgroundColor: theme.background.secondary, borderRadius: 22, padding: 28,
        alignItems: 'center', marginBottom: 20,
        borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
    },
    resultIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    resultTitle: { fontSize: 24, fontWeight: FontWeight.bold, color: theme.text.primary, marginBottom: 4 },
    resultMsg: { fontSize: 14, color: theme.text.tertiary, marginBottom: 20 },
    resultScore: { fontSize: 44, fontWeight: FontWeight.bold, color: Colors.primary[500] },
    resultOf: { fontSize: 20, color: theme.text.tertiary },
    resultPct: { fontSize: 15, color: theme.text.tertiary, marginTop: 4 },

    resultBtns: { flexDirection: 'row', gap: 10 },
    retryBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        paddingVertical: 14, borderRadius: 12, backgroundColor: theme.background.secondary,
        borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
    },
    retryBtnText: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.primary[500] },
    newTopicBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        paddingVertical: 14, borderRadius: 12,
    },
    newTopicBtnText: { fontSize: 14, fontWeight: FontWeight.bold, color: '#fff' },
});

export default FillInBlankScreen;
