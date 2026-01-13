// Dictation Content - Listen and Write sentences organized by level and difficulty
import { CEFRLevel } from '../../types';

export interface DictationItem {
    id: string;
    german: string;
    english: string;
    level: CEFRLevel;
    difficulty: 'word' | 'phrase' | 'sentence';
    category: string;
    hints?: string[];
}

export const dictationContent: DictationItem[] = [
    // === A1 Level ===
    // Words
    { id: 'dict-a1-w1', german: 'Schule', english: 'school', level: 'A1', difficulty: 'word', category: 'places' },
    { id: 'dict-a1-w2', german: 'Wasser', english: 'water', level: 'A1', difficulty: 'word', category: 'food' },
    { id: 'dict-a1-w3', german: 'Freund', english: 'friend', level: 'A1', difficulty: 'word', category: 'people' },
    { id: 'dict-a1-w4', german: 'Straße', english: 'street', level: 'A1', difficulty: 'word', category: 'places', hints: ['ß sounds like ss'] },
    { id: 'dict-a1-w5', german: 'Küche', english: 'kitchen', level: 'A1', difficulty: 'word', category: 'home', hints: ['ü is like "ee" with rounded lips'] },
    { id: 'dict-a1-w6', german: 'Brötchen', english: 'bread roll', level: 'A1', difficulty: 'word', category: 'food' },
    { id: 'dict-a1-w7', german: 'Mädchen', english: 'girl', level: 'A1', difficulty: 'word', category: 'people' },
    { id: 'dict-a1-w8', german: 'Frühstück', english: 'breakfast', level: 'A1', difficulty: 'word', category: 'food' },
    { id: 'dict-a1-w9', german: 'Entschuldigung', english: 'excuse me', level: 'A1', difficulty: 'word', category: 'phrases' },
    { id: 'dict-a1-w10', german: 'Geburtstag', english: 'birthday', level: 'A1', difficulty: 'word', category: 'time' },

    // Phrases
    { id: 'dict-a1-p1', german: 'Guten Morgen', english: 'Good morning', level: 'A1', difficulty: 'phrase', category: 'greetings' },
    { id: 'dict-a1-p2', german: 'Wie geht es dir?', english: 'How are you?', level: 'A1', difficulty: 'phrase', category: 'greetings' },
    { id: 'dict-a1-p3', german: 'Ich heiße Anna.', english: 'My name is Anna.', level: 'A1', difficulty: 'phrase', category: 'introduction' },
    { id: 'dict-a1-p4', german: 'Bis morgen!', english: 'See you tomorrow!', level: 'A1', difficulty: 'phrase', category: 'greetings' },
    { id: 'dict-a1-p5', german: 'Einen Kaffee, bitte.', english: 'A coffee, please.', level: 'A1', difficulty: 'phrase', category: 'restaurant' },

    // Sentences
    { id: 'dict-a1-s1', german: 'Ich komme aus Deutschland.', english: 'I come from Germany.', level: 'A1', difficulty: 'sentence', category: 'introduction' },
    { id: 'dict-a1-s2', german: 'Wo ist der Bahnhof?', english: 'Where is the train station?', level: 'A1', difficulty: 'sentence', category: 'directions' },
    { id: 'dict-a1-s3', german: 'Das Wetter ist schön heute.', english: 'The weather is nice today.', level: 'A1', difficulty: 'sentence', category: 'weather' },
    { id: 'dict-a1-s4', german: 'Ich möchte Deutsch lernen.', english: 'I would like to learn German.', level: 'A1', difficulty: 'sentence', category: 'learning' },
    { id: 'dict-a1-s5', german: 'Meine Familie wohnt in Berlin.', english: 'My family lives in Berlin.', level: 'A1', difficulty: 'sentence', category: 'family' },

    // === A2 Level ===
    // Words
    { id: 'dict-a2-w1', german: 'Sehenswürdigkeit', english: 'sight/attraction', level: 'A2', difficulty: 'word', category: 'travel' },
    { id: 'dict-a2-w2', german: 'Klimaanlage', english: 'air conditioning', level: 'A2', difficulty: 'word', category: 'home' },
    { id: 'dict-a2-w3', german: 'Waschmaschine', english: 'washing machine', level: 'A2', difficulty: 'word', category: 'home' },
    { id: 'dict-a2-w4', german: 'Führerschein', english: 'driver\'s license', level: 'A2', difficulty: 'word', category: 'documents' },
    { id: 'dict-a2-w5', german: 'Krankenversicherung', english: 'health insurance', level: 'A2', difficulty: 'word', category: 'health' },

    // Phrases
    { id: 'dict-a2-p1', german: 'Könnten Sie das wiederholen?', english: 'Could you repeat that?', level: 'A2', difficulty: 'phrase', category: 'communication' },
    { id: 'dict-a2-p2', german: 'Ich hätte gern fünf Brötchen.', english: 'I would like five bread rolls.', level: 'A2', difficulty: 'phrase', category: 'shopping' },
    { id: 'dict-a2-p3', german: 'Der Zug hat Verspätung.', english: 'The train is delayed.', level: 'A2', difficulty: 'phrase', category: 'travel' },
    { id: 'dict-a2-p4', german: 'Wo kann ich hier parken?', english: 'Where can I park here?', level: 'A2', difficulty: 'phrase', category: 'directions' },
    { id: 'dict-a2-p5', german: 'Ich muss zum Arzt gehen.', english: 'I have to go to the doctor.', level: 'A2', difficulty: 'phrase', category: 'health' },

    // Sentences
    { id: 'dict-a2-s1', german: 'Die Bäckerei öffnet um sechs Uhr früh.', english: 'The bakery opens at six in the morning.', level: 'A2', difficulty: 'sentence', category: 'shopping' },
    { id: 'dict-a2-s2', german: 'Ich freue mich auf das Wochenende.', english: 'I am looking forward to the weekend.', level: 'A2', difficulty: 'sentence', category: 'emotions' },
    { id: 'dict-a2-s3', german: 'Gestern war das Wetter sehr schlecht.', english: 'Yesterday the weather was very bad.', level: 'A2', difficulty: 'sentence', category: 'weather' },
    { id: 'dict-a2-s4', german: 'Können Sie mir bitte helfen?', english: 'Can you please help me?', level: 'A2', difficulty: 'sentence', category: 'communication' },
    { id: 'dict-a2-s5', german: 'Die Straßenbahn kommt in fünf Minuten.', english: 'The tram arrives in five minutes.', level: 'A2', difficulty: 'sentence', category: 'transport' },

    // === B1 Level ===
    // Words
    { id: 'dict-b1-w1', german: 'Verantwortung', english: 'responsibility', level: 'B1', difficulty: 'word', category: 'work' },
    { id: 'dict-b1-w2', german: 'Zusammenarbeit', english: 'collaboration', level: 'B1', difficulty: 'word', category: 'work' },
    { id: 'dict-b1-w3', german: 'Wissenschaftler', english: 'scientist', level: 'B1', difficulty: 'word', category: 'professions' },
    { id: 'dict-b1-w4', german: 'Umweltschutz', english: 'environmental protection', level: 'B1', difficulty: 'word', category: 'environment' },
    { id: 'dict-b1-w5', german: 'Selbstverständlich', english: 'of course', level: 'B1', difficulty: 'word', category: 'expressions' },

    // Phrases
    { id: 'dict-b1-p1', german: 'Ich würde gern einen Tisch reservieren.', english: 'I would like to reserve a table.', level: 'B1', difficulty: 'phrase', category: 'restaurant' },
    { id: 'dict-b1-p2', german: 'Könnten Sie mir die Rechnung bringen?', english: 'Could you bring me the bill?', level: 'B1', difficulty: 'phrase', category: 'restaurant' },
    { id: 'dict-b1-p3', german: 'Ich interessiere mich für Geschichte.', english: 'I am interested in history.', level: 'B1', difficulty: 'phrase', category: 'interests' },
    { id: 'dict-b1-p4', german: 'Das hängt von der Situation ab.', english: 'That depends on the situation.', level: 'B1', difficulty: 'phrase', category: 'expressions' },
    { id: 'dict-b1-p5', german: 'Ich bin anderer Meinung.', english: 'I have a different opinion.', level: 'B1', difficulty: 'phrase', category: 'opinions' },

    // Sentences
    { id: 'dict-b1-s1', german: 'Die Nachricht hat mich sehr überrascht.', english: 'The news surprised me very much.', level: 'B1', difficulty: 'sentence', category: 'emotions' },
    { id: 'dict-b1-s2', german: 'Ich möchte mich für die Unterstützung bedanken.', english: 'I would like to thank you for the support.', level: 'B1', difficulty: 'sentence', category: 'politeness' },
    { id: 'dict-b1-s3', german: 'Das Flugzeug hatte zwei Stunden Verspätung.', english: 'The airplane was two hours delayed.', level: 'B1', difficulty: 'sentence', category: 'travel' },
    { id: 'dict-b1-s4', german: 'Die Geschäfte schließen sonntags.', english: 'The shops close on Sundays.', level: 'B1', difficulty: 'sentence', category: 'shopping' },
    { id: 'dict-b1-s5', german: 'Ich hätte gern eine Auskunft über die Zugverbindung.', english: 'I would like information about the train connection.', level: 'B1', difficulty: 'sentence', category: 'travel' },

    // === B2 Level ===
    // Words
    { id: 'dict-b2-w1', german: 'Voraussetzung', english: 'prerequisite', level: 'B2', difficulty: 'word', category: 'academic' },
    { id: 'dict-b2-w2', german: 'Nachhaltigkeit', english: 'sustainability', level: 'B2', difficulty: 'word', category: 'environment' },
    { id: 'dict-b2-w3', german: 'Unabhängigkeit', english: 'independence', level: 'B2', difficulty: 'word', category: 'politics' },
    { id: 'dict-b2-w4', german: 'Wirtschaftslage', english: 'economic situation', level: 'B2', difficulty: 'word', category: 'economics' },
    { id: 'dict-b2-w5', german: 'Infrastruktur', english: 'infrastructure', level: 'B2', difficulty: 'word', category: 'society' },

    // Phrases
    { id: 'dict-b2-p1', german: 'Meiner Meinung nach sollten wir das überdenken.', english: 'In my opinion, we should reconsider that.', level: 'B2', difficulty: 'phrase', category: 'opinions' },
    { id: 'dict-b2-p2', german: 'Die Verantwortlichkeiten müssen klar definiert werden.', english: 'The responsibilities must be clearly defined.', level: 'B2', difficulty: 'phrase', category: 'work' },
    { id: 'dict-b2-p3', german: 'Ich möchte einen Vorschlag zur Verbesserung machen.', english: 'I would like to make a suggestion for improvement.', level: 'B2', difficulty: 'phrase', category: 'work' },
    { id: 'dict-b2-p4', german: 'Das ist ein zweischneidiges Schwert.', english: 'That is a double-edged sword.', level: 'B2', difficulty: 'phrase', category: 'idioms' },
    { id: 'dict-b2-p5', german: 'Es besteht kein Zweifel daran.', english: 'There is no doubt about it.', level: 'B2', difficulty: 'phrase', category: 'expressions' },

    // Sentences
    { id: 'dict-b2-s1', german: 'Die Wirtschaftslage hat sich in den letzten Jahren verschlechtert.', english: 'The economic situation has worsened in recent years.', level: 'B2', difficulty: 'sentence', category: 'economics' },
    { id: 'dict-b2-s2', german: 'Die Zusammenarbeit zwischen den Abteilungen funktioniert gut.', english: 'The collaboration between departments works well.', level: 'B2', difficulty: 'sentence', category: 'work' },
    { id: 'dict-b2-s3', german: 'Unglücklicherweise können wir den Termin nicht einhalten.', english: 'Unfortunately, we cannot meet the deadline.', level: 'B2', difficulty: 'sentence', category: 'work' },
    { id: 'dict-b2-s4', german: 'Die wissenschaftlichen Erkenntnisse bestätigen diese Theorie.', english: 'The scientific findings confirm this theory.', level: 'B2', difficulty: 'sentence', category: 'academic' },
    { id: 'dict-b2-s5', german: 'Ich stehe Ihnen für Rückfragen jederzeit zur Verfügung.', english: 'I am available for questions at any time.', level: 'B2', difficulty: 'sentence', category: 'work' },
];

export const getDictationByLevel = (level: CEFRLevel): DictationItem[] => {
    return dictationContent.filter(item => item.level === level);
};

export const getDictationByDifficulty = (
    level: CEFRLevel,
    difficulty: 'word' | 'phrase' | 'sentence'
): DictationItem[] => {
    return dictationContent.filter(
        item => item.level === level && item.difficulty === difficulty
    );
};

export const getRandomDictation = (level: CEFRLevel, count: number = 10): DictationItem[] => {
    const items = getDictationByLevel(level);
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Compare user input with correct text
export const compareDictation = (
    userInput: string,
    correct: string
): { isCorrect: boolean; accuracy: number; differences: { char: string; correct: boolean }[] } => {
    const normalizedUser = userInput.trim().toLowerCase();
    const normalizedCorrect = correct.trim().toLowerCase();

    const isCorrect = normalizedUser === normalizedCorrect;

    // Character-by-character comparison
    const differences: { char: string; correct: boolean }[] = [];
    const maxLen = Math.max(correct.length, userInput.length);

    for (let i = 0; i < maxLen; i++) {
        const userChar = userInput[i] || '';
        const correctChar = correct[i] || '';
        differences.push({
            char: correctChar || userChar,
            correct: userChar.toLowerCase() === correctChar.toLowerCase(),
        });
    }

    // Calculate accuracy
    const correctChars = differences.filter(d => d.correct).length;
    const accuracy = maxLen > 0 ? (correctChars / maxLen) * 100 : 0;

    return { isCorrect, accuracy, differences };
};
