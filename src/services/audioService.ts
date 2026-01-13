// Audio Service - German TTS using expo-speech
// Uses device's native German voice for text-to-speech

import * as Speech from 'expo-speech';

// Audio state management
let isPlaying = false;
let isLoading = false;
let isInitialized = false;
let germanVoice: Speech.Voice | null = null;

/**
 * Initialize the TTS engine and find the best German voice
 * Call this once on app start
 */
export const initializeTTS = async (): Promise<boolean> => {
    if (isInitialized) return true;

    try {
        // Get all available voices
        const voices = await Speech.getAvailableVoicesAsync();

        // Find German voices
        const germanVoices = voices.filter(v =>
            v.language.startsWith('de') ||
            v.language.includes('DE') ||
            v.language.includes('German')
        );



        if (germanVoices.length > 0) {
            // Prefer voices with these keywords (usually higher quality)
            const preferredKeywords = ['premium', 'enhanced', 'network', 'wavenet', 'neural', 'hd'];

            // Sort by quality preference
            germanVoices.sort((a, b) => {
                const aName = (a.name || a.identifier || '').toLowerCase();
                const bName = (b.name || b.identifier || '').toLowerCase();

                const aScore = preferredKeywords.some(k => aName.includes(k)) ? 1 : 0;
                const bScore = preferredKeywords.some(k => bName.includes(k)) ? 1 : 0;

                return bScore - aScore;
            });

            germanVoice = germanVoices[0];

        }
    } catch (error) {
        console.error('Error getting voices:', error);
    }

    isInitialized = true;
    // console.log('TTS initialized with expo-speech');
    return true;
};

/**
 * Deinitialize TTS engine
 */
export const deinitializeTTS = async (): Promise<void> => {
    isInitialized = false;
    germanVoice = null;
};

/**
 * Stop currently playing audio
 */
export const stopAudio = async (): Promise<void> => {
    Speech.stop();
    isPlaying = false;
};

/**
 * Speak text using expo-speech with German voice
 * @param text - Text to speak
 * @param options - Optional settings (slow mode)
 */
export const speak = async (
    text: string,
    options: {
        slow?: boolean;
    } = {}
): Promise<boolean> => {
    const { slow } = options;
    isLoading = true;
    isPlaying = true;

    try {
        return new Promise((resolve) => {
            const speechOptions: Speech.SpeechOptions = {
                language: 'de-DE',
                rate: slow ? 0.6 : 0.85,
                pitch: 1.0,
                onDone: () => {
                    isPlaying = false;
                    isLoading = false;
                    resolve(true);
                },
                onError: () => {
                    isPlaying = false;
                    isLoading = false;
                    resolve(false);
                },
            };

            // Use selected German voice if available
            if (germanVoice) {
                speechOptions.voice = germanVoice.identifier;
            }

            Speech.speak(text, speechOptions);
        });
    } catch (error) {
        console.error('TTS error:', error);
        isPlaying = false;
        isLoading = false;
        return false;
    }
};

export const getIsPlaying = (): boolean => isPlaying;
export const getIsLoading = (): boolean => isLoading;
export const getIsInitialized = (): boolean => isInitialized;

// Re-export TTS model management functions
export {
    isModelDownloaded,
    downloadModel,
    deleteModel,
    getModelSize,
} from './ttsModelManager';

export default {
    speak,
    stopAudio,
    getIsPlaying,
    getIsLoading,
    getIsInitialized,
    initializeTTS,
    deinitializeTTS,
};
