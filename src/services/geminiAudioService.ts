// Gemini Audio Service - Voice interaction and conversation practice
// Integration with Gemini-2.5-flash-native-audio-dialog

import { Audio } from 'expo-av';
import { CEFRLevel, ConversationMessage, ConversationScenario } from '../types';
import { Config, Models } from '../config';

// API configuration from config
const GEMINI_AUDIO_ENDPOINT = Config.GEMINI_API_ENDPOINT;
const GEMINI_API_KEY = Config.GEMINI_API_KEY;

// Recording state
let recording: Audio.Recording | null = null;

// Start recording audio
export const startRecording = async (): Promise<boolean> => {
    try {
        console.log('Requesting audio permissions...');
        const { status } = await Audio.requestPermissionsAsync();

        if (status !== 'granted') {
            console.error('Audio permission not granted');
            return false;
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        console.log('Starting recording...');
        const { recording: newRecording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recording = newRecording;
        console.log('Recording started');
        return true;
    } catch (error) {
        console.error('Failed to start recording:', error);
        return false;
    }
};

// Stop recording and get audio URI
export const stopRecording = async (): Promise<string | null> => {
    try {
        if (!recording) {
            console.error('No recording to stop');
            return null;
        }

        console.log('Stopping recording...');
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        recording = null;
        console.log('Recording stopped, URI:', uri);
        return uri;
    } catch (error) {
        console.error('Failed to stop recording:', error);
        return null;
    }
};

// Transcribe audio to text
export const transcribeAudio = async (audioUri: string): Promise<string> => {
    try {
        console.log('Transcribing audio:', audioUri);

        // Placeholder for API call - will be implemented with actual API
        // In production, this would send the audio to Gemini for transcription

        return '[Transcription placeholder - audio transcription would appear here]';
    } catch (error) {
        console.error('Failed to transcribe audio:', error);
        return '';
    }
};

// Get pronunciation score and feedback
export const analyzePronunciation = async (
    audioUri: string,
    expectedText: string,
    level: CEFRLevel
): Promise<{
    score: number;
    feedback: string;
    phonemeIssues: Array<{ phoneme: string; suggestion: string }>;
}> => {
    try {
        console.log('Analyzing pronunciation for:', expectedText);

        // Placeholder for API call
        return {
            score: 85,
            feedback: 'Good pronunciation! Focus on the "ch" sound.',
            phonemeIssues: [
                { phoneme: 'ch', suggestion: 'Try making the sound from the back of your throat.' },
            ],
        };
    } catch (error) {
        console.error('Failed to analyze pronunciation:', error);
        return {
            score: 0,
            feedback: 'Unable to analyze pronunciation.',
            phonemeIssues: [],
        };
    }
};

// Generate AI response for audio conversation (uses audio dialog model)
export const generateAudioConversationResponse = async (
    scenario: ConversationScenario,
    conversationHistory: ConversationMessage[],
    userMessage: string
): Promise<{
    text: string;
    audioUrl?: string;
    suggestions: string[];
}> => {
    try {
        console.log('Generating conversation response for scenario:', scenario.title);

        // Placeholder for API call
        return {
            text: 'Das klingt interessant! Können Sie mir mehr erzählen?',
            suggestions: [
                'Ja, natürlich!',
                'Einen Moment bitte.',
                'Ich verstehe nicht.',
            ],
        };
    } catch (error) {
        console.error('Failed to generate response:', error);
        return {
            text: 'Entschuldigung, ich habe Sie nicht verstanden.',
            suggestions: ['Können Sie das wiederholen?'],
        };
    }
};

// Play audio from URL
export const playAudio = async (audioUrl: string): Promise<void> => {
    try {
        console.log('Playing audio:', audioUrl);
        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        await sound.playAsync();
    } catch (error) {
        console.error('Failed to play audio:', error);
    }
};

// Text-to-speech for German text
export const speakGerman = async (text: string, speed: number = 1.0): Promise<void> => {
    try {
        console.log('Speaking German:', text);

        // Using expo-speech would be implemented here
        // For now, this is a placeholder
    } catch (error) {
        console.error('Failed to speak text:', error);
    }
};
