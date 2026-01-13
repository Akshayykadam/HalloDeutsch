import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as audioService from '../../services/audioService';
import { SafeArea, Button, Card, Badge } from '../../components/ui';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Spacing, FontSize, BorderRadius, FontWeight } from '../../theme';
import { generateStory } from '../../services/geminiService';
import { useUserStore, useStoryStore, SavedStory } from '../../store';
import { CEFRLevel } from '../../types';

export const StoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
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

    // Stop audio when leaving the screen
    useEffect(() => {
        return () => {
            audioService.stopAudio();
        };
    }, []);

    const handleSave = () => {
        if (!story) return;

        if (isSaved(story.title)) {
            // Find id to remove
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

        setLoading(true);
        setShowSetup(false);
        try {
            const data = await generateStory(selectedLevel, topic);
            setStory(data);
        } catch (error) {
            console.error(error);
            // Handle error (maybe show toast)
            setShowSetup(true);
        } finally {
            setLoading(false);
        }
    };

    const handleNewStory = () => {
        setStory(null);
        setTopic('');
        setShowTranslation(false);
        setShowSetup(true);
    };

    const playStory = () => {
        if (story?.content) {
            audioService.speak(story.content);
        }
    };

    const renderSetup = () => (
        <ScrollView contentContainerStyle={styles.setupContainer}>
            <View style={styles.setupHeader}>
                <Ionicons name="book-outline" size={48} color={Colors.primary[500]} />
                <Text style={[styles.setupTitle, { color: theme.text.primary }]}>Interactive Stories</Text>
                <Text style={[styles.setupSubtitle, { color: theme.text.secondary }]}>
                    Generate a unique German story sourced by AI based on your interests.
                </Text>
            </View>

            <View style={[styles.formSection, { backgroundColor: theme.background.secondary }]}>
                <Text style={[styles.label, { color: theme.text.primary }]}>What should the story be about?</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.background.tertiary,
                        color: theme.text.primary,
                        borderColor: theme.border.light
                    }]}
                    placeholder="e.g. A day at the beach, A lost cat, Buying groceries..."
                    placeholderTextColor={theme.text.tertiary}
                    value={topic}
                    onChangeText={setTopic}
                    maxLength={50}
                />

                <Text style={[styles.label, { color: theme.text.primary, marginTop: Spacing.lg }]}>Difficulty Level</Text>
                <View style={styles.levelSelector}>
                    {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => (
                        <TouchableOpacity
                            key={lvl}
                            style={[
                                styles.levelChip,
                                selectedLevel === lvl && styles.levelChipActive,
                                { borderColor: selectedLevel === lvl ? Colors.primary[500] : theme.border.medium }
                            ]}
                            onPress={() => setSelectedLevel(lvl)}
                        >
                            <Text style={[
                                styles.levelText,
                                selectedLevel === lvl && styles.levelTextActive,
                                { color: selectedLevel === lvl ? Colors.primary[500] : theme.text.secondary }
                            ]}>{lvl}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Button
                title="Generate Story"
                onPress={handleGenerate}
                disabled={!topic.trim()}
                loading={loading}
                variant="primary"
                size="large"
                style={{ marginTop: Spacing.xl }}
            />

            <View style={styles.suggestionsContainer}>
                <Text style={[styles.suggestionsTitle, { color: theme.text.tertiary }]}>Or try these:</Text>
                <View style={styles.chipRow}>
                    {['Travel Adventure', 'Ordering Food', 'Meeting a Friend', 'Job Interview'].map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.suggestionChip, { backgroundColor: theme.background.secondary }]}
                            onPress={() => setTopic(t)}
                        >
                            <Text style={[styles.suggestionText, { color: theme.text.secondary }]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );

    const renderLibrary = () => (
        <ScrollView contentContainerStyle={styles.libraryContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Saved Stories</Text>
            {stories.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="bookmarks-outline" size={48} color={theme.text.tertiary} />
                    <Text style={[styles.emptyText, { color: theme.text.secondary }]}>No saved stories yet.</Text>
                    <Button
                        title="Create New Story"
                        onPress={() => setShowLibrary(false)}
                        variant="primary"
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            ) : (
                stories.map((s) => (
                    <TouchableOpacity
                        key={s.id}
                        style={[styles.libraryCard, { backgroundColor: theme.background.secondary }]}
                        onPress={() => loadSavedStory(s)}
                    >
                        <View style={styles.libraryCardHeader}>
                            <Text style={[styles.libraryTitle, { color: theme.text.primary }]}>{s.title}</Text>
                            <Badge label={s.level} variant="level" level={s.level} size="small" />
                        </View>
                        <Text style={[styles.libraryTopic, { color: theme.text.secondary }]} numberOfLines={1}>
                            {s.topic} • {new Date(s.createdAt).toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );

    return (
        <SafeArea style={[styles.container, { backgroundColor: theme.background.primary }]}>
            <View style={[styles.header, { borderBottomColor: theme.border.light }]}>
                <TouchableOpacity onPress={() => showLibrary ? setShowLibrary(false) : navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
                    {showLibrary ? 'Library' : (story ? 'Story Time' : 'New Story')}
                </Text>
                <View style={styles.headerActions}>
                    {!showLibrary && !story && (
                        <TouchableOpacity onPress={() => setShowLibrary(true)} style={styles.headerIcon}>
                            <Ionicons name="library-outline" size={24} color={theme.text.primary} />
                        </TouchableOpacity>
                    )}
                    {story && !showLibrary && (
                        <>
                            <TouchableOpacity onPress={handleSave} style={styles.headerIcon}>
                                <Ionicons
                                    name={isSaved(story.title) ? "bookmark" : "bookmark-outline"}
                                    size={24}
                                    color={Colors.primary[500]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNewStory} style={styles.headerIcon}>
                                <Ionicons name="add-circle-outline" size={24} color={theme.text.primary} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {showLibrary ? renderLibrary() : loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                    <Text style={[styles.loadingText, { color: theme.text.secondary }]}>Writing your story...</Text>
                </View>
            ) : !story ? (
                renderSetup()
            ) : (
                <ScrollView contentContainerStyle={styles.storyContent}>
                    <Text style={[styles.storyTitle, { color: Colors.primary[500] }]}>{story.title}</Text>

                    <View style={[styles.storyCard, { backgroundColor: theme.background.secondary }]}>
                        <Text style={[styles.storyText, { color: theme.text.primary }]}>{story.content}</Text>
                        <TouchableOpacity style={styles.speakerButton} onPress={playStory}>
                            <Ionicons name="volume-high" size={20} color={Colors.primary[500]} />
                            <Text style={[styles.speakerText, { color: Colors.primary[500] }]}>Listen</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.translateToggle, { borderColor: theme.border.medium }]}
                        onPress={() => setShowTranslation(!showTranslation)}
                    >
                        <Text style={[styles.translateText, { color: theme.text.secondary }]}>
                            {showTranslation ? 'Hide Translation' : 'Show Translation'}
                        </Text>
                        <Ionicons name={showTranslation ? "chevron-up" : "chevron-down"} size={16} color={theme.text.secondary} />
                    </TouchableOpacity>

                    {showTranslation && (
                        <View style={[styles.translationContainer, { backgroundColor: theme.background.tertiary }]}>
                            <Text style={[styles.translationContent, { color: theme.text.secondary }]}>
                                {story.translation}
                            </Text>
                        </View>
                    )}

                    <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Key Vocabulary</Text>
                    <View style={styles.vocabGrid}>
                        {story.vocabulary.map((item, index) => (
                            <View key={index} style={[styles.vocabItem, { backgroundColor: theme.background.secondary }]}>
                                <Text style={[styles.vocabWord, { color: theme.text.primary }]}>{item.word}</Text>
                                <Text style={[styles.vocabTrans, { color: theme.text.tertiary }]}>{item.translation}</Text>
                            </View>
                        ))}
                    </View>

                    <Button
                        title="Finish Story"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                        style={{ marginTop: Spacing.xl, marginBottom: Spacing['2xl'] }}
                    />
                </ScrollView>
            )}
        </SafeArea>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    setupContainer: {
        padding: Spacing.lg,
    },
    setupHeader: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    setupTitle: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
    },
    setupSubtitle: {
        fontSize: FontSize.md,
        textAlign: 'center',
    },
    formSection: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        marginBottom: Spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSize.md,
    },
    levelSelector: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    levelChip: {
        flex: 1,
        borderWidth: 1,
        borderRadius: BorderRadius.full,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
    },
    levelChipActive: {
        backgroundColor: Colors.primary[50],
        borderColor: Colors.primary[500],
    },
    levelText: {
        fontWeight: FontWeight.bold,
        fontSize: FontSize.sm,
    },
    levelTextActive: {
        color: Colors.primary[500],
    },
    suggestionsContainer: {
        marginTop: Spacing['2xl'],
    },
    suggestionsTitle: {
        fontSize: FontSize.sm,
        marginBottom: Spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    suggestionChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    suggestionText: {
        fontSize: FontSize.sm,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: Spacing.md,
        fontSize: FontSize.md,
    },
    storyContent: {
        padding: Spacing.lg,
    },
    storyTitle: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    storyCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
    },
    storyText: {
        fontSize: FontSize.lg,
        lineHeight: 28,
        marginBottom: Spacing.md,
    },
    speakerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: Spacing.xs,
    },
    speakerText: {
        fontWeight: FontWeight.medium,
        fontSize: FontSize.sm,
    },
    translateToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    translateText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    translationContainer: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.xl,
    },
    translationContent: {
        fontSize: FontSize.md,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.md,
    },
    vocabGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    vocabItem: {
        width: '48%',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    vocabWord: {
        fontWeight: FontWeight.bold,
        fontSize: FontSize.md,
        marginBottom: 2,
    },
    vocabTrans: {
        fontSize: FontSize.sm,
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    headerIcon: {
        padding: 4,
    },
    libraryContainer: {
        padding: Spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing['4xl'],
        gap: Spacing.md,
    },
    emptyText: {
        fontSize: FontSize.md,
        textAlign: 'center',
    },
    libraryCard: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
    },
    libraryCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    libraryTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        flex: 1,
        marginRight: Spacing.sm,
    },
    libraryTopic: {
        fontSize: FontSize.sm,
    },
});
