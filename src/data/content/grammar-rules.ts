// Comprehensive Grammar Data - All German grammar topics organized by level
import { CEFRLevel } from '../../types';

export interface GrammarRule {
    id: string;
    level: CEFRLevel;
    category: string;
    title: string;
    titleDe: string;
    explanation: string;
    keyPoints: string[];
    tables?: Array<{
        title: string;
        headers: string[];
        rows: string[][];
    }>;
    examples: Array<{
        german: string;
        english: string;
        highlight?: string;
    }>;
    commonMistakes?: Array<{
        wrong: string;
        correct: string;
        explanation: string;
    }>;
    tips: string[];
}

export const grammarRules: GrammarRule[] = [
    // ==================== A1 GRAMMAR ====================

    // Articles
    {
        id: 'a1-definite-articles',
        level: 'A1',
        category: 'Articles',
        title: 'Definite Articles (the)',
        titleDe: 'Bestimmte Artikel',
        explanation: 'German has three genders: masculine (der), feminine (die), and neuter (das). Unlike English, every noun has a gender that must be memorized.',
        keyPoints: [
            'der = masculine nouns',
            'die = feminine nouns',
            'das = neuter nouns',
            'die = ALL plural nouns (regardless of gender)',
        ],
        tables: [
            {
                title: 'Definite Articles by Gender',
                headers: ['Gender', 'Article', 'Example'],
                rows: [
                    ['Masculine', 'der', 'der Mann (the man)'],
                    ['Feminine', 'die', 'die Frau (the woman)'],
                    ['Neuter', 'das', 'das Kind (the child)'],
                    ['Plural', 'die', 'die Kinder (the children)'],
                ],
            },
        ],
        examples: [
            { german: 'Der Hund ist groß.', english: 'The dog is big.', highlight: 'Der' },
            { german: 'Die Katze schläft.', english: 'The cat is sleeping.', highlight: 'Die' },
            { german: 'Das Buch ist interessant.', english: 'The book is interesting.', highlight: 'Das' },
        ],
        commonMistakes: [
            { wrong: 'Das Mädchen ist groß.', correct: 'Das Mädchen ist groß. ✓', explanation: 'Mädchen (girl) is neuter in German! Words ending in -chen are always neuter.' },
        ],
        tips: [
            'Learn the article WITH the noun: "der Tisch" not just "Tisch"',
            'Words ending in -ung, -heit, -keit, -schaft are feminine',
            'Words ending in -chen, -lein are neuter',
            'Most words ending in -er are masculine',
        ],
    },
    {
        id: 'a1-indefinite-articles',
        level: 'A1',
        category: 'Articles',
        title: 'Indefinite Articles (a/an)',
        titleDe: 'Unbestimmte Artikel',
        explanation: 'Indefinite articles (ein, eine) are used when referring to something non-specific or mentioned for the first time.',
        keyPoints: [
            'ein = masculine and neuter nouns',
            'eine = feminine nouns',
            'No plural form (use "some" or nothing)',
        ],
        tables: [
            {
                title: 'Indefinite Articles',
                headers: ['Gender', 'Article', 'Example'],
                rows: [
                    ['Masculine', 'ein', 'ein Mann (a man)'],
                    ['Feminine', 'eine', 'eine Frau (a woman)'],
                    ['Neuter', 'ein', 'ein Kind (a child)'],
                ],
            },
        ],
        examples: [
            { german: 'Ich habe einen Hund.', english: 'I have a dog.' },
            { german: 'Das ist eine Katze.', english: 'That is a cat.' },
            { german: 'Er kauft ein Buch.', english: 'He is buying a book.' },
        ],
        tips: [
            'Use indefinite articles when introducing something new',
            'Once mentioned, switch to definite articles',
        ],
    },

    // Personal Pronouns
    {
        id: 'a1-personal-pronouns',
        level: 'A1',
        category: 'Pronouns',
        title: 'Personal Pronouns',
        titleDe: 'Personalpronomen',
        explanation: 'Personal pronouns replace nouns. German has formal (Sie) and informal (du/ihr) forms.',
        keyPoints: [
            'ich = I',
            'du = you (informal singular)',
            'er/sie/es = he/she/it',
            'wir = we',
            'ihr = you (informal plural)',
            'sie = they',
            'Sie = you (formal, singular & plural)',
        ],
        tables: [
            {
                title: 'Personal Pronouns',
                headers: ['Person', 'Singular', 'Plural'],
                rows: [
                    ['1st person', 'ich', 'wir'],
                    ['2nd person (informal)', 'du', 'ihr'],
                    ['3rd person', 'er/sie/es', 'sie'],
                    ['2nd person (formal)', 'Sie', 'Sie'],
                ],
            },
        ],
        examples: [
            { german: 'Ich komme aus Deutschland.', english: 'I come from Germany.' },
            { german: 'Woher kommst du?', english: 'Where do you come from?' },
            { german: 'Sprechen Sie Deutsch?', english: 'Do you speak German? (formal)' },
        ],
        tips: [
            'Use "Sie" with strangers, elders, and in professional settings',
            'Use "du" with friends, family, and children',
            '"Sie" is always capitalized',
        ],
    },

    // Verb Conjugation
    {
        id: 'a1-present-tense-regular',
        level: 'A1',
        category: 'Verbs',
        title: 'Present Tense - Regular Verbs',
        titleDe: 'Präsens - regelmäßige Verben',
        explanation: 'Regular verbs follow a predictable pattern. Remove -en from the infinitive and add the appropriate ending.',
        keyPoints: [
            'Infinitive: machen (to make/do)',
            'Stem: mach-',
            'Add endings based on subject',
        ],
        tables: [
            {
                title: 'Regular Verb Conjugation: machen (to make)',
                headers: ['Pronoun', 'Ending', 'Conjugated'],
                rows: [
                    ['ich', '-e', 'mache'],
                    ['du', '-st', 'machst'],
                    ['er/sie/es', '-t', 'macht'],
                    ['wir', '-en', 'machen'],
                    ['ihr', '-t', 'macht'],
                    ['sie/Sie', '-en', 'machen'],
                ],
            },
        ],
        examples: [
            { german: 'Ich lerne Deutsch.', english: 'I am learning German.' },
            { german: 'Du spielst Fußball.', english: 'You play soccer.' },
            { german: 'Wir wohnen in Berlin.', english: 'We live in Berlin.' },
        ],
        commonMistakes: [
            { wrong: 'Ich lerne nicht.', correct: 'Ich lerne. ✓', explanation: 'The verb ending must match the subject.' },
        ],
        tips: [
            'The ich form always ends in -e',
            'The du form always ends in -st',
            'The er/sie/es form always ends in -t',
        ],
    },
    {
        id: 'a1-sein-haben',
        level: 'A1',
        category: 'Verbs',
        title: 'Sein & Haben (to be & to have)',
        titleDe: 'Sein und Haben',
        explanation: 'These are the two most important irregular verbs in German. They are used constantly and must be memorized.',
        keyPoints: [
            'sein = to be',
            'haben = to have',
            'Both are irregular and must be memorized',
        ],
        tables: [
            {
                title: 'sein (to be)',
                headers: ['Pronoun', 'Conjugation'],
                rows: [
                    ['ich', 'bin'],
                    ['du', 'bist'],
                    ['er/sie/es', 'ist'],
                    ['wir', 'sind'],
                    ['ihr', 'seid'],
                    ['sie/Sie', 'sind'],
                ],
            },
            {
                title: 'haben (to have)',
                headers: ['Pronoun', 'Conjugation'],
                rows: [
                    ['ich', 'habe'],
                    ['du', 'hast'],
                    ['er/sie/es', 'hat'],
                    ['wir', 'haben'],
                    ['ihr', 'habt'],
                    ['sie/Sie', 'haben'],
                ],
            },
        ],
        examples: [
            { german: 'Ich bin Student.', english: 'I am a student.' },
            { german: 'Sie ist Ärztin.', english: 'She is a doctor.' },
            { german: 'Wir haben Zeit.', english: 'We have time.' },
            { german: 'Hast du Hunger?', english: 'Are you hungry?' },
        ],
        tips: [
            'Use sein with professions (no article): Ich bin Lehrer',
            'Use haben for physical states: Ich habe Hunger/Durst',
            'Practice these every day until automatic',
        ],
    },

    // Negation
    {
        id: 'a1-negation',
        level: 'A1',
        category: 'Sentence Structure',
        title: 'Negation (nicht vs. kein)',
        titleDe: 'Verneinung',
        explanation: 'German uses "nicht" and "kein" to make sentences negative. The choice depends on what you\'re negating.',
        keyPoints: [
            'kein = negates nouns with indefinite articles',
            'nicht = negates everything else',
            'kein changes like ein (kein, keine, kein)',
        ],
        tables: [
            {
                title: 'When to use kein vs. nicht',
                headers: ['Use', 'Example'],
                rows: [
                    ['kein + noun', 'Ich habe kein Auto.'],
                    ['nicht + verb', 'Ich verstehe nicht.'],
                    ['nicht + adjective', 'Das ist nicht gut.'],
                    ['nicht + adverb', 'Er kommt nicht heute.'],
                ],
            },
        ],
        examples: [
            { german: 'Ich habe kein Geld.', english: 'I have no money.' },
            { german: 'Das ist nicht richtig.', english: 'That is not correct.' },
            { german: 'Sie kommt heute nicht.', english: 'She is not coming today.' },
        ],
        commonMistakes: [
            { wrong: 'Ich habe nicht Auto.', correct: 'Ich habe kein Auto.', explanation: 'Use "kein" to negate nouns with articles.' },
        ],
        tips: [
            'If you would use ein/eine, use kein/keine for negation',
            'nicht usually goes at the end or before what it negates',
        ],
    },

    // ==================== A2 GRAMMAR ====================

    {
        id: 'a2-accusative-case',
        level: 'A2',
        category: 'Cases',
        title: 'Accusative Case',
        titleDe: 'Akkusativ',
        explanation: 'The accusative case is used for direct objects (the thing receiving the action). Only masculine articles change.',
        keyPoints: [
            'der → den (masculine)',
            'die, das remain the same',
            'ein → einen (masculine)',
            'eine, ein remain the same',
        ],
        tables: [
            {
                title: 'Accusative Articles',
                headers: ['Gender', 'Nominative', 'Accusative'],
                rows: [
                    ['Masculine', 'der/ein', 'den/einen'],
                    ['Feminine', 'die/eine', 'die/eine'],
                    ['Neuter', 'das/ein', 'das/ein'],
                    ['Plural', 'die', 'die'],
                ],
            },
        ],
        examples: [
            { german: 'Ich sehe den Mann.', english: 'I see the man.', highlight: 'den' },
            { german: 'Er kauft einen Computer.', english: 'He buys a computer.', highlight: 'einen' },
            { german: 'Wir essen die Pizza.', english: 'We eat the pizza.' },
        ],
        tips: [
            'Ask "Wen oder was?" (whom or what?) to find the accusative',
            'Only masculine changes in accusative',
            'Many prepositions take accusative: für, ohne, gegen, durch',
        ],
    },
    {
        id: 'a2-dative-case',
        level: 'A2',
        category: 'Cases',
        title: 'Dative Case',
        titleDe: 'Dativ',
        explanation: 'The dative case is used for indirect objects (the person receiving something).',
        keyPoints: [
            'der → dem (masculine)',
            'die → der (feminine)',
            'das → dem (neuter)',
            'die (plural) → den + n',
        ],
        tables: [
            {
                title: 'Dative Articles',
                headers: ['Gender', 'Nominative', 'Dative'],
                rows: [
                    ['Masculine', 'der/ein', 'dem/einem'],
                    ['Feminine', 'die/eine', 'der/einer'],
                    ['Neuter', 'das/ein', 'dem/einem'],
                    ['Plural', 'die', 'den + n'],
                ],
            },
        ],
        examples: [
            { german: 'Ich gebe dem Mann das Buch.', english: 'I give the man the book.', highlight: 'dem' },
            { german: 'Sie hilft der Frau.', english: 'She helps the woman.', highlight: 'der' },
            { german: 'Er gibt den Kindern Geschenke.', english: 'He gives the children gifts.', highlight: 'den Kindern' },
        ],
        tips: [
            'Ask "Wem?" (to whom?) to find the dative',
            'Dative prepositions: aus, bei, mit, nach, seit, von, zu',
            'Plural nouns add -n in dative (if they don\'t already end in -n)',
        ],
    },
    {
        id: 'a2-perfect-tense',
        level: 'A2',
        category: 'Tenses',
        title: 'Perfect Tense (Perfekt)',
        titleDe: 'Perfekt',
        explanation: 'The most common past tense in spoken German. Use haben or sein + past participle.',
        keyPoints: [
            'Structure: haben/sein + past participle',
            'Most verbs use haben',
            'Movement/change verbs use sein',
            'Regular participle: ge- + stem + -t',
        ],
        tables: [
            {
                title: 'Perfect Tense Formation',
                headers: ['Type', 'Example', 'Participle'],
                rows: [
                    ['Regular', 'machen → gemacht', 'ge- + stem + -t'],
                    ['Irregular', 'gehen → gegangen', 'ge- + stem + -en'],
                    ['-ieren verbs', 'studieren → studiert', 'stem + -t (no ge-)'],
                ],
            },
            {
                title: 'Verbs with sein',
                headers: ['Verb', 'Participle', 'Example'],
                rows: [
                    ['gehen', 'gegangen', 'Ich bin gegangen.'],
                    ['kommen', 'gekommen', 'Er ist gekommen.'],
                    ['fahren', 'gefahren', 'Wir sind gefahren.'],
                    ['sein', 'gewesen', 'Sie ist gewesen.'],
                    ['bleiben', 'geblieben', 'Er ist geblieben.'],
                ],
            },
        ],
        examples: [
            { german: 'Ich habe Deutsch gelernt.', english: 'I have learned German.' },
            { german: 'Sie ist nach Berlin gefahren.', english: 'She went/has gone to Berlin.' },
            { german: 'Wir haben Pizza gegessen.', english: 'We ate pizza.' },
        ],
        tips: [
            'Use sein for movement and change of state verbs',
            'The participle always goes at the end',
            'sein and werden also use sein (ich bin gewesen, ich bin geworden)',
        ],
    },
    {
        id: 'a2-modal-verbs',
        level: 'A2',
        category: 'Verbs',
        title: 'Modal Verbs',
        titleDe: 'Modalverben',
        explanation: 'Modal verbs (können, müssen, wollen, etc.) modify the meaning of the main verb.',
        keyPoints: [
            'Modal verb in position 2',
            'Main verb (infinitive) at the end',
            'Modal verbs are irregular',
        ],
        tables: [
            {
                title: 'Modal Verbs Conjugation',
                headers: ['Modal', 'Meaning', 'ich', 'du', 'er', 'wir'],
                rows: [
                    ['können', 'can/able to', 'kann', 'kannst', 'kann', 'können'],
                    ['müssen', 'must/have to', 'muss', 'musst', 'muss', 'müssen'],
                    ['wollen', 'want to', 'will', 'willst', 'will', 'wollen'],
                    ['sollen', 'should', 'soll', 'sollst', 'soll', 'sollen'],
                    ['dürfen', 'may/allowed', 'darf', 'darfst', 'darf', 'dürfen'],
                    ['mögen', 'like to', 'mag', 'magst', 'mag', 'mögen'],
                ],
            },
        ],
        examples: [
            { german: 'Ich kann Deutsch sprechen.', english: 'I can speak German.' },
            { german: 'Du musst heute arbeiten.', english: 'You must work today.' },
            { german: 'Wir wollen ins Kino gehen.', english: 'We want to go to the cinema.' },
        ],
        tips: [
            'ich/er/sie/es forms are the same for modal verbs',
            'Modal + infinitive at the end is a key pattern',
            'möchten (would like) is the polite form of wollen',
        ],
    },

    // ==================== B1 GRAMMAR ====================

    {
        id: 'b1-genitive-case',
        level: 'B1',
        category: 'Cases',
        title: 'Genitive Case',
        titleDe: 'Genitiv',
        explanation: 'The genitive shows possession. It\'s equivalent to "of" or apostrophe-s in English.',
        keyPoints: [
            'der/das → des (+ s on noun)',
            'die → der',
            'Masculine/neuter nouns add -s or -es',
        ],
        tables: [
            {
                title: 'Genitive Articles',
                headers: ['Gender', 'Nominative', 'Genitive'],
                rows: [
                    ['Masculine', 'der', 'des + (e)s'],
                    ['Feminine', 'die', 'der'],
                    ['Neuter', 'das', 'des + (e)s'],
                    ['Plural', 'die', 'der'],
                ],
            },
        ],
        examples: [
            { german: 'Das Auto des Mannes ist rot.', english: 'The man\'s car is red.', highlight: 'des Mannes' },
            { german: 'Die Tasche der Frau ist neu.', english: 'The woman\'s bag is new.', highlight: 'der Frau' },
            { german: 'Das Ende des Films war gut.', english: 'The end of the film was good.' },
        ],
        tips: [
            'Genitive prepositions: wegen, trotz, während, statt',
            'In spoken German, often replaced by "von + dative"',
            'Short nouns add -es, long nouns add -s',
        ],
    },
    {
        id: 'b1-konjunktiv-ii',
        level: 'B1',
        category: 'Mood',
        title: 'Subjunctive II (Konjunktiv II)',
        titleDe: 'Konjunktiv II',
        explanation: 'Used for hypothetical situations, wishes, polite requests, and contrary-to-fact statements.',
        keyPoints: [
            'würde + infinitive (most verbs)',
            'wäre (would be), hätte (would have)',
            'könnte, müsste, sollte (modal subjunctives)',
        ],
        tables: [
            {
                title: 'Common Konjunktiv II Forms',
                headers: ['Verb', 'Indicative', 'Konjunktiv II'],
                rows: [
                    ['sein', 'ist', 'wäre'],
                    ['haben', 'hat', 'hätte'],
                    ['können', 'kann', 'könnte'],
                    ['müssen', 'muss', 'müsste'],
                    ['werden', 'wird', 'würde'],
                ],
            },
        ],
        examples: [
            { german: 'Ich würde gern helfen.', english: 'I would like to help.' },
            { german: 'Wenn ich reich wäre, würde ich reisen.', english: 'If I were rich, I would travel.' },
            { german: 'Könnten Sie mir helfen?', english: 'Could you help me?' },
        ],
        tips: [
            'Use würde + infinitive for most verbs',
            'Use proper forms for sein, haben, and modals',
            'Very polite! Great for formal requests',
        ],
    },
    {
        id: 'b1-passive-voice',
        level: 'B1',
        category: 'Sentence Structure',
        title: 'Passive Voice',
        titleDe: 'Passiv',
        explanation: 'When the action is more important than who performs it. Formed with werden + past participle.',
        keyPoints: [
            'Process passive: werden + past participle',
            'State passive: sein + past participle',
            'Agent introduced with "von + dative"',
        ],
        tables: [
            {
                title: 'Passive in Different Tenses',
                headers: ['Tense', 'Active', 'Passive'],
                rows: [
                    ['Present', 'Man repariert das Auto.', 'Das Auto wird repariert.'],
                    ['Past', 'Man reparierte das Auto.', 'Das Auto wurde repariert.'],
                    ['Perfect', 'Man hat das Auto repariert.', 'Das Auto ist repariert worden.'],
                ],
            },
        ],
        examples: [
            { german: 'Das Buch wird gelesen.', english: 'The book is being read.' },
            { german: 'Der Brief wurde geschrieben.', english: 'The letter was written.' },
            { german: 'Das Haus wurde von meinem Vater gebaut.', english: 'The house was built by my father.' },
        ],
        tips: [
            'Perfect passive uses "ist ... worden" (not "geworden")',
            'Some verbs cannot be made passive (sein, bekommen, haben)',
            'Very common in formal/written German',
        ],
    },
    {
        id: 'b1-relative-clauses',
        level: 'B1',
        category: 'Sentence Structure',
        title: 'Relative Clauses',
        titleDe: 'Relativsätze',
        explanation: 'Connect sentences using relative pronouns. The verb goes to the END of the relative clause.',
        keyPoints: [
            'Relative pronoun matches gender of noun it refers to',
            'Case depends on function in relative clause',
            'Verb always at the end',
        ],
        tables: [
            {
                title: 'Relative Pronouns',
                headers: ['Case', 'Masc.', 'Fem.', 'Neut.', 'Plural'],
                rows: [
                    ['Nominative', 'der', 'die', 'das', 'die'],
                    ['Accusative', 'den', 'die', 'das', 'die'],
                    ['Dative', 'dem', 'der', 'dem', 'denen'],
                    ['Genitive', 'dessen', 'deren', 'dessen', 'deren'],
                ],
            },
        ],
        examples: [
            { german: 'Der Mann, der dort steht, ist mein Vater.', english: 'The man who is standing there is my father.' },
            { german: 'Das Buch, das ich lese, ist interessant.', english: 'The book that I\'m reading is interesting.' },
            { german: 'Die Frau, der ich helfe, ist nett.', english: 'The woman whom I\'m helping is nice.' },
        ],
        tips: [
            'Comma before the relative pronoun',
            'Verb at the end of the relative clause',
            'Match gender to the noun, case to the function',
        ],
    },
];

// Get grammar rules by level
export const getGrammarByLevel = (level: CEFRLevel): GrammarRule[] => {
    return grammarRules.filter(rule => rule.level === level);
};

// Get grammar rules by category
export const getGrammarByCategory = (category: string): GrammarRule[] => {
    return grammarRules.filter(rule => rule.category === category);
};

// Get all categories for a level
export const getCategoriesForLevel = (level: CEFRLevel): string[] => {
    const rules = grammarRules.filter(rule => rule.level === level);
    return [...new Set(rules.map(rule => rule.category))];
};

// Get all available categories
export const getAllCategories = (): string[] => {
    return [...new Set(grammarRules.map(rule => rule.category))];
};
