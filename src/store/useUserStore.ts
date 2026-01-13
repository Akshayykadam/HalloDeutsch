// User state store - handles user profile and progress
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CEFRLevel, LearningGoal, DailyGoal, UserProgress, UserProfile } from '../types';
import { getAllLessons } from '../data/content/curriculum-service';

interface UserState {
    // Profile
    profile: UserProfile | null;
    isOnboarded: boolean;

    // Progress
    progress: UserProgress;

    // Actions
    setProfile: (profile: UserProfile) => void;
    updateProgress: (updates: Partial<UserProgress>) => void;
    completeOnboarding: (level: CEFRLevel, goal: LearningGoal, dailyGoal: DailyGoal) => void;
    addXP: (amount: number) => void;
    incrementStreak: () => void;
    resetDailyProgress: () => void;
    reset: () => void;
    markLessonComplete: (lessonId: string) => void;
    unlockNextLesson: (currentLessonId: string) => string | null;
    updateWordsLearned: (count: number) => void;
    updateGrammarTopicsCompleted: (count: number) => void;
    addMinutes: (minutes: number) => void;
}

const initialProgress: UserProgress = {
    level: 'A1',
    xp: 0,
    totalXP: 0,
    streak: 0,
    longestStreak: 0,
    dailyGoal: 15,
    learningGoal: 'general',
    lessonsCompleted: 0,
    wordsLearned: 0,
    grammarTopicsCompleted: 0,
    minutesToday: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyStats: {},
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            profile: null,
            isOnboarded: false,
            progress: initialProgress,

            setProfile: (profile) => set({ profile }),

            updateProgress: (updates) =>
                set((state) => ({
                    progress: { ...state.progress, ...updates },
                })),

            completeOnboarding: (level, goal, dailyGoal) =>
                set((state) => ({
                    isOnboarded: true,
                    progress: {
                        ...state.progress,
                        level,
                        learningGoal: goal,
                        dailyGoal,
                    },
                })),

            addXP: (amount) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        xp: state.progress.xp + amount,
                        totalXP: state.progress.totalXP + amount,
                    },
                })),

            incrementStreak: () =>
                set((state) => {
                    const newStreak = state.progress.streak + 1;
                    return {
                        progress: {
                            ...state.progress,
                            streak: newStreak,
                            longestStreak: Math.max(newStreak, state.progress.longestStreak),
                        },
                    };
                }),

            resetDailyProgress: () =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        xp: 0,
                        minutesToday: 0,
                        lastActiveDate: new Date().toISOString().split('T')[0],
                    },
                })),

            reset: () =>
                set({
                    profile: null,
                    isOnboarded: false,
                    progress: initialProgress,
                }),

            markLessonComplete: (lessonId) => {
                const state = get();
                const allLessons = getAllLessons();
                const index = allLessons.findIndex(l => l.id === lessonId);

                if (index !== -1 && index === state.progress.lessonsCompleted) {
                    set((s) => ({
                        progress: {
                            ...s.progress,
                            lessonsCompleted: s.progress.lessonsCompleted + 1,
                            xp: s.progress.xp + 10,
                            totalXP: s.progress.totalXP + 10,
                        }
                    }));
                }
            },

            unlockNextLesson: (currentLessonId) => {
                const allLessons = getAllLessons();
                const index = allLessons.findIndex(l => l.id === currentLessonId);

                if (index !== -1 && index + 1 < allLessons.length) {
                    return allLessons[index + 1].id;
                }
                return null;
            },

            updateWordsLearned: (count) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        wordsLearned: state.progress.wordsLearned + count,
                    },
                })),

            updateGrammarTopicsCompleted: (count) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        grammarTopicsCompleted: (state.progress.grammarTopicsCompleted || 0) + count,
                    },
                })),

            addMinutes: (minutes) =>
                set((state) => {
                    const today = new Date().toISOString().split('T')[0];
                    const currentStats = state.progress.dailyStats || {};
                    const todayMinutes = (currentStats[today] || 0) + minutes;

                    return {
                        progress: {
                            ...state.progress,
                            minutesToday: state.progress.minutesToday + minutes,
                            dailyStats: {
                                ...currentStats,
                                [today]: todayMinutes,
                            },
                        },
                    };
                }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
