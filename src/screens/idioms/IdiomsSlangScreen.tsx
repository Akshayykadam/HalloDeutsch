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
    const styles = getStyles(theme, isDark);

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

    // Cleanup: Stop audio when navigating away
    useEffect(() => {
        return () => {
            audioService.stopAudio();
        };
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
            if (newFavs.has(id)) {
                newFavs.delete(id);
            } else {
                newFavs.add(id);
            }
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

    const renderBrowse = () => (
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleStartCards}>
                    <Ionicons name="albums-outline" size={24} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Flashcards</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.quizButton]}
                    onPress={handleStartQuiz}
                >
                    <Ionicons name="help-circle-outline" size={24} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Quiz</Text>
                </TouchableOpacity>
            </View>

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
                {idiomCategories.map((cat) => (
                    <TouchableOpacity
                        key={cat.key}
                        style={[
                            styles.categoryChip,
                            selectedCategory === cat.key && styles.categoryChipActive,
                        ]}
                        onPress={() => setSelectedCategory(cat.key)}
                    >
                        <Ionicons name={cat.icon as any} size={20} color={selectedCategory === cat.key ? Colors.white : theme.text.secondary} />
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

            {/* Idioms List */}
            <Text style={styles.sectionTitle}>
                {selectedCategory
                    ? idiomCategories.find(c => c.key === selectedCategory)?.label
                    : 'All Expressions'} ({displayIdioms.length})
            </Text>

            {displayIdioms.map((idiom) => (
                <TouchableOpacity
                    key={idiom.id}
                    style={styles.idiomCard}
                    onPress={() => {
                        setCurrentCards([idiom]);
                        setCardIndex(0);
                        setIsFlipped(false);
                        flipAnim.setValue(0);
                        setScreenState('card');
                    }}
                >
                    <View style={styles.idiomHeader}>
                        <View style={styles.idiomMain}>
                            <Text style={styles.idiomGerman}>{idiom.german}</Text>
                            <Text style={styles.idiomLiteral}>"{idiom.literal}"</Text>
                        </View>
                        <View style={styles.idiomActions}>
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    playAudio(idiom.german);
                                }}
                            >
                                <Ionicons
                                    name="volume-high"
                                    size={20}
                                    color={Colors.primary[500]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(idiom.id);
                                }}
                            >
                                <Ionicons
                                    name={favorites.has(idiom.id) ? 'heart' : 'heart-outline'}
                                    size={20}
                                    color={favorites.has(idiom.id) ? Colors.error[500] : Colors.neutral[400]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.idiomMeaning}>{idiom.meaning}</Text>
                    <View style={styles.idiomMeta}>
                        <Text style={styles.idiomLevel}>{idiom.level}</Text>
                        <Text style={styles.idiomUsage}>{idiom.usage}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderCard = () => {
        if (!currentCard) return null;

        return (
            <View style={styles.cardContainer}>
                {/* Progress */}
                <View style={styles.cardProgress}>
                    <Text style={styles.cardProgressText}>
                        {cardIndex + 1} / {currentCards.length}
                    </Text>
                </View>

                {/* Flashcard */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleFlip}
                    style={styles.cardWrapper}
                >
                    {/* Front */}
                    <Animated.View
                        style={[
                            styles.card,
                            styles.cardFront,
                            { transform: [{ rotateY: frontInterpolate }] },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.cardAudioButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                playAudio(currentCard.german);
                            }}
                        >
                            <Ionicons
                                name="volume-high"
                                size={28}
                                color={Colors.primary[500]}
                            />
                        </TouchableOpacity>

                        <Text style={styles.cardGerman}>{currentCard.german}</Text>
                        <Text style={styles.cardLiteral}>"{currentCard.literal}"</Text>

                        <Text style={styles.cardTapHint}>Tap to flip</Text>
                    </Animated.View>

                    {/* Back */}
                    <Animated.View
                        style={[
                            styles.card,
                            styles.cardBack,
                            { transform: [{ rotateY: backInterpolate }] },
                        ]}
                    >
                        <Text style={styles.cardMeaningLabel}>Meaning:</Text>
                        <Text style={styles.cardMeaning}>{currentCard.meaning}</Text>

                        <View style={styles.cardExampleSection}>
                            <Text style={styles.cardExampleLabel}>Example:</Text>
                            <Text style={styles.cardExample}>{currentCard.example}</Text>
                            <Text style={styles.cardExampleTranslation}>
                                {currentCard.exampleTranslation}
                            </Text>
                        </View>

                        <View style={styles.cardMetaRow}>
                            <View style={styles.cardMetaBadge}>
                                <Text style={styles.cardMetaText}>{currentCard.level}</Text>
                            </View>
                            <View style={styles.cardMetaBadge}>
                                <Text style={styles.cardMetaText}>{currentCard.category}</Text>
                            </View>
                        </View>
                    </Animated.View>
                </TouchableOpacity>

                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(currentCard.id)}
                >
                    <Ionicons
                        name={favorites.has(currentCard.id) ? 'heart' : 'heart-outline'}
                        size={28}
                        color={favorites.has(currentCard.id) ? Colors.error[500] : theme.text.secondary}
                    />
                </TouchableOpacity>

                {/* Navigation */}
                <View style={styles.cardNavigation}>
                    <TouchableOpacity
                        style={[styles.navButton, cardIndex === 0 && styles.navButtonDisabled]}
                        onPress={handlePrevCard}
                        disabled={cardIndex === 0}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={cardIndex === 0 ? Colors.neutral[400] : theme.text.primary}
                        />
                        <Text style={[styles.navButtonText, cardIndex === 0 && styles.navButtonTextDisabled]}>
                            Previous
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            styles.nextNavButton,
                            cardIndex === currentCards.length - 1 && styles.navButtonDisabled,
                        ]}
                        onPress={handleNextCard}
                        disabled={cardIndex === currentCards.length - 1}
                    >
                        <Text
                            style={[
                                styles.navButtonText,
                                styles.nextNavButtonText,
                                cardIndex === currentCards.length - 1 && styles.navButtonTextDisabled,
                            ]}
                        >
                            Next
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color={cardIndex === currentCards.length - 1 ? Colors.neutral[400] : Colors.white}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderQuiz = () => {
        const currentQuiz = quizIdioms[quizIndex];
        if (!currentQuiz) return null;

        // Generate wrong answers
        const otherIdioms = germanIdioms.filter(i => i.id !== currentQuiz.id);
        const wrongAnswers = otherIdioms
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(i => i.meaning);
        const options = [...wrongAnswers, currentQuiz.meaning].sort(() => Math.random() - 0.5);

        return (
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.quizProgress}>
                    <Text style={styles.quizProgressText}>
                        Question {quizIndex + 1} of {quizIdioms.length}
                    </Text>
                    <Text style={styles.quizScoreText}>Score: {quizScore}</Text>
                </View>

                <View style={styles.quizCard}>
                    <Text style={styles.quizLabel}>What does this mean?</Text>
                    <Text style={styles.quizGerman}>{currentQuiz.german}</Text>
                    <Text style={styles.quizLiteral}>"{currentQuiz.literal}"</Text>
                </View>

                <View style={styles.quizOptions}>
                    {options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQuiz.meaning;
                        const showResult = selectedAnswer !== null;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.quizOption,
                                    showResult && isCorrect && styles.quizOptionCorrect,
                                    showResult && isSelected && !isCorrect && styles.quizOptionWrong,
                                ]}
                                onPress={() => handleQuizAnswer(option)}
                                disabled={selectedAnswer !== null}
                            >
                                <Text style={styles.quizOptionText}>{option}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {selectedAnswer && (
                    <TouchableOpacity style={styles.quizNextButton} onPress={handleNextQuiz}>
                        <Text style={styles.quizNextButtonText}>
                            {quizIndex < quizIdioms.length - 1 ? 'Next' : 'Finish'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.white} />
                    </TouchableOpacity>
                )}
            </ScrollView>
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
                        } else {
                            setScreenState('browse');
                        }
                    }}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Idioms & Slang</Text>
                <View style={styles.headerRight}>
                    <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary[500]} />
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
        actionRow: {
            flexDirection: 'row',
            gap: Spacing.md,
            marginBottom: Spacing.lg,
        },
        actionButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.lg,
            gap: Spacing.sm,
        },
        quizButton: {
            backgroundColor: Colors.success[500],
        },
        actionButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
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
        idiomCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.sm,
            ...Shadows.sm,
        },
        idiomHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: Spacing.xs,
        },
        idiomMain: {
            flex: 1,
        },
        idiomGerman: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        idiomLiteral: {
            fontSize: FontSize.sm,
            color: theme.text.tertiary,
            fontStyle: 'italic',
        },
        idiomActions: {
            flexDirection: 'row',
            gap: Spacing.md,
        },
        idiomMeaning: {
            fontSize: FontSize.sm,
            color: Colors.primary[600],
            marginBottom: Spacing.sm,
        },
        idiomMeta: {
            flexDirection: 'row',
            gap: Spacing.sm,
        },
        idiomLevel: {
            fontSize: FontSize.xs,
            color: theme.text.secondary,
            backgroundColor: theme.background.tertiary,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: BorderRadius.sm,
        },
        idiomUsage: {
            fontSize: FontSize.xs,
            color: Colors.success[600],
            backgroundColor: Colors.success[50],
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: BorderRadius.sm,
            textTransform: 'capitalize',
        },
        cardContainer: {
            flex: 1,
            padding: Spacing.md,
            alignItems: 'center',
        },
        cardProgress: {
            marginBottom: Spacing.lg,
        },
        cardProgressText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
        },
        cardWrapper: {
            width: width - 40,
            height: 400,
        },
        card: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: BorderRadius.xl,
            padding: Spacing.xl,
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            ...Shadows.lg,
        },
        cardFront: {
            backgroundColor: theme.background.secondary,
        },
        cardBack: {
            backgroundColor: Colors.primary[50],
        },
        cardAudioButton: {
            position: 'absolute',
            top: Spacing.md,
            right: Spacing.md,
        },
        cardGerman: {
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            textAlign: 'center',
            marginBottom: Spacing.md,
        },
        cardLiteral: {
            fontSize: FontSize.lg,
            color: theme.text.secondary,
            fontStyle: 'italic',
            textAlign: 'center',
        },
        cardTapHint: {
            position: 'absolute',
            bottom: Spacing.lg,
            fontSize: FontSize.sm,
            color: theme.text.tertiary,
        },
        cardMeaningLabel: {
            fontSize: FontSize.sm,
            color: Colors.primary[500],
            marginBottom: Spacing.xs,
        },
        cardMeaning: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            color: Colors.primary[700],
            textAlign: 'center',
            marginBottom: Spacing.lg,
        },
        cardExampleSection: {
            backgroundColor: Colors.white,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            width: '100%',
            marginBottom: Spacing.md,
        },
        cardExampleLabel: {
            fontSize: FontSize.xs,
            color: Colors.primary[500],
            marginBottom: Spacing.xs,
        },
        cardExample: {
            fontSize: FontSize.md,
            color: Colors.primary[700],
            fontWeight: FontWeight.medium,
        },
        cardExampleTranslation: {
            fontSize: FontSize.sm,
            color: Colors.primary[500],
            fontStyle: 'italic',
        },
        cardMetaRow: {
            flexDirection: 'row',
            gap: Spacing.sm,
        },
        cardMetaBadge: {
            backgroundColor: Colors.primary[100],
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            borderRadius: BorderRadius.sm,
        },
        cardMetaText: {
            fontSize: FontSize.xs,
            color: Colors.primary[700],
            fontWeight: FontWeight.medium,
            textTransform: 'capitalize',
        },
        favoriteButton: {
            marginTop: Spacing.lg,
        },
        cardNavigation: {
            flexDirection: 'row',
            gap: Spacing.md,
            marginTop: Spacing.xl,
            width: '100%',
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
        nextNavButton: {
            backgroundColor: Colors.primary[500],
        },
        nextNavButtonText: {
            color: Colors.white,
        },
        quizProgress: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: Spacing.lg,
        },
        quizProgressText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
        },
        quizScoreText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.primary[500],
        },
        quizCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.xl,
            padding: Spacing.xl,
            alignItems: 'center',
            marginBottom: Spacing.lg,
        },
        quizLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.sm,
        },
        quizGerman: {
            fontSize: FontSize['2xl'],
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            textAlign: 'center',
            marginBottom: Spacing.sm,
        },
        quizLiteral: {
            fontSize: FontSize.md,
            color: theme.text.tertiary,
            fontStyle: 'italic',
        },
        quizOptions: {
            gap: Spacing.sm,
            marginBottom: Spacing.lg,
        },
        quizOption: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            borderWidth: 2,
            borderColor: 'transparent',
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
            fontSize: FontSize.md,
            color: theme.text.primary,
        },
        quizNextButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.md,
            gap: Spacing.xs,
        },
        quizNextButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
    });

export default IdiomsSlangScreen;
