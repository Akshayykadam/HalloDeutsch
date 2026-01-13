// Pronunciation Practice Sentences organized by CEFR level
// Focus on difficult German sounds: ü, ö, ä, ch, sch, ß, z, w

import { CEFRLevel } from '../../types';

export interface PronunciationSentence {
    id: string;
    german: string;
    english: string;
    level: CEFRLevel;
    focusSounds: string[];
    difficulty: 'easy' | 'medium' | 'hard';
}

export const pronunciationSentences: PronunciationSentence[] = [
    // A1 Level - Simple Greetings and Phrases
    {
        id: 'pron-a1-001',
        german: 'Guten Morgen!',
        english: 'Good morning!',
        level: 'A1',
        focusSounds: ['g', 'u'],
        difficulty: 'easy',
    },
    {
        id: 'pron-a1-002',
        german: 'Wie heißen Sie?',
        english: 'What is your name?',
        level: 'A1',
        focusSounds: ['ei', 'ß'],
        difficulty: 'easy',
    },
    {
        id: 'pron-a1-003',
        german: 'Ich komme aus Deutschland.',
        english: 'I come from Germany.',
        level: 'A1',
        focusSounds: ['ch', 'sch'],
        difficulty: 'easy',
    },
    {
        id: 'pron-a1-004',
        german: 'Entschuldigung, wo ist die Toilette?',
        english: 'Excuse me, where is the toilet?',
        level: 'A1',
        focusSounds: ['sch', 'ts', 'w'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a1-005',
        german: 'Die Schule ist groß.',
        english: 'The school is big.',
        level: 'A1',
        focusSounds: ['sch', 'u'],
        difficulty: 'easy',
    },
    {
        id: 'pron-a1-006',
        german: 'Ich möchte einen Kaffee, bitte.',
        english: 'I would like a coffee, please.',
        level: 'A1',
        focusSounds: ['ö', 'ch'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a1-007',
        german: 'Der Zug fährt um zehn Uhr.',
        english: 'The train leaves at ten o\'clock.',
        level: 'A1',
        focusSounds: ['z', 'ä', 'u'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a1-008',
        german: 'Sprechen Sie Englisch?',
        english: 'Do you speak English?',
        level: 'A1',
        focusSounds: ['spr', 'ch'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a1-009',
        german: 'Das Wetter ist schön heute.',
        english: 'The weather is nice today.',
        level: 'A1',
        focusSounds: ['w', 'sch', 'ö'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a1-010',
        german: 'Meine Familie wohnt in München.',
        english: 'My family lives in Munich.',
        level: 'A1',
        focusSounds: ['w', 'ü', 'ch'],
        difficulty: 'hard',
    },

    // A2 Level - Everyday Situations
    {
        id: 'pron-a2-001',
        german: 'Könnten Sie das bitte wiederholen?',
        english: 'Could you please repeat that?',
        level: 'A2',
        focusSounds: ['ö', 'w', 'ie'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a2-002',
        german: 'Ich verstehe Deutsch ein bisschen.',
        english: 'I understand German a little bit.',
        level: 'A2',
        focusSounds: ['v', 'sch', 'ch'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a2-003',
        german: 'Die Bäckerei öffnet um sechs Uhr früh.',
        english: 'The bakery opens at six in the morning.',
        level: 'A2',
        focusSounds: ['ä', 'ö', 'ü'],
        difficulty: 'hard',
    },
    {
        id: 'pron-a2-004',
        german: 'Ich hätte gern fünf Brötchen.',
        english: 'I would like five bread rolls.',
        level: 'A2',
        focusSounds: ['ä', 'ü', 'ö'],
        difficulty: 'hard',
    },
    {
        id: 'pron-a2-005',
        german: 'Die Straßenbahn kommt in fünf Minuten.',
        english: 'The tram arrives in five minutes.',
        level: 'A2',
        focusSounds: ['ß', 'ü'],
        difficulty: 'hard',
    },
    {
        id: 'pron-a2-006',
        german: 'Ich muss zum Arzt gehen.',
        english: 'I have to go to the doctor.',
        level: 'A2',
        focusSounds: ['ss', 'z', 'ch'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a2-007',
        german: 'Gestern war das Wetter schlecht.',
        english: 'Yesterday the weather was bad.',
        level: 'A2',
        focusSounds: ['g', 'w', 'sch'],
        difficulty: 'medium',
    },
    {
        id: 'pron-a2-008',
        german: 'Ich freue mich auf das Wochenende.',
        english: 'I am looking forward to the weekend.',
        level: 'A2',
        focusSounds: ['fr', 'eu', 'ch', 'w'],
        difficulty: 'hard',
    },
    {
        id: 'pron-a2-009',
        german: 'Die Küche ist sehr gemütlich.',
        english: 'The kitchen is very cozy.',
        level: 'A2',
        focusSounds: ['ü', 'ch', 'ü'],
        difficulty: 'hard',
    },
    {
        id: 'pron-a2-010',
        german: 'Der Schlüssel liegt auf dem Tisch.',
        english: 'The key is on the table.',
        level: 'A2',
        focusSounds: ['schl', 'ü', 'ch'],
        difficulty: 'hard',
    },

    // B1 Level - Complex Sentences
    {
        id: 'pron-b1-001',
        german: 'Ich würde gern einen Tisch für heute Abend reservieren.',
        english: 'I would like to reserve a table for this evening.',
        level: 'B1',
        focusSounds: ['ü', 'ch', 'z'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b1-002',
        german: 'Das Flugzeug hatte zwei Stunden Verspätung.',
        english: 'The airplane was two hours delayed.',
        level: 'B1',
        focusSounds: ['fl', 'ug', 'z', 'ä'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b1-003',
        german: 'Könnten Sie mir bitte die Rechnung bringen?',
        english: 'Could you bring me the bill, please?',
        level: 'B1',
        focusSounds: ['ö', 'ch', 'ch'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b1-004',
        german: 'Die Sehenswürdigkeiten in Berlin sind wunderschön.',
        english: 'The sights in Berlin are beautiful.',
        level: 'B1',
        focusSounds: ['seh', 'ü', 'ig', 'sch', 'ö'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b1-005',
        german: 'Ich interessiere mich für deutsche Geschichte.',
        english: 'I am interested in German history.',
        level: 'B1',
        focusSounds: ['sch', 'ch'],
        difficulty: 'medium',
    },
    {
        id: 'pron-b1-006',
        german: 'Die Nachricht hat mich sehr überrascht.',
        english: 'The news surprised me very much.',
        level: 'B1',
        focusSounds: ['ch', 'ch', 'ü', 'sch'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b1-007',
        german: 'Selbstverständlich können Sie das zurückgeben.',
        english: 'Of course you can return that.',
        level: 'B1',
        focusSounds: ['st', 'ä', 'ch', 'ü'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b1-008',
        german: 'Ich möchte mich für die Unterstützung bedanken.',
        english: 'I would like to thank you for the support.',
        level: 'B1',
        focusSounds: ['ö', 'ch', 'ü', 'tz'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b1-009',
        german: 'Die Geschäfte schließen sonntags.',
        english: 'The shops close on Sundays.',
        level: 'B1',
        focusSounds: ['sch', 'ä', 'ß'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b1-010',
        german: 'Ich hätte gern eine Auskunft über die Zugverbindung.',
        english: 'I would like information about the train connection.',
        level: 'B1',
        focusSounds: ['ä', 'ü', 'z', 'ch'],
        difficulty: 'hard',
    },

    // B2 Level - Advanced and Professional
    {
        id: 'pron-b2-001',
        german: 'Die Wirtschaftslage hat sich verschlechtert.',
        english: 'The economic situation has worsened.',
        level: 'B2',
        focusSounds: ['sch', 'ch', 'sch'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-002',
        german: 'Meiner Meinung nach sollten wir das überdenken.',
        english: 'In my opinion, we should reconsider that.',
        level: 'B2',
        focusSounds: ['ei', 'ch', 'ü'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-003',
        german: 'Die Verantwortlichkeiten müssen klar definiert werden.',
        english: 'The responsibilities must be clearly defined.',
        level: 'B2',
        focusSounds: ['ch', 'ü', 'ie'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-004',
        german: 'Ich möchte einen Vorschlag zur Verbesserung machen.',
        english: 'I would like to make a suggestion for improvement.',
        level: 'B2',
        focusSounds: ['ö', 'schl', 'z'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-005',
        german: 'Die Zusammenarbeit zwischen den Abteilungen funktioniert gut.',
        english: 'The collaboration between departments works well.',
        level: 'B2',
        focusSounds: ['z', 'sch', 'ch'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-006',
        german: 'Unglücklicherweise können wir den Termin nicht einhalten.',
        english: 'Unfortunately, we cannot meet the deadline.',
        level: 'B2',
        focusSounds: ['ü', 'ch', 'ch'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-007',
        german: 'Die wissenschaftlichen Erkenntnisse bestätigen diese Theorie.',
        english: 'The scientific findings confirm this theory.',
        level: 'B2',
        focusSounds: ['schaft', 'ch', 'ä', 'ie'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-008',
        german: 'Ich schätze Ihre außerordentliche Unterstützung.',
        english: 'I appreciate your extraordinary support.',
        level: 'B2',
        focusSounds: ['sch', 'ä', 'ß', 'ü', 'tz'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-009',
        german: 'Die Voraussetzungen für den Erfolg sind gegeben.',
        english: 'The prerequisites for success are in place.',
        level: 'B2',
        focusSounds: ['tz', 'ü', 'z'],
        difficulty: 'hard',
    },
    {
        id: 'pron-b2-010',
        german: 'Ich stehe Ihnen für Rückfragen jederzeit zur Verfügung.',
        english: 'I am available for questions at any time.',
        level: 'B2',
        focusSounds: ['ü', 'ck', 'z', 'ü'],
        difficulty: 'hard',
    },
];

export const getSentencesByLevel = (level: CEFRLevel): PronunciationSentence[] => {
    return pronunciationSentences.filter(s => s.level === level);
};

export const getSentencesByDifficulty = (
    level: CEFRLevel,
    difficulty: 'easy' | 'medium' | 'hard'
): PronunciationSentence[] => {
    return pronunciationSentences.filter(
        s => s.level === level && s.difficulty === difficulty
    );
};

export const getRandomSentence = (level: CEFRLevel): PronunciationSentence => {
    const sentences = getSentencesByLevel(level);
    return sentences[Math.floor(Math.random() * sentences.length)];
};
