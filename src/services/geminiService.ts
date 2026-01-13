// Gemini Service - AI integration for German learning
// Using official @google/genai SDK

import { GoogleGenAI } from '@google/genai';
import { CEFRLevel, Exercise, ExerciseType, VocabularyWord } from '../types';
import { Config } from '../config';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: Config.GEMINI_API_KEY });

// Model to use for content generation
const MODEL = 'gemma-3-27b-it';

// Generate exercise based on level and topic
export const generateExercise = async (
    level: CEFRLevel,
    type: ExerciseType,
    topic: string
): Promise<Exercise | null> => {
    try {
        const prompt = `Generate a German language learning exercise for ${level} level students.
    Exercise type: ${type}
    Topic: ${topic}
    
    Respond in JSON format with:
    {
      "question": "the question in German or English depending on exercise type",
      "options": ["option1", "option2", "option3", "option4"] (for multiple choice),
      "correctAnswer": "the correct answer",
      "explanation": "brief explanation in English",
      "hint": "a helpful hint"
    }`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const text = response.text;
        if (!text) return null;

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const parsed = JSON.parse(jsonMatch[0]);

        return {
            id: `gen-${Date.now()}`,
            type,
            question: parsed.question,
            options: parsed.options,
            correctAnswer: parsed.correctAnswer,
            explanation: parsed.explanation,
            hint: parsed.hint,
            xpReward: 10,
        };
    } catch (error) {
        console.error('Error generating exercise:', error);
        return null;
    }
};

// Generate a batch of quiz questions
export const generateQuizBatch = async (
    topic: string,
    level: CEFRLevel,
    count: number = 10
): Promise<Exercise[]> => {
    try {
        const prompt = `Generate ${count} multiple-choice questions for German learners at ${level} level.
    Topic: ${topic}
    
    Respond in JSON format as an array of objects:
    [
      {
        "question": "The question in German (e.g., fill in the blank, or translate)",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option string",
        "explanation": "Brief explanation in English",
        "hint": "A helpful hint"
      }
    ]
    IMPORTANT: Ensure strictly valid JSON response.`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const text = response.text;
        if (!text) return [];

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return [];

        const parsed: any[] = JSON.parse(jsonMatch[0]);

        return parsed.map((item, index) => ({
            id: `quiz-${Date.now()}-${index}`,
            type: 'multiple_choice',
            question: item.question,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation,
            hint: item.hint,
            xpReward: 10,
        }));
    } catch (error) {
        console.error('Error generating quiz batch:', error);
        return [];
    }
};

// Generate grammar explanation
export const generateGrammarExplanation = async (
    topic: string,
    level: CEFRLevel
): Promise<string> => {
    try {
        const prompt = `Explain the German grammar topic "${topic}" for a ${level} level learner.
    Keep the explanation clear, concise, and include 2-3 examples with translations.
    Use simple language appropriate for the level.`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        return response.text || 'Unable to generate explanation.';
    } catch (error) {
        console.error('Error generating explanation:', error);
        return 'Unable to generate explanation. Please try again.';
    }
};

// Translate text with context
export const translateText = async (
    text: string,
    fromLang: 'de' | 'en',
    toLang: 'de' | 'en',
    context?: string
): Promise<{ translation: string; notes?: string }> => {
    try {
        const langNames = { de: 'German', en: 'English' };
        const prompt = `Translate the following from ${langNames[fromLang]} to ${langNames[toLang]}:
    "${text}"
    ${context ? `Context: ${context}` : ''}
    
    Respond in JSON format: {"translation": "...", "notes": "any helpful notes about the translation"}`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const responseText = response.text;
        if (!responseText) return { translation: text };

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { translation: responseText };

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error translating text:', error);
        return { translation: text };
    }
};

// Check and correct user's German text
export const checkGrammar = async (
    text: string,
    level: CEFRLevel
): Promise<{
    isCorrect: boolean;
    corrections: Array<{ original: string; corrected: string; explanation: string }>;
    suggestions: string[];
}> => {
    try {
        const prompt = `Check the following German text for grammar errors. The learner is at ${level} level.
    Text: "${text}"
    
    Respond in JSON format:
    {
      "isCorrect": true/false,
      "corrections": [{"original": "...", "corrected": "...", "explanation": "..."}],
      "suggestions": ["suggestion1", "suggestion2"]
    }`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const responseText = response.text;
        if (!responseText) {
            return { isCorrect: true, corrections: [], suggestions: [] };
        }

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return { isCorrect: true, corrections: [], suggestions: [] };
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error checking grammar:', error);
        return { isCorrect: true, corrections: [], suggestions: [] };
    }
};

// Generate vocabulary examples
export const generateVocabularyExamples = async (
    word: VocabularyWord,
    count: number = 3
): Promise<string[]> => {
    try {
        const prompt = `Generate ${count} example sentences using the German word "${word.german}" (${word.english}).
    Make the sentences appropriate for ${word.level} level learners.
    Format: German sentence | English translation`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const responseText = response.text;
        if (!responseText) return [];

        // Split by newlines and filter empty lines
        return responseText
            .split('\n')
            .filter((line) => line.trim().length > 0)
            .slice(0, count);
    } catch (error) {
        console.error('Error generating examples:', error);
        return [];
    }
};

// Generate conversation response for practice
export const generateConversationResponse = async (
    scenario: string,
    systemPrompt: string,
    userMessage: string,
    level: CEFRLevel,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{
    response: string;
    translation: string;
    suggestions: string[];
}> => {
    try {
        const historyText = conversationHistory
            .map((msg) => `${msg.role === 'user' ? 'Learner' : 'AI'}: ${msg.content}`)
            .join('\n');

        const prompt = `
    ROLE: ${systemPrompt}
    SCENARIO: ${scenario}
    USER LEVEL: ${level}
    
    Conversation so far:
    ${historyText}
    
    Learner just said: "${userMessage}"
    
    CRITICAL RULES:
    1. Your "response" field MUST be 100% in German - do NOT mix any English words
    2. Keep dialogue natural and conversational for the scenario
    3. Match the vocabulary complexity to the ${level} level
    4. The "translation" field provides the English meaning separately
    5. Suggestions should also be in German only
    
    Format your response as JSON:
    {
      "response": "Your response in PURE GERMAN only - no English words",
      "translation": "English translation of your response",
      "suggestions": ["German suggestion 1", "German suggestion 2", "German suggestion 3"]
    }`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const responseText = response.text;
        if (!responseText) {
            return {
                response: 'Entschuldigung, ich habe das nicht verstanden.',
                translation: "Sorry, I didn't understand that.",
                suggestions: ['Können Sie das wiederholen?'],
            };
        }

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                response: responseText,
                translation: '',
                suggestions: [],
            };
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error generating conversation response:', error);
        return {
            response: 'Es tut mir leid, es gab einen Fehler.',
            translation: 'Sorry, there was an error.',
            suggestions: ['Versuchen wir es noch einmal.'],
        };
    }
};

// Generate lesson teaching response - for structured curriculum delivery
export const generateLessonResponse = async (
    lessonTitle: string,
    lessonContent: string,
    lessonType: string,
    userMessage: string,
    level: CEFRLevel,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    messageCount: number
): Promise<{
    response: string;
    translation: string;
    suggestions: string[];
}> => {
    try {
        const historyText = conversationHistory
            .map((msg) => `${msg.role === 'user' ? 'Student' : 'Teacher'}: ${msg.content}`)
            .join('\n');

        // First message: Start teaching with actual content
        const isFirstMessage = messageCount === 0;

        let teachingInstructions = '';

        if (lessonType === 'pronunciation' && lessonTitle.toLowerCase().includes('alphabet')) {
            teachingInstructions = `
IMPORTANT: You are teaching the GERMAN ALPHABET. You MUST:
1. Start by introducing the 26 letters: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
2. For EACH letter, show: the letter, how it sounds in German, and a German word example
3. Teach in groups of 5-6 letters at a time
4. Focus on letters that sound DIFFERENT from English: J (sounds like Y), W (sounds like V), V (sounds like F), Z (sounds like TS)

${isFirstMessage ? `
Start with: "Willkommen! Heute lernen wir das deutsche Alphabet!"
Then teach letters A-F with their German sounds:
- A = "ah" (like 'father') - Example: Apfel (apple)
- B = "beh" - Example: Buch (book)
- C = "tseh" - Example: Computer
- D = "deh" - Example: Danke (thank you)
- E = "eh" - Example: Elefant
- F = "eff" - Example: Fisch (fish)
Ask if they want to continue to the next letters.` : 'Continue teaching the next group of letters based on the conversation.'}`;
        } else if (lessonType === 'vocabulary') {
            teachingInstructions = `
IMPORTANT: You are teaching VOCABULARY. You MUST:
1. Introduce 3-5 words at a time
2. For each word show: German word, article (der/die/das), pronunciation, English meaning
3. Give an example sentence for each word
4. After teaching, quiz the student on the words`;
        } else if (lessonType === 'grammar') {
            teachingInstructions = `
IMPORTANT: You are teaching GRAMMAR. You MUST:
1. Explain the rule clearly with simple language
2. Show the pattern/structure
3. Give 3-4 examples
4. Have the student practice with exercises`;
        } else {
            teachingInstructions = `
IMPORTANT: You are a German language TEACHER. You MUST:
1. Teach actual content, not just chat
2. Use examples and show translations
3. Build on previous messages
4. Make it interactive - ask questions, give exercises`;
        }

        const prompt = `You are a German language TEACHER (not just a chat partner) helping a ${level} level student.

LESSON: ${lessonTitle}
OBJECTIVE: ${lessonContent}
${teachingInstructions}

Conversation so far:
${historyText}

Student said: "${userMessage}"

RESPOND AS A TEACHER - actually teach the content! Do not just chat.
Keep responses focused and educational. Use German with English translations.

Format your response as JSON:
{
  "response": "Your teaching response in German (be detailed, show letters/words/examples)",
  "translation": "English translation",
  "suggestions": ["Weiter, bitte", "Können Sie das wiederholen?", "Ich verstehe"]
}`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const responseText = response.text;
        if (!responseText) {
            return {
                response: 'Entschuldigung, ich habe das nicht verstanden.',
                translation: "Sorry, I didn't understand that.",
                suggestions: ['Können Sie das wiederholen?'],
            };
        }

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                response: responseText,
                translation: '',
                suggestions: [],
            };
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error generating lesson response:', error);
        return {
            response: 'Es tut mir leid, es gab einen Fehler.',
            translation: 'Sorry, there was an error.',
            suggestions: ['Versuchen wir es noch einmal.'],
        };
    }
};

// Generate a random German word for "Word of the Day" widget
// Uses day of year to ensure a different word each day
export const generateWordOfDay = async (
    level: CEFRLevel
): Promise<{
    word: string;
    translation: string;
    example: string;
    exampleTranslation: string;
    partOfSpeech: string;
}> => {
    // Curated word list - 100 useful German words
    const wordsList = [
        { word: 'die Tasche', translation: 'the bag', example: 'Ich habe eine große Tasche.', exampleTranslation: 'I have a big bag.', partOfSpeech: 'noun (feminine)' },
        { word: 'die Freundschaft', translation: 'the friendship', example: 'Unsere Freundschaft ist sehr wichtig.', exampleTranslation: 'Our friendship is very important.', partOfSpeech: 'noun (feminine)' },
        { word: 'wunderbar', translation: 'wonderful', example: 'Das Wetter ist heute wunderbar.', exampleTranslation: 'The weather is wonderful today.', partOfSpeech: 'adjective' },
        { word: 'das Erlebnis', translation: 'the experience', example: 'Es war ein tolles Erlebnis.', exampleTranslation: 'It was a great experience.', partOfSpeech: 'noun (neuter)' },
        { word: 'verstehen', translation: 'to understand', example: 'Ich verstehe dich gut.', exampleTranslation: 'I understand you well.', partOfSpeech: 'verb' },
        { word: 'die Sehnsucht', translation: 'longing, yearning', example: 'Ich habe Sehnsucht nach meiner Heimat.', exampleTranslation: 'I yearn for my homeland.', partOfSpeech: 'noun (feminine)' },
        { word: 'gemütlich', translation: 'cozy, comfortable', example: 'Dieses Café ist sehr gemütlich.', exampleTranslation: 'This café is very cozy.', partOfSpeech: 'adjective' },
        { word: 'der Schmetterling', translation: 'the butterfly', example: 'Der Schmetterling fliegt im Garten.', exampleTranslation: 'The butterfly flies in the garden.', partOfSpeech: 'noun (masculine)' },
        { word: 'träumen', translation: 'to dream', example: 'Ich träume von einer Reise.', exampleTranslation: 'I dream of a trip.', partOfSpeech: 'verb' },
        { word: 'die Überraschung', translation: 'the surprise', example: 'Das ist eine schöne Überraschung!', exampleTranslation: 'That is a nice surprise!', partOfSpeech: 'noun (feminine)' },
        { word: 'aufregend', translation: 'exciting', example: 'Die Reise war sehr aufregend.', exampleTranslation: 'The trip was very exciting.', partOfSpeech: 'adjective' },
        { word: 'das Glück', translation: 'happiness/luck', example: 'Ich wünsche dir viel Glück!', exampleTranslation: 'I wish you much luck!', partOfSpeech: 'noun (neuter)' },
        { word: 'spazieren', translation: 'to stroll/walk', example: 'Wir gehen im Park spazieren.', exampleTranslation: 'We stroll in the park.', partOfSpeech: 'verb' },
        { word: 'der Sonnenuntergang', translation: 'the sunset', example: 'Der Sonnenuntergang ist wunderschön.', exampleTranslation: 'The sunset is beautiful.', partOfSpeech: 'noun (masculine)' },
        { word: 'lächeln', translation: 'to smile', example: 'Sie lächelt freundlich.', exampleTranslation: 'She smiles kindly.', partOfSpeech: 'verb' },
        { word: 'die Hoffnung', translation: 'the hope', example: 'Ich habe Hoffnung für die Zukunft.', exampleTranslation: 'I have hope for the future.', partOfSpeech: 'noun (feminine)' },
        { word: 'der Regenbogen', translation: 'the rainbow', example: 'Nach dem Regen kommt ein Regenbogen.', exampleTranslation: 'After the rain comes a rainbow.', partOfSpeech: 'noun (masculine)' },
        { word: 'genießen', translation: 'to enjoy', example: 'Ich genieße meinen Kaffee.', exampleTranslation: 'I enjoy my coffee.', partOfSpeech: 'verb' },
        { word: 'das Abenteuer', translation: 'the adventure', example: 'Wir erleben ein großes Abenteuer.', exampleTranslation: 'We experience a great adventure.', partOfSpeech: 'noun (neuter)' },
        { word: 'wahrscheinlich', translation: 'probably', example: 'Er kommt wahrscheinlich morgen.', exampleTranslation: 'He probably comes tomorrow.', partOfSpeech: 'adverb' },
        { word: 'die Erinnerung', translation: 'the memory', example: 'Das ist eine schöne Erinnerung.', exampleTranslation: 'That is a beautiful memory.', partOfSpeech: 'noun (feminine)' },
        { word: 'entspannen', translation: 'to relax', example: 'Am Wochenende möchte ich mich entspannen.', exampleTranslation: 'On the weekend I want to relax.', partOfSpeech: 'verb' },
        { word: 'der Himmel', translation: 'the sky/heaven', example: 'Der Himmel ist heute blau.', exampleTranslation: 'The sky is blue today.', partOfSpeech: 'noun (masculine)' },
        { word: 'entdecken', translation: 'to discover', example: 'Ich möchte neue Orte entdecken.', exampleTranslation: 'I want to discover new places.', partOfSpeech: 'verb' },
        { word: 'die Ruhe', translation: 'the calm/peace', example: 'Ich brauche etwas Ruhe.', exampleTranslation: 'I need some peace.', partOfSpeech: 'noun (feminine)' },
        { word: 'erstaunlich', translation: 'amazing', example: 'Das Ergebnis ist erstaunlich.', exampleTranslation: 'The result is amazing.', partOfSpeech: 'adjective' },
        { word: 'das Geheimnis', translation: 'the secret', example: 'Ich habe ein Geheimnis.', exampleTranslation: 'I have a secret.', partOfSpeech: 'noun (neuter)' },
        { word: 'vergessen', translation: 'to forget', example: 'Ich habe deinen Namen nicht vergessen.', exampleTranslation: 'I have not forgotten your name.', partOfSpeech: 'verb' },
        { word: 'die Zukunft', translation: 'the future', example: 'Die Zukunft sieht gut aus.', exampleTranslation: 'The future looks good.', partOfSpeech: 'noun (feminine)' },
        { word: 'wachsen', translation: 'to grow', example: 'Die Blumen wachsen schnell.', exampleTranslation: 'The flowers grow quickly.', partOfSpeech: 'verb' },
    ];

    // Get day of year (1-365) to pick a different word each day
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Use day of year to select word (cycles through list)
    const wordIndex = dayOfYear % wordsList.length;
    return wordsList[wordIndex];
};
// Identify object from image using Gemini Vision
export const identifyObject = async (
    base64Image: string
): Promise<{
    word: string;
    gender: string;
    translation: string;
    sentence: string;
} | null> => {
    try {
        const prompt = `Identify the main object in this image.
    Respond in JSON format:
    {
      "word": "the German word for the object",
      "gender": "der/die/das",
      "translation": "English translation",
      "sentence": "A simple example sentence in German about this object"
    }`;

        const response = await ai.models.generateContent({
            model: 'gemma-3-27b-it', // User requested model
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    ],
                },
            ],
        });

        const text = response.text;
        if (!text) return null;

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error identifying object:', error);
        return null;
    }
};

// Generate a short story for reading practice
export const generateStory = async (
    level: CEFRLevel,
    topic: string
): Promise<{
    title: string;
    content: string;
    translation: string;
    vocabulary: Array<{ word: string; translation: string }>;
} | null> => {
    try {
        const prompt = `Generate a short German story for ${level} level learners about "${topic}".
    The story should be 5-8 sentences long.
    
    Respond in JSON format:
    {
      "title": "Story Title in German",
      "content": "The full story text in German",
      "translation": "English translation of the full story",
      "vocabulary": [
        {"word": "German word from story", "translation": "English meaning"}
      ]
    }`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const text = response.text;
        if (!text) return null;

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error generating story:', error);
        return null;
    }
};
