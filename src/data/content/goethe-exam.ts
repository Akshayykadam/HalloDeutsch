// Goethe Exam Preparation - Practice exercises based on official Goethe-Institut exam formats
// Covers A1, A2, B1, B2 levels

import { CEFRLevel, Exercise, ExerciseType } from '../../types';

// Goethe Exam Structure by Level
export const GoetheExamStructure = {
    A1: {
        name: 'Goethe-Zertifikat A1: Start Deutsch 1',
        sections: [
            { name: 'Hören (Listening)', duration: 20, points: 25 },
            { name: 'Lesen (Reading)', duration: 25, points: 25 },
            { name: 'Schreiben (Writing)', duration: 20, points: 25 },
            { name: 'Sprechen (Speaking)', duration: 15, points: 25 },
        ],
        totalDuration: 80,
        passingScore: 60,
    },
    A2: {
        name: 'Goethe-Zertifikat A2',
        sections: [
            { name: 'Hören (Listening)', duration: 30, points: 25 },
            { name: 'Lesen (Reading)', duration: 30, points: 25 },
            { name: 'Schreiben (Writing)', duration: 30, points: 25 },
            { name: 'Sprechen (Speaking)', duration: 15, points: 25 },
        ],
        totalDuration: 105,
        passingScore: 60,
    },
    B1: {
        name: 'Goethe-Zertifikat B1',
        sections: [
            { name: 'Lesen (Reading)', duration: 65, points: 100 },
            { name: 'Hören (Listening)', duration: 40, points: 100 },
            { name: 'Schreiben (Writing)', duration: 60, points: 100 },
            { name: 'Sprechen (Speaking)', duration: 15, points: 100 },
        ],
        totalDuration: 180,
        passingScore: 60,
    },
    B2: {
        name: 'Goethe-Zertifikat B2',
        sections: [
            { name: 'Lesen (Reading)', duration: 65, points: 100 },
            { name: 'Hören (Listening)', duration: 40, points: 100 },
            { name: 'Schreiben (Writing)', duration: 75, points: 100 },
            { name: 'Sprechen (Speaking)', duration: 15, points: 100 },
        ],
        totalDuration: 195,
        passingScore: 60,
    },
};

// Sample Goethe A1 Reading Exercises
export const goetheA1ReadingExercises: Exercise[] = [
    {
        id: 'goethe-a1-read-001',
        type: 'multiple_choice',
        question: 'Was steht auf dem Schild?\n\n🚫 "Fotografieren verboten"',
        options: [
            'Man darf hier fotografieren.',
            'Man darf hier nicht fotografieren.',
            'Man kann hier Fotos kaufen.',
            'Das ist ein Fotostudio.',
        ],
        correctAnswer: 'Man darf hier nicht fotografieren.',
        explanation: '"Verboten" means forbidden. This sign means photography is not allowed.',
        hint: 'Look at the 🚫 symbol.',
        xpReward: 10,
    },
    {
        id: 'goethe-a1-read-002',
        type: 'multiple_choice',
        question: 'Lesen Sie die Anzeige:\n\n"Wohnung zu vermieten\n2 Zimmer, Küche, Bad\n450€ warm\nTel: 0176-12345678"',
        options: [
            'Die Wohnung kostet 450€.',
            'Die Wohnung hat 4 Zimmer.',
            'Die Wohnung ist zu kaufen.',
            'Die Telefonnummer fehlt.',
        ],
        correctAnswer: 'Die Wohnung kostet 450€.',
        explanation: '"450€ warm" means the rent including utilities is 450€.',
        hint: 'Look for the price.',
        xpReward: 10,
    },
    {
        id: 'goethe-a1-read-003',
        type: 'multiple_choice',
        question: '"Öffnungszeiten:\nMo-Fr: 9:00-18:00\nSa: 9:00-14:00\nSo: geschlossen"\n\nWann ist das Geschäft am Samstag geöffnet?',
        options: [
            'Von 9 bis 18 Uhr',
            'Von 9 bis 14 Uhr',
            'Das Geschäft ist geschlossen.',
            'Von 14 bis 18 Uhr',
        ],
        correctAnswer: 'Von 9 bis 14 Uhr',
        explanation: 'Sa = Samstag (Saturday). Opening hours are 9:00-14:00.',
        hint: 'Sa = Samstag (Saturday)',
        xpReward: 10,
    },
];

// Sample Goethe A1 Listening Preparation
export const goetheA1ListeningTopics = [
    {
        id: 'listen-001',
        title: 'Ansagen verstehen',
        description: 'Announcements at train stations, airports, stores',
        examples: [
            'Der Zug nach München fährt heute von Gleis 5.',
            'Das Geschäft schließt in 10 Minuten.',
        ],
    },
    {
        id: 'listen-002',
        title: 'Telefongespräche',
        description: 'Phone conversations, leaving messages',
        examples: [
            'Guten Tag, hier ist Dr. Müller. Bitte rufen Sie mich zurück.',
            'Hallo, ich möchte einen Termin machen.',
        ],
    },
    {
        id: 'listen-003',
        title: 'Alltagsgespräche',
        description: 'Daily conversations about time, weather, plans',
        examples: [
            'Wann treffen wir uns? - Um 15 Uhr am Bahnhof.',
            'Wie ist das Wetter heute? - Es regnet.',
        ],
    },
];

// Sample Goethe A1 Writing Tasks
export const goetheA1WritingTasks = [
    {
        id: 'write-001',
        type: 'form_filling',
        title: 'Formular ausfüllen',
        description: 'Fill out a registration form',
        fields: ['Name', 'Vorname', 'Geburtsdatum', 'Adresse', 'Telefon', 'E-Mail'],
        xpReward: 15,
    },
    {
        id: 'write-002',
        type: 'short_message',
        title: 'Kurze Mitteilung',
        description: 'Write a short message (30-40 words)',
        prompts: [
            'Schreiben Sie an Ihren Freund: Sie können heute nicht kommen. Warum? Neuer Termin?',
            'Schreiben Sie an Ihren Lehrer: Sie waren krank. Bitten Sie um die Hausaufgaben.',
        ],
        xpReward: 20,
    },
];

// Sample Goethe A1 Speaking Topics
export const goetheA1SpeakingTopics = [
    {
        id: 'speak-001',
        title: 'Sich vorstellen',
        description: 'Introduce yourself',
        points: ['Name', 'Alter', 'Herkunft', 'Wohnort', 'Beruf/Studium', 'Hobbys', 'Familie'],
        samplePhrases: [
            'Ich heiße...',
            'Ich bin ... Jahre alt.',
            'Ich komme aus...',
            'Ich wohne in...',
            'Ich bin Student/Studentin.',
            'Mein Hobby ist...',
        ],
        xpReward: 25,
    },
    {
        id: 'speak-002',
        title: 'Fragen stellen und antworten',
        description: 'Ask and answer questions about everyday topics',
        topics: ['Familie', 'Arbeit', 'Freizeit', 'Wohnung', 'Einkaufen'],
        xpReward: 25,
    },
    {
        id: 'speak-003',
        title: 'Bitten formulieren',
        description: 'Make requests in everyday situations',
        situations: [
            'Im Restaurant bestellen',
            'Nach dem Weg fragen',
            'Einen Termin machen',
            'Im Geschäft etwas kaufen',
        ],
        xpReward: 25,
    },
];

// Get exercises by level and section
export const getGoetheExercises = (level: CEFRLevel, section: string): Exercise[] => {
    if (level === 'A1' && section === 'Lesen') {
        return goetheA1ReadingExercises;
    }
    // Add more levels/sections as needed
    return [];
};

// Practice exam session
export interface ExamSession {
    level: CEFRLevel;
    section: string;
    startTime: Date;
    timeLimit: number;
    exercises: Exercise[];
    currentIndex: number;
    answers: Map<string, string>;
    score: number;
}

export const createExamSession = (level: CEFRLevel, section: string): ExamSession | null => {
    const examInfo = GoetheExamStructure[level];
    const sectionInfo = examInfo.sections.find((s) => s.name.includes(section));

    if (!sectionInfo) return null;

    return {
        level,
        section,
        startTime: new Date(),
        timeLimit: sectionInfo.duration * 60, // in seconds
        exercises: getGoetheExercises(level, section),
        currentIndex: 0,
        answers: new Map(),
        score: 0,
    };
};
