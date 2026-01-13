// Telc Exam Data - Exercises based on Telc exam format
import { CEFRLevel, Exercise } from '../../types';

export interface TelcExamLevel {
    name: string;
    description: string;
    sections: {
        name: string;
        germanName: string;
        duration: number;
        points: number;
    }[];
    totalDuration: number;
    passingScore: number;
}

export const TelcExamStructure: Record<CEFRLevel, TelcExamLevel> = {
    A1: {
        name: 'telc Deutsch A1',
        description: 'Start Deutsch 1 alternative exam for beginners',
        sections: [
            { name: 'Listening', germanName: 'Hören', duration: 20, points: 25 },
            { name: 'Reading', germanName: 'Lesen', duration: 25, points: 25 },
            { name: 'Writing', germanName: 'Schreiben', duration: 20, points: 25 },
            { name: 'Speaking', germanName: 'Sprechen', duration: 11, points: 25 },
        ],
        totalDuration: 76,
        passingScore: 60,
    },
    A2: {
        name: 'telc Deutsch A2',
        description: 'Elementary German certification',
        sections: [
            { name: 'Listening', germanName: 'Hören', duration: 20, points: 25 },
            { name: 'Reading', germanName: 'Lesen', duration: 30, points: 25 },
            { name: 'Writing', germanName: 'Schreiben', duration: 30, points: 25 },
            { name: 'Speaking', germanName: 'Sprechen', duration: 11, points: 25 },
        ],
        totalDuration: 91,
        passingScore: 60,
    },
    B1: {
        name: 'telc Deutsch B1',
        description: 'Intermediate German for everyday situations',
        sections: [
            { name: 'Listening', germanName: 'Hören', duration: 30, points: 75 },
            { name: 'Reading', germanName: 'Lesen', duration: 60, points: 75 },
            { name: 'Writing', germanName: 'Schreiben', duration: 30, points: 45 },
            { name: 'Speaking', germanName: 'Sprechen', duration: 15, points: 75 },
        ],
        totalDuration: 135,
        passingScore: 60,
    },
    B2: {
        name: 'telc Deutsch B2',
        description: 'Upper-intermediate German for professional use',
        sections: [
            { name: 'Listening', germanName: 'Hören', duration: 20, points: 75 },
            { name: 'Reading', germanName: 'Lesen', duration: 90, points: 75 },
            { name: 'Writing', germanName: 'Schreiben', duration: 30, points: 45 },
            { name: 'Speaking', germanName: 'Sprechen', duration: 15, points: 75 },
        ],
        totalDuration: 155,
        passingScore: 60,
    },
};

// Telc Reading Exercises
export const telcReadingExercises: Record<CEFRLevel, Exercise[]> = {
    A1: [
        {
            id: 'telc-a1-r1',
            type: 'multiple_choice',
            question: 'Sie sehen dieses Schild an einer Tür:\n\n🚪 "Bitte klingeln"\n\nWas sollen Sie tun?',
            options: [
                'Die Tür öffnen',
                'An der Tür klopfen',
                'Die Klingel drücken',
                'Warten',
            ],
            correctAnswer: 'Die Klingel drücken',
            explanation: '"Klingeln" means to ring the bell. The sign asks you to ring the bell.',
            xpReward: 10,
        },
        {
            id: 'telc-a1-r2',
            type: 'multiple_choice',
            question: 'Sie lesen diese Nachricht:\n\n"Liebe Anna,\nIch bin um 15:00 Uhr zurück.\nGruß, Mama"\n\nWann kommt die Mutter nach Hause?',
            options: [
                'Am Morgen',
                'Um 3 Uhr nachmittags',
                'Am Abend',
                'Um Mitternacht',
            ],
            correctAnswer: 'Um 3 Uhr nachmittags',
            explanation: '15:00 Uhr = 3:00 PM = 3 Uhr nachmittags (3 o\'clock in the afternoon)',
            xpReward: 10,
        },
        {
            id: 'telc-a1-r3',
            type: 'multiple_choice',
            question: 'Sie sehen dieses Schild:\n\n🏊 "Schwimmbad: Mo-Fr 6-20 Uhr, Sa-So 8-18 Uhr"\n\nWann ist das Schwimmbad am Sonntag geöffnet?',
            options: [
                'Von 6 bis 20 Uhr',
                'Von 8 bis 18 Uhr',
                'Es ist geschlossen',
                'Von 6 bis 18 Uhr',
            ],
            correctAnswer: 'Von 8 bis 18 Uhr',
            explanation: 'Sa-So = Saturday-Sunday. The pool is open 8-18 Uhr (8 AM - 6 PM) on weekends.',
            xpReward: 10,
        },
    ],
    A2: [
        {
            id: 'telc-a2-r1',
            type: 'multiple_choice',
            question: 'Sie lesen diese Anzeige:\n\n"Suche Mitfahrgelegenheit nach München.\nKann 15€ Benzingeld zahlen.\nTel: 0151-1234567"\n\nWas sucht die Person?',
            options: [
                'Eine Wohnung in München',
                'Jemanden zum Mitfahren',
                'Ein Auto zu kaufen',
                'Einen Job in München',
            ],
            correctAnswer: 'Jemanden zum Mitfahren',
            explanation: '"Mitfahrgelegenheit" means a ride-share or carpool opportunity.',
            xpReward: 15,
        },
        {
            id: 'telc-a2-r2',
            type: 'multiple_choice',
            question: 'E-Mail:\n\n"Betreff: Termin verschieben\n\nSehr geehrte Frau Klein,\nkönnte ich unseren Termin am Montag auf Mittwoch verschieben?\nMit freundlichen Grüßen"\n\nWas möchte die Person?',
            options: [
                'Den Termin absagen',
                'Den Termin auf einen anderen Tag legen',
                'Einen neuen Termin für Montag',
                'Frau Klein besuchen',
            ],
            correctAnswer: 'Den Termin auf einen anderen Tag legen',
            explanation: '"Verschieben" means to postpone or move to a different time.',
            xpReward: 15,
        },
    ],
    B1: [
        {
            id: 'telc-b1-r1',
            type: 'multiple_choice',
            question: 'Artikel:\n\n"Die deutschen Supermärkte stellen immer mehr auf Selbstbedienungskassen um. Experten sagen, dass bis 2025 in 80% aller großen Supermärkte solche Kassen verfügbar sein werden."\n\nWas passiert mit den Supermärkten?',
            options: [
                'Sie werden geschlossen',
                'Sie bekommen mehr automatische Kassen',
                'Sie werden billiger',
                'Sie stellen mehr Personal ein',
            ],
            correctAnswer: 'Sie bekommen mehr automatische Kassen',
            explanation: '"Selbstbedienungskassen" are self-checkout registers. Supermarkets are adding more of them.',
            xpReward: 20,
        },
        {
            id: 'telc-b1-r2',
            type: 'multiple_choice',
            question: 'Nachricht:\n\n"Wegen Bauarbeiten ist die U-Bahn-Linie U4 vom 15. bis 20. März gesperrt. Bitte nutzen Sie den Ersatzbus E4."\n\nWas sollen die Fahrgäste tun?',
            options: [
                'Mit der U4 fahren',
                'Zu Hause bleiben',
                'Den Bus E4 nehmen',
                'Ein Taxi rufen',
            ],
            correctAnswer: 'Den Bus E4 nehmen',
            explanation: '"Ersatzbus" is a replacement bus. Passengers should take bus E4 instead of the closed subway.',
            xpReward: 20,
        },
    ],
    B2: [
        {
            id: 'telc-b2-r1',
            type: 'multiple_choice',
            question: 'Text:\n\n"Die Debatte um die Digitalisierung im Bildungswesen hat durch die Pandemie an Fahrt aufgenommen. Kritiker bemängeln jedoch, dass die Investitionen in die digitale Infrastruktur der Schulen nach wie vor unzureichend seien."\n\nWas kritisieren die Kritiker?',
            options: [
                'Die Digitalisierung geht zu schnell',
                'Es wird nicht genug in digitale Schulausstattung investiert',
                'Die Pandemie hat die Schulen beschädigt',
                'Lehrer nutzen zu viel Technologie',
            ],
            correctAnswer: 'Es wird nicht genug in digitale Schulausstattung investiert',
            explanation: '"Unzureichend" means insufficient. Critics say investments in digital infrastructure are not enough.',
            xpReward: 25,
        },
    ],
};

// Telc Writing Tasks
export const telcWritingTasks: Record<CEFRLevel, { id: string; type: string; description: string; prompt: string; wordCount: { min: number; max: number } }[]> = {
    A1: [
        {
            id: 'telc-a1-w1',
            type: 'form',
            description: 'Fill out a simple form',
            prompt: 'Füllen Sie das Formular aus:\n\n- Name:\n- Vorname:\n- Geburtsdatum:\n- Adresse:\n- Telefon:',
            wordCount: { min: 5, max: 20 },
        },
        {
            id: 'telc-a1-w2',
            type: 'message',
            description: 'Write a short message',
            prompt: 'Ihre Freundin hat Sie zum Essen eingeladen. Schreiben Sie, dass Sie kommen und was Sie mitbringen.',
            wordCount: { min: 20, max: 40 },
        },
    ],
    A2: [
        {
            id: 'telc-a2-w1',
            type: 'email',
            description: 'Write a semi-formal email',
            prompt: 'Sie möchten einen Deutschkurs besuchen. Schreiben Sie eine E-Mail an die Sprachschule: Fragen Sie nach Kursen, Preisen und Terminen.',
            wordCount: { min: 40, max: 60 },
        },
    ],
    B1: [
        {
            id: 'telc-b1-w1',
            type: 'formal-letter',
            description: 'Write a formal complaint',
            prompt: 'Sie haben ein Produkt online bestellt, aber es ist beschädigt angekommen. Schreiben Sie an den Kundenservice: Beschreiben Sie das Problem und sagen Sie, was Sie möchten.',
            wordCount: { min: 80, max: 120 },
        },
    ],
    B2: [
        {
            id: 'telc-b2-w1',
            type: 'opinion-essay',
            description: 'Write an opinion piece',
            prompt: 'Sollten Universitäten komplett auf Online-Unterricht umstellen? Schreiben Sie Ihre Meinung mit Argumenten.',
            wordCount: { min: 150, max: 200 },
        },
    ],
};

// Telc Speaking Topics
export const telcSpeakingTopics: Record<CEFRLevel, { id: string; topic: string; questions: string[]; keywords: string[] }[]> = {
    A1: [
        {
            id: 'telc-a1-s1',
            topic: 'Vorstellen',
            questions: ['Wie heißen Sie?', 'Woher kommen Sie?', 'Wo wohnen Sie?', 'Was ist Ihr Beruf?'],
            keywords: ['Name', 'Land', 'Stadt', 'Arbeit'],
        },
        {
            id: 'telc-a1-s2',
            topic: 'Familie',
            questions: ['Haben Sie Geschwister?', 'Sind Sie verheiratet?', 'Haben Sie Kinder?'],
            keywords: ['Bruder', 'Schwester', 'Eltern', 'Familie'],
        },
    ],
    A2: [
        {
            id: 'telc-a2-s1',
            topic: 'Freizeit',
            questions: ['Was machen Sie gern in Ihrer Freizeit?', 'Treiben Sie Sport?', 'Haben Sie ein Hobby?'],
            keywords: ['Hobby', 'Sport', 'Musik', 'Lesen', 'Freunde'],
        },
    ],
    B1: [
        {
            id: 'telc-b1-s1',
            topic: 'Reisen',
            questions: ['Wohin reisen Sie gern?', 'Wie planen Sie Ihre Urlaube?', 'Was war Ihr bester Urlaub?'],
            keywords: ['Reise', 'Urlaub', 'Hotel', 'Flugzeug', 'Sehenswürdigkeiten'],
        },
    ],
    B2: [
        {
            id: 'telc-b2-s1',
            topic: 'Gesellschaftliche Themen',
            questions: ['Was halten Sie von der Digitalisierung?', 'Wie beeinflusst Technologie unser Leben?'],
            keywords: ['Gesellschaft', 'Technologie', 'Meinung', 'Argument', 'Beispiel'],
        },
    ],
};

export const getTelcExercises = (level: CEFRLevel, section: string): Exercise[] => {
    if (section.toLowerCase().includes('lesen') || section.toLowerCase().includes('reading')) {
        return telcReadingExercises[level] || [];
    }
    return [];
};
