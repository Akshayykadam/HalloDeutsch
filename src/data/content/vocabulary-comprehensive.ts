// Comprehensive Vocabulary Data - A1 Level
// Complete vocabulary entries with full metadata per user requirements

import { VocabularyWord } from '../../types';

// ============================================
// A1 VOCABULARY - People & Roles
// ============================================
const peopleAndRoles: VocabularyWord[] = [
    {
        id: 'v-ppl-001',
        german: 'der Mann',
        english: 'man',
        pronunciation: 'mahn',
        partOfSpeech: 'noun',
        gender: 'der',
        plural: 'die Männer',
        level: 'A1',
        category: 'people_and_roles',
        domain: 'people',
        frequency: 'high',
        exampleSentence: 'Der Mann liest eine Zeitung.',
        exampleTranslation: 'The man is reading a newspaper.',
        collocations: ['ein junger Mann', 'ein alter Mann'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 4',
    },
    {
        id: 'v-ppl-002',
        german: 'die Frau',
        english: 'woman / wife',
        pronunciation: 'frow',
        partOfSpeech: 'noun',
        gender: 'die',
        plural: 'die Frauen',
        level: 'A1',
        category: 'people_and_roles',
        domain: 'people',
        frequency: 'high',
        exampleSentence: 'Die Frau arbeitet im Büro.',
        exampleTranslation: 'The woman works in the office.',
        collocations: ['meine Frau (my wife)', 'eine junge Frau'],
        usageNotes: 'Can mean both "woman" and "wife" depending on context',
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 4',
    },
    {
        id: 'v-ppl-003',
        german: 'das Kind',
        english: 'child',
        pronunciation: 'kint',
        partOfSpeech: 'noun',
        gender: 'das',
        plural: 'die Kinder',
        level: 'A1',
        category: 'people_and_roles',
        domain: 'family',
        frequency: 'high',
        exampleSentence: 'Das Kind spielt im Garten.',
        exampleTranslation: 'The child is playing in the garden.',
        collocations: ['kleine Kinder', 'mein Kind'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 4',
    },
    {
        id: 'v-ppl-004',
        german: 'die Mutter',
        english: 'mother',
        pronunciation: 'MOO-ter',
        partOfSpeech: 'noun',
        gender: 'die',
        plural: 'die Mütter',
        level: 'A1',
        category: 'people_and_roles',
        domain: 'family',
        frequency: 'high',
        exampleSentence: 'Meine Mutter kocht sehr gut.',
        exampleTranslation: 'My mother cooks very well.',
        informalVariant: 'die Mama',
        collocations: ['meine Mutter', 'die Mutter von...'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 4',
    },
    {
        id: 'v-ppl-005',
        german: 'der Vater',
        english: 'father',
        pronunciation: 'FAH-ter',
        partOfSpeech: 'noun',
        gender: 'der',
        plural: 'die Väter',
        level: 'A1',
        category: 'people_and_roles',
        domain: 'family',
        frequency: 'high',
        exampleSentence: 'Mein Vater arbeitet als Ingenieur.',
        exampleTranslation: 'My father works as an engineer.',
        informalVariant: 'der Papa',
        collocations: ['mein Vater', 'der Vater von...'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 4',
    },
    {
        id: 'v-ppl-006',
        german: 'der Beruf',
        english: 'profession / occupation',
        pronunciation: 'beh-ROOF',
        partOfSpeech: 'noun',
        gender: 'der',
        plural: 'die Berufe',
        level: 'A1',
        category: 'people_and_roles',
        domain: 'work',
        frequency: 'high',
        exampleSentence: 'Was ist dein Beruf?',
        exampleTranslation: 'What is your profession?',
        collocations: ['einen Beruf haben', 'im Beruf arbeiten'],
        isExamRelevant: true,
        examTags: ['goethe', 'telc'],
        introducedIn: 'A1 → Module 3, Lesson 4',
    },
    {
        id: 'v-ppl-007',
        german: 'der Arzt',
        english: 'doctor (male)',
        pronunciation: 'artst',
        partOfSpeech: 'noun',
        gender: 'der',
        plural: 'die Ärzte',
        level: 'A1',
        category: 'people_and_roles',
        domain: 'professions',
        frequency: 'high',
        exampleSentence: 'Ich muss zum Arzt gehen.',
        exampleTranslation: 'I have to go to the doctor.',
        collocations: ['zum Arzt gehen', 'der Arzt sagt'],
        usageNotes: 'Female form: die Ärztin',
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 4',
    },
    {
        id: 'v-ppl-008',
        german: 'der Lehrer',
        english: 'teacher (male)',
        pronunciation: 'LAY-rer',
        partOfSpeech: 'noun',
        gender: 'der',
        plural: 'die Lehrer',
        level: 'A1',
        category: 'people_and_roles',
        domain: 'professions',
        frequency: 'high',
        exampleSentence: 'Der Lehrer erklärt die Grammatik.',
        exampleTranslation: 'The teacher explains the grammar.',
        usageNotes: 'Female form: die Lehrerin',
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 4',
    },
];

// ============================================
// A1 VOCABULARY - Actions (Verbs)
// ============================================
const actions: VocabularyWord[] = [
    {
        id: 'v-act-001',
        german: 'sein',
        english: 'to be',
        pronunciation: 'zine',
        partOfSpeech: 'verb',
        verbForms: {
            infinitive: 'sein',
            presentIch: 'bin',
            presentDu: 'bist',
            presentEr: 'ist',
            pastParticiple: 'gewesen',
            auxiliary: 'sein',
            isIrregular: true,
            isSeparable: false,
        },
        level: 'A1',
        category: 'actions',
        domain: 'basic_verbs',
        frequency: 'high',
        exampleSentence: 'Ich bin Student.',
        exampleTranslation: 'I am a student.',
        advancedExamples: [
            { german: 'Er ist gestern hier gewesen.', english: 'He was here yesterday.', level: 'A2' },
        ],
        isExamRelevant: true,
        examTags: ['goethe', 'telc'],
        introducedIn: 'A1 → Module 4, Lesson 2',
    },
    {
        id: 'v-act-002',
        german: 'haben',
        english: 'to have',
        pronunciation: 'HAH-ben',
        partOfSpeech: 'verb',
        verbForms: {
            infinitive: 'haben',
            presentIch: 'habe',
            presentDu: 'hast',
            presentEr: 'hat',
            pastParticiple: 'gehabt',
            auxiliary: 'haben',
            isIrregular: true,
            isSeparable: false,
        },
        level: 'A1',
        category: 'actions',
        domain: 'basic_verbs',
        frequency: 'high',
        exampleSentence: 'Ich habe einen Hund.',
        exampleTranslation: 'I have a dog.',
        collocations: ['Hunger haben', 'Zeit haben', 'Recht haben'],
        isExamRelevant: true,
        examTags: ['goethe', 'telc'],
        introducedIn: 'A1 → Module 4, Lesson 3',
    },
    {
        id: 'v-act-003',
        german: 'machen',
        english: 'to make / to do',
        pronunciation: 'MA-chen',
        partOfSpeech: 'verb',
        verbForms: {
            infinitive: 'machen',
            presentIch: 'mache',
            presentDu: 'machst',
            presentEr: 'macht',
            pastParticiple: 'gemacht',
            auxiliary: 'haben',
            isIrregular: false,
            isSeparable: false,
        },
        level: 'A1',
        category: 'actions',
        domain: 'basic_verbs',
        frequency: 'high',
        exampleSentence: 'Was machst du heute?',
        exampleTranslation: 'What are you doing today?',
        collocations: ['Hausaufgaben machen', 'Sport machen', 'Fotos machen'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 5, Lesson 1',
    },
    {
        id: 'v-act-004',
        german: 'gehen',
        english: 'to go',
        pronunciation: 'GAY-en',
        partOfSpeech: 'verb',
        verbForms: {
            infinitive: 'gehen',
            presentIch: 'gehe',
            presentDu: 'gehst',
            presentEr: 'geht',
            pastParticiple: 'gegangen',
            auxiliary: 'sein',
            isIrregular: true,
            isSeparable: false,
        },
        level: 'A1',
        category: 'actions',
        domain: 'movement',
        frequency: 'high',
        exampleSentence: 'Ich gehe zur Schule.',
        exampleTranslation: 'I go to school.',
        collocations: ['nach Hause gehen', 'einkaufen gehen', 'schlafen gehen'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 5, Lesson 1',
    },
    {
        id: 'v-act-005',
        german: 'kommen',
        english: 'to come',
        pronunciation: 'KO-men',
        partOfSpeech: 'verb',
        verbForms: {
            infinitive: 'kommen',
            presentIch: 'komme',
            presentDu: 'kommst',
            presentEr: 'kommt',
            pastParticiple: 'gekommen',
            auxiliary: 'sein',
            isIrregular: true,
            isSeparable: false,
        },
        level: 'A1',
        category: 'actions',
        domain: 'movement',
        frequency: 'high',
        exampleSentence: 'Woher kommst du?',
        exampleTranslation: 'Where do you come from?',
        collocations: ['nach Hause kommen', 'aus Deutschland kommen'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 5, Lesson 1',
    },
    {
        id: 'v-act-006',
        german: 'sprechen',
        english: 'to speak',
        pronunciation: 'SHPRE-chen',
        partOfSpeech: 'verb',
        verbForms: {
            infinitive: 'sprechen',
            presentIch: 'spreche',
            presentDu: 'sprichst',
            presentEr: 'spricht',
            pastParticiple: 'gesprochen',
            auxiliary: 'haben',
            isIrregular: true,
            isSeparable: false,
        },
        level: 'A1',
        category: 'actions',
        domain: 'communication',
        frequency: 'high',
        exampleSentence: 'Sprechen Sie Deutsch?',
        exampleTranslation: 'Do you speak German?',
        collocations: ['Deutsch sprechen', 'mit jemandem sprechen'],
        usageNotes: 'Stem-changing verb: e → i in du/er forms',
        isExamRelevant: true,
        examTags: ['goethe', 'telc'],
        introducedIn: 'A1 → Module 5, Lesson 3',
    },
];

// ============================================
// A1 VOCABULARY - Objects & Things
// ============================================
const objectsAndThings: VocabularyWord[] = [
    {
        id: 'v-obj-001',
        german: 'das Buch',
        english: 'book',
        pronunciation: 'bookh',
        partOfSpeech: 'noun',
        gender: 'das',
        plural: 'die Bücher',
        level: 'A1',
        category: 'objects_and_things',
        domain: 'education',
        frequency: 'high',
        exampleSentence: 'Das ist ein Buch.',
        exampleTranslation: 'This is a book.',
        collocations: ['ein Buch lesen', 'ein Buch kaufen'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 1',
    },
    {
        id: 'v-obj-002',
        german: 'der Tisch',
        english: 'table',
        pronunciation: 'tish',
        partOfSpeech: 'noun',
        gender: 'der',
        plural: 'die Tische',
        level: 'A1',
        category: 'objects_and_things',
        domain: 'household',
        frequency: 'high',
        exampleSentence: 'Das Buch liegt auf dem Tisch.',
        exampleTranslation: 'The book is on the table.',
        collocations: ['am Tisch sitzen', 'den Tisch decken'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 1',
    },
    {
        id: 'v-obj-003',
        german: 'der Stuhl',
        english: 'chair',
        pronunciation: 'shtool',
        partOfSpeech: 'noun',
        gender: 'der',
        plural: 'die Stühle',
        level: 'A1',
        category: 'objects_and_things',
        domain: 'household',
        frequency: 'medium',
        exampleSentence: 'Bitte setz dich auf den Stuhl.',
        exampleTranslation: 'Please sit on the chair.',
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 1',
    },
    {
        id: 'v-obj-004',
        german: 'das Wasser',
        english: 'water',
        pronunciation: 'VA-ser',
        partOfSpeech: 'noun',
        gender: 'das',
        plural: '-',
        level: 'A1',
        category: 'objects_and_things',
        domain: 'food',
        frequency: 'high',
        exampleSentence: 'Kann ich ein Glas Wasser haben?',
        exampleTranslation: 'Can I have a glass of water?',
        collocations: ['ein Glas Wasser', 'Mineralwasser'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 2',
    },
    {
        id: 'v-obj-005',
        german: 'das Brot',
        english: 'bread',
        pronunciation: 'broht',
        partOfSpeech: 'noun',
        gender: 'das',
        plural: 'die Brote',
        level: 'A1',
        category: 'objects_and_things',
        domain: 'food',
        frequency: 'high',
        exampleSentence: 'Ich esse Brot zum Frühstück.',
        exampleTranslation: 'I eat bread for breakfast.',
        collocations: ['frisches Brot', 'Brot mit Butter'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 2',
    },
];

// ============================================
// A1 VOCABULARY - Time & Numbers
// ============================================
const timeAndNumbers: VocabularyWord[] = [
    {
        id: 'v-time-001',
        german: 'heute',
        english: 'today',
        pronunciation: 'HOY-tuh',
        partOfSpeech: 'adverb',
        level: 'A1',
        category: 'time_and_numbers',
        domain: 'time',
        frequency: 'high',
        exampleSentence: 'Heute ist Montag.',
        exampleTranslation: 'Today is Monday.',
        collocations: ['heute Morgen', 'heute Abend'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 2, Lesson 5',
    },
    {
        id: 'v-time-002',
        german: 'morgen',
        english: 'tomorrow',
        pronunciation: 'MOR-gen',
        partOfSpeech: 'adverb',
        level: 'A1',
        category: 'time_and_numbers',
        domain: 'time',
        frequency: 'high',
        exampleSentence: 'Morgen gehe ich zum Arzt.',
        exampleTranslation: 'Tomorrow I am going to the doctor.',
        usageNotes: 'Also means "morning" when used as noun (der Morgen)',
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 2, Lesson 5',
    },
    {
        id: 'v-time-003',
        german: 'die Stunde',
        english: 'hour',
        pronunciation: 'SHTOON-duh',
        partOfSpeech: 'noun',
        gender: 'die',
        plural: 'die Stunden',
        level: 'A1',
        category: 'time_and_numbers',
        domain: 'time',
        frequency: 'high',
        exampleSentence: 'Die Stunde hat 60 Minuten.',
        exampleTranslation: 'The hour has 60 minutes.',
        collocations: ['eine Stunde lang', 'pro Stunde'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 2, Lesson 4',
    },
];

// ============================================
// A1 VOCABULARY - Descriptions (Adjectives)
// ============================================
const descriptions: VocabularyWord[] = [
    {
        id: 'v-desc-001',
        german: 'gut',
        english: 'good',
        pronunciation: 'goot',
        partOfSpeech: 'adjective',
        level: 'A1',
        category: 'descriptions',
        domain: 'adjectives',
        frequency: 'high',
        exampleSentence: 'Das Essen ist sehr gut.',
        exampleTranslation: 'The food is very good.',
        collocations: ['sehr gut', 'ganz gut', 'gut aussehen'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 5',
    },
    {
        id: 'v-desc-002',
        german: 'schlecht',
        english: 'bad',
        pronunciation: 'shlecht',
        partOfSpeech: 'adjective',
        level: 'A1',
        category: 'descriptions',
        domain: 'adjectives',
        frequency: 'high',
        exampleSentence: 'Das Wetter ist schlecht.',
        exampleTranslation: 'The weather is bad.',
        collocations: ['schlecht gelaunt', 'sich schlecht fühlen'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 5',
    },
    {
        id: 'v-desc-003',
        german: 'groß',
        english: 'big / tall',
        pronunciation: 'grohs',
        partOfSpeech: 'adjective',
        level: 'A1',
        category: 'descriptions',
        domain: 'adjectives',
        frequency: 'high',
        exampleSentence: 'Das Haus ist groß.',
        exampleTranslation: 'The house is big.',
        collocations: ['zu groß', 'großer Bruder'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 5',
    },
    {
        id: 'v-desc-004',
        german: 'klein',
        english: 'small / little',
        pronunciation: 'kline',
        partOfSpeech: 'adjective',
        level: 'A1',
        category: 'descriptions',
        domain: 'adjectives',
        frequency: 'high',
        exampleSentence: 'Ich habe eine kleine Wohnung.',
        exampleTranslation: 'I have a small apartment.',
        collocations: ['ein kleines Kind', 'kleine Schwester'],
        isExamRelevant: true,
        examTags: ['goethe'],
        introducedIn: 'A1 → Module 3, Lesson 5',
    },
];

// ============================================
// COMBINED A1 VOCABULARY
// ============================================
export const A1_VOCABULARY: VocabularyWord[] = [
    ...peopleAndRoles,
    ...actions,
    ...objectsAndThings,
    ...timeAndNumbers,
    ...descriptions,
];

// ============================================
// Helper Functions
// ============================================

// Get vocabulary by level
export const getVocabularyByLevel = (level: string): VocabularyWord[] => {
    return A1_VOCABULARY.filter(w => w.level === level);
};

// Get vocabulary by category
export const getVocabularyByCategory = (category: string): VocabularyWord[] => {
    return A1_VOCABULARY.filter(w => w.category === category);
};

// Get vocabulary by domain
export const getVocabularyByDomain = (domain: string): VocabularyWord[] => {
    return A1_VOCABULARY.filter(w => w.domain === domain);
};

// Get high-frequency vocabulary
export const getHighFrequencyVocabulary = (): VocabularyWord[] => {
    return A1_VOCABULARY.filter(w => w.frequency === 'high');
};

// Get exam-relevant vocabulary
export const getExamVocabulary = (examType?: 'goethe' | 'telc' | 'ösd'): VocabularyWord[] => {
    return A1_VOCABULARY.filter(w => {
        if (!w.isExamRelevant) return false;
        if (examType && w.examTags) return w.examTags.includes(examType);
        return w.isExamRelevant;
    });
};

// Search vocabulary
export const searchVocabulary = (query: string): VocabularyWord[] => {
    const lowerQuery = query.toLowerCase();
    return A1_VOCABULARY.filter(w =>
        w.german.toLowerCase().includes(lowerQuery) ||
        w.english.toLowerCase().includes(lowerQuery)
    );
};

// Get all categories
export const getVocabularyCategories = (): string[] => {
    const categories = A1_VOCABULARY.map(w => w.category).filter(Boolean) as string[];
    return [...new Set(categories)];
};

// Get all domains
export const getVocabularyDomains = (): string[] => {
    return [...new Set(A1_VOCABULARY.map(w => w.domain))];
};

// Get verbs only
export const getVerbs = (): VocabularyWord[] => {
    return A1_VOCABULARY.filter(w => w.partOfSpeech === 'verb');
};

// Get nouns only (for article practice)
export const getNouns = (): VocabularyWord[] => {
    return A1_VOCABULARY.filter(w => w.partOfSpeech === 'noun');
};

// Get word by ID
export const getWordById = (id: string): VocabularyWord | undefined => {
    return A1_VOCABULARY.find(w => w.id === id);
};

// Statistics
export const getA1VocabularyStats = () => {
    return {
        total: A1_VOCABULARY.length,
        nouns: getNouns().length,
        verbs: getVerbs().length,
        highFrequency: getHighFrequencyVocabulary().length,
        examRelevant: getExamVocabulary().length,
        categories: getVocabularyCategories().length,
    };
};
