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
import { CEFRLevel } from '../../types';
import { GrammarTopic } from '../../data/content/grammar-content';
import { getGrammarTopics } from '../../services/contentService';
import { GrammarTable } from '../../components/grammar/GrammarTable';
import { getLevelTitle } from '../../utils/levelUtils';



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
    const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'tips'>('learn');

    const speakGerman = async (text: string) => {
        setSpeakingText(text);
        await audioService.speak(text);
        setSpeakingText(null);
    };

    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

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
                        onPress={() => { setSelectedTopic(null); setActiveTab('learn'); }}
                        style={styles.backButtonTouchable}
                    >
                        <Ionicons name="arrow-back" size={20} color={Colors.primary[500]} />
                        <Text style={styles.backButton}>Back</Text>
                    </TouchableOpacity>
                    <Badge label={selectedTopic.level} variant="level" level={selectedTopic.level} />
                </View>

                {/* Topic Header */}
                <View style={styles.topicHeaderInfo}>
                    <Text style={styles.topicTitle}>{selectedTopic.title}</Text>
                    <Text style={styles.topicTitleDe}>{selectedTopic.titleDe}</Text>
                </View>

                {/* Tab Bar */}
                <View style={styles.tabBar}>
                    {(['learn', 'examples', 'tips'] as const).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabButton,
                                activeTab === tab && styles.tabButtonActive
                            ]}
                        >
                            <Ionicons
                                name={tab === 'learn' ? 'book' : tab === 'examples' ? 'list' : 'bulb'}
                                size={16}
                                color={activeTab === tab ? Colors.white : theme.text.secondary}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[
                                styles.tabButtonText,
                                activeTab === tab && styles.tabButtonTextActive
                            ]}>
                                {tab === 'learn' ? 'Learn' : tab === 'examples' ? 'Examples' : 'Tips'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {/* Learn Tab */}
                    {activeTab === 'learn' && (
                        <>
                            {/* Show explanation if available, otherwise show description */}
                            {selectedTopic.explanation ? (
                                <Card style={styles.explanationCard}>
                                    <Text style={styles.explanationText}>{selectedTopic.explanation}</Text>
                                </Card>
                            ) : (
                                <Card style={styles.explanationCard}>
                                    <Text style={styles.explanationText}>{selectedTopic.description}</Text>
                                </Card>
                            )}

                            {/* Render tables if available */}
                            {selectedTopic.tables && selectedTopic.tables.length > 0 && (
                                <>
                                    {selectedTopic.tables.map((table, idx) => (
                                        <View key={idx} style={styles.tableSection}>
                                            <Text style={styles.tableTitle}>{table.title}</Text>
                                            <GrammarTable
                                                headers={table.headers}
                                                rows={table.rows}
                                            />
                                        </View>
                                    ))}
                                </>
                            )}

                            {selectedTopic.keyRules && selectedTopic.keyRules.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>Key Rules</Text>
                                    {selectedTopic.keyRules.map((rule: string, idx: number) => (
                                        <Card key={idx} variant="flat" style={styles.ruleCard}>
                                            <View style={styles.ruleRow}>
                                                <View style={styles.ruleBullet}>
                                                    <Text style={styles.ruleBulletText}>{idx + 1}</Text>
                                                </View>
                                                <Text style={styles.ruleText}>{rule}</Text>
                                            </View>
                                        </Card>
                                    ))}
                                </>
                            )}

                            {/* Fallback: Show examples preview if no key rules */}
                            {(!selectedTopic.keyRules || selectedTopic.keyRules.length === 0) && (
                                <Card variant="flat" style={{ marginTop: Spacing.md }}>
                                    <Text style={styles.tipText}>Tap the "Examples" tab to see usage examples with audio!</Text>
                                </Card>
                            )}
                        </>
                    )}

                    {/* Examples Tab */}
                    {activeTab === 'examples' && (
                        <>
                            <Text style={styles.sectionTitle}>Tap to listen</Text>
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
                        </>
                    )}

                    {/* Tips Tab */}
                    {activeTab === 'tips' && (
                        <>
                            {selectedTopic.tips && selectedTopic.tips.length > 0 && (
                                <>
                                    <View style={styles.tipsSectionHeader}>
                                        <Ionicons name="bulb" size={20} color={Colors.primary[400]} />
                                        <Text style={styles.tipsSectionTitle}>Learning Tips</Text>
                                    </View>
                                    {selectedTopic.tips.map((tip: string, idx: number) => (
                                        <View key={idx} style={styles.tipCard}>
                                            <View style={styles.tipIconContainer}>
                                                <Ionicons name="checkmark-circle" size={18} color={Colors.primary[400]} />
                                            </View>
                                            <Text style={styles.tipText}>{tip.replace(/^[🎯🔊📱📝🔄✍️💡🚗]+\s*/, '')}</Text>
                                        </View>
                                    ))}
                                </>
                            )}

                            {selectedTopic.commonMistakes && selectedTopic.commonMistakes.length > 0 && (
                                <>
                                    <View style={[styles.tipsSectionHeader, { marginTop: Spacing.xl }]}>
                                        <Ionicons name="warning" size={20} color={Colors.warning[400]} />
                                        <Text style={styles.tipsSectionTitle}>Common Mistakes</Text>
                                    </View>
                                    {selectedTopic.commonMistakes.map((mistake: string, idx: number) => (
                                        <View key={idx} style={styles.mistakeCard}>
                                            <View style={styles.mistakeIconContainer}>
                                                <Ionicons name="close-circle" size={18} color={Colors.error[400]} />
                                            </View>
                                            <Text style={styles.mistakeText}>{mistake.replace(/^[❌✅]+\s*/, '')}</Text>
                                        </View>
                                    ))}
                                </>
                            )}

                            {(!selectedTopic.tips || selectedTopic.tips.length === 0) &&
                                (!selectedTopic.commonMistakes || selectedTopic.commonMistakes.length === 0) && (
                                    <View style={styles.emptyState}>
                                        <Ionicons name="information-circle-outline" size={48} color={Colors.neutral[400]} />
                                        <Text style={styles.emptyText}>No tips available for this topic yet.</Text>
                                    </View>
                                )}
                        </>
                    )}
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
                                    {getLevelTitle(level)}
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
    // Tabbed UI styles
    topicHeaderInfo: {
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.md,
        backgroundColor: theme.background.primary,
    },
    tabBar: {
        flexDirection: 'row' as const,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
        backgroundColor: theme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.primary,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
        backgroundColor: theme.background.secondary,
    },
    tabButtonActive: {
        backgroundColor: Colors.primary[500],
    },
    tabButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: theme.text.secondary,
    },
    tabButtonTextActive: {
        color: Colors.white,
    },
    explanationCard: {
        marginBottom: Spacing.lg,
        backgroundColor: theme.background.secondary,
    },
    explanationText: {
        fontSize: FontSize.base,
        color: theme.text.primary,
        lineHeight: 24,
    },
    ruleCard: {
        marginBottom: Spacing.sm,
    },
    ruleRow: {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
    },
    ruleBullet: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary[500],
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginRight: Spacing.sm,
    },
    ruleBulletText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    ruleText: {
        flex: 1,
        fontSize: FontSize.base,
        color: theme.text.primary,
        lineHeight: 22,
    },
    tableSection: {
        marginVertical: Spacing.md,
    },
    tableTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.sm,
    },
    tipsSectionHeader: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    tipsSectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    tipCard: {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        marginBottom: Spacing.sm,
        backgroundColor: theme.background.secondary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
    },
    tipIconContainer: {
        marginRight: Spacing.sm,
        marginTop: 2,
    },
    tipText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        lineHeight: 20,
    },
    mistakeCard: {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        marginBottom: Spacing.sm,
        backgroundColor: theme.background.secondary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
    },
    mistakeIconContainer: {
        marginRight: Spacing.sm,
        marginTop: 2,
    },
    mistakeText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        lineHeight: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingVertical: Spacing['2xl'],
    },
});
