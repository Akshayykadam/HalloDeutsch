
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { LinearGradient } from 'expo-linear-gradient';

import { SafeArea, Button } from '../../components/ui';
import { ModuleCompleteModal, LessonCompleteModal } from '../../components/gamification';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import { getAllLessons, getModuleForLesson, getNextLessonInModule } from '../../data/content/curriculum-service';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.base * 2 - Spacing.sm * 3) / 4;

const NUMBERS_0_20 = [
    { value: 0, label: 'null', phonetic: 'nool' },
    { value: 1, label: 'eins', phonetic: 'eyns' },
    { value: 2, label: 'zwei', phonetic: 'tsv-eye' },
    { value: 3, label: 'drei', phonetic: 'dry' },
    { value: 4, label: 'vier', phonetic: 'feer' },
    { value: 5, label: 'fünf', phonetic: 'fewnf' },
    { value: 6, label: 'sechs', phonetic: 'zeks' },
    { value: 7, label: 'sieben', phonetic: ' zee-ben' },
    { value: 8, label: 'acht', phonetic: 'ahkt' },
    { value: 9, label: 'neun', phonetic: 'noyn' },
    { value: 10, label: 'zehn', phonetic: 'tsehn' },
    { value: 11, label: 'elf', phonetic: 'elf' },
    { value: 12, label: 'zwölf', phonetic: 'tsv-uhlf' },
    { value: 13, label: 'dreizehn', phonetic: 'dry-tsehn' },
    { value: 14, label: 'vierzehn', phonetic: 'feer-tsehn' },
    { value: 15, label: 'fünfzehn', phonetic: 'fewnf-tsehn' },
    { value: 16, label: 'sechzehn', phonetic: 'zek-tsehn' },
    { value: 17, label: 'siebzehn', phonetic: 'zeeb-tsehn' },
    { value: 18, label: 'achtzehn', phonetic: 'ahkt-tsehn' },
    { value: 19, label: 'neunzehn', phonetic: 'noyn-tsehn' },
    { value: 20, label: 'zwanzig', phonetic: 'tsvan-tsig' },
];

const NUMBERS_21_100 = [
    { value: 21, label: 'einundzwanzig', phonetic: 'ine-oont-tsvan-tsig' },
    { value: 22, label: 'zweiundzwanzig', phonetic: 'tsv-eye-oont-tsvan-tsig' },
    { value: 30, label: 'dreißig', phonetic: 'dry-sig' },
    { value: 40, label: 'vierzig', phonetic: 'feer-tsig' },
    { value: 50, label: 'fünfzig', phonetic: 'fewnf-tsig' },
    { value: 60, label: 'sechzig', phonetic: 'zek-tsig' },
    { value: 70, label: 'siebzig', phonetic: 'zeeb-tsig' },
    { value: 80, label: 'achtzig', phonetic: 'ahkt-tsig' },
    { value: 90, label: 'neunzig', phonetic: 'noyn-tsig' },
    { value: 100, label: 'einhundert', phonetic: 'ine-hoon-dert' },
];

export const NumbersScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lessonId } = route.params || {};

    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { updateProgress, progress } = useUserStore();
    const [speakingNumber, setSpeakingNumber] = useState<number | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showModuleComplete, setShowModuleComplete] = useState(false);
    const [showLessonComplete, setShowLessonComplete] = useState(false);

    // Get current module for navigation
    const currentModule = lessonId ? getModuleForLesson(lessonId) : undefined;

    // Determine content to show based on lesson ID
    const isPractice = lessonId === 'a1-m2-practice'; // Future placeholder
    const isTwentyOneToHundred = lessonId === 'a1-m2-l2';

    // Default to 0-20 if L1, or if unknown and NOT L2/Practice
    const showZeroToTwenty = !lessonId || lessonId === 'a1-m2-l1' || isPractice || (!isTwentyOneToHundred);
    const showTwentyOneToHundred = isTwentyOneToHundred || isPractice;

    const speakNumber = async (number: number, text: string) => {
        setSpeakingNumber(number);
        await audioService.speak(text);
        setSpeakingNumber(null);
    };

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
                lessonTitle="Numbers & Counting"
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
                    <Text style={styles.headerTitle}>Zahlen (Numbers)</Text>
                    <Text style={styles.headerSubtitle}>Tap a number to hear it</Text>
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
                    Count like a native! Listen carefully to the pronunciation.
                </Text>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 0-20 Grid */}
                {showZeroToTwenty && (
                    <>
                        <Text style={styles.sectionTitle}>Numbers 0-20</Text>
                        <View style={styles.grid}>
                            {NUMBERS_0_20.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    style={[
                                        styles.card,
                                        speakingNumber === item.value && styles.cardActive
                                    ]}
                                    onPress={() => speakNumber(item.value, item.label)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.number,
                                        speakingNumber === item.value && styles.numberActive
                                    ]}>
                                        {item.value}
                                    </Text>
                                    <Text style={[
                                        styles.label,
                                        speakingNumber === item.value && styles.labelActive
                                    ]}>
                                        {item.label}
                                    </Text>
                                    <Text style={styles.phonetic}>
                                        {item.phonetic}
                                    </Text>

                                    {speakingNumber === item.value && (
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

                {/* 21-100 Grid */}
                {showTwentyOneToHundred && (
                    <>
                        <Text style={styles.sectionTitle}>Numbers 21-100</Text>
                        <View style={styles.tipsCard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                                <Ionicons name="information-circle" size={18} color={Colors.primary[500]} style={{ marginRight: Spacing.xs }} />
                                <Text style={styles.tipsTitle}>The Logic</Text>
                            </View>
                            <Text style={styles.tipItem}>In German, we say the "one" first!</Text>
                            <Text style={styles.tipItem}>21 = "one-and-twenty" (<Text style={styles.tipBold}>ein-und-zwanzig</Text>)</Text>
                        </View>
                        <View style={styles.grid}>
                            {NUMBERS_21_100.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    style={[
                                        styles.card,
                                        speakingNumber === item.value && styles.cardActive,
                                        // Make cards wider for longer numbers if needed
                                        item.value < 100 && item.value > 20 && item.value % 10 !== 0 ? { width: '48%' } : {}
                                    ]}
                                    onPress={() => speakNumber(item.value, item.label)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.number,
                                        speakingNumber === item.value && styles.numberActive
                                    ]}>
                                        {item.value}
                                    </Text>
                                    <Text style={[
                                        styles.label,
                                        speakingNumber === item.value && styles.labelActive
                                    ]} numberOfLines={1} adjustsFontSizeToFit>
                                        {item.label}
                                    </Text>
                                    <Text style={styles.phonetic} numberOfLines={1}>
                                        {item.phonetic}
                                    </Text>

                                    {speakingNumber === item.value && (
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
                        <Text style={styles.tipsTitle}>Quick Tips</Text>
                    </View>
                    {showZeroToTwenty && (
                        <>
                            <Text style={styles.tipItem}>• <Text style={styles.tipBold}>zwei</Text> (2) vs <Text style={styles.tipBold}>drei</Text> (3)</Text>
                            <Text style={styles.tipItem}>• <Text style={styles.tipBold}>ie</Text> sounds like "ee" (vier, sieben)</Text>
                            <Text style={styles.tipItem}>• <Text style={styles.tipBold}>ei</Text> sounds like "eye" (eins, zwei, drei)</Text>
                        </>
                    )}
                    {showTwentyOneToHundred && (
                        <>
                            <Text style={styles.tipItem}>• <Text style={styles.tipBold}>ß</Text> is used in <Text style={styles.tipBold}>dreißig</Text> (30)</Text>
                            <Text style={styles.tipItem}>• All other tens end in <Text style={styles.tipBold}>-zig</Text> (zwanzig, vierzig...)</Text>
                        </>
                    )}
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
        padding: Spacing.lg,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginBottom: Spacing.md,
        marginTop: Spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    card: {
        width: (width - Spacing.base * 2 - Spacing.md * 3) / 3, // 3 columns
        aspectRatio: 0.9,
        backgroundColor: theme.background.tertiary, // Changed from Colors.white
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cardActive: {
        backgroundColor: Colors.primary[500],
        ...Shadows.md,
        transform: [{ scale: 1.05 }],
    },
    number: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary[600],
        marginBottom: 2,
    },
    numberActive: {
        color: Colors.white,
    },
    label: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        color: theme.text.primary, // Changed from LightTheme.text.primary
    },
    labelActive: {
        color: Colors.white,
    },
    phonetic: {
        fontSize: FontSize.xs,
        color: theme.text.secondary, // Changed from LightTheme.text.secondary
        marginTop: 2,
    },
    speakingIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    tipsCard: {
        backgroundColor: Colors.warning[50], // Light yellow/orange - keeping for now
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginTop: Spacing.xl,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.warning[200],
    },
    tipsTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.warning[800],
        marginBottom: Spacing.sm,
    },
    tipItem: {
        fontSize: FontSize.sm,
        color: Colors.warning[900],
        marginBottom: 4,
        lineHeight: 20,
    },
    tipBold: {
        fontWeight: FontWeight.bold,
    },
    footer: {
        marginTop: Spacing.md,
    },
});
