// Advanced Grammar Concepts from Intermediate German PDF
// Noun gender rules, weak nouns, adjectival nouns, compound nouns

import { CEFRLevel } from '../../types';

// ============================================
// NOUN GENDER RULES (from Intermediate German PDF)
// ============================================

export interface GenderRule {
    id: string;
    gender: 'der' | 'die' | 'das';
    rule: string;
    endings?: string[];
    categories?: string[];
    examples: string[];
    exceptions?: string[];
    level: CEFRLevel;
}

export const genderRules: GenderRule[] = [
    // MASCULINE (der) rules
    {
        id: 'gender-m-01',
        gender: 'der',
        rule: 'Male persons and animals',
        categories: ['male people', 'male animals'],
        examples: ['der Mann (man)', 'der Vater (father)', 'der Löwe (lion)'],
        level: 'A1',
    },
    {
        id: 'gender-m-02',
        gender: 'der',
        rule: 'Days, months, seasons',
        categories: ['days of week', 'months', 'seasons'],
        examples: ['der Montag (Monday)', 'der Januar (January)', 'der Sommer (summer)'],
        level: 'A1',
    },
    {
        id: 'gender-m-03',
        gender: 'der',
        rule: 'Nouns ending in -er, -ling, -ig, -ich',
        endings: ['-er', '-ling', '-ig', '-ich'],
        examples: ['der Lehrer (teacher)', 'der Liebling (darling)', 'der Honig (honey)', 'der Teppich (carpet)'],
        level: 'A2',
    },
    {
        id: 'gender-m-04',
        gender: 'der',
        rule: 'Nouns ending in -ismus, -or',
        endings: ['-ismus', '-or'],
        examples: ['der Humanismus (humanism)', 'der Motor (motor)'],
        level: 'B1',
    },
    {
        id: 'gender-m-05',
        gender: 'der',
        rule: 'Car brands and currencies',
        categories: ['car brands', 'currencies'],
        examples: ['der Mercedes', 'der BMW', 'der Euro', 'der Dollar'],
        level: 'A2',
    },
    {
        id: 'gender-m-06',
        gender: 'der',
        rule: 'Rivers (in Germany)',
        categories: ['rivers'],
        examples: ['der Rhein', 'der Main', 'der Neckar'],
        exceptions: ['die Donau', 'die Elbe', 'die Mosel'],
        level: 'B1',
    },

    // FEMININE (die) rules
    {
        id: 'gender-f-01',
        gender: 'die',
        rule: 'Female persons and animals',
        categories: ['female people', 'female animals'],
        examples: ['die Frau (woman)', 'die Mutter (mother)', 'die Katze (cat)'],
        level: 'A1',
    },
    {
        id: 'gender-f-02',
        gender: 'die',
        rule: 'Nouns ending in -e (most)',
        endings: ['-e'],
        examples: ['die Lampe (lamp)', 'die Blume (flower)', 'die Tasche (bag)'],
        exceptions: ['der Junge (boy)', 'der Name (name)', 'das Ende (end)'],
        level: 'A1',
    },
    {
        id: 'gender-f-03',
        gender: 'die',
        rule: 'Nouns ending in -heit, -keit, -ung, -schaft',
        endings: ['-heit', '-keit', '-ung', '-schaft'],
        examples: ['die Freiheit (freedom)', 'die Möglichkeit (possibility)', 'die Rechnung (bill)', 'die Freundschaft (friendship)'],
        level: 'A2',
    },
    {
        id: 'gender-f-04',
        gender: 'die',
        rule: 'Nouns ending in -ion, -tät, -ik',
        endings: ['-ion', '-tät', '-ik'],
        examples: ['die Religion (religion)', 'die Universität (university)', 'die Musik (music)'],
        level: 'A2',
    },
    {
        id: 'gender-f-05',
        gender: 'die',
        rule: 'Nouns ending in -in (female professions)',
        endings: ['-in'],
        examples: ['die Lehrerin (female teacher)', 'die Ärztin (female doctor)', 'die Studentin (female student)'],
        level: 'A1',
    },
    {
        id: 'gender-f-06',
        gender: 'die',
        rule: 'Countries ending in -ei, -ie, -e',
        endings: ['-ei', '-ie', '-e'],
        examples: ['die Türkei (Turkey)', 'die Slowakei (Slovakia)', 'die Schweiz (Switzerland)', 'die Ukraine'],
        level: 'B1',
    },

    // NEUTER (das) rules
    {
        id: 'gender-n-01',
        gender: 'das',
        rule: 'Nouns ending in -chen, -lein (diminutives)',
        endings: ['-chen', '-lein'],
        examples: ['das Mädchen (girl)', 'das Häuschen (little house)', 'das Tischlein (little table)'],
        level: 'A1',
    },
    {
        id: 'gender-n-02',
        gender: 'das',
        rule: 'Nouns ending in -um, -ment',
        endings: ['-um', '-ment'],
        examples: ['das Museum (museum)', 'das Zentrum (center)', 'das Instrument (instrument)'],
        level: 'A2',
    },
    {
        id: 'gender-n-03',
        gender: 'das',
        rule: 'Infinitives used as nouns',
        categories: ['infinitives as nouns'],
        examples: ['das Essen (eating/food)', 'das Lesen (reading)', 'das Schwimmen (swimming)'],
        level: 'A2',
    },
    {
        id: 'gender-n-04',
        gender: 'das',
        rule: 'Most metals and chemical elements',
        categories: ['metals', 'chemical elements'],
        examples: ['das Gold (gold)', 'das Silber (silver)', 'das Eisen (iron)'],
        level: 'B1',
    },
    {
        id: 'gender-n-05',
        gender: 'das',
        rule: 'Letters and colors as nouns',
        categories: ['letters', 'colors'],
        examples: ['das A', 'das Blau (blue)', 'das Rot (red)'],
        level: 'B1',
    },
];

// ============================================
// WEAK NOUNS (from Intermediate German PDF)
// ============================================

export interface WeakNoun {
    nominative: string;
    accusative: string;
    dative: string;
    genitive: string;
    english: string;
    note?: string;
}

export const weakNouns: WeakNoun[] = [
    { nominative: 'der Junge', accusative: 'den Jungen', dative: 'dem Jungen', genitive: 'des Jungen', english: 'boy' },
    { nominative: 'der Student', accusative: 'den Studenten', dative: 'dem Studenten', genitive: 'des Studenten', english: 'student (male)' },
    { nominative: 'der Architekt', accusative: 'den Architekten', dative: 'dem Architekten', genitive: 'des Architekten', english: 'architect' },
    { nominative: 'der Tourist', accusative: 'den Touristen', dative: 'dem Touristen', genitive: 'des Touristen', english: 'tourist' },
    { nominative: 'der Mensch', accusative: 'den Menschen', dative: 'dem Menschen', genitive: 'des Menschen', english: 'human being' },
    { nominative: 'der Name', accusative: 'den Namen', dative: 'dem Namen', genitive: 'des Namens', english: 'name', note: 'Adds -ns in genitive' },
    { nominative: 'der Herr', accusative: 'den Herrn', dative: 'dem Herrn', genitive: 'des Herrn', english: 'Mr./gentleman', note: 'Adds -n in singular, -en in plural' },
    { nominative: 'der Kollege', accusative: 'den Kollegen', dative: 'dem Kollegen', genitive: 'des Kollegen', english: 'colleague' },
    { nominative: 'der Kunde', accusative: 'den Kunden', dative: 'dem Kunden', genitive: 'des Kunden', english: 'customer' },
    { nominative: 'der Nachbar', accusative: 'den Nachbarn', dative: 'dem Nachbarn', genitive: 'des Nachbarn', english: 'neighbor' },
];

// ============================================
// COMPOUND NOUNS (from Intermediate German PDF)
// ============================================

export interface CompoundNoun {
    compound: string;
    parts: string[];
    gender: 'der' | 'die' | 'das';
    english: string;
    explanation: string;
}

export const compoundNouns: CompoundNoun[] = [
    { compound: 'das Computerspiel', parts: ['der Computer', 'das Spiel'], gender: 'das', english: 'computer game', explanation: 'Gender from last noun (Spiel)' },
    { compound: 'die Bauchtanzlehrerin', parts: ['der Bauch', 'der Tanz', 'die Lehrerin'], gender: 'die', english: 'belly dancing teacher', explanation: 'Gender from last noun (Lehrerin)' },
    { compound: 'die Lieblingsband', parts: ['der Liebling', 'die Band'], gender: 'die', english: 'favorite band', explanation: 'Adding -s after -ling' },
    { compound: 'der Mehrheitsbeschluss', parts: ['die Mehrheit', 'der Beschluss'], gender: 'der', english: 'majority decision', explanation: 'Adding -s after -heit' },
    { compound: 'der Kindergarten', parts: ['das Kind', 'der Garten'], gender: 'der', english: 'kindergarten', explanation: 'Adding -er (plural of Kind)' },
    { compound: 'das Schlafzimmer', parts: ['schlafen', 'das Zimmer'], gender: 'das', english: 'bedroom', explanation: 'Verb stem + noun' },
    { compound: 'der Handschuh', parts: ['die Hand', 'der Schuh'], gender: 'der', english: 'glove', explanation: 'Literally "hand shoe"' },
    { compound: 'der Kühlschrank', parts: ['kühl', 'der Schrank'], gender: 'der', english: 'refrigerator', explanation: 'Adjective + noun' },
];

// ============================================
// ADJECTIVAL NOUNS (from Intermediate German PDF)
// ============================================

export interface AdjectivalNoun {
    adjective: string;
    masculineNom: string;
    feminineNom: string;
    english: string;
    example: string;
    exampleTranslation: string;
}

export const adjectivalNouns: AdjectivalNoun[] = [
    { adjective: 'krank', masculineNom: 'ein Kranker', feminineNom: 'eine Kranke', english: 'sick person', example: 'Der Kranke liegt im Bett.', exampleTranslation: 'The sick person is lying in bed.' },
    { adjective: 'reich', masculineNom: 'ein Reicher', feminineNom: 'eine Reiche', english: 'rich person', example: 'Ein Reicher hat viel Geld.', exampleTranslation: 'A rich person has a lot of money.' },
    { adjective: 'verwandt', masculineNom: 'ein Verwandter', feminineNom: 'eine Verwandte', english: 'relative', example: 'Ein Verwandter von mir wohnt in Bonn.', exampleTranslation: 'A relative of mine lives in Bonn.' },
    { adjective: 'deutsch', masculineNom: 'ein Deutscher', feminineNom: 'eine Deutsche', english: 'German person', example: 'Eine Deutsche arbeitet hier.', exampleTranslation: 'A German woman works here.' },
    { adjective: 'angestellt', masculineNom: 'ein Angestellter', feminineNom: 'eine Angestellte', english: 'employee', example: 'Die Angestellte hilft den Kunden.', exampleTranslation: 'The employee helps the customers.' },
    { adjective: 'arbeitslos', masculineNom: 'ein Arbeitsloser', feminineNom: 'eine Arbeitslose', english: 'unemployed person', example: 'Ein Arbeitsloser sucht Arbeit.', exampleTranslation: 'An unemployed person is looking for work.' },
    { adjective: 'erwachsen', masculineNom: 'ein Erwachsener', feminineNom: 'eine Erwachsene', english: 'adult', example: 'Erwachsene zahlen mehr.', exampleTranslation: 'Adults pay more.' },
    { adjective: 'jugendlich', masculineNom: 'ein Jugendlicher', feminineNom: 'eine Jugendliche', english: 'young person', example: 'Jugendliche lernen schnell.', exampleTranslation: 'Young people learn quickly.' },
];

// ============================================
// CASE TABLE (from Intermediate German PDF)
// ============================================

export interface CaseEnding {
    case: 'nominative' | 'accusative' | 'dative' | 'genitive';
    masculine: string;
    feminine: string;
    neuter: string;
    plural: string;
}

export const definiteArticleCases: CaseEnding[] = [
    { case: 'nominative', masculine: 'der', feminine: 'die', neuter: 'das', plural: 'die' },
    { case: 'accusative', masculine: 'den', feminine: 'die', neuter: 'das', plural: 'die' },
    { case: 'dative', masculine: 'dem', feminine: 'der', neuter: 'dem', plural: 'den' },
    { case: 'genitive', masculine: 'des', feminine: 'der', neuter: 'des', plural: 'der' },
];

export const indefiniteArticleCases: CaseEnding[] = [
    { case: 'nominative', masculine: 'ein', feminine: 'eine', neuter: 'ein', plural: '-' },
    { case: 'accusative', masculine: 'einen', feminine: 'eine', neuter: 'ein', plural: '-' },
    { case: 'dative', masculine: 'einem', feminine: 'einer', neuter: 'einem', plural: '-' },
    { case: 'genitive', masculine: 'eines', feminine: 'einer', neuter: 'eines', plural: '-' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getGenderRulesByGender = (gender: 'der' | 'die' | 'das'): GenderRule[] => {
    return genderRules.filter(rule => rule.gender === gender);
};

export const getGenderRulesByLevel = (level: CEFRLevel): GenderRule[] => {
    return genderRules.filter(rule => rule.level === level);
};
