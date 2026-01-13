// Goals Screen - Learning goal selection
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Button, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme } from '../../theme';
import { OnboardingStackParamList, LearningGoal } from '../../types';
import { useUserStore, useSettingsStore } from '../../store';

type GoalsScreenProps = {
    navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Goals'>;
};

interface GoalOption {
    id: LearningGoal;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const goalOptions: GoalOption[] = [
    {
        id: 'travel',
        title: 'Travel',
        description: 'Navigate German-speaking countries with confidence',
        icon: 'airplane',
    },
    {
        id: 'business',
        title: 'Business',
        description: 'Professional communication in the workplace',
        icon: 'briefcase',
    },
    {
        id: 'academic',
        title: 'Academic',
        description: 'Study at German universities or research',
        icon: 'school',
    },
    {
        id: 'general',
        title: 'General Fluency',
        description: 'All-around German language proficiency',
        icon: 'star',
    },
];

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
    const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null);
    const { updateProgress } = useUserStore();
    const { settings } = useSettingsStore();

    const handleSelectGoal = (goal: LearningGoal) => {
        if (settings.hapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSelectedGoal(goal);
    };

    const handleContinue = () => {
        if (selectedGoal) {
            updateProgress({ learningGoal: selectedGoal });
            navigation.navigate('Schedule');
        }
    };

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>What's your goal?</Text>
                <Text style={styles.subtitle}>
                    This helps us personalize your learning experience
                </Text>
            </View>

            <View style={styles.optionsContainer}>
                {goalOptions.map((goal) => (
                    <TouchableOpacity
                        key={goal.id}
                        onPress={() => handleSelectGoal(goal.id)}
                        style={[
                            styles.goalOption,
                            selectedGoal === goal.id && styles.goalOptionSelected,
                        ]}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={goal.icon}
                                size={32}
                                color={selectedGoal === goal.id ? Colors.primary[500] : Colors.neutral[500]}
                            />
                        </View>
                        <View style={styles.goalTextContainer}>
                            <Text style={[
                                styles.goalTitle,
                                selectedGoal === goal.id && styles.goalTitleSelected,
                            ]}>
                                {goal.title}
                            </Text>
                            <Text style={styles.goalDescription}>{goal.description}</Text>
                        </View>
                        <View style={[
                            styles.radioOuter,
                            selectedGoal === goal.id && styles.radioOuterSelected,
                        ]}>
                            {selectedGoal === goal.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    disabled={!selectedGoal}
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
    optionsContainer: {
        flex: 1,
        padding: Spacing.xl,
        paddingTop: Spacing.md,
        gap: Spacing.md,
    },
    goalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        borderWidth: 2,
        borderColor: LightTheme.border.light,
        borderRadius: BorderRadius.lg,
        backgroundColor: LightTheme.background.primary,
    },
    goalOptionSelected: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[50],
    },
    iconContainer: {
        marginRight: Spacing.md,
        width: 40,
        alignItems: 'center',
    },
    goalTextContainer: {
        flex: 1,
    },
    goalTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: LightTheme.text.primary,
        marginBottom: 2,
    },
    goalTitleSelected: {
        color: Colors.primary[700],
    },
    goalDescription: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        lineHeight: 20,
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
    radioOuterSelected: {
        borderColor: Colors.primary[500],
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary[500],
    },
    footer: {
        padding: Spacing.xl,
        paddingTop: Spacing.md,
    },
});
