// Firestore Sync Service - Sync user progress to cloud
// Using Firebase modular API
import { getFirestore, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { UserProgress, UserProfile } from '../types';

// Collection names
const USERS_COLLECTION = 'users';

// Get Firestore and Auth instances
const db = getFirestore();
const auth = getAuth();

// ============================================
// USER PROFILE SYNC
// ============================================

export interface CloudUserData {
    profile: Partial<UserProfile>;
    progress: Partial<UserProgress>;
    lastSyncedAt: Date;
    createdAt: Date;
}

/**
 * Save user progress to Firestore
 */
export const syncProgressToCloud = async (
    progress: UserProgress
): Promise<{ success: boolean; error: string | null }> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const userDocRef = doc(db, USERS_COLLECTION, user.uid);

        await setDoc(userDocRef, {
            progress: {
                level: progress.level,
                xp: progress.xp,
                totalXP: progress.totalXP,
                streak: progress.streak,
                longestStreak: progress.longestStreak,
                dailyGoal: progress.dailyGoal,
                learningGoal: progress.learningGoal,
                lessonsCompleted: progress.lessonsCompleted,
                wordsLearned: progress.wordsLearned,
                grammarTopicsCompleted: progress.grammarTopicsCompleted,
                minutesToday: progress.minutesToday,
                lastActiveDate: progress.lastActiveDate,
                lastStreakUpdate: progress.lastStreakUpdate,
                dailyStats: progress.dailyStats || {},
            },
            email: user.email,
            lastSyncedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, { merge: true });

        console.log('[Sync] Progress synced to cloud');
        return { success: true, error: null };
    } catch (error: any) {
        console.error('[Sync] Error syncing progress:', error);
        return { success: false, error: error.message || 'Failed to sync progress' };
    }
};

/**
 * Load user progress from Firestore
 */
export const loadProgressFromCloud = async (): Promise<{
    progress: Partial<UserProgress> | null;
    error: string | null;
}> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { progress: null, error: 'User not authenticated' };
        }

        const userDocRef = doc(db, USERS_COLLECTION, user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            console.log('[Sync] No cloud data found for user');
            return { progress: null, error: null };
        }

        const data = docSnap.data();
        console.log('[Sync] Progress loaded from cloud');

        return {
            progress: data?.progress || null,
            error: null,
        };
    } catch (error: any) {
        console.error('[Sync] Error loading progress:', error);
        return { progress: null, error: error.message || 'Failed to load progress' };
    }
};

/**
 * Save user profile to Firestore
 */
export const syncProfileToCloud = async (
    profile: Partial<UserProfile>
): Promise<{ success: boolean; error: string | null }> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const userDocRef = doc(db, USERS_COLLECTION, user.uid);

        await setDoc(userDocRef, {
            profile: {
                displayName: profile.displayName,
                age: profile.age,
                avatarUrl: profile.avatarUrl,
            },
            email: user.email,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        console.log('[Sync] Profile synced to cloud');
        return { success: true, error: null };
    } catch (error: any) {
        console.error('[Sync] Error syncing profile:', error);
        return { success: false, error: error.message || 'Failed to sync profile' };
    }
};

/**
 * Initialize cloud data for new user
 */
export const initializeCloudUser = async (
    progress: UserProgress,
    profile?: Partial<UserProfile>
): Promise<{ success: boolean; error: string | null }> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const userDocRef = doc(db, USERS_COLLECTION, user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            // New user - create document with initial data
            await setDoc(userDocRef, {
                email: user.email,
                profile: {
                    displayName: profile?.displayName || user.displayName || 'German Learner',
                },
                progress: {
                    level: progress.level,
                    xp: progress.xp,
                    totalXP: progress.totalXP,
                    streak: progress.streak,
                    longestStreak: progress.longestStreak,
                    dailyGoal: progress.dailyGoal,
                    learningGoal: progress.learningGoal,
                    lessonsCompleted: progress.lessonsCompleted,
                    wordsLearned: progress.wordsLearned,
                    grammarTopicsCompleted: progress.grammarTopicsCompleted,
                    minutesToday: progress.minutesToday,
                    lastActiveDate: progress.lastActiveDate,
                    lastStreakUpdate: progress.lastStreakUpdate,
                    dailyStats: progress.dailyStats || {},
                },
                createdAt: serverTimestamp(),
                lastSyncedAt: serverTimestamp(),
            });
            console.log('[Sync] New user initialized in cloud');
        } else {
            console.log('[Sync] User already exists in cloud');
        }

        return { success: true, error: null };
    } catch (error: any) {
        console.error('[Sync] Error initializing user:', error);
        return { success: false, error: error.message || 'Failed to initialize user' };
    }
};

/**
 * Delete user cloud data
 */
export const deleteCloudData = async (): Promise<{ success: boolean; error: string | null }> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        await deleteDoc(doc(db, USERS_COLLECTION, user.uid));
        console.log('[Sync] User cloud data deleted');

        return { success: true, error: null };
    } catch (error: any) {
        console.error('[Sync] Error deleting cloud data:', error);
        return { success: false, error: error.message || 'Failed to delete cloud data' };
    }
};

/**
 * Check if user has cloud data
 */
export const hasCloudData = async (): Promise<boolean> => {
    try {
        const user = auth.currentUser;
        if (!user) return false;

        const docSnap = await getDoc(doc(db, USERS_COLLECTION, user.uid));
        return docSnap.exists();
    } catch (error) {
        console.error('[Sync] Error checking cloud data:', error);
        return false;
    }
};
