// Premium Profile Screen - User stats and settings
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
import { SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LevelColors, Shadows } from '../../theme';
import { useUserStore, useSettingsStore } from '../../store';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { getLevelTitle, getLevelDescription } from '../../utils/levelUtils';
import { isModelDownloaded, downloadModel, deleteModel, getModelSize } from '../../services/audioService';
import { AuthSection } from '../../components/auth';
import { haptics } from '../../utils/haptics';
import { isAuthenticated, getCurrentUser } from '../../services/authService';
import { seedDatabase } from '../../services/adminService';

const LEVEL_LABELS: Record<string, string> = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Advanced' };
const LEVEL_GRADIENTS: Record<string, [string, string]> = {
    A1: [Colors.success[400], Colors.success[600]],
    A2: [Colors.primary[400], Colors.primary[600]],
    B1: ['#8B5CF6', '#6D28D9'],
    B2: [Colors.secondary[400], Colors.secondary[600]],
};

export const ProfileScreen: React.FC = () => {
    const { progress, updateProgress, reset: resetProgress, profile } = useUserStore();
    const { settings, updateSettings } = useSettingsStore();
    const { theme, toggleTheme, isDark } = useTheme();
    const navigation = useNavigation();

    // TTS Model
    const [ttsState, setTtsState] = useState<'checking' | 'ready' | 'missing' | 'downloading'>('checking');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [modelSize, setModelSize] = useState<string>('');
    const [showConfirmModal, setShowConfirmModal] = useState<'deleteModel' | 'resetProgress' | null>(null);
    const [showResultModal, setShowResultModal] = useState<'success' | 'error' | null>(null);

    React.useEffect(() => { checkModelStatus(); }, []);

    const checkModelStatus = async () => {
        setTtsState('checking');
        const isDown = await isModelDownloaded();
        if (isDown) {
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
        const success = await downloadModel((p) => setDownloadProgress(Math.round(p * 100)));
        if (success) { await checkModelStatus(); setShowResultModal('success'); }
        else { setTtsState('missing'); setShowResultModal('error'); }
    };

    const handleDeleteModel = async () => { setShowConfirmModal(null); await deleteModel(); await checkModelStatus(); };
    const handleResetProgress = () => { setShowConfirmModal(null); resetProgress(); };

    const levelInfo = getLevelDescription(progress.level);
    const initial = (profile?.displayName || 'L')[0].toUpperCase();

    return (
        <SafeArea style={[styles.container, { backgroundColor: theme.background.primary }]}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* ─── Header ─── */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Profile</Text>
                    <TouchableOpacity onPress={() => (navigation as any).navigate('About')}>
                        <Ionicons name="information-circle-outline" size={22} color={theme.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* ─── Avatar Card ─── */}
                <LinearGradient
                    colors={isDark ? ['#1E1B4B', '#312E81'] : [Colors.primary[500], Colors.primary[700]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarCard}
                >
                    <View style={styles.avatarRing}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarLetter}>{initial}</Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>{profile?.displayName || 'German Learner'}</Text>
                    <View style={styles.levelPill}>
                        <View style={[styles.levelDot, { backgroundColor: LevelColors[progress.level] }]} />
                        <Text style={styles.levelPillText}>{levelInfo.title}</Text>
                    </View>
                </LinearGradient>

                {/* ─── Stats Row ─── */}
                <View style={styles.statsRow}>
                    {[
                        { label: 'Lessons', value: progress.lessonsCompleted, icon: 'book' as const, color: Colors.primary[500] },
                        { label: 'Words', value: progress.wordsLearned, icon: 'text' as const, color: Colors.secondary[500] },
                        { label: 'Grammar', value: progress.grammarTopicsCompleted || 0, icon: 'school' as const, color: Colors.success[500] },
                    ].map((stat) => (
                        <View key={stat.label} style={[styles.statCard, { backgroundColor: theme.background.secondary }]}>
                            <Ionicons name={stat.icon} size={20} color={stat.color} />
                            <Text style={[styles.statValue, { color: theme.text.primary }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: theme.text.tertiary }]}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* ─── Auth / Cloud Sync ─── */}
                <AuthSection theme={theme} isDark={isDark} />

                {/* ─── Learning Level ─── */}
                <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>Learning Level</Text>
                <View style={[styles.card, { backgroundColor: theme.background.secondary }]}>
                    <View style={styles.levelGrid}>
                        {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => {
                            const isActive = progress.level === lvl;
                            return (
                                <TouchableOpacity
                                    key={lvl}
                                    onPress={() => { updateProgress({ level: lvl as any }); haptics.selection(); }}
                                    activeOpacity={0.7}
                                    style={styles.levelGridItem}
                                >
                                    {isActive ? (
                                        <LinearGradient
                                            colors={LEVEL_GRADIENTS[lvl]}
                                            style={styles.levelBtn}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <Text style={styles.levelBtnTextActive}>{LEVEL_LABELS[lvl]}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={[styles.levelBtn, { backgroundColor: theme.background.tertiary }]}>
                                            <Text style={[styles.levelBtnText, { color: theme.text.secondary }]}>{LEVEL_LABELS[lvl]}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ─── Daily Goal ─── */}
                <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>Daily Goal</Text>
                <View style={[styles.card, { backgroundColor: theme.background.secondary }]}>
                    <View style={styles.goalRow}>
                        {[5, 10, 15, 30].map((goal) => {
                            const isActive = progress.dailyGoal === goal;
                            return (
                                <TouchableOpacity
                                    key={goal}
                                    onPress={() => { updateProgress({ dailyGoal: goal as any }); haptics.selection(); }}
                                    activeOpacity={0.7}
                                    style={{ flex: 1 }}
                                >
                                    {isActive ? (
                                        <LinearGradient
                                            colors={[Colors.primary[500], Colors.primary[600]]}
                                            style={styles.goalBtn}
                                        >
                                            <Text style={styles.goalBtnTextActive}>{goal}</Text>
                                            <Text style={styles.goalBtnSubActive}>min</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={[styles.goalBtn, { backgroundColor: theme.background.tertiary }]}>
                                            <Text style={[styles.goalBtnText, { color: theme.text.primary }]}>{goal}</Text>
                                            <Text style={[styles.goalBtnSub, { color: theme.text.tertiary }]}>min</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ─── Preferences ─── */}
                <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>Preferences</Text>
                <View style={[styles.card, { backgroundColor: theme.background.secondary }]}>
                    <SettingRow
                        icon="moon-outline"
                        label="Dark Mode"
                        value={isDark}
                        onToggle={toggleTheme}
                        theme={theme}
                    />
                </View>

                {/* ─── Voice Model ─── */}
                <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>
                    Offline Voice {modelSize ? `(${modelSize})` : ''}
                </Text>
                <View style={[styles.card, { backgroundColor: theme.background.secondary }]}>
                    {ttsState === 'downloading' ? (
                        <View style={styles.downloadRow}>
                            <Text style={[styles.downloadText, { color: theme.text.primary }]}>Downloading... {downloadProgress}%</Text>
                            <View style={[styles.downloadTrack, { backgroundColor: theme.background.tertiary }]}>
                                <LinearGradient
                                    colors={[Colors.primary[400], Colors.primary[600]]}
                                    style={[styles.downloadFill, { width: `${downloadProgress}%` }]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.voiceRow}
                            onPress={ttsState === 'ready' ? () => setShowConfirmModal('deleteModel') : handleDownloadModel}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.voiceIcon, { backgroundColor: Colors.primary[500] + '15' }]}>
                                <Ionicons name="mic-outline" size={20} color={Colors.primary[500]} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.voiceTitle, { color: theme.text.primary }]}>German Voice (Thorsten)</Text>
                                <Text style={[styles.voiceSub, { color: theme.text.tertiary }]}>
                                    {ttsState === 'ready' ? 'Ready for offline use' : 'Tap to download'}
                                </Text>
                            </View>
                            <Ionicons
                                name={ttsState === 'ready' ? 'trash-outline' : 'cloud-download-outline'}
                                size={22}
                                color={ttsState === 'ready' ? Colors.error[500] : Colors.primary[500]}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ─── Danger ─── */}
                <Text style={[styles.sectionTitle, { color: Colors.error[500] }]}>Danger Zone</Text>
                <TouchableOpacity
                    style={[styles.card, styles.dangerCard, { backgroundColor: theme.background.secondary }]}
                    onPress={() => setShowConfirmModal('resetProgress')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={20} color={Colors.error[500]} />
                    <Text style={styles.dangerText}>Reset All Progress</Text>
                </TouchableOpacity>

                {/* ─── Footer ─── */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.text.tertiary }]}>HalloDeutsch v1.0.1</Text>
                    <View style={styles.footerRow}>
                        <Text style={[styles.footerSmall, { color: theme.text.tertiary }]}>Made with </Text>
                        <Ionicons name="heart" size={11} color={Colors.error[400]} />
                        <Text style={[styles.footerSmall, { color: theme.text.tertiary }]}> by Akshay Kadam</Text>
                    </View>
                </View>
            </ScrollView>

            {/* ─── Result Modal ─── */}
            <Modal visible={showResultModal !== null} transparent animationType="fade" onRequestClose={() => setShowResultModal(null)}>
                <View style={styles.overlay}>
                    <View style={[styles.modal, { backgroundColor: theme.background.primary }]}>
                        <LinearGradient
                            colors={showResultModal === 'success' ? [Colors.success[400], Colors.success[600]] : [Colors.error[400], Colors.error[600]]}
                            style={styles.modalIcon}
                        >
                            <Ionicons name={showResultModal === 'success' ? 'checkmark' : 'close'} size={40} color={Colors.white} />
                        </LinearGradient>
                        <Text style={[styles.modalTitle, { color: theme.text.primary }]}>
                            {showResultModal === 'success' ? 'Download Complete!' : 'Download Failed'}
                        </Text>
                        <Text style={[styles.modalMsg, { color: theme.text.secondary }]}>
                            {showResultModal === 'success'
                                ? 'German voice model is ready for offline use.'
                                : 'Check your internet connection and try again.'}
                        </Text>
                        <TouchableOpacity
                            style={[styles.modalBtn, { backgroundColor: showResultModal === 'success' ? Colors.success[500] : Colors.error[500] }]}
                            onPress={() => setShowResultModal(null)}
                        >
                            <Text style={styles.modalBtnText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ─── Confirm Modal ─── */}
            <Modal visible={showConfirmModal !== null} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(null)}>
                <View style={styles.overlay}>
                    <View style={[styles.modal, { backgroundColor: theme.background.primary }]}>
                        <LinearGradient colors={[Colors.warning[400], Colors.warning[600]]} style={styles.modalIcon}>
                            <Ionicons name={showConfirmModal === 'deleteModel' ? 'mic-off' : 'warning'} size={36} color={Colors.white} />
                        </LinearGradient>
                        <Text style={[styles.modalTitle, { color: theme.text.primary }]}>
                            {showConfirmModal === 'deleteModel' ? 'Delete Voice Model?' : 'Reset Progress?'}
                        </Text>
                        <Text style={[styles.modalMsg, { color: theme.text.secondary }]}>
                            {showConfirmModal === 'deleteModel'
                                ? 'You\'ll need to download it again for offline TTS.'
                                : 'All learning progress will be lost. This cannot be undone.'}
                        </Text>
                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity
                                style={[styles.modalBtnHalf, { backgroundColor: theme.background.tertiary }]}
                                onPress={() => setShowConfirmModal(null)}
                            >
                                <Text style={[styles.modalBtnText, { color: theme.text.primary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtnHalf, { backgroundColor: Colors.error[500] }]}
                                onPress={showConfirmModal === 'deleteModel' ? handleDeleteModel : handleResetProgress}
                            >
                                <Text style={styles.modalBtnText}>{showConfirmModal === 'deleteModel' ? 'Delete' : 'Reset'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeArea>
    );
};

// ─── Setting Row Component ───
const SettingRow: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: boolean;
    onToggle: (v: boolean) => void;
    theme: any;
}> = ({ icon, label, value, onToggle, theme }) => (
    <View style={styles.settingRow}>
        <View style={[styles.settingIcon, { backgroundColor: Colors.primary[500] + '15' }]}>
            <Ionicons name={icon} size={20} color={Colors.primary[500]} />
        </View>
        <Text style={[styles.settingLabel, { color: theme.text.primary }]}>{label}</Text>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: Colors.neutral[300], true: Colors.primary[400] }}
            thumbColor={value ? Colors.primary[600] : Colors.neutral[50]}
        />
    </View>
);

// ─── Styles ───
const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingBottom: Spacing['3xl'] },

    // Header
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    backBtn: { padding: Spacing.xs },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },

    // Avatar Card
    avatarCard: {
        marginHorizontal: Spacing.base,
        borderRadius: BorderRadius['2xl'],
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    avatarRing: {
        padding: 3,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLetter: { fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white },
    userName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white, marginBottom: Spacing.sm },
    levelPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    levelDot: { width: 8, height: 8, borderRadius: 4 },
    levelPillText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.white },

    // Stats
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.xl,
        gap: 4,
    },
    statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
    statLabel: { fontSize: FontSize.xs },

    // Sections
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginHorizontal: Spacing.base,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    card: {
        marginHorizontal: Spacing.base,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
    },

    // Level Grid
    levelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    levelGridItem: { width: '48%' },
    levelBtn: {
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    levelBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    levelBtnTextActive: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.white },

    // Goal
    goalRow: { flexDirection: 'row', gap: Spacing.sm },
    goalBtn: {
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    goalBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    goalBtnSub: { fontSize: FontSize.xs },
    goalBtnTextActive: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.white },
    goalBtnSubActive: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },

    // Settings
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
    settingIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
    settingLabel: { flex: 1, fontSize: FontSize.md },

    // Voice
    voiceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    voiceIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    voiceTitle: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
    voiceSub: { fontSize: FontSize.xs, marginTop: 2 },
    downloadRow: { padding: Spacing.sm },
    downloadText: { fontSize: FontSize.sm, marginBottom: Spacing.sm, textAlign: 'center' },
    downloadTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
    downloadFill: { height: '100%', borderRadius: 3 },

    // Danger
    dangerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderWidth: 1, borderColor: Colors.error[200] },
    dangerText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.error[500] },

    // Footer
    footer: { alignItems: 'center', marginTop: Spacing['3xl'] },
    footerText: { fontSize: FontSize.sm, marginBottom: Spacing.xs },
    footerRow: { flexDirection: 'row', alignItems: 'center' },
    footerSmall: { fontSize: FontSize.xs },

    // Modals
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    modal: { width: '100%', maxWidth: 320, borderRadius: BorderRadius['2xl'], padding: Spacing.xl, alignItems: 'center', ...Shadows.lg },
    modalIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
    modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.sm, textAlign: 'center' },
    modalMsg: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xl },
    modalBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing['2xl'], borderRadius: BorderRadius.full, minWidth: 120 },
    modalBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white, textAlign: 'center' },
    modalBtnRow: { flexDirection: 'row', gap: Spacing.md, width: '100%' },
    modalBtnHalf: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center' },
});
