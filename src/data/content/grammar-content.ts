
import { CEFRLevel } from '../../types';

export interface GrammarTable {
    title: string;
    headers: string[];
    rows: string[][];
}

export interface GrammarTopic {
    id: string;
    title: string;
    titleDe: string;
    description: string;
    level: CEFRLevel;
    order?: number;
    lessons: number;
    completedLessons: number;
    examples: Array<{ german: string; english: string }>;
    // Structured content fields
    explanation?: string;
    keyRules?: string[];
    tips?: string[];
    commonMistakes?: string[];
    tables?: GrammarTable[];
}

export const grammarTopics: GrammarTopic[] = [
    // A1 Topics
    {
        id: 'a1-articles',
        title: 'Articles (der, die, das)',
        titleDe: 'Artikel',
        description: 'Learn the three genders in German and when to use each article. German nouns are either masculine (der), feminine (die), or neuter (das).',
        level: 'A1',
        order: 1,
        lessons: 5,
        completedLessons: 0,
        explanation: `In German, every noun has a gender: masculine, feminine, or neuter. Unlike English, you must learn the gender with each noun.

The Three Articles:
• der = masculine (der Mann, der Tisch)
• die = feminine (die Frau, die Lampe)  
• das = neuter (das Kind, das Buch)

Why it matters: The article affects adjective endings, pronouns, and case endings throughout German grammar.`,
        keyRules: [
            'Always learn the article with the noun (das Haus, not just Haus)',
            'Most nouns ending in -ung, -heit, -keit are feminine',
            'Most nouns ending in -chen, -lein are neuter',
            'Days, months, seasons are masculine (der Montag, der Januar)',
        ],
        tips: [
            '🎯 Use flashcards with colors: blue=der, pink=die, green=das',
            '🔊 Say the article out loud when learning new words',
            '📱 Practice daily with our vocabulary exercises',
        ],
        commonMistakes: [
            '❌ "die Mädchen" → ✅ "das Mädchen" (words ending in -chen are always neuter)',
            '❌ Guessing based on meaning → Gender is grammatical, not logical',
        ],
        examples: [
            { german: 'der Mann', english: 'the man (masculine)' },
            { german: 'die Frau', english: 'the woman (feminine)' },
            { german: 'das Kind', english: 'the child (neuter)' },
            { german: 'der Apfel', english: 'the apple (masculine)' },
            { german: 'die Sonne', english: 'the sun (feminine)' },
            { german: 'das Haus', english: 'the house (neuter)' },
            { german: 'der Hund', english: 'the dog (masculine)' },
            { german: 'die Katze', english: 'the cat (feminine)' },
            { german: 'das Buch', english: 'the book (neuter)' },
        ],
    },
    {
        id: 'a1-present-tense',
        title: 'Present Tense',
        titleDe: 'Präsens',
        description: 'Conjugate verbs in present tense for all persons. Regular verbs follow a predictable pattern.',
        level: 'A1',
        order: 2,
        lessons: 6,
        completedLessons: 0,
        explanation: `The present tense (Präsens) is used to describe current actions, habits, and general truths. German verbs change their endings based on the subject.

To conjugate, remove -en from the infinitive to get the stem, then add the appropriate ending.`,
        tables: [
            {
                title: 'Regular Verb Pattern (lernen)',
                headers: ['Person', 'Ending', 'Example'],
                rows: [
                    ['ich', '-e', 'ich lerne'],
                    ['du', '-st', 'du lernst'],
                    ['er/sie/es', '-t', 'er lernt'],
                    ['wir', '-en', 'wir lernen'],
                    ['ihr', '-t', 'ihr lernt'],
                    ['sie/Sie', '-en', 'sie lernen'],
                ],
            },
        ],
        keyRules: [
            'Remove -en from infinitive to get the stem (lernen → lern-)',
            'Add the appropriate ending for each person',
            'Some verbs have stem changes (e→i, e→ie, a→ä)',
            'sein and haben are irregular - memorize them!',
        ],
        tips: [
            '🔄 Practice conjugating 3 new verbs daily',
            '🎵 Make up songs with conjugation patterns',
            '✍️ Write simple sentences about your daily routine',
        ],
        commonMistakes: [
            '❌ "Ich lernen" → ✅ "Ich lerne" (first person needs -e)',
            '❌ "Du gehst" with stem-changing verbs → Check if verb changes!',
        ],
        examples: [
            { german: 'Ich lerne Deutsch.', english: 'I am learning German.' },
            { german: 'Er spricht gut.', english: 'He speaks well.' },
            { german: 'Wir gehen nach Hause.', english: 'We are going home.' },
            { german: 'Sie trinkt Wasser.', english: 'She is drinking water.' },
            { german: 'Du wohnst in Berlin.', english: 'You live in Berlin.' },
            { german: 'Ihr spielt Fußball.', english: 'You (plural) are playing soccer.' },
            { german: 'Das Kind schläft.', english: 'The child is sleeping.' },
        ],
    },
    {
        id: 'a1-negation',
        title: 'Negation (nicht/kein)',
        titleDe: 'Verneinung',
        description: 'Learn how to make negative sentences in German using "nicht" (not) and "kein" (no/none).',
        level: 'A1',
        order: 3,
        lessons: 3,
        completedLessons: 0,
        explanation: `German has two main ways to negate: nicht and kein. Choosing the right one depends on what you're negating.

nicht = negates verbs, adjectives, adverbs, and specific nouns
kein = negates indefinite nouns (replaces ein/eine)

nicht Position:
• Usually at the end of the sentence
• Before adjectives, adverbs, and prepositional phrases
• Before the part being specifically negated`,
        keyRules: [
            'Use "kein" instead of "nicht ein" (Ich habe kein Auto)',
            '"nicht" goes at the end for general negation',
            '"nicht" goes before what you specifically negate',
            '"kein" follows the same endings as "ein" (keine, keinen, etc.)',
        ],
        tips: [
            '💡 If you could say "not a/any" in English → use kein',
            '💡 If you could say "not" + verb/adjective → use nicht',
            '🔊 Listen for nicht/kein in German songs and videos',
        ],
        commonMistakes: [
            '❌ "Ich habe nicht Auto" → ✅ "Ich habe kein Auto"',
            '❌ "Das ist kein richtig" → ✅ "Das ist nicht richtig" (adjective)',
        ],
        examples: [
            { german: 'Ich habe kein Auto.', english: "I don't have a car." },
            { german: 'Das ist nicht richtig.', english: "That's not correct." },
            { german: 'Er kommt nicht.', english: 'He is not coming.' },
            { german: 'Wir essen kein Fleisch.', english: 'We do not eat meat.' },
            { german: 'Das Wasser ist nicht kalt.', english: 'The water is not cold.' },
            { german: 'Ich habe keine Zeit.', english: 'I have no time.' },
            { german: 'Sie ist nicht müde.', english: 'She is not tired.' },
        ],
    },
    {
        id: 'a1-sentence-structure',
        title: 'Sentence Structure',
        titleDe: 'Satzbau',
        description: 'Basic German word order in statements and questions. The verb is usually in the second position.',
        level: 'A1',
        order: 4,
        lessons: 4,
        completedLessons: 0,
        explanation: `German word order follows strict rules, but the most important one is: the verb goes in the second position in main clauses.

Statement Structure:
Position 1 (Subject/Time/Place) + Position 2 (VERB) + Rest of sentence

Examples:
• Ich *gehe* heute ins Kino. (I go to the cinema today.)
• Heute *gehe* ich ins Kino. (Today I go to the cinema.)

Notice how "ich" moves when "heute" takes the first position - but the verb *stays in position 2*!

Question Structure:
• Yes/No questions: Verb comes FIRST → *Gehst* du heute?
• W-questions: Question word + Verb → *Wo* wohnst du?`,
        keyRules: [
            'The conjugated verb ALWAYS goes in position 2 in statements',
            'Only ONE element can be in position 1 (subject, time, or place)',
            'Time-Manner-Place order for adverbs: Wann? Wie? Wo?',
            'Yes/No questions: verb first, then subject',
            'W-questions (Wer, Was, Wo, Wann, Wie): W-word + verb + subject',
        ],
        tips: [
            '🎯 Count positions on your fingers: 1 (subject) - 2 (VERB) - 3, 4, 5...',
            '📝 Practice by flipping the first element and keeping verb in position 2',
            '🔊 Listen to native speakers - verb position becomes natural!',
        ],
        commonMistakes: [
            '❌ "Heute ich gehe..." → ✅ "Heute gehe ich..." (verb must be 2nd)',
            '❌ "Ich gehe heute nicht ins Kino" → Word order issues with negation',
            '❌ "Du gehst wo?" → ✅ "Wo gehst du?" (W-word starts W-questions)',
        ],
        examples: [
            { german: 'Ich gehe heute ins Kino.', english: "I'm going to the cinema today." },
            { german: 'Gehst du heute ins Kino?', english: 'Are you going to the cinema today?' },
            { german: 'Wir lernen Deutsch in der Schule.', english: 'We learn German at school.' },
            { german: 'Wo wohnst du?', english: 'Where do you live?' },
            { german: 'Er spielt heute Fußball.', english: 'He is playing soccer today.' },
            { german: 'Wann kommt der Bus?', english: 'When is the bus coming?' },
            { german: 'Sie trinkt morgens Kaffee.', english: 'She drinks coffee in the morning.' },
            { german: 'Heute lerne ich Deutsch.', english: 'Today I am learning German.' },
        ],
    },
    {
        id: 'a1-m5-review',
        title: 'Verb Conjugation & Word Order',
        titleDe: 'Konjugation und Satzstellung',
        description: 'Review of regular verbs, stem-changing verbs, and sentence structure.',
        level: 'A1',
        order: 5,
        lessons: 1,
        completedLessons: 0,
        explanation: `This review covers the essential verb conjugation patterns and sentence structure rules you've learned in A1.

Regular Verb Conjugation:
Most German verbs follow a predictable pattern. Remove -en from the infinitive to get the stem, then add endings:
• ich -e, du -st, er/sie/es -t
• wir -en, ihr -t, sie/Sie -en

Stem-Changing Verbs:
Some verbs change their stem vowel in the du and er/sie/es forms:
• e → i: sprechen → du sprichst, er spricht
• e → ie: sehen → du siehst, er sieht
• a → ä: fahren → du fährst, er fährt
• au → äu: laufen → du läufst, er läuft

Word Order:
In German statements, the conjugated verb is always in position 2.
• Normal: Ich lerne Deutsch.
• Time first: Heute lerne ich Deutsch. (verb still position 2!)`,
        keyRules: [
            'Remove -en from infinitive to get the stem',
            'Add correct ending based on subject (ich -e, du -st, etc.)',
            'Stem-changing verbs only change in du and er/sie/es forms',
            'The verb is ALWAYS in position 2 in statements',
            'In yes/no questions, the verb comes first',
        ],
        tips: [
            'Practice conjugating 5 verbs daily until it becomes automatic',
            'Make flashcards with stem-changing verbs - they need extra memorization',
            'When in doubt about word order, find the verb and count: it should be position 2',
            'Common stem-changers to know: sprechen, sehen, lesen, fahren, schlafen, laufen',
        ],
        commonMistakes: [
            'Forgetting stem changes: "Er sprecht" ❌ → "Er spricht" ✓',
            'Wrong word order: "Heute ich lerne" ❌ → "Heute lerne ich" ✓',
            'Mixing up endings: "Du machst, er macht" (both have -t but for different reasons)',
            'Applying stem changes to wir/ihr/sie forms (only du and er/sie/es change!)',
        ],
        examples: [
            { german: 'Ich mache meine Hausaufgaben.', english: 'I am doing my homework.' },
            { german: 'Du fährst nach Berlin.', english: 'You drive to Berlin.' },
            { german: 'Er liest ein Buch.', english: 'He reads a book.' },
            { german: 'Wir spielen Fußball.', english: 'We play soccer.' },
            { german: 'Ihr lernt Deutsch.', english: 'You (all) learn German.' },
            { german: 'Sie schlafen lange.', english: 'They sleep for a long time.' },
            { german: 'Heute koche ich.', english: 'Today I am cooking.' },
            { german: 'Sprichst du Englisch?', english: 'Do you speak English?' },
            { german: 'Ich esse gern Pizza.', english: 'I like eating pizza.' },
            { german: 'Er sieht fern.', english: 'He watches TV.' },
            { german: 'Wir gehen ins Kino.', english: 'We are going to the cinema.' },
            { german: 'Wann kommst du?', english: 'When are you coming?' },
            { german: 'Das Mädchen läuft schnell.', english: 'The girl runs fast.' },
            { german: 'Ich trinke Wasser.', english: 'I drink water.' },
            { german: 'Arbeitest du heute?', english: 'Are you working today?' },
        ],
    },
    // A2 Topics
    {
        id: 'a2-perfekt',
        title: 'Perfect Tense (Perfekt)',
        titleDe: 'Perfekt',
        description: 'Talk about past events using haben/sein + past participle.',
        level: 'A2',
        lessons: 8,
        completedLessons: 0,
        explanation: `The Perfekt is the most common past tense in spoken German. It is formed with a helper verb (haben or sein) + past participle (Partizip II).

Structure:
Subject + haben/sein (conjugated) + ... + Past Participle

When to use haben:
• Most verbs (transitive verbs, reflexive verbs)
• Ich habe gegessen. (I have eaten.)

When to use sein:
• Movement verbs: gehen, fahren, fliegen, kommen, laufen
• State change verbs: werden, sterben, einschlafen
• sein, bleiben, passieren`,
        keyRules: [
            'Regular past participle: ge- + stem + -t (machen → gemacht)',
            'Irregular past participle: ge- + stem change + -en (sehen → gesehen)',
            'Verbs with -ieren: no ge- (studieren → studiert)',
            'Separable verbs: ge- goes between prefix (aufgemacht)',
            'Inseparable prefixes (be-, er-, ver-): no ge- (verstanden)',
        ],
        tips: [
            '🚗 Motion = sein: gehen, fahren, fliegen, laufen, kommen',
            '🔄 Practice "haben" verbs first - they are more common',
            '📝 Make a list of common irregular participles and memorize them',
        ],
        commonMistakes: [
            '❌ "Ich habe gegangen" → ✅ "Ich bin gegangen" (gehen uses sein)',
            '❌ "Ich bin gegessen" → ✅ "Ich habe gegessen" (essen uses haben)',
            '❌ Forgetting ge- on regular verbs',
        ],
        examples: [
            { german: 'Ich habe gegessen.', english: 'I have eaten.' },
            { german: 'Sie ist gefahren.', english: 'She has driven/gone.' },
            { german: 'Wir haben Deutsch gelernt.', english: 'We have learned German.' },
            { german: 'Er ist nach Berlin geflogen.', english: 'He has flown to Berlin.' },
            { german: 'Hast du das verstanden?', english: 'Did you understand that?' },
            { german: 'Sie sind spät gekommen.', english: 'They came late.' },
        ],
    },
    {
        id: 'a2-dative',
        title: 'Dative Case',
        titleDe: 'Dativ',
        description: 'Learn the dative case for indirect objects.',
        level: 'A2',
        lessons: 6,
        completedLessons: 0,
        explanation: `The dative case (Dativ) is used for indirect objects - the person or thing that receives something.

When to use Dative:
• Indirect objects (Ich gebe dem Mann das Buch)
• After dative prepositions: aus, bei, mit, nach, seit, von, zu
• After dative verbs: helfen, danken, gehören, gefallen`,
        tables: [
            {
                title: 'Dative Article Changes',
                headers: ['Gender', 'Nominative', 'Dative'],
                rows: [
                    ['masculine', 'der', 'dem'],
                    ['feminine', 'die', 'der'],
                    ['neuter', 'das', 'dem'],
                    ['plural', 'die', 'den (+n)'],
                ],
            },
        ],
        keyRules: [
            'der/das → dem (masculine/neuter dative)',
            'die → der (feminine dative)',
            'Plural adds -n to the noun if it does not already end in -n',
            'Dative prepositions: aus, außer, bei, mit, nach, seit, von, zu',
            'Some verbs ALWAYS take dative: helfen, danken, gefallen, gehören',
        ],
        tips: [
            '🎯 Remember "FABVMANS" - aus, außer, bei, mit, nach, seit, von, zu (+ dative)',
            '📝 Practice with "geben" - it always has dative (to whom?) + accusative (what?)',
            '🔄 Word order: Dative usually comes before Accusative',
        ],
        commonMistakes: [
            '❌ "Ich helfe der Mann" → ✅ "Ich helfe dem Mann" (helfen takes dative)',
            '❌ "mit die Frau" → ✅ "mit der Frau" (mit requires dative)',
            '❌ Forgetting -n on plural nouns in dative',
        ],
        examples: [
            { german: 'Ich gebe dem Mann das Buch.', english: 'I give the man the book.' },
            { german: 'Sie hilft der Frau.', english: 'She helps the woman.' },
            { german: 'Er dankt dem Lehrer.', english: 'He thanks the teacher.' },
            { german: 'Ich komme mit den Kindern.', english: 'I am coming with the children.' },
            { german: 'Das Buch gehört mir.', english: 'The book belongs to me.' },
            { german: 'Nach dem Essen gehen wir.', english: 'After the meal we go.' },
        ],
    },

    {
        id: 'a2-modal-verbs',
        title: 'Modal Verbs',
        titleDe: 'Modalverben',
        description: 'Express ability, permission, obligation, and wishes with German modal verbs.',
        level: 'A2',
        order: 3,
        lessons: 5,
        completedLessons: 0,
        explanation: `Modal verbs modify the meaning of the main verb. They express ability, permission, obligation, or wishes.

The 6 German modal verbs:
• können - can, to be able to
• müssen - must, have to
• wollen - want to
• sollen - should, supposed to
• dürfen - may, to be allowed to
• mögen/möchten - like / would like

Sentence structure:
Modal verb (conjugated, position 2) + ... + Infinitive (at the end)
Ich kann Deutsch sprechen. (I can speak German.)`,
        tables: [
            {
                title: 'Modal Verb Conjugation',
                headers: ['', 'können', 'müssen', 'wollen', 'dürfen', 'sollen'],
                rows: [
                    ['ich', 'kann', 'muss', 'will', 'darf', 'soll'],
                    ['du', 'kannst', 'musst', 'willst', 'darfst', 'sollst'],
                    ['er/sie/es', 'kann', 'muss', 'will', 'darf', 'soll'],
                    ['wir', 'können', 'müssen', 'wollen', 'dürfen', 'sollen'],
                    ['ihr', 'könnt', 'müsst', 'wollt', 'dürft', 'sollt'],
                    ['sie/Sie', 'können', 'müssen', 'wollen', 'dürfen', 'sollen'],
                ],
            },
        ],
        keyRules: [
            'Modal verbs go in position 2, main verb infinitive goes to the END',
            'ich/er/sie/es forms are identical for all modals (no -t ending!)',
            'müssen = must/have to (obligation), sollen = should (recommendation)',
            'dürfen = permission, können = ability',
            'möchten (would like) is more polite than wollen (want)',
        ],
        tips: [
            'Start with können and müssen - they are the most common',
            'Practice: "Ich kann... / Ich muss... / Ich will..."',
            'möchten is used for polite requests: "Ich möchte einen Kaffee, bitte."',
        ],
        commonMistakes: [
            '❌ "Ich kann spreche" → ✅ "Ich kann sprechen" (infinitive, not conjugated!)',
            '❌ "Er kanns" → ✅ "Er kann" (no -t for er/sie/es with modals)',
            '❌ "Ich muss nach Hause zu gehen" → ✅ "Ich muss nach Hause gehen" (no "zu")',
        ],
        examples: [
            { german: 'Ich kann schwimmen.', english: 'I can swim.' },
            { german: 'Du musst arbeiten.', english: 'You must work.' },
            { german: 'Er will nach Hause gehen.', english: 'He wants to go home.' },
            { german: 'Sie möchte ein Eis.', english: 'She would like an ice cream.' },
            { german: 'Wir dürfen hier parken.', english: 'We are allowed to park here.' },
            { german: 'Ihr sollt mehr lernen.', english: 'You should study more.' },
            { german: 'Kannst du mir helfen?', english: 'Can you help me?' },
            { german: 'Ich muss zum Arzt gehen.', english: 'I have to go to the doctor.' },
            { german: 'Sie will Ärztin werden.', english: 'She wants to become a doctor.' },
            { german: 'Darf ich rauchen?', english: 'May I smoke?' },
        ],
    },
    {
        id: 'a2-comparative',
        title: 'Comparatives & Superlatives',
        titleDe: 'Komparativ und Superlativ',
        description: 'Compare things and express preferences using comparative and superlative forms.',
        level: 'A2',
        order: 4,
        lessons: 5,
        completedLessons: 0,
        explanation: `German comparatives and superlatives work similarly to English but with some differences.

Comparative (comparing two things):
Adjective + -er + als
schnell → schneller als (faster than)

Superlative (the most):
am + adjective + -sten OR der/die/das + adjective + -ste
schnell → am schnellsten / der schnellste

Many common adjectives have umlaut changes:
alt → älter → am ältesten
groß → größer → am größten`,
        tables: [
            {
                title: 'Irregular Comparatives',
                headers: ['Adjective', 'Comparative', 'Superlative'],
                rows: [
                    ['gut (good)', 'besser', 'am besten'],
                    ['viel (much)', 'mehr', 'am meisten'],
                    ['gern (gladly)', 'lieber', 'am liebsten'],
                    ['hoch (high)', 'höher', 'am höchsten'],
                    ['nah (near)', 'näher', 'am nächsten'],
                ],
            },
        ],
        keyRules: [
            'Comparative: adjective + -er + als',
            'Superlative: am + adjective + -sten (predicative) OR der/die/das + adjective + -ste (attributive)',
            'Many one-syllable adjectives add umlaut: alt→älter, jung→jünger, groß→größer',
            'Equality: so + adjective + wie (as...as)',
            'gut, viel, gern are completely irregular',
        ],
        tips: [
            'Memorize irregular forms: gut-besser-am besten, viel-mehr-am meisten',
            'Practice: "X ist größer als Y" / "X ist am größten"',
            'For "as...as": "Sie ist so alt wie ich"',
        ],
        commonMistakes: [
            '❌ "mehr gut" → ✅ "besser" (gut is irregular)',
            '❌ "groß als" → ✅ "größer als" (need -er for comparative)',
            '❌ "am größte" → ✅ "am größten" (superlative needs -en)',
        ],
        examples: [
            { german: 'Er ist größer als ich.', english: 'He is taller than me.' },
            { german: 'Sie ist am schnellsten.', english: 'She is the fastest.' },
            { german: 'Das ist besser.', english: 'That is better.' },
            { german: 'Er ist der beste Spieler.', english: 'He is the best player.' },
            { german: 'Dieses Auto ist teurer.', english: 'This car is more expensive.' },
            { german: 'Das Essen ist am leckersten.', english: 'The food is the most delicious.' },
            { german: 'Sie ist so alt wie ich.', english: 'She is as old as me.' },
            { german: 'Er läuft schneller.', english: 'He runs faster.' },
            { german: 'Das ist die schönste Stadt.', english: 'That is the most beautiful city.' },
            { german: 'Ich habe mehr Zeit als du.', english: 'I have more time than you.' },
        ],
    },
    {
        id: 'a2-subordinate',
        title: 'Subordinate Clauses',
        titleDe: 'Nebensätze',
        description: 'Build complex sentences with subordinating conjunctions like weil, dass, wenn.',
        level: 'A2',
        order: 5,
        lessons: 5,
        completedLessons: 0,
        explanation: `Subordinate clauses (Nebensätze) are dependent clauses introduced by subordinating conjunctions. The key rule: the conjugated verb goes to the END of the subordinate clause.

Main clause: Ich lerne Deutsch. (verb in position 2)
Subordinate: ...weil ich Deutsch lerne. (verb at END)

Common conjunctions:
• weil - because
• dass - that
• wenn - if/when
• obwohl - although
• als - when (past, single event)
• bevor - before
• nachdem - after`,
        tables: [
            {
                title: 'Common Subordinating Conjunctions',
                headers: ['German', 'English', 'Example'],
                rows: [
                    ['weil', 'because', '...weil ich müde bin'],
                    ['dass', 'that', '...dass er kommt'],
                    ['wenn', 'if/when', '...wenn es regnet'],
                    ['obwohl', 'although', '...obwohl er krank ist'],
                    ['als', 'when (past)', '...als ich jung war'],
                ],
            },
        ],
        keyRules: [
            'Verb goes to the END in subordinate clauses',
            'Comma ALWAYS separates main and subordinate clause',
            'wenn = if/when (repeated), als = when (past, one-time)',
            'If subordinate clause comes first, main clause verb follows immediately',
            'dass is the most common - "I think that...", "I know that..."',
        ],
        tips: [
            'Practice word order: weil... VERB (at the end)',
            'Start simple: "Ich denke, dass..." / "Ich weiß, dass..."',
            'Remember the comma - it always separates the clauses',
        ],
        commonMistakes: [
            '❌ "weil ich bin müde" → ✅ "weil ich müde bin" (verb at END)',
            '❌ "Wenn es regnet ich bleibe" → ✅ "Wenn es regnet, bleibe ich" (verb-second in main)',
            '❌ Forgetting the comma between clauses',
        ],
        examples: [
            { german: 'Ich bleibe zu Hause, weil ich krank bin.', english: 'I stay home because I am sick.' },
            { german: 'Er sagt, dass er kommt.', english: 'He says that he is coming.' },
            { german: 'Wenn es regnet, bleibe ich drinnen.', english: 'If it rains, I stay inside.' },
            { german: 'Obwohl er müde ist, arbeitet er.', english: 'Although he is tired, he works.' },
            { german: 'Ich weiß, dass du Recht hast.', english: 'I know that you are right.' },
            { german: 'Falls du Zeit hast, ruf mich an.', english: 'If you have time, call me.' },
            { german: 'Während ich esse, lese ich.', english: 'While I eat, I read.' },
            { german: 'Ich freue mich, dass du da bist.', english: 'I am happy that you are here.' },
            { german: 'Weil er spät kam, verpasste er den Zug.', english: 'Because he came late, he missed the train.' },
            { german: 'Wenn ich Zeit habe, besuche ich dich.', english: 'When I have time, I will visit you.' },
        ],
    },

    // ============================================
    // B1 Topics
    // ============================================
    {
        id: 'b1-relative-clauses',
        title: 'Relative Clauses',
        titleDe: 'Relativsätze',
        description: 'Add detail to your sentences using relative pronouns (der, die, das, etc.).',
        level: 'B1',
        order: 1,
        lessons: 5,
        completedLessons: 0,
        explanation: `Relative clauses add information about a noun. They start with a relative pronoun that matches the gender/number of the noun AND takes the case required by its role in the relative clause.

Structure:
Main noun, [relative pronoun] + ... + [verb at end], ...
Der Mann, der dort steht, ist mein Vater.

The relative pronoun agrees with the antecedent (noun) in gender/number, but its case depends on its function in the relative clause.`,
        tables: [
            {
                title: 'Relative Pronouns',
                headers: ['Case', 'Masculine', 'Feminine', 'Neuter', 'Plural'],
                rows: [
                    ['Nominative', 'der', 'die', 'das', 'die'],
                    ['Accusative', 'den', 'die', 'das', 'die'],
                    ['Dative', 'dem', 'der', 'dem', 'denen'],
                    ['Genitive', 'dessen', 'deren', 'dessen', 'deren'],
                ],
            },
        ],
        keyRules: [
            'Relative pronoun matches the noun in gender and number',
            'Case of pronoun depends on its role in the relative clause',
            'Verb goes to the END of the relative clause',
            'Genitive (dessen/deren) = whose',
            'With prepositions: preposition + relative pronoun (in dem, mit der, etc.)',
        ],
        tips: [
            'Start with nominative relatives (der, die, das = who/that)',
            'For "whose" use dessen (masc/neut) or deren (fem/plural)',
            'Practice: "Der Mann, den ich kenne..." (accusative)',
        ],
        commonMistakes: [
            '❌ "Der Mann, der ich kenne" → ✅ "Der Mann, den ich kenne" (accusative object)',
            '❌ "Die Frau, dem ich helfe" → ✅ "Die Frau, der ich helfe" (dative, feminine)',
            '❌ Forgetting verb at end: "Der Mann, der steht dort" → "Der Mann, der dort steht"',
        ],
        examples: [
            { german: 'Der Mann, der dort steht, ist mein Vater.', english: 'The man who is standing there is my father.' },
            { german: 'Das Buch, das ich lese, ist spannend.', english: 'The book that I am reading is exciting.' },
            { german: 'Die Frau, die mir geholfen hat, war nett.', english: 'The woman who helped me was nice.' },
            { german: 'Das Haus, in dem ich wohne, ist alt.', english: 'The house in which I live is old.' },
            { german: 'Der Film, den wir gesehen haben, war gut.', english: 'The movie that we saw was good.' },
            { german: 'Die Kinder, denen ich helfe, sind fleißig.', english: 'The children whom I help are hardworking.' },
            { german: 'Das Restaurant, dessen Essen gut ist, ist teuer.', english: 'The restaurant whose food is good is expensive.' },
            { german: 'Die Stadt, in der ich geboren bin, ist klein.', english: 'The city in which I was born is small.' },
            { german: 'Der Lehrer, mit dem ich spreche, ist streng.', english: 'The teacher with whom I speak is strict.' },
            { german: 'Das Geschenk, das du mir gegeben hast, gefällt mir.', english: 'The gift that you gave me pleases me.' },
        ],
    },
    {
        id: 'b1-konjunktiv2',
        title: 'Konjunktiv II',
        titleDe: 'Konjunktiv II',
        description: 'Express hypotheticals, wishes, and polite requests using the subjunctive mood.',
        level: 'B1',
        order: 2,
        lessons: 5,
        completedLessons: 0,
        explanation: `The Konjunktiv II expresses hypothetical situations, wishes, and polite requests. For most verbs, use würde + infinitive. For sein, haben, and modals, use special forms.

Uses:
• Hypothetical: Wenn ich reich wäre... (If I were rich...)
• Polite requests: Könnten Sie mir helfen? (Could you help me?)
• Wishes: Ich wünschte, ich wäre... (I wish I were...)

Common Konjunktiv II forms:
• sein → wäre, wärst, wäre, wären
• haben → hätte, hättest, hätte, hätten
• werden → würde (used with other verbs)`,
        tables: [
            {
                title: 'Konjunktiv II Forms',
                headers: ['Verb', 'ich', 'du', 'er/sie', 'wir'],
                rows: [
                    ['sein', 'wäre', 'wärst', 'wäre', 'wären'],
                    ['haben', 'hätte', 'hättest', 'hätte', 'hätten'],
                    ['können', 'könnte', 'könntest', 'könnte', 'könnten'],
                    ['müssen', 'müsste', 'müsstest', 'müsste', 'müssten'],
                    ['werden', 'würde', 'würdest', 'würde', 'würden'],
                ],
            },
        ],
        keyRules: [
            'würde + infinitive for most verbs: Ich würde gehen. (I would go.)',
            'Use special forms for sein, haben, modals (wäre, hätte, könnte, etc.)',
            'Wenn-clause: Wenn ich Zeit hätte, würde ich kommen.',
            'Polite requests use Konjunktiv II: Könnten Sie...? / Hätten Sie...?',
            'Wishes: Ich wünschte, ich hätte... / Ich wäre gern...',
        ],
        tips: [
            'Master wäre and hätte first - they are the most common',
            'Use würde + infinitive when in doubt for other verbs',
            'Konjunktiv II sounds more polite than indicative',
        ],
        commonMistakes: [
            '❌ "Wenn ich reich bin" → ✅ "Wenn ich reich wäre" (hypothetical needs Konj. II)',
            '❌ "würde sein" → ✅ "wäre" (sein has its own form)',
            '❌ "würde haben" → ✅ "hätte" (haben has its own form)',
        ],
        examples: [
            { german: 'Wenn ich reich wäre, würde ich reisen.', english: 'If I were rich, I would travel.' },
            { german: 'Ich würde gern kommen.', english: 'I would like to come.' },
            { german: 'Hätten Sie Zeit?', english: 'Would you have time?' },
            { german: 'Könnten Sie mir helfen?', english: 'Could you help me?' },
            { german: 'Ich wäre gern Arzt.', english: 'I would like to be a doctor.' },
            { german: 'Wenn ich Zeit hätte, würde ich lernen.', english: 'If I had time, I would study.' },
            { german: 'Er müsste mehr arbeiten.', english: 'He should work more.' },
            { german: 'Wir könnten ins Kino gehen.', english: 'We could go to the cinema.' },
            { german: 'Ich wünschte, ich wäre jünger.', english: 'I wish I were younger.' },
            { german: 'Das wäre sehr nett.', english: 'That would be very nice.' },
        ],
    },
    {
        id: 'b1-passive',
        title: 'Passive Voice',
        titleDe: 'Passiv',
        description: 'Understand and form passive constructions in German using werden + past participle.',
        level: 'B1',
        order: 3,
        lessons: 5,
        completedLessons: 0,
        explanation: `The passive voice shifts focus from the doer to the action or recipient. In German, passive is formed with werden + past participle.

Active: Der Mann baut das Haus. (The man builds the house.)
Passive: Das Haus wird gebaut. (The house is being built.)

Tenses:
• Present: wird + past partic. (wird gebaut)
• Past: wurde + past partic. (wurde gebaut)  
• Perfect: ist + past partic. + worden (ist gebaut worden)`,
        tables: [
            {
                title: 'Passive Tenses',
                headers: ['Tense', 'Formation', 'Example'],
                rows: [
                    ['Present', 'wird + Partizip II', 'Das Haus wird gebaut.'],
                    ['Past (Präteritum)', 'wurde + Partizip II', 'Das Haus wurde gebaut.'],
                    ['Perfect', 'ist + Partizip II + worden', 'Das Haus ist gebaut worden.'],
                    ['With Modal', 'modal + Partizip II + werden', 'Das muss gemacht werden.'],
                ],
            },
        ],
        keyRules: [
            'Passive = werden (conjugated) + past participle (at end)',
            'The accusative object of active becomes nominative subject in passive',
            'Perfekt passive uses "worden" (not "geworden")',
            'Modals with passive: Modal + past participle + werden (at end)',
            'Agent (by whom) is expressed with "von + dative"',
        ],
        tips: [
            'Start with present passive: Das wird gemacht.',
            'Remember: werden changes, past participle stays the same',
            'Use passive when the action is more important than who did it',
        ],
        commonMistakes: [
            '❌ "Das Haus ist gebaut geworden" → ✅ "ist gebaut worden" (worden, not geworden)',
            '❌ "wird gebuildet" → ✅ "wird gebaut" (use correct past participle)',
            '❌ Forgetting werden: "Das Haus gebaut" → "Das Haus wird gebaut"',
        ],
        examples: [
            { german: 'Das Haus wird gebaut.', english: 'The house is being built.' },
            { german: 'Das Buch wurde gelesen.', english: 'The book was read.' },
            { german: 'Die Arbeit ist erledigt worden.', english: 'The work has been completed.' },
            { german: 'Das Auto wird repariert.', english: 'The car is being repaired.' },
            { german: 'Die Briefe werden geschrieben.', english: 'The letters are being written.' },
            { german: 'Das Gebäude wurde 1990 gebaut.', english: 'The building was built in 1990.' },
            { german: 'Das muss gemacht werden.', english: 'That must be done.' },
            { german: 'Es kann nicht geändert werden.', english: 'It cannot be changed.' },
            { german: 'Der Kuchen wird gebacken.', english: 'The cake is being baked.' },
            { german: 'Die Tür wird geöffnet.', english: 'The door is being opened.' },
        ],
    },
    {
        id: 'b1-prepositions',
        title: 'Complex Prepositions',
        titleDe: 'Komplexe Präpositionen',
        description: 'Master genitive prepositions and verb+preposition combinations.',
        level: 'B1',
        order: 4,
        lessons: 5,
        completedLessons: 0,
        explanation: `At B1, you learn genitive prepositions and verb+preposition combinations (Verben mit Präpositionen).

Genitive prepositions:
• wegen - because of
• während - during
• trotz - despite
• anstatt/statt - instead of

Verb + Preposition combinations:
Many verbs require specific prepositions. The preposition determines the case.
• warten auf + Akkusativ (wait for)
• sich freuen auf + Akkusativ (look forward to)
• denken an + Akkusativ (think about)
• sich interessieren für + Akkusativ (be interested in)`,
        tables: [
            {
                title: 'Common Verb + Preposition Combinations',
                headers: ['Verb', 'Preposition', 'Case', 'Meaning'],
                rows: [
                    ['warten', 'auf', 'Akk', 'wait for'],
                    ['sich freuen', 'auf', 'Akk', 'look forward to'],
                    ['denken', 'an', 'Akk', 'think about'],
                    ['sprechen', 'über', 'Akk', 'talk about'],
                    ['sich interessieren', 'für', 'Akk', 'be interested in'],
                ],
            },
        ],
        keyRules: [
            'Genitive prepositions: wegen, während, trotz, anstatt + Genitiv',
            'Verb+Prep combos must be memorized with their case',
            'wo- + preposition for questions: wofür? worauf? worüber?',
            'da- + preposition for answers: dafür, darauf, darüber',
            'Double-r for prepositions starting with vowel: worauf, darauf',
        ],
        tips: [
            'Learn verb+prep as a unit: "warten auf" not just "warten"',
            'Practice: "Worauf wartest du?" → "Ich warte auf den Bus."',
            'Genitive is often replaced by dative in spoken German: wegen dem Wetter',
        ],
        commonMistakes: [
            '❌ "Ich warte für den Bus" → ✅ "Ich warte auf den Bus"',
            '❌ "Auf was wartest du?" → ✅ "Worauf wartest du?" (use wo-compound)',
            '❌ "wegen das Wetter" → ✅ "wegen des Wetters" (genitive)',
        ],
        examples: [
            { german: 'Wegen des Wetters bleibe ich zu Hause.', english: 'Because of the weather I stay home.' },
            { german: 'Während der Ferien fahre ich weg.', english: 'During the holidays I go away.' },
            { german: 'Trotz des Regens gehen wir spazieren.', english: 'Despite the rain we go for a walk.' },
            { german: 'Ich warte auf den Bus.', english: 'I am waiting for the bus.' },
            { german: 'Sie freut sich auf die Party.', english: 'She is looking forward to the party.' },
            { german: 'Er denkt an seine Familie.', english: 'He thinks about his family.' },
            { german: 'Wir sprechen über das Problem.', english: 'We talk about the problem.' },
            { german: 'Ich interessiere mich für Musik.', english: 'I am interested in music.' },
            { german: 'Worauf wartest du?', english: 'What are you waiting for?' },
            { german: 'Darauf freue ich mich.', english: 'I am looking forward to that.' },
        ],
    },
    {
        id: 'b1-indirect-speech',
        title: 'Indirect Speech',
        titleDe: 'Indirekte Rede',
        description: 'Report what others said using indirect speech constructions.',
        level: 'B1',
        order: 5,
        lessons: 5,
        completedLessons: 0,
        explanation: `Indirect speech (indirekte Rede) reports what someone said. In spoken German, you typically use dass + indicative. In formal writing, Konjunktiv I is used.

Structures:
• Simple: Er sagt, dass er kommt. (He says that he's coming.)
• Questions: Er fragte, ob ich komme. (He asked if I was coming.)
• Commands: Sie sagte, ich solle warten. (She said I should wait.)

For questions:
• Yes/No questions: ob (whether/if)
• W-questions: use the W-word (wann, wo, was, etc.)`,
        keyRules: [
            'dass-clauses: verb goes to the end',
            'Yes/No questions become ob-clauses',
            'W-questions keep their question word: "wo, wann, wie, etc."',
            'Commands use sollen: "Er sagte, ich solle..."',
            'Formal German uses Konjunktiv I (sei, habe, komme)',
        ],
        tips: [
            'In everyday speech, dass + indicative is fine',
            'Practice: sagen, dass... / fragen, ob... / wissen, dass...',
            'Konjunktiv I is mainly for news and academic writing',
        ],
        commonMistakes: [
            '❌ "Er fragt, dass er kommt" → ✅ "Er fragt, ob er kommt" (questions use ob)',
            '❌ Forgetting verb at end in dass-clause',
            '❌ "Er sagte mir warten" → ✅ "Er sagte, ich solle warten"',
        ],
        examples: [
            { german: 'Er sagt, dass er kommt.', english: 'He says that he is coming.' },
            { german: 'Sie meinte, sie sei müde.', english: 'She said she was tired.' },
            { german: 'Er fragte, ob ich komme.', english: 'He asked if I was coming.' },
            { german: 'Sie wollte wissen, wann wir ankommen.', english: 'She wanted to know when we arrive.' },
            { german: 'Er bat mich, ihm zu helfen.', english: 'He asked me to help him.' },
            { german: 'Sie sagte, ich solle warten.', english: 'She said I should wait.' },
            { german: 'Er erklärte, dass er es nicht wusste.', english: 'He explained that he did not know.' },
            { german: 'Sie behauptete, sie habe es gesehen.', english: 'She claimed she had seen it.' },
            { german: 'Er meinte, er könne nicht kommen.', english: 'He said he could not come.' },
            { german: 'Sie fragte, was ich mache.', english: 'She asked what I was doing.' },
        ],
    },

    // ============================================
    // B2 Topics
    // ============================================
    {
        id: 'b2-konjunktiv1',
        title: 'Konjunktiv I',
        titleDe: 'Konjunktiv I',
        description: 'Master formal indirect speech for journalism and academic writing.',
        level: 'B2',
        order: 1,
        lessons: 4,
        completedLessons: 0,
        explanation: `Konjunktiv I is used in formal German (news, academic writing) for indirect speech. It signals that you're reporting what someone else said, without endorsing it as fact.

Formation:
Take the infinitive stem + endings: -e, -est, -e, -en, -et, -en
sein → ich sei, du seist/seiest, er sei, wir seien

When Konj. I looks like indicative, use Konj. II instead:
sie haben (indic.) → sie haben (Konj. I same) → sie hätten (use Konj. II)`,
        tables: [
            {
                title: 'Konjunktiv I Forms',
                headers: ['Verb', 'ich', 'er/sie', 'wir/sie'],
                rows: [
                    ['sein', 'sei', 'sei', 'seien'],
                    ['haben', 'habe', 'habe', 'hätten*'],
                    ['können', 'könne', 'könne', 'könnten*'],
                    ['werden', 'werde', 'werde', 'würden*'],
                ],
            },
        ],
        keyRules: [
            'Konj. I stem = infinitive stem (not past tense stem)',
            'er/sie/es form is most common and clear: er sei, er habe, er komme',
            'When Konj. I = Indicative, substitute Konj. II',
            'Used in news to show reported speech: "Die Kanzlerin sagte, sie sei..."',
            'Signals "allegedly" - you\'re not claiming it\'s true',
        ],
        tips: [
            'Focus on 3rd person forms (er/sie sei, habe, komme)',
            'Look for Konj. I in news articles to see authentic usage',
            'In conversation, dass + indicative is preferred',
        ],
        commonMistakes: [
            '❌ Using Konj. I in casual speech (sounds overly formal)',
            '❌ "sie haben" instead of "sie hätten" when reporting (need to switch to Konj. II)',
            '❌ Confusing Konj. I with Konj. II forms',
        ],
        examples: [
            { german: 'Er sagte, er sei krank.', english: 'He said he was sick.' },
            { german: 'Die Ministerin erklärte, es gebe keine Probleme.', english: 'The minister explained there were no problems.' },
            { german: 'Man sagt, sie sei die Beste.', english: 'They say she is the best.' },
            { german: 'Er behaupte, er habe es nicht getan.', english: 'He claims he did not do it.' },
            { german: 'Sie betonte, die Lösung sei einfach.', english: 'She emphasized the solution was simple.' },
            { german: 'Der Sprecher sagte, sie hätten gewonnen.', english: 'The speaker said they had won.' },
            { german: 'Er meinte, er könne es erklären.', english: 'He said he could explain it.' },
            { german: 'Die Zeitung berichtet, der Präsident sei verreist.', english: 'The newspaper reports the president has traveled.' },
            { german: 'Man nimmt an, das Problem werde gelöst.', english: 'It is assumed the problem will be solved.' },
            { german: 'Er versicherte, er werde kommen.', english: 'He assured he would come.' },
        ],
    },
    {
        id: 'b2-advanced-passive',
        title: 'Advanced Passive',
        titleDe: 'Erweitertes Passiv',
        description: 'Explore passive alternatives and advanced constructions.',
        level: 'B2',
        order: 2,
        lessons: 5,
        completedLessons: 0,
        explanation: `Beyond the basic passive (werden + Partizip II), German has several other ways to express passive meaning.

1. State Passive (Zustandspassiv): sein + Partizip II
   Das Fenster ist geöffnet. (The window is open. = result state)

2. sich lassen + Infinitive: potential passive
   Das lässt sich machen. (That can be done.)

3. sein + zu + Infinitive: obligation/possibility
   Das ist zu beachten. (That is to be noted.)

4. man + active verb: impersonal passive
   Hier spricht man Deutsch. (German is spoken here.)`,
        tables: [
            {
                title: 'Passive Alternatives',
                headers: ['Type', 'Structure', 'Meaning'],
                rows: [
                    ['State Passive', 'sein + Partizip II', 'resulting state'],
                    ['lassen-passive', 'sich lassen + Inf.', 'can be done'],
                    ['sein + zu', 'sein + zu + Inf.', 'must/can be done'],
                    ['man-passive', 'man + active', 'one does / is done'],
                ],
            },
        ],
        keyRules: [
            'Zustandspassiv (sein) shows result state, not action',
            'sich lassen + Inf. = can be done (possibility)',
            'sein + zu + Inf. = must be done / can be done',
            'man makes passive meaning with active grammar',
            'These are often preferred over werden-passive in speech',
        ],
        tips: [
            'Zustandspassiv for "done" states: Die Tür ist geschlossen.',
            'Use lassen for ability: Das lässt sich erklären.',
            'News often uses man: Man berichtet, dass...',
        ],
        commonMistakes: [
            '❌ "Das Fenster wird geöffnet" (action) vs "ist geöffnet" (state)',
            '❌ Confusing sich lassen with lassen (causative)',
            '❌ "sein zu machen" → ✅ "ist zu machen" (is to be done)',
        ],
        examples: [
            { german: 'Das Fenster ist geöffnet.', english: 'The window is open. (state passive)' },
            { german: 'Man sagt, dass...', english: 'It is said that... (man alternative)' },
            { german: 'Das lässt sich machen.', english: 'That can be done.' },
            { german: 'Das Problem lässt sich lösen.', english: 'The problem can be solved.' },
            { german: 'Das ist zu beachten.', english: 'That is to be noted.' },
            { german: 'Die Arbeit ist bis morgen abzugeben.', english: 'The work is to be submitted by tomorrow.' },
            { german: 'Hier spricht man Deutsch.', english: 'German is spoken here.' },
            { german: 'Das Buch liest sich leicht.', english: 'The book reads easily.' },
            { german: 'Es wurde viel gelacht.', english: 'There was a lot of laughing.' },
            { german: 'Das versteht sich von selbst.', english: 'That goes without saying.' },
        ],
    },
    {
        id: 'b2-nominalization',
        title: 'Nominalization',
        titleDe: 'Nominalisierung',
        description: 'Transform verbs and adjectives into nouns for formal academic style.',
        level: 'B2',
        order: 3,
        lessons: 5,
        completedLessons: 0,
        explanation: `Nominalization means turning verbs or adjectives into nouns. This is very common in formal/academic German and makes text sound more sophisticated.

1. Infinitive as noun (neuter):
   lesen → das Lesen (reading)

2. Verb to -ung noun (feminine):
   entwickeln → die Entwicklung (development)

3. Adjective to -heit/-keit noun (feminine):
   schön → die Schönheit (beauty)
   möglich → die Möglichkeit (possibility)

4. Noun-Verb combinations (Funktionsverbgefüge):
   eine Entscheidung treffen (to make a decision)`,
        tables: [
            {
                title: 'Common Nominalization Patterns',
                headers: ['Base', 'Pattern', 'Example'],
                rows: [
                    ['Verb', 'das + Infinitive', 'das Lesen, das Schreiben'],
                    ['Verb', '-ung (die)', 'die Entwicklung, die Verbesserung'],
                    ['Adjective', '-heit (die)', 'die Schönheit, die Freiheit'],
                    ['Adjective', '-keit (die)', 'die Möglichkeit, die Fähigkeit'],
                ],
            },
        ],
        keyRules: [
            'Infinitive nouns are always neuter (das)',
            '-ung nouns are always feminine (die)',
            '-heit/-keit nouns are always feminine (die)',
            'Nominalization is preferred in academic/formal writing',
            'Noun-verb combos (Funktionsverbgefüge) are fixed expressions',
        ],
        tips: [
            'Read academic texts to see nominalization in context',
            'Practice: machen → das Machen / die Herstellung',
            'Common -ung nouns: Entwicklung, Verbesserung, Entscheidung',
        ],
        commonMistakes: [
            '❌ Wrong gender: "der Entwicklung" → ✅ "die Entwicklung"',
            '❌ Overusing nominalization in speech (sounds stiff)',
            '❌ Wrong noun form: "die Machung" → ✅ "die Herstellung" / "das Machen"',
        ],
        examples: [
            { german: 'Das Lesen macht mir Spaß.', english: 'Reading is fun for me.' },
            { german: 'Die Entwicklung ist wichtig.', english: 'The development is important.' },
            { german: 'Die Schönheit der Natur.', english: 'The beauty of nature.' },
            { german: 'Die Möglichkeit besteht.', english: 'The possibility exists.' },
            { german: 'Die Verbesserung ist nötig.', english: 'The improvement is necessary.' },
            { german: 'Bei der Ankunft des Zuges...', english: 'Upon arrival of the train...' },
            { german: 'Eine Entscheidung treffen.', english: 'To make a decision.' },
            { german: 'In Frage stellen.', english: 'To call into question.' },
            { german: 'Kritik üben.', english: 'To exercise criticism.' },
            { german: 'Zur Diskussion stehen.', english: 'To be up for discussion.' },
        ],
    },
    {
        id: 'b2-professional',
        title: 'Professional German',
        titleDe: 'Berufssprache',
        description: 'Communicate effectively in German professional environments.',
        level: 'B2',
        order: 4,
        lessons: 5,
        completedLessons: 0,
        explanation: `Professional German requires formal language, polite forms, and specific conventions for emails, meetings, and phone calls.

Email Format:
• Opening: Sehr geehrte Damen und Herren / Sehr geehrte Frau/Herr [Name]
• Closing: Mit freundlichen Grüßen

Key Politeness Strategies:
• Use Konjunktiv II for requests: Könnten Sie...? Hätten Sie...?
• Avoid direct commands: "Schicken Sie mir..." → "Könnten Sie mir bitte... schicken?"
• Soften disagreement: "Ich sehe das etwas anders."`,
        keyRules: [
            'Use Sie (formal you) in all professional contexts',
            'Konjunktiv II for polite requests: Könnten Sie, Hätten Sie',
            'Formal email openings: Sehr geehrte/r, closings: Mit freundlichen Grüßen',
            'Avoid direct imperatives - use würde/könnte instead',
            'Use professional titles: Herr Doktor, Frau Professor',
        ],
        tips: [
            'Start emails with reference: "Bezüglich Ihrer Anfrage..."',
            'Soften statements: "Ich würde sagen..." / "Meiner Meinung nach..."',
            'Learn meeting phrases: "Darf ich kurz etwas ergänzen?"',
        ],
        commonMistakes: [
            '❌ "Hallo" in formal emails → ✅ "Sehr geehrte/r..."',
            '❌ Using du with colleagues you don\'t know well',
            '❌ Direct refusals → ✅ "Das würde leider nicht gehen..."',
        ],
        examples: [
            { german: 'Sehr geehrte Damen und Herren', english: 'Dear Sir or Madam' },
            { german: 'Mit freundlichen Grüßen', english: 'With kind regards' },
            { german: 'Ich beziehe mich auf Ihr Schreiben.', english: 'I refer to your letter.' },
            { german: 'Ich möchte Ihnen mitteilen...', english: 'I would like to inform you...' },
            { german: 'Darf ich einen anderen Vorschlag machen?', english: 'May I make another suggestion?' },
            { german: 'Ich sehe das anders.', english: 'I see it differently.' },
            { german: 'Zusammenfassend lässt sich sagen...', english: 'In summary, it can be said...' },
            { german: 'Wir möchten Sie zu einem Vorstellungsgespräch einladen.', english: 'We would like to invite you for an interview.' },
            { german: 'Könnten Sie mir weitere Informationen geben?', english: 'Could you give me more information?' },
            { german: 'Vielen Dank für Ihre Anfrage.', english: 'Thank you for your inquiry.' },
        ],
    },
];

// Helper to find topic by lesson content matching (fuzzy logic or mapping)
export const getGrammarTopicForLesson = (lessonTitle: string): GrammarTopic | undefined => {
    const title = lessonTitle.toLowerCase();

    // A1 matches
    if (title.includes('article')) return grammarTopics.find(t => t.id === 'a1-articles');
    if (title.includes('structure') || title.includes('question')) return grammarTopics.find(t => t.id === 'a1-sentence-structure');
    if (title.includes('negation') || title.includes('nicht') || title.includes('kein')) return grammarTopics.find(t => t.id === 'a1-negation');
    if (title.includes('review') || title.includes('wiederholung')) return grammarTopics.find(t => t.id === 'a1-m5-review');

    // A2 matches
    if (title.includes('perfekt') || title.includes('past tense')) return grammarTopics.find(t => t.id === 'a2-perfekt');
    if (title.includes('haben vs') || title.includes('haben oder')) return grammarTopics.find(t => t.id === 'a2-haben-sein');
    if (title.includes('modal')) return grammarTopics.find(t => t.id === 'a2-modal-verbs');
    if (title.includes('dativ') || title.includes('dative')) return grammarTopics.find(t => t.id === 'a2-dative');
    if (title.includes('comparative') || title.includes('superlative') || title.includes('komparativ')) return grammarTopics.find(t => t.id === 'a2-comparative');
    if (title.includes('subordinate') || title.includes('nebensatz') || title.includes('weil') || title.includes('dass')) return grammarTopics.find(t => t.id === 'a2-subordinate');
    if (title.includes('participle') || title.includes('partizip')) return grammarTopics.find(t => t.id === 'a2-perfekt');

    // B1 matches
    if (title.includes('relative') || title.includes('relativsatz')) return grammarTopics.find(t => t.id === 'b1-relative-clauses');
    if (title.includes('konjunktiv ii') || title.includes('würde') || title.includes('subjunctive')) return grammarTopics.find(t => t.id === 'b1-konjunktiv2');
    if (title.includes('passive') || title.includes('passiv')) return grammarTopics.find(t => t.id === 'b1-passive');
    if (title.includes('preposition') || title.includes('präposition') || title.includes('genitive')) return grammarTopics.find(t => t.id === 'b1-prepositions');
    if (title.includes('indirect') || title.includes('indirekte rede') || title.includes('reporting')) return grammarTopics.find(t => t.id === 'b1-indirect-speech');
    if (title.includes('polite') || title.includes('höflich')) return grammarTopics.find(t => t.id === 'b1-konjunktiv2');

    // B2 matches
    if (title.includes('konjunktiv i') || title.includes('konjunktiv 1')) return grammarTopics.find(t => t.id === 'b2-konjunktiv1');
    if (title.includes('advanced passive') || title.includes('zustandspassiv') || title.includes('lassen')) return grammarTopics.find(t => t.id === 'b2-advanced-passive');
    if (title.includes('nominal') || title.includes('nominalisierung')) return grammarTopics.find(t => t.id === 'b2-nominalization');
    if (title.includes('professional') || title.includes('business') || title.includes('beruf') || title.includes('meeting') || title.includes('interview')) return grammarTopics.find(t => t.id === 'b2-professional');

    // A1 verb as fallback
    if (title.includes('verb') || title.includes('present') || title.includes('sein') || title.includes('haben')) return grammarTopics.find(t => t.id === 'a1-present-tense');

    // Try fuzzy match on title
    return grammarTopics.find(t => title.includes(t.title.toLowerCase()));
};
