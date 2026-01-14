// Premium Profile Screen - User stats and settings access
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Modal,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LevelColors, Shadows } from '../../theme';
import { useUserStore, useSettingsStore } from '../../store';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLevelTitle } from '../../utils/levelUtils';
import { isModelDownloaded, downloadModel, deleteModel, getModelSize } from '../../services/audioService';
import { FadeInView } from '../../components/common/FadeInView';
import { getLevelDescription } from '../../utils/levelUtils';
import { AuthSection } from '../../components/auth';

export const ProfileScreen: React.FC = () => {
    const { progress, updateProgress, reset: resetProgress, profile } = useUserStore();
    const { settings, updateSettings } = useSettingsStore();
    const { theme, toggleTheme, isDark } = useTheme();
    const navigation = useNavigation();
    const styles = getStyles(theme, isDark);

    // Removed showSettings state


    // TTS Model Management
    const [ttsState, setTtsState] = useState<'checking' | 'ready' | 'missing' | 'downloading'>('checking');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [modelSize, setModelSize] = useState<string>('0 MB');
    const [showResultModal, setShowResultModal] = useState<'success' | 'error' | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<'deleteModel' | 'resetProgress' | null>(null);

    // Check model status when settings modal opens
    const checkModelStatus = async () => {
        setTtsState('checking');
        const isDownloaded = await isModelDownloaded();
        if (isDownloaded) {
            setTtsState('ready');
            const size = await getModelSize();
            setModelSize(`${(size / (1024 * 1024)).toFixed(1)} MB`);
        } else {
            setTtsState('missing');
        }
    };

    const handleDownloadModel = async () => {
        setTtsState('downloading');
        setDownloadProgress(0);
        const success = await downloadModel((progress) => {
            setDownloadProgress(Math.round(progress * 100));
        });

        if (success) {
            await checkModelStatus();
            setShowResultModal('success');
        } else {
            setTtsState('missing');
            setShowResultModal('error');
        }
    };

    const handleDeleteModel = async () => {
        setShowConfirmModal(null);
        await deleteModel();
        await checkModelStatus();
    };

    const handleResetProgress = () => {
        setShowConfirmModal(null);
        resetProgress();
    };

    // Effect to check status when modal visibility changes
    // Effect to check status on mount
    React.useEffect(() => {
        checkModelStatus();
    }, []);



    // ... inside component ...
    const levelInfo = getLevelDescription(progress.level);

    return (
        <SafeArea style={styles.container}>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header with Gradient */}
                <LinearGradient
                    colors={isDark
                        ? [Colors.primary[600], Colors.primary[900]]
                        : [Colors.primary[500], Colors.primary[700]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileHeader}
                >
                    {/* Avatar with Glow Effect */}
                    <View style={styles.avatarGlow}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarInitial}>
                                {(profile?.displayName || 'L')[0].toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.profileName}>{profile?.displayName || 'German Learner'}</Text>

                    {/* Level Badge with Ring */}
                    <View style={styles.levelBadgeContainer}>
                        <LinearGradient
                            colors={[LevelColors[progress.level], LevelColors[progress.level] + 'CC']}
                            style={styles.levelBadgeGradient}
                        >
                            <Text style={styles.levelBadgeText}>{levelInfo.title}</Text>
                        </LinearGradient>

                    </View>
                </LinearGradient>

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <View style={styles.settingsIconBg}>
                        <Ionicons name="arrow-back" size={22} color={Colors.white} />
                    </View>
                </TouchableOpacity>

                {/* Cloud Sync / Auth Section */}
                <FadeInView delay={100}>
                    <AuthSection theme={theme} isDark={isDark} />
                </FadeInView>


                {/* Stats Cards with Icons */}
                <FadeInView delay={200} style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { backgroundColor: theme.background.primary }]}>
                            <LinearGradient
                                colors={[Colors.primary[500] + '20', Colors.primary[600] + '10']}
                                style={styles.statIconBg}
                            >
                                <Ionicons name="book" size={22} color={Colors.primary[500]} />
                            </LinearGradient>
                            <Text style={[styles.statValue, { color: Colors.primary[500] }]}>
                                {progress.lessonsCompleted}
                            </Text>
                            <Text style={styles.statLabel}>Lessons</Text>
                        </View>

                        <View style={[styles.statCard, { backgroundColor: theme.background.primary }]}>
                            <LinearGradient
                                colors={[Colors.secondary[500] + '20', Colors.secondary[600] + '10']}
                                style={styles.statIconBg}
                            >
                                <Ionicons name="language" size={22} color={Colors.secondary[500]} />
                            </LinearGradient>
                            <Text style={[styles.statValue, { color: Colors.secondary[500] }]}>
                                {progress.wordsLearned}
                            </Text>
                            <Text style={styles.statLabel}>Words</Text>
                        </View>

                        <View style={[styles.statCard, { backgroundColor: theme.background.primary }]}>
                            <LinearGradient
                                colors={[Colors.success[500] + '20', Colors.success[600] + '10']}
                                style={styles.statIconBg}
                            >
                                <Ionicons name="school" size={22} color={Colors.success[500]} />
                            </LinearGradient>
                            <Text style={[styles.statValue, { color: Colors.success[500] }]}>
                                {progress.grammarTopicsCompleted || 0}
                            </Text>
                            <Text style={styles.statLabel}>Grammar</Text>
                        </View>
                    </View>
                </FadeInView>

                {/* Learning Journey Card */}
                <FadeInView delay={300}>
                    <TouchableOpacity activeOpacity={0.9}>
                        <LinearGradient
                            colors={isDark
                                ? [theme.background.primary, theme.background.secondary]
                                : [Colors.white, Colors.neutral[50]]}
                            style={styles.journeyCard}
                        >
                            <View style={styles.journeyHeader}>
                                <View style={styles.journeyTitleRow}>
                                    <Ionicons name="trending-up" size={20} color={LevelColors[progress.level]} />
                                    <Text style={styles.journeyTitle}>Learning Journey</Text>
                                </View>
                                <View style={[styles.journeyLevelPill, { backgroundColor: LevelColors[progress.level] + '20' }]}>
                                    <Text style={[styles.journeyLevelText, { color: LevelColors[progress.level] }]}>
                                        {levelInfo.title}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.journeySubtitle}>{levelInfo.subtitle}</Text>

                            {/* Progress Indicators */}
                            <View style={styles.journeyStats}>
                                <View style={styles.journeyStat}>
                                    <Text style={styles.journeyStatValue}>{progress.dailyGoal}</Text>
                                    <Text style={styles.journeyStatLabel}>min/day</Text>
                                </View>
                                <View style={[styles.journeyDivider, { backgroundColor: theme.border.light }]} />
                                <View style={styles.journeyStat}>
                                    <Text style={styles.journeyStatValue}>{progress.minutesToday}</Text>
                                    <Text style={styles.journeyStatLabel}>today</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </FadeInView>

                {/* Integrated Settings Sections */}
                <FadeInView delay={500}>
                    <View style={styles.integratedSettingsContainer}>
                        {/* Learning Level */}
                        <Text style={styles.settingSectionTitle}>Learning Level</Text>
                        <View style={[styles.settingsCard, { backgroundColor: theme.background.primary }]}>
                            <View style={styles.levelOptions}>
                                {['A1', 'A2', 'B1', 'B2'].map((level) => {
                                    const levelKey = level as keyof typeof LevelColors;
                                    const isActive = progress.level === level;
                                    return (
                                        <TouchableOpacity
                                            key={level}
                                            onPress={() => updateProgress({ level: level as any })}
                                            style={[
                                                styles.levelOption,
                                                isActive && { backgroundColor: LevelColors[levelKey] },
                                                !isActive && { borderColor: LevelColors[levelKey], borderWidth: 1.5 }
                                            ]}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={[
                                                styles.levelOptionText,
                                                isActive && styles.levelOptionTextActive,
                                                !isActive && { color: LevelColors[levelKey] }
                                            ]}>
                                                {getLevelDescription(level).title}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>

                        {/* Appearance */}
                        <Text style={styles.settingSectionTitle}>Appearance</Text>
                        <View style={[styles.settingsCard, { backgroundColor: theme.background.primary }]}>
                            <SettingRow
                                icon="moon"
                                iconColor={Colors.primary[500]}
                                title="Dark Mode"
                                value={isDark}
                                onToggle={toggleTheme}
                                styles={styles}
                                theme={theme}
                            />
                        </View>

                        {/* Offline Voice Model */}
                        <Text style={styles.settingSectionTitle}>Offline Voice Model {modelSize !== '0 MB' && `(${modelSize})`}</Text>
                        <View style={[styles.settingsCard, { backgroundColor: theme.background.primary }]}>
                            {ttsState === 'downloading' ? (
                                <View style={{ padding: Spacing.md, alignItems: 'center' }}>
                                    <Text style={{ marginBottom: Spacing.sm, color: theme.text.primary }}>Downloading... {downloadProgress}%</Text>
                                    <View style={{ width: '100%', height: 4, backgroundColor: theme.border.light, borderRadius: 2 }}>
                                        <View style={{ width: `${downloadProgress}%`, height: '100%', backgroundColor: Colors.primary[500], borderRadius: 2 }} />
                                    </View>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.xs }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <View style={[styles.settingIconBg, { backgroundColor: Colors.primary[500] + '15' }]}>
                                            <Ionicons name="mic" size={20} color={Colors.primary[500]} />
                                        </View>
                                        <View>
                                            <Text style={styles.settingTitle}>German Voice (Thorsten)</Text>
                                            <Text style={styles.settingSubtitle}>
                                                {ttsState === 'ready' ? 'Ready for offline use' : 'Download required'}
                                            </Text>
                                        </View>
                                    </View>

                                    {ttsState === 'ready' ? (
                                        <TouchableOpacity onPress={() => setShowConfirmModal('deleteModel')} style={{ padding: Spacing.sm }}>
                                            <Ionicons name="trash-outline" size={22} color={Colors.error[500]} />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity onPress={handleDownloadModel} style={{ padding: Spacing.sm }}>
                                            <Ionicons name="cloud-download-outline" size={24} color={Colors.primary[500]} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Audio & Feedback */}
                        <Text style={styles.settingSectionTitle}>Audio & Feedback</Text>
                        <View style={[styles.settingsCard, { backgroundColor: theme.background.primary }]}>
                            <SettingRow
                                icon="volume-high"
                                iconColor={Colors.secondary[500]}
                                title="Sound Effects"
                                value={settings.soundEnabled}
                                onToggle={(value) => updateSettings({ soundEnabled: value })}
                                styles={styles}
                                theme={theme}
                            />
                            <View style={[styles.settingDivider, { backgroundColor: theme.border.light }]} />
                            <SettingRow
                                icon="phone-portrait"
                                iconColor={Colors.success[500]}
                                title="Haptic Feedback"
                                value={settings.hapticEnabled}
                                onToggle={(value) => updateSettings({ hapticEnabled: value })}
                                styles={styles}
                                theme={theme}
                            />
                            <View style={[styles.settingDivider, { backgroundColor: theme.border.light }]} />
                            <SettingRow
                                icon="play-circle"
                                iconColor={Colors.warning[500]}
                                title="Auto-play Audio"
                                value={settings.autoPlayAudio}
                                onToggle={(value) => updateSettings({ autoPlayAudio: value })}
                                styles={styles}
                                theme={theme}
                            />
                        </View>

                        {/* Notifications */}
                        <Text style={styles.settingSectionTitle}>Notifications</Text>
                        <View style={[styles.settingsCard, { backgroundColor: theme.background.primary }]}>
                            <SettingRow
                                icon="notifications"
                                iconColor={Colors.primary[500]}
                                title="Daily Reminders"
                                value={settings.notificationsEnabled}
                                onToggle={(value) => updateSettings({ notificationsEnabled: value })}
                                styles={styles}
                                theme={theme}
                            />
                        </View>

                        {/* Daily Goal */}
                        <Text style={styles.settingSectionTitle}>Daily Goal</Text>
                        <View style={[styles.settingsCard, { backgroundColor: theme.background.primary }]}>
                            <View style={styles.goalOptions}>
                                {[5, 10, 15, 30].map((goal) => (
                                    <TouchableOpacity
                                        key={goal}
                                        onPress={() => updateProgress({ dailyGoal: goal as any })}
                                        style={[
                                            styles.goalOption,
                                            progress.dailyGoal === goal && styles.goalOptionActive,
                                            { backgroundColor: progress.dailyGoal === goal ? Colors.primary[500] : theme.background.tertiary }
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[
                                            styles.goalOptionText,
                                            progress.dailyGoal === goal && styles.goalOptionTextActive,
                                            { color: progress.dailyGoal === goal ? Colors.white : theme.text.primary }
                                        ]}>
                                            {goal} min
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Danger Zone */}
                        <Text style={[styles.settingSectionTitle, { color: Colors.error[500] }]}>Danger Zone</Text>
                        <View style={[styles.settingsCard, { backgroundColor: theme.background.primary, borderColor: Colors.error[200], borderWidth: 1 }]}>
                            <TouchableOpacity
                                style={styles.dangerButton}
                                onPress={() => setShowConfirmModal('resetProgress')}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="trash-outline" size={20} color={Colors.error[500]} />
                                <Text style={styles.dangerButtonText}>Reset All Progress</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </FadeInView>



                {/* App Info Footer */}
                <FadeInView delay={500}>
                    <View style={styles.footer}>
                        <Text style={styles.footerVersion}>HalloDeutsch v1.0.0</Text>
                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>Made with </Text>
                            <Ionicons name="heart" size={12} color={Colors.error[400]} />
                            <Text style={styles.footerText}> by Akshay Kadam</Text>
                        </View>
                    </View>
                </FadeInView>
            </ScrollView>



            {/* Download Result Modal */}
            <Modal
                visible={showResultModal !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setShowResultModal(null)}
            >
                <View style={styles.resultModalOverlay}>
                    <View style={[styles.resultModalContent, { backgroundColor: theme.background.primary }]}>
                        <LinearGradient
                            colors={showResultModal === 'success'
                                ? [Colors.success[400], Colors.success[600]]
                                : [Colors.error[400], Colors.error[600]]}
                            style={styles.resultIconContainer}
                        >
                            <Ionicons
                                name={showResultModal === 'success' ? "checkmark" : "close"}
                                size={48}
                                color={Colors.white}
                            />
                        </LinearGradient>

                        <Text style={[styles.resultTitle, { color: theme.text.primary }]}>
                            {showResultModal === 'success' ? 'Download Complete!' : 'Download Failed'}
                        </Text>

                        <Text style={[styles.resultMessage, { color: theme.text.secondary }]}>
                            {showResultModal === 'success'
                                ? 'German voice model is ready for offline use. Enjoy high-quality pronunciation!'
                                : 'Unable to download the voice model. Please check your internet connection and try again.'}
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.resultButton,
                                { backgroundColor: showResultModal === 'success' ? Colors.success[500] : Colors.error[500] }
                            ]}
                            onPress={() => setShowResultModal(null)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.resultButtonText}>
                                {showResultModal === 'success' ? 'Got it!' : 'Try Again Later'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirmModal !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setShowConfirmModal(null)}
            >
                <View style={styles.resultModalOverlay}>
                    <View style={[styles.resultModalContent, { backgroundColor: theme.background.primary }]}>
                        <LinearGradient
                            colors={[Colors.warning[400], Colors.warning[600]]}
                            style={styles.resultIconContainer}
                        >
                            <Ionicons
                                name={showConfirmModal === 'deleteModel' ? "mic-off" : "warning"}
                                size={40}
                                color={Colors.white}
                            />
                        </LinearGradient>

                        <Text style={[styles.resultTitle, { color: theme.text.primary }]}>
                            {showConfirmModal === 'deleteModel' ? 'Delete Voice Model?' : 'Reset Progress?'}
                        </Text>

                        <Text style={[styles.resultMessage, { color: theme.text.secondary }]}>
                            {showConfirmModal === 'deleteModel'
                                ? 'You will need to download it again to use offline TTS.'
                                : 'All your learning progress will be lost. This cannot be undone.'}
                        </Text>

                        <View style={styles.confirmButtonRow}>
                            <TouchableOpacity
                                style={[styles.confirmButton, styles.confirmButtonCancel, { backgroundColor: theme.background.tertiary }]}
                                onPress={() => setShowConfirmModal(null)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.confirmButtonText, { color: theme.text.primary }]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.confirmButton, { backgroundColor: Colors.error[500] }]}
                                onPress={showConfirmModal === 'deleteModel' ? handleDeleteModel : handleResetProgress}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.resultButtonText}>
                                    {showConfirmModal === 'deleteModel' ? 'Delete' : 'Reset'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeArea>
    );
};

// Daily Activity Chart Component (Line Graph)
const DailyActivityChart: React.FC<{
    dailyStats: Record<string, number>;
    minutesToday: number;
    dailyGoal: number;
    theme: any;
}> = ({ dailyStats, minutesToday, dailyGoal, theme }) => {
    const styles = getStyles(theme, false); // Theme is local here
    const [layout, setLayout] = React.useState({ width: 0, height: 0 });

    // Get last 7 days including today
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });

        let minutes = dailyStats[dateStr] || 0;
        if (i === 0) minutes = minutesToday; // Ensure today's live minutes are shown

        days.push({
            label: dayLabel,
            minutes,
            isToday: i === 0,
            date: dateStr
        });
    }

    const maxMinutes = Math.max(...days.map(d => d.minutes), dailyGoal, 10) * 1.2; // Add 20% buffer

    // Geometry calculations
    const points = days.map((day, index) => {
        if (!layout.width) return null;

        const x = (index / (days.length - 1)) * (layout.width - 20) + 10; // 10px padding sides
        // Invert Y axis (0 is top)
        const y = layout.height - ((day.minutes / maxMinutes) * layout.height) - 10; // 10px padding bottom

        return { x, y, ...day };
    });

    return (
        <View style={styles.chartCard} onLayout={(e) => setLayout(e.nativeEvent.layout)}>
            <View
                style={styles.chartContainer}
            >
                {/* Grid Lines (Horizontal) */}
                <View style={[styles.gridLine, { bottom: 10, backgroundColor: theme.border.light }]} />
                <View style={[styles.gridLine, { bottom: layout.height / 2, backgroundColor: theme.border.light }]} />
                <View style={[styles.gridLine, { top: 0, backgroundColor: theme.border.light }]} />

                {/* Connecting Lines */}
                {points.map((p, i) => {
                    if (i === 0 || !p || !points[i - 1]) return null;
                    const pPrev = points[i - 1];
                    if (!pPrev) return null;

                    const dx = p.x - pPrev.x;
                    const dy = p.y - pPrev.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);

                    return (
                        <View
                            key={`line-${i}`}
                            style={{
                                position: 'absolute',
                                left: (pPrev.x + p.x) / 2 - length / 2,
                                top: (pPrev.y + p.y) / 2 - 1.5,
                                width: length,
                                height: 3,
                                backgroundColor: p.isToday ? Colors.primary[500] : Colors.primary[300],
                                transform: [{ rotate: `${angle}rad` }],
                                borderRadius: 1.5,
                            }}
                        />
                    );
                })}

                {/* Dots and Labels */}
                {points.map((p, index) => {
                    if (!p) return null;
                    const isGoalMet = p.minutes >= dailyGoal;
                    const dotSize = p.isToday ? 12 : 8;
                    const dotColor = isGoalMet ? Colors.success[500] : (p.isToday ? Colors.primary[500] : Colors.neutral[400]);

                    return (
                        <React.Fragment key={`dot-${index}`}>
                            <View
                                style={{
                                    position: 'absolute',
                                    left: p.x - dotSize / 2,
                                    top: p.y - dotSize / 2,
                                    width: dotSize,
                                    height: dotSize,
                                    borderRadius: dotSize / 2,
                                    backgroundColor: dotColor,
                                    borderWidth: 2,
                                    borderColor: theme.background.primary,
                                    zIndex: 10,
                                    ...Shadows.sm
                                }}
                            />
                            <View style={{ position: 'absolute', left: p.x - 10, bottom: -24, width: 20, alignItems: 'center' }}>
                                <Text style={[
                                    styles.dayLabel,
                                    p.isToday && { color: Colors.primary[500], fontWeight: 'bold' }
                                ]}>
                                    {p.label}
                                </Text>
                            </View>
                        </React.Fragment>
                    );
                })}
            </View>
        </View>
    );
};

const SettingRow: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    title: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    styles: any;
    theme: any;
}> = ({ icon, iconColor, title, value, onToggle, styles, theme }) => (
    <View style={styles.settingRow}>
        <View style={[styles.settingIconBg, { backgroundColor: iconColor + '15' }]}>
            <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: Colors.neutral[300], true: Colors.primary[400] }}
            thumbColor={value ? Colors.primary[600] : Colors.neutral[50]}
        />
    </View>
);

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    // Activity Chart Styles
    chartCard: {
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        marginHorizontal: Spacing.base,
        marginTop: Spacing.sm,
        marginBottom: Spacing.md,
        ...Shadows.sm,
    },
    chartContainer: {
        height: 120, // Increased height for better visibility
        marginTop: Spacing.md,
        marginBottom: Spacing.md,
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
    },
    dayLabel: {
        fontSize: FontSize.xs,
        color: theme.text.secondary,
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: Spacing['3xl'],
    },
    profileHeader: {
        alignItems: 'center',
        paddingTop: Spacing['3xl'],
        paddingBottom: Spacing['4xl'],
        paddingHorizontal: Spacing.xl,
    },
    settingsButton: {
        position: 'absolute',
        top: Spacing.lg,
        right: Spacing.lg,
        zIndex: 50,
        elevation: 5,
    },
    settingsIconBg: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    avatarGlow: {
        padding: 4,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginBottom: Spacing.md,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.lg,
    },
    avatarInitial: {
        fontSize: 42,
        fontWeight: FontWeight.bold,
        color: Colors.primary[500],
    },
    profileName: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.white,
        marginBottom: Spacing.md,
    },
    levelBadgeContainer: {
        alignItems: 'center',
    },
    levelBadgeGradient: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginBottom: Spacing.xs,
    },
    levelBadgeText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    levelTitle: {
        fontSize: FontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: FontWeight.medium,
    },
    backButton: {
        position: 'absolute',
        top: Spacing.lg,
        left: Spacing.lg,
        zIndex: 50,
        elevation: 5,
    },
    integratedSettingsContainer: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.base,
    },
    statsContainer: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.base,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.xl,
        ...Shadows.sm,
    },
    statIconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    statValue: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: theme.text.secondary,
        marginTop: 2,
    },
    journeyCard: {
        marginHorizontal: Spacing.base,
        marginTop: Spacing.lg,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        ...Shadows.sm,
    },
    journeyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    journeyTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    journeyTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
    },
    journeyLevelPill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    journeyLevelText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    journeySubtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginBottom: Spacing.md,
    },
    journeyStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? theme.background.tertiary : Colors.neutral[100],
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
    },
    journeyStat: {
        flex: 1,
        alignItems: 'center',
    },
    journeyStatValue: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    journeyStatLabel: {
        fontSize: FontSize.xs,
        color: theme.text.secondary,
    },
    journeyDivider: {
        width: 1,
        height: 30,
        marginHorizontal: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
        marginTop: Spacing.xl,
    },

    footer: {
        alignItems: 'center',
        marginTop: Spacing['3xl'],
        marginBottom: Spacing.xl,
    },
    footerVersion: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
        marginBottom: Spacing.xs,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
    },
    // Modal styles
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    closeButton: {
        padding: Spacing.xs,
    },
    settingsContent: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    settingSectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: theme.text.secondary,
        marginBottom: Spacing.sm,
        marginTop: Spacing.xl,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    settingsCard: {
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    settingIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    settingTitle: {
        flex: 1,
        fontSize: FontSize.base,
        color: theme.text.primary,
    },
    settingSubtitle: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
        marginTop: 2,
    },
    settingDivider: {
        height: 1,
        marginVertical: Spacing.xs,
        marginLeft: 52,
    },
    levelOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    levelOption: {
        width: '48%', // Ensure 2 items per row with gap
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
        backgroundColor: 'transparent',
    },
    levelOptionText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
    levelOptionTextActive: {
        color: Colors.white,
    },
    goalOptions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    goalOption: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
    },
    goalOptionActive: {},
    goalOptionText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: theme.text.secondary,
    },
    goalOptionTextActive: {
        color: Colors.white,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    dangerButtonText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.error[500],
    },
    // Result Modal styles
    resultModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    resultModalContent: {
        width: '100%',
        maxWidth: 320,
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.xl,
        alignItems: 'center',
        ...Shadows.lg,
    },
    resultIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    resultTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    resultMessage: {
        fontSize: FontSize.base,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.xl,
    },
    resultButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing['2xl'],
        borderRadius: BorderRadius.full,
        minWidth: 150,
    },
    resultButtonText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        textAlign: 'center',
    },
    // Confirmation Modal styles
    confirmButtonRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        width: '100%',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    confirmButtonCancel: {},
    confirmButtonText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
    },
});
