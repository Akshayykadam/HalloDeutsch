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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { searchVocabulary } from '../../services/contentService';
import { Badge, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { CEFRLevel } from '../../types';
import { Config, Models } from '../../config';
import { GoogleGenAI } from '@google/genai';
import { haptics } from '../../utils/haptics';

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

const LEVEL_COLORS: Record<string, [string, string]> = {
    A1: [Colors.success[400], Colors.success[600]],
    A2: [Colors.primary[400], Colors.primary[600]],
    B1: ['#8B5CF6', '#6D28D9'],
    B2: [Colors.secondary[400], Colors.secondary[600]],
};

const LEVEL_LABELS: Record<string, string> = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Advanced',
};

// Categorized word lists for browsing
const categorizedData: Record<CEFRLevel, Array<{ category: string; icon: keyof typeof Ionicons.glyphMap; words: string[] }>> = {
    A1: [
        { category: 'Essentials', icon: 'star', words: ['Hallo', 'Danke', 'Bitte', 'Ja', 'Nein', 'Guten Morgen', 'Entschuldigung'] },
        { category: 'Common Adjectives', icon: 'color-palette', words: ['Gut', 'Schlecht', 'Groß', 'Klein', 'Schön', 'Neu', 'Kalt', 'Warm'] },
        { category: 'Home & Living', icon: 'home', words: ['Haus', 'Tisch', 'Stuhl', 'Fenster', 'Tür', 'Bett', 'Küche', 'Bad'] },
        { category: 'Food & Drink', icon: 'restaurant', words: ['Wasser', 'Essen', 'Trinken', 'Brot', 'Milch', 'Kaffee', 'Apfel'] },
        { category: 'Actions', icon: 'walk', words: ['Gehen', 'Kommen', 'Laufen', 'Essen', 'Trinken', 'Schlafen', 'Sehen'] },
        { category: 'Time', icon: 'time', words: ['Heute', 'Morgen', 'Gestern', 'Zeit', 'Tag', 'Nacht', 'Woche', 'Jahr'] },
        { category: 'Places', icon: 'map', words: ['Stadt', 'Land', 'Schule', 'Arbeit', 'Park', 'Straße', 'Bahnhof'] },
    ],
    A2: [
        { category: 'Communication', icon: 'chatbubbles', words: ['Erfahrung', 'Meinung', 'Frage', 'Antwort', 'Gespräch', 'Nachricht'] },
        { category: 'Abstract', icon: 'bulb', words: ['Unterschied', 'Vorteil', 'Nachteil', 'Erfolg', 'Fehler', 'Problem'] },
        { category: 'Work & Career', icon: 'briefcase', words: ['Beruf', 'Büro', 'Kollege', 'Chef', 'Gehalt', 'Bewerbung'] },
    ],
    B1: [
        { category: 'Society', icon: 'people', words: ['Gesellschaft', 'Kultur', 'Bevölkerung', 'Bürger', 'Gemeinschaft'] },
        { category: 'Technology', icon: 'hardware-chip', words: ['Wissenschaft', 'Technologie', 'Forschung', 'Entwicklung', 'Daten'] },
        { category: 'Environment', icon: 'leaf', words: ['Umwelt', 'Klima', 'Natur', 'Schutz', 'Verschmutzung'] },
    ],
    B2: [
        { category: 'Business & Law', icon: 'business', words: ['Zuständigkeit', 'Inanspruchnahme', 'Vertrag', 'Verhandlung', 'Gesetz'] },
        { category: 'Academic', icon: 'school', words: ['Auseinandersetzung', 'Erörterung', 'Schlussfolgerung', 'Theorie', 'Argument'] },
    ],
};

export const DictionaryScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const { progress } = useUserStore();
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(progress.level);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [entry, setEntry] = useState<DictionaryEntry | null>(null);
    const [error, setError] = useState<string | null>(null);

    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

    const lookupWord = async (query: string) => {
        if (!query.trim()) return;
        haptics.light();
        setIsLoading(true);
        setError(null);
        setEntry(null);

        try {
            const results = await searchVocabulary(query.trim());
            if (results && results.length > 0) {
                const exactMatch = results.find(w => w.german.toLowerCase() === query.trim().toLowerCase());
                const bestMatch = exactMatch || results[0];
                const dictEntry: DictionaryEntry = {
                    word: bestMatch.german,
                    // @ts-ignore
                    gender: bestMatch.gender,
                    // @ts-ignore
                    plural: bestMatch.plural,
                    pronunciation: bestMatch.pronunciation || '',
                    partOfSpeech: bestMatch.partOfSpeech,
                    // @ts-ignore
                    meanings: [bestMatch.english],
                    examples: [],
                    level: bestMatch.level as CEFRLevel,
                };
                setEntry(dictEntry);
                setIsLoading(false);
                return;
            }

            const prompt = `Define the German word "${query}". Look up the German word "${query}".
      
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
            haptics.success();
        } catch (err) {
            console.error('Dictionary lookup error:', err);
            setError('Could not find this word. Please try another.');
            haptics.error();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeak = async () => {
        if (!entry) return;
        haptics.light();
        await audioService.stopAudio();
        await audioService.speak(entry.word);
    };

    return (
        <SafeArea style={[styles.container, { backgroundColor: theme.background.primary }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Dictionary</Text>
                <View style={{ width: 36 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={[styles.searchBar, {
                    backgroundColor: theme.background.secondary,
                    borderColor: searchQuery.trim() ? Colors.primary[500] : 'transparent',
                }]}>
                    <Ionicons name="search" size={20} color={theme.text.tertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text.primary }]}
                        placeholder="Search a German word..."
                        placeholderTextColor={theme.text.tertiary}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.trim() === '') { setEntry(null); setError(null); }
                        }}
                        onSubmitEditing={() => lookupWord(searchQuery)}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); setEntry(null); setError(null); }}>
                            <Ionicons name="close-circle" size={20} color={theme.text.tertiary} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => lookupWord(searchQuery)}
                        disabled={!searchQuery.trim() || isLoading}
                        style={[styles.searchBtn, { opacity: searchQuery.trim() ? 1 : 0.4 }]}
                    >
                        <LinearGradient
                            colors={[Colors.primary[500], Colors.primary[600]]}
                            style={styles.searchBtnGradient}
                        >
                            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Level Tabs */}
            <View style={styles.tabsRow}>
                {levels.map((level) => {
                    const isActive = selectedLevel === level;
                    return (
                        <TouchableOpacity
                            key={level}
                            onPress={() => { setSelectedLevel(level); haptics.selection(); }}
                            style={{ flex: 1 }}
                            activeOpacity={0.7}
                        >
                            {isActive ? (
                                <LinearGradient
                                    colors={LEVEL_COLORS[level]}
                                    style={styles.tabActive}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.tabTextActive}>{LEVEL_LABELS[level]}</Text>
                                </LinearGradient>
                            ) : (
                                <View style={[styles.tab, { backgroundColor: theme.background.secondary }]}>
                                    <Text style={[styles.tabText, { color: theme.text.secondary }]}>{LEVEL_LABELS[level]}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentInner}
                showsVerticalScrollIndicator={false}
            >
                {/* Loading State */}
                {isLoading && (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color={Colors.primary[500]} />
                        <Text style={[styles.loadingText, { color: theme.text.secondary }]}>Looking up word...</Text>
                    </View>
                )}

                {/* Error State */}
                {error && (
                    <View style={[styles.errorBox, { backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : Colors.error[50] }]}>
                        <Ionicons name="alert-circle" size={24} color={Colors.error[500]} />
                        <Text style={[styles.errorText, { color: Colors.error[500] }]}>{error}</Text>
                    </View>
                )}

                {/* Dictionary Entry */}
                {entry && !isLoading && (
                    <View style={[styles.entryCard, { backgroundColor: theme.background.secondary }]}>
                        {/* Word header */}
                        <View style={styles.entryTop}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.entryWordRow}>
                                    {entry.gender && (
                                        <Text style={[styles.entryGender, { color: Colors.primary[500] }]}>{entry.gender}</Text>
                                    )}
                                    <Text style={[styles.entryWord, { color: theme.text.primary }]}>{entry.word}</Text>
                                </View>
                                {entry.pronunciation ? (
                                    <Text style={[styles.entryPronunciation, { color: theme.text.tertiary }]}>[{entry.pronunciation}]</Text>
                                ) : null}
                            </View>
                            <TouchableOpacity onPress={handleSpeak} activeOpacity={0.7}>
                                <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={styles.speakBtn}>
                                    <Ionicons name="volume-high" size={18} color={Colors.white} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Badges */}
                        <View style={styles.entryBadges}>
                            <View style={[styles.posBadge, { backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50] }]}>
                                <Text style={[styles.posBadgeText, { color: Colors.primary[500] }]}>{entry.partOfSpeech}</Text>
                            </View>
                            <View style={[styles.levelBadge]}>
                                <LinearGradient colors={LEVEL_COLORS[entry.level] || LEVEL_COLORS.A1} style={styles.levelBadgeGradient}>
                                    <Text style={styles.levelBadgeText}>{entry.level}</Text>
                                </LinearGradient>
                            </View>
                        </View>

                        {entry.plural && (
                            <Text style={[styles.entryPlural, { color: theme.text.secondary }]}>Plural: <Text style={{ fontWeight: FontWeight.semibold as any }}>{entry.plural}</Text></Text>
                        )}

                        {/* Meanings */}
                        <View style={styles.entrySection}>
                            <Text style={[styles.entrySectionTitle, { color: theme.text.tertiary }]}>Meanings</Text>
                            {entry.meanings.map((meaning, idx) => (
                                <View key={idx} style={styles.meaningRow}>
                                    <View style={[styles.meaningDot, { backgroundColor: Colors.primary[500] }]} />
                                    <Text style={[styles.meaningText, { color: theme.text.primary }]}>{meaning}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Examples */}
                        {entry.examples && entry.examples.length > 0 && (
                            <View style={styles.entrySection}>
                                <Text style={[styles.entrySectionTitle, { color: theme.text.tertiary }]}>Examples</Text>
                                {entry.examples.map((ex, idx) => (
                                    <View key={idx} style={[styles.exampleCard, { backgroundColor: theme.background.tertiary }]}>
                                        <Text style={[styles.exampleDe, { color: theme.text.primary }]}>{ex.german}</Text>
                                        <Text style={[styles.exampleEn, { color: theme.text.secondary }]}>{ex.english}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Conjugation */}
                        {entry.conjugation && (
                            <View style={styles.entrySection}>
                                <Text style={[styles.entrySectionTitle, { color: theme.text.tertiary }]}>Conjugation (Present)</Text>
                                <View style={styles.conjGrid}>
                                    {Object.entries(entry.conjugation).map(([pronoun, form]) => (
                                        <View key={pronoun} style={[styles.conjItem, { backgroundColor: theme.background.tertiary }]}>
                                            <Text style={[styles.conjPronoun, { color: theme.text.tertiary }]}>{pronoun}</Text>
                                            <Text style={[styles.conjForm, { color: theme.text.primary }]}>{form}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Synonyms */}
                        {entry.synonyms && entry.synonyms.length > 0 && (
                            <View style={styles.entrySection}>
                                <Text style={[styles.entrySectionTitle, { color: theme.text.tertiary }]}>Synonyms</Text>
                                <View style={styles.chipRow}>
                                    {entry.synonyms.map((syn, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles.linkedChip, { backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : Colors.primary[50] }]}
                                            onPress={() => { setSearchQuery(syn); lookupWord(syn); }}
                                        >
                                            <Text style={[styles.linkedChipText, { color: Colors.primary[500] }]}>{syn}</Text>
                                            <Ionicons name="arrow-forward" size={12} color={Colors.primary[500]} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Related Words */}
                        {entry.relatedWords && entry.relatedWords.length > 0 && (
                            <View style={styles.entrySection}>
                                <Text style={[styles.entrySectionTitle, { color: theme.text.tertiary }]}>Related Words</Text>
                                <View style={styles.chipRow}>
                                    {entry.relatedWords.map((word, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles.linkedChip, { backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : Colors.primary[50] }]}
                                            onPress={() => { setSearchQuery(word); lookupWord(word); }}
                                        >
                                            <Text style={[styles.linkedChipText, { color: Colors.primary[500] }]}>{word}</Text>
                                            <Ionicons name="arrow-forward" size={12} color={Colors.primary[500]} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Browse Categories */}
                {!entry && !isLoading && (
                    <>
                        {categorizedData[selectedLevel].map((cat, catIdx) => (
                            <View key={catIdx} style={[styles.catCard, { backgroundColor: theme.background.secondary }]}>
                                {/* Category header */}
                                <View style={styles.catHeader}>
                                    <View style={[styles.catIconCircle, { backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : Colors.primary[50] }]}>
                                        <Ionicons name={cat.icon} size={18} color={Colors.primary[500]} />
                                    </View>
                                    <Text style={[styles.catTitle, { color: theme.text.primary }]}>{cat.category}</Text>
                                    <Text style={[styles.catCount, { color: theme.text.tertiary }]}>{cat.words.length}</Text>
                                </View>
                                {/* Word chips */}
                                <View style={styles.catWords}>
                                    {cat.words.map((word, wordIdx) => (
                                        <TouchableOpacity
                                            key={wordIdx}
                                            style={[styles.wordChip, {
                                                backgroundColor: theme.background.tertiary,
                                                borderColor: theme.border.light,
                                            }]}
                                            onPress={() => { setSearchQuery(word); lookupWord(word); }}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.wordChipText, { color: theme.text.primary }]}>{word}</Text>
                                            <Ionicons name="chevron-forward" size={14} color={theme.text.tertiary} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
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

    // Search
    searchSection: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.xl,
        paddingLeft: Spacing.md,
        paddingRight: 4,
        borderWidth: 1.5,
        gap: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: FontSize.md,
        paddingVertical: Spacing.md,
    },
    searchBtn: { marginLeft: Spacing.xs },
    searchBtnGradient: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Tabs
    tabsRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    tab: {
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.sm + 2,
        alignItems: 'center',
    },
    tabActive: {
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.sm + 2,
        alignItems: 'center',
    },
    tabText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
    tabTextActive: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white },

    // Content
    content: { flex: 1 },
    contentInner: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },

    // Loading
    loadingBox: { alignItems: 'center', padding: Spacing['2xl'] },
    loadingText: { fontSize: FontSize.md, marginTop: Spacing.md },

    // Error
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
    },
    errorText: { fontSize: FontSize.sm, flex: 1 },

    // Entry Card
    entryCard: {
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    entryTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    entryWordRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs },
    entryGender: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
    entryWord: { fontSize: 26, fontWeight: FontWeight.bold },
    entryPronunciation: { fontSize: FontSize.sm, marginTop: 2 },
    speakBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    entryBadges: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
    posBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    posBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
    levelBadge: { borderRadius: BorderRadius.full, overflow: 'hidden' },
    levelBadgeGradient: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
    },
    levelBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white },
    entryPlural: { fontSize: FontSize.sm, marginBottom: Spacing.md },
    entrySection: { marginTop: Spacing.lg },
    entrySectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: Spacing.sm,
    },
    meaningRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.xs },
    meaningDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
    meaningText: { fontSize: FontSize.md, lineHeight: 22, flex: 1 },
    exampleCard: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    exampleDe: { fontSize: FontSize.md, fontStyle: 'italic', marginBottom: Spacing.xs },
    exampleEn: { fontSize: FontSize.sm },
    conjGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    conjItem: {
        width: '31%',
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
    },
    conjPronoun: { fontSize: FontSize.xs },
    conjForm: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    linkedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    linkedChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },

    // Category Cards
    catCard: {
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
    catHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    catIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    catTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, flex: 1 },
    catCount: { fontSize: FontSize.xs },
    catWords: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    wordChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    wordChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
});
