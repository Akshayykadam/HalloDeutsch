// Comprehensive Exercise Data - Interactive Learning Content
// Based on mein-deutschbuch.de exercise patterns: Einsetzübungen, Verbkonjugation, Sätze bilden

import { CEFRLevel } from '../../types';

// ============================================
// EXERCISE TYPES
// ============================================

export interface FillBlankExercise {
    type: 'fill-blank';
    id: string;
    level: CEFRLevel;
    topic: string;
    question: string;
    questionDe?: string;
    answer: string;
    hint?: string;
    distractors?: string[];
}

export interface MultipleChoiceExercise {
    type: 'multiple-choice';
    id: string;
    level: CEFRLevel;
    topic: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

export interface ConjugationExercise {
    type: 'conjugation';
    id: string;
    level: CEFRLevel;
    topic: string;
    verb: string;
    tense: 'present' | 'past' | 'perfect';
    pronoun: string;
    answer: string;
    hint?: string;
}

export interface TranslationExercise {
    type: 'translation';
    id: string;
    level: CEFRLevel;
    topic: string;
    germanSentence: string;
    englishTranslation: string;
    direction: 'de-en' | 'en-de';
}

export interface SentenceOrderExercise {
    type: 'sentence-order';
    id: string;
    level: CEFRLevel;
    topic: string;
    words: string[];
    correctOrder: string;
    translation: string;
}

export type Exercise = FillBlankExercise | MultipleChoiceExercise | ConjugationExercise | TranslationExercise | SentenceOrderExercise;

// ============================================
// A1 EXERCISES - VERB "SEIN" (Based on mein-deutschbuch.de)
// ============================================

export const seinExercises: FillBlankExercise[] = [
    // Present tense conjugation
    { type: 'fill-blank', id: 'sein-01', level: 'A1', topic: 'sein-conjugation', question: 'Ich ___ müde.', answer: 'bin', hint: 'ich = I' },
    { type: 'fill-blank', id: 'sein-02', level: 'A1', topic: 'sein-conjugation', question: 'Du ___ Student.', answer: 'bist', hint: 'du = you (informal)' },
    { type: 'fill-blank', id: 'sein-03', level: 'A1', topic: 'sein-conjugation', question: 'Er ___ Lehrer.', answer: 'ist', hint: 'er = he' },
    { type: 'fill-blank', id: 'sein-04', level: 'A1', topic: 'sein-conjugation', question: 'Sie ___ Ärztin.', answer: 'ist', hint: 'sie = she' },
    { type: 'fill-blank', id: 'sein-05', level: 'A1', topic: 'sein-conjugation', question: 'Wir ___ aus Deutschland.', answer: 'sind', hint: 'wir = we' },
    { type: 'fill-blank', id: 'sein-06', level: 'A1', topic: 'sein-conjugation', question: 'Ihr ___ nett.', answer: 'seid', hint: 'ihr = you (plural)' },
    { type: 'fill-blank', id: 'sein-07', level: 'A1', topic: 'sein-conjugation', question: 'Sie ___ Studenten.', answer: 'sind', hint: 'sie = they' },
    { type: 'fill-blank', id: 'sein-08', level: 'A1', topic: 'sein-conjugation', question: 'Das Kind ___ klein.', answer: 'ist', hint: 'das Kind = the child' },
    { type: 'fill-blank', id: 'sein-09', level: 'A1', topic: 'sein-conjugation', question: 'Meine Eltern ___ alt.', answer: 'sind', hint: 'plural subject' },
    { type: 'fill-blank', id: 'sein-10', level: 'A1', topic: 'sein-conjugation', question: '___ du krank?', answer: 'Bist', hint: 'question form' },

    // Professions (Berufe)
    { type: 'fill-blank', id: 'sein-11', level: 'A1', topic: 'professions', question: 'Ich ___ Arzt.', answer: 'bin', hint: 'No article with professions!' },
    { type: 'fill-blank', id: 'sein-12', level: 'A1', topic: 'professions', question: 'Sie ___ Lehrerin.', answer: 'ist', hint: 'Female profession' },
    { type: 'fill-blank', id: 'sein-13', level: 'A1', topic: 'professions', question: 'Er ___ Ingenieur.', answer: 'ist', hint: 'engineer' },
    { type: 'fill-blank', id: 'sein-14', level: 'A1', topic: 'professions', question: 'Mein Vater ___ Polizist.', answer: 'ist', hint: 'police officer' },
    { type: 'fill-blank', id: 'sein-15', level: 'A1', topic: 'professions', question: 'Wir ___ Studenten.', answer: 'sind', hint: 'students (plural)' },
];

// ============================================
// A1 EXERCISES - VERB "HABEN"
// ============================================

export const habenExercises: FillBlankExercise[] = [
    { type: 'fill-blank', id: 'haben-01', level: 'A1', topic: 'haben-conjugation', question: 'Ich ___ Hunger.', answer: 'habe', hint: 'ich = I' },
    { type: 'fill-blank', id: 'haben-02', level: 'A1', topic: 'haben-conjugation', question: 'Du ___ Zeit.', answer: 'hast', hint: 'du = you' },
    { type: 'fill-blank', id: 'haben-03', level: 'A1', topic: 'haben-conjugation', question: 'Er ___ ein Auto.', answer: 'hat', hint: 'er = he' },
    { type: 'fill-blank', id: 'haben-04', level: 'A1', topic: 'haben-conjugation', question: 'Wir ___ zwei Kinder.', answer: 'haben', hint: 'wir = we' },
    { type: 'fill-blank', id: 'haben-05', level: 'A1', topic: 'haben-conjugation', question: 'Ihr ___ Recht.', answer: 'habt', hint: 'ihr = you (plural)' },
    { type: 'fill-blank', id: 'haben-06', level: 'A1', topic: 'haben-conjugation', question: 'Sie ___ einen Hund.', answer: 'haben', hint: 'sie = they' },
    { type: 'fill-blank', id: 'haben-07', level: 'A1', topic: 'haben-conjugation', question: '___ du Geschwister?', answer: 'Hast', hint: 'question' },
    { type: 'fill-blank', id: 'haben-08', level: 'A1', topic: 'haben-conjugation', question: 'Mein Bruder ___ Geburtstag.', answer: 'hat', hint: 'birthday' },
    { type: 'fill-blank', id: 'haben-09', level: 'A1', topic: 'haben-conjugation', question: 'Ich ___ Durst.', answer: 'habe', hint: 'thirst' },
    { type: 'fill-blank', id: 'haben-10', level: 'A1', topic: 'haben-conjugation', question: 'Wir ___ Glück.', answer: 'haben', hint: 'luck' },
];

// ============================================
// A1 EXERCISES - REGULAR VERBS (machen, lernen, etc.)
// ============================================

export const regularVerbExercises: FillBlankExercise[] = [
    // machen
    { type: 'fill-blank', id: 'reg-01', level: 'A1', topic: 'regular-verbs', question: 'Ich ___ Hausaufgaben. (machen)', answer: 'mache', hint: '-e ending' },
    { type: 'fill-blank', id: 'reg-02', level: 'A1', topic: 'regular-verbs', question: 'Du ___ Sport. (machen)', answer: 'machst', hint: '-st ending' },
    { type: 'fill-blank', id: 'reg-03', level: 'A1', topic: 'regular-verbs', question: 'Er ___ Frühstück. (machen)', answer: 'macht', hint: '-t ending' },

    // lernen
    { type: 'fill-blank', id: 'reg-04', level: 'A1', topic: 'regular-verbs', question: 'Ich ___ Deutsch. (lernen)', answer: 'lerne', hint: '-e ending' },
    { type: 'fill-blank', id: 'reg-05', level: 'A1', topic: 'regular-verbs', question: 'Wir ___ zusammen. (lernen)', answer: 'lernen', hint: '-en ending' },
    { type: 'fill-blank', id: 'reg-06', level: 'A1', topic: 'regular-verbs', question: 'Er ___ Gitarre. (spielen)', answer: 'spielt', hint: '-t ending' },

    // wohnen
    { type: 'fill-blank', id: 'reg-07', level: 'A1', topic: 'regular-verbs', question: 'Ich ___ in Berlin. (wohnen)', answer: 'wohne', hint: 'residence' },
    { type: 'fill-blank', id: 'reg-08', level: 'A1', topic: 'regular-verbs', question: 'Wo ___ du? (wohnen)', answer: 'wohnst', hint: 'question word' },

    // arbeiten (special: -t stem needs extra -e-)
    { type: 'fill-blank', id: 'reg-09', level: 'A1', topic: 'regular-verbs', question: 'Er ___ bei Siemens. (arbeiten)', answer: 'arbeitet', hint: 'stem ends in -t' },
    { type: 'fill-blank', id: 'reg-10', level: 'A1', topic: 'regular-verbs', question: 'Du ___ zu viel. (arbeiten)', answer: 'arbeitest', hint: 'stem ends in -t' },
];

// ============================================
// A1 EXERCISES - ARTICLES (der, die, das)
// ============================================

export const articleExercises: MultipleChoiceExercise[] = [
    { type: 'multiple-choice', id: 'art-01', level: 'A1', topic: 'articles', question: '___ Mann ist groß.', options: ['Der', 'Die', 'Das'], correctIndex: 0, explanation: 'Mann is masculine' },
    { type: 'multiple-choice', id: 'art-02', level: 'A1', topic: 'articles', question: '___ Frau ist nett.', options: ['Der', 'Die', 'Das'], correctIndex: 1, explanation: 'Frau is feminine' },
    { type: 'multiple-choice', id: 'art-03', level: 'A1', topic: 'articles', question: '___ Kind spielt.', options: ['Der', 'Die', 'Das'], correctIndex: 2, explanation: 'Kind is neuter' },
    { type: 'multiple-choice', id: 'art-04', level: 'A1', topic: 'articles', question: '___ Hund bellt.', options: ['Der', 'Die', 'Das'], correctIndex: 0, explanation: 'Hund is masculine' },
    { type: 'multiple-choice', id: 'art-05', level: 'A1', topic: 'articles', question: '___ Katze schläft.', options: ['Der', 'Die', 'Das'], correctIndex: 1, explanation: 'Katze is feminine' },
    { type: 'multiple-choice', id: 'art-06', level: 'A1', topic: 'articles', question: '___ Buch ist interessant.', options: ['Der', 'Die', 'Das'], correctIndex: 2, explanation: 'Buch is neuter' },
    { type: 'multiple-choice', id: 'art-07', level: 'A1', topic: 'articles', question: '___ Auto fährt schnell.', options: ['Der', 'Die', 'Das'], correctIndex: 2, explanation: 'Auto is neuter' },
    { type: 'multiple-choice', id: 'art-08', level: 'A1', topic: 'articles', question: '___ Tisch ist braun.', options: ['Der', 'Die', 'Das'], correctIndex: 0, explanation: 'Tisch is masculine' },
    { type: 'multiple-choice', id: 'art-09', level: 'A1', topic: 'articles', question: '___ Lampe ist hell.', options: ['Der', 'Die', 'Das'], correctIndex: 1, explanation: 'Lampe is feminine' },
    { type: 'multiple-choice', id: 'art-10', level: 'A1', topic: 'articles', question: '___ Fenster ist offen.', options: ['Der', 'Die', 'Das'], correctIndex: 2, explanation: 'Fenster is neuter' },
];

// ============================================
// A1 EXERCISES - NEGATION (nicht / kein)
// ============================================

export const negationExercises: FillBlankExercise[] = [
    { type: 'fill-blank', id: 'neg-01', level: 'A1', topic: 'negation', question: 'Ich habe ___ Auto. (no car)', answer: 'kein', hint: 'kein for nouns with ein' },
    { type: 'fill-blank', id: 'neg-02', level: 'A1', topic: 'negation', question: 'Das ist ___ richtig. (not correct)', answer: 'nicht', hint: 'nicht for adjectives' },
    { type: 'fill-blank', id: 'neg-03', level: 'A1', topic: 'negation', question: 'Er kommt ___ . (not coming)', answer: 'nicht', hint: 'nicht for verbs' },
    { type: 'fill-blank', id: 'neg-04', level: 'A1', topic: 'negation', question: 'Ich habe ___ Zeit. (no time)', answer: 'keine', hint: 'Zeit is feminine' },
    { type: 'fill-blank', id: 'neg-05', level: 'A1', topic: 'negation', question: 'Wir essen ___ Fleisch. (no meat)', answer: 'kein', hint: 'Fleisch is neuter' },
    { type: 'fill-blank', id: 'neg-06', level: 'A1', topic: 'negation', question: 'Sie ist ___ müde. (not tired)', answer: 'nicht', hint: 'nicht for adjectives' },
    { type: 'fill-blank', id: 'neg-07', level: 'A1', topic: 'negation', question: 'Ich trinke ___ Bier. (no beer)', answer: 'kein', hint: 'Bier is neuter' },
    { type: 'fill-blank', id: 'neg-08', level: 'A1', topic: 'negation', question: 'Das Wasser ist ___ kalt. (not cold)', answer: 'nicht', hint: 'nicht before adjective' },
];

// ============================================
// A2 EXERCISES - PERFEKT (Past Tense)
// ============================================

export const perfektExercises: FillBlankExercise[] = [
    // Regular verbs with haben
    { type: 'fill-blank', id: 'perf-01', level: 'A2', topic: 'perfekt', question: 'Ich habe Deutsch ___. (lernen)', answer: 'gelernt', hint: 'ge- + stem + -t' },
    { type: 'fill-blank', id: 'perf-02', level: 'A2', topic: 'perfekt', question: 'Er hat das Buch ___. (kaufen)', answer: 'gekauft', hint: 'ge- + stem + -t' },
    { type: 'fill-blank', id: 'perf-03', level: 'A2', topic: 'perfekt', question: 'Wir haben Pizza ___. (machen)', answer: 'gemacht', hint: 'ge- + stem + -t' },
    { type: 'fill-blank', id: 'perf-04', level: 'A2', topic: 'perfekt', question: 'Sie hat viel ___. (arbeiten)', answer: 'gearbeitet', hint: 'stem in -t: ge- + stem + -et' },

    // Irregular verbs with haben
    { type: 'fill-blank', id: 'perf-05', level: 'A2', topic: 'perfekt', question: 'Ich habe das Buch ___. (lesen)', answer: 'gelesen', hint: 'irregular: lesen → gelesen' },
    { type: 'fill-blank', id: 'perf-06', level: 'A2', topic: 'perfekt', question: 'Er hat Pizza ___. (essen)', answer: 'gegessen', hint: 'irregular: essen → gegessen' },
    { type: 'fill-blank', id: 'perf-07', level: 'A2', topic: 'perfekt', question: 'Wir haben Deutsch ___. (sprechen)', answer: 'gesprochen', hint: 'irregular' },
    { type: 'fill-blank', id: 'perf-08', level: 'A2', topic: 'perfekt', question: 'Sie hat den Film ___. (sehen)', answer: 'gesehen', hint: 'irregular' },

    // Movement verbs with sein
    { type: 'fill-blank', id: 'perf-09', level: 'A2', topic: 'perfekt-sein', question: 'Ich bin nach Berlin ___. (fahren)', answer: 'gefahren', hint: 'sein + movement' },
    { type: 'fill-blank', id: 'perf-10', level: 'A2', topic: 'perfekt-sein', question: 'Er ist nach Hause ___. (gehen)', answer: 'gegangen', hint: 'sein + movement' },
    { type: 'fill-blank', id: 'perf-11', level: 'A2', topic: 'perfekt-sein', question: 'Sie ist schnell ___. (laufen)', answer: 'gelaufen', hint: 'sein + movement' },
    { type: 'fill-blank', id: 'perf-12', level: 'A2', topic: 'perfekt-sein', question: 'Wir sind spät ___. (kommen)', answer: 'gekommen', hint: 'sein + movement' },

    // Verbs with -ieren (no ge-)
    { type: 'fill-blank', id: 'perf-13', level: 'A2', topic: 'perfekt', question: 'Ich habe Musik ___. (studieren)', answer: 'studiert', hint: '-ieren → -iert (no ge-)' },
    { type: 'fill-blank', id: 'perf-14', level: 'A2', topic: 'perfekt', question: 'Er hat mich ___. (fotografieren)', answer: 'fotografiert', hint: '-ieren → -iert' },
    { type: 'fill-blank', id: 'perf-15', level: 'A2', topic: 'perfekt', question: 'Sie hat das Problem ___. (reparieren)', answer: 'repariert', hint: '-ieren → -iert' },
];

// ============================================
// A2 EXERCISES - MODAL VERBS
// ============================================

export const modalVerbExercises: FillBlankExercise[] = [
    // können
    { type: 'fill-blank', id: 'mod-01', level: 'A2', topic: 'modal-verbs', question: 'Ich ___ Deutsch sprechen. (können)', answer: 'kann', hint: 'ability' },
    { type: 'fill-blank', id: 'mod-02', level: 'A2', topic: 'modal-verbs', question: '___ du schwimmen? (können)', answer: 'Kannst', hint: 'question' },
    { type: 'fill-blank', id: 'mod-03', level: 'A2', topic: 'modal-verbs', question: 'Er ___ nicht kommen. (können)', answer: 'kann', hint: 'ich/er same' },

    // müssen
    { type: 'fill-blank', id: 'mod-04', level: 'A2', topic: 'modal-verbs', question: 'Ich ___ arbeiten. (müssen)', answer: 'muss', hint: 'obligation' },
    { type: 'fill-blank', id: 'mod-05', level: 'A2', topic: 'modal-verbs', question: 'Du ___ lernen. (müssen)', answer: 'musst', hint: 'necessity' },
    { type: 'fill-blank', id: 'mod-06', level: 'A2', topic: 'modal-verbs', question: 'Wir ___ gehen. (müssen)', answer: 'müssen', hint: 'wir/sie same' },

    // wollen
    { type: 'fill-blank', id: 'mod-07', level: 'A2', topic: 'modal-verbs', question: 'Ich ___ nach Hause. (wollen)', answer: 'will', hint: 'desire' },
    { type: 'fill-blank', id: 'mod-08', level: 'A2', topic: 'modal-verbs', question: 'Was ___ du essen? (wollen)', answer: 'willst', hint: 'intention' },

    // dürfen
    { type: 'fill-blank', id: 'mod-09', level: 'A2', topic: 'modal-verbs', question: '___ ich fragen? (dürfen)', answer: 'Darf', hint: 'permission' },
    { type: 'fill-blank', id: 'mod-10', level: 'A2', topic: 'modal-verbs', question: 'Hier ___ man nicht rauchen. (dürfen)', answer: 'darf', hint: 'prohibition' },

    // sollen
    { type: 'fill-blank', id: 'mod-11', level: 'A2', topic: 'modal-verbs', question: 'Du ___ mehr lernen. (sollen)', answer: 'sollst', hint: 'should' },
    { type: 'fill-blank', id: 'mod-12', level: 'A2', topic: 'modal-verbs', question: 'Was ___ ich machen? (sollen)', answer: 'soll', hint: 'advice' },
];

// ============================================
// A2 EXERCISES - DATIVE CASE
// ============================================

export const dativeExercises: FillBlankExercise[] = [
    // Dative articles
    { type: 'fill-blank', id: 'dat-01', level: 'A2', topic: 'dative', question: 'Ich gebe ___ Mann das Buch. (der)', answer: 'dem', hint: 'der → dem' },
    { type: 'fill-blank', id: 'dat-02', level: 'A2', topic: 'dative', question: 'Er hilft ___ Frau. (die)', answer: 'der', hint: 'die → der' },
    { type: 'fill-blank', id: 'dat-03', level: 'A2', topic: 'dative', question: 'Ich danke ___ Kind. (das)', answer: 'dem', hint: 'das → dem' },
    { type: 'fill-blank', id: 'dat-04', level: 'A2', topic: 'dative', question: 'Er hilft ___ Kindern. (die - plural)', answer: 'den', hint: 'plural + n' },

    // Dative pronouns
    { type: 'fill-blank', id: 'dat-05', level: 'A2', topic: 'dative', question: 'Ich gebe ___ das Buch. (du)', answer: 'dir', hint: 'du → dir' },
    { type: 'fill-blank', id: 'dat-06', level: 'A2', topic: 'dative', question: 'Das Buch gehört ___. (ich)', answer: 'mir', hint: 'ich → mir' },
    { type: 'fill-blank', id: 'dat-07', level: 'A2', topic: 'dative', question: 'Ich helfe ___. (er)', answer: 'ihm', hint: 'er → ihm' },
    { type: 'fill-blank', id: 'dat-08', level: 'A2', topic: 'dative', question: 'Er schenkt ___ Blumen. (sie - singular)', answer: 'ihr', hint: 'sie → ihr' },

    // Dative prepositions
    { type: 'fill-blank', id: 'dat-09', level: 'A2', topic: 'dative-prep', question: 'Ich komme aus ___ Schweiz. (die)', answer: 'der', hint: 'aus + dative' },
    { type: 'fill-blank', id: 'dat-10', level: 'A2', topic: 'dative-prep', question: 'Er wohnt bei ___ Mutter. (seine)', answer: 'seiner', hint: 'bei + dative' },
    { type: 'fill-blank', id: 'dat-11', level: 'A2', topic: 'dative-prep', question: 'Wir fahren mit ___ Zug. (der)', answer: 'dem', hint: 'mit + dative' },
    { type: 'fill-blank', id: 'dat-12', level: 'A2', topic: 'dative-prep', question: 'Nach ___ Essen gehen wir. (das)', answer: 'dem', hint: 'nach + dative' },
];

// ============================================
// B1 EXERCISES - KONJUNKTIV II
// ============================================

export const konjunktivExercises: FillBlankExercise[] = [
    // würde + infinitive
    { type: 'fill-blank', id: 'konj-01', level: 'B1', topic: 'konjunktiv-ii', question: 'Ich ___ gern helfen. (würde)', answer: 'würde', hint: 'würde + infinitive' },
    { type: 'fill-blank', id: 'konj-02', level: 'B1', topic: 'konjunktiv-ii', question: 'Er ___ gern kommen. (würde)', answer: 'würde', hint: 'würde for er/sie/es' },
    { type: 'fill-blank', id: 'konj-03', level: 'B1', topic: 'konjunktiv-ii', question: 'Wir ___ gern reisen. (würde)', answer: 'würden', hint: 'würden for wir/sie' },

    // hätte, wäre, könnte
    { type: 'fill-blank', id: 'konj-04', level: 'B1', topic: 'konjunktiv-ii', question: 'Wenn ich Zeit ___... (haben)', answer: 'hätte', hint: 'haben → hätte' },
    { type: 'fill-blank', id: 'konj-05', level: 'B1', topic: 'konjunktiv-ii', question: 'Wenn ich reich ___... (sein)', answer: 'wäre', hint: 'sein → wäre' },
    { type: 'fill-blank', id: 'konj-06', level: 'B1', topic: 'konjunktiv-ii', question: '___ Sie mir helfen? (können)', answer: 'Könnten', hint: 'können → könnten' },
    { type: 'fill-blank', id: 'konj-07', level: 'B1', topic: 'konjunktiv-ii', question: '___ Sie Zeit? (haben - polite)', answer: 'Hätten', hint: 'polite request' },
    { type: 'fill-blank', id: 'konj-08', level: 'B1', topic: 'konjunktiv-ii', question: 'Ich ___ gern Arzt. (sein)', answer: 'wäre', hint: 'wish' },
];

// ============================================
// B1 EXERCISES - PASSIVE VOICE
// ============================================

export const passiveExercises: FillBlankExercise[] = [
    // Present passive
    { type: 'fill-blank', id: 'pass-01', level: 'B1', topic: 'passive', question: 'Das Haus ___ gebaut. (werden)', answer: 'wird', hint: 'present passive' },
    { type: 'fill-blank', id: 'pass-02', level: 'B1', topic: 'passive', question: 'Die Briefe ___ geschrieben. (werden)', answer: 'werden', hint: 'plural' },
    { type: 'fill-blank', id: 'pass-03', level: 'B1', topic: 'passive', question: 'Das Auto ___ repariert. (werden)', answer: 'wird', hint: 'singular' },

    // Past passive
    { type: 'fill-blank', id: 'pass-04', level: 'B1', topic: 'passive', question: 'Das Buch ___ gelesen. (wurde)', answer: 'wurde', hint: 'past passive' },
    { type: 'fill-blank', id: 'pass-05', level: 'B1', topic: 'passive', question: 'Die Gebäude ___ 1990 gebaut. (wurde - plural)', answer: 'wurden', hint: 'past plural' },

    // Modal + passive
    { type: 'fill-blank', id: 'pass-06', level: 'B1', topic: 'passive', question: 'Das muss gemacht ___. (werden)', answer: 'werden', hint: 'modal + passive' },
    { type: 'fill-blank', id: 'pass-07', level: 'B1', topic: 'passive', question: 'Es kann nicht geändert ___. (werden)', answer: 'werden', hint: 'modal + passive' },
];

// ============================================
// SENTENCE ORDER EXERCISES
// ============================================

export const sentenceOrderExercises: SentenceOrderExercise[] = [
    { type: 'sentence-order', id: 'ord-01', level: 'A1', topic: 'word-order', words: ['Ich', 'Deutsch', 'lerne'], correctOrder: 'Ich lerne Deutsch.', translation: 'I learn German.' },
    { type: 'sentence-order', id: 'ord-02', level: 'A1', topic: 'word-order', words: ['Er', 'nach', 'Hause', 'geht'], correctOrder: 'Er geht nach Hause.', translation: 'He goes home.' },
    { type: 'sentence-order', id: 'ord-03', level: 'A1', topic: 'word-order', words: ['Heute', 'ich', 'esse', 'Pizza'], correctOrder: 'Heute esse ich Pizza.', translation: 'Today I eat pizza.' },
    { type: 'sentence-order', id: 'ord-04', level: 'A2', topic: 'word-order', words: ['Ich', 'habe', 'Deutsch', 'gelernt'], correctOrder: 'Ich habe Deutsch gelernt.', translation: 'I learned German.' },
    { type: 'sentence-order', id: 'ord-05', level: 'A2', topic: 'word-order', words: ['weil', 'ich', 'krank', 'bin'], correctOrder: '...weil ich krank bin.', translation: '...because I am sick.' },
];

// ============================================
// EXPORT ALL EXERCISES
// ============================================

export const allExercises: Exercise[] = [
    ...seinExercises,
    ...habenExercises,
    ...regularVerbExercises,
    ...articleExercises,
    ...negationExercises,
    ...perfektExercises,
    ...modalVerbExercises,
    ...dativeExercises,
    ...konjunktivExercises,
    ...passiveExercises,
    ...sentenceOrderExercises,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getExercisesByLevel = (level: CEFRLevel): Exercise[] => {
    return allExercises.filter(ex => ex.level === level);
};

export const getExercisesByTopic = (topic: string): Exercise[] => {
    return allExercises.filter(ex => ex.topic === topic);
};

export const getExercisesByType = (type: Exercise['type']): Exercise[] => {
    return allExercises.filter(ex => ex.type === type);
};

export const getRandomExercises = (level: CEFRLevel, count: number): Exercise[] => {
    const levelExercises = getExercisesByLevel(level);
    const shuffled = [...levelExercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const exerciseStats = {
    total: allExercises.length,
    byLevel: {
        A1: allExercises.filter(ex => ex.level === 'A1').length,
        A2: allExercises.filter(ex => ex.level === 'A2').length,
        B1: allExercises.filter(ex => ex.level === 'B1').length,
        B2: allExercises.filter(ex => ex.level === 'B2').length,
    },
    byType: {
        'fill-blank': allExercises.filter(ex => ex.type === 'fill-blank').length,
        'multiple-choice': allExercises.filter(ex => ex.type === 'multiple-choice').length,
        'sentence-order': allExercises.filter(ex => ex.type === 'sentence-order').length,
    },
};
