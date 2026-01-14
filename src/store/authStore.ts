// Auth Store - Zustand store for authentication state
import { create } from 'zustand';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
    subscribeToAuthState,
    signInWithEmail as signInEmail,
    signUpWithEmail as signUpEmail,
    signInWithGoogle as signInGoogle,
    signOut as authSignOut,
    sendPasswordResetEmail,
} from '../services/authService';

export interface AuthState {
    // State
    user: FirebaseAuthTypes.User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;

    // Actions
    initialize: () => () => void;
    signInWithEmail: (email: string, password: string) => Promise<boolean>;
    signUpWithEmail: (email: string, password: string) => Promise<boolean>;
    signInWithGoogle: () => Promise<boolean>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<boolean>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInitialized: false,

    // Initialize auth state listener
    initialize: () => {
        set({ isLoading: true });

        const unsubscribe = subscribeToAuthState((user) => {
            set({
                user,
                isAuthenticated: user !== null,
                isLoading: false,
                isInitialized: true,
            });
        });

        return unsubscribe;
    },

    // Email/Password Sign In
    signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const { user, error } = await signInEmail(email, password);

        if (error) {
            set({ isLoading: false, error });
            return false;
        }

        set({ user, isAuthenticated: true, isLoading: false });
        return true;
    },

    // Email/Password Sign Up
    signUpWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const { user, error } = await signUpEmail(email, password);

        if (error) {
            set({ isLoading: false, error });
            return false;
        }

        set({ user, isAuthenticated: true, isLoading: false });
        return true;
    },

    // Google Sign In
    signInWithGoogle: async () => {
        set({ isLoading: true, error: null });

        const { user, error } = await signInGoogle();

        if (error) {
            set({ isLoading: false, error });
            return false;
        }

        set({ user, isAuthenticated: true, isLoading: false });
        return true;
    },

    // Sign Out
    signOut: async () => {
        set({ isLoading: true });

        const { error } = await authSignOut();

        if (error) {
            set({ isLoading: false, error });
            return;
        }

        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    // Password Reset
    resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        const { error } = await sendPasswordResetEmail(email);

        if (error) {
            set({ isLoading: false, error });
            return false;
        }

        set({ isLoading: false });
        return true;
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },
}));
