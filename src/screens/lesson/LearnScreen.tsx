// Curriculum Learning Path Screen - CEFR-aligned module and lesson navigation
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, ProgressBar, Badge, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LevelColors, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { CEFRLevel, CurriculumModule, CurriculumLesson } from '../../types';
import { getLevelStats, AVAILABLE_LEVELS, LEVEL_DESCRIPTIONS } from '../../data/content/curriculum-service';
import { getCurriculumModules, getCurriculumModule } from '../../services/contentService';
import { getLevelTitle } from '../../utils/levelUtils';
import { VocabularyScreen } from '../vocabulary';
import { GrammarScreen } from '../grammar';
import { DictionaryScreen } from '../dictionary';
import { SentenceFormationScreen } from '../sentences';
import { ReadingScreen } from '../reading';
import { LessonChatScreen } from './LessonChatScreen';
import { AlphabetScreen } from './AlphabetScreen';
import { NumbersScreen } from './NumbersScreen';
import { VocabularyLessonScreen } from './VocabularyLessonScreen';
import { GrammarLessonScreen } from './GrammarLessonScreen';
import { QuizScreen } from './QuizScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Level descriptions for summary cards
const LEVEL_INFO: Record<CEFRLevel, { name: string; nameDe: string; description: string }> = {
    A1: { name: 'Foundations', nameDe: 'Grundlagen', description: 'Basic greetings, numbers, simple sentences' },
    A2: { name: 'Expansion', nameDe: 'Erweiterung', description: 'Past tense, daily routines, travel' },
    B1: { name: 'Independence', nameDe: 'Selbstständigkeit', description: 'Express opinions, narrate experiences' },
    B2: { name: 'Precision', nameDe: 'Präzision', description: 'Complex arguments, nuanced expression' },
};

// Get modules for a level (now uses curriculum-service for all levels)
// Function is imported from curriculum-service

// ============================================
// Module Card Component
// ============================================
interface ModuleCardProps {
    module: CurriculumModule;
    onPress: () => void;
    levelColor: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onPress, levelColor }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const completedLessons = module.lessons.filter(l => l.isCompleted).length;
    const totalLessons = module.lessons.length;
    const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return (
        <TouchableOpacity
            activeOpacity={module.isLocked ? 1 : 0.7}
            disabled={module.isLocked}
            onPress={onPress}
            style={styles.moduleCardWrapper}
        >
            <View style={[styles.moduleCard, module.isLocked && styles.moduleCardLocked]}>
                {/* Icon and Status */}
                <View style={styles.moduleHeader}>
                    <View style={[
                        styles.moduleIcon,
                        { backgroundColor: module.isLocked ? Colors.neutral[200] : levelColor + '15' }
                    ]}>
                        {module.isLocked ? (
                            <Ionicons name="lock-closed" size={22} color={Colors.neutral[400]} />
                        ) : (
                            <Ionicons
                                name={module.iconName as keyof typeof Ionicons.glyphMap}
                                size={22}
                                color={levelColor}
                            />
                        )}
                    </View>
                    <View style={styles.moduleHeaderText}>
                        <Text style={[
                            styles.moduleOrder,
                            { color: module.isLocked ? Colors.neutral[400] : levelColor }
                        ]}>
                            MODULE {module.order}
                        </Text>
                        <Text style={[
                            styles.moduleTitle,
                            module.isLocked && { color: Colors.neutral[500] }
                        ]}>
                            {module.title}
                        </Text>
                    </View>
                    {!module.isLocked && (
                        <View style={styles.lessonCount}>
                            <Text style={styles.lessonCountText}>
                                {completedLessons}/{totalLessons}
                            </Text>
                        </View>
                    )}
                </View>

                {/* German Title & Description */}
                <Text style={styles.moduleTitleDe}>{module.titleDe}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>

                {/* Outcome - What you'll learn */}
                {!module.isLocked && (
                    <View style={styles.outcomeContainer}>
                        <Ionicons name="checkmark-circle" size={14} color={Colors.success[500]} />
                        <Text style={styles.outcomeText}>{module.outcome}</Text>
                    </View>
                )}

                {/* Progress Bar */}
                {!module.isLocked && (
                    <View style={styles.moduleProgress}>
                        <View style={styles.progressBarBg}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${progressPercent}%`, backgroundColor: levelColor }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {progressPercent > 0 ? `${Math.round(progressPercent)}%` : 'Start'}
                        </Text>
                    </View>
                )}

                {/* Time Estimate */}
                <View style={styles.moduleFooter}>
                    <Ionicons
                        name="time-outline"
                        size={14}
                        color={module.isLocked ? Colors.neutral[400] : Colors.neutral[500]}
                    />
                    <Text style={[
                        styles.timeEstimate,
                        module.isLocked && { color: Colors.neutral[400] }
                    ]}>
                        ~{module.estimatedHours}h
                    </Text>
                    <View style={styles.dotSeparator} />
                    <Ionicons
                        name="book-outline"
                        size={14}
                        color={module.isLocked ? Colors.neutral[400] : Colors.neutral[500]}
                    />
                    <Text style={[
                        styles.timeEstimate,
                        module.isLocked && { color: Colors.neutral[400] }
                    ]}>
                        {totalLessons} lessons
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ============================================
// Module Detail Screen - Lesson List
// ============================================
const ModuleDetailScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
    const { moduleId, startIndex } = route.params;
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { progress } = useUserStore();
    const [module, setModule] = useState<CurriculumModule | null>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchModule = async () => {
            setLoading(true);
            const data = await getCurriculumModule(moduleId);
            setModule(data);
            setLoading(false);
        };
        fetchModule();
    }, [moduleId]);

    if (loading) {
        return (
            <SafeArea style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            </SafeArea>
        );
    }

    if (!module) {
        return (
            <SafeArea style={styles.container}>
                <Text>Module not found</Text>
            </SafeArea>
        );
    }

    const levelColor = LevelColors[module.levelId];
    // Need to re-fetch modules for calculating global index? 
    // Or just store lesson counts?
    // For now, let's skip the accurate "previous lessons count" logic or fetch all modules first.
    // Ideally we pass that info or fetch all modules.
    // Let's simplified: just assume local index for now or fetch all sibling modules.

    const handleLessonPress = (lesson: CurriculumLesson) => {
        // special routing for Pronunciation lessons (Alphabet, Umlauts, Sounds)
        if (lesson.type === 'pronunciation' || lesson.title.toLowerCase().includes('alphabet')) {
            navigation.navigate('Alphabet', { lessonId: lesson.id });
            return;
        }

        if (lesson.vocabularyDomains?.includes('numbers') || lesson.title.toLowerCase().includes('number')) {
            navigation.navigate('Numbers', { lessonId: lesson.id });
            return;
        }

        if (lesson.type === 'vocabulary') {
            navigation.navigate('VocabularyLesson', { lessonId: lesson.id });
            return;
        }

        if (lesson.type === 'grammar') {
            navigation.navigate('GrammarLesson', { lessonId: lesson.id });
            return;
        }

        if (lesson.type === 'quiz') {
            navigation.navigate('Quiz', { lessonId: lesson.id });
            return;
        }

        // Route 'mixed' and other types to vocabulary by default (no AI chat)
        navigation.navigate('VocabularyLesson', { lessonId: lesson.id });
    };

    return (
        <SafeArea style={styles.container}>
            {/* Header */}
            <View style={styles.detailHeader}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <View style={styles.detailHeaderText}>
                    <Text style={[styles.detailModuleLabel, { color: levelColor }]}>
                        {getLevelTitle(module.levelId as CEFRLevel)} • MODULE {module.order}
                    </Text>
                    <Text style={styles.detailTitle}>{module.title}</Text>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Module Summary Card */}
                <LinearGradient
                    colors={[levelColor, levelColor + 'CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.moduleSummaryCard}
                >
                    <View style={styles.moduleSummaryContent}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.moduleSummaryTitle}>Learning Outcome</Text>
                            <Text style={styles.moduleSummaryText}>{module.outcome}</Text>
                        </View>
                        <Ionicons
                            name={module.iconName as keyof typeof Ionicons.glyphMap}
                            size={40}
                            color="rgba(255,255,255,0.3)"
                        />
                    </View>
                </LinearGradient>

                {/* Lessons List */}
                <Text style={styles.sectionHeader}>Lessons</Text>

                {module.lessons.map((lesson, index) => {
                    const isLast = index === module.lessons.length - 1;

                    // Calculate dynamic status
                    // Count previous lessons using passed startIndex
                    const previousLessonsCount = startIndex || 0;

                    const globalIndex = previousLessonsCount + index;
                    const isLessonCompleted = globalIndex < progress.lessonsCompleted;
                    const isLessonUnlocked = true; // All lessons unlocked
                    const isLessonLocked = false; // All lessons unlocked

                    return (
                        <View key={lesson.id} style={styles.lessonItem}>
                            {/* Timeline connector */}
                            {!isLast && (
                                <View style={[
                                    styles.timelineConnector,
                                    { backgroundColor: isLessonLocked ? Colors.neutral[200] : levelColor }
                                ]} />
                            )}

                            {/* Status node */}
                            <View style={[
                                styles.lessonNode,
                                isLessonLocked
                                    ? styles.lessonNodeLocked
                                    : isLessonCompleted
                                        ? { backgroundColor: levelColor, borderColor: levelColor }
                                        : { backgroundColor: Colors.white, borderColor: levelColor, borderWidth: 2 }
                            ]}>
                                {isLessonLocked ? (
                                    <Ionicons name="lock-closed" size={12} color={Colors.neutral[400]} />
                                ) : isLessonCompleted ? (
                                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                                ) : (
                                    <Text style={[styles.lessonNodeNumber, { color: levelColor }]}>
                                        {index + 1}
                                    </Text>
                                )}
                            </View>

                            {/* Lesson Card */}
                            <TouchableOpacity
                                activeOpacity={isLessonLocked ? 1 : 0.7}
                                disabled={isLessonLocked}
                                onPress={() => handleLessonPress(lesson)}
                                style={styles.lessonCardWrapper}
                            >
                                <View style={[
                                    styles.lessonCard,
                                    isLessonLocked && styles.lessonCardLocked
                                ]}>
                                    <View style={styles.lessonCardHeader}>
                                        <Text style={[
                                            styles.lessonType,
                                            { color: isLessonLocked ? Colors.neutral[400] : levelColor }
                                        ]}>
                                            {lesson.type.toUpperCase()}
                                        </Text>
                                        <Text style={styles.lessonTime}>
                                            {lesson.estimatedMinutes} min
                                        </Text>
                                    </View>

                                    <Text style={[
                                        styles.lessonTitle,
                                        isLessonLocked && { color: Colors.neutral[500] }
                                    ]}>
                                        {lesson.title}
                                    </Text>
                                    <Text style={styles.lessonTitleDe}>{lesson.titleDe}</Text>

                                    {/* What/Why/Where Context - Only for unlocked */}
                                    {!isLessonLocked && (
                                        <View style={styles.lessonContext}>
                                            <View style={styles.contextItem}>
                                                <Text style={styles.contextLabel}>What:</Text>
                                                <Text style={styles.contextValue}>{lesson.whatLearning}</Text>
                                            </View>
                                            <View style={styles.contextItem}>
                                                <Text style={styles.contextLabel}>Why:</Text>
                                                <Text style={styles.contextValue}>{lesson.whyLearning}</Text>
                                            </View>
                                            <View style={styles.contextItem}>
                                                <Text style={styles.contextLabel}>Where:</Text>
                                                <Text style={styles.contextValue}>{lesson.whereUsed}</Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Progress for in-progress lessons */}
                                    {!lesson.isLocked && lesson.progress > 0 && !lesson.isCompleted && (
                                        <View style={styles.lessonProgress}>
                                            <View style={styles.progressBarBg}>
                                                <View
                                                    style={[
                                                        styles.progressBarFill,
                                                        { width: `${lesson.progress}%`, backgroundColor: levelColor }
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.lessonProgressText}>
                                                {lesson.progress}%
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeArea>
    );
};

// ============================================
// Lesson Detail Screen - Now using LessonChatScreen
// ============================================
// LessonChatScreen is imported and used directly in the navigator

// ============================================
// Main Learning Path Screen
// ============================================
const LearnHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { progress } = useUserStore();
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(progress.level);
    const [rawModules, setRawModules] = useState<CurriculumModule[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);

    // Sync selectedLevel with user's actual level on first load
    React.useEffect(() => {
        if (!hasInitialized && progress.level) {
            setSelectedLevel(progress.level);
            setHasInitialized(true);
        }
    }, [progress.level, hasInitialized]);

    React.useEffect(() => {
        const fetchModules = async () => {
            setLoading(true);
            const data = await getCurriculumModules(selectedLevel);
            setRawModules(data);
            setLoading(false);
        };
        fetchModules();
    }, [selectedLevel]);

    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
    const currentLevelIndex = levels.indexOf(selectedLevel);
    let levelOffset = 0;
    for (let i = 0; i < currentLevelIndex; i++) {
        levelOffset += getLevelStats(levels[i]).lessons;
    }

    // Process modules to add dynamic locking/progress
    let cumulativeLessonCount = levelOffset;
    const moduleStarts: Record<string, number> = {};

    const modules = rawModules.map(m => {
        const moduleStart = cumulativeLessonCount;
        moduleStarts[m.id] = moduleStart;
        const moduleLength = m.lessons.length;
        cumulativeLessonCount += moduleLength;

        // Determine lock status based on completed lessons
        // Module is unlocked if we have completed enough lessons to reach it
        // Special case: If level is not A1, it might be locked entirely, but for now we assume A1 logic
        const isModuleLocked = false; // All modules unlocked

        // Update lessons with completion status for the card count
        const updatedLessons = m.lessons.map((l, idx) => ({
            ...l,
            isCompleted: progress.lessonsCompleted > (moduleStart + idx),
            isLocked: false // All lessons unlocked
        }));

        return {
            ...m,
            isLocked: isModuleLocked,
            lessons: updatedLessons
        };
    });
    const levelInfo = LEVEL_INFO[selectedLevel];
    const levelColor = LevelColors[selectedLevel];

    // Check if level has modules
    const isLevelAvailable = modules.length > 0 || loading;

    const handleModulePress = (module: CurriculumModule) => {
        if (module.isLocked) return;
        navigation.navigate('ModuleDetail', {
            moduleId: module.id,
            startIndex: moduleStarts[module.id] || 0
        });
    };

    return (
        <SafeArea style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Learning Path</Text>
                    <Text style={styles.headerSubtitle}>
                        {levelInfo.name} • {levelInfo.nameDe}
                    </Text>
                </View>
                <Badge label={getLevelTitle(selectedLevel)} variant="level" level={selectedLevel} />
            </View>

            {/* Level Selector Tabs */}
            <View style={styles.levelSelectorContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.levelSelectorContent}
                >
                    {levels.map((level) => {
                        const isActive = selectedLevel === level;
                        const isAvailable = true; // For now assume all levels available or check elsewhere
                        const color = LevelColors[level];

                        return (
                            <TouchableOpacity
                                key={level}
                                onPress={() => setSelectedLevel(level)}
                                activeOpacity={0.7}
                                style={[
                                    styles.levelPill,
                                    isActive
                                        ? { backgroundColor: color }
                                        : { borderColor: color, borderWidth: 1.5, backgroundColor: 'transparent' }
                                ]}
                            >
                                {!isAvailable && !isActive && (
                                    <Ionicons
                                        name="lock-closed"
                                        size={12}
                                        color={color}
                                        style={{ marginRight: 4 }}
                                    />
                                )}
                                <Text style={[
                                    styles.levelPillText,
                                    isActive ? { color: Colors.white } : { color: color }
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
                {/* Level Description Card */}
                <LinearGradient
                    colors={[levelColor, levelColor + 'CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.levelInfoCard}
                >
                    <View style={styles.levelInfoContent}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.levelInfoTitle}>{getLevelTitle(selectedLevel)}</Text>
                            <Text style={styles.levelInfoDesc}>{levelInfo.description}</Text>
                            {isLevelAvailable && (
                                <View style={styles.levelStats}>
                                    <Text style={styles.levelStatText}>
                                        {getLevelStats(selectedLevel).modules} modules • {getLevelStats(selectedLevel).lessons} lessons
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Ionicons name="school" size={40} color="rgba(255,255,255,0.3)" />
                    </View>
                </LinearGradient>

                {/* Modules List or Coming Soon */}
                {isLevelAvailable ? (
                    <>
                        <Text style={styles.sectionHeader}>Modules</Text>
                        {modules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                module={module}
                                levelColor={levelColor}
                                onPress={() => handleModulePress(module)}
                            />
                        ))}
                    </>
                ) : (
                    <View style={styles.comingSoonContainer}>
                        <Ionicons name="hourglass-outline" size={48} color={Colors.neutral[400]} />
                        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
                        <Text style={styles.comingSoonText}>
                            {selectedLevel} content is being developed.
                            {'\n'}Complete A1 to unlock higher levels.
                        </Text>
                    </View>
                )}


            </ScrollView>
        </SafeArea>
    );
};

// ============================================
// Stack Navigator
// ============================================
const LearnStack = createNativeStackNavigator();

export const LearnScreen: React.FC = () => {
    return (
        <LearnStack.Navigator screenOptions={{ headerShown: false }}>
            <LearnStack.Screen name="LearnHome" component={LearnHomeScreen} />
            <LearnStack.Screen name="ModuleDetail" component={ModuleDetailScreen} />
            <LearnStack.Screen name="LessonDetail" component={LessonChatScreen} />
            <LearnStack.Screen name="Alphabet" component={AlphabetScreen} />
            <LearnStack.Screen name="Numbers" component={NumbersScreen} />
            <LearnStack.Screen name="VocabularyLesson" component={VocabularyLessonScreen} />


            <LearnStack.Screen name="Grammar" component={GrammarScreen} />
            <LearnStack.Screen name="GrammarLesson" component={GrammarLessonScreen} />
            <LearnStack.Screen name="Quiz" component={QuizScreen} />
            <LearnStack.Screen name="Dictionary" component={DictionaryScreen} />
            <LearnStack.Screen name="Sentences" component={SentenceFormationScreen} />
            <LearnStack.Screen name="Reading" component={ReadingScreen} />
        </LearnStack.Navigator>
    );
};

// ============================================
// Styles
// ============================================
const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    header: {
        padding: Spacing.base,
        paddingTop: Spacing.lg,
        backgroundColor: theme.background.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
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
    },
    levelSelectorContent: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.md,
    },
    levelPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        minWidth: 70,
        justifyContent: 'center',
    },
    levelPillText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.base,
    },
    sectionHeader: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: theme.text.secondary,
        marginBottom: Spacing.md,
        marginTop: Spacing.lg,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    levelInfoCard: {
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
    },
    levelInfoContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelInfoTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        marginBottom: 4,
    },
    levelInfoDesc: {
        fontSize: FontSize.sm,
        color: Colors.white,
        opacity: 0.9,
    },
    levelStats: {
        marginTop: Spacing.sm,
    },
    levelStatText: {
        fontSize: FontSize.xs,
        color: Colors.white,
        opacity: 0.8,
    },

    // Module Card Styles
    moduleCardWrapper: {
        marginBottom: Spacing.md,
    },
    moduleCard: {
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    moduleCardLocked: {
        backgroundColor: theme.background.tertiary,
        shadowOpacity: 0,
        elevation: 0,
    },
    moduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    moduleIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moduleHeaderText: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    moduleOrder: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        letterSpacing: 1,
    },
    moduleTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    lessonCount: {
        backgroundColor: theme.background.tertiary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    lessonCountText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: theme.text.secondary,
    },
    moduleTitleDe: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
        fontStyle: 'italic',
        marginBottom: Spacing.xs,
    },
    moduleDescription: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        lineHeight: 20,
        marginBottom: Spacing.sm,
    },
    outcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.success[50],
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.md,
    },
    outcomeText: {
        fontSize: FontSize.xs,
        color: Colors.success[700],
        marginLeft: Spacing.xs,
        flex: 1,
    },
    moduleProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    progressBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: theme.border.light,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: theme.text.secondary,
        marginLeft: Spacing.sm,
        minWidth: 40,
        textAlign: 'right',
    },
    moduleFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeEstimate: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
        marginLeft: 4,
    },
    dotSeparator: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: theme.text.tertiary,
        marginHorizontal: Spacing.sm,
    },

    // Detail Screen Styles
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: theme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    detailHeaderText: {
        flex: 1,
    },
    detailModuleLabel: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        letterSpacing: 1,
    },
    detailTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    moduleSummaryCard: {
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
    },
    moduleSummaryContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moduleSummaryTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
        opacity: 0.9,
        marginBottom: 4,
    },
    moduleSummaryText: {
        fontSize: FontSize.base,
        color: Colors.white,
        fontWeight: FontWeight.medium,
    },

    // Lesson Item Styles
    lessonItem: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
        position: 'relative',
    },
    timelineConnector: {
        position: 'absolute',
        left: 13,
        top: 28,
        bottom: -22, // Extend to next node (Spacing.md + adjustments)
        width: 2,
        backgroundColor: theme.border.light,
    },
    lessonNode: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background.tertiary,
        marginRight: Spacing.md,
        marginTop: 6,
        zIndex: 1,
    },
    lessonNodeLocked: {
        backgroundColor: theme.background.tertiary,
        borderWidth: 2,
        borderColor: Colors.neutral[300],
    },
    lessonNodeNumber: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    lessonCardWrapper: {
        flex: 1,
    },
    lessonCard: {
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        ...Shadows.sm,
    },
    lessonCardLocked: {
        backgroundColor: theme.background.tertiary,
        shadowOpacity: 0,
        elevation: 0,
    },
    lessonCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    lessonType: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        letterSpacing: 1,
    },
    lessonTime: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
    },
    lessonTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    lessonTitleDe: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
        fontStyle: 'italic',
        marginBottom: Spacing.sm,
    },
    lessonContext: {
        backgroundColor: theme.background.secondary,
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginTop: Spacing.sm,
    },
    contextItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    contextLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: theme.text.secondary,
        width: 42,
    },
    contextValue: {
        fontSize: FontSize.xs,
        color: theme.text.secondary,
        flex: 1,
    },
    lessonProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    lessonProgressText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: theme.text.secondary,
        marginLeft: Spacing.sm,
    },

    // Coming Soon
    comingSoonContainer: {
        alignItems: 'center',
        paddingVertical: Spacing['3xl'],
    },
    comingSoonTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginTop: Spacing.md,
    },
    comingSoonText: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        textAlign: 'center',
        marginTop: Spacing.sm,
        lineHeight: 20,
    },

    // Placeholder
    placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    placeholderText: {
        fontSize: FontSize.base,
        color: theme.text.secondary,
        marginTop: Spacing.md,
        textAlign: 'center',
    },
    placeholderSubtext: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },

    // Quick Tools
    toolsRow: {
        gap: Spacing.md,
    },
    toolCard: {
        backgroundColor: theme.background.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        width: 90,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    toolIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    toolTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
});
