// Level Selection Screen - Direct proficiency level selection
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Button, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, LevelColors } from '../../theme';
import { OnboardingStackParamList, CEFRLevel } from '../../types';
import { useUserStore, useSettingsStore } from '../../store';

type LevelSelectionScreenProps = {
    navigation: NativeStackNavigationProp<OnboardingStackParamList, 'LevelSelection'>;
};

interface LevelOption {
    id: CEFRLevel;
    title: string;
    description: string;
    topics: string[];
}

const levelOptions: LevelOption[] = [
    {
        id: 'A1',
        title: 'Beginner',
        description: 'I am just starting out',
        topics: ['Greetings', 'Numbers', 'Basic phrases'],
    },
    {
        id: 'A2',
        title: 'Elementary',
        description: 'I can understand simple sentences',
        topics: ['Shopping', 'Family', 'Daily routine'],
    },
    {
        id: 'B1',
        title: 'Intermediate',
        description: 'I can deal with most situations',
        topics: ['Travel', 'Work', 'Opinions'],
    },
    {
        id: 'B2',
        title: 'Upper Intermediate',
        description: 'I can speak fluently and spontaneously',
        topics: ['Complex texts', 'Abstract topics', 'Discussions'],
    },
];

export const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({ navigation }) => {
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null);
    const { updateProgress } = useUserStore();
    const { settings } = useSettingsStore();

    const handleSelectLevel = (level: CEFRLevel) => {
        if (settings.hapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSelectedLevel(level);
    };

    const handleContinue = () => {
        if (selectedLevel) {
            updateProgress({ level: selectedLevel });
            navigation.navigate('Goals');
        }
    };

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select your Level</Text>
                <Text style={styles.subtitle}>
                    Choose the level that best describes your current German knowledge
                </Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {levelOptions.map((level) => {
                    const isSelected = selectedLevel === level.id;
                    const levelColor = LevelColors[level.id];

                    return (
                        <TouchableOpacity
                            key={level.id}
                            onPress={() => handleSelectLevel(level.id)}
                            style={[
                                styles.levelOption,
                                isSelected && { borderColor: levelColor, backgroundColor: levelColor + '10' }
                            ]}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
                                <Text style={styles.levelBadgeText}>{level.id}</Text>
                            </View>

                            <View style={styles.levelInfo}>
                                <Text style={[
                                    styles.levelTitle,
                                    isSelected && { color: levelColor }
                                ]}>
                                    {level.title}
                                </Text>
                                <Text style={styles.levelDescription}>{level.description}</Text>

                                <View style={styles.topicsRow}>
                                    {level.topics.map((topic, index) => (
                                        <Text key={index} style={styles.topicTag}>• {topic}</Text>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.radioContainer}>
                                <View style={[
                                    styles.radioOuter,
                                    isSelected && { borderColor: levelColor }
                                ]}>
                                    {isSelected && (
                                        <View style={[styles.radioInner, { backgroundColor: levelColor }]} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    disabled={!selectedLevel}
                    size="large"
                    fullWidth
                />
            </View>
        </SafeArea>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LightTheme.background.primary,
    },
    header: {
        padding: Spacing.xl,
        paddingTop: Spacing['3xl'],
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSize.base,
        color: LightTheme.text.secondary,
        lineHeight: 24,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.xl,
        paddingTop: Spacing.md,
        gap: Spacing.md,
    },
    levelOption: {
        flexDirection: 'row',
        padding: Spacing.md,
        borderWidth: 2,
        borderColor: LightTheme.border.light,
        borderRadius: BorderRadius.xl,
        backgroundColor: LightTheme.background.primary,
        alignItems: 'center',
    },
    levelBadge: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    levelBadgeText: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    levelInfo: {
        flex: 1,
    },
    levelTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
        marginBottom: 2,
    },
    levelDescription: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        marginBottom: Spacing.xs,
    },
    topicsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    topicTag: {
        fontSize: FontSize.xs,
        color: LightTheme.text.tertiary,
    },
    radioContainer: {
        marginLeft: Spacing.sm,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: LightTheme.border.medium,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    footer: {
        padding: Spacing.xl,
        paddingTop: Spacing.md,
    },
});
