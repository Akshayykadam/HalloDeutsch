import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    TextInput,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as audioService from '../../services/audioService';
import { SafeArea, Button, Badge } from '../../components/ui';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Spacing, FontSize, BorderRadius, FontWeight } from '../../theme';
import { generateStory } from '../../services/geminiService';
import { useUserStore, useStoryStore, SavedStory } from '../../store';
import { CEFRLevel } from '../../types';
import { haptics } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LEVEL_NAMES: Record<string, string> = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Advanced',
};

const SUGGESTIONS = [
    { label: 'Travel Adventure', icon: 'airplane-outline' as keyof typeof Ionicons.glyphMap },
    { label: 'Ordering Food', icon: 'restaurant-outline' as keyof typeof Ionicons.glyphMap },
    { label: 'Meeting a Friend', icon: 'people-outline' as keyof typeof Ionicons.glyphMap },
    { label: 'Job Interview', icon: 'briefcase-outline' as keyof typeof Ionicons.glyphMap },
    { label: 'At the Market', icon: 'cart-outline' as keyof typeof Ionicons.glyphMap },
    { label: 'Weekend Plans', icon: 'calendar-outline' as keyof typeof Ionicons.glyphMap },
];

export const StoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const { progress: userProgress } = useUserStore();
    const { addStory, removeStory, isSaved, stories } = useStoryStore();

    // State
    const [loading, setLoading] = useState(false);
    const [story, setStory] = useState<{
        title: string;
        content: string;
        translation: string;
        vocabulary: Array<{ word: string; translation: string }>;
    } | null>(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [topic, setTopic] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(userProgress.level);
    const [showSetup, setShowSetup] = useState(true);
    const [showLibrary, setShowLibrary] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const dotAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
        return () => { audioService.stopAudio(); };
    }, []);

    // Loading dots animation
    useEffect(() => {
        if (loading) {
            const anims = dotAnims.map((dot, i) =>
                Animated.loop(
                    Animated.sequence([
                        Animated.delay(i * 200),
                        Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
                        Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
                    ])
                )
            );
            anims.forEach(a => a.start());
            // Pulse animation for the quill
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        } else {
            dotAnims.forEach(d => d.setValue(0));
            pulseAnim.setValue(1);
        }
    }, [loading]);

    const handleSave = () => {
        if (!story) return;
        haptics.light();
        if (isSaved(story.title)) {
            const saved = stories.find(s => s.title === story.title);
            if (saved) removeStory(saved.id);
        } else {
            addStory({
                title: story.title,
                content: story.content,
                translation: story.translation,
                vocabulary: story.vocabulary,
                level: selectedLevel,
                topic: topic || story.title,
            });
        }
    };

    const loadSavedStory = (savedStory: SavedStory) => {
        haptics.selection();
        setStory({
            title: savedStory.title,
            content: savedStory.content,
            translation: savedStory.translation,
            vocabulary: savedStory.vocabulary,
        });
        setTopic(savedStory.topic);
        setSelectedLevel(savedStory.level);
        setShowLibrary(false);
        setShowSetup(false);
    };

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        haptics.medium();
        setLoading(true);
        setShowSetup(false);
        try {
            const data = await generateStory(selectedLevel, topic);
            setStory(data);
            haptics.success();
        } catch (error) {
            console.error(error);
            setShowSetup(true);
            haptics.error();
        } finally {
            setLoading(false);
        }
    };

    const handleNewStory = () => {
        haptics.light();
        setStory(null);
        setTopic('');
        setShowTranslation(false);
        setShowSetup(true);
    };

    const playStory = () => {
        haptics.light();
        if (story?.content) audioService.speak(story.content);
    };

    const levelGradients: Record<string, [string, string]> = {
        A1: [Colors.success[400], Colors.success[600]],
        A2: [Colors.primary[400], Colors.primary[600]],
        B1: ['#8B5CF6', '#6D28D9'],
        B2: [Colors.secondary[400], Colors.secondary[600]],
    };

    // ────── SETUP VIEW ──────
    const renderSetup = () => (
        <Animated.ScrollView
            contentContainerStyle={styles.setupContainer}
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
            {/* Hero Section */}
            <View style={styles.heroSection}>
                <LinearGradient
                    colors={isDark ? ['#1E1B4B', '#312E81'] : [Colors.primary[100], Colors.primary[200]]}
                    style={styles.heroGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.heroIconContainer}>
                        <LinearGradient
                            colors={[Colors.primary[500], Colors.primary[700]]}
                            style={styles.heroIconBg}
                        >
                            <Ionicons name="book" size={32} color={Colors.white} />
                        </LinearGradient>
                    </View>
                    <Text style={[styles.heroTitle, { color: isDark ? Colors.white : Colors.primary[900] }]}>
                        AI Story Generator
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : Colors.primary[700] }]}>
                        Create personalized German stories tailored to your level and interests
                    </Text>

                    {/* Decorative shapes */}
                    <View style={[styles.heroDeco1, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.1)' }]} />
                    <View style={[styles.heroDeco2, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.06)' }]} />
                </LinearGradient>
            </View>

            {/* Form Card — unified input + level */}
            <View style={[styles.formCard, { backgroundColor: theme.background.secondary }]}>
                {/* Topic Input */}
                <Text style={[styles.formLabel, { color: theme.text.primary }]}>
                    What's your story about?
                </Text>
                <View style={[styles.inputWrapper, {
                    backgroundColor: theme.background.tertiary,
                    borderColor: topic.trim() ? Colors.primary[500] : theme.border.light,
                }]}>
                    <TextInput
                        style={[styles.input, { color: theme.text.primary }]}
                        placeholder="A day at the beach, A lost cat..."
                        placeholderTextColor={theme.text.tertiary}
                        value={topic}
                        onChangeText={setTopic}
                        maxLength={50}
                    />
                    {topic.length > 0 && (
                        <TouchableOpacity onPress={() => setTopic('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close-circle" size={20} color={theme.text.tertiary} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Divider */}
                <View style={[styles.formDivider, { backgroundColor: theme.border.light }]} />

                {/* Level Selector */}
                <Text style={[styles.formLabel, { color: theme.text.primary }]}>
                    Difficulty Level
                </Text>
                <View style={styles.levelGrid2x2}>
                    {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => {
                        const isActive = selectedLevel === lvl;
                        return (
                            <TouchableOpacity
                                key={lvl}
                                onPress={() => { setSelectedLevel(lvl); haptics.selection(); }}
                                activeOpacity={0.7}
                                style={styles.levelGridItem}
                            >
                                {isActive ? (
                                    <LinearGradient
                                        colors={levelGradients[lvl]}
                                        style={styles.levelPillActive}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={styles.levelPillTextActive}>{LEVEL_NAMES[lvl]}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={[styles.levelPill, { borderColor: theme.border.medium }]}>
                                        <Text style={[styles.levelPillText, { color: theme.text.secondary }]}>{LEVEL_NAMES[lvl]}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
                style={[styles.generateButton, { opacity: topic.trim() ? 1 : 0.5 }]}
                onPress={handleGenerate}
                disabled={!topic.trim()}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[Colors.primary[500], Colors.primary[700]]}
                    style={styles.generateGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Ionicons name="sparkles" size={22} color={Colors.white} />
                    <Text style={styles.generateText}>Generate Story</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Suggestions */}
            <View style={styles.suggestionsSection}>
                <View style={styles.sectionLabelRow}>
                    <Ionicons name="bulb-outline" size={18} color={theme.text.tertiary} />
                    <Text style={[styles.suggestionsLabel, { color: theme.text.tertiary }]}>Quick Ideas</Text>
                </View>
                <View style={styles.suggestionsGrid}>
                    {SUGGESTIONS.map((s) => (
                        <TouchableOpacity
                            key={s.label}
                            style={[styles.suggestionPill, {
                                backgroundColor: topic === s.label
                                    ? (isDark ? 'rgba(99,102,241,0.2)' : Colors.primary[50])
                                    : theme.background.secondary,
                                borderColor: topic === s.label ? Colors.primary[500] : 'transparent',
                            }]}
                            onPress={() => { setTopic(s.label); haptics.selection(); }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={s.icon} size={15} color={topic === s.label ? Colors.primary[500] : theme.text.tertiary} />
                            <Text style={[styles.suggestionLabel, {
                                color: topic === s.label ? Colors.primary[500] : theme.text.secondary
                            }]}>{s.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Animated.ScrollView>
    );

    // ────── LOADING VIEW ──────
    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingIcon, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                    colors={[Colors.primary[500], Colors.primary[700]]}
                    style={styles.loadingIconGradient}
                >
                    <Ionicons name="pencil" size={36} color={Colors.white} />
                </LinearGradient>
            </Animated.View>
            <Text style={[styles.loadingTitle, { color: theme.text.primary }]}>Crafting your story...</Text>
            <Text style={[styles.loadingSubtext, { color: theme.text.tertiary }]}>
                Our AI is writing a {LEVEL_NAMES[selectedLevel] || selectedLevel} story about "{topic}"
            </Text>
            <View style={styles.loadingDots}>
                {dotAnims.map((dot, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: Colors.primary[500],
                                transform: [{ scale: dot.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }],
                                opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );

    // ────── STORY VIEW ──────
    const renderStory = () => (
        <ScrollView contentContainerStyle={styles.storyContainer}>
            {/* Story Title Card */}
            <LinearGradient
                colors={isDark ? ['#1E1B4B', '#312E81'] : [Colors.primary[50], Colors.primary[100]]}
                style={styles.storyTitleCard}
            >
                <Badge label={LEVEL_NAMES[selectedLevel] || selectedLevel} variant="level" level={selectedLevel} size="small" />
                <Text style={[styles.storyTitle, { color: isDark ? Colors.white : Colors.primary[900] }]}>
                    {story!.title}
                </Text>
                <View style={styles.storyMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="book-outline" size={14} color={isDark ? 'rgba(255,255,255,0.6)' : Colors.primary[600]} />
                        <Text style={[styles.metaText, { color: isDark ? 'rgba(255,255,255,0.6)' : Colors.primary[600] }]}>
                            {story!.vocabulary.length} words
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={isDark ? 'rgba(255,255,255,0.6)' : Colors.primary[600]} />
                        <Text style={[styles.metaText, { color: isDark ? 'rgba(255,255,255,0.6)' : Colors.primary[600] }]}>
                            {Math.ceil(story!.content.split(' ').length / 30)} min read
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Story Content */}
            <View style={[styles.storyCard, { backgroundColor: theme.background.secondary }]}>
                <Text style={[styles.storyText, { color: theme.text.primary }]}>{story!.content}</Text>
                <View style={[styles.storySpacer, { backgroundColor: theme.border.light }]} />
                <TouchableOpacity style={styles.listenRow} onPress={playStory} activeOpacity={0.7}>
                    <LinearGradient
                        colors={[Colors.primary[500], Colors.primary[600]]}
                        style={styles.listenIcon}
                    >
                        <Ionicons name="volume-high" size={16} color={Colors.white} />
                    </LinearGradient>
                    <Text style={[styles.listenText, { color: Colors.primary[500] }]}>Listen to story</Text>
                </TouchableOpacity>
            </View>

            {/* Translation Toggle */}
            <TouchableOpacity
                style={[styles.translationToggle, {
                    backgroundColor: showTranslation
                        ? (isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50])
                        : theme.background.secondary,
                }]}
                onPress={() => { setShowTranslation(!showTranslation); haptics.selection(); }}
                activeOpacity={0.7}
            >
                <View style={styles.translationToggleLeft}>
                    <Ionicons
                        name="language"
                        size={20}
                        color={showTranslation ? Colors.primary[500] : theme.text.tertiary}
                    />
                    <Text style={[styles.translationToggleText, {
                        color: showTranslation ? Colors.primary[500] : theme.text.secondary
                    }]}>
                        {showTranslation ? 'Hide Translation' : 'Show Translation'}
                    </Text>
                </View>
                <Ionicons
                    name={showTranslation ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={showTranslation ? Colors.primary[500] : theme.text.tertiary}
                />
            </TouchableOpacity>

            {showTranslation && (
                <View style={[styles.translationBox, { backgroundColor: theme.background.tertiary }]}>
                    <Text style={[styles.translationText, { color: theme.text.secondary }]}>
                        {story!.translation}
                    </Text>
                </View>
            )}

            {/* Vocabulary Section */}
            <View style={[styles.sectionLabelRow, { marginBottom: Spacing.md }]}>
                <Ionicons name="library-outline" size={20} color={Colors.primary[500]} />
                <Text style={[styles.vocabHeader, { color: theme.text.primary }]}>Key Vocabulary</Text>
            </View>
            <View style={styles.vocabList}>
                {story!.vocabulary.map((item, index) => (
                    <View
                        key={index}
                        style={[styles.vocabCard, { backgroundColor: theme.background.secondary }]}
                    >
                        <View style={[styles.vocabIndex, { backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50] }]}>
                            <Text style={[styles.vocabIndexText, { color: Colors.primary[500] }]}>{index + 1}</Text>
                        </View>
                        <View style={styles.vocabContent}>
                            <Text style={[styles.vocabWord, { color: theme.text.primary }]}>{item.word}</Text>
                            <Text style={[styles.vocabTrans, { color: theme.text.tertiary }]}>{item.translation}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.background.secondary }]}
                    onPress={handleNewStory}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add-circle-outline" size={20} color={Colors.primary[500]} />
                    <Text style={[styles.actionBtnText, { color: Colors.primary[500] }]}>New Story</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.background.secondary }]}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="checkmark-circle-outline" size={20} color={Colors.success[500]} />
                    <Text style={[styles.actionBtnText, { color: Colors.success[500] }]}>Done</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    // ────── LIBRARY VIEW ──────
    const renderLibrary = () => (
        <ScrollView contentContainerStyle={styles.libraryContainer}>
            <View style={[styles.sectionLabelRow, { marginBottom: Spacing.lg }]}>
                <Ionicons name="bookmarks-outline" size={22} color={Colors.primary[500]} />
                <Text style={[styles.libTitle, { color: theme.text.primary }]}>Your Library</Text>
            </View>
            {stories.length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={[styles.emptyIcon, { backgroundColor: theme.background.secondary }]}>
                        <Ionicons name="bookmarks-outline" size={40} color={theme.text.tertiary} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>No saved stories yet</Text>
                    <Text style={[styles.emptySubtext, { color: theme.text.secondary }]}>
                        Stories you save will appear here
                    </Text>
                    <Button
                        title="Create Your First Story"
                        onPress={() => setShowLibrary(false)}
                        variant="primary"
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            ) : (
                stories.map((s) => (
                    <TouchableOpacity
                        key={s.id}
                        style={[styles.libCard, { backgroundColor: theme.background.secondary }]}
                        onPress={() => loadSavedStory(s)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.libCardLeft}>
                            <LinearGradient
                                colors={levelGradients[s.level] || [Colors.primary[400], Colors.primary[600]]}
                                style={styles.libCardBadge}
                            >
                                <Text style={styles.libCardLevel}>{LEVEL_NAMES[s.level] || s.level}</Text>
                            </LinearGradient>
                        </View>
                        <View style={styles.libCardRight}>
                            <Text style={[styles.libCardTitle, { color: theme.text.primary }]} numberOfLines={1}>
                                {s.title}
                            </Text>
                            <Text style={[styles.libCardMeta, { color: theme.text.tertiary }]} numberOfLines={1}>
                                {s.topic} • {new Date(s.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.text.tertiary} />
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );

    return (
        <SafeArea style={[styles.container, { backgroundColor: theme.background.primary }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => showLibrary ? setShowLibrary(false) : navigation.goBack()}
                    style={styles.backBtn}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={22} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
                    {showLibrary ? 'Library' : (story ? 'Story Time' : 'New Story')}
                </Text>
                <View style={styles.headerRight}>
                    {!showLibrary && !story && (
                        <TouchableOpacity
                            onPress={() => setShowLibrary(true)}
                            style={[styles.headerBtn, { backgroundColor: theme.background.secondary }]}
                        >
                            <Ionicons name="library-outline" size={20} color={theme.text.primary} />
                        </TouchableOpacity>
                    )}
                    {story && !showLibrary && (
                        <>
                            <TouchableOpacity
                                onPress={handleSave}
                                style={[styles.headerBtn, {
                                    backgroundColor: isSaved(story.title)
                                        ? (isDark ? 'rgba(99,102,241,0.2)' : Colors.primary[50])
                                        : theme.background.secondary,
                                }]}
                            >
                                <Ionicons
                                    name={isSaved(story.title) ? 'bookmark' : 'bookmark-outline'}
                                    size={20}
                                    color={isSaved(story.title) ? Colors.primary[500] : theme.text.primary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleNewStory}
                                style={[styles.headerBtn, { backgroundColor: theme.background.secondary }]}
                            >
                                <Ionicons name="add" size={20} color={theme.text.primary} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {showLibrary ? renderLibrary() : loading ? renderLoading() : !story ? renderSetup() : renderStory()}
        </SafeArea>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    backBtn: { padding: Spacing.xs },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    headerRight: { flexDirection: 'row', gap: Spacing.sm },
    headerBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Setup
    setupContainer: { padding: Spacing.base },

    // Hero
    heroSection: { marginBottom: Spacing.xl },
    heroGradient: {
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.xl,
        alignItems: 'center',
        overflow: 'hidden',
    },
    heroIconContainer: { marginBottom: Spacing.md },
    heroIconBg: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: { fontSize: 24, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
    heroSubtitle: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 20 },
    heroDeco1: { position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50 },
    heroDeco2: { position: 'absolute', bottom: -30, left: -15, width: 80, height: 80, borderRadius: 40 },

    // Input
    inputSection: { marginBottom: Spacing.lg },
    sectionLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
    sectionLabelRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.sm, marginBottom: Spacing.sm },
    formCard: {
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    formLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.sm,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.5,
        opacity: 0.7,
    },
    formDivider: {
        height: 1,
        marginVertical: Spacing.lg,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderWidth: 1.5,
    },
    input: { flex: 1, fontSize: FontSize.md, paddingVertical: Spacing.md },

    // Level
    levelSection: { marginBottom: Spacing.xl },
    levelGrid: { flexDirection: 'row', gap: Spacing.sm },
    levelGrid2x2: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    levelGridItem: { width: '48%' },
    levelPills: { flexDirection: 'row', gap: Spacing.sm },
    levelPill: {
        borderWidth: 1.5,
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.md + 2,
        alignItems: 'center',
    },
    levelPillActive: {
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.md + 2,
        alignItems: 'center',
    },
    levelPillText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    levelPillTextActive: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.white },
    levelCard: { flex: 1, borderRadius: BorderRadius.lg, overflow: 'hidden' },
    levelCardGradient: { padding: Spacing.md, alignItems: 'center' },
    levelCardInner: { padding: Spacing.md, alignItems: 'center' },
    levelCardText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    levelCardTextActive: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.white },
    levelCardDesc: { fontSize: 10, marginTop: 2 },
    levelCardDescActive: { fontSize: 10, marginTop: 2, color: 'rgba(255,255,255,0.8)' },

    // Generate Button
    generateButton: { marginBottom: Spacing.xl },
    generateGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.md + 2,
        borderRadius: BorderRadius.lg,
    },
    generateText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },

    // Suggestions
    suggestionsSection: { marginBottom: Spacing['2xl'] },
    suggestionsLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.md,
    },
    suggestionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    suggestionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
    },
    suggestionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },

    // Loading
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    loadingIcon: { marginBottom: Spacing.lg },
    loadingIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
    loadingSubtext: { fontSize: FontSize.sm, textAlign: 'center', maxWidth: 260, lineHeight: 20 },
    loadingDots: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
    dot: { width: 10, height: 10, borderRadius: 5 },

    // Story View
    storyContainer: { padding: Spacing.base },
    storyTitleCard: {
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.xl,
        marginBottom: Spacing.md,
        alignItems: 'flex-start',
    },
    storyTitle: { fontSize: 22, fontWeight: FontWeight.bold, marginTop: Spacing.sm, marginBottom: Spacing.sm },
    storyMeta: { flexDirection: 'row', gap: Spacing.lg },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: FontSize.xs },
    storyCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md },
    storyText: { fontSize: FontSize.base + 1, lineHeight: 28 },
    storySpacer: { height: 1, marginVertical: Spacing.md },
    listenRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    listenIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listenText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },

    // Translation
    translationToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    translationToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    translationToggleText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
    translationBox: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.xl,
    },
    translationText: { fontSize: FontSize.md, lineHeight: 24, fontStyle: 'italic' },

    // Vocabulary
    vocabHeader: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.md },
    vocabList: { gap: Spacing.sm, marginBottom: Spacing.xl },
    vocabCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.md,
    },
    vocabIndex: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vocabIndexText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    vocabContent: { flex: 1 },
    vocabWord: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    vocabTrans: { fontSize: FontSize.sm, marginTop: 1 },

    // Bottom Actions
    bottomActions: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing['3xl'] },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    actionBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },

    // Library
    libraryContainer: { padding: Spacing.base },
    libTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: Spacing.lg },
    emptyState: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
    emptySubtext: { fontSize: FontSize.sm, textAlign: 'center' },
    libCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
        gap: Spacing.md,
    },
    libCardLeft: {},
    libCardBadge: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    libCardLevel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.white },
    libCardRight: { flex: 1 },
    libCardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
    libCardMeta: { fontSize: FontSize.xs, marginTop: 2 },
});
