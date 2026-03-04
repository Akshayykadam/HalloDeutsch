// Idioms & Slang Screen - Learn German expressions
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as audioService from '../../services/audioService';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import {
    germanIdioms,
    idiomCategories,
    getIdiomsByCategory,
    getRandomIdioms,
    GermanIdiom,
} from '../../data/content/idioms-slang-data';

type ScreenState = 'browse' | 'card' | 'quiz';
const { width } = Dimensions.get('window');

export const IdiomsSlangScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const s = getStyles(theme, isDark);

    const [screenState, setScreenState] = useState<ScreenState>('browse');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentCards, setCurrentCards] = useState<GermanIdiom[]>([]);
    const [cardIndex, setCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [quizIdioms, setQuizIdioms] = useState<GermanIdiom[]>([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        return () => { audioService.stopAudio(); };
    }, []);

    const displayIdioms = selectedCategory
        ? getIdiomsByCategory(selectedCategory as GermanIdiom['category'])
        : germanIdioms;

    const handleStartCards = () => {
        setCurrentCards([...displayIdioms].sort(() => Math.random() - 0.5));
        setCardIndex(0);
        setIsFlipped(false);
        flipAnim.setValue(0);
        setScreenState('card');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleStartQuiz = () => {
        const shuffled = [...germanIdioms].sort(() => Math.random() - 0.5);
        setQuizIdioms(shuffled.slice(0, 10));
        setQuizIndex(0);
        setQuizScore(0);
        setSelectedAnswer(null);
        setScreenState('quiz');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleFlip = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(flipAnim, {
            toValue: isFlipped ? 0 : 1,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
    };

    const handleNextCard = () => {
        if (cardIndex < currentCards.length - 1) {
            setCardIndex(prev => prev + 1);
            setIsFlipped(false);
            flipAnim.setValue(0);
        }
    };

    const handlePrevCard = () => {
        if (cardIndex > 0) {
            setCardIndex(prev => prev - 1);
            setIsFlipped(false);
            flipAnim.setValue(0);
        }
    };

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const newFavs = new Set(prev);
            if (newFavs.has(id)) { newFavs.delete(id); } else { newFavs.add(id); }
            return newFavs;
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const playAudio = async (text: string) => {
        if (isPlaying) return;
        setIsPlaying(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await audioService.speak(text);
        setIsPlaying(false);
    };

    const handleQuizAnswer = (answer: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);
        const isCorrect = answer === quizIdioms[quizIndex].meaning;
        if (isCorrect) {
            setQuizScore(prev => prev + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleNextQuiz = () => {
        if (quizIndex < quizIdioms.length - 1) {
            setQuizIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setScreenState('browse');
        }
    };

    const currentCard = currentCards[cardIndex];

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const getCategoryColor = (cat: string): [string, string] => {
        switch (cat) {
            case 'animals': return ['#F59E0B', '#D97706'];
            case 'food': return ['#10B981', '#059669'];
            case 'body': return ['#EF4444', '#DC2626'];
            case 'weather': return ['#3B82F6', '#2563EB'];
            case 'money': return ['#8B5CF6', '#7C3AED'];
            default: return ['#6366F1', '#4F46E5'];
        }
    };

    const getUsageColor = (usage: string) => {
        switch (usage) {
            case 'common': return { bg: isDark ? 'rgba(16,185,129,0.12)' : '#ECFDF5', text: '#059669' };
            case 'formal': return { bg: isDark ? 'rgba(99,102,241,0.12)' : '#EEF2FF', text: '#4F46E5' };
            default: return { bg: isDark ? 'rgba(245,158,11,0.12)' : '#FFFBEB', text: '#D97706' };
        }
    };

    /* ─── Browse ─── */
    const renderBrowse = () => (
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
            {/* Hero Action Row */}
            <View style={s.heroRow}>
                <TouchableOpacity style={s.heroCard} onPress={handleStartCards} activeOpacity={0.85}>
                    <LinearGradient colors={['#6366F1', '#4F46E5'] as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.heroGrad}>
                        <View style={s.heroIconWrap}>
                            <Ionicons name="albums" size={22} color="#fff" />
                        </View>
                        <Text style={s.heroLabel}>Flashcards</Text>
                        <Text style={s.heroSub}>Swipe & learn</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={s.heroCard} onPress={handleStartQuiz} activeOpacity={0.85}>
                    <LinearGradient colors={['#10B981', '#059669'] as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.heroGrad}>
                        <View style={s.heroIconWrap}>
                            <Ionicons name="help-circle" size={22} color="#fff" />
                        </View>
                        <Text style={s.heroLabel}>Quiz</Text>
                        <Text style={s.heroSub}>Test yourself</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Category Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
                <TouchableOpacity
                    style={[s.chip, !selectedCategory && s.chipActive]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text style={[s.chipText, !selectedCategory && s.chipTextActive]}>All</Text>
                </TouchableOpacity>
                {idiomCategories.map((cat) => (
                    <TouchableOpacity
                        key={cat.key}
                        style={[s.chip, selectedCategory === cat.key && s.chipActive]}
                        onPress={() => setSelectedCategory(cat.key)}
                    >
                        <Ionicons
                            name={cat.icon as any}
                            size={14}
                            color={selectedCategory === cat.key ? '#fff' : theme.text.tertiary}
                        />
                        <Text style={[s.chipText, selectedCategory === cat.key && s.chipTextActive]}>
                            {cat.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Section Header */}
            <View style={s.sectionRow}>
                <Text style={s.sectionTitle}>
                    {selectedCategory
                        ? idiomCategories.find(c => c.key === selectedCategory)?.label
                        : 'All Expressions'}
                </Text>
                <View style={s.countPill}>
                    <Text style={s.countText}>{displayIdioms.length}</Text>
                </View>
            </View>

            {/* Idiom Cards */}
            {displayIdioms.map((idiom) => {
                const catColors = getCategoryColor(idiom.category);
                const usageStyle = getUsageColor(idiom.usage);
                return (
                    <TouchableOpacity
                        key={idiom.id}
                        style={s.idiomCard}
                        activeOpacity={0.8}
                        onPress={() => {
                            setCurrentCards([idiom]);
                            setCardIndex(0);
                            setIsFlipped(false);
                            flipAnim.setValue(0);
                            setScreenState('card');
                        }}
                    >
                        {/* Left accent */}
                        <LinearGradient colors={catColors} style={s.idiomAccent} />

                        <View style={s.idiomBody}>
                            {/* Top row: german text + actions */}
                            <View style={s.idiomTopRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.idiomGerman}>{idiom.german}</Text>
                                    <Text style={s.idiomLiteral}>"{idiom.literal}"</Text>
                                </View>
                                <View style={s.idiomActions}>
                                    <TouchableOpacity
                                        style={s.idiomActionBtn}
                                        onPress={(e) => { e.stopPropagation(); playAudio(idiom.german); }}
                                    >
                                        <Ionicons name="volume-medium" size={16} color={Colors.primary[400]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={s.idiomActionBtn}
                                        onPress={(e) => { e.stopPropagation(); toggleFavorite(idiom.id); }}
                                    >
                                        <Ionicons
                                            name={favorites.has(idiom.id) ? 'heart' : 'heart-outline'}
                                            size={16}
                                            color={favorites.has(idiom.id) ? '#EF4444' : theme.text.tertiary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Meaning */}
                            <Text style={s.idiomMeaning}>{idiom.meaning}</Text>

                            {/* Meta pills */}
                            <View style={s.idiomMetaRow}>
                                <View style={s.levelPill}>
                                    <Text style={s.levelPillText}>{idiom.level}</Text>
                                </View>
                                <View style={[s.usagePill, { backgroundColor: usageStyle.bg }]}>
                                    <Text style={[s.usagePillText, { color: usageStyle.text }]}>{idiom.usage}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    /* ─── Flashcard ─── */
    const renderCard = () => {
        if (!currentCard) return null;
        const catColors = getCategoryColor(currentCard.category);
        return (
            <View style={s.cardContainer}>
                {/* Progress bar */}
                <View style={s.cardProgressWrap}>
                    <Text style={s.cardProgressLabel}>{cardIndex + 1} / {currentCards.length}</Text>
                    <View style={s.cardProgressTrack}>
                        <LinearGradient
                            colors={['#6366F1', '#818CF8'] as [string, string]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[s.cardProgressFill, { width: `${((cardIndex + 1) / currentCards.length) * 100}%` }]}
                        />
                    </View>
                </View>

                {/* Flip Card */}
                <TouchableOpacity activeOpacity={0.95} onPress={handleFlip} style={s.cardWrapper}>
                    {/* Front */}
                    <Animated.View style={[s.card, s.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}>
                        <LinearGradient colors={catColors} style={s.cardCatBadge}>
                            <Text style={s.cardCatText}>{currentCard.category}</Text>
                        </LinearGradient>

                        <TouchableOpacity
                            style={s.cardAudioBtn}
                            onPress={(e) => { e.stopPropagation(); playAudio(currentCard.german); }}
                        >
                            <Ionicons name="volume-medium" size={22} color={Colors.primary[400]} />
                        </TouchableOpacity>

                        <Text style={s.cardGerman}>{currentCard.german}</Text>
                        <Text style={s.cardLiteral}>"{currentCard.literal}"</Text>

                        <View style={s.cardHintRow}>
                            <Ionicons name="sync-outline" size={14} color={theme.text.tertiary} />
                            <Text style={s.cardHint}>Tap to reveal meaning</Text>
                        </View>
                    </Animated.View>

                    {/* Back */}
                    <Animated.View style={[s.card, s.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
                        <Text style={s.cardBackLabel}>Meaning</Text>
                        <Text style={s.cardMeaning}>{currentCard.meaning}</Text>

                        <View style={s.cardExampleWrap}>
                            <View style={s.cardExampleHeader}>
                                <Ionicons name="chatbox-ellipses-outline" size={14} color={Colors.primary[400]} />
                                <Text style={s.cardExampleLabel}>Example</Text>
                            </View>
                            <Text style={s.cardExample}>{currentCard.example}</Text>
                            <Text style={s.cardExampleTrans}>{currentCard.exampleTranslation}</Text>
                        </View>

                        <View style={s.cardMetaRow}>
                            <View style={s.cardMetaPill}>
                                <Text style={s.cardMetaText}>{currentCard.level}</Text>
                            </View>
                            <View style={s.cardMetaPill}>
                                <Text style={s.cardMetaText}>{currentCard.category}</Text>
                            </View>
                        </View>
                    </Animated.View>
                </TouchableOpacity>

                {/* Favorite */}
                <TouchableOpacity style={s.favBtn} onPress={() => toggleFavorite(currentCard.id)}>
                    <Ionicons
                        name={favorites.has(currentCard.id) ? 'heart' : 'heart-outline'}
                        size={24}
                        color={favorites.has(currentCard.id) ? '#EF4444' : theme.text.tertiary}
                    />
                </TouchableOpacity>

                {/* Nav */}
                <View style={s.cardNav}>
                    <TouchableOpacity
                        style={[s.navBtn, cardIndex === 0 && s.navBtnDisabled]}
                        onPress={handlePrevCard}
                        disabled={cardIndex === 0}
                    >
                        <Ionicons name="chevron-back" size={20} color={cardIndex === 0 ? theme.text.tertiary : theme.text.primary} />
                        <Text style={[s.navBtnText, cardIndex === 0 && { color: theme.text.tertiary }]}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[s.navBtn, s.navBtnNext, cardIndex === currentCards.length - 1 && s.navBtnDisabled]}
                        onPress={handleNextCard}
                        disabled={cardIndex === currentCards.length - 1}
                    >
                        <Text style={[s.navBtnText, { color: '#fff' }, cardIndex === currentCards.length - 1 && { color: 'rgba(255,255,255,0.4)' }]}>Next</Text>
                        <Ionicons name="chevron-forward" size={20} color={cardIndex === currentCards.length - 1 ? 'rgba(255,255,255,0.4)' : '#fff'} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    /* ─── Quiz ─── */
    const renderQuiz = () => {
        const currentQuiz = quizIdioms[quizIndex];
        if (!currentQuiz) return null;

        const otherIdioms = germanIdioms.filter(i => i.id !== currentQuiz.id);
        const wrongAnswers = otherIdioms.sort(() => Math.random() - 0.5).slice(0, 3).map(i => i.meaning);
        const options = [...wrongAnswers, currentQuiz.meaning].sort(() => Math.random() - 0.5);

        return (
            <ScrollView style={s.scroll} contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
                {/* Progress */}
                <View style={s.quizProgressRow}>
                    <Text style={s.quizProgressLabel}>Question {quizIndex + 1}/{quizIdioms.length}</Text>
                    <View style={s.quizScorePill}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={s.quizScoreText}>{quizScore}</Text>
                    </View>
                </View>
                <View style={s.quizProgressTrack}>
                    <LinearGradient
                        colors={['#6366F1', '#818CF8'] as [string, string]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[s.quizProgressFill, { width: `${((quizIndex + 1) / quizIdioms.length) * 100}%` }]}
                    />
                </View>

                {/* Question Card */}
                <View style={s.quizQuestionCard}>
                    <Text style={s.quizQuestionLabel}>What does this mean?</Text>
                    <Text style={s.quizGerman}>{currentQuiz.german}</Text>
                    <Text style={s.quizLiteral}>"{currentQuiz.literal}"</Text>
                </View>

                {/* Options */}
                <View style={s.quizOptions}>
                    {options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQuiz.meaning;
                        const showResult = selectedAnswer !== null;

                        let optionStyle = s.quizOption;
                        let borderStyle = {};
                        if (showResult && isCorrect) {
                            borderStyle = { borderColor: '#10B981', backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ECFDF5' };
                        } else if (showResult && isSelected && !isCorrect) {
                            borderStyle = { borderColor: '#EF4444', backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2' };
                        }

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[optionStyle, borderStyle]}
                                onPress={() => handleQuizAnswer(option)}
                                disabled={selectedAnswer !== null}
                                activeOpacity={0.8}
                            >
                                <View style={s.quizOptionIndex}>
                                    <Text style={s.quizOptionIndexText}>{String.fromCharCode(65 + index)}</Text>
                                </View>
                                <Text style={s.quizOptionText}>{option}</Text>
                                {showResult && isCorrect && (
                                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                )}
                                {showResult && isSelected && !isCorrect && (
                                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Next */}
                {selectedAnswer && (
                    <TouchableOpacity activeOpacity={0.85} onPress={handleNextQuiz}>
                        <LinearGradient colors={['#6366F1', '#4F46E5'] as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.quizNextBtn}>
                            <Text style={s.quizNextText}>
                                {quizIndex < quizIdioms.length - 1 ? 'Next Question' : 'Finish'}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    };

    /* ─── Main ─── */
    return (
        <View style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (screenState === 'browse') { navigation.goBack(); }
                        else { setScreenState('browse'); }
                    }}
                    style={s.backBtn}
                >
                    <Ionicons name="chevron-back" size={22} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Idioms & Slang</Text>
                <View style={s.headerPill}>
                    <Ionicons name="chatbubbles" size={13} color={Colors.primary[400]} />
                    <Text style={s.headerPillText}>{germanIdioms.length}</Text>
                </View>
            </View>

            {screenState === 'browse' && renderBrowse()}
            {screenState === 'card' && renderCard()}
            {screenState === 'quiz' && renderQuiz()}
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
        backBtn: { padding: 4 },
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

        /* Hero Action Cards */
        heroRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
        heroCard: { flex: 1 },
        heroGrad: { borderRadius: 16, padding: 16, minHeight: 100 },
        heroIconWrap: {
            width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 10,
        },
        heroLabel: { fontSize: 15, fontWeight: FontWeight.bold, color: '#fff' },
        heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

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

        /* Idiom Cards */
        idiomCard: {
            flexDirection: 'row', marginBottom: 10, borderRadius: 14, overflow: 'hidden',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
        },
        idiomAccent: { width: 4 },
        idiomBody: { flex: 1, padding: 14 },
        idiomTopRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
        idiomGerman: { fontSize: 15, fontWeight: FontWeight.bold, color: theme.text.primary, lineHeight: 20 },
        idiomLiteral: { fontSize: 12, color: theme.text.tertiary, fontStyle: 'italic', marginTop: 2 },
        idiomActions: { flexDirection: 'row', gap: 6, marginLeft: 8 },
        idiomActionBtn: {
            width: 30, height: 30, borderRadius: 15,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
            alignItems: 'center', justifyContent: 'center',
        },
        idiomMeaning: { fontSize: 13, color: Colors.primary[isDark ? 300 : 600], marginBottom: 8, lineHeight: 18 },
        idiomMetaRow: { flexDirection: 'row', gap: 6 },
        levelPill: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
        },
        levelPillText: { fontSize: 11, fontWeight: FontWeight.bold, color: theme.text.secondary },
        usagePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
        usagePillText: { fontSize: 11, fontWeight: FontWeight.medium, textTransform: 'capitalize' as const },

        /* ─── Flashcard ─── */
        cardContainer: { flex: 1, padding: 16, alignItems: 'center' },
        cardProgressWrap: { width: '100%', marginBottom: 20 },
        cardProgressLabel: { fontSize: 13, color: theme.text.secondary, marginBottom: 6 },
        cardProgressTrack: {
            height: 6, borderRadius: 3, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6', overflow: 'hidden',
        },
        cardProgressFill: { height: '100%', borderRadius: 3 },
        cardWrapper: { width: width - 40, height: 380 },
        card: {
            position: 'absolute', width: '100%', height: '100%',
            borderRadius: 22, padding: 24, alignItems: 'center', justifyContent: 'center',
            backfaceVisibility: 'hidden',
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
        },
        cardFront: { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff' },
        cardBack: { backgroundColor: isDark ? 'rgba(99,102,241,0.08)' : '#EEF2FF' },
        cardCatBadge: {
            position: 'absolute', top: 16, left: 16,
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
        },
        cardCatText: { fontSize: 11, fontWeight: FontWeight.bold, color: '#fff', textTransform: 'capitalize' as const },
        cardAudioBtn: {
            position: 'absolute', top: 16, right: 16,
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50],
            alignItems: 'center', justifyContent: 'center',
        },
        cardGerman: { fontSize: 26, fontWeight: FontWeight.bold, color: theme.text.primary, textAlign: 'center', marginBottom: 8 },
        cardLiteral: { fontSize: 16, color: theme.text.secondary, fontStyle: 'italic', textAlign: 'center' },
        cardHintRow: {
            position: 'absolute', bottom: 20,
            flexDirection: 'row', alignItems: 'center', gap: 5,
        },
        cardHint: { fontSize: 12, color: theme.text.tertiary },
        cardBackLabel: { fontSize: 12, color: Colors.primary[400], fontWeight: FontWeight.bold, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 1 },
        cardMeaning: { fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? '#C7D2FE' : Colors.primary[700], textAlign: 'center', marginBottom: 20 },
        cardExampleWrap: {
            width: '100%', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
            borderRadius: 14, padding: 14, marginBottom: 16,
        },
        cardExampleHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
        cardExampleLabel: { fontSize: 11, color: Colors.primary[400], fontWeight: FontWeight.bold },
        cardExample: { fontSize: 14, fontWeight: FontWeight.medium, color: isDark ? '#C7D2FE' : Colors.primary[700], marginBottom: 4 },
        cardExampleTrans: { fontSize: 13, color: theme.text.secondary, fontStyle: 'italic' },
        cardMetaRow: { flexDirection: 'row', gap: 8 },
        cardMetaPill: {
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[100],
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
        },
        cardMetaText: { fontSize: 11, fontWeight: FontWeight.bold, color: Colors.primary[isDark ? 300 : 600], textTransform: 'capitalize' as const },
        favBtn: { marginTop: 16 },
        cardNav: { flexDirection: 'row', gap: 12, marginTop: 20, width: '100%' },
        navBtn: {
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            paddingVertical: 13, borderRadius: 12, gap: 4,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
        },
        navBtnDisabled: { opacity: 0.4 },
        navBtnText: { fontSize: 14, fontWeight: FontWeight.medium, color: theme.text.primary },
        navBtnNext: { backgroundColor: Colors.primary[500] },

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
            borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 20,
            borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
        },
        quizQuestionLabel: { fontSize: 13, color: theme.text.tertiary, marginBottom: 10 },
        quizGerman: { fontSize: 22, fontWeight: FontWeight.bold, color: theme.text.primary, textAlign: 'center', marginBottom: 6 },
        quizLiteral: { fontSize: 14, color: theme.text.tertiary, fontStyle: 'italic' },
        quizOptions: { gap: 10, marginBottom: 20 },
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
        quizNextBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            paddingVertical: 14, borderRadius: 14, gap: 6,
        },
        quizNextText: { fontSize: 15, fontWeight: FontWeight.bold, color: '#fff' },
    });

export default IdiomsSlangScreen;
