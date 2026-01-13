
// Grammar Lesson Screen - Interactive grammar learning with smart navigation
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { Card, Button, ProgressBar, Badge, SafeArea } from '../../components/ui';
import { ModuleCompleteModal } from '../../components/gamification';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows, Layout } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import * as Haptics from 'expo-haptics';
import { getModuleById, getLessonById, getModuleForLesson, getNextLessonInModule } from '../../data/content/curriculum-service';
import { getGrammarTopicForLesson } from '../../data/content/grammar-content';

export const GrammarLessonScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lessonId } = route.params;
    const { theme, isDark } = useTheme();
    const styles = getStyles(theme);
    const { progress, markLessonComplete, unlockNextLesson, updateGrammarTopicsCompleted } = useUserStore();

    const lesson = getLessonById(lessonId);

    // Get topic from grammar-content or create fallback from lesson data
    const grammarTopic = lesson ? getGrammarTopicForLesson(lesson.title) : undefined;
    const topic = grammarTopic || (lesson ? {
        id: lesson.id,
        title: lesson.title,
        titleDe: lesson.titleDe,
        description: lesson.whatLearning,
        level: lesson.id.startsWith('a2') ? 'A2' : lesson.id.startsWith('b1') ? 'B1' : lesson.id.startsWith('b2') ? 'B2' : 'A1',
        lessons: 1,
        completedLessons: 0,
        examples: [
            { german: lesson.whereUsed.split('.')[0] || lesson.titleDe, english: lesson.whyLearning }
        ]
    } : undefined);

    const [speakingText, setSpeakingText] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showModuleComplete, setShowModuleComplete] = useState(false);

    // Get current module for navigation
    const currentModule = lessonId ? getModuleForLesson(lessonId) : undefined;

    useEffect(() => {
        if (!lesson) return;
        // Check if already completed
        // Logic handled by store usually, but we can verify
    }, [lessonId]);

    const speakGerman = async (text: string) => {
        setSpeakingText(text);
        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        await audioService.speak(text);
        setSpeakingText(null);
    };

    const handleComplete = async () => {
        if (!lesson) return;

        // 1. Mark complete
        await markLessonComplete(lesson.id);
        setIsCompleted(true);

        // 2. Track grammar topic completion
        updateGrammarTopicsCompleted(1);

        // 3. Unlock next
        const nextId = unlockNextLesson(lesson.id);

        // 4. Find next lesson object
        let nextLesson = null;
        if (nextId) {
            nextLesson = getLessonById(nextId);
        }

        // Show changes visually (optional delay)
    };

    const handleNextLesson = () => {
        if (!lesson) return;

        // Check for next lesson within the same module
        const nextLessonInModule = getNextLessonInModule(lesson.id);

        if (nextLessonInModule) {
            // Navigate to next lesson within module using replace
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
            // Last lesson in module - show module complete modal
            setShowModuleComplete(true);
        }
    };

    const handleModuleCompleteClose = () => {
        setShowModuleComplete(false);
        navigation.navigate('LearnHome');
    };

    const handleBackPress = () => {
        // Navigate directly to module detail instead of going through lesson stack
        if (currentModule) {
            navigation.navigate('ModuleDetail', { moduleId: currentModule.id });
        } else {
            navigation.goBack();
        }
    };

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
