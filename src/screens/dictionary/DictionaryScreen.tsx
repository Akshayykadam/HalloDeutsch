// Dictionary Screen - AI-powered German dictionary by level
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { Card, Badge, Button, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { CEFRLevel } from '../../types';
import { Config, Models } from '../../config';
import { GoogleGenAI } from '@google/genai';

// Initialize AI
const ai = new GoogleGenAI({ apiKey: Config.GEMINI_API_KEY });

interface DictionaryEntry {
    word: string;
    gender?: string;
    plural?: string;
    pronunciation: string;
    partOfSpeech: string;
    meanings: string[];
    examples: Array<{ german: string; english: string }>;
    synonyms?: string[];
    antonyms?: string[];
    relatedWords?: string[];
    conjugation?: Record<string, string>;
    level: CEFRLevel;
}

// Categorized word lists for browsing
const categorizedData: Record<CEFRLevel, Array<{ category: string; icon: string; words: string[] }>> = {
    A1: [
        {
            category: 'Essentials',
            icon: 'star',
            words: ['Hallo', 'Danke', 'Bitte', 'Ja', 'Nein', 'Guten Morgen', 'Entschuldigung']
        },
        {
            category: 'Common Adjectives',
            icon: 'color-palette',
            words: ['Gut', 'Schlecht', 'Groß', 'Klein', 'Schön', 'Neu', 'Kalt', 'Warm']
        },
        {
            category: 'Home & Living',
            icon: 'home',
            words: ['Haus', 'Tisch', 'Stuhl', 'Fenster', 'Tür', 'Bett', 'Küche', 'Bad']
        },
        {
            category: 'Food & Drink',
            icon: 'restaurant',
            words: ['Wasser', 'Essen', 'Trinken', 'Brot', 'Milch', 'Kaffee', 'Apfel']
        },
        {
            category: 'Actions',
            icon: 'walk',
            words: ['Gehen', 'Kommen', 'Laufen', 'Essen', 'Trinken', 'Schlafen', 'Sehen']
        },
        {
            category: 'Time',
            icon: 'time',
            words: ['Heute', 'Morgen', 'Gestern', 'Zeit', 'Tag', 'Nacht', 'Woche', 'Jahr']
        },
        {
            category: 'Places',
            icon: 'map',
            words: ['Stadt', 'Land', 'Schule', 'Arbeit', 'Park', 'Straße', 'Bahnhof']
        }
    ],
    A2: [
        {
            category: 'Communication',
            icon: 'chatbubbles',
            words: ['Erfahrung', 'Meinung', 'Frage', 'Antwort', 'Gespräch', 'Nachricht']
        },
        {
            category: 'Abstract',
            icon: 'bulb',
            words: ['Unterschied', 'Vorteil', 'Nachteil', 'Erfolg', 'Fehler', 'Problem']
        },
        {
            category: 'Work & Career',
            icon: 'briefcase',
            words: ['Beruf', 'Büro', 'Kollege', 'Chef', 'Gehalt', 'Bewerbung']
        }
    ],
    B1: [
        {
            category: 'Society',
            icon: 'people',
            words: ['Gesellschaft', 'Kultur', 'Bevölkerung', 'Bürger', 'Gemeinschaft']
        },
        {
            category: 'Technology',
            icon: 'hardware-chip',
            words: ['Wissenschaft', 'Technologie', 'Forschung', 'Entwicklung', 'Daten']
        },
        {
            category: 'Environment',
            icon: 'leaf',
            words: ['Umwelt', 'Klima', 'Natur', 'Schutz', 'Verschmutzung']
        }
    ],
    B2: [
        {
            category: 'Business & Law',
            icon: 'business',
            words: ['Zuständigkeit', 'Inanspruchnahme', 'Vertrag', 'Verhandlung', 'Gesetz']
        },
        {
            category: 'Academic',
            icon: 'school',
            words: ['Auseinandersetzung', 'Erörterung', 'Schlussfolgerung', 'Theorie', 'Argument']
        }
    ],
};

export const DictionaryScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { progress } = useUserStore();
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(progress.level);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [entry, setEntry] = useState<DictionaryEntry | null>(null);
    const [error, setError] = useState<string | null>(null);

    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

    const lookupWord = async (word: string) => {
        if (!word.trim()) return;

        setIsLoading(true);
        setError(null);
        setEntry(null);

        try {
            const prompt = `You are a German dictionary. Look up the German word "${word}".
      
      Provide a comprehensive dictionary entry in JSON format:
      {
        "word": "the word",
        "gender": "der/die/das (if noun)",
        "plural": "plural form (if noun)",
        "pronunciation": "phonetic pronunciation",
        "partOfSpeech": "noun/verb/adjective/etc",
        "meanings": ["meaning 1", "meaning 2"],
        "examples": [
          {"german": "Example sentence", "english": "Translation"}
        ],
        "synonyms": ["synonym1", "synonym2"],
        "relatedWords": ["related1", "related2"],
        "level": "A1/A2/B1/B2 (CEFR level)"
      }
      
      If the word is a verb, also include:
      "conjugation": {
        "ich": "conjugated form",
        "du": "...",
        "er/sie/es": "...",
        "wir": "...",
        "ihr": "...",
        "sie/Sie": "..."
      }
      
      Provide 2-3 example sentences appropriate for learners.
      Only respond with the JSON, no other text.`;

            const response = await ai.models.generateContent({
                model: Models.GEMMA,
                contents: prompt,
            });

            const text = response.text;
            if (!text) throw new Error('No response');

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('Invalid response format');

            const parsed = JSON.parse(jsonMatch[0]);
            setEntry(parsed as DictionaryEntry);
        } catch (err) {
            console.error('Dictionary lookup error:', err);
            setError('Could not find this word. Please try another.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeak = async () => {
        if (!entry) return;
        await audioService.stopAudio();
        await audioService.speak(entry.word);
    };

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
                    </TouchableOpacity>
                    <Ionicons name="book" size={24} color={Colors.primary[500]} />
                    <Text style={styles.headerTitle}>Dictionary</Text>
                </View>
                <Text style={styles.headerSubtitle}>Look up any German word</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color={Colors.neutral[400]} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter a German word..."
                        placeholderTextColor={Colors.neutral[400]}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.trim() === '') {
                                setEntry(null);
                                setError(null);
                            }
                        }}
                        onSubmitEditing={() => lookupWord(searchQuery)}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => {
                            setSearchQuery('');
                            setEntry(null);
                            setError(null);
                        }}>
                            <Ionicons name="close-circle" size={18} color={Colors.neutral[400]} style={styles.clearButton} />
                        </TouchableOpacity>
                    )}
                </View>
                <Button
                    title="Search"
                    onPress={() => lookupWord(searchQuery)}
                    size="medium"
                    disabled={isLoading || !searchQuery.trim()}
                />
            </View>

            {/* Level Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.levelTabs}
                contentContainerStyle={styles.levelTabsContent}
            >
                {levels.map((level) => (
                    <TouchableOpacity
                        key={level}
                        onPress={() => setSelectedLevel(level)}
                        style={[
                            styles.levelTab,
                            selectedLevel === level && styles.levelTabActive,
                        ]}
                    >
                        <Text style={[
                            styles.levelTabText,
                            selectedLevel === level && styles.levelTabTextActive,
                        ]}>
                            {level} Words
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Loading State */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary[500]} />
                        <Text style={styles.loadingText}>Looking up word...</Text>
                    </View>
                )}

                {/* Error State */}
                {error && (
                    <Card variant="flat" style={styles.errorCard}>
                        <Ionicons name="alert-circle" size={32} color={Colors.error[500]} style={{ marginBottom: 8 }} />
                        <Text style={styles.errorText}>{error}</Text>
                    </Card>
                )}

                {/* Dictionary Entry */}
                {entry && !isLoading && (
                    <Card style={styles.entryCard}>
                        <View style={styles.entryHeader}>
                            <View>
                                <View style={styles.wordRow}>
                                    {entry.gender && (
                                        <Text style={styles.gender}>{entry.gender}</Text>
                                    )}
                                    <Text style={styles.word}>{entry.word}</Text>
                                    <TouchableOpacity onPress={handleSpeak} style={{ marginLeft: 8 }}>
                                        <Ionicons name="volume-high" size={24} color={Colors.primary[500]} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.pronunciation}>[{entry.pronunciation}]</Text>
                            </View>
                            <Badge label={entry.level} variant="level" level={entry.level as CEFRLevel} />
                        </View>

                        <Badge label={entry.partOfSpeech} variant="default" size="small" />

                        {entry.plural && (
                            <Text style={styles.plural}>Plural: {entry.plural}</Text>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Meanings</Text>
                            {entry.meanings.map((meaning, idx) => (
                                <Text key={idx} style={styles.meaning}>• {meaning}</Text>
                            ))}
                        </View>

                        {entry.examples && entry.examples.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Examples</Text>
                                {entry.examples.map((ex, idx) => (
                                    <View key={idx} style={styles.example}>
                                        <Text style={styles.exampleGerman}>{ex.german}</Text>
                                        <Text style={styles.exampleEnglish}>{ex.english}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {entry.conjugation && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Conjugation (Present)</Text>
                                <View style={styles.conjugationGrid}>
                                    {Object.entries(entry.conjugation).map(([pronoun, form]) => (
                                        <View key={pronoun} style={styles.conjugationItem}>
                                            <Text style={styles.pronoun}>{pronoun}</Text>
                                            <Text style={styles.conjugatedForm}>{form}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {entry.synonyms && entry.synonyms.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Synonyms</Text>
                                <View style={styles.tagContainer}>
                                    {entry.synonyms.map((syn, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={styles.tag}
                                            onPress={() => {
                                                setSearchQuery(syn);
                                                lookupWord(syn);
                                            }}
                                        >
                                            <Text style={styles.tagText}>{syn}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {entry.relatedWords && entry.relatedWords.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Related Words</Text>
                                <View style={styles.tagContainer}>
                                    {entry.relatedWords.map((word, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={styles.tag}
                                            onPress={() => {
                                                setSearchQuery(word);
                                                lookupWord(word);
                                            }}
                                        >
                                            <Text style={styles.tagText}>{word}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </Card>
                )}

                {/* Word List for Selected Level */}
                {!entry && !isLoading && (
                    <>
                        <Text style={styles.browseTitle}>
                            Browse {selectedLevel} Vocabulary
                        </Text>
                        <View style={styles.categoriesContainer}>
                            {categorizedData[selectedLevel].map((category, catIdx) => (
                                <View key={catIdx} style={styles.categorySection}>
                                    <View style={styles.categoryHeader}>
                                        <View style={[styles.categoryIcon, { backgroundColor: Colors.primary[500] + '15' }]}>
                                            <Ionicons name={category.icon as any} size={18} color={Colors.primary[500]} />
                                        </View>
                                        <Text style={styles.categoryTitle}>{category.category}</Text>
                                    </View>
                                    <View style={styles.wordGrid}>
                                        {category.words.map((word, wordIdx) => (
                                            <TouchableOpacity
                                                key={wordIdx}
                                                style={styles.wordChip}
                                                onPress={() => {
                                                    setSearchQuery(word);
                                                    lookupWord(word);
                                                }}
                                            >
                                                <Text style={styles.wordChipText}>{word}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeArea>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    header: {
        padding: Spacing.base,
        paddingTop: Spacing.lg,
        backgroundColor: theme.background.primary,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        padding: Spacing.base,
        backgroundColor: theme.background.primary,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background.tertiary,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: FontSize.base,
        color: theme.text.primary,
        paddingVertical: Spacing.sm,
    },
    clearButton: {
        padding: Spacing.xs,
    },
    levelTabs: {
        flexGrow: 0,
        backgroundColor: theme.background.primary,
        marginBottom: Spacing.sm,
        maxHeight: 60,
    },
    levelTabsContent: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        paddingBottom: Spacing.xs,
    },
    levelTab: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        backgroundColor: theme.background.tertiary,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    levelTabActive: {
        backgroundColor: Colors.primary[50],
        borderColor: Colors.primary[500],
    },
    levelTabText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: theme.text.secondary,
    },
    levelTabTextActive: {
        color: Colors.primary[700],
        fontWeight: FontWeight.bold,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.base,
        paddingBottom: Spacing['3xl'],
    },
    loadingContainer: {
        alignItems: 'center',
        padding: Spacing['2xl'],
    },
    loadingText: {
        fontSize: FontSize.base,
        color: theme.text.secondary,
        marginTop: Spacing.md,
    },
    errorCard: {
        alignItems: 'center',
        padding: Spacing.lg,
    },
    errorText: {
        fontSize: FontSize.base,
        color: Colors.error[500],
    },
    entryCard: {
        marginBottom: Spacing.lg,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    wordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    gender: {
        fontSize: FontSize.lg,
        color: Colors.primary[500],
        fontWeight: FontWeight.medium,
    },
    word: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    pronunciation: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: Spacing.xs,
    },
    plural: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: Spacing.sm,
    },
    section: {
        marginTop: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: theme.text.tertiary,
        textTransform: 'uppercase',
        marginBottom: Spacing.sm,
    },
    meaning: {
        fontSize: FontSize.base,
        color: theme.text.primary,
        marginBottom: Spacing.xs,
        lineHeight: 22,
    },
    example: {
        backgroundColor: theme.background.tertiary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    // Category Styles
    categoriesContainer: {
        paddingBottom: Spacing.xl,
    },
    categorySection: {
        marginBottom: Spacing.xl,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    categoryIcon: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    categoryTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    exampleGerman: {
        fontSize: FontSize.base,
        color: theme.text.primary,
        fontStyle: 'italic',
        marginBottom: Spacing.xs,
    },
    exampleEnglish: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
    },
    conjugationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    conjugationItem: {
        backgroundColor: theme.background.tertiary,
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        minWidth: '30%',
    },
    pronoun: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
    },
    conjugatedForm: {
        fontSize: FontSize.base,
        color: theme.text.primary,
        fontWeight: FontWeight.medium,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    tag: {
        backgroundColor: Colors.primary[100],
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    tagText: {
        fontSize: FontSize.sm,
        color: Colors.primary[700],
    },
    browseTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.md,
    },
    wordGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    wordChip: {
        backgroundColor: theme.background.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
    },
    wordChipText: {
        fontSize: FontSize.sm,
        color: theme.text.primary,
    },
});
