// Home Screen - Main dashboard with lessons, streak, and XP
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getLevelTitle } from '../../utils/levelUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, ProgressBar, Badge, SafeArea } from '../../components/ui';
import { StreakCounter, XPCounter, GoalCounter } from '../../components/gamification/StreakCounter';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { useResponsive } from '../../hooks';
import { generateWordOfDay } from '../../services/geminiService';
import * as audioService from '../../services/audioService';
import { getModulesForLevel } from '../../data/content/curriculum-service';
import { FadeInView } from '../../components/common/FadeInView';

export const HomeScreen: React.FC = () => {
    const { progress } = useUserStore();
    const { theme, isDark } = useTheme();
    const styles = getStyles(theme);
    const { isPhone } = useResponsive();
    const navigation = useNavigation<any>();

    const { checkStreak } = useUserStore();

    useFocusEffect(
        useCallback(() => {
            checkStreak();
        }, [checkStreak])
    );

    const navigateToLearn = (screen: string) => {
        navigation.navigate('Learn', { screen });
    };

    const navigateToPractice = () => {
        navigation.navigate('Practice');
    };

    // Word of the Day state
    const [wordOfDay, setWordOfDay] = useState<{
        word: string;
        translation: string;
        example: string;
        exampleTranslation: string;
        partOfSpeech: string;
    } | null>(null);
    const [loadingWord, setLoadingWord] = useState(false);

    // Fetch new word when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            const loadWordOfDay = async () => {
                try {
                    setLoadingWord(true);
                    const today = new Date().toISOString().split('T')[0];
                    const cachedData = await AsyncStorage.getItem('wordOfDay');

                    if (cachedData) {
                        const { date, data } = JSON.parse(cachedData);
                        if (date === today) {
                            setWordOfDay(data);
                            setLoadingWord(false);
                            return;
                        }
                    }

                    // Fetch new if no cache or outdated
                    const data = await generateWordOfDay(progress.level);
                    setWordOfDay(data);

                    // Cache the new word
                    await AsyncStorage.setItem('wordOfDay', JSON.stringify({
                        date: today,
                        data: data
                    }));

                } catch (error) {
                    console.error('Failed to load word of day:', error);
                } finally {
                    setLoadingWord(false);
                }
            };
            loadWordOfDay();
        }, [progress.level])
    );

    return (
        <SafeArea style={styles.container}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Guten Tag!</Text>
                    <Text style={styles.subtitle}>Ready to learn German?</Text>
                </View>
                <View style={styles.headerStats}>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('Dictionary')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.searchIconBg}>
                            <Ionicons name="search" size={20} color={Colors.primary[500]} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('Profile')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.profileAvatar}>
                            <Ionicons name="person" size={20} color={Colors.primary[500]} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Daily Progress Card */}
                <FadeInView delay={100}>
                    <Card variant="gradient" gradientColors={[Colors.primary[600], Colors.primary[800]]} style={styles.progressCard}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressTitle}>Daily Progress</Text>
                            <Badge label={`${progress.minutesToday}/${progress.dailyGoal} min`} variant="info" />
                        </View>

                        <ProgressBar
                            progress={(progress.minutesToday / progress.dailyGoal) * 100}
                            height={8}
                            variant="success"
                            style={{ marginBottom: Spacing.md }}
                        />

                        <View style={styles.statsRowInCard}>
                            <View style={styles.statPillInCard}>
                                <StreakCounter streak={progress.streak || 0} size="small" variant="card" label="Day Streak" vertical={true} />
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statPillInCard}>
                                <XPCounter xp={progress.totalXP || 0} size="small" variant="card" label="Total XP" vertical={true} />
                            </View>
                        </View>
                    </Card>
                </FadeInView>

                {/* Word of the Day Widget */}
                <FadeInView delay={200}>
                    <Card style={styles.wordCard}>
                        <View style={styles.wordHeader}>
                            <View style={styles.wordTitleRow}>
                                <Ionicons name="calendar-outline" size={18} color={Colors.primary[500]} />
                                <Text style={styles.wordCardTitle}>Word of the Day</Text>
                            </View>
                            {loadingWord && <ActivityIndicator size="small" color={Colors.primary[500]} />}
                        </View>
                        {wordOfDay && !loadingWord && (
                            <>
                                <View style={styles.wordMain}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.germanWord} numberOfLines={2}>
                                            {wordOfDay.word}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.speakerButton}
                                        onPress={() => audioService.speak(wordOfDay.word)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="volume-high" size={22} color={Colors.primary[500]} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.wordMetaContainer}>
                                    <Badge label={wordOfDay.partOfSpeech} variant="info" size="small" />
                                    <Text style={styles.wordTranslation}>{wordOfDay.translation}</Text>
                                </View>

                                <View style={styles.exampleContainer}>
                                    <View style={styles.exampleRow}>
                                        <Text style={[styles.exampleText, { flex: 1 }]}>"{wordOfDay.example}"</Text>
                                        <TouchableOpacity
                                            onPress={() => audioService.speak(wordOfDay.example)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="volume-medium" size={18} color={Colors.primary[400]} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.exampleTranslation}>{wordOfDay.exampleTranslation}</Text>
                                </View>
                            </>
                        )}
                        {!wordOfDay && !loadingWord && (
                            <Text style={styles.wordTranslation}>Fetching your word...</Text>
                        )}
                    </Card>
                </FadeInView>

                {/* Current Lesson Card */}
                <FadeInView delay={300}>
                    {(() => {
                        const modules = getModulesForLevel(progress.level);
                        let lessonsCounted = 0;
                        let currentModule = modules[0];
                        let currentModuleIndex = 0;
                        let currentModuleProgress = 0;
                        let found = false;

                        for (let i = 0; i < modules.length; i++) {
                            const module = modules[i];
                            if (progress.lessonsCompleted < lessonsCounted + module.lessons.length) {
                                currentModule = module;
                                currentModuleIndex = i;
                                const completedInModule = progress.lessonsCompleted - lessonsCounted;
                                currentModuleProgress = Math.round((completedInModule / module.lessons.length) * 100);
                                found = true;
                                break;
                            }
                            lessonsCounted += module.lessons.length;
                        }

                        // Fallback if all completed (only if not found in loop)
                        if (!found && modules.length > 0) {
                            currentModule = modules[modules.length - 1];
                            currentModuleIndex = modules.length - 1;
                            currentModuleProgress = 100;
                        }

                        return (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => navigateToLearn('LearnHome')}
                            >
                                <Card style={styles.lessonCard}>
                                    <View style={styles.lessonHeader}>
                                        <Badge label={getLevelTitle(progress.level)} variant="level" level={progress.level} />
                                        <Text style={styles.lessonUnit}>Unit {currentModuleIndex + 1}</Text>
                                    </View>
                                    <Text style={styles.lessonTitle}>{currentModule?.title || 'Loading...'}</Text>
                                    <Text style={styles.lessonDescription}>
                                        {currentModule?.description || 'Start your learning journey'}
                                    </Text>
                                    <View style={styles.lessonProgress}>
                                        <ProgressBar progress={currentModuleProgress} height={6} />
                                        <Text style={styles.lessonProgressText}>{currentModuleProgress}% complete</Text>
                                    </View>
                                    <LinearGradient
                                        colors={[Colors.primary[500], Colors.primary[600]]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.continueButton}
                                    >
                                        <Text style={styles.continueButtonText}>
                                            {currentModuleProgress === 0 ? 'Start Learning' : 'Continue Learning'}
                                        </Text>
                                    </LinearGradient>
                                </Card>
                            </TouchableOpacity>
                        );
                    })()}
                </FadeInView>

                {/* Smart Learning Features - 2x2 Grid */}
                <FadeInView delay={400}>
                    <Text style={styles.sectionTitle}>Smart Learning</Text>
                    <View style={styles.featuresGrid}>
                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => navigation.navigate('Snap')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={[Colors.primary[500], Colors.primary[700]]}
                                style={styles.featureGradient}
                            >
                                <View style={styles.featureIconBubble}>
                                    <Ionicons name="camera" size={24} color={Colors.white} />
                                </View>
                                <Text style={styles.featureTitle}>Snap & Learn</Text>
                                <Text style={styles.featureSubtitle}>Identify objects</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => navigation.navigate('Story')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={[Colors.secondary[500], Colors.secondary[700]]}
                                style={styles.featureGradient}
                            >
                                <View style={styles.featureIconBubble}>
                                    <Ionicons name="book" size={24} color={Colors.white} />
                                </View>
                                <Text style={styles.featureTitle}>AI Stories</Text>
                                <Text style={styles.featureSubtitle}>Interactive reading</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => navigation.navigate('Flashcards')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={[Colors.warning[500], Colors.warning[700]]}
                                style={styles.featureGradient}
                            >
                                <View style={styles.featureIconBubble}>
                                    <Ionicons name="albums" size={24} color={Colors.white} />
                                </View>
                                <Text style={styles.featureTitle}>Flashcards</Text>
                                <Text style={styles.featureSubtitle}>Spaced repetition</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => navigation.navigate('FillInBlank')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#8B5CF6', '#6D28D9']}
                                style={styles.featureGradient}
                            >
                                <View style={styles.featureIconBubble}>
                                    <Ionicons name="help-circle" size={24} color={Colors.white} />
                                </View>
                                <Text style={styles.featureTitle}>Fill in Blank</Text>
                                <Text style={styles.featureSubtitle}>AI quiz maker</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </FadeInView>

                {/* Daily Challenges Section - Hidden
                <FadeInView delay={500}>
                    <Text style={styles.sectionTitle}>Daily Challenges</Text>
                    <View style={[styles.quickActions, !isPhone && styles.quickActionsTablet]}>
                        <QuickActionCard
                            icon="flash"
                            title="Speed Review"
                            description="Quick vocab quiz"
                            color={Colors.warning[500]}
                            onPress={() => navigation.navigate('Practice', { mode: 'vocabulary' })}
                        />
                        <QuickActionCard
                            icon="mic"
                            title="Pronunciation"
                            description="Speak a sentence"
                            color={Colors.primary[500]}
                            onPress={() => navigation.navigate('Learn', { screen: 'Pronunciation' })}
                        />
                        <QuickActionCard
                            icon="headset"
                            title="Listening"
                            description="Audio quiz"
                            color={Colors.success[500]}
                            onPress={() => navigation.navigate('Practice', { mode: 'listening' })}
                        />
                        <QuickActionCard
                            icon="construct"
                            title="Grammar Drill"
                            description="Quick exercise"
                            color={Colors.primary[500]}
                            onPress={() => navigation.navigate('Practice', { mode: 'grammar' })}
                        />
                    </View>
                </FadeInView>
                */}

                {/* Quick Reference Section */}
                <FadeInView delay={600}>
                    <Text style={styles.sectionTitle}>Quick Reference</Text>
                    <View style={styles.referenceRow}>
                        <TouchableOpacity
                            style={styles.referenceCard}
                            onPress={() => navigation.navigate('Grammar')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.referenceIcon, { backgroundColor: Colors.success[500] + '20' }]}>
                                <Ionicons name="git-branch" size={24} color={Colors.success[500]} />
                            </View>
                            <Text style={styles.referenceTitle}>Grammar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.referenceCard}
                            onPress={() => navigation.navigate('Vocabulary')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.referenceIcon, { backgroundColor: Colors.secondary[500] + '20' }]}>
                                <Ionicons name="layers" size={24} color={Colors.secondary[500]} />
                            </View>
                            <Text style={styles.referenceTitle}>Vocabulary</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.referenceCard}
                            onPress={() => navigation.navigate('Dictionary')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.referenceIcon, { backgroundColor: Colors.primary[500] + '20' }]}>
                                <Ionicons name="search" size={24} color={Colors.primary[500]} />
                            </View>
                            <Text style={styles.referenceTitle}>Dictionary</Text>
                        </TouchableOpacity>
                    </View>
                </FadeInView>

                {/* Stats Summary - Hidden
                <FadeInView delay={700}>
                    <Text style={styles.sectionTitle}>Your Progress</Text>
                    <Card style={styles.statsCard}>
                        <View style={styles.statsRow}>
                            <StatItem value={progress.wordsLearned} label="Words Learned" icon="book" color={Colors.primary[500]} />
                            <StatItem value={progress.lessonsCompleted} label="Lessons Done" icon="checkmark-circle" color={Colors.success[500]} />
                            <StatItem value={progress.grammarTopicsCompleted || 0} label="Grammar Topics" icon="school" color={Colors.secondary[500]} />
                        </View>
                    </Card>
                </FadeInView>
                */}

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeArea>
    );
};

// Quick Action Card Component
const QuickActionCard: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    color: string;
    onPress: () => void;
}> = ({ icon, title, description, color, onPress }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.quickActionWrapper}
            onPress={onPress}
        >
            <Card style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon} size={24} color={color} />
                </View>
                <Text style={styles.quickActionTitle}>{title}</Text>
                <Text style={styles.quickActionDescription}>{description}</Text>
            </Card>
        </TouchableOpacity>
    );
};

// Stat Item Component
const StatItem: React.FC<{
    value: number;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}> = ({ value, label, icon, color }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    return (
        <View style={styles.statItem}>
            <Ionicons name={icon} size={24} color={color} style={{ marginBottom: 4 }} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.base,
        paddingTop: Spacing.lg,
        backgroundColor: theme.background.primary,
    },
    greeting: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: 2,
    },
    profileButton: {
        padding: 4,
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.background.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerStats: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.base,
        paddingBottom: Spacing['3xl'],
    },
    progressCard: {
        marginBottom: Spacing.base,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.lg,
    },
    progressTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        marginBottom: 4,
    },
    progressSubtitle: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.8)',
    },
    goalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: BorderRadius.full,
        gap: 4,
    },
    goalBadgeText: {
        color: Colors.white,
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    statsRowInCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around', // Better spacing
        backgroundColor: 'rgba(0,0,0,0.15)', // Darker glass
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.xl,
    },
    statDivider: {
        width: 1,
        height: 30, // Taller divider
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    statPillInCard: {
        alignItems: 'center',
    },
    // Word of Day Widget styles
    wordCard: {
        marginBottom: Spacing.lg,
        padding: Spacing.lg,
    },
    wordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    wordTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    wordCardTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: theme.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    wordMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    germanWord: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    speakerButton: {
        marginLeft: 'auto',
        padding: Spacing.xs,
    },
    wordMetaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
        flexWrap: 'wrap',
    },
    wordTranslation: {
        fontSize: FontSize.base,
        color: theme.text.secondary,
    },
    exampleContainer: {
        backgroundColor: theme.background.tertiary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
    },
    exampleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    exampleText: {
        fontSize: FontSize.sm,
        fontStyle: 'italic',
        color: theme.text.primary,
        marginBottom: Spacing.xs,
    },
    exampleTranslation: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
    },
    lessonCard: {
        marginBottom: Spacing.xl,
    },
    lessonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    lessonUnit: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
    },
    lessonTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginBottom: Spacing.xs,
    },
    lessonDescription: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginBottom: Spacing.md,
        lineHeight: 20,
    },
    lessonProgress: {
        marginBottom: Spacing.md,
    },
    lessonProgressText: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
        marginTop: Spacing.xs,
    },
    continueButton: {
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.md,
        marginTop: Spacing.md,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    quickActionsTablet: {
        gap: Spacing.md,
    },
    quickActionWrapper: {
        width: '48%',
    },
    quickActionCard: {
        alignItems: 'center',
        padding: Spacing.md,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    quickActionTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: 2,
    },
    quickActionDescription: {
        fontSize: FontSize.xs,
        color: theme.text.secondary,
        textAlign: 'center',
    },
    referenceRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    referenceCard: {
        flex: 1,
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        alignItems: 'center',
        ...Shadows.sm,
    },
    referenceIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    referenceTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    statsCard: {
        marginBottom: Spacing.base,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: theme.text.secondary,
        marginTop: 2,
    },
    leagueCard: {
        marginBottom: Spacing.base,
    },
    leagueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    leagueTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    leagueTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    leagueDescription: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginBottom: Spacing.md,
    },
    leagueRank: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: Spacing.sm,
    },
    leagueRankNumber: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary[500],
    },
    leagueRankLabel: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
    },
    // Smart Features Widget Styles
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    featureCard: {
        width: '48.5%',
        height: 130,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        ...Shadows.sm,
    },
    featureGradient: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'space-between',
    },
    featureIconBubble: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        marginTop: Spacing.xs,
    },
    featureSubtitle: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.9)',
    },
});
