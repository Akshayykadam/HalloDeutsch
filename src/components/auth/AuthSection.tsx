// Auth Section Component - Optional login for Profile Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';

// Configure Google Sign-In with webClientId from Firebase
GoogleSignin.configure({
    webClientId: '983144778767-h65803csch9h1bad0gm0ik8srbab1q2d.apps.googleusercontent.com',
});

interface AuthSectionProps {
    theme: any;
    isDark: boolean;
}

type ToastType = 'success' | 'error' | 'warning' | null;

export const AuthSection: React.FC<AuthSectionProps> = ({ theme, isDark }) => {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        initialize,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
        clearError,
    } = useAuthStore();

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Custom toast state
    const [toast, setToast] = useState<{ type: ToastType; title: string; message: string }>({ type: null, title: '', message: '' });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Initialize auth state listener
    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, []);

    // Auto-hide toast
    useEffect(() => {
        if (toast.type) {
            const timer = setTimeout(() => setToast({ type: null, title: '', message: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (type: ToastType, title: string, message: string) => {
        setToast({ type, title, message });
    };

    const handleEmailAuth = async () => {
        if (!email || !password) {
            showToast('warning', 'Missing Fields', 'Please fill in all fields');
            return;
        }

        let success = false;
        if (authMode === 'login') {
            success = await signInWithEmail(email, password);
        } else if (authMode === 'signup') {
            success = await signUpWithEmail(email, password);
        }

        if (success) {
            setShowAuthModal(false);
            setEmail('');
            setPassword('');
            // Sync progress with cloud
            await useUserStore.getState().loadFromCloud();
            showToast('success', 'Success', authMode === 'login' ? 'Signed in successfully!' : 'Account created successfully!');
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            showToast('warning', 'Missing Email', 'Please enter your email');
            return;
        }

        const success = await resetPassword(email);
        if (success) {
            showToast('success', 'Email Sent', 'Password reset email sent!');
            setAuthMode('login');
        }
    };

    const handleGoogleSignIn = async () => {
        const success = await signInWithGoogle();
        if (success) {
            setShowAuthModal(false);
            // Sync progress with cloud
            await useUserStore.getState().loadFromCloud();
            showToast('success', 'Success', 'Signed in with Google!');
        }
    };

    const handleSignOut = () => {
        setShowConfirmModal(true);
    };

    const confirmSignOut = async () => {
        setShowConfirmModal(false);
        await signOut();
        showToast('success', 'Signed Out', 'You have been signed out');
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await useUserStore.getState().syncToCloud();
            showToast('success', 'Synced!', 'Your progress has been saved to cloud');
        } catch (err) {
            showToast('error', 'Sync Failed', 'Could not sync your progress');
        }
        setIsSyncing(false);
    };

    const styles = getAuthStyles(theme, isDark);

    // Toast Component
    const renderToast = () => {
        if (!toast.type) return null;

        const toastColors = {
            success: Colors.success[500],
            error: Colors.error[500],
            warning: Colors.warning[500],
        };
        const toastIcons = {
            success: 'checkmark-circle',
            error: 'close-circle',
            warning: 'warning',
        };

        return (
            <View style={[styles.toast, { backgroundColor: theme.background.primary, borderLeftColor: toastColors[toast.type] }]}>
                <Ionicons name={toastIcons[toast.type] as any} size={24} color={toastColors[toast.type]} />
                <View style={styles.toastContent}>
                    <Text style={[styles.toastTitle, { color: theme.text.primary }]}>{toast.title}</Text>
                    <Text style={[styles.toastMessage, { color: theme.text.secondary }]}>{toast.message}</Text>
                </View>
                <TouchableOpacity onPress={() => setToast({ type: null, title: '', message: '' })}>
                    <Ionicons name="close" size={20} color={theme.text.tertiary} />
                </TouchableOpacity>
            </View>
        );
    };

    // Confirm Modal Component
    const renderConfirmModal = () => (
        <Modal visible={showConfirmModal} transparent animationType="fade">
            <View style={styles.confirmOverlay}>
                <View style={[styles.confirmModal, { backgroundColor: theme.background.primary }]}>
                    <View style={styles.confirmIconBg}>
                        <Ionicons name="log-out-outline" size={32} color={Colors.error[500]} />
                    </View>
                    <Text style={[styles.confirmTitle, { color: theme.text.primary }]}>Sign Out?</Text>
                    <Text style={[styles.confirmMessage, { color: theme.text.secondary }]}>
                        Are you sure you want to sign out?
                    </Text>
                    <View style={styles.confirmButtons}>
                        <TouchableOpacity
                            style={[styles.confirmButton, styles.confirmButtonCancel, { backgroundColor: theme.background.secondary }]}
                            onPress={() => setShowConfirmModal(false)}
                        >
                            <Text style={[styles.confirmButtonText, { color: theme.text.primary }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.confirmButton, styles.confirmButtonDanger]}
                            onPress={confirmSignOut}
                        >
                            <Text style={[styles.confirmButtonText, { color: Colors.white }]}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    // If authenticated, show user info
    if (isAuthenticated && user) {

        return (
            <View style={styles.container}>
                {renderToast()}
                {renderConfirmModal()}

                {/* Seamless Authenticated View */}
                <View style={styles.authContainer}>
                    <View style={styles.authInfoRow}>
                        <View style={styles.authTextContainer}>
                            <Text style={[styles.userEmail, { color: theme.text.primary }]}>
                                {user.email || 'No Email'}
                            </Text>
                            <View style={styles.syncStatusRow}>
                                <Ionicons name="cloud-done" size={12} color={Colors.success[500]} />
                                <Text style={[styles.syncStatusText, { color: theme.text.secondary }]}>
                                    Progress Synced
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.authActionsRow}>
                        <TouchableOpacity
                            style={[styles.actionChip, { backgroundColor: Colors.primary[500] + '15' }]}
                            onPress={handleSync}
                            disabled={isSyncing}
                        >
                            {isSyncing ? (
                                <ActivityIndicator size="small" color={Colors.primary[500]} />
                            ) : (
                                <Ionicons name="sync" size={16} color={Colors.primary[500]} />
                            )}
                            <Text style={[styles.actionChipText, { color: Colors.primary[500] }]}>
                                {isSyncing ? 'Syncing...' : 'Sync Now'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionChip, { backgroundColor: theme.background.tertiary }]}
                            onPress={handleSignOut}
                        >
                            <Ionicons name="log-out-outline" size={16} color={theme.text.secondary} />
                            <Text style={[styles.actionChipText, { color: theme.text.secondary }]}>
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        );
    }


    // If not authenticated, show login prompt
    return (
        <View style={styles.container}>
            {renderToast()}
            <TouchableOpacity
                style={[styles.saveProgressCard, { backgroundColor: theme.background.secondary }]}
                onPress={() => setShowAuthModal(true)}
            >
                <View style={styles.cardHeader}>
                    <LinearGradient
                        colors={[Colors.primary[500], Colors.primary[600]]}
                        style={styles.saveIconBg}
                    >
                        <Ionicons name="cloud-upload" size={24} color={Colors.white} />
                    </LinearGradient>
                    <View style={styles.saveTextContainer}>
                        <Text style={[styles.saveTitle, { color: theme.text.primary }]}>
                            Save Your Progress
                        </Text>
                        <Text style={[styles.saveDescription, { color: theme.text.secondary }]}>
                            Sign in to sync across devices
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
                </View>
            </TouchableOpacity>

            {/* Auth Modal */}
            <Modal
                visible={showAuthModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAuthModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.background.primary }]}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text.primary }]}>
                                {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setShowAuthModal(false);
                                clearError();
                                setEmail('');
                                setPassword('');
                            }}>
                                <Ionicons name="close" size={24} color={theme.text.secondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Error Message */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="warning" size={16} color={Colors.error[500]} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* Email Input */}
                        <View style={[styles.inputContainer, { backgroundColor: theme.background.secondary }]}>
                            <Ionicons name="mail" size={20} color={theme.text.tertiary} />
                            <TextInput
                                style={[styles.input, { color: theme.text.primary }]}
                                placeholder="Email"
                                placeholderTextColor={theme.text.tertiary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Password Input (not shown for reset) */}
                        {authMode !== 'reset' && (
                            <View style={[styles.inputContainer, { backgroundColor: theme.background.secondary }]}>
                                <Ionicons name="lock-closed" size={20} color={theme.text.tertiary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text.primary }]}
                                    placeholder="Password"
                                    placeholderTextColor={theme.text.tertiary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={theme.text.tertiary}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Forgot Password Link */}
                        {authMode === 'login' && (
                            <TouchableOpacity onPress={() => setAuthMode('reset')}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        {/* Primary Action Button */}
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={authMode === 'reset' ? handleResetPassword : handleEmailAuth}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={[Colors.primary[500], Colors.primary[600]]}
                                style={styles.primaryButtonGradient}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={Colors.white} />
                                ) : (
                                    <Text style={styles.primaryButtonText}>
                                        {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Email'}
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        {authMode !== 'reset' && (
                            <View style={styles.divider}>
                                <View style={[styles.dividerLine, { backgroundColor: theme.border.primary }]} />
                                <Text style={[styles.dividerText, { color: theme.text.tertiary }]}>or</Text>
                                <View style={[styles.dividerLine, { backgroundColor: theme.border.primary }]} />
                            </View>
                        )}

                        {/* Google Sign In */}
                        {authMode !== 'reset' && (
                            <TouchableOpacity
                                style={[styles.googleButton, { borderColor: theme.border.primary }]}
                                onPress={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                <Ionicons name="logo-google" size={20} color="#DB4437" />
                                <Text style={[styles.googleButtonText, { color: theme.text.primary }]}>
                                    Continue with Google
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Toggle Auth Mode */}
                        <View style={styles.toggleContainer}>
                            {authMode === 'reset' ? (
                                <TouchableOpacity onPress={() => setAuthMode('login')}>
                                    <Text style={styles.toggleText}>Back to Sign In</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                                    <Text style={[styles.toggleText, { color: theme.text.secondary }]}>
                                        {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                                        <Text style={styles.toggleTextHighlight}>
                                            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const getAuthStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: {
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    toast: {
        position: 'absolute',
        top: -80,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderLeftWidth: 4,
        zIndex: 1000,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    toastContent: {
        flex: 1,
        marginLeft: Spacing.sm,
    },
    toastTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    toastMessage: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
    confirmOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    confirmModal: {
        width: '100%',
        maxWidth: 320,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        alignItems: 'center',
    },
    confirmIconBg: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.error[500] + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    confirmTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.sm,
    },
    confirmMessage: {
        fontSize: FontSize.md,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    confirmButtonCancel: {},
    confirmButtonDanger: {
        backgroundColor: Colors.error[500],
    },
    confirmButtonText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    saveProgressCard: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveIconBg: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveTextContainer: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    saveTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    saveDescription: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
    authenticatedCard: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
    },
    authContainer: {
        marginTop: Spacing.sm,
        marginBottom: Spacing.sm,
        alignItems: 'center',
    },
    authInfoRow: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    authTextContainer: {
        alignItems: 'center',
    },
    userEmail: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        marginBottom: 4,
    },
    syncStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        justifyContent: 'center',
    },
    syncStatusText: {
        fontSize: FontSize.sm,
        marginLeft: 6,
    },
    authActionsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        justifyContent: 'center',
    },
    actionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
    },
    actionChipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        marginLeft: 6,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.lg,
        paddingBottom: Spacing.xl + 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.error[500] + '20',
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.md,
    },
    errorText: {
        color: Colors.error[500],
        marginLeft: Spacing.xs,
        fontSize: FontSize.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    input: {
        flex: 1,
        marginLeft: Spacing.sm,
        fontSize: FontSize.md,
    },
    forgotPasswordText: {
        color: Colors.primary[500],
        fontSize: FontSize.sm,
        textAlign: 'right',
        marginBottom: Spacing.md,
    },
    primaryButton: {
        marginTop: Spacing.sm,
    },
    primaryButtonGradient: {
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: Spacing.md,
        fontSize: FontSize.sm,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
    },
    googleButtonText: {
        marginLeft: Spacing.sm,
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
    },
    toggleContainer: {
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    toggleText: {
        fontSize: FontSize.sm,
    },
    toggleTextHighlight: {
        color: Colors.primary[500],
        fontWeight: FontWeight.semibold,
    },
});

export default AuthSection;
