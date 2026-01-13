// Cultural Guide Screen - Life in Germany tips and information
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { getRandomImage } from '../../services/imageService';
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
    const styles = getStyles(theme, isDark);

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

    const getImportanceColor = (importance: CulturalTip['importance']) => {
        switch (importance) {
            case 'essential':
                return Colors.error[500];
            case 'helpful':
                return Colors.primary[500];
            case 'interesting':
                return Colors.success[500];
        }
    };

    const renderBrowse = () => (
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
            {/* Quiz Banner */}
            <TouchableOpacity style={styles.quizBanner} onPress={handleStartQuiz}>
                <View style={styles.quizBannerContent}>
                    <View style={styles.quizBannerIconContainer}>
                        <Ionicons name="school" size={32} color={Colors.white} />
                    </View>
                    <View>
                        <Text style={styles.quizBannerTitle}>Test Your Knowledge!</Text>
                        <Text style={styles.quizBannerSubtitle}>Take the culture quiz</Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.white} />
            </TouchableOpacity>

            {/* Category Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
            >
                <TouchableOpacity
                    style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text
                        style={[
                            styles.categoryChipText,
                            !selectedCategory && styles.categoryChipTextActive,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.key}
                        style={[
                            styles.categoryChip,
                            selectedCategory === cat.key && styles.categoryChipActive,
                        ]}
                        onPress={() => setSelectedCategory(cat.key)}
                    >
                        <Ionicons
                            name={cat.icon as any}
                            size={16}
                            color={selectedCategory === cat.key ? Colors.white : theme.text.secondary}
                        />
                        <Text
                            style={[
                                styles.categoryChipText,
                                selectedCategory === cat.key && styles.categoryChipTextActive,
                            ]}
                        >
                            {cat.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Tips List */}
            <Text style={styles.sectionTitle}>
                {selectedCategory
                    ? categories.find(c => c.key === selectedCategory)?.label
                    : 'All Tips'}
            </Text>

            {displayTips.map((tip) => (
                <TouchableOpacity
                    key={tip.id}
                    style={styles.tipCard}
                    onPress={() => handleSelectTip(tip)}
                >
                    <View style={styles.tipIconContainer}>
                        <Ionicons name={tip.icon as any} size={28} color={getImportanceColor(tip.importance)} />
                    </View>
                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>{tip.title}</Text>
                        <Text style={styles.tipTitleDe}>{tip.titleDe}</Text>
                        <View
                            style={[
                                styles.importanceBadge,
                                { backgroundColor: getImportanceColor(tip.importance) + '20' },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.importanceText,
                                    { color: getImportanceColor(tip.importance) },
                                ]}
                            >
                                {tip.importance}
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderDetail = () => {
        if (!selectedTip) return null;

        return (
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.detailScrollContainer}>
                {/* Hero Image */}
                <View style={styles.heroImageContainer}>
                    <Image
                        source={{ uri: getRandomImage(selectedTip.title + ' germany', 800, 400) }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heroImageOverlay} />
                    <View style={styles.heroContent}>
                        <View style={[styles.detailIconContainer, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                            <Ionicons name={selectedTip.icon as any} size={36} color={getImportanceColor(selectedTip.importance)} />
                        </View>
                        <Text style={styles.heroTitle}>{selectedTip.title}</Text>
                        <Text style={styles.heroTitleDe}>{selectedTip.titleDe}</Text>
                        <View style={[styles.detailImportanceBadge, { backgroundColor: getImportanceColor(selectedTip.importance) }]}>
                            <Ionicons
                                name={selectedTip.importance === 'essential' ? 'alert-circle' : selectedTip.importance === 'helpful' ? 'thumbs-up' : 'sparkles'}
                                size={14}
                                color={Colors.white}
                            />
                            <Text style={styles.detailImportanceText}>{selectedTip.importance}</Text>
                        </View>
                    </View>
                </View>

                {/* Content Card */}
                <View style={styles.detailCard}>
                    <View style={styles.detailCardHeader}>
                        <Ionicons name="information-circle" size={20} color={Colors.primary[500]} />
                        <Text style={styles.detailCardTitle}>What You Should Know</Text>
                    </View>
                    <Text style={styles.detailContent}>{selectedTip.content}</Text>
                </View>

                {selectedTip.germanPhrase && (
                    <View style={styles.phraseCard}>
                        <View style={styles.phraseHeader}>
                            <View style={styles.phraseFlagContainer}>
                                <Text style={styles.phraseFlag}>🇩🇪</Text>
                            </View>
                            <Text style={styles.phraseLabel}>Useful Phrase</Text>
                        </View>
                        <Text style={styles.phraseGerman}>{selectedTip.germanPhrase}</Text>
                        <View style={styles.phraseDivider} />
                        <Text style={styles.phraseEnglish}>
                            {selectedTip.germanPhraseTranslation}
                        </Text>
                    </View>
                )}

                {selectedTip.didYouKnow && (
                    <View style={styles.didYouKnowCard}>
                        <View style={styles.didYouKnowHeader}>
                            <View style={styles.didYouKnowIconContainer}>
                                <Ionicons name="bulb" size={20} color={Colors.warning[600]} />
                            </View>
                            <Text style={styles.didYouKnowLabel}>Did You Know?</Text>
                        </View>
                        <Text style={styles.didYouKnowText}>{selectedTip.didYouKnow}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.backToListButton}
                    onPress={() => setScreenState('browse')}
                >
                    <View style={styles.backToListIconContainer}>
                        <Ionicons name="arrow-back" size={18} color={Colors.primary[500]} />
                    </View>
                    <Text style={styles.backToListText}>Back to all tips</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    };

    const renderQuiz = () => {
        const currentQuestion = quizQuestions[quizIndex];
        if (!currentQuestion) return null;

        return (
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.quizProgress}>
                    <Text style={styles.quizProgressText}>
                        Question {quizIndex + 1} of {quizQuestions.length}
                    </Text>
                    <View style={styles.quizProgressBar}>
                        <View
                            style={[
                                styles.quizProgressFill,
                                { width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` },
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                </View>

                <View style={styles.quizOptions}>
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const showCorrect = showExplanation && isCorrect;
                        const showWrong = showExplanation && isSelected && !isCorrect;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.quizOption,
                                    isSelected && styles.quizOptionSelected,
                                    showCorrect && styles.quizOptionCorrect,
                                    showWrong && styles.quizOptionWrong,
                                ]}
                                onPress={() => handleQuizAnswer(option)}
                                disabled={showExplanation}
                            >
                                <Text style={styles.quizOptionText}>{option}</Text>
                                {showCorrect && (
                                    <Ionicons name="checkmark-circle" size={24} color={Colors.success[500]} />
                                )}
                                {showWrong && (
                                    <Ionicons name="close-circle" size={24} color={Colors.error[500]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {showExplanation && (
                    <View style={styles.explanationCard}>
                        <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                    </View>
                )}

                {showExplanation && (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                        <Text style={styles.nextButtonText}>
                            {quizIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.white} />
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    };

    const renderQuizResult = () => {
        const percentage = Math.round((quizScore / quizQuestions.length) * 100);
        const iconName = percentage >= 80 ? 'trophy' : percentage >= 60 ? 'thumbs-up' : 'book';
        const iconColor = percentage >= 80 ? Colors.gold[500] : percentage >= 60 ? Colors.primary[500] : Colors.warning[500];

        return (
            <View style={styles.resultContainer}>
                <View style={styles.resultCard}>
                    <Ionicons name={iconName} size={64} color={iconColor} style={{ marginBottom: Spacing.md }} />
                    <Text style={styles.resultTitle}>Quiz Complete!</Text>
                    <Text style={styles.resultScore}>
                        {quizScore} / {quizQuestions.length} correct
                    </Text>
                    <Text style={styles.resultPercentage}>{percentage}%</Text>
                    <Text style={styles.resultMessage}>
                        {percentage >= 80
                            ? 'Excellent! You know German culture well!'
                            : percentage >= 60
                                ? 'Good job! Keep learning!'
                                : 'Keep exploring! There\'s more to discover.'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.retryButton} onPress={handleStartQuiz}>
                    <Ionicons name="refresh" size={20} color={Colors.white} />
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.browseButton}
                    onPress={() => setScreenState('browse')}
                >
                    <Text style={styles.browseButtonText}>Back to Tips</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (screenState === 'browse') {
                            navigation.goBack();
                        } else if (screenState === 'detail') {
                            setScreenState('browse');
                        } else if (screenState === 'quiz' || screenState === 'quiz-result') {
                            setScreenState('browse');
                        }
                    }}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cultural Guide</Text>
                <View style={styles.headerRight}>
                    <Ionicons name="globe-outline" size={24} color={theme.text.primary} />
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
            width: 40,
            alignItems: 'flex-end',
        },
        scrollContent: {
            flex: 1,
        },
        scrollContainer: {
            padding: Spacing.md,
            paddingBottom: Spacing['2xl'],
        },
        quizBanner: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Colors.primary[500],
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.lg,
        },
        quizBannerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.md,
        },
        quizBannerIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        quizBannerTitle: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        quizBannerSubtitle: {
            fontSize: FontSize.sm,
            color: Colors.white,
            opacity: 0.9,
        },
        categoryScroll: {
            paddingBottom: Spacing.md,
            gap: Spacing.sm,
        },
        categoryChip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background.secondary,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderRadius: BorderRadius.full,
            gap: Spacing.xs,
        },
        categoryChipActive: {
            backgroundColor: Colors.primary[500],
        },
        categoryChipText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },
        categoryChipTextActive: {
            color: Colors.white,
            fontWeight: FontWeight.medium,
        },
        sectionTitle: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.md,
        },
        tipCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.sm,
            ...Shadows.sm,
        },
        tipIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.background.tertiary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md,
        },
        tipContent: {
            flex: 1,
        },
        tipTitle: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        tipTitleDe: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.xs,
        },
        importanceBadge: {
            alignSelf: 'flex-start',
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: BorderRadius.sm,
        },
        importanceText: {
            fontSize: FontSize.xs,
            fontWeight: FontWeight.medium,
            textTransform: 'capitalize',
        },
        detailScrollContainer: {
            paddingBottom: Spacing['2xl'],
        },
        heroImageContainer: {
            height: 220,
            position: 'relative',
            marginBottom: Spacing.md,
        },
        heroImage: {
            width: '100%',
            height: '100%',
        },
        heroImageOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        heroContent: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: Spacing.lg,
            alignItems: 'center',
        },
        heroTitle: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: Colors.white,
            textAlign: 'center',
            marginBottom: Spacing.xs,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
        },
        heroTitleDe: {
            fontSize: FontSize.md,
            color: Colors.white,
            textAlign: 'center',
            marginBottom: Spacing.md,
            opacity: 0.9,
        },
        detailHero: {
            alignItems: 'center',
            paddingVertical: Spacing.xl,
            paddingHorizontal: Spacing.lg,
            marginBottom: Spacing.md,
            borderBottomLeftRadius: BorderRadius['2xl'],
            borderBottomRightRadius: BorderRadius['2xl'],
        },
        detailHeader: {
            alignItems: 'center',
            marginBottom: Spacing.lg,
        },
        detailIconContainer: {
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.md,
        },
        detailTitle: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            textAlign: 'center',
            marginBottom: Spacing.xs,
        },
        detailTitleDe: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
            textAlign: 'center',
            marginBottom: Spacing.md,
        },
        detailImportanceBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.sm,
            paddingVertical: 4,
            borderRadius: BorderRadius.full,
            gap: Spacing.xs,
        },
        detailImportanceText: {
            fontSize: FontSize.xs,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            textTransform: 'capitalize',
        },
        detailCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginHorizontal: Spacing.md,
            marginBottom: Spacing.md,
            ...Shadows.sm,
        },
        detailCardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing.md,
        },
        detailCardTitle: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.primary[600],
        },
        detailContent: {
            fontSize: FontSize.md,
            color: theme.text.primary,
            lineHeight: 24,
        },
        phraseCard: {
            backgroundColor: Colors.primary[50],
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginHorizontal: Spacing.md,
            marginBottom: Spacing.md,
            borderLeftWidth: 4,
            borderLeftColor: Colors.primary[500],
        },
        phraseHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing.md,
        },
        phraseFlagContainer: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.white,
            alignItems: 'center',
            justifyContent: 'center',
        },
        phraseFlag: {
            fontSize: FontSize.md,
        },
        phraseLabel: {
            fontSize: FontSize.sm,
            fontWeight: FontWeight.bold,
            color: Colors.primary[600],
        },
        phraseGerman: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            color: Colors.primary[700],
            marginBottom: Spacing.sm,
        },
        phraseDivider: {
            height: 1,
            backgroundColor: Colors.primary[200],
            marginVertical: Spacing.sm,
        },
        phraseEnglish: {
            fontSize: FontSize.md,
            color: Colors.primary[600],
            fontStyle: 'italic',
        },
        didYouKnowCard: {
            backgroundColor: Colors.warning[50],
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginHorizontal: Spacing.md,
            marginBottom: Spacing.lg,
            borderWidth: 1,
            borderColor: Colors.warning[200],
        },
        didYouKnowHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing.md,
        },
        didYouKnowIconContainer: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: Colors.warning[100],
            alignItems: 'center',
            justifyContent: 'center',
        },
        didYouKnowLabel: {
            fontSize: FontSize.sm,
            fontWeight: FontWeight.bold,
            color: Colors.warning[700],
        },
        didYouKnowText: {
            fontSize: FontSize.md,
            color: Colors.warning[700],
            lineHeight: 22,
        },
        backToListButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.sm,
            paddingVertical: Spacing.md,
            marginHorizontal: Spacing.md,
            marginBottom: Spacing.md,
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.md,
        },
        backToListIconContainer: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
        },
        backToListText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.medium,
            color: Colors.primary[500],
        },
        quizProgress: {
            marginBottom: Spacing.lg,
        },
        quizProgressText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.xs,
        },
        quizProgressBar: {
            height: 8,
            backgroundColor: theme.background.tertiary,
            borderRadius: BorderRadius.full,
            overflow: 'hidden',
        },
        quizProgressFill: {
            height: '100%',
            backgroundColor: Colors.primary[500],
        },
        questionCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
        },
        questionText: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            textAlign: 'center',
        },
        quizOptions: {
            gap: Spacing.sm,
            marginBottom: Spacing.lg,
        },
        quizOption: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        quizOptionSelected: {
            borderColor: Colors.primary[500],
        },
        quizOptionCorrect: {
            borderColor: Colors.success[500],
            backgroundColor: Colors.success[50],
        },
        quizOptionWrong: {
            borderColor: Colors.error[500],
            backgroundColor: Colors.error[50],
        },
        quizOptionText: {
            flex: 1,
            fontSize: FontSize.md,
            color: theme.text.primary,
        },
        explanationCard: {
            backgroundColor: Colors.primary[50],
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            marginBottom: Spacing.lg,
        },
        explanationText: {
            fontSize: FontSize.sm,
            color: Colors.primary[700],
        },
        nextButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.md,
            gap: Spacing.xs,
        },
        nextButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        resultContainer: {
            flex: 1,
            padding: Spacing.lg,
            justifyContent: 'center',
        },
        resultCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.xl,
            padding: Spacing.xl,
            alignItems: 'center',
            marginBottom: Spacing.lg,
            ...Shadows.lg,
        },
        resultTitle: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.sm,
        },
        resultScore: {
            fontSize: FontSize.lg,
            color: theme.text.secondary,
        },
        resultPercentage: {
            fontSize: 48,
            fontWeight: FontWeight.bold,
            color: Colors.primary[500],
            marginVertical: Spacing.md,
        },
        resultMessage: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
            textAlign: 'center',
        },
        retryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.md,
            gap: Spacing.sm,
            marginBottom: Spacing.md,
        },
        retryButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        browseButton: {
            alignItems: 'center',
            paddingVertical: Spacing.md,
        },
        browseButtonText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
        },
    });

export default CulturalGuideScreen;
