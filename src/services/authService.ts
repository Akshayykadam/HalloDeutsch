// Firebase Authentication Service
// Using Firebase modular API
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail as firebaseSendPasswordResetEmail, onAuthStateChanged, GoogleAuthProvider, signInWithCredential, FirebaseAuthTypes } from '@react-native-firebase/auth';

export type AuthUser = FirebaseAuthTypes.User | null;

// Get Auth instance
const auth = getAuth();

// ============================================
// AUTH STATE LISTENER
// ============================================

export const subscribeToAuthState = (
    callback: (user: AuthUser) => void
): (() => void) => {
    return onAuthStateChanged(auth, callback);
};

// ============================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================

export const signUpWithEmail = async (
    email: string,
    password: string
): Promise<{ user: AuthUser; error: string | null }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error: any) {
        let errorMessage = 'An error occurred during sign up';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password should be at least 6 characters';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled';
                break;
        }

        return { user: null, error: errorMessage };
    }
};

export const signInWithEmail = async (
    email: string,
    password: string
): Promise<{ user: AuthUser; error: string | null }> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error: any) {
        let errorMessage = 'An error occurred during sign in';

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password';
                break;
        }

        return { user: null, error: errorMessage };
    }
};

// ============================================
// GOOGLE SIGN-IN
// ============================================

export const signInWithGoogle = async (): Promise<{ user: AuthUser; error: string | null }> => {
    try {
        // Note: For Google Sign-In to work, you need to configure it in Firebase Console
        // and add the google-services.json file
        const { GoogleSignin } = await import('@react-native-google-signin/google-signin');

        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Get the users ID token
        const signInResult = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(signInResult.data?.idToken || null);

        // Sign-in the user with the credential
        const userCredential = await signInWithCredential(auth, googleCredential);

        return { user: userCredential.user, error: null };
    } catch (error: any) {
        console.error('Google Sign-In Error:', error);

        let errorMessage = 'Google sign-in failed';

        if (error.code === 'SIGN_IN_CANCELLED') {
            errorMessage = 'Sign-in was cancelled';
        } else if (error.code === 'IN_PROGRESS') {
            errorMessage = 'Sign-in is already in progress';
        } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
            errorMessage = 'Play services not available';
        }

        return { user: null, error: errorMessage };
    }
};

// ============================================
// SIGN OUT
// ============================================

export const signOut = async (): Promise<{ error: string | null }> => {
    try {
        await firebaseSignOut(auth);
        return { error: null };
    } catch (error: any) {
        console.error('Sign Out Error:', error);
        return { error: 'Failed to sign out' };
    }
};

// ============================================
// PASSWORD RESET
// ============================================

export const sendPasswordResetEmail = async (
    email: string
): Promise<{ error: string | null }> => {
    try {
        await firebaseSendPasswordResetEmail(auth, email);
        return { error: null };
    } catch (error: any) {
        let errorMessage = 'Failed to send password reset email';

        if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email';
        }

        return { error: errorMessage };
    }
};

// ============================================
// CURRENT USER
// ============================================

export const getCurrentUser = (): AuthUser => {
    return auth.currentUser;
};

export const isAuthenticated = (): boolean => {
    return auth.currentUser !== null;
};
