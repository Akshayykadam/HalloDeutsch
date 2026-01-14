// Grammar Topics Screen - Grammar lessons organized by level
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { Card, Badge, ProgressBar, Button, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LevelColors, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { CEFRLevel, GrammarTopic } from '../../types';
import { getGrammarTopics } from '../../services/contentService';



import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type GrammarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Grammar'>;

export const GrammarScreen: React.FC = () => {
    const navigation = useNavigation<GrammarScreenNavigationProp>();
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { progress } = useUserStore();
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(progress.level);
    const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
    const [speakingText, setSpeakingText] = useState<string | null>(null);

    const speakGerman = async (text: string) => {
        setSpeakingText(text);
        await audioService.speak(text);
        setSpeakingText(null);
    };

    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

    const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            const data = await getGrammarTopics(selectedLevel);
            setGrammarTopics(data);
            setLoading(false);
        };
        fetchTopics();
    }, [selectedLevel]);

    const filteredTopics = grammarTopics;

    if (loading && !selectedTopic) {
        return (
            <SafeArea style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            </SafeArea>
        );
    }

    if (selectedTopic) {
        return (
            <SafeArea style={styles.container}>
                <View style={styles.topicHeader}>
                    <TouchableOpacity
                        onPress={() => setSelectedTopic(null)}
                        style={styles.backButtonTouchable}
                    >
                        <Ionicons name="arrow-back" size={20} color={Colors.primary[500]} />
                        <Text style={styles.backButton}>Back</Text>
                    </TouchableOpacity>
                    <Badge label={selectedTopic.level} variant="level" level={selectedTopic.level} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.topicTitle}>{selectedTopic.title}</Text>
                    <Text style={styles.topicTitleDe}>{selectedTopic.titleDe}</Text>
                    <Text style={styles.topicDescription}>{selectedTopic.description}</Text>

                    <Card style={styles.progressCard}>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressValue}>
                                {selectedTopic.completedLessons}/{selectedTopic.lessons} lessons
                            </Text>
                        </View>
                        <ProgressBar
                            progress={(selectedTopic.completedLessons / selectedTopic.lessons) * 100}
                            height={8}
                        />
                    </Card>

                    <Text style={styles.sectionTitle}>Examples (Tap to listen)</Text>
                    {selectedTopic.examples.map((example, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => speakGerman(example.german)}
                            activeOpacity={0.7}
                        >
                            <Card variant="flat" style={[
                                styles.exampleCard,
                                speakingText === example.german && styles.exampleCardActive
                            ]}>
                                <View style={styles.exampleHeader}>
                                    <Text style={[
                                        styles.exampleGerman,
                                        speakingText === example.german && styles.exampleGermanActive
                                    ]}>{example.german}</Text>
                                    <Ionicons
                                        name={speakingText === example.german ? "volume-high" : "volume-medium"}
                                        size={20}
                                        color={speakingText === example.german ? Colors.primary[600] : Colors.neutral[400]}
                                    />
                                </View>
                                <Text style={styles.exampleEnglish}>{example.english}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}

                    <Button
                        title="Start Lesson"
                        onPress={() => {
                            // Find a lesson that matches this topic or use topic ID as pseudo-lesson ID
                            // Ideally we query for the specific lesson, but for now we can pass the topic ID
                            // and letting GrammarLessonScreen handle it is the most robust way given our current data structure.
                            // However, GrammarLessonScreen expects a 'lessonId'. 
                            // Since we don't have a direct link from Topic -> LessonId in the topic object,
                            // we will attempt to find a lesson with this topic in the curriculum, 
                            // or fallback to a constructing a valid lesson ID format if possible.

                            // For now, let's pass a special ID format that GrammarLessonScreen can detect,
                            // or simply assume there's a lesson with ID matching the topic (which might not be true).

                            // BETTER APPROACH: Search for a lesson with this topic
                            // But that requires async searching which we can't do easily in this onPress.
                            // So we will navigate to GrammarLessonScreen and let it handle the lookup or display the topic directly.
                            // We'll pass the topic.id as the lessonId, and update GrammarLessonScreen to handle this case.
                            navigation.navigate('GrammarLesson', { lessonId: selectedTopic.id });
                        }}
                        size="large"
                        fullWidth
                    />
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
                    <Ionicons name="document-text" size={24} color={Colors.primary[500]} />
                    <Text style={styles.headerTitle}>Grammar</Text>
                </View>
                <Text style={styles.headerSubtitle}>Master German grammar step by step</Text>
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
                {filteredTopics.map((topic) => (
                    <TouchableOpacity
                        key={topic.id}
                        onPress={() => setSelectedTopic(topic)}
                        activeOpacity={0.8}
                    >
                        <Card style={styles.topicCard}>
                            <View style={styles.topicCardHeader}>
                                <View style={styles.topicCardInfo}>
                                    <Text style={styles.topicCardTitle}>{topic.title}</Text>
                                    <Text style={styles.topicCardTitleDe}>{topic.titleDe}</Text>
                                </View>
                                <View style={styles.lessonCount}>
                                    <Text style={styles.lessonCountText}>
                                        {topic.completedLessons}/{topic.lessons}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.topicCardDescription}>{topic.description}</Text>
                            <ProgressBar
                                progress={(topic.completedLessons / topic.lessons) * 100}
                                height={4}
                            />
                        </Card>
                    </TouchableOpacity>
                ))}

                {filteredTopics.length === 0 && (
                    <Card variant="flat" style={styles.emptyCard}>
                        <Ionicons name="library" size={48} color={Colors.neutral[300]} style={{ marginBottom: 16 }} />
                        <Text style={styles.emptyText}>
                            Grammar topics for {selectedLevel} coming soon!
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
    topicCard: {
        marginBottom: Spacing.md,
    },
    topicCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    topicCardInfo: {
        flex: 1,
    },
    topicCardTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    topicCardTitleDe: {
        fontSize: FontSize.sm,
        color: Colors.primary[500],
        marginTop: 2,
    },
    topicCardDescription: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginBottom: Spacing.md,
        lineHeight: 20,
    },
    lessonCount: {
        backgroundColor: Colors.primary[50],
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        marginLeft: Spacing.sm,
    },
    lessonCountText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.primary[600],
    },
    emptyCard: {
        alignItems: 'center',
        padding: Spacing['2xl'],
    },
    emptyText: {
        fontSize: FontSize.base,
        color: theme.text.secondary,
        textAlign: 'center',
    },
    // Topic detail styles
    topicHeader: {
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
    topicTitle: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    topicTitleDe: {
        fontSize: FontSize.lg,
        color: Colors.primary[500],
        marginTop: Spacing.xs,
        marginBottom: Spacing.md,
    },
    topicDescription: {
        fontSize: FontSize.base,
        color: theme.text.secondary,
        lineHeight: 24,
        marginBottom: Spacing.lg,
    },
    progressCard: {
        marginBottom: Spacing.xl,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    progressLabel: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
    },
    progressValue: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: theme.text.primary,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.md,
    },
    exampleCard: {
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    exampleCardActive: {
        borderColor: Colors.primary[300],
        backgroundColor: Colors.primary[50],
    },
    exampleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.xs,
    },
    exampleGerman: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: theme.text.primary,
        flex: 1,
        marginRight: Spacing.sm,
    },
    exampleGermanActive: {
        color: Colors.primary[700],
    },
    exampleEnglish: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
    },
});
