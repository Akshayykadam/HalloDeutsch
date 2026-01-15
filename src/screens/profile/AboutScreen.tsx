// About & Updates Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea, Card } from '../../components/ui';
import { MarkdownRenderer } from '../../components/common/MarkdownRenderer';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import {
    checkForUpdate,
    downloadAndInstall,
    getCurrentVersion,
    UpdateStatus,
} from '../../services/updateService';

export const AboutScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [checking, setChecking] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);

    const currentVersion = getCurrentVersion();

    const handleCheckUpdate = async () => {
        setChecking(true);
        try {
            const status = await checkForUpdate();
            setUpdateStatus(status);

            if (!status.updateAvailable) {
                Alert.alert('Up to Date', 'You have the latest version installed.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not check for updates. Please try again later.');
        } finally {
            setChecking(false);
        }
    };

    const handleDownloadUpdate = async () => {
        if (!updateStatus?.releaseInfo?.downloadUrl) {
            Alert.alert('Error', 'No download URL available.');
            return;
        }

        setDownloading(true);
        setDownloadProgress(0);

        try {
            const success = await downloadAndInstall(
                updateStatus.releaseInfo.downloadUrl,
                (progress) => setDownloadProgress(progress)
            );

            if (!success) {
                // Offer fallback to browser download
                Alert.alert(
                    'Installation Issue',
                    'Would you like to download the update from GitHub instead?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Open GitHub',
                            onPress: () => Linking.openURL(
                                `https://github.com/Akshayykadam/HalloDeutsch/releases/tag/${updateStatus.releaseInfo?.tagName}`
                            ),
                        },
                    ]
                );
            }
        } finally {
            setDownloading(false);
            setDownloadProgress(0);
        }
    };

    const openGitHub = () => {
        Linking.openURL('https://github.com/Akshayykadam/HalloDeutsch');
    };

    const styles = getStyles(theme);

    return (
        <SafeArea style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About & Updates</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* App Info Card */}
                <Card style={styles.appCard}>
                    <View style={styles.appIconContainer}>
                        <Ionicons name="language" size={48} color={Colors.primary[500]} />
                    </View>
                    <Text style={styles.appName}>HalloDeutsch</Text>
                    <Text style={styles.appVersion}>Version {currentVersion}</Text>
                    <Text style={styles.appTagline}>Learn German the Smart Way</Text>
                </Card>

                {/* Update Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Updates</Text>

                    <Card style={styles.updateCard}>
                        {/* Check for Updates Button */}
                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleCheckUpdate}
                            disabled={checking || downloading}
                        >
                            {checking ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <>
                                    <Ionicons name="refresh" size={20} color={Colors.white} />
                                    <Text style={styles.updateButtonText}>Check for Updates</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Update Available */}
                        {updateStatus?.updateAvailable && updateStatus.releaseInfo && (
                            <View style={styles.updateAvailable}>
                                <View style={styles.updateHeader}>
                                    <Ionicons name="arrow-up-circle" size={24} color={Colors.success[500]} />
                                    <Text style={styles.updateTitle}>
                                        Update Available: v{updateStatus.latestVersion}
                                    </Text>
                                </View>

                                {/* Release Notes */}
                                {updateStatus.releaseInfo.body && (
                                    <View style={styles.releaseNotes}>
                                        <Text style={styles.releaseNotesTitle}>What's New:</Text>
                                        <MarkdownRenderer
                                            content={updateStatus.releaseInfo.body}
                                            theme={theme}
                                        />
                                    </View>
                                )}

                                {/* Download Button */}
                                {updateStatus.releaseInfo.downloadUrl && (
                                    <TouchableOpacity
                                        style={[styles.downloadButton, downloading && styles.downloadingButton]}
                                        onPress={handleDownloadUpdate}
                                        disabled={downloading}
                                    >
                                        {downloading ? (
                                            <View style={styles.progressContainer}>
                                                <Text style={styles.downloadButtonText}>
                                                    Downloading... {Math.round(downloadProgress * 100)}%
                                                </Text>
                                                <View style={styles.progressBar}>
                                                    <View
                                                        style={[
                                                            styles.progressFill,
                                                            { width: `${downloadProgress * 100}%` },
                                                        ]}
                                                    />
                                                </View>
                                            </View>
                                        ) : (
                                            <>
                                                <Ionicons name="download" size={20} color={Colors.white} />
                                                <Text style={styles.downloadButtonText}>
                                                    Download & Install
                                                </Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </Card>
                </View>

                {/* Links Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Links</Text>

                    <TouchableOpacity style={styles.linkRow} onPress={openGitHub}>
                        <Ionicons name="logo-github" size={24} color={theme.text.primary} />
                        <Text style={styles.linkText}>View on GitHub</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* Credits */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Credits</Text>
                    <Card style={styles.creditsCard}>
                        <Text style={styles.creditsText}>
                            Developed by Akshay Kadam
                        </Text>
                        <Text style={styles.creditsSubtext}>
                            Built with React Native & Expo
                        </Text>
                    </Card>
                </View>
            </ScrollView>
        </SafeArea>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.primary,
    },
    backButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },
    appCard: {
        alignItems: 'center',
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    appIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: Colors.primary[500] + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    appName: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    appVersion: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: Spacing.xs,
    },
    appTagline: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
        marginTop: Spacing.xs,
        fontStyle: 'italic',
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.sm,
    },
    updateCard: {
        padding: Spacing.md,
    },
    updateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary[500],
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
    },
    updateButtonText: {
        color: Colors.white,
        fontWeight: FontWeight.semibold,
        fontSize: FontSize.sm,
    },
    updateAvailable: {
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.border.primary,
    },
    updateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    updateTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.success[500],
    },
    releaseNotes: {
        backgroundColor: theme.background.secondary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.sm,
    },
    releaseNotesTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.xs,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.success[500],
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    downloadingButton: {
        backgroundColor: Colors.success[600],
    },
    downloadButtonText: {
        color: Colors.white,
        fontWeight: FontWeight.semibold,
        fontSize: FontSize.sm,
    },
    progressContainer: {
        alignItems: 'center',
        width: '100%',
    },
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: Colors.success[700],
        borderRadius: 2,
        marginTop: Spacing.xs,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.white,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background.secondary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.md,
    },
    linkText: {
        flex: 1,
        fontSize: FontSize.md,
        color: theme.text.primary,
    },
    creditsCard: {
        padding: Spacing.md,
        alignItems: 'center',
    },
    creditsText: {
        fontSize: FontSize.md,
        color: theme.text.primary,
        fontWeight: FontWeight.medium,
    },
    creditsSubtext: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
        marginTop: Spacing.xs,
    },
});

export default AboutScreen;
