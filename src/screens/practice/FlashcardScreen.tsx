import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeArea } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, FontWeight } from '../../theme';
import { useFlashcardStore, useUserStore } from '../../store';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

import { A1_VOCABULARY } from '../../data/content/vocabulary-comprehensive';

export const FlashcardScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { deck, dueCards, getDueCards, reviewCard, initializeDeck, initialized } = useFlashcardStore();
    const { addXP } = useUserStore();

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Seed deck if empty
        if (!initialized) {
            initializeDeck(A1_VOCABULARY);
        }
        getDueCards();
    }, [initialized, initializeDeck, getDueCards]);

    const currentCard = dueCards[currentCardIndex];

    const flipCard = () => {
        if (isFlipped) {
            Animated.spring(flipAnim, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(flipAnim, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        }
        setIsFlipped(!isFlipped);
    };

    const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
        if (!currentCard) return;

        reviewCard(currentCard.id, rating);

        // XP Reward
        if (rating === 'good' || rating === 'easy') {
            addXP(2);
        }

        // Reset flip
        flipAnim.setValue(0);
        setIsFlipped(false);

        // Move to next? 
        // Actually dueCards is updated in store, but the index might get messed up if the array shrinks.
        // It's better to stay at index 0 and let the list shrink?
        // Our store 'reviewCard' removes the card from 'dueCards'.
        // So 'dueCards' length decreases. We stay at index 0.
        // But we need to force re-render or let the store update propagate.
        // zustand updates should handle it.
    };

    const frontAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnim.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ],
    };

    const backAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnim.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['180deg', '360deg'],
                }),
            },
        ],
    };

    // Ref style to hide backface
    const styles = getStyles(theme);

    if (dueCards.length === 0) {
        return (
            <SafeArea style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Flashcards</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.emptyState}>
                    <Ionicons name="checkmark-circle-outline" size={80} color={Colors.success[500]} />
                    <Text style={styles.emptyTitle}>All caught up!</Text>
                    <Text style={styles.emptySubtitle}>You've reviewed all your due cards for today.</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.actionButtonText}>Back to Practice</Text>
                    </TouchableOpacity>
                </View>
            </SafeArea>
        );
    }

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reviewing {dueCards.length} cards</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.cardContainer}>
                <TouchableOpacity activeOpacity={0.9} onPress={flipCard}>
                    {/* Front Face */}
                    <Animated.View style={[styles.card, frontAnimatedStyle, { backfaceVisibility: 'hidden', position: 'absolute', zIndex: isFlipped ? 0 : 1 }]}>
                        <Text style={styles.cardLabel}>GERMAN</Text>
                        <Text style={styles.cardTextPrimary}>{currentCard?.front}</Text>
                        <Text style={styles.tapPrompt}>Tap to flip</Text>
                    </Animated.View>

                    {/* Back Face */}
                    <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backfaceVisibility: 'hidden', zIndex: isFlipped ? 1 : 0 }]}>
                        <Text style={styles.cardLabel}>ENGLISH</Text>
                        <Text style={styles.cardTextSecondary}>{currentCard?.back}</Text>

                        {currentCard?.example && (
                            <View style={styles.exampleContainer}>
                                <Text style={styles.exampleText}>{currentCard.example}</Text>
                                <Text style={styles.exampleTranslation}>{currentCard.exampleEn}</Text>
                            </View>
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>

            {/* Controls - Only show when flipped */}
            {isFlipped ? (
                <View style={styles.controlsContainer}>
                    <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: Colors.error[100] }]} onPress={() => handleRating('again')}>
                        <Text style={[styles.ratingLabel, { color: Colors.error[700] }]}>Again</Text>
                        <Text style={styles.ratingSub}>&lt; 1m</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: Colors.warning[100] }]} onPress={() => handleRating('hard')}>
                        <Text style={[styles.ratingLabel, { color: Colors.warning[700] }]}>Hard</Text>
                        <Text style={styles.ratingSub}>2d</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: Colors.success[100] }]} onPress={() => handleRating('good')}>
                        <Text style={[styles.ratingLabel, { color: Colors.success[700] }]}>Good</Text>
                        <Text style={styles.ratingSub}>3d</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: Colors.primary[100] }]} onPress={() => handleRating('easy')}>
                        <Text style={[styles.ratingLabel, { color: Colors.primary[700] }]}>Easy</Text>
                        <Text style={styles.ratingSub}>5d</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.controlsPlaceholder}>
                    <Text style={{ color: theme.text.tertiary }}>Tap card to see answer</Text>
                </View>
            )}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        zIndex: 10,
        elevation: 10,
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
        marginTop: -50, // Visual offset
    },
    card: {
        width: width - 64,
        height: 400,
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.lg,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    cardBack: {
        backgroundColor: theme.background.primary, // Could differ if desired
    },
    cardLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: theme.text.tertiary,
        marginBottom: Spacing.lg,
        letterSpacing: 1,
    },
    cardTextPrimary: {
        fontSize: FontSize['4xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        textAlign: 'center',
    },
    cardTextSecondary: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.medium,
        color: Colors.primary[500],
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    tapPrompt: {
        position: 'absolute',
        bottom: Spacing.lg,
        color: theme.text.tertiary,
        fontSize: FontSize.sm,
    },
    exampleContainer: {
        marginTop: Spacing.lg,
        padding: Spacing.md,
        backgroundColor: theme.background.secondary,
        borderRadius: BorderRadius.md,
        width: '100%',
    },
    exampleText: {
        fontSize: FontSize.md,
        color: theme.text.primary,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    exampleTranslation: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        textAlign: 'center',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        paddingBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    controlsPlaceholder: {
        height: 100, // Match controls height
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: Spacing.xl,
    },
    ratingBtn: {
        flex: 1,
        paddingVertical: Spacing.md,
        paddingHorizontal: 4,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingLabel: {
        fontWeight: FontWeight.bold,
        fontSize: FontSize.sm,
        marginBottom: 2,
    },
    ratingSub: {
        fontSize: FontSize.xs,
        opacity: 0.7,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyTitle: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: FontSize.md,
        color: theme.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing['2xl'],
    },
    actionButton: {
        backgroundColor: Colors.primary[500],
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.full,
    },
    actionButtonText: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: FontSize.md,
    },
});
