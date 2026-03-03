// Achievement Popup - Animated celebration when user unlocks a milestone

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { haptics } from '../../utils/haptics';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    gradient: [string, string];
}

// Predefined achievements
export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: 'footsteps',
        color: Colors.primary[500],
        gradient: [Colors.primary[400], Colors.primary[700]],
    },
    {
        id: 'words_50',
        title: 'Word Collector',
        description: 'Learn 50 words',
        icon: 'library',
        color: Colors.secondary[500],
        gradient: [Colors.secondary[400], Colors.secondary[700]],
    },
    {
        id: 'words_100',
        title: 'Vocabulary Master',
        description: 'Learn 100 words',
        icon: 'trophy',
        color: Colors.gold[500],
        gradient: [Colors.gold[400], Colors.gold[700]],
    },
    {
        id: 'streak_3',
        title: 'Getting Consistent',
        description: 'Maintain a 3-day streak',
        icon: 'flame',
        color: Colors.secondary[500],
        gradient: ['#F97316', '#DC2626'],
    },
    {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'flame',
        color: '#DC2626',
        gradient: ['#EF4444', '#991B1B'],
    },
    {
        id: 'streak_30',
        title: 'Month of Mastery',
        description: 'Maintain a 30-day streak',
        icon: 'diamond',
        color: '#8B5CF6',
        gradient: ['#A78BFA', '#5B21B6'],
    },
    {
        id: 'xp_500',
        title: 'Rising Star',
        description: 'Earn 500 XP',
        icon: 'star',
        color: Colors.gold[500],
        gradient: [Colors.gold[400], Colors.gold[700]],
    },
    {
        id: 'xp_1000',
        title: 'XP Legend',
        description: 'Earn 1,000 XP',
        icon: 'star',
        color: '#8B5CF6',
        gradient: ['#C084FC', '#7C3AED'],
    },
    {
        id: 'lessons_5',
        title: 'Dedicated Learner',
        description: 'Complete 5 lessons',
        icon: 'school',
        color: Colors.primary[500],
        gradient: [Colors.primary[400], Colors.primary[600]],
    },
    {
        id: 'lessons_10',
        title: 'Knowledge Seeker',
        description: 'Complete 10 lessons',
        icon: 'ribbon',
        color: Colors.success[500],
        gradient: [Colors.success[400], Colors.success[700]],
    },
    {
        id: 'first_story',
        title: 'Story Time',
        description: 'Read your first AI story',
        icon: 'book',
        color: Colors.secondary[500],
        gradient: [Colors.secondary[400], Colors.secondary[600]],
    },
    {
        id: 'first_snap',
        title: 'Sharp Eye',
        description: 'Use Snap & Learn for the first time',
        icon: 'camera',
        color: Colors.primary[500],
        gradient: [Colors.primary[500], '#4338CA'],
    },
];

interface AchievementPopupProps {
    visible: boolean;
    achievement: Achievement | null;
    onClose: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
    visible,
    achievement,
    onClose,
}) => {
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const badgeRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible && achievement) {
            haptics.success();

            scaleAnim.setValue(0);
            glowAnim.setValue(0);
            badgeRotate.setValue(0);

            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 40,
                    friction: 4,
                }),
                Animated.parallel([
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(glowAnim, {
                                toValue: 1,
                                duration: 1000,
                                useNativeDriver: true,
                            }),
                            Animated.timing(glowAnim, {
                                toValue: 0,
                                duration: 1000,
                                useNativeDriver: true,
                            }),
                        ]),
                        { iterations: 2 }
                    ),
                    Animated.timing(badgeRotate, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();

            // Auto-dismiss after 4s
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [visible, achievement]);

    if (!visible || !achievement) return null;

    const spin = badgeRotate.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '-10deg', '0deg'],
    });

    const glowScale = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.15],
    });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.background.elevated,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Badge */}
                    <Animated.View
                        style={[
                            styles.badgeOuter,
                            { transform: [{ rotate: spin }, { scale: glowScale }] },
                        ]}
                    >
                        <LinearGradient
                            colors={achievement.gradient}
                            style={styles.badgeGradient}
                        >
                            <Ionicons
                                name={achievement.icon}
                                size={40}
                                color={Colors.white}
                            />
                        </LinearGradient>
                    </Animated.View>

                    <Text style={[styles.unlocked, { color: achievement.color }]}>
                        Achievement Unlocked!
                    </Text>
                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        {achievement.title}
                    </Text>
                    <Text style={[styles.description, { color: theme.text.secondary }]}>
                        {achievement.description}
                    </Text>

                    <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
                        <Text style={[styles.dismissText, { color: theme.text.tertiary }]}>
                            Tap to dismiss
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    container: {
        width: '100%',
        maxWidth: 300,
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.xl,
        alignItems: 'center',
    },
    badgeOuter: {
        marginBottom: Spacing.lg,
    },
    badgeGradient: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unlocked: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    description: {
        fontSize: FontSize.sm,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    dismissBtn: {
        padding: Spacing.sm,
    },
    dismissText: {
        fontSize: FontSize.xs,
    },
});
