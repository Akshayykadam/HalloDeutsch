// Reading Notes Screen - Comprehensive verb and grammar reference
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '../../components/ui';
import { Card, Badge } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, LevelColors } from '../../theme';
import { verbsData, VerbData, getVerbCategories, searchVerbs } from '../../data/content/verbs-data';
import { CEFRLevel } from '../../types';

// Verb Detail Component
const VerbDetail: React.FC<{ verb: VerbData; onBack: () => void }> = ({ verb, onBack }) => {
    const [selectedTense, setSelectedTense] = useState<'present' | 'past'>('present');

    const conjugation = selectedTense === 'present' ? verb.present : verb.past;

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color={Colors.primary[500]} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <Badge label={verb.level} variant="level" level={verb.level} />
                    <Badge label={verb.type} variant="info" />
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Verb Header */}
                <View style={styles.verbHeader}>
                    <Text style={styles.verbInfinitive}>{verb.infinitive}</Text>
                    <Text style={styles.verbMeaning}>{verb.meaning}</Text>
                </View>

                {/* Tense Selector */}
                <View style={styles.tenseSelector}>
                    <TouchableOpacity
                        style={[styles.tenseTab, selectedTense === 'present' && styles.tenseTabActive]}
                        onPress={() => setSelectedTense('present')}
                    >
                        <Text style={[styles.tenseText, selectedTense === 'present' && styles.tenseTextActive]}>
                            Present (Präsens)
                        </Text>
                    </TouchableOpacity>
                    {verb.past && (
                        <TouchableOpacity
                            style={[styles.tenseTab, selectedTense === 'past' && styles.tenseTabActive]}
                            onPress={() => setSelectedTense('past')}
                        >
                            <Text style={[styles.tenseText, selectedTense === 'past' && styles.tenseTextActive]}>
                                Past (Präteritum)
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Conjugation Table */}
                <Card style={styles.conjugationCard}>
                    <Text style={styles.sectionTitle}>Conjugation</Text>
                    {conjugation && (
                        <View style={styles.conjugationTable}>
                            <ConjugationRow pronoun="ich" form={conjugation.ich} />
                            <ConjugationRow pronoun="du" form={conjugation.du} />
                            <ConjugationRow pronoun="er/sie/es" form={conjugation.er} />
                            <ConjugationRow pronoun="wir" form={conjugation.wir} />
                            <ConjugationRow pronoun="ihr" form={conjugation.ihr} />
                            <ConjugationRow pronoun="sie/Sie" form={conjugation.sie} />
                        </View>
                    )}
                </Card>

                {/* Perfect Tense */}
                <Card style={styles.perfectCard}>
                    <Text style={styles.sectionTitle}>Perfect Tense (Perfekt)</Text>
                    <View style={styles.perfectInfo}>
                        <View style={styles.perfectItem}>
                            <Text style={styles.perfectLabel}>Auxiliary:</Text>
                            <Badge
                                label={verb.perfect.auxiliary}
                                variant={verb.perfect.auxiliary === 'sein' ? 'warning' : 'success'}
                            />
                        </View>
                        <View style={styles.perfectItem}>
                            <Text style={styles.perfectLabel}>Participle:</Text>
                            <Text style={styles.perfectValue}>{verb.perfect.participle}</Text>
                        </View>
                    </View>
                    <View style={styles.exampleBox}>
                        <Text style={styles.exampleLabel}>Example:</Text>
                        <Text style={styles.exampleText}>
                            Ich {verb.perfect.auxiliary === 'sein' ? 'bin' : 'habe'} {verb.perfect.participle}
                        </Text>
                    </View>
                </Card>

                {/* Imperative */}
                {verb.imperative && (
                    <Card style={styles.imperativeCard}>
                        <Text style={styles.sectionTitle}>Imperative (Commands)</Text>
                        <View style={styles.imperativeTable}>
                            <View style={styles.imperativeRow}>
                                <Text style={styles.imperativeLabel}>du:</Text>
                                <Text style={styles.imperativeValue}>{verb.imperative.du}!</Text>
                            </View>
                            <View style={styles.imperativeRow}>
                                <Text style={styles.imperativeLabel}>ihr:</Text>
                                <Text style={styles.imperativeValue}>{verb.imperative.ihr}!</Text>
                            </View>
                            <View style={styles.imperativeRow}>
                                <Text style={styles.imperativeLabel}>Sie:</Text>
                                <Text style={styles.imperativeValue}>{verb.imperative.Sie}!</Text>
                            </View>
                        </View>
                    </Card>
                )}

                {/* Examples */}
                <Card style={styles.examplesCard}>
                    <Text style={styles.sectionTitle}>Examples</Text>
                    {verb.examples.map((ex, i) => (
                        <View key={i} style={styles.exampleItem}>
                            <View style={styles.exampleRow}>
                                <Badge label="DE" variant="default" size="small" />
                                <Text style={styles.exampleGerman}>{ex.german}</Text>
                            </View>
                            <View style={styles.exampleRow}>
                                <Badge label="EN" variant="info" size="small" />
                                <Text style={styles.exampleEnglish}>{ex.english}</Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Notes */}
                {verb.notes && verb.notes.length > 0 && (
                    <Card variant="flat" style={styles.notesCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                            <Ionicons name="document-text" size={18} color={Colors.primary[500]} style={{ marginRight: 6 }} />
                            <Text style={styles.sectionTitleNoMargin}>Notes</Text>
                        </View>
                        {verb.notes.map((note, i) => (
                            <View key={i} style={styles.noteItem}>
                                <Text style={styles.noteBullet}>•</Text>
                                <Text style={styles.noteText}>{note}</Text>
                            </View>
                        ))}
                    </Card>
                )}

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeArea>
    );
};

// Conjugation Row Component
const ConjugationRow: React.FC<{ pronoun: string; form: string }> = ({ pronoun, form }) => (
    <View style={styles.conjugationRow}>
        <Text style={styles.pronounText}>{pronoun}</Text>
        <Text style={styles.formText}>{form}</Text>
    </View>
);

// Verb List Item
const VerbListItem: React.FC<{ verb: VerbData; onPress: () => void }> = ({ verb, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card style={styles.verbListItem}>
            <View style={styles.verbListHeader}>
                <Text style={styles.verbListInfinitive}>{verb.infinitive}</Text>
                <View style={styles.verbListBadges}>
                    <Badge label={verb.level} variant="level" level={verb.level} size="small" />
                </View>
            </View>
            <Text style={styles.verbListMeaning}>{verb.meaning}</Text>
            <View style={styles.verbListPreview}>
                <Text style={styles.verbListConjugation}>
                    ich {verb.present.ich} • du {verb.present.du} • er {verb.present.er}
                </Text>
            </View>
        </Card>
    </TouchableOpacity>
);

// Main Reading Screen
export const ReadingScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
    const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', ...getVerbCategories()];

    const filteredVerbs = React.useMemo(() => {
        let verbs = verbsData;

        if (selectedCategory !== 'All') {
            verbs = verbs.filter(v => v.category === selectedCategory);
        }

        if (searchQuery) {
            verbs = searchVerbs(searchQuery);
        }

        return verbs;
    }, [selectedCategory, searchQuery]);

    if (selectedVerb) {
        return <VerbDetail verb={selectedVerb} onBack={() => setSelectedVerb(null)} />;
    }

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                {navigation && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={20} color={Colors.primary[500]} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="book" size={24} color={Colors.primary[500]} style={{ marginRight: 8 }} />
                    <Text style={styles.headerTitle}>Verb Notes</Text>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search verbs..."
                    placeholderTextColor={Colors.neutral[400]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContainer}
            >
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.categoryTab, selectedCategory === cat && styles.categoryTabActive]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Stats Summary */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{filteredVerbs.length}</Text>
                    <Text style={styles.statLabel}>Verbs</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{filteredVerbs.filter(v => v.type === 'irregular').length}</Text>
                    <Text style={styles.statLabel}>Irregular</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{filteredVerbs.filter(v => v.perfect.auxiliary === 'sein').length}</Text>
                    <Text style={styles.statLabel}>with sein</Text>
                </View>
            </View>

            {/* Verb List */}
            <ScrollView style={styles.verbList} showsVerticalScrollIndicator={false}>
                {/* Quick Reference Card */}
                <Card variant="gradient" gradientColors={[Colors.primary[500], Colors.primary[700]]} style={styles.quickRefCard}>
                    <View style={styles.quickRefHeader}>
                        <Ionicons name="library" size={20} color={Colors.white} style={{ marginRight: 8 }} />
                        <Text style={styles.quickRefTitle}>Verb Conjugation Tips</Text>
                    </View>
                    <Text style={styles.quickRefText}>• Regular: stem + e/st/t/en/t/en</Text>
                    <Text style={styles.quickRefText}>• Modal verbs: ich/er forms are identical</Text>
                    <Text style={styles.quickRefText}>• Perfect: haben + participle (most verbs)</Text>
                    <Text style={styles.quickRefText}>• Motion/change verbs: sein + participle</Text>
                </Card>

                {filteredVerbs.map((verb) => (
                    <VerbListItem
                        key={verb.id}
                        verb={verb}
                        onPress={() => setSelectedVerb(verb)}
                    />
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeArea>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LightTheme.background.secondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: LightTheme.background.primary,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    headerRight: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.xs,
    },
    backText: {
        fontSize: FontSize.base,
        color: Colors.primary[500],
        fontWeight: FontWeight.medium,
        marginLeft: 4,
    },
    searchContainer: {
        padding: Spacing.base,
        paddingTop: 0,
        backgroundColor: LightTheme.background.primary,
    },
    searchInput: {
        backgroundColor: LightTheme.background.tertiary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSize.base,
        color: LightTheme.text.primary,
    },
    categoryScroll: {
        backgroundColor: LightTheme.background.primary,
        paddingBottom: Spacing.md,
    },
    categoryContainer: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
    },
    categoryTab: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: LightTheme.background.tertiary,
    },
    categoryTabActive: {
        backgroundColor: Colors.primary[500],
    },
    categoryText: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        fontWeight: FontWeight.medium,
    },
    categoryTextActive: {
        color: Colors.white,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: Spacing.md,
        backgroundColor: LightTheme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: LightTheme.border.light,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary[500],
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: LightTheme.text.tertiary,
    },
    content: {
        flex: 1,
        padding: Spacing.base,
    },
    verbHeader: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    verbInfinitive: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    verbMeaning: {
        fontSize: FontSize.lg,
        color: LightTheme.text.secondary,
        marginTop: Spacing.xs,
    },
    tenseSelector: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    tenseTab: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        backgroundColor: LightTheme.background.tertiary,
        alignItems: 'center',
    },
    tenseTabActive: {
        backgroundColor: Colors.primary[500],
    },
    tenseText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: LightTheme.text.secondary,
    },
    tenseTextActive: {
        color: Colors.white,
    },
    conjugationCard: {
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: LightTheme.text.primary,
        marginBottom: Spacing.md,
    },
    sectionTitleNoMargin: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: LightTheme.text.primary,
    },
    conjugationTable: {
        gap: Spacing.xs,
    },
    conjugationRow: {
        flexDirection: 'row',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: LightTheme.border.light,
    },
    pronounText: {
        flex: 1,
        fontSize: FontSize.base,
        color: LightTheme.text.secondary,
        fontWeight: FontWeight.medium,
    },
    formText: {
        flex: 2,
        fontSize: FontSize.lg,
        color: Colors.primary[600],
        fontWeight: FontWeight.semibold,
    },
    perfectCard: {
        marginBottom: Spacing.md,
    },
    perfectInfo: {
        flexDirection: 'row',
        gap: Spacing.xl,
        marginBottom: Spacing.md,
    },
    perfectItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    perfectLabel: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
    },
    perfectValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.primary[600],
    },
    exampleBox: {
        backgroundColor: Colors.primary[50],
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    exampleLabel: {
        fontSize: FontSize.xs,
        color: LightTheme.text.tertiary,
        marginBottom: Spacing.xs,
    },
    exampleText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.primary[700],
    },
    imperativeCard: {
        marginBottom: Spacing.md,
    },
    imperativeTable: {
        gap: Spacing.sm,
    },
    imperativeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imperativeLabel: {
        width: 50,
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
    },
    imperativeValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.success[600],
    },
    examplesCard: {
        marginBottom: Spacing.md,
    },
    exampleItem: {
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: LightTheme.border.light,
    },
    exampleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
        gap: 8,
    },
    exampleGerman: {
        flex: 1,
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: LightTheme.text.primary,
    },
    exampleEnglish: {
        flex: 1,
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
    },
    notesCard: {
        marginBottom: Spacing.md,
    },
    noteItem: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
    },
    noteBullet: {
        fontSize: FontSize.base,
        color: Colors.primary[500],
        marginRight: Spacing.sm,
    },
    noteText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        lineHeight: 20,
    },
    quickRefCard: {
        marginBottom: Spacing.md,
        marginHorizontal: Spacing.base,
    },
    quickRefHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    quickRefTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    quickRefText: {
        fontSize: FontSize.sm,
        color: Colors.white,
        opacity: 0.9,
        marginBottom: 2,
    },
    verbList: {
        flex: 1,
    },
    verbListItem: {
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
    },
    verbListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    verbListInfinitive: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    verbListBadges: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    verbListMeaning: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        marginBottom: Spacing.sm,
    },
    verbListPreview: {
        backgroundColor: Colors.primary[50],
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },
    verbListConjugation: {
        fontSize: FontSize.sm,
        color: Colors.primary[600],
        fontStyle: 'italic',
    },
});
