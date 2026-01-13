// Services barrel export
// Note: geminiService provides text-based AI, geminiAudioService provides audio features

export {
    generateExercise,
    generateGrammarExplanation,
    translateText,
    checkGrammar,
    generateVocabularyExamples,
    generateConversationResponse,
} from './geminiService';

export {
    startRecording,
    stopRecording,
    transcribeAudio,
    analyzePronunciation,
    playAudio,
    speakGerman,
} from './geminiAudioService';
