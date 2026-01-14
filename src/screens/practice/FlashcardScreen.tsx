import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeArea, Button } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, FontWeight } from '../../theme';
import { useFlashcardStore, useUserStore } from '../../store';
import { Flashcard } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { speak } from '../../services/audioService';
import { generateFlashcards } from '../../services/geminiService';
import { A1_VOCABULARY } from '../../data/content/vocabulary-comprehensive';

const { width } = Dimensions.get('window');

const SUGGESTED_TOPICS = [
    { label: 'Travel', icon: 'airplane-outline' },
    { label: 'Food', icon: 'restaurant-outline' },
    { label: 'Work', icon: 'briefcase-outline' },
    { label: 'Slang', icon: 'chatbubbles-outline' },
    { label: 'Nature', icon: 'leaf-outline' },
    { label: 'Family', icon: 'people-outline' },
    { label: 'Hobbies', icon: 'game-controller-outline' },
    { label: 'City', icon: 'business-outline' },
];

export const FlashcardScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { deck, dueCards, getDueCards, reviewCard, initializeDeck, initialized, resetDeck } = useFlashcardStore();
    const { addXP, progress } = useUserStore();

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;

    // Clear Deck State
    const [showClearModal, setShowClearModal] = useState(false);

    // AI Generation State
    const [showGenModal, setShowGenModal] = useState(false);
    const [genTopic, setGenTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [genStatus, setGenStatus] = useState<string | null>(null);
    const [hasDismissedGen, setHasDismissedGen] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);

    // Sync session cards when dueCards changes (only if we don't have a session or just generated)
    useEffect(() => {
        if (dueCards.length > 0 && sessionCards.length === 0 && !isFinished) {
            setSessionCards(dueCards);
        }
    }, [dueCards, isFinished]);

    // Auto-open modal when deck is empty
    useEffect(() => {
        // Start with clean sheet
        getDueCards();

        if (dueCards.length === 0 && !isGenerating && !showGenModal && !showClearModal && !hasDismissedGen) {
            const timer = setTimeout(() => {
                setShowGenModal(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [initialized, initializeDeck, getDueCards, dueCards.length, isGenerating, showGenModal, showClearModal, hasDismissedGen]);

    const currentCard = sessionCards[currentCardIndex];

    const handleSpeak = async () => {
        if (currentCard?.front) {
            await speak(currentCard.front);
        }
    };

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

    const handleNext = () => {
        // Record review
        if (currentCard) {
            reviewCard(currentCard.id, 'good');
            addXP(5);
        }

        if (currentCardIndex < sessionCards.length - 1) {
            // Reset flip first
            flipAnim.setValue(0);
            setIsFlipped(false);
            setCurrentCardIndex(prev => prev + 1);
        } else {
            // End of deck session
            setIsFinished(true);
        }
    };

    const handleGenerateMore = () => {
        setIsFinished(false);
        setShowGenModal(true);
    };

    const handlePrev = () => {
        if (currentCardIndex > 0) {
            flipAnim.setValue(0);
            setIsFlipped(false);
            setCurrentCardIndex(prev => prev - 1);
        }
    };

    const confirmClearDeck = () => {
        resetDeck();
        getDueCards();
        setSessionCards([]);
        setHasDismissedGen(false);
        setShowClearModal(false);
    };

    const handleGenerateCards = async () => {
        const topicToUse = genTopic.trim();
        if (!topicToUse) return;

        setIsGenerating(true);
        setGenStatus(null);

        try {
            const count = 10;
            const newWords = await generateFlashcards(progress.level || 'A1', topicToUse, count);

            if (newWords.length > 0) {
                initializeDeck(newWords);
                setCurrentCardIndex(0);
                setIsFinished(false);
                setSessionCards([]); // Clear session to trigger re-sync with new dueCards
                getDueCards();
                addXP(newWords.length * 2);
                setGenStatus(`Success! Added ${newWords.length} cards.`);

                setTimeout(() => {
                    setShowGenModal(false);
                    setGenTopic('');
                    setGenStatus(null);
                }, 1500);
            } else {
                setGenStatus('Could not generate. Try again.');
            }
        } catch (error) {
            console.error(error);
            setGenStatus('Error generating cards.');
        } finally {
            setIsGenerating(false);
        }
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

    const styles = getStyles(theme);

    const renderClearModal = () => (
        <Modal
            visible={showClearModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowClearModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { maxWidth: 320 }]}>
                    <View style={{ alignItems: 'center', marginBottom: Spacing.lg }}>
                        <View style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: Colors.error[100],
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: Spacing.md
                        }}>
                            <Ionicons name="trash-outline" size={24} color={Colors.error[500]} />
                        </View>
                        <Text style={styles.modalTitle}>Clear Deck?</Text>
                        <Text style={[styles.modalSubtitle, { textAlign: 'center', marginBottom: 0 }]}>
                            This will permanently delete all your current flashcards. This action cannot be undone.
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                        <TouchableOpacity
                            style={[styles.modalBtn, { backgroundColor: theme.background.secondary }]}
                            onPress={() => setShowClearModal(false)}
                        >
                            <Text style={[styles.modalBtnText, { color: theme.text.primary }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalBtn, { backgroundColor: Colors.error[500] }]}
                            onPress={confirmClearDeck}
                        >
                            <Text style={[styles.modalBtnText, { color: Colors.white }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderGenModal = () => (
        <Modal
            visible={showGenModal}
            transparent
            animationType="slide"
            onRequestClose={() => {
                if (!isGenerating) {
                    setShowGenModal(false);
                    setHasDismissedGen(true);
                }
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Create AI Flashcards</Text>
                        {!isGenerating && (
                            <TouchableOpacity onPress={() => {
                                setShowGenModal(false);
                                setHasDismissedGen(true);
                            }}>
                                <Ionicons name="close" size={24} color={theme.text.secondary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.modalSubtitle}>
                        What would you like to learn today?
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                        {SUGGESTED_TOPICS.map((topic) => {
                            const isSelected = genTopic === topic.label;
                            return (
                                <TouchableOpacity
                                    key={topic.label}
                                    style={[
                                        styles.chip,
                                        isSelected && styles.chipActive
                                    ]}
                                    onPress={() => setGenTopic(topic.label)}
                                    disabled={isGenerating}
                                >
                                    <Ionicons
                                        name={topic.icon as any}
                                        size={18}
                                        color={isSelected ? Colors.primary[700] : theme.text.secondary}
                                    />
                                    <Text style={[
                                        styles.chipText,
                                        isSelected && styles.chipTextActive
                                    ]}>{topic.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <TextInput
                        style={styles.input}
                        placeholder="Or type any topic (e.g. Space, History)..."
                        placeholderTextColor={theme.text.tertiary}
                        value={genTopic}
                        onChangeText={setGenTopic}
                        editable={!isGenerating}
                    />

                    {genStatus && (
                        <View style={styles.statusContainer}>
                            <Ionicons
                                name={genStatus.includes('Success') ? "checkmark-circle" : "alert-circle"}
                                size={20}
                                color={genStatus.includes('Success') ? Colors.success[500] : Colors.error[500]}
                            />
                            <Text style={[
                                styles.statusText,
                                { color: genStatus.includes('Success') ? Colors.success[500] : Colors.error[500] }
                            ]}>{genStatus}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.genButton, (!genTopic.trim() || isGenerating) && styles.genButtonDisabled]}
                        onPress={handleGenerateCards}
                        disabled={!genTopic.trim() || isGenerating}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <>
                                <Ionicons name="sparkles" size={20} color={Colors.white} />
                                <Text style={styles.genButtonText}>Generate Cards</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );

    if (dueCards.length === 0) {
        return (
            <SafeArea style={styles.container}>
                {renderGenModal()}
                {renderClearModal()}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Flashcards</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.emptyState}>
                    <Ionicons name="albums-outline" size={80} color={Colors.primary[300]} />
                    <Text style={styles.emptyTitle}>Deck is Empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Your flashcard deck is currently clean. Use AI to generate cards for topics you want to learn.
                    </Text>

                    <Button
                        title="✨ Generate AI Cards"
                        onPress={() => setShowGenModal(true)}
                        style={{ marginBottom: Spacing.md, width: '100%' }}
                    />

                    <TouchableOpacity
                        style={styles.actionButtonSecondary}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.actionButtonTextSecondary}>Back to Practice</Text>
                    </TouchableOpacity>
                </View>
            </SafeArea>
        );
    }

    if (isFinished) {
        return (
            <SafeArea style={styles.container}>
                {renderGenModal()}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Session Complete!</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.emptyState}>
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: Colors.success[100],
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: Spacing.xl
                    }}>
                        <Ionicons name="checkmark-circle" size={60} color={Colors.success[500]} />
                    </View>
                    <Text style={styles.emptyTitle}>Well Done!</Text>
                    <Text style={styles.emptySubtitle}>
                        You've completed all {sessionCards.length} flashcards in this session.
                    </Text>

                    <View style={styles.statusContainer}>
                        <Ionicons name="star" size={20} color={Colors.primary[500]} />
                        <Text style={[styles.statusText, { color: Colors.primary[700] }]}>
                            +{sessionCards.length * 5} XP Earned
                        </Text>
                    </View>

                    <Button
                        title="✨ Generate More Cards"
                        onPress={handleGenerateMore}
                        style={{ marginTop: Spacing.xl, width: '100%' }}
                    />

                    <TouchableOpacity
                        style={styles.actionButtonSecondary}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.actionButtonTextSecondary}>Back to Practice</Text>
                    </TouchableOpacity>
                </View>
            </SafeArea>
        );
    }

    return (
        <SafeArea style={styles.container}>
            {renderGenModal()}
            {renderClearModal()}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{currentCardIndex + 1} / {sessionCards.length}</Text>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity onPress={() => setShowClearModal(true)} style={styles.headerButton}>
                        <Ionicons name="trash-outline" size={24} color={Colors.error[500]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowGenModal(true)} style={styles.headerButton}>
                        <Ionicons name="sparkles-outline" size={24} color={Colors.primary[500]} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.cardContainer}>
                <TouchableOpacity activeOpacity={0.9} onPress={flipCard}>
                    <Animated.View style={[styles.card, frontAnimatedStyle, { backfaceVisibility: 'hidden', position: 'absolute', zIndex: isFlipped ? 0 : 1 }]}>
                        <TouchableOpacity
                            style={styles.audioButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleSpeak();
                            }}
                        >
                            <Ionicons name="volume-high" size={24} color={Colors.primary[500]} />
                        </TouchableOpacity>

                        <Text style={styles.cardLabel}>GERMAN</Text>
                        <Text style={styles.cardTextPrimary}>{currentCard?.front}</Text>
                        <Text style={styles.tapPrompt}>Tap to flip</Text>
                    </Animated.View>

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

            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={[styles.navBtn, currentCardIndex === 0 && styles.navBtnDisabled]}
                    onPress={handlePrev}
                    disabled={currentCardIndex === 0}
                >
                    <Ionicons name="arrow-back" size={24} color={currentCardIndex === 0 ? Colors.neutral[300] : Colors.primary[700]} />
                    <Text style={[styles.navBtnText, currentCardIndex === 0 && styles.navBtnTextDisabled]}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navBtnPrimary}
                    onPress={handleNext}
                >
                    <Text style={styles.navBtnTextPrimary}>{currentCardIndex === sessionCards.length - 1 ? 'Finish' : 'Next'}</Text>
                    <Ionicons name="arrow-forward" size={24} color={Colors.white} />
                </TouchableOpacity>
            </View>
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
        marginTop: -50,
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
        backgroundColor: theme.background.primary,
    },
    audioButton: {
        position: 'absolute',
        top: Spacing.lg,
        right: Spacing.lg,
        padding: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary[100],
        zIndex: 10,
    },
    cardLabel: {
        marginTop: Spacing.xl,
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
        gap: Spacing.md,
    },
    navBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background.primary,
        borderWidth: 1,
        borderColor: theme.border.light,
        gap: Spacing.xs,
        ...Shadows.sm,
    },
    navBtnDisabled: {
        opacity: 0.5,
        backgroundColor: theme.background.secondary,
    },
    navBtnText: {
        fontWeight: FontWeight.bold,
        fontSize: FontSize.md,
        color: Colors.primary[700],
    },
    navBtnTextDisabled: {
        color: Colors.neutral[300],
    },
    navBtnPrimary: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary[500],
        gap: Spacing.xs,
        ...Shadows.md,
    },
    navBtnTextPrimary: {
        fontWeight: FontWeight.bold,
        fontSize: FontSize.md,
        color: Colors.white,
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
        paddingHorizontal: Spacing.xl,
    },
    actionButtonSecondary: {
        marginTop: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    actionButtonTextSecondary: {
        color: theme.text.secondary,
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    modalContent: {
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        ...Shadows.lg,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    modalSubtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginBottom: Spacing.lg,
    },
    chipsScroll: {
        maxHeight: 50,
        marginBottom: Spacing.lg,
    },
    chip: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        backgroundColor: theme.background.secondary,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
        borderWidth: 1,
        borderColor: theme.border.light,
        height: 36,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    chipActive: {
        backgroundColor: Colors.primary[100],
        borderColor: Colors.primary[500],
    },
    chipText: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        fontWeight: FontWeight.medium,
    },
    chipTextActive: {
        color: Colors.primary[700],
        fontWeight: FontWeight.bold,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
        padding: Spacing.sm,
        backgroundColor: theme.background.secondary,
        borderRadius: BorderRadius.md,
    },
    statusText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    input: {
        backgroundColor: theme.background.secondary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        fontSize: FontSize.md,
        color: theme.text.primary,
        marginBottom: Spacing.lg,
    },
    genButton: {
        backgroundColor: Colors.primary[500],
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    genButtonDisabled: {
        backgroundColor: theme.background.tertiary,
    },
    genButtonText: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: FontSize.md,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBtnText: {
        fontWeight: FontWeight.bold,
        fontSize: FontSize.md,
    },
});
