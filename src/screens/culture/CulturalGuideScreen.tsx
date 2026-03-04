// Cultural Guide Screen - Life in Germany tips and information
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import {
    culturalTips,
    cultureQuizQuestions,
    categories,
    getTipsByCategory,
    getRandomQuizQuestions,
    CulturalTip,
    CultureQuiz,
} from '../../data/content/cultural-guide-data';

type ScreenState = 'browse' | 'detail' | 'quiz' | 'quiz-result';

export const CulturalGuideScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const s = getStyles(theme, isDark);

    const [screenState, setScreenState] = useState<ScreenState>('browse');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTip, setSelectedTip] = useState<CulturalTip | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<CultureQuiz[]>([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const displayTips = selectedCategory
        ? getTipsByCategory(selectedCategory as CulturalTip['category'])
        : culturalTips;

    const handleSelectTip = (tip: CulturalTip) => {
        setSelectedTip(tip);
        setScreenState('detail');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleStartQuiz = () => {
        const questions = getRandomQuizQuestions(5);
        setQuizQuestions(questions);
        setQuizIndex(0);
        setQuizScore(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScreenState('quiz');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleQuizAnswer = (answer: string) => {
        if (showExplanation) return;
        setSelectedAnswer(answer);
        const isCorrect = answer === quizQuestions[quizIndex].correctAnswer;
        if (isCorrect) {
            setQuizScore(prev => prev + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        if (quizIndex < quizQuestions.length - 1) {
            setQuizIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setScreenState('quiz-result');
        }
    };

    const getImportanceGrad = (importance: CulturalTip['importance']): [string, string] => {
        switch (importance) {
            case 'essential': return ['#EF4444', '#DC2626'];
            case 'helpful': return ['#6366F1', '#4F46E5'];
            case 'interesting': return ['#10B981', '#059669'];
        }
    };

    const getImportanceIcon = (importance: CulturalTip['importance']) => {
        switch (importance) {
            case 'essential': return 'alert-circle';
            case 'helpful': return 'thumbs-up';
            case 'interesting': return 'sparkles';
        }
    };

    /* ─── Browse ─── */
    const renderBrowse = () => (
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
            {/* Quiz Hero Banner */}
            <TouchableOpacity activeOpacity={0.85} onPress={handleStartQuiz}>
                <LinearGradient colors={['#6366F1', '#4F46E5'] as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.quizBanner}>
                    <View style={s.quizBannerLeft}>
                        <View style={s.quizBannerIcon}>
                            <Ionicons name="school" size={22} color="#fff" />
                        </View>
                        <View>
                            <Text style={s.quizBannerTitle}>Test Your Knowledge!</Text>
                            <Text style={s.quizBannerSub}>5-question culture quiz</Text>
                        </View>
                    </View>
                    <View style={s.quizBannerArrow}>
                        <Ionicons name="chevron-forward" size={18} color="#fff" />
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {/* Category Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
                <TouchableOpacity
                    style={[s.chip, !selectedCategory && s.chipActive]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text style={[s.chipText, !selectedCategory && s.chipTextActive]}>All</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.key}
                        style={[s.chip, selectedCategory === cat.key && s.chipActive]}
                        onPress={() => setSelectedCategory(cat.key)}
                    >
                        <Ionicons name={cat.icon as any} size={14} color={selectedCategory === cat.key ? '#fff' : theme.text.tertiary} />
                        <Text style={[s.chipText, selectedCategory === cat.key && s.chipTextActive]}>{cat.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Section Header */}
            <View style={s.sectionRow}>
                <Text style={s.sectionTitle}>
                    {selectedCategory ? categories.find(c => c.key === selectedCategory)?.label : 'All Tips'}
                </Text>
                <View style={s.countPill}>
                    <Text style={s.countText}>{displayTips.length}</Text>
                </View>
            </View>

            {/* Tips List */}
            {displayTips.map((tip) => {
                const gradColors = getImportanceGrad(tip.importance);
                return (
                    <TouchableOpacity key={tip.id} style={s.tipCard} onPress={() => handleSelectTip(tip)} activeOpacity={0.8}>
                        <LinearGradient colors={gradColors} style={s.tipIconWrap}>
                            <Ionicons name={tip.icon as any} size={22} color="#fff" />
                        </LinearGradient>
                        <View style={s.tipContent}>
                            <Text style={s.tipTitle}>{tip.title}</Text>
                            <Text style={s.tipTitleDe}>{tip.titleDe}</Text>
                            <View style={[s.importancePill, { backgroundColor: gradColors[0] + '18' }]}>
                                <Text style={[s.importanceText, { color: gradColors[0] }]}>{tip.importance}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.text.tertiary} />
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    /* ─── Detail ─── */
    const renderDetail = () => {
        if (!selectedTip) return null;
        const gradColors = getImportanceGrad(selectedTip.importance);

        return (
            <ScrollView style={s.scroll} contentContainerStyle={s.detailPad} showsVerticalScrollIndicator={false}>
                {/* Hero Header */}
                <View style={s.detailHero}>
                    <LinearGradient colors={gradColors} style={s.detailIconCircle}>
                        <Ionicons name={selectedTip.icon as any} size={32} color="#fff" />
                    </LinearGradient>
                    <Text style={s.detailTitle}>{selectedTip.title}</Text>
                    <Text style={s.detailTitleDe}>{selectedTip.titleDe}</Text>
                    <View style={[s.detailBadge, { backgroundColor: gradColors[0] }]}>
                        <Ionicons name={getImportanceIcon(selectedTip.importance) as any} size={12} color="#fff" />
                        <Text style={s.detailBadgeText}>{selectedTip.importance}</Text>
                    </View>
                </View>

                {/* Content Card */}
                <View style={s.detailCard}>
                    <View style={s.detailCardHeader}>
                        <View style={s.detailCardIconWrap}>
                            <Ionicons name="information-circle" size={16} color={Colors.primary[400]} />
                        </View>
                        <Text style={s.detailCardLabel}>What You Should Know</Text>
                    </View>
                    <Text style={s.detailCardContent}>{selectedTip.content}</Text>
                </View>

                {/* Phrase Card */}
                {selectedTip.germanPhrase && (
                    <View style={s.phraseCard}>
                        <LinearGradient colors={gradColors} style={s.phraseAccent} />
                        <View style={s.phraseBody}>
                            <View style={s.phraseHeader}>
                                <View style={s.phraseFlagWrap}>
                                    <Ionicons name="flag" size={14} color={Colors.primary[400]} />
                                </View>
                                <Text style={s.phraseLabel}>Useful Phrase</Text>
                            </View>
                            <Text style={s.phraseGerman}>{selectedTip.germanPhrase}</Text>
                            <View style={s.phraseDivider} />
                            <Text style={s.phraseEnglish}>{selectedTip.germanPhraseTranslation}</Text>
                        </View>
                    </View>
                )}

                {/* Did You Know */}
                {selectedTip.didYouKnow && (
                    <View style={s.dykCard}>
                        <View style={s.dykHeader}>
                            <View style={s.dykIconWrap}>
                                <Ionicons name="bulb" size={16} color="#F59E0B" />
                            </View>
                            <Text style={s.dykLabel}>Did You Know?</Text>
                        </View>
                        <Text style={s.dykText}>{selectedTip.didYouKnow}</Text>
                    </View>
                )}

                {/* Back button */}
                <TouchableOpacity style={s.backToListBtn} onPress={() => setScreenState('browse')} activeOpacity={0.8}>
                    <Ionicons name="arrow-back" size={16} color={Colors.primary[400]} />
                    <Text style={s.backToListText}>Back to all tips</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    };

    /* ─── Quiz ─── */
    const renderQuiz = () => {
        const currentQuestion = quizQuestions[quizIndex];
        if (!currentQuestion) return null;

        return (
            <ScrollView style={s.scroll} contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
                {/* Progress */}
                <View style={s.quizProgressRow}>
                    <Text style={s.quizProgressLabel}>Question {quizIndex + 1}/{quizQuestions.length}</Text>
                    <View style={s.quizScorePill}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={s.quizScoreText}>{quizScore}</Text>
                    </View>
                </View>
                <View style={s.quizProgressTrack}>
                    <LinearGradient
                        colors={['#6366F1', '#818CF8'] as [string, string]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[s.quizProgressFill, { width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }]}
                    />
                </View>

                {/* Question */}
                <View style={s.quizQuestionCard}>
                    <Text style={s.quizQuestionText}>{currentQuestion.question}</Text>
                </View>

                {/* Options */}
                <View style={s.quizOptions}>
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const showCorrect = showExplanation && isCorrect;
                        const showWrong = showExplanation && isSelected && !isCorrect;

                        let borderStyle = {};
                        if (showCorrect) {
                            borderStyle = { borderColor: '#10B981', backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ECFDF5' };
                        } else if (showWrong) {
                            borderStyle = { borderColor: '#EF4444', backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2' };
                        }

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[s.quizOption, borderStyle]}
                                onPress={() => handleQuizAnswer(option)}
                                disabled={showExplanation}
                                activeOpacity={0.8}
                            >
                                <View style={s.quizOptionIndex}>
                                    <Text style={s.quizOptionIndexText}>{String.fromCharCode(65 + index)}</Text>
                                </View>
                                <Text style={s.quizOptionText}>{option}</Text>
                                {showCorrect && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
                                {showWrong && <Ionicons name="close-circle" size={20} color="#EF4444" />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Explanation */}
                {showExplanation && (
                    <View style={s.explanationCard}>
                        <Ionicons name="bulb" size={16} color="#F59E0B" />
                        <Text style={s.explanationText}>{currentQuestion.explanation}</Text>
                    </View>
                )}

                {/* Next */}
                {showExplanation && (
                    <TouchableOpacity activeOpacity={0.85} onPress={handleNextQuestion}>
                        <LinearGradient colors={['#6366F1', '#4F46E5'] as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.nextBtn}>
                            <Text style={s.nextBtnText}>
                                {quizIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    };

    /* ─── Quiz Result ─── */
    const renderQuizResult = () => {
        const percentage = Math.round((quizScore / quizQuestions.length) * 100);
        let iconName: 'trophy' | 'thumbs-up' | 'book' = 'book';
        let gradColors: [string, string] = ['#6366F1', '#4F46E5'];
        let message = "Keep exploring! There's more to discover.";

        if (percentage >= 80) {
            iconName = 'trophy'; gradColors = ['#F59E0B', '#D97706'];
            message = 'Excellent! You know German culture well!';
        } else if (percentage >= 60) {
            iconName = 'thumbs-up'; gradColors = ['#10B981', '#059669'];
            message = 'Good job! Keep learning!';
        }

        return (
            <View style={s.resultContainer}>
                <View style={s.resultCard}>
                    <LinearGradient colors={gradColors} style={s.resultIconCircle}>
                        <Ionicons name={iconName} size={36} color="#fff" />
                    </LinearGradient>
                    <Text style={s.resultTitle}>Quiz Complete!</Text>

                    <View style={s.resultScoreCircle}>
                        <Text style={s.resultPct}>{percentage}%</Text>
                        <Text style={s.resultScoreLabel}>Score</Text>
                    </View>

                    <Text style={s.resultDetail}>{quizScore} / {quizQuestions.length} correct</Text>
                    <Text style={s.resultMessage}>{message}</Text>
                </View>

                <TouchableOpacity activeOpacity={0.85} onPress={handleStartQuiz}>
                    <LinearGradient colors={['#6366F1', '#4F46E5'] as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.retryBtn}>
                        <Ionicons name="refresh" size={18} color="#fff" />
                        <Text style={s.retryBtnText}>Try Again</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={s.browseBtn} onPress={() => setScreenState('browse')}>
                    <Text style={s.browseBtnText}>Back to Tips</Text>
                </TouchableOpacity>
            </View>
        );
    };

    /* ─── Main ─── */
    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (screenState === 'browse') { navigation.goBack(); }
                        else { setScreenState('browse'); }
                    }}
                    style={s.backButton}
                >
                    <Ionicons name="chevron-back" size={22} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Cultural Guide</Text>
                <View style={s.headerPill}>
                    <Ionicons name="globe" size={13} color={Colors.primary[400]} />
                    <Text style={s.headerPillText}>{culturalTips.length}</Text>
                </View>
            </View>

            {screenState === 'browse' && renderBrowse()}
            {screenState === 'detail' && renderDetail()}
            {screenState === 'quiz' && renderQuiz()}
            {screenState === 'quiz-result' && renderQuizResult()}
        </View>
    );
};

const getStyles = (theme: any, isDark: boolean) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background.primary },
        /* Header */
        header: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
        },
        backButton: { padding: 4 },
        headerTitle: { fontSize: 18, fontWeight: FontWeight.bold, color: theme.text.primary },
        headerPill: {
            flexDirection: 'row', alignItems: 'center', gap: 4,
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50],
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        },
        headerPillText: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.primary[500] },

        /* Scroll */
        scroll: { flex: 1 },
        scrollPad: { padding: 16, paddingBottom: 40 },
        detailPad: { padding: 16, paddingBottom: 40 },

        /* Quiz Banner */
        quizBanner: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            borderRadius: 16, padding: 16, marginBottom: 18,
        },
        quizBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        quizBannerIcon: {
            width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center',
        },
        quizBannerTitle: { fontSize: 15, fontWeight: FontWeight.bold, color: '#fff' },
        quizBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
        quizBannerArrow: {
            width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center',
        },

        /* Category Chips */
        chipRow: { paddingBottom: 14, gap: 8 },
        chip: {
            flexDirection: 'row', alignItems: 'center', gap: 5,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
            paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
        },
        chipActive: { backgroundColor: Colors.primary[500] },
        chipText: { fontSize: 13, color: theme.text.secondary, fontWeight: FontWeight.medium },
        chipTextActive: { color: '#fff' },

        /* Section */
        sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
        sectionTitle: { fontSize: 17, fontWeight: FontWeight.bold, color: theme.text.primary },
        countPill: {
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50],
            paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12,
        },
        countText: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.primary[500] },

        /* Tip Cards */
        tipCard: {
            flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderRadius: 14,
            padding: 14, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
        },
        tipIconWrap: {
            width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12,
        },
        tipContent: { flex: 1 },
        tipTitle: { fontSize: 14, fontWeight: FontWeight.bold, color: theme.text.primary },
        tipTitleDe: { fontSize: 12, color: theme.text.secondary, marginBottom: 4 },
        importancePill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
        importanceText: { fontSize: 11, fontWeight: FontWeight.bold, textTransform: 'capitalize' as const },

        /* ─── Detail ─── */
        detailHero: { alignItems: 'center', paddingVertical: 24, marginBottom: 8 },
        detailIconCircle: {
            width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        },
        detailTitle: { fontSize: 22, fontWeight: FontWeight.bold, color: theme.text.primary, textAlign: 'center', marginBottom: 4 },
        detailTitleDe: { fontSize: 14, color: theme.text.secondary, textAlign: 'center', marginBottom: 12 },
        detailBadge: {
            flexDirection: 'row', alignItems: 'center', gap: 4,
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
        },
        detailBadgeText: { fontSize: 11, fontWeight: FontWeight.bold, color: '#fff', textTransform: 'capitalize' as const },
        detailCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
            borderRadius: 16, padding: 18, marginBottom: 12,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
        },
        detailCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
        detailCardIconWrap: {
            width: 28, height: 28, borderRadius: 8,
            backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : Colors.primary[50],
            alignItems: 'center', justifyContent: 'center',
        },
        detailCardLabel: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.primary[isDark ? 300 : 600] },
        detailCardContent: { fontSize: 14, color: theme.text.primary, lineHeight: 22 },

        /* Phrase Card */
        phraseCard: {
            flexDirection: 'row', borderRadius: 16, overflow: 'hidden', marginBottom: 12,
            backgroundColor: isDark ? 'rgba(99,102,241,0.06)' : '#EEF2FF',
        },
        phraseAccent: { width: 4 },
        phraseBody: { flex: 1, padding: 18 },
        phraseHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
        phraseFlagWrap: {
            width: 26, height: 26, borderRadius: 8,
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[100],
            alignItems: 'center', justifyContent: 'center',
        },
        phraseLabel: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.primary[isDark ? 300 : 600] },
        phraseGerman: { fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? '#C7D2FE' : Colors.primary[700], marginBottom: 8 },
        phraseDivider: { height: 1, backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[200], marginBottom: 8 },
        phraseEnglish: { fontSize: 14, color: isDark ? '#A5B4FC' : Colors.primary[600], fontStyle: 'italic' },

        /* Did You Know */
        dykCard: {
            backgroundColor: isDark ? 'rgba(245,158,11,0.06)' : '#FFFBEB',
            borderRadius: 16, padding: 18, marginBottom: 16,
            borderWidth: 1, borderColor: isDark ? 'rgba(245,158,11,0.15)' : '#FEF3C7',
        },
        dykHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
        dykIconWrap: {
            width: 28, height: 28, borderRadius: 8,
            backgroundColor: isDark ? 'rgba(245,158,11,0.12)' : '#FEF3C7',
            alignItems: 'center', justifyContent: 'center',
        },
        dykLabel: { fontSize: 13, fontWeight: FontWeight.bold, color: isDark ? '#FBBF24' : '#B45309' },
        dykText: { fontSize: 14, color: isDark ? '#FCD34D' : '#92400E', lineHeight: 21 },

        /* Back to list */
        backToListBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            paddingVertical: 14, borderRadius: 14,
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F3F4F6',
        },
        backToListText: { fontSize: 14, fontWeight: FontWeight.medium, color: Colors.primary[isDark ? 300 : 500] },

        /* ─── Quiz ─── */
        quizProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
        quizProgressLabel: { fontSize: 13, color: theme.text.secondary },
        quizScorePill: {
            flexDirection: 'row', alignItems: 'center', gap: 4,
            backgroundColor: isDark ? 'rgba(245,158,11,0.12)' : '#FFFBEB',
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
        },
        quizScoreText: { fontSize: 13, fontWeight: FontWeight.bold, color: '#D97706' },
        quizProgressTrack: {
            height: 6, borderRadius: 3, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
            overflow: 'hidden', marginBottom: 20,
        },
        quizProgressFill: { height: '100%', borderRadius: 3 },
        quizQuestionCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
            borderRadius: 18, padding: 24, marginBottom: 20,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
        },
        quizQuestionText: { fontSize: 16, fontWeight: FontWeight.medium, color: theme.text.primary, lineHeight: 24 },
        quizOptions: { gap: 10, marginBottom: 16 },
        quizOption: {
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
            borderRadius: 14, padding: 14, borderWidth: 1.5,
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB',
        },
        quizOptionIndex: {
            width: 28, height: 28, borderRadius: 8,
            backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : Colors.primary[50],
            alignItems: 'center', justifyContent: 'center', marginRight: 12,
        },
        quizOptionIndexText: { fontSize: 13, fontWeight: FontWeight.bold, color: Colors.primary[500] },
        quizOptionText: { flex: 1, fontSize: 14, color: theme.text.primary, lineHeight: 20 },
        explanationCard: {
            flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, marginBottom: 16,
            backgroundColor: isDark ? 'rgba(245,158,11,0.06)' : '#FFFBEB',
            borderWidth: 1, borderColor: isDark ? 'rgba(245,158,11,0.12)' : '#FEF3C7',
        },
        explanationText: { flex: 1, fontSize: 13, color: isDark ? '#FCD34D' : '#92400E', lineHeight: 20 },
        nextBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            paddingVertical: 14, borderRadius: 14, gap: 6,
        },
        nextBtnText: { fontSize: 15, fontWeight: FontWeight.bold, color: '#fff' },

        /* ─── Result ─── */
        resultContainer: { flex: 1, padding: 16, justifyContent: 'center' },
        resultCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
            borderRadius: 22, padding: 28, alignItems: 'center', marginBottom: 20,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
        },
        resultIconCircle: {
            width: 72, height: 72, borderRadius: 22,
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        },
        resultTitle: { fontSize: 22, fontWeight: FontWeight.bold, color: theme.text.primary, marginBottom: 16 },
        resultScoreCircle: {
            width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center',
            backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : Colors.primary[50], marginBottom: 16,
        },
        resultPct: { fontSize: 28, fontWeight: FontWeight.bold, color: Colors.primary[isDark ? 300 : 600] },
        resultScoreLabel: { fontSize: 12, color: Colors.primary[400] },
        resultDetail: { fontSize: 14, color: theme.text.secondary, marginBottom: 8 },
        resultMessage: { fontSize: 14, color: theme.text.secondary, textAlign: 'center', lineHeight: 20 },
        retryBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            paddingVertical: 14, borderRadius: 14, gap: 8, marginBottom: 12,
        },
        retryBtnText: { fontSize: 15, fontWeight: FontWeight.bold, color: '#fff' },
        browseBtn: { alignItems: 'center', paddingVertical: 14 },
        browseBtnText: { fontSize: 14, color: theme.text.secondary },
    });

export default CulturalGuideScreen;
