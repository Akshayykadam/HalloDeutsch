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
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

export const ToolsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme, isDark } = useTheme();
    const styles = getStyles(theme, isDark);

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Learning Tools</Text>
                <Text style={styles.headerSubtitle}>Helper tools to boost your learning</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Feature Cards */}
                <View style={styles.featuresContainer}>
                    <TouchableOpacity
                        style={[styles.featureCard]}
                        onPress={() => navigation.navigate('Snap')}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={[Colors.primary[500], Colors.primary[700]]}
                            style={styles.featureGradient}
                        >
                            <View style={styles.featureIcon}>
                                <Ionicons name="camera" size={32} color={Colors.white} />
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Snap & Learn</Text>
                                <Text style={styles.featureDesc}>Identify objects instantly</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.featureCard]}
                        onPress={() => navigation.navigate('Flashcards')}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={[Colors.secondary[500], Colors.secondary[700]]}
                            style={styles.featureGradient}
                        >
                            <View style={styles.featureIcon}>
                                <Ionicons name="albums" size={32} color={Colors.white} />
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Flashcards</Text>
                                <Text style={styles.featureDesc}>Spaced repetition</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>More Tools</Text>
                </View>

                <View style={styles.miniCardsContainer}>
                    <TouchableOpacity
                        style={styles.miniCard}
                        onPress={() => navigation.navigate('Pronunciation')}
                    >
                        <View style={[styles.miniCardIconBg, { backgroundColor: Colors.primary[500] + '15' }]}>
                            <Ionicons name="mic-outline" size={32} color={Colors.primary[500]} />
                        </View>
                        <Text style={styles.miniCardTitle}>Pronunciation</Text>
                        <Text style={styles.miniCardDesc}>Perfect your accent</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.miniCard}
                        onPress={() => navigation.navigate('ArticleDrill')}
                    >
                        <View style={[styles.miniCardIconBg, { backgroundColor: Colors.secondary[500] + '15' }]}>
                            <Ionicons name="flash-outline" size={32} color={Colors.secondary[500]} />
                        </View>
                        <Text style={styles.miniCardTitle}>Article Drill</Text>
                        <Text style={styles.miniCardDesc}>Der, Die, or Das?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.miniCard}
                        onPress={() => navigation.navigate('Dictation')}
                    >
                        <View style={[styles.miniCardIconBg, { backgroundColor: Colors.accent[500] + '15' }]}>
                            <Ionicons name="pencil-outline" size={32} color={Colors.accent[500]} />
                        </View>
                        <Text style={styles.miniCardTitle}>Dictation</Text>
                        <Text style={styles.miniCardDesc}>Practice listening</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.miniCard}
                        onPress={() => navigation.navigate('PenPal')}
                    >
                        <View style={[styles.miniCardIconBg, { backgroundColor: Colors.success[500] + '15' }]}>
                            <Ionicons name="mail-outline" size={32} color={Colors.success[500]} />
                        </View>
                        <Text style={styles.miniCardTitle}>AI Pen Pal</Text>
                        <Text style={styles.miniCardDesc}>Chat with AI</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.miniCard}
                        onPress={() => navigation.navigate('ExamPrep')}
                    >
                        <View style={[styles.miniCardIconBg, { backgroundColor: Colors.warning[500] + '15' }]}>
                            <Ionicons name="school-outline" size={32} color={Colors.warning[500]} />
                        </View>
                        <Text style={styles.miniCardTitle}>Exam Prep</Text>
                        <Text style={styles.miniCardDesc}>Goethe / Telc</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.miniCard}
                        onPress={() => navigation.navigate('CulturalGuide')}
                    >
                        <View style={[styles.miniCardIconBg, { backgroundColor: Colors.error[500] + '15' }]}>
                            <Ionicons name="globe-outline" size={32} color={Colors.error[500]} />
                        </View>
                        <Text style={styles.miniCardTitle}>Culture</Text>
                        <Text style={styles.miniCardDesc}>Life in Germany</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.miniCard}
                        onPress={() => navigation.navigate('IdiomsSlang')}
                    >
                        <View style={[styles.miniCardIconBg, { backgroundColor: Colors.info[500] + '15' }]}>
                            <Ionicons name="chatbubbles-outline" size={32} color={Colors.info[500]} />
                        </View>
                        <Text style={styles.miniCardTitle}>Idioms</Text>
                        <Text style={styles.miniCardDesc}>Slang & Phrases</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeArea>
    );
};

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    header: {
        padding: Spacing.lg,
        paddingTop: Spacing.xl,
        backgroundColor: theme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
    },
    headerTitle: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: 4,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },

    featuresContainer: {
        marginBottom: Spacing.xl,
        gap: Spacing.md,
    },
    featureCard: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        height: 100,
        ...Shadows.md,
    },
    featureGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        height: '100%',
    },
    featureIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: FontSize.sm,
        color: 'rgba(255,255,255,0.9)',
    },
    sectionHeader: {
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    miniCardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    miniCard: {
        width: '47%',
        backgroundColor: theme.background.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        alignItems: 'center',
        marginBottom: Spacing.sm,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: theme.border.light,
    },
    miniCardIconBg: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    miniCardTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        textAlign: 'center',
        marginBottom: 2,
    },
    miniCardDesc: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
        textAlign: 'center',
    },
});
