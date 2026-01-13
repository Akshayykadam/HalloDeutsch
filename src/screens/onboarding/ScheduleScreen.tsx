// Schedule Screen - Daily time commitment selection
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, Shadows } from '../../theme';
import { OnboardingStackParamList, DailyGoal } from '../../types';
import { useUserStore, useSettingsStore } from '../../store';

type ScheduleScreenProps = {
    navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Schedule'>;
};

interface TimeOption {
    value: DailyGoal;
    label: string;
    description: string;
}

const timeOptions: TimeOption[] = [
    {
        value: 5,
        label: '5 min/day',
        description: 'Casual learner',
    },
    {
        value: 10,
        label: '10 min/day',
        description: 'Regular practice',
    },
    {
        value: 15,
        label: '15 min/day',
        description: 'Serious learner',
    },
    {
        value: 30,
        label: '30 min/day',
        description: 'Intensive study',
    },
];

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
    const [selectedTime, setSelectedTime] = useState<DailyGoal>(15);
    const { updateProgress, completeOnboarding, progress } = useUserStore();
    const { settings } = useSettingsStore();

    const handleSelectTime = (time: DailyGoal) => {
        if (settings.hapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSelectedTime(time);
    };

    const handleComplete = () => {
        completeOnboarding(progress.level, progress.learningGoal, selectedTime);
        // Navigation to main app will be handled by the navigator
    };

    return (
        <SafeArea style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Set your daily goal</Text>
                <Text style={styles.subtitle}>
                    Consistency is key to learning. How much time can you commit each day?
                </Text>
            </View>

            <View style={styles.optionsContainer}>
                {timeOptions.map((option) => {
                    const isSelected = selectedTime === option.value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => handleSelectTime(option.value)}
                            activeOpacity={0.7}
                        >
                            {isSelected ? (
                                <LinearGradient
                                    colors={[Colors.primary[500], Colors.primary[600]]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.timeOption, styles.timeOptionSelected]}
                                >
                                    <Text style={[styles.timeLabel, styles.timeLabelSelected]}>
                                        {option.label}
                                    </Text>
                                    <Text style={[styles.timeDescription, styles.timeDescriptionSelected]}>
                                        {option.description}
                                    </Text>
                                </LinearGradient>
                            ) : (
                                <View style={styles.timeOption}>
                                    <Text style={styles.timeLabel}>{option.label}</Text>
                                    <Text style={styles.timeDescription}>{option.description}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Encouragement message */}
            <View style={styles.encouragement}>
                <Ionicons
                    name="fitness"
                    size={48}
                    color={Colors.primary[500]}
                    style={{ marginBottom: Spacing.md }}
                />
                <Text style={styles.encouragementText}>
                    {selectedTime === 5 && 'A few minutes a day can make a big difference!'}
                    {selectedTime === 10 && 'Great choice! Steady progress every day.'}
                    {selectedTime === 15 && 'Perfect! You\'ll see results quickly.'}
                    {selectedTime === 30 && 'Ambitious! You\'ll be speaking German in no time.'}
                </Text>
            </View>

            <View style={styles.footer}>
                <Button
                    title="Start Learning"
                    onPress={handleComplete}
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
        padding: Spacing.xl,
        paddingTop: Spacing.md,
        gap: Spacing.md,
    },
    timeOption: {
        padding: Spacing.lg,
        borderWidth: 2,
        borderColor: LightTheme.border.light,
        borderRadius: BorderRadius.lg,
        backgroundColor: LightTheme.background.primary,
        alignItems: 'center',
    },
    timeOptionSelected: {
        borderWidth: 0,
        ...Shadows.md,
    },
    timeLabel: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
        marginBottom: Spacing.xs,
    },
    timeLabelSelected: {
        color: Colors.white,
    },
    timeDescription: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
    },
    timeDescriptionSelected: {
        color: Colors.white,
        opacity: 0.9,
    },
    encouragement: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    encouragementText: {
        fontSize: FontSize.base,
        color: LightTheme.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: Spacing.xl,
        paddingTop: Spacing.md,
    },
});
