// TTS Model Manager - Downloads and manages Piper/Sherpa-ONNX models
import * as FileSystem from 'expo-file-system/legacy';

// Model configuration
const MODEL_NAME = 'de_DE-thorsten-medium';
const MODEL_URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx';
const CONFIG_URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx.json';

// Model directory
// @ts-ignore: Standard Expo FileSystem usage
const MODEL_DIR = `${FileSystem.documentDirectory}tts-models/${MODEL_NAME}`;

export interface ModelConfig {
    modelPath: string;
    configPath: string;
    isReady: boolean;
}

let modelConfig: ModelConfig | null = null;

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(MODEL_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });
    }
}

/**
 * Check if model files exist
 */
export const isModelDownloaded = async (): Promise<boolean> => {
    try {
        const modelInfo = await FileSystem.getInfoAsync(`${MODEL_DIR}/model.onnx`);
        const configInfo = await FileSystem.getInfoAsync(`${MODEL_DIR}/config.json`);
        return modelInfo.exists && configInfo.exists;
    } catch (e) {
        console.log('Error checking model:', e);
        return false;
    }
};

/**
 * Download the German TTS model
 */
export const downloadModel = async (
    onProgress?: (progress: number) => void
): Promise<boolean> => {
    try {
        await ensureDirExists();

        // Download model file
        console.log('Downloading TTS model...');
        const modelPath = `${MODEL_DIR}/model.onnx`;

        // Expo FileSystem createDownloadResumable for progress support
        const downloadResumable = FileSystem.createDownloadResumable(
            MODEL_URL,
            modelPath,
            {},
            (downloadProgress) => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                if (onProgress) onProgress(progress * 0.9);
            }
        );

        const result = await downloadResumable.downloadAsync();

        if (!result || result.status !== 200) {
            console.log('Model download failed');
            return false;
        }

        // Download config file
        console.log('Downloading config...');
        const configPath = `${MODEL_DIR}/config.json`;

        const configResult = await FileSystem.downloadAsync(CONFIG_URL, configPath);

        if (configResult.status !== 200) {
            console.log('Config download failed');
            return false;
        }

        if (onProgress) onProgress(1.0);
        console.log('TTS model downloaded successfully');

        return true;
    } catch (error) {
        console.log('Error downloading model:', error);
        return false;
    }
};

/**
 * Get model configuration for TTS initialization
 */
export const getModelConfig = async (): Promise<ModelConfig | null> => {
    if (modelConfig?.isReady) {
        return modelConfig;
    }

    const isReady = await isModelDownloaded();
    if (!isReady) {
        return null;
    }

    // Native modules might not handle file:// prefix on Android
    const cleanPath = (uri: string) => {
        if (uri.startsWith('file://')) {
            return uri.substring(7);
        }
        return uri;
    }

    modelConfig = {
        modelPath: cleanPath(`${MODEL_DIR}/model.onnx`),
        configPath: cleanPath(`${MODEL_DIR}/config.json`),
        isReady: true,
    };

    return modelConfig;
};

/**
 * Delete downloaded model
 */
export const deleteModel = async (): Promise<void> => {
    try {
        await FileSystem.deleteAsync(MODEL_DIR, { idempotent: true });
        modelConfig = null;
    } catch {
        // Ignore errors
    }
};

/**
 * Get model size on disk
 */
export const getModelSize = async (): Promise<number> => {
    try {
        const info = await FileSystem.getInfoAsync(`${MODEL_DIR}/model.onnx`);
        if (info.exists) {
            return info.size;
        }
        return 0;
    } catch {
        return 0;
    }
};

export default {
    isModelDownloaded,
    downloadModel,
    getModelConfig,
    deleteModel,
    getModelSize,
};
