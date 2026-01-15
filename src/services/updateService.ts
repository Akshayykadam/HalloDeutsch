// Update Service - Checks GitHub releases for updates
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

const GITHUB_REPO = 'Akshayykadam/HalloDeutsch';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

export interface ReleaseInfo {
    version: string;
    tagName: string;
    name: string;
    body: string; // Markdown release notes
    publishedAt: string;
    downloadUrl: string | null;
    assetName: string | null;
}

export interface UpdateStatus {
    updateAvailable: boolean;
    currentVersion: string;
    latestVersion: string;
    releaseInfo: ReleaseInfo | null;
}

/**
 * Get current app version from app.json/Constants
 */
export const getCurrentVersion = (): string => {
    return Constants.expoConfig?.version || '1.0.0';
};

/**
 * Parse version string to comparable number
 * "1.2.3" -> 1002003
 */
const parseVersion = (version: string): number => {
    const cleaned = version.replace(/^v/, ''); // Remove 'v' prefix
    const parts = cleaned.split('.').map(p => parseInt(p, 10) || 0);
    return parts[0] * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
};

/**
 * Compare two version strings
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
export const compareVersions = (v1: string, v2: string): number => {
    const p1 = parseVersion(v1);
    const p2 = parseVersion(v2);
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
    return 0;
};

/**
 * Fetch latest release info from GitHub
 */
export const fetchLatestRelease = async (): Promise<ReleaseInfo | null> => {
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            console.error('GitHub API error:', response.status);
            return null;
        }

        const data = await response.json();

        // Find APK asset
        const apkAsset = data.assets?.find((asset: any) =>
            asset.name.endsWith('.apk')
        );

        return {
            version: data.tag_name?.replace(/^v/, '') || '0.0.0',
            tagName: data.tag_name || '',
            name: data.name || 'New Release',
            body: data.body || '', // Markdown release notes
            publishedAt: data.published_at || '',
            downloadUrl: apkAsset?.browser_download_url || null,
            assetName: apkAsset?.name || null,
        };
    } catch (error) {
        console.error('Failed to fetch release info:', error);
        return null;
    }
};

/**
 * Check if an update is available
 */
export const checkForUpdate = async (): Promise<UpdateStatus> => {
    const currentVersion = getCurrentVersion();
    const releaseInfo = await fetchLatestRelease();

    if (!releaseInfo) {
        return {
            updateAvailable: false,
            currentVersion,
            latestVersion: currentVersion,
            releaseInfo: null,
        };
    }

    const updateAvailable = compareVersions(releaseInfo.version, currentVersion) > 0;

    return {
        updateAvailable,
        currentVersion,
        latestVersion: releaseInfo.version,
        releaseInfo,
    };
};

/**
 * Download APK to device cache
 */
export const downloadUpdate = async (
    downloadUrl: string,
    onProgress?: (progress: number) => void
): Promise<string | null> => {
    if (Platform.OS !== 'android') {
        Alert.alert('Not Supported', 'In-app updates are only available on Android.');
        return null;
    }

    try {
        const fileName = 'HalloDeutsch-update.apk';
        const cacheDir = FileSystem.cacheDirectory;
        if (!cacheDir) {
            Alert.alert('Error', 'Could not access cache directory.');
            return null;
        }
        const fileUri = cacheDir + fileName;

        // Delete existing file if any
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
            await FileSystem.deleteAsync(fileUri);
        }

        // Download with progress
        const downloadResumable = FileSystem.createDownloadResumable(
            downloadUrl,
            fileUri,
            {},
            (downloadProgress) => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                onProgress?.(progress);
            }
        );

        const result = await downloadResumable.downloadAsync();

        if (result?.uri) {
            console.log('APK downloaded to:', result.uri);
            return result.uri;
        }

        return null;
    } catch (error) {
        console.error('Download failed:', error);
        return null;
    }
};

/**
 * Install downloaded APK
 */
export const installUpdate = async (fileUri: string): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        Alert.alert('Not Supported', 'In-app updates are only available on Android.');
        return false;
    }

    try {
        // Get content URI for the file
        const contentUri = await FileSystem.getContentUriAsync(fileUri);

        // Launch install intent
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: contentUri,
            flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            type: 'application/vnd.android.package-archive',
        });

        return true;
    } catch (error) {
        console.error('Install failed:', error);
        Alert.alert(
            'Installation Failed',
            'Could not start the installer. Please try downloading the update from GitHub directly.'
        );
        return false;
    }
};

/**
 * Full update flow: download and install
 */
export const downloadAndInstall = async (
    downloadUrl: string,
    onProgress?: (progress: number) => void
): Promise<boolean> => {
    const fileUri = await downloadUpdate(downloadUrl, onProgress);

    if (!fileUri) {
        Alert.alert('Download Failed', 'Could not download the update. Please try again.');
        return false;
    }

    return await installUpdate(fileUri);
};
