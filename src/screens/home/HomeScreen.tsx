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
import { SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { generateWordOfDay } from '../../services/geminiService';
import * as audioService from '../../services/audioService';
import { getModulesForLevel } from '../../data/content/curriculum-service';
import { haptics } from '../../utils/haptics';

export const HomeScreen: React.FC = () => {
    const { progress } = useUserStore();
    const { theme, isDark } = useTheme();
    const s = getStyles(theme);
    const navigation = useNavigation<any>();
    const { checkStreak } = useUserStore();

    useFocusEffect(useCallback(() => { checkStreak(); }, [checkStreak]));

    // Word of the Day state
    const [wordOfDay, setWordOfDay] = useState<{
        word: string; translation: string; example: string;
        exampleTranslation: string; partOfSpeech: string;
    } | null>(null);
    const [loadingWord, setLoadingWord] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadWordOfDay = async () => {
                try {
                    setLoadingWord(true);
                    const today = new Date().toISOString().split('T')[0];
                    const cachedData = await AsyncStorage.getItem('wordOfDay');
                    if (cachedData) {
                        const { date, data } = JSON.parse(cachedData);
                        if (date === today) { setWordOfDay(data); setLoadingWord(false); return; }
                    }
                    const data = await generateWordOfDay(progress.level);
                    setWordOfDay(data);
                    await AsyncStorage.setItem('wordOfDay', JSON.stringify({ date: today, data }));
                } catch (error) {
                    console.error('Failed to load word of day:', error);
                } finally { setLoadingWord(false); }
            };
            loadWordOfDay();
        }, [progress.level])
    );

    // Current lesson calculation
    const modules = getModulesForLevel(progress.level);
    let lessonsCounted = 0, currentModule = modules[0], currentModuleIndex = 0, currentModuleProgress = 0;
    for (let i = 0; i < modules.length; i++) {
        if (progress.lessonsCompleted < lessonsCounted + modules[i].lessons.length) {
            currentModule = modules[i]; currentModuleIndex = i;
            currentModuleProgress = Math.round(((progress.lessonsCompleted - lessonsCounted) / modules[i].lessons.length) * 100);
            break;
        }
        lessonsCounted += modules[i].lessons.length;
    }

    const dailyPercent = Math.min((progress.minutesToday / progress.dailyGoal) * 100, 100);

    return (
        <SafeArea style={s.container}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Compact Header */}
            <View style={s.header}>
                <View>
                    <Text style={s.greeting}>Guten Tag!</Text>
                    <Text style={s.subtitle}>Ready to learn German?</Text>
                </View>
                <View style={s.headerRight}>
                    <TouchableOpacity onPress={() => navigation.navigate('Dictionary')} activeOpacity={0.7}>
                        <View style={s.headerIconBtn}>
                            <Ionicons name="search" size={18} color={theme.text.secondary} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
                        <LinearGradient colors={[Colors.primary[400], Colors.primary[600]]} style={s.avatarBtn}>
                            <Ionicons name="person" size={16} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.base, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                {/* Stats Strip */}
                <View style={s.statsStrip}>
                    {[
                        { icon: 'flame' as const, value: progress.streak || 0, label: 'Streak', color: Colors.secondary[500] },
                        { icon: 'flash' as const, value: progress.totalXP || 0, label: 'XP', color: Colors.primary[500] },
                        { icon: 'time' as const, value: `${progress.minutesToday}/${progress.dailyGoal}`, label: 'Min', color: Colors.success[500] },
                    ].map(stat => (
                        <View key={stat.label} style={[s.statCard, { backgroundColor: theme.background.primary }]}>
                            <Ionicons name={stat.icon} size={18} color={stat.color} />
                            <Text style={[s.statValue, { color: theme.text.primary }]}>{stat.value}</Text>
                            <Text style={[s.statLabel, { color: theme.text.tertiary }]}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Daily Progress Bar */}
                <View style={[s.progressWrap, { backgroundColor: theme.background.primary }]}>
                    <View style={s.progressText}>
                        <Text style={[s.progressLabel, { color: theme.text.secondary }]}>Daily Goal</Text>
                        <Text style={[s.progressPercent, { color: theme.text.primary }]}>{Math.round(dailyPercent)}%</Text>
                    </View>
                    <View style={[s.progressTrack, { backgroundColor: theme.background.tertiary }]}>
                        <LinearGradient
                            colors={[Colors.success[400], Colors.success[600]]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[s.progressFill, { width: `${dailyPercent}%` }]}
                        />
                    </View>
                </View>

                {/* Word of the Day */}
                <View style={[s.wordCard, { backgroundColor: theme.background.primary }]}>
                    <View style={s.wordHeader}>
                        <View style={s.wordBadge}>
                            <Ionicons name="calendar" size={12} color={Colors.primary[500]} />
                            <Text style={[s.wordBadgeText, { color: Colors.primary[500] }]}>Word of the Day</Text>
                        </View>
                        {loadingWord && <ActivityIndicator size="small" color={Colors.primary[500]} />}
                    </View>
                    {wordOfDay && !loadingWord && (
                        <>
                            <View style={s.wordRow}>
                                <Text style={[s.germanWord, { color: theme.text.primary }]} numberOfLines={2}>{wordOfDay.word}</Text>
                                <TouchableOpacity onPress={() => audioService.speak(wordOfDay.word)} activeOpacity={0.7} style={s.speakerBtn}>
                                    <Ionicons name="volume-high" size={20} color={Colors.primary[500]} />
                                </TouchableOpacity>
                            </View>
                            <View style={s.wordMeta}>
                                <View style={[s.posBadge, { backgroundColor: Colors.primary[500] + '18' }]}>
                                    <Text style={{ fontSize: 11, fontWeight: '600' as any, color: Colors.primary[500] }}>{wordOfDay.partOfSpeech}</Text>
                                </View>
                                <Text style={[s.translation, { color: theme.text.secondary }]}>{wordOfDay.translation}</Text>
                            </View>
                            <View style={[s.exampleBox, { backgroundColor: theme.background.tertiary }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <Text style={[s.exampleText, { color: theme.text.primary, flex: 1 }]}>"{wordOfDay.example}"</Text>
                                    <TouchableOpacity onPress={() => audioService.speak(wordOfDay.example)} activeOpacity={0.7}>
                                        <Ionicons name="volume-medium" size={16} color={Colors.primary[400]} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[s.exampleTrans, { color: theme.text.tertiary }]}>{wordOfDay.exampleTranslation}</Text>
                            </View>
                        </>
                    )}
                    {!wordOfDay && !loadingWord && (
                        <Text style={[s.translation, { color: theme.text.tertiary }]}>Fetching your word...</Text>
                    )}
                </View>

                {/* Continue Learning Card */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => { haptics.light(); navigation.navigate('Learn', { screen: 'LearnHome' }); }}
                >
                    <LinearGradient
                        colors={[Colors.primary[500], Colors.primary[700]]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={s.continueCard}
                    >
                        <View style={s.continueTop}>
                            <View style={s.continueLevelPill}>
                                <Text style={s.continueLevelText}>{getLevelTitle(progress.level)}</Text>
                            </View>
                            <Text style={s.continueUnit}>Unit {currentModuleIndex + 1}</Text>
                        </View>
                        <Text style={s.continueTitle}>{currentModule?.title || 'Loading...'}</Text>
                        <View style={s.continueProgress}>
                            <View style={s.continueTrack}>
                                <View style={[s.continueFill, { width: `${currentModuleProgress}%` }]} />
                            </View>
                            <Text style={s.continuePercent}>{currentModuleProgress}%</Text>
                        </View>
                        <View style={s.continueBtn}>
                            <Text style={s.continueBtnText}>
                                {currentModuleProgress === 0 ? 'Start Learning' : 'Continue'}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Quick Access Section */}
                <Text style={[s.sectionTitle, { color: theme.text.tertiary }]}>Quick Access</Text>
                <View style={s.quickGrid}>
                    {[
                        { icon: 'camera' as const, title: 'Snap & Learn', grad: [Colors.primary[400], Colors.primary[600]] as [string, string], route: 'Snap' },
                        { icon: 'book' as const, title: 'AI Stories', grad: [Colors.secondary[400], Colors.secondary[600]] as [string, string], route: 'Story' },
                        { icon: 'albums' as const, title: 'Flashcards', grad: [Colors.warning[400], Colors.warning[600]] as [string, string], route: 'Flashcards' },
                        { icon: 'help-circle' as const, title: 'Fill in Blank', grad: ['#8B5CF6', '#6D28D9'] as [string, string], route: 'FillInBlank' },
                    ].map(item => (
                        <TouchableOpacity
                            key={item.route}
                            style={s.quickCard}
                            activeOpacity={0.8}
                            onPress={() => { haptics.light(); navigation.navigate(item.route); }}
                        >
                            <LinearGradient colors={item.grad} style={s.quickIcon}>
                                <Ionicons name={item.icon} size={20} color={Colors.white} />
                            </LinearGradient>
                            <Text style={[s.quickTitle, { color: theme.text.primary }]}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Reference Row */}
                <Text style={[s.sectionTitle, { color: theme.text.tertiary }]}>Reference</Text>
                <View style={s.refRow}>
                    {[
                        { icon: 'git-branch' as const, title: 'Grammar', color: Colors.success[500], route: 'Grammar' },
                        { icon: 'layers' as const, title: 'Vocabulary', color: Colors.secondary[500], route: 'Vocabulary' },
                        { icon: 'search' as const, title: 'Dictionary', color: Colors.primary[500], route: 'Dictionary' },
                    ].map(item => (
                        <TouchableOpacity
                            key={item.route}
                            style={[s.refCard, { backgroundColor: theme.background.primary }]}
                            onPress={() => { haptics.light(); navigation.navigate(item.route); }}
                            activeOpacity={0.7}
                        >
                            <View style={[s.refIcon, { backgroundColor: item.color + '18' }]}>
                                <Ionicons name={item.icon} size={20} color={item.color} />
                            </View>
                            <Text style={[s.refTitle, { color: theme.text.primary }]}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeArea>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.secondary },

    /* Header */
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    },
    greeting: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: theme.text.primary },
    subtitle: { fontSize: FontSize.xs, color: theme.text.tertiary, marginTop: 2 },
    headerRight: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
    headerIconBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: theme.background.tertiary,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarBtn: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },

    /* Stats strip */
    statsStrip: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
    statCard: {
        flex: 1, alignItems: 'center', paddingVertical: Spacing.md,
        borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: theme.border.light,
    },
    statValue: { fontSize: FontSize.base, fontWeight: FontWeight.bold, marginTop: 4 },
    statLabel: { fontSize: 10, fontWeight: FontWeight.medium, marginTop: 1 },

    /* Daily progress */
    progressWrap: {
        padding: Spacing.md, borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md, borderWidth: 1, borderColor: theme.border.light,
    },
    progressText: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
    progressLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    progressPercent: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },

    /* Word of day */
    wordCard: {
        padding: Spacing.lg, borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md, borderWidth: 1, borderColor: theme.border.light,
    },
    wordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    wordBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    wordBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
    wordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
    germanWord: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, flex: 1 },
    speakerBtn: { padding: Spacing.xs },
    wordMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
    posBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm },
    translation: { fontSize: FontSize.base },
    exampleBox: { borderRadius: BorderRadius.lg, padding: Spacing.md },
    exampleText: { fontSize: FontSize.sm, fontStyle: 'italic', marginBottom: 4 },
    exampleTrans: { fontSize: FontSize.xs },

    /* Continue learning */
    continueCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
    continueTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    continueLevelPill: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.full,
    },
    continueLevelText: { fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white },
    continueUnit: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
    continueTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.white, marginBottom: Spacing.md },
    continueProgress: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
    continueTrack: { flex: 1, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
    continueFill: { height: '100%', backgroundColor: Colors.white, borderRadius: 3 },
    continuePercent: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: 'rgba(255,255,255,0.8)' },
    continueBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
        backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
    },
    continueBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.white },

    /* Section title */
    sectionTitle: {
        fontSize: FontSize.sm, fontWeight: FontWeight.bold,
        textTransform: 'uppercase', letterSpacing: 1,
        marginBottom: Spacing.md,
    },

    /* Quick access 2x2 */
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
    quickCard: {
        width: '48%', flexDirection: 'row', alignItems: 'center',
        backgroundColor: theme.background.primary, borderRadius: BorderRadius.xl,
        padding: Spacing.md, gap: Spacing.md,
        borderWidth: 1, borderColor: theme.border.light,
    },
    quickIcon: { width: 40, height: 40, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
    quickTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, flex: 1 },

    /* Reference row */
    refRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
    refCard: {
        flex: 1, alignItems: 'center', paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: theme.border.light,
    },
    refIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
    refTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
});
