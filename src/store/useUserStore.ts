// User state store - handles user profile and progress
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CEFRLevel, LearningGoal, DailyGoal, UserProgress, UserProfile } from '../types';
import { getAllLessons } from '../data/content/curriculum-service';
import { syncProgressToCloud, loadProgressFromCloud, initializeCloudUser } from '../services/syncService';
import auth from '@react-native-firebase/auth';

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
    checkStreak: () => void;
    // Cloud sync
    syncToCloud: () => Promise<void>;
    loadFromCloud: () => Promise<void>;
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
    // Gamification
    // Gamification
    lastStreakUpdate: new Date().toISOString(),

    dailyStats: {},
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            profile: null,
            isOnboarded: false,
            progress: {
                ...initialProgress,
                lastStreakUpdate: new Date().toISOString(),
            },

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
                    const today = new Date().toISOString().split('T')[0];
                    const lastUpdate = state.progress.lastStreakUpdate.split('T')[0];

                    if (today === lastUpdate) {
                        return state; // Already updated today
                    }

                    const newStreak = state.progress.streak + 1;
                    return {
                        progress: {
                            ...state.progress,
                            streak: newStreak,
                            longestStreak: Math.max(newStreak, state.progress.longestStreak),
                            lastStreakUpdate: new Date().toISOString(),
                        },
                    };
                }),

            checkStreak: () =>
                set((state) => {
                    const today = new Date();
                    const lastUpdateDate = new Date(state.progress.lastStreakUpdate);

                    // Normalize to midnight for accurate day difference calculation
                    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const lastMidnight = new Date(lastUpdateDate.getFullYear(), lastUpdateDate.getMonth(), lastUpdateDate.getDate());

                    const diffTime = Math.abs(todayMidnight.getTime() - lastMidnight.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    // If more than 1 day has passed (yesterday), reset streak
                    // 0 days = same day (keep)
                    // 1 day = consecutive day (keep, waiting for increment)
                    // > 1 day = broke streak (reset)
                    if (diffDays > 1) {
                        return {
                            progress: {
                                ...state.progress,
                                streak: 0,
                                // Don't update lastStreakUpdate here, waiting for next activity
                            }
                        };
                    }
                    return state;
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
                    progress: { ...initialProgress, lastStreakUpdate: new Date().toISOString() },
                }),

            markLessonComplete: (lessonId) => {
                const state = get();
                const allLessons = getAllLessons();
                const index = allLessons.findIndex(l => l.id === lessonId);

                if (index !== -1 && index === state.progress.lessonsCompleted) {
                    // Update streak on lesson complete if not already done today
                    state.incrementStreak();

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
                    const newTotalMinutes = state.progress.minutesToday + minutes;

                    // Check if daily goal is met with this update
                    // We need to check if we accomplished the goal just now
                    // Note: We access state.progress directly as we are inside the set callback
                    // But to call incrementStreak properly we might need to handle it outside or
                    // inline the logic. Since we are inside `set`, we can just return the new state
                    // including the streak update if needed.
                    // However, simplified approach: existing incrementStreak handles "once per day" logic.
                    // So we can try to call it if goal is met.
                    // BUT, calling action from another action in zustand while setting state is tricky if we want atomic updates.
                    // Let's inline the streak logic or just update it here if met.

                    let newStreak = state.progress.streak;
                    let lastStreakUpdate = state.progress.lastStreakUpdate;
                    let longestStreak = state.progress.longestStreak;

                    // Check if we hit the goal now
                    if (newTotalMinutes >= state.progress.dailyGoal) {
                        const lastUpdateDate = lastStreakUpdate.split('T')[0];
                        if (today !== lastUpdateDate) {
                            newStreak += 1;
                            longestStreak = Math.max(newStreak, longestStreak);
                            lastStreakUpdate = new Date().toISOString();
                        }
                    }

                    return {
                        progress: {
                            ...state.progress,
                            minutesToday: newTotalMinutes,
                            streak: newStreak,
                            longestStreak,
                            lastStreakUpdate,
                            dailyStats: {
                                ...currentStats,
                                [today]: todayMinutes,
                            },
                        },
                    };
                }),

            // Cloud sync functions
            syncToCloud: async () => {
                const user = auth().currentUser;
                if (!user) {
                    console.log('[Sync] No user logged in, skipping sync');
                    return;
                }

                const state = get();
                const { success, error } = await syncProgressToCloud(state.progress);
                if (error) {
                    console.error('[Sync] Sync failed:', error);
                } else {
                    console.log('[Sync] Progress synced successfully');
                }
            },

            loadFromCloud: async () => {
                const user = auth().currentUser;
                if (!user) {
                    console.log('[Sync] No user logged in, skipping load');
                    return;
                }

                const { progress, error } = await loadProgressFromCloud();

                if (error) {
                    console.error('[Sync] Load failed:', error);
                    return;
                }

                if (progress) {
                    // Merge cloud progress with local - cloud takes precedence for key stats
                    set((state) => ({
                        progress: {
                            ...state.progress,
                            ...progress,
                            // Ensure we keep the higher values
                            totalXP: Math.max(state.progress.totalXP, progress.totalXP || 0),
                            lessonsCompleted: Math.max(state.progress.lessonsCompleted, progress.lessonsCompleted || 0),
                            wordsLearned: Math.max(state.progress.wordsLearned, progress.wordsLearned || 0),
                            longestStreak: Math.max(state.progress.longestStreak, progress.longestStreak || 0),
                        },
                    }));
                    console.log('[Sync] Progress loaded from cloud');
                } else {
                    // No cloud data - initialize cloud with local data
                    const state = get();
                    await initializeCloudUser(state.progress, state.profile || undefined);
                    console.log('[Sync] Initialized cloud with local data');
                }
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                profile: state.profile,
                isOnboarded: state.isOnboarded,
                progress: state.progress
            }), // Ensure progress is persisted
        }
    )
);
