// Alphabet Screen - Interactive German alphabet learning with pronunciation
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllLessons, getModuleForLesson, getNextLessonInModule } from '../../data/content/curriculum-service';
import { SafeArea, Button } from '../../components/ui';
import { ModuleCompleteModal, LessonCompleteModal } from '../../components/gamification';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.base * 2 - Spacing.sm * 3) / 4;

// German alphabet with pronunciations
const GERMAN_ALPHABET = [
    { letter: 'A', pronunciation: 'ah', example: 'Apfel' },
    { letter: 'B', pronunciation: 'beh', example: 'Buch' },
    { letter: 'C', pronunciation: 'tseh', example: 'Computer' },
    { letter: 'D', pronunciation: 'deh', example: 'Danke' },
    { letter: 'E', pronunciation: 'eh', example: 'Elefant' },
    { letter: 'F', pronunciation: 'eff', example: 'Fisch' },
    { letter: 'G', pronunciation: 'geh', example: 'Gut' },
    { letter: 'H', pronunciation: 'hah', example: 'Haus' },
    { letter: 'I', pronunciation: 'ee', example: 'Igel' },
    { letter: 'J', pronunciation: 'yot', example: 'Ja' },
    { letter: 'K', pronunciation: 'kah', example: 'Katze' },
    { letter: 'L', pronunciation: 'ell', example: 'Lampe' },
    { letter: 'M', pronunciation: 'emm', example: 'Mutter' },
    { letter: 'N', pronunciation: 'enn', example: 'Nein' },
    { letter: 'O', pronunciation: 'oh', example: 'Ohr' },
    { letter: 'P', pronunciation: 'peh', example: 'Papa' },
    { letter: 'Q', pronunciation: 'koo', example: 'Qualle' },
    { letter: 'R', pronunciation: 'err', example: 'Rot' },
    { letter: 'S', pronunciation: 'ess', example: 'Sonne' },
    { letter: 'T', pronunciation: 'teh', example: 'Tisch' },
    { letter: 'U', pronunciation: 'oo', example: 'Uhr' },
    { letter: 'V', pronunciation: 'fow', example: 'Vater' },
    { letter: 'W', pronunciation: 'veh', example: 'Wasser' },
    { letter: 'X', pronunciation: 'iks', example: 'Xylophon' },
    { letter: 'Y', pronunciation: 'üpsilon', example: 'Yoga' },
    { letter: 'Z', pronunciation: 'tset', example: 'Zug' },
    // Special German characters
    { letter: 'Ä', pronunciation: 'eh (umlaut)', example: 'Äpfel', isSpecial: true },
    { letter: 'Ö', pronunciation: 'eu (umlaut)', example: 'Öl', isSpecial: true },
    { letter: 'Ü', pronunciation: 'ü (umlaut)', example: 'Über', isSpecial: true },
    { letter: 'ß', pronunciation: 'ess-tset', example: 'Straße', isSpecial: true },
];

// Sound combinations (Diphthongs & Digraphs)
const SOUND_COMBINATIONS = [
    { letter: 'EI', pronunciation: 'eye', example: 'Eis' },
    { letter: 'IE', pronunciation: 'ee', example: 'Liebe' },
    { letter: 'EU', pronunciation: 'oy', example: 'Euro' },
    { letter: 'ÄU', pronunciation: 'oy', example: 'Häuser' },
    { letter: 'AU', pronunciation: 'ow', example: 'Haus' },
    { letter: 'SCH', pronunciation: 'sh', example: 'Schule' },
    { letter: 'CH', pronunciation: 'hh/kh', example: 'Ich/Buch' },
    { letter: 'ST', pronunciation: 'sht', example: 'Stadt' },
    { letter: 'SP', pronunciation: 'shp', example: 'Sport' },
    { letter: 'PF', pronunciation: 'pf', example: 'Pferd' },
];

export const AlphabetScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lessonId } = route.params || {};
    const { theme, isDark } = useTheme();
    const styles = getStyles(theme);

    // Determine which sections to show based on lessonId
    // Default to all if no lessonId (e.g. from tab bar?)
    // a1-m1-l1: Alphabet (Standard)
    // a1-m1-l2: Umlauts
    // a1-m1-l3: Eszett
    // a1-m1-l4: Sounds
    const isPractice = lessonId === 'a1-m1-l5';
    const isUmlauts = lessonId === 'a1-m1-l2';
    const isEszett = lessonId === 'a1-m1-l3';
    const isCombinations = lessonId === 'a1-m1-l4';

    const showUmlauts = !lessonId || isUmlauts || isPractice;
    const showEszett = !lessonId || isEszett || isPractice;
    const showCombinations = !lessonId || isCombinations || isPractice;

    // Default: Show standard for L1, Practice, or if no specific lesson matched (Fallback)
    const showStandard = !lessonId || lessonId === 'a1-m1-l1' || isPractice || (!isUmlauts && !isEszett && !isCombinations);

    const { updateProgress, progress } = useUserStore();
    const [speakingLetter, setSpeakingLetter] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showModuleComplete, setShowModuleComplete] = useState(false);
    const [showLessonComplete, setShowLessonComplete] = useState(false);

    // Get current module for navigation
    const currentModule = lessonId ? getModuleForLesson(lessonId) : undefined;

    const handleComplete = () => {
        if (isCompleted) return;
        setIsCompleted(true);

        // Award XP
        updateProgress({ lessonsCompleted: progress.lessonsCompleted + 1 });
        setShowLessonComplete(true);
    };

    const handleLessonCompleteContinue = () => {
        setShowLessonComplete(false);
        if (lessonId) {
            const nextLessonInModule = getNextLessonInModule(lessonId);

            if (nextLessonInModule) {
                // Navigate to next lesson within module using replace to avoid stack buildup
                setTimeout(() => {
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
                }, 500);
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

    const speakLetter = async (letter: string, example: string) => {
        setSpeakingLetter(letter);

        // Stop any current speech
        await audioService.stopAudio();

        // Speak the letter in German
        await audioService.speak(letter);

        // After letter, speak the example word
        await audioService.speak(example);
        setSpeakingLetter(null);
    };

    return (
        <SafeArea style={styles.container}>
            {/* Lesson Complete Modal */}
            <LessonCompleteModal
                visible={showLessonComplete}
                lessonTitle="Alphabet"
                xpEarned={10}
                onContinue={handleLessonCompleteContinue}
                onClose={handleBackPress}
                hasNextLesson={!!getNextLessonInModule(lessonId || '')}
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
                    <Text style={styles.headerTitle}>Das deutsche Alphabet</Text>
                    <Text style={styles.headerSubtitle}>Tap a letter to hear its pronunciation</Text>
                </View>

            </View>

            {/* Info Banner */}
            <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.infoBanner}
            >
                <Ionicons name="bulb" size={18} color={Colors.white} />
                <Text style={styles.infoText}>
                    Learn all 26 letters + 4 special German characters
                </Text>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Alphabet */}
                {showStandard && (
                    <>
                        <Text style={styles.sectionTitle}>Standard Letters (A-Z)</Text>
                        <View style={styles.letterGrid}>
                            {GERMAN_ALPHABET.filter(l => !l.isSpecial).map((item) => (
                                <TouchableOpacity
                                    key={item.letter}
                                    style={[
                                        styles.letterCard,
                                        speakingLetter === item.letter && styles.letterCardActive
                                    ]}
                                    onPress={() => speakLetter(item.letter, item.example)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.letter,
                                        speakingLetter === item.letter && styles.letterActive
                                    ]}>
                                        {item.letter}
                                    </Text>
                                    <Text style={[
                                        styles.pronunciation,
                                        speakingLetter === item.letter && styles.pronunciationActive
                                    ]}>
                                        [{item.pronunciation}]
                                    </Text>
                                    {speakingLetter === item.letter && (
                                        <Ionicons
                                            name="volume-high"
                                            size={14}
                                            color={Colors.white}
                                            style={styles.speakingIcon}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* Special German Characters (Split for granularity) */}
                {(showUmlauts || showEszett) && (
                    <>
                        <Text style={styles.sectionTitle}>Special Characters</Text>
                        <View style={styles.specialGrid}>
                            {GERMAN_ALPHABET.filter(l => l.isSpecial).filter(l => {
                                if (showUmlauts && showEszett) return true;
                                if (showUmlauts && l.letter !== 'ß') return true;
                                if (showEszett && l.letter === 'ß') return true;
                                return false;
                            }).map((item) => (
                                <TouchableOpacity
                                    key={item.letter}
                                    style={[
                                        styles.specialCard,
                                        speakingLetter === item.letter && styles.specialCardActive
                                    ]}
                                    onPress={() => speakLetter(item.letter, item.example)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.specialCardContent}>
                                        <Text style={[
                                            styles.specialLetter,
                                            speakingLetter === item.letter && styles.specialLetterActive
                                        ]}>
                                            {item.letter}
                                        </Text>
                                        <View style={styles.specialDetails}>
                                            <Text style={[
                                                styles.specialPronunciation,
                                                speakingLetter === item.letter && styles.specialTextActive
                                            ]}>
                                                [{item.pronunciation}]
                                            </Text>
                                            <Text style={[
                                                styles.exampleWord,
                                                speakingLetter === item.letter && styles.specialTextActive
                                            ]}>
                                                e.g. {item.example}
                                            </Text>
                                        </View>
                                    </View>
                                    {speakingLetter === item.letter && (
                                        <Ionicons
                                            name="volume-high"
                                            size={18}
                                            color={Colors.white}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* Sound Combinations */}
                {showCombinations && (
                    <>
                        <Text style={styles.sectionTitle}>Sound Combinations</Text>
                        <View style={styles.letterGrid}>
                            {SOUND_COMBINATIONS.map((item) => (
                                <TouchableOpacity
                                    key={item.letter}
                                    style={[
                                        styles.letterCard,
                                        speakingLetter === item.letter && styles.letterCardActive,
                                        { width: (width - Spacing.base * 2 - Spacing.sm * 2) / 3 } // Wider cards
                                    ]}
                                    onPress={() => speakLetter(item.letter, item.example)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.letter,
                                        speakingLetter === item.letter && styles.letterActive,
                                        { fontSize: FontSize.xl }
                                    ]}>
                                        {item.letter}
                                    </Text>
                                    <Text style={[
                                        styles.pronunciation,
                                        speakingLetter === item.letter && styles.pronunciationActive
                                    ]}>
                                        [{item.pronunciation}]
                                    </Text>
                                    {speakingLetter === item.letter && (
                                        <Ionicons
                                            name="volume-high"
                                            size={14}
                                            color={Colors.white}
                                            style={styles.speakingIcon}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* Tips Section */}
                <View style={styles.tipsCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                        <Ionicons name="bulb" size={18} color={Colors.warning[500]} style={{ marginRight: Spacing.xs }} />
                        <Text style={styles.tipsTitle}>Pronunciation Tips</Text>
                    </View>
                    <Text style={styles.tipItem}>• <Text style={styles.tipBold}>J</Text> sounds like English "Y" (Ja = Ya)</Text>
                    <Text style={styles.tipItem}>• <Text style={styles.tipBold}>W</Text> sounds like English "V" (Wasser = Vasser)</Text>
                    <Text style={styles.tipItem}>• <Text style={styles.tipBold}>V</Text> sounds like English "F" (Vater = Fater)</Text>
                    <Text style={styles.tipItem}>• <Text style={styles.tipBold}>Z</Text> sounds like "TS" (Zug = Tsoog)</Text>
                </View>

                {/* Complete Button */}
                <View style={styles.footer}>
                    <Button
                        title={isCompleted ? "Completed" : "Complete Lesson"}
                        onPress={handleComplete}
                        size="large"
                        variant={isCompleted ? 'success' : 'primary'}
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
    },
    headerContent: {
        flex: 1,
        marginHorizontal: Spacing.sm,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    headerSubtitle: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
    },
    volumeButton: {
        padding: Spacing.sm,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    infoText: {
        fontSize: FontSize.sm,
        color: Colors.white,
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.base,
        paddingBottom: Spacing['3xl'],
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.md,
        marginTop: Spacing.sm,
    },
    letterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    letterCard: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.sm,
    },
    letterCardActive: {
        backgroundColor: Colors.primary[500],
        transform: [{ scale: 1.05 }],
    },
    letter: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary[600],
    },
    letterActive: {
        color: Colors.white,
    },
    pronunciation: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
        marginTop: 2,
    },
    pronunciationActive: {
        color: 'rgba(255,255,255,0.9)',
    },
    speakingIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    specialGrid: {
        gap: Spacing.sm,
    },
    specialCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.background.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        ...Shadows.sm,
    },
    specialCardActive: {
        backgroundColor: Colors.secondary[500],
    },
    specialCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    specialLetter: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.secondary[600],
        width: 50,
    },
    specialLetterActive: {
        color: Colors.white,
    },
    specialDetails: {
        gap: 2,
    },
    specialPronunciation: {
        fontSize: FontSize.base,
        color: theme.text.primary,
        fontWeight: FontWeight.medium,
    },
    exampleWord: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
    },
    specialTextActive: {
        color: 'rgba(255,255,255,0.9)',
    },
    tipsCard: {
        backgroundColor: Colors.warning[50],
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginTop: Spacing.lg,
    },
    tipsTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.warning[800],
        marginBottom: Spacing.sm,
    },
    tipItem: {
        fontSize: FontSize.sm,
        color: Colors.warning[700],
        lineHeight: 22,
    },
    tipBold: {
        fontWeight: FontWeight.bold,
        color: Colors.warning[900],
    },
    footer: {
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
});
