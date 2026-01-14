// Sentence Formation Screen - Learn sentence structure with formulas
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, Badge, Button, ProgressBar, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, Shadows, LevelColors } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore, useSettingsStore } from '../../store';
import { CEFRLevel } from '../../types';

interface SentenceFormula {
    id: string;
    level: CEFRLevel;
    name: string;
    nameDe: string;
    formula: string;
    description: string;
    components: Array<{
        type: string;
        label: string;
        examples: string[];
    }>;
    examples: Array<{
        sentence: string;
        translation: string;
        breakdown: string[];
    }>;
    exercises: Array<{
        prompt: string;
        hints: string[];
        sampleAnswer: string;
    }>;
}

// Comprehensive sentence formulas
const sentenceFormulas: SentenceFormula[] = [
    // A1 Formulas
    {
        id: 'a1-statement-basic',
        level: 'A1',
        name: 'Basic Statement',
        nameDe: 'Einfacher Aussagesatz',
        formula: 'Subject + Verb + Object/Complement',
        description: 'The most basic German sentence structure for simple statements.',
        components: [
            { type: 'Subject', label: 'Subjekt', examples: ['Ich', 'Du', 'Er', 'Sie', 'Wir'] },
            { type: 'Verb', label: 'Verb', examples: ['bin', 'habe', 'gehe', 'esse', 'lerne'] },
            { type: 'Object', label: 'Objekt', examples: ['Deutsch', 'einen Apfel', 'zur Schule'] },
        ],
        examples: [
            {
                sentence: 'Ich lerne Deutsch.',
                translation: 'I am learning German.',
                breakdown: ['Ich (Subject)', 'lerne (Verb)', 'Deutsch (Object)']
            },
            {
                sentence: 'Sie isst einen Apfel.',
                translation: 'She eats an apple.',
                breakdown: ['Sie (Subject)', 'isst (Verb)', 'einen Apfel (Object)']
            },
        ],
        exercises: [
            {
                prompt: 'Create a sentence: You drink water',
                hints: ['Subject: Du', 'Verb: trinkst', 'Object: Wasser'],
                sampleAnswer: 'Du trinkst Wasser.'
            },
            {
                prompt: 'Create a sentence: We read a book',
                hints: ['Subject: Wir', 'Verb: lesen', 'Object: ein Buch'],
                sampleAnswer: 'Wir lesen ein Buch.'
            },
        ],
    },
    {
        id: 'a1-question-yes-no',
        level: 'A1',
        name: 'Yes/No Question',
        nameDe: 'Ja/Nein-Frage',
        formula: 'Verb + Subject + Object/Complement?',
        description: 'Questions that can be answered with yes or no. The verb comes first!',
        components: [
            { type: 'Verb', label: 'Verb (Position 1)', examples: ['Hast', 'Bist', 'Gehst', 'Sprichst'] },
            { type: 'Subject', label: 'Subjekt', examples: ['du', 'Sie', 'er', 'ihr'] },
            { type: 'Rest', label: 'Rest', examples: ['Zeit', 'müde', 'zur Arbeit'] },
        ],
        examples: [
            {
                sentence: 'Hast du Zeit?',
                translation: 'Do you have time?',
                breakdown: ['Hast (Verb)', 'du (Subject)', 'Zeit (Object)']
            },
            {
                sentence: 'Sprichst du Deutsch?',
                translation: 'Do you speak German?',
                breakdown: ['Sprichst (Verb)', 'du (Subject)', 'Deutsch (Object)']
            },
        ],
        exercises: [
            {
                prompt: 'Ask: Are you hungry?',
                hints: ['Verb: Bist', 'Subject: du', 'Adjective: hungrig'],
                sampleAnswer: 'Bist du hungrig?'
            },
        ],
    },
    {
        id: 'a1-question-w',
        level: 'A1',
        name: 'W-Question',
        nameDe: 'W-Frage',
        formula: 'W-Word + Verb + Subject + Rest?',
        description: 'Questions starting with W-words (Wer, Was, Wo, Wann, etc.)',
        components: [
            { type: 'W-Word', label: 'Fragewort', examples: ['Wer', 'Was', 'Wo', 'Wann', 'Wie', 'Warum', 'Woher'] },
            { type: 'Verb', label: 'Verb', examples: ['ist', 'hast', 'gehst', 'kommst'] },
            { type: 'Subject', label: 'Subjekt', examples: ['du', 'Sie', 'das'] },
        ],
        examples: [
            {
                sentence: 'Wo wohnst du?',
                translation: 'Where do you live?',
                breakdown: ['Wo (W-Word)', 'wohnst (Verb)', 'du (Subject)']
            },
            {
                sentence: 'Was machst du heute?',
                translation: 'What are you doing today?',
                breakdown: ['Was (W-Word)', 'machst (Verb)', 'du (Subject)', 'heute (Time)']
            },
        ],
        exercises: [
            {
                prompt: 'Ask: Where is the station?',
                hints: ['W-Word: Wo', 'Verb: ist', 'Subject: der Bahnhof'],
                sampleAnswer: 'Wo ist der Bahnhof?'
            },
        ],
    },
    {
        id: 'a1-time-manner-place',
        level: 'A1',
        name: 'Time-Manner-Place Rule',
        nameDe: 'Temporal-Modal-Lokal',
        formula: 'Subject + Verb + TIME + MANNER + PLACE',
        description: 'German word order for time, manner, and place expressions (TeKaMoLo).',
        components: [
            { type: 'Time', label: 'Temporal (Wann?)', examples: ['heute', 'morgen', 'um 8 Uhr'] },
            { type: 'Manner', label: 'Modal (Wie?)', examples: ['schnell', 'mit dem Bus', 'gern'] },
            { type: 'Place', label: 'Lokal (Wo/Wohin?)', examples: ['nach Hause', 'in die Stadt', 'hier'] },
        ],
        examples: [
            {
                sentence: 'Ich fahre morgen mit dem Zug nach Berlin.',
                translation: 'I am taking the train to Berlin tomorrow.',
                breakdown: ['Ich fahre (S+V)', 'morgen (Time)', 'mit dem Zug (Manner)', 'nach Berlin (Place)']
            },
        ],
        exercises: [
            {
                prompt: 'Arrange: go / today / by bus / to school / I',
                hints: ['Subject+Verb first', 'Then Time', 'Then Manner', 'Then Place'],
                sampleAnswer: 'Ich gehe heute mit dem Bus zur Schule.'
            },
        ],
    },
    // A2 Formulas
    {
        id: 'a2-perfect-tense',
        level: 'A2',
        name: 'Perfect Tense',
        nameDe: 'Perfekt',
        formula: 'Subject + haben/sein + ... + Past Participle',
        description: 'Used for past events. The helping verb comes in position 2, past participle at the end.',
        components: [
            { type: 'Subject', label: 'Subjekt', examples: ['Ich', 'Du', 'Er', 'Wir'] },
            { type: 'Auxiliary', label: 'Hilfsverb', examples: ['habe', 'bin', 'hat', 'sind'] },
            { type: 'Participle', label: 'Partizip II', examples: ['gemacht', 'gegangen', 'gelernt', 'gefahren'] },
        ],
        examples: [
            {
                sentence: 'Ich habe Deutsch gelernt.',
                translation: 'I have learned German.',
                breakdown: ['Ich (Subject)', 'habe (Auxiliary)', 'Deutsch', 'gelernt (Past Participle)']
            },
            {
                sentence: 'Sie ist nach Hause gegangen.',
                translation: 'She has gone home.',
                breakdown: ['Sie (Subject)', 'ist (Auxiliary)', 'nach Hause', 'gegangen (Past Participle)']
            },
        ],
        exercises: [
            {
                prompt: 'Say: I have eaten an apple',
                hints: ['Subject: Ich', 'Auxiliary: habe', 'Participle: gegessen'],
                sampleAnswer: 'Ich habe einen Apfel gegessen.'
            },
        ],
    },
    {
        id: 'a2-modal-verb',
        level: 'A2',
        name: 'Modal Verb Sentences',
        nameDe: 'Sätze mit Modalverben',
        formula: 'Subject + Modal Verb + ... + Infinitive',
        description: 'Modal verbs (können, müssen, wollen, etc.) change the sentence structure.',
        components: [
            { type: 'Subject', label: 'Subjekt', examples: ['Ich', 'Du', 'Wir'] },
            { type: 'Modal', label: 'Modalverb', examples: ['kann', 'muss', 'will', 'darf', 'soll'] },
            { type: 'Infinitive', label: 'Infinitiv', examples: ['gehen', 'sprechen', 'helfen'] },
        ],
        examples: [
            {
                sentence: 'Ich kann Deutsch sprechen.',
                translation: 'I can speak German.',
                breakdown: ['Ich (Subject)', 'kann (Modal)', 'Deutsch', 'sprechen (Infinitive)']
            },
            {
                sentence: 'Du musst heute arbeiten.',
                translation: 'You must work today.',
                breakdown: ['Du (Subject)', 'musst (Modal)', 'heute', 'arbeiten (Infinitive)']
            },
        ],
        exercises: [
            {
                prompt: 'Say: She wants to learn German',
                hints: ['Subject: Sie', 'Modal: will', 'Infinitive: lernen'],
                sampleAnswer: 'Sie will Deutsch lernen.'
            },
        ],
    },
    {
        id: 'a2-subordinate-weil',
        level: 'A2',
        name: 'Because Clauses (weil)',
        nameDe: 'Nebensätze mit weil',
        formula: 'Main Clause, weil + Subject + ... + Verb',
        description: 'In subordinate clauses with "weil", the conjugated verb goes to the END.',
        components: [
            { type: 'Main', label: 'Hauptsatz', examples: ['Ich bin müde', 'Er bleibt zu Hause'] },
            { type: 'Conjunction', label: 'Konjunktion', examples: ['weil', 'dass', 'wenn', 'obwohl'] },
            { type: 'Verb', label: 'Verb (am Ende)', examples: ['...habe', '...bin', '...gehe'] },
        ],
        examples: [
            {
                sentence: 'Ich bin müde, weil ich lange gearbeitet habe.',
                translation: 'I am tired because I worked for a long time.',
                breakdown: ['Ich bin müde (Main)', 'weil (Conj)', 'ich lange gearbeitet', 'habe (Verb at end)']
            },
        ],
        exercises: [
            {
                prompt: 'Complete: I am learning German because...',
                hints: ['weil + subject + ... + verb at end'],
                sampleAnswer: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten will.'
            },
        ],
    },
    // B1 Formulas
    {
        id: 'b1-relative-clause',
        level: 'B1',
        name: 'Relative Clauses',
        nameDe: 'Relativsätze',
        formula: 'Noun + Relative Pronoun + ... + Verb',
        description: 'Connect sentences using relative pronouns (der, die, das, etc.).',
        components: [
            { type: 'Noun', label: 'Bezugswort', examples: ['Der Mann', 'Die Frau', 'Das Buch'] },
            { type: 'Relative', label: 'Relativpronomen', examples: ['der', 'die', 'das', 'den', 'dem'] },
            { type: 'Verb', label: 'Verb (am Ende)', examples: ['...wohnt', '...gekauft habe'] },
        ],
        examples: [
            {
                sentence: 'Der Mann, der dort steht, ist mein Vater.',
                translation: 'The man who is standing there is my father.',
                breakdown: ['Der Mann (Noun)', 'der (Rel. Pronoun)', 'dort', 'steht (Verb)']
            },
        ],
        exercises: [
            {
                prompt: 'Complete: The book that I bought...',
                hints: ['das Buch', 'das (neuter)', 'gekauft habe'],
                sampleAnswer: 'Das Buch, das ich gekauft habe, ist interessant.'
            },
        ],
    },
    {
        id: 'b1-passive',
        level: 'B1',
        name: 'Passive Voice',
        nameDe: 'Passiv',
        formula: 'Subject + werden + ... + Past Participle',
        description: 'When the action is more important than who does it.',
        components: [
            { type: 'Subject', label: 'Subjekt', examples: ['Das Auto', 'Der Brief', 'Die Tür'] },
            { type: 'Werden', label: 'werden', examples: ['wird', 'wurde', 'ist...worden'] },
            { type: 'Participle', label: 'Partizip II', examples: ['repariert', 'geschrieben', 'geöffnet'] },
        ],
        examples: [
            {
                sentence: 'Das Auto wird repariert.',
                translation: 'The car is being repaired.',
                breakdown: ['Das Auto (Subject)', 'wird (werden)', 'repariert (Participle)']
            },
            {
                sentence: 'Der Brief wurde gestern geschrieben.',
                translation: 'The letter was written yesterday.',
                breakdown: ['Der Brief (Subject)', 'wurde (past)', 'gestern', 'geschrieben (Participle)']
            },
        ],
        exercises: [
            {
                prompt: 'Make passive: Someone opens the door',
                hints: ['Die Tür', 'wird', 'geöffnet'],
                sampleAnswer: 'Die Tür wird geöffnet.'
            },
        ],
    },
];

export const SentenceFormationScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { progress } = useUserStore();
    const { settings } = useSettingsStore();



    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(progress.level);
    const [selectedFormula, setSelectedFormula] = useState<SentenceFormula | null>(null);
    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
    const filteredFormulas = sentenceFormulas.filter(f => f.level === selectedLevel);

    const handleCheckAnswer = () => {
        if (!selectedFormula) return;
        const exercise = selectedFormula.exercises[exerciseIndex];
        const correct = userAnswer.toLowerCase().trim() === exercise.sampleAnswer.toLowerCase().trim();
        setIsCorrect(correct);
        setShowAnswer(true);

        if (correct && settings.hapticEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        } else {
            if (settings.hapticEnabled) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }
    };

    const handleNextExercise = () => {
        if (!selectedFormula) return;
        if (exerciseIndex < selectedFormula.exercises.length - 1) {
            setExerciseIndex(exerciseIndex + 1);
            setUserAnswer('');
            setShowAnswer(false);
            setIsCorrect(null);
        }
    };

    if (selectedFormula) {
        const exercise = selectedFormula.exercises[exerciseIndex];

        return (
            <SafeArea style={styles.container}>
                <View style={styles.formulaHeader}>
                    <TouchableOpacity onPress={() => {
                        setSelectedFormula(null);
                        setExerciseIndex(0);
                        setUserAnswer('');
                        setShowAnswer(false);
                        setIsCorrect(null);
                    }} style={styles.backButtonTouchable}>
                        <Ionicons name="arrow-back" size={20} color={Colors.primary[500]} />
                        <Text style={styles.backButton}>Back</Text>
                    </TouchableOpacity>
                    <Badge label={selectedFormula.level} variant="level" level={selectedFormula.level} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.formulaTitle}>{selectedFormula.name}</Text>
                    <Text style={styles.formulaTitleDe}>{selectedFormula.nameDe}</Text>

                    {/* Formula Display */}
                    <Card variant="gradient" gradientColors={[Colors.primary[500], Colors.primary[700]]} style={styles.formulaCard}>
                        <Text style={styles.formulaText}>{selectedFormula.formula}</Text>
                    </Card>

                    <Text style={styles.description}>{selectedFormula.description}</Text>

                    {/* Components */}
                    <Text style={styles.sectionTitle}>Components</Text>
                    <View style={styles.componentsContainer}>
                        {selectedFormula.components.map((comp, idx) => (
                            <Card key={idx} variant="flat" style={styles.componentCard}>
                                <Text style={styles.componentType}>{comp.type}</Text>
                                <Text style={styles.componentLabel}>{comp.label}</Text>
                                <View style={styles.componentExamples}>
                                    {comp.examples.slice(0, 3).map((ex, i) => (
                                        <Text key={i} style={styles.componentExample}>{ex}</Text>
                                    ))}
                                </View>
                            </Card>
                        ))}
                    </View>

                    {/* Examples */}
                    <Text style={styles.sectionTitle}>Examples</Text>
                    {selectedFormula.examples.map((ex, idx) => (
                        <Card key={idx} style={styles.exampleCard}>
                            <Text style={styles.exampleSentence}>{ex.sentence}</Text>
                            <Text style={styles.exampleTranslation}>{ex.translation}</Text>
                            <View style={styles.breakdownContainer}>
                                {ex.breakdown.map((part, i) => (
                                    <Badge key={i} label={part} variant="default" size="small" />
                                ))}
                            </View>
                        </Card>
                    ))}

                    {/* Exercise */}
                    <Text style={styles.sectionTitle}>Practice ({exerciseIndex + 1}/{selectedFormula.exercises.length})</Text>
                    <Card style={styles.exerciseCard}>
                        <Text style={styles.exercisePrompt}>{exercise.prompt}</Text>

                        <View style={styles.hintsContainer}>
                            <Text style={styles.hintsLabel}>Hints:</Text>
                            {exercise.hints.map((hint, idx) => (
                                <Text key={idx} style={styles.hint}>• {hint}</Text>
                            ))}
                        </View>

                        <TextInput
                            style={[
                                styles.answerInput,
                                isCorrect === true && styles.inputCorrect,
                                isCorrect === false && styles.inputIncorrect,
                            ]}
                            value={userAnswer}
                            onChangeText={setUserAnswer}
                            placeholder="Type your sentence in German..."
                            placeholderTextColor={Colors.neutral[400]}
                            multiline
                        />

                        {showAnswer && (
                            <View style={styles.answerFeedback}>
                                <View style={styles.feedbackRow}>
                                    <Ionicons
                                        name={isCorrect ? "checkmark-circle" : "close-circle"}
                                        size={20}
                                        color={isCorrect ? Colors.success[600] : Colors.error[600]}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text style={[
                                        styles.feedbackText,
                                        isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
                                    ]}>
                                        {isCorrect ? 'Correct!' : 'Not quite right'}
                                    </Text>
                                </View>
                                <Text style={styles.sampleAnswer}>
                                    Sample answer: {exercise.sampleAnswer}
                                </Text>
                            </View>
                        )}

                        <View style={styles.exerciseButtons}>
                            {!showAnswer ? (
                                <Button
                                    title="Check Answer"
                                    onPress={handleCheckAnswer}
                                    disabled={!userAnswer.trim()}
                                    fullWidth
                                />
                            ) : (
                                exerciseIndex < selectedFormula.exercises.length - 1 && (
                                    <Button
                                        title="Next Exercise"
                                        onPress={handleNextExercise}
                                        fullWidth
                                    />
                                )
                            )}
                        </View>
                    </Card>
                </ScrollView>
            </SafeArea>
        );
    }

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
                    </TouchableOpacity>
                    <Ionicons name="pencil" size={24} color={Colors.primary[500]} />
                    <Text style={styles.headerTitle}>Sentence Formation</Text>
                </View>
                <Text style={styles.headerSubtitle}>Learn German sentence structures</Text>
            </View>

            {/* Level Tabs */}
            <View style={styles.levelSelectorContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.levelTabsContent}
                >
                    {levels.map((level) => {
                        const isActive = selectedLevel === level;
                        return (
                            <TouchableOpacity
                                key={level}
                                onPress={() => setSelectedLevel(level)}
                                style={[
                                    styles.levelTab,
                                    isActive && { backgroundColor: LevelColors[level], borderWidth: 0 },
                                    !isActive && { borderColor: LevelColors[level], borderWidth: 1.5, backgroundColor: 'transparent' }
                                ]}
                            >
                                <Text style={[
                                    styles.levelTabText,
                                    isActive ? { color: Colors.white } : { color: LevelColors[level] }
                                ]}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {filteredFormulas.map((formula) => (
                    <TouchableOpacity
                        key={formula.id}
                        onPress={() => setSelectedFormula(formula)}
                        activeOpacity={0.8}
                    >
                        <Card style={styles.formulaListCard}>
                            <View style={styles.formulaListHeader}>
                                <View style={styles.formulaListInfo}>
                                    <Text style={styles.formulaListTitle}>{formula.name}</Text>
                                    <Text style={styles.formulaListTitleDe}>{formula.nameDe}</Text>
                                </View>
                                <Badge label={`${formula.exercises.length} exercises`} variant="info" size="small" />
                            </View>
                            <View style={styles.formulaPreview}>
                                <Text style={styles.formulaPreviewText}>{formula.formula}</Text>
                            </View>
                            <Text style={styles.formulaListDesc}>{formula.description}</Text>
                        </Card>
                    </TouchableOpacity>
                ))}

                {filteredFormulas.length === 0 && (
                    <Card variant="flat" style={styles.emptyCard}>
                        <Ionicons name="create" size={48} color={Colors.neutral[300]} style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyText}>
                            Sentence formulas for {selectedLevel} coming soon!
                        </Text>
                    </Card>
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
    formulaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: theme.background.primary,
    },
    backButtonTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        fontSize: FontSize.base,
        color: Colors.primary[500],
        fontWeight: FontWeight.medium,
        marginLeft: 4,
    },
    levelSelectorContainer: {
        backgroundColor: theme.background.primary,
        paddingVertical: Spacing.md,
        ...Shadows.sm,
        zIndex: 10,
    },
    levelTabsContent: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.md,
    },
    levelTab: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelTabText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
    levelTabTextActive: {
        color: Colors.white,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.base,
        paddingBottom: Spacing['3xl'],
    },
    formulaListCard: {
        marginBottom: Spacing.md,
    },
    formulaListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    formulaListInfo: {
        flex: 1,
    },
    formulaListTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    formulaListTitleDe: {
        fontSize: FontSize.sm,
        color: Colors.primary[500],
        marginTop: 2,
    },
    formulaPreview: {
        backgroundColor: Colors.primary[50], // Consider darkening for dark mode? Or keep as highlight. keeping for now.
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.sm,
    },
    formulaPreviewText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.primary[700],
        fontFamily: 'monospace',
    },
    formulaListDesc: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        lineHeight: 20,
    },
    formulaTitle: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    formulaTitleDe: {
        fontSize: FontSize.lg,
        color: Colors.primary[500],
        marginTop: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    formulaCard: {
        marginBottom: Spacing.lg,
        alignItems: 'center',
    },
    formulaText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        fontFamily: 'monospace',
        textAlign: 'center',
    },
    description: {
        fontSize: FontSize.base,
        color: theme.text.secondary,
        lineHeight: 24,
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.md,
        marginTop: Spacing.md,
    },
    componentsContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        flexWrap: 'wrap',
    },
    componentCard: {
        flex: 1,
        minWidth: 100,
        alignItems: 'center',
    },
    componentType: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary[600],
        marginBottom: Spacing.xs,
    },
    componentLabel: {
        fontSize: FontSize.xs,
        color: theme.text.secondary,
        marginBottom: Spacing.sm,
    },
    componentExamples: {
        alignItems: 'center',
    },
    componentExample: {
        fontSize: FontSize.sm,
        color: theme.text.primary,
    },
    exampleCard: {
        marginBottom: Spacing.sm,
    },
    exampleSentence: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: theme.text.primary,
        marginBottom: Spacing.xs,
    },
    exampleTranslation: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginBottom: Spacing.md,
    },
    breakdownContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    exerciseCard: {
        marginBottom: Spacing.lg,
    },
    exercisePrompt: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: theme.text.primary,
        marginBottom: Spacing.md,
    },
    hintsContainer: {
        backgroundColor: Colors.gold[50],
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.md,
    },
    hintsLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.xs,
        color: Colors.gold[900],
    },
    hint: {
        fontSize: FontSize.sm,
        color: Colors.gold[800],
        marginBottom: 2,
    },
    answerInput: {
        borderWidth: 1,
        borderColor: theme.border.light,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        fontSize: FontSize.md,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: Spacing.md,
        backgroundColor: theme.background.primary,
        color: theme.text.primary,
    },
    inputCorrect: {
        borderColor: Colors.success[500],
        backgroundColor: Colors.success[50], // Maybe adjust for dark mode?
    },
    inputIncorrect: {
        borderColor: Colors.error[500],
        backgroundColor: Colors.error[50], // Maybe adjust for dark mode?
    },
    answerFeedback: {
        marginBottom: Spacing.md,
        padding: Spacing.md,
        backgroundColor: theme.background.secondary,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    feedbackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    feedbackText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    feedbackCorrect: {
        color: Colors.success[600],
    },
    feedbackIncorrect: {
        color: Colors.error[600],
    },
    sampleAnswer: {
        fontSize: FontSize.base,
        color: theme.text.primary,
        marginTop: Spacing.xs,
    },
    exerciseButtons: {
        marginTop: Spacing.sm,
    },
    emptyCard: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyText: {
        fontSize: FontSize.base,
        color: LightTheme.text.secondary,
        textAlign: 'center',
    },
});
