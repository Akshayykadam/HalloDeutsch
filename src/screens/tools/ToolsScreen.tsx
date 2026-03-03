import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { haptics } from '../../utils/haptics';

interface ToolItem {
    id: string;
    title: string;
    desc: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: keyof RootStackParamList;
    gradient: [string, string];
}

const FEATURED_TOOLS: ToolItem[] = [
    {
        id: 'snap',
        title: 'Snap & Learn',
        desc: 'Point your camera at anything',
        icon: 'camera',
        route: 'Snap',
        gradient: [Colors.primary[400], Colors.primary[600]],
    },
    {
        id: 'flashcards',
        title: 'Flashcards',
        desc: 'Spaced repetition system',
        icon: 'albums',
        route: 'Flashcards',
        gradient: [Colors.secondary[400], Colors.secondary[600]],
    },
];

const MORE_TOOLS: ToolItem[] = [
    {
        id: 'pronunciation',
        title: 'Pronunciation',
        desc: 'Perfect your accent',
        icon: 'mic',
        route: 'Pronunciation',
        gradient: [Colors.primary[400], Colors.primary[600]],
    },
    {
        id: 'article',
        title: 'Article Drill',
        desc: 'Der, Die, or Das?',
        icon: 'flash',
        route: 'ArticleDrill',
        gradient: [Colors.secondary[400], Colors.secondary[600]],
    },
    {
        id: 'dictation',
        title: 'Dictation',
        desc: 'Practice listening',
        icon: 'pencil',
        route: 'Dictation',
        gradient: ['#8B5CF6', '#6D28D9'],
    },
    {
        id: 'penpal',
        title: 'AI Pen Pal',
        desc: 'Write letters with AI',
        icon: 'mail',
        route: 'PenPal',
        gradient: [Colors.success[400], Colors.success[600]],
    },
    {
        id: 'exam',
        title: 'Exam Prep',
        desc: 'Goethe / Telc prep',
        icon: 'school',
        route: 'ExamPrep',
        gradient: [Colors.warning[400], Colors.warning[600]],
    },
    {
        id: 'culture',
        title: 'Culture',
        desc: 'Life in Germany',
        icon: 'globe',
        route: 'CulturalGuide',
        gradient: [Colors.error[400], Colors.error[600]],
    },
    {
        id: 'idioms',
        title: 'Idioms',
        desc: 'Slang & Phrases',
        icon: 'chatbubbles',
        route: 'IdiomsSlang',
        gradient: [Colors.info[400], Colors.info[600]],
    },
    {
        id: 'grammar',
        title: 'Grammar Tables',
        desc: 'Quick reference',
        icon: 'grid',
        route: 'GrammarReference',
        gradient: [Colors.gold[400], Colors.gold[600]],
    },
    {
        id: 'fillinblank',
        title: 'Fill in Blank',
        desc: 'AI quiz maker',
        icon: 'help-circle',
        route: 'FillInBlank',
        gradient: ['#8B5CF6', '#7C3AED'],
    },
];

export const ToolsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const navigateTo = (route: keyof RootStackParamList) => {
        haptics.light();
        navigation.navigate(route as any);
    };

    return (
        <SafeArea style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tools</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Featured Tools */}
                {FEATURED_TOOLS.map(tool => (
                    <TouchableOpacity
                        key={tool.id}
                        activeOpacity={0.8}
                        onPress={() => navigateTo(tool.route)}
                        style={styles.featuredCard}
                    >
                        <LinearGradient
                            colors={tool.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.featuredGradient}
                        >
                            <View style={styles.featuredIconWrap}>
                                <Ionicons name={tool.icon} size={24} color={Colors.white} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.featuredTitle}>{tool.title}</Text>
                                <Text style={styles.featuredDesc}>{tool.desc}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}

                {/* Section Label */}
                <Text style={[styles.sectionLabel, { color: theme.text.tertiary }]}>More Tools</Text>

                {/* Tool List */}
                <View style={styles.toolList}>
                    {MORE_TOOLS.map(tool => (
                        <TouchableOpacity
                            key={tool.id}
                            activeOpacity={0.7}
                            onPress={() => navigateTo(tool.route)}
                            style={[styles.toolRow, { backgroundColor: theme.background.primary }]}
                        >
                            <LinearGradient
                                colors={tool.gradient}
                                style={styles.toolIconWrap}
                            >
                                <Ionicons name={tool.icon} size={18} color={Colors.white} />
                            </LinearGradient>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.toolTitle, { color: theme.text.primary }]}>{tool.title}</Text>
                                <Text style={[styles.toolDesc, { color: theme.text.tertiary }]}>{tool.desc}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={theme.text.tertiary} />
                        </TouchableOpacity>
                    ))}
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
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },

    /* Featured cards */
    featuredCard: {
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
    },
    featuredGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    featuredIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featuredTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    featuredDesc: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },

    /* Section label */
    sectionLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 1,
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
    },

    /* Tool list rows */
    toolList: {
        marginHorizontal: Spacing.base,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
    },
    toolRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border.light,
    },
    toolIconWrap: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
    },
    toolDesc: {
        fontSize: FontSize.xs,
        marginTop: 1,
    },
});
