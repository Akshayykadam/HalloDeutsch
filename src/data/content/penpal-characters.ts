// AI Pen Pal Characters - Different personas for letter/email writing practice
import { CEFRLevel } from '../../types';

export interface PenPalCharacter {
    id: string;
    name: string;
    avatar: string; // Ionicons name
    relationship: string;
    description: string;
    personalityTraits: string[];
    topicsOfInterest: string[];
    writingStyle: 'formal' | 'informal' | 'semi-formal';
    responseLevel: CEFRLevel;
    sampleGreetings: string[];
    sampleTopics: string[];
}

export const penPalCharacters: PenPalCharacter[] = [
    {
        id: 'hans-teacher',
        name: 'Herr Schmidt',
        avatar: 'school-outline',
        relationship: 'German Teacher',
        description: 'Your friendly German language teacher who loves helping students improve their writing skills.',
        personalityTraits: ['patient', 'encouraging', 'detail-oriented'],
        topicsOfInterest: ['German grammar', 'Language learning', 'Education', 'Books'],
        writingStyle: 'formal',
        responseLevel: 'A1',
        sampleGreetings: [
            'Sehr geehrter Herr Schmidt,',
            'Lieber Herr Schmidt,',
        ],
        sampleTopics: [
            'Ask about homework or lessons',
            'Request help with grammar',
            'Share your learning progress',
        ],
    },
    {
        id: 'lisa-friend',
        name: 'Lisa',
        avatar: 'person-outline',
        relationship: 'German Friend',
        description: 'A young German woman from Berlin who loves making international friends and sharing German culture.',
        personalityTraits: ['friendly', 'casual', 'curious', 'helpful'],
        topicsOfInterest: ['Music', 'Travel', 'Food', 'Daily life', 'Hobbies'],
        writingStyle: 'informal',
        responseLevel: 'A2',
        sampleGreetings: [
            'Liebe Lisa,',
            'Hallo Lisa,',
            'Hi Lisa!',
        ],
        sampleTopics: [
            'Talk about your hobbies',
            'Share what you did on the weekend',
            'Ask about life in Germany',
        ],
    },
    {
        id: 'max-roommate',
        name: 'Max',
        avatar: 'laptop-outline',
        relationship: 'Future Roommate',
        description: 'A German student looking for a roommate in Munich. He\'s tech-savvy and loves cooking.',
        personalityTraits: ['organized', 'tech-savvy', 'social'],
        topicsOfInterest: ['Technology', 'Cooking', 'Sports', 'Student life'],
        writingStyle: 'semi-formal',
        responseLevel: 'A2',
        sampleGreetings: [
            'Hallo Max,',
            'Lieber Max,',
        ],
        sampleTopics: [
            'Introduce yourself as a potential roommate',
            'Ask about the apartment and neighborhood',
            'Discuss house rules and habits',
        ],
    },
    {
        id: 'frau-mueller-landlord',
        name: 'Frau Müller',
        avatar: 'business-outline',
        relationship: 'Landlord',
        description: 'A professional landlord who manages several apartments in Hamburg. She appreciates punctual and formal communication.',
        personalityTraits: ['professional', 'strict', 'efficient'],
        topicsOfInterest: ['Apartment maintenance', 'Rent', 'Building rules'],
        writingStyle: 'formal',
        responseLevel: 'B1',
        sampleGreetings: [
            'Sehr geehrte Frau Müller,',
        ],
        sampleTopics: [
            'Report a maintenance issue',
            'Ask about the rental contract',
            'Request permission for something',
        ],
    },
    {
        id: 'thomas-colleague',
        name: 'Thomas',
        avatar: 'briefcase-outline',
        relationship: 'Work Colleague',
        description: 'A colleague at your German company who helps newcomers settle in at work.',
        personalityTraits: ['supportive', 'professional', 'experienced'],
        topicsOfInterest: ['Work projects', 'Office culture', 'Team activities'],
        writingStyle: 'semi-formal',
        responseLevel: 'B1',
        sampleGreetings: [
            'Lieber Thomas,',
            'Hallo Thomas,',
        ],
        sampleTopics: [
            'Ask about a work project',
            'Request time off',
            'Invite to lunch or coffee',
        ],
    },
    {
        id: 'dr-weber-doctor',
        name: 'Dr. Weber',
        avatar: 'medkit-outline',
        relationship: 'Doctor',
        description: 'Your German family doctor who communicates professionally but warmly.',
        personalityTraits: ['professional', 'caring', 'informative'],
        topicsOfInterest: ['Health', 'Appointments', 'Medical advice'],
        writingStyle: 'formal',
        responseLevel: 'B2',
        sampleGreetings: [
            'Sehr geehrter Herr Dr. Weber,',
        ],
        sampleTopics: [
            'Request an appointment',
            'Ask about test results',
            'Describe symptoms',
        ],
    },
];

export interface WritingPrompt {
    id: string;
    characterId: string;
    level: CEFRLevel;
    title: string;
    scenario: string;
    requirements: string[];
    helpfulPhrases: string[];
    wordCount: { min: number; max: number };
}

export const writingPrompts: WritingPrompt[] = [
    // A1 Level
    {
        id: 'prompt-a1-1',
        characterId: 'hans-teacher',
        level: 'A1',
        title: 'Introduction Letter',
        scenario: 'Write to your German teacher to introduce yourself at the beginning of the course.',
        requirements: [
            'Your name and where you are from',
            'Why you want to learn German',
            'A polite greeting and closing',
        ],
        helpfulPhrases: [
            'Ich heiße... / Mein Name ist...',
            'Ich komme aus...',
            'Ich lerne Deutsch, weil...',
            'Mit freundlichen Grüßen',
        ],
        wordCount: { min: 30, max: 60 },
    },
    {
        id: 'prompt-a1-2',
        characterId: 'lisa-friend',
        level: 'A1',
        title: 'Weekend Plans',
        scenario: 'Write to your friend Lisa about your plans for the weekend.',
        requirements: [
            'What you will do this weekend',
            'Ask Lisa about her plans',
            'Suggest meeting up',
        ],
        helpfulPhrases: [
            'Am Samstag/Sonntag...',
            'Ich möchte...',
            'Hast du Lust...?',
            'Wollen wir...?',
        ],
        wordCount: { min: 40, max: 80 },
    },

    // A2 Level
    {
        id: 'prompt-a2-1',
        characterId: 'max-roommate',
        level: 'A2',
        title: 'Roommate Application',
        scenario: 'Max is looking for a roommate. Write to him introducing yourself and why you would be a good roommate.',
        requirements: [
            'Introduce yourself and your occupation',
            'Describe your habits and lifestyle',
            'Ask questions about the apartment',
        ],
        helpfulPhrases: [
            'Ich bin Student/in / Ich arbeite als...',
            'Ich bin ordentlich/ruhig...',
            'Wie groß ist das Zimmer?',
            'Ist die Wohnung möbliert?',
        ],
        wordCount: { min: 60, max: 100 },
    },
    {
        id: 'prompt-a2-2',
        characterId: 'lisa-friend',
        level: 'A2',
        title: 'Vacation Story',
        scenario: 'Tell Lisa about your recent vacation. Share where you went and what you experienced.',
        requirements: [
            'Where you traveled',
            'What you did there',
            'Something interesting that happened',
            'Ask about Lisa\'s recent experiences',
        ],
        helpfulPhrases: [
            'Ich war in... im Urlaub.',
            'Ich habe... besichtigt/besucht.',
            'Das Beste war...',
            'Was hast du in letzter Zeit gemacht?',
        ],
        wordCount: { min: 80, max: 120 },
    },

    // B1 Level
    {
        id: 'prompt-b1-1',
        characterId: 'frau-mueller-landlord',
        level: 'B1',
        title: 'Maintenance Request',
        scenario: 'There is a problem in your apartment (heating not working). Write a formal letter to your landlord.',
        requirements: [
            'Formal greeting and introduction',
            'Clear description of the problem',
            'When the problem started',
            'Request for action',
            'Formal closing',
        ],
        helpfulPhrases: [
            'Ich schreibe Ihnen bezüglich...',
            'Seit... funktioniert... nicht mehr.',
            'Ich wäre Ihnen dankbar, wenn...',
            'Könnten Sie bitte einen Techniker schicken?',
        ],
        wordCount: { min: 100, max: 150 },
    },
    {
        id: 'prompt-b1-2',
        characterId: 'thomas-colleague',
        level: 'B1',
        title: 'Time Off Request',
        scenario: 'Write to your colleague Thomas asking for his support in covering your work while you take a few days off.',
        requirements: [
            'Explain when you need time off',
            'Reason for the request',
            'What tasks need to be covered',
            'Offer to return the favor',
        ],
        helpfulPhrases: [
            'Ich möchte fragen, ob...',
            'Von... bis... bin ich nicht im Büro.',
            'Könntest du bitte...?',
            'Ich würde mich natürlich revanchieren.',
        ],
        wordCount: { min: 100, max: 150 },
    },

    // B2 Level
    {
        id: 'prompt-b2-1',
        characterId: 'dr-weber-doctor',
        level: 'B2',
        title: 'Medical Appointment Request',
        scenario: 'Write a formal email to your doctor requesting an appointment and explaining your symptoms.',
        requirements: [
            'Formal greeting',
            'Describe your symptoms in detail',
            'Mention when symptoms started',
            'Request an urgent appointment',
            'Thank them for their time',
        ],
        helpfulPhrases: [
            'Ich möchte einen Termin vereinbaren.',
            'Seit einigen Tagen leide ich unter...',
            'Die Beschwerden traten erstmals... auf.',
            'Wäre es möglich, zeitnah einen Termin zu bekommen?',
        ],
        wordCount: { min: 120, max: 180 },
    },
];

export const getPenPalById = (id: string): PenPalCharacter | undefined => {
    return penPalCharacters.find(c => c.id === id);
};

export const getPromptsByLevel = (level: CEFRLevel): WritingPrompt[] => {
    return writingPrompts.filter(p => p.level === level);
};

export const getPromptsForCharacter = (characterId: string): WritingPrompt[] => {
    return writingPrompts.filter(p => p.characterId === characterId);
};
