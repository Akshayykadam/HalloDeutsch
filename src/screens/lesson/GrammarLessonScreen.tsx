
// Grammar Lesson Screen - Interactive grammar learning with smart navigation
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { Card, Button, ProgressBar, Badge, SafeArea } from '../../components/ui';
import { ModuleCompleteModal, LessonCompleteModal } from '../../components/gamification';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows, Layout } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import * as Haptics from 'expo-haptics';
import { getLessonById, getCurriculumModule, getGrammarTopics } from '../../services/contentService';
import { CurriculumLesson, CurriculumModule, GrammarTopic } from '../../types';

export const GrammarLessonScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lessonId } = route.params;
    const { theme, isDark } = useTheme();
    const styles = getStyles(theme);
    const { progress, markLessonComplete, unlockNextLesson, updateGrammarTopicsCompleted } = useUserStore();

    const [lesson, setLesson] = useState<CurriculumLesson | null>(null);
    const [currentModule, setCurrentModule] = useState<CurriculumModule | null>(null);
    const [topic, setTopic] = useState<GrammarTopic | undefined>(undefined);
    const [nextLesson, setNextLesson] = useState<CurriculumLesson | null>(null);
    const [loading, setLoading] = useState(true);

    const [speakingText, setSpeakingText] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showModuleComplete, setShowModuleComplete] = useState(false);
    const [showLessonComplete, setShowLessonComplete] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Check if lessonId is actually a topic ID (e.g. "a1-articles") vs lesson ID ("a1-m1-l1")
                const isTopicId = !lessonId.match(/^[a-z0-9]+-m\d+-l\d+$/);

                if (isTopicId) {
                    // Direct Topic Mode
                    const topicData = (await getGrammarTopics('A1')).find(t => t.id === lessonId) ||
                        (await getGrammarTopics('A2')).find(t => t.id === lessonId) ||
                        (await getGrammarTopics('B1')).find(t => t.id === lessonId) ||
                        (await getGrammarTopics('B2')).find(t => t.id === lessonId);

                    if (topicData) {
                        setTopic(topicData);
                        // Create a dummy lesson object for the UI
                        setLesson({
                            id: topicData.id,
                            moduleId: 'practice-mode',
                            order: 0,
                            title: topicData.title,
                            titleDe: topicData.titleDe,
                            type: 'grammar',
                            whatLearning: topicData.description,
                            whyLearning: 'Mastering grammar rules',
                            whereUsed: 'Everyday communication',
                            estimatedMinutes: 5,
                            grammarTopics: [topicData.id],
                            exercises: [],
                            masteryThreshold: 80,
                            isLocked: false,
                            isCompleted: false,
                            progress: 0
                        });
                        setLoading(false);
                        return;
                    }
                }

                // Standard Lesson Mode (existing logic)
                // 1. Fetch Lesson
                const lessonData = await getLessonById(lessonId);
                if (!lessonData) {
                    // Try treating as topic ID as fallback
                    const topicData = (await getGrammarTopics('A1')).find(t => t.id === lessonId);
                    if (topicData) {
                        setTopic(topicData);
                        setLesson({
                            id: topicData.id,
                            moduleId: 'grammar-ref',
                            order: 0,
                            title: topicData.title,
                            titleDe: topicData.titleDe,
                            type: 'grammar',
                            whatLearning: topicData.description,
                            whyLearning: 'Refining grammar skills',
                            whereUsed: 'Formal and informal speech',
                            estimatedMinutes: 5,
                            grammarTopics: [topicData.id],
                            exercises: [],
                            masteryThreshold: 80, isLocked: false, isCompleted: false, progress: 0
                        });
                        setLoading(false);
                        return;
                    }

                    setLoading(false);
                    return;
                }
                setLesson(lessonData);

                // 2. Fetch Module (if linked)
                if (lessonData.moduleId) {
                    const moduleData = await getCurriculumModule(lessonData.moduleId);
                    if (moduleData) {
                        setCurrentModule(moduleData);
                        // 3. Find Next Lesson
                        const idx = moduleData.lessons.findIndex((l: any) => l.id === lessonData.id);
                        if (idx >= 0 && idx < moduleData.lessons.length - 1) {
                            setNextLesson(moduleData.lessons[idx + 1]);
                        }
                    }
                }

                // 4. Find Grammar Topic
                const level = lessonData.id.startsWith('a2') ? 'A2' : lessonData.id.startsWith('b1') ? 'B1' : lessonData.id.startsWith('b2') ? 'B2' : 'A1';
                const topics = await getGrammarTopics(level);

                let foundTopic = undefined;
                // Fuzzy match logic
                const title = lessonData.title.toLowerCase();
                if (lessonData.grammarTopics && lessonData.grammarTopics.length > 0) {
                    foundTopic = topics.find(t => t.id === lessonData.grammarTopics![0]);
                }

                if (!foundTopic) {
                    if (title.includes('article') || title.includes('gender')) foundTopic = topics.find(t => t.id === 'a1-articles');
                    else if (title.includes('structure') || title.includes('question')) foundTopic = topics.find(t => t.id === 'a1-sentence-structure');
                    else if (title.includes('negation') || title.includes('nicht')) foundTopic = topics.find(t => t.id === 'a1-negation');
                    else if (title.includes('perfekt') || title.includes('past')) foundTopic = topics.find(t => t.id === 'a2-perfekt');
                    else if (title.includes('modal')) foundTopic = topics.find(t => t.id === 'a2-modal-verbs');
                    else {
                        foundTopic = topics.find(t => title.includes(t.title.toLowerCase()));
                    }
                }

                // Fallback topic if none found
                if (!foundTopic) {
                    foundTopic = {
                        id: lessonData.id,
                        title: lessonData.title,
                        titleDe: lessonData.titleDe,
                        description: lessonData.whatLearning,
                        level: level as any,
                        lessons: 1,
                        completedLessons: 0,
                        examples: [
                            { german: lessonData.whereUsed ? lessonData.whereUsed.split('.')[0] : lessonData.titleDe, english: lessonData.whyLearning }
                        ],
                        estimatedMinutes: 5,
                        order: 0
                    };
                }
                setTopic(foundTopic);

            } catch (error) {
                console.error("Error loading grammar lesson:", error);
            }
            setLoading(false);
        };
        fetchData();
    }, [lessonId]);

    const speakGerman = async (text: string) => {
        setSpeakingText(text);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await audioService.speak(text);
        setSpeakingText(null);
    };

    const handleComplete = async () => {
        if (!lesson) return;
        await markLessonComplete(lesson.id);
        setIsCompleted(true);
        updateGrammarTopicsCompleted(1);
        unlockNextLesson(lesson.id);
        setShowLessonComplete(true);
    };

    const handleNextLesson = () => {
        setShowLessonComplete(false);
        if (!lesson) return;

        if (nextLesson) {
            const nextLessonInModule = nextLesson;
            // Navigate to next lesson
            if (nextLessonInModule.type === 'vocabulary') {
                navigation.replace('VocabularyLesson', { lessonId: nextLessonInModule.id });
            } else if (nextLessonInModule.vocabularyDomains?.includes('numbers')) {
                navigation.replace('Numbers', { lessonId: nextLessonInModule.id });
            } else if (nextLessonInModule.type === 'grammar') {
                navigation.replace('GrammarLesson', { lessonId: nextLessonInModule.id });
            } else if (nextLessonInModule.type === 'pronunciation' || nextLessonInModule.title.toLowerCase().includes('alphabet')) {
                navigation.replace('Alphabet', { lessonId: nextLessonInModule.id });
            } else if (nextLessonInModule.type === 'quiz') {
                navigation.replace('Quiz', { lessonId: nextLessonInModule.id });
            } else {
                navigation.replace('LessonDetail', { lessonId: nextLessonInModule.id });
            }
        } else {
            setShowModuleComplete(true);
        }
    };

    const handleModuleCompleteClose = () => {
        setShowModuleComplete(false);
        navigation.navigate('LearnHome');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <SafeArea style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            </SafeArea>
        );
    }

    if (!lesson || !topic) {
        return (
            <SafeArea style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text>Lesson content not found.</Text>
                    <Button title="Go Back" onPress={() => navigation.goBack()} />
                </View>
            </SafeArea>
        );
    }

    return (
        <SafeArea style={styles.container}>
            {/* Lesson Complete Modal */}
            <LessonCompleteModal
                visible={showLessonComplete}
                lessonTitle={lesson.title}
                xpEarned={20}
                onContinue={handleNextLesson}
                onClose={handleBackPress}
                hasNextLesson={!!nextLesson}
            />

            {/* Module Complete Modal */}
            <ModuleCompleteModal
                visible={showModuleComplete}
                moduleTitle={currentModule?.title || 'Module'}
                moduleTitleDe={currentModule?.titleDe}
                lessonsCompleted={currentModule?.lessons.length || 0}
                onClose={handleModuleCompleteClose}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
                    <Text style={styles.headerSubtitle}>{lesson.titleDe}</Text>
                </View>
                <Badge label="Grammar" variant="default" />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Introduction Card */}
                <Card style={styles.introCard}>
                    <Text style={styles.description}>{topic.description}</Text>

                    <View style={styles.contextContainer}>
                        <View style={styles.contextRow}>
                            <Text style={styles.contextLabel}>Why:</Text>
                            <Text style={styles.contextValue}>{lesson.whyLearning}</Text>
                        </View>
                        <View style={styles.contextRow}>
                            <Text style={styles.contextLabel}>When:</Text>
                            <Text style={styles.contextValue}>{lesson.whereUsed}</Text>
                        </View>
                    </View>
                </Card>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Practice Sentences</Text>
                    <Badge label={`${topic.examples.length}`} variant="info" />
                </View>

                {/* Examples List */}
                {topic.examples.map((example, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => speakGerman(example.german)}
                        activeOpacity={0.9}
                        style={styles.exampleTouchable}
                    >
                        <View style={[
                            styles.exampleCard,
                            speakingText === example.german && styles.exampleCardActive
                        ]}>
                            {/* Number Badge */}
                            <View style={styles.numberContainer}>
                                <Text style={[
                                    styles.numberText,
                                    speakingText === example.german && styles.numberTextActive
                                ]}>
                                    {(idx + 1).toString().padStart(2, '0')}
                                </Text>
                            </View>

                            <View style={styles.contentContainer}>
                                <Text style={[
                                    styles.exampleGerman,
                                    speakingText === example.german && styles.exampleGermanActive
                                ]}>{example.german}</Text>

                                <Text style={styles.exampleEnglish}>{example.english}</Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.speakerButton,
                                    speakingText === example.german && styles.speakerButtonActive
                                ]}
                                onPress={() => speakGerman(example.german)}
                            >
                                <Ionicons
                                    name={speakingText === example.german ? "volume-high" : "volume-medium"}
                                    size={20}
                                    color={speakingText === example.german ? Colors.white : Colors.primary[500]}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={styles.footerSpacing} />
            </ScrollView>

            {/* Footer Action */}
            <View style={styles.footer}>
                {!isCompleted ? (
                    <Button
                        title="Complete Lesson"
                        onPress={handleComplete}
                        size="large"
                        fullWidth
                        icon={<Ionicons name="checkmark-circle" size={20} color={Colors.white} />}
                    />
                ) : (
                    <View style={styles.completionContainer}>
                        <View style={styles.completionMessage}>
                            <Ionicons name="checkmark-circle" size={24} color={Colors.success[700]} />
                            <Text style={styles.completionText}>Lesson Completed!</Text>
                        </View>
                        <Button
                            title="Next Lesson"
                            onPress={handleNextLesson}
                            size="large"
                            fullWidth
                            variant="primary"
                            icon={<Ionicons name="arrow-forward" size={20} color={Colors.white} />}
                        />
                    </View>
                )}
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
        padding: Spacing.base,
        backgroundColor: theme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
        gap: Spacing.md,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
    },
    content: {
        padding: Spacing.base,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    introCard: {
        marginBottom: Spacing.lg,
    },
    description: {
        fontSize: FontSize.base,
        color: theme.text.primary,
        lineHeight: 24,
        marginBottom: Spacing.md,
    },
    contextContainer: {
        backgroundColor: theme.background.tertiary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    contextRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    contextLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: theme.text.secondary,
        width: 45,
    },
    contextValue: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
        marginTop: Spacing.sm,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    exampleTouchable: {
        marginBottom: Spacing.md,
        borderRadius: BorderRadius.lg,
        ...Shadows.sm,
    },
    exampleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    exampleCardActive: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[50],
    },
    numberContainer: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
        backgroundColor: theme.background.tertiary,
        borderRadius: BorderRadius.full,
    },
    numberText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: theme.text.tertiary,
    },
    numberTextActive: {
        color: Colors.primary[700],
    },
    contentContainer: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    exampleGerman: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginBottom: 4,
    },
    exampleGermanActive: {
        color: Colors.primary[700],
    },
    exampleEnglish: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        fontStyle: 'italic',
    },
    speakerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.background.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    speakerButtonActive: {
        backgroundColor: Colors.primary[500],
    },
    footerSpacing: {
        height: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.background.primary,
        padding: Spacing.base,
        borderTopWidth: 1,
        borderTopColor: theme.border.light,
        ...Shadows.md,
    },
    completionContainer: {
        width: '100%',
    },
    completionMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
        gap: Spacing.sm,
    },
    completionText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.success[700],
    },
});
