
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { LinearGradient } from 'expo-linear-gradient';

import { SafeArea, Button, Badge } from '../../components/ui';
import { ModuleCompleteModal, LessonCompleteModal } from '../../components/gamification';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { getLessonById, getCurriculumModule, getVocabularyByDomains } from '../../services/contentService';
import { VocabularyWord, CurriculumLesson, CurriculumModule } from '../../types';

const { width } = Dimensions.get('window');

export const VocabularyLessonScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lessonId } = route.params || {};
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const { updateProgress, progress } = useUserStore();
    const [speakingWord, setSpeakingWord] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showModuleComplete, setShowModuleComplete] = useState(false);
    const [showLessonComplete, setShowLessonComplete] = useState(false);

    const [lesson, setLesson] = useState<CurriculumLesson | null>(null);
    const [currentModule, setCurrentModule] = useState<CurriculumModule | null>(null);
    const [lessonWords, setLessonWords] = useState<VocabularyWord[]>([]);
    const [nextLesson, setNextLesson] = useState<CurriculumLesson | null>(null);
    const [loading, setLoading] = useState(true);

    const domainTitles: Record<string, string> = {
        'time': 'Time Expressions',
        'dates': 'Calendar & Dates',
        'colors': 'Colors',
        'adjectives': 'Adjectives & Sizes',
        'family': 'Family',
        'food': 'Food & Drinks',
        'household': 'Household Objects',
        'places': 'Places',
        'verbs': 'Common Verbs',
        'greetings': 'Greetings',
        'numbers': 'Numbers',
        'seasons': 'Seasons',
        'weather': 'Weather & Climate',
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const l = await getLessonById(lessonId);
                setLesson(l);

                if (l && l.vocabularyDomains && l.vocabularyDomains.length > 0) {
                    const words = await getVocabularyByDomains(l.vocabularyDomains);
                    setLessonWords(words);
                }

                if (l && l.moduleId) {
                    const m = await getCurriculumModule(l.moduleId);
                    setCurrentModule(m);
                    if (m) {
                        const idx = m.lessons.findIndex((x: any) => x.id === l.id);
                        if (idx >= 0 && idx < m.lessons.length - 1) {
                            setNextLesson(m.lessons[idx + 1]);
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        load();
    }, [lessonId]);

    const domains = lesson?.vocabularyDomains || [];
    const sections = domains.map(domain => {
        const words = lessonWords.filter(w => w.domain === domain);
        return {
            domain,
            title: domainTitles[domain] || domain.charAt(0).toUpperCase() + domain.slice(1),
            words
        };
    }).filter(s => s.words.length > 0);

    if (loading) {
        return (
            <SafeArea style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            </SafeArea>
        );
    }

    const speakWord = async (word: string) => {
        setSpeakingWord(word);
        await audioService.speak(word);
        setSpeakingWord(null);
    };

    const handleComplete = () => {
        if (isCompleted) return;
        setIsCompleted(true);

        // Update words learned count
        updateProgress({
            lessonsCompleted: progress.lessonsCompleted + 1,
            wordsLearned: progress.wordsLearned + lessonWords.length
        });
        setShowLessonComplete(true);
    };

    const handleLessonCompleteContinue = () => {
        setShowLessonComplete(false);

        if (nextLesson) {
            const nextLessonInModule = nextLesson;

            if (nextLessonInModule) {
                // Navigate to next lesson within module using replace to avoid stack buildup
                if (nextLessonInModule.vocabularyDomains?.includes('numbers')) {
                    navigation.replace('Numbers', { lessonId: nextLessonInModule.id });
                } else if (nextLessonInModule.type === 'vocabulary') {
                    navigation.replace('VocabularyLesson', { lessonId: nextLessonInModule.id });
                } else if (nextLessonInModule.type === 'pronunciation' || nextLessonInModule.title.toLowerCase().includes('alphabet')) {
                    navigation.replace('Alphabet', { lessonId: nextLessonInModule.id });
                } else if (nextLessonInModule.type === 'grammar') {
                    navigation.replace('GrammarLesson', { lessonId: nextLessonInModule.id });
                } else if (nextLessonInModule.type === 'quiz') {
                    navigation.replace('Quiz', { lessonId: nextLessonInModule.id });
                } else {
                    navigation.replace('LessonDetail', { lessonId: nextLessonInModule.id });
                }
            } else {
                // Last lesson in module - show module complete modal
                setShowModuleComplete(true);
            }
        } else {
            navigation.goBack();
        }
    };

    const handleModuleCompleteClose = () => {
        setShowModuleComplete(false);
        // Navigate back to Learn home screen
        navigation.navigate('LearnHome');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeArea style={styles.container}>
            {/* Lesson Complete Modal */}
            <LessonCompleteModal
                visible={showLessonComplete}
                lessonTitle={lesson?.title || 'Vocabulary'}
                xpEarned={15}
                onContinue={handleLessonCompleteContinue}
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
                    <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{lesson?.title || 'Vocabulary'}</Text>
                    <Text style={styles.headerSubtitle}>{lesson?.titleDe || 'Wortschatz'}</Text>
                </View>

            </View>

            {/* Info Banner */}
            <LinearGradient
                colors={[Colors.secondary[500], Colors.secondary[600]]} // Different color for Vocab
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.infoBanner}
            >
                <Ionicons name="book" size={18} color={Colors.white} />
                <Text style={styles.infoText}>
                    Tap any word to hear how it's pronounced.
                </Text>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Words Sections */}
                {sections.length > 0 ? (
                    sections.map((section) => (
                        <View key={section.domain} style={styles.sectionContainer}>
                            {sections.length > 1 && (
                                <Text style={styles.sectionHeader}>{section.title}</Text>
                            )}
                            <View style={styles.grid}>
                                {section.words.map((word) => (
                                    <TouchableOpacity
                                        key={word.id}
                                        style={[
                                            styles.card,
                                            speakingWord === word.german && styles.cardActive
                                        ]}
                                        onPress={() => speakWord(word.german)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.cardHeader}>
                                            {word.gender && (
                                                <Badge
                                                    label={word.gender}
                                                    variant="info"
                                                    size="small"
                                                    style={styles.genderBadge}
                                                />
                                            )}
                                            {speakingWord === word.german && (
                                                <Ionicons name="volume-high" size={16} color={Colors.primary[500]} />
                                            )}
                                        </View>

                                        <Text style={styles.germanWord}>{word.german}</Text>
                                        <Text style={styles.pronunciation}>/{word.pronunciation}/</Text>

                                        <View style={styles.divider} />

                                        <Text style={styles.englishWord}>{word.english}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No vocabulary found for this lesson.</Text>
                    </View>
                )}

                {/* Complete Button */}
                <View style={styles.footer}>
                    <Button
                        title={isCompleted ? "Completed" : "Complete Lesson"}
                        onPress={handleComplete}
                        size="large"
                        variant={isCompleted ? 'success' : 'secondary'} // Secondary variant for Vocab
                        icon={isCompleted ? <Ionicons name="checkmark-circle" size={24} color="white" /> : undefined}
                    />
                </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: theme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
    },
    backButton: {
        padding: Spacing.sm,
        marginRight: Spacing.sm,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        fontStyle: 'italic',
    },
    volumeButton: {
        padding: Spacing.sm,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    infoText: {
        color: Colors.white,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 40,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    card: {
        width: (width - Spacing.md * 3) / 2, // 2 columns
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    cardActive: {
        borderColor: Colors.primary[300],
        backgroundColor: Colors.primary[50], // Keep this for active state highlight
        ...Shadows.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.xs,
        height: 24,
    },
    genderBadge: {
        opacity: 0.8,
    },
    germanWord: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginBottom: 2,
    },
    pronunciation: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
        fontStyle: 'italic',
        marginBottom: Spacing.sm,
    },
    divider: {
        height: 1,
        backgroundColor: theme.border.light,
        marginVertical: Spacing.sm,
    },
    englishWord: {
        fontSize: FontSize.md,
        color: theme.text.secondary,
        fontWeight: FontWeight.medium,
    },
    footer: {
        marginTop: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    emptyContainer: {
        width: '100%',
        padding: Spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.text.tertiary,
        fontStyle: 'italic',
    },
    sectionContainer: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary[700],
        marginBottom: Spacing.md,
        marginTop: Spacing.xs,
        paddingLeft: Spacing.xs,
    },
});
