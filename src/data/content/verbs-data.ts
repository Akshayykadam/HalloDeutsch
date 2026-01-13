// Comprehensive German Verb Data - All verb types, conjugations, and tenses
import { CEFRLevel } from '../../types';

export interface VerbConjugation {
    ich: string;
    du: string;
    er: string;
    wir: string;
    ihr: string;
    sie: string;
}

export interface VerbData {
    id: string;
    infinitive: string;
    meaning: string;
    level: CEFRLevel;
    type: 'regular' | 'irregular' | 'modal' | 'auxiliary' | 'separable' | 'reflexive';
    category: string;
    present: VerbConjugation;
    past?: VerbConjugation;
    perfect: {
        auxiliary: 'haben' | 'sein';
        participle: string;
    };
    imperative?: {
        du: string;
        ihr: string;
        Sie: string;
    };
    examples: Array<{
        german: string;
        english: string;
    }>;
    notes?: string[];
}

export const verbsData: VerbData[] = [
    // ==================== AUXILIARY VERBS ====================
    {
        id: 'sein',
        infinitive: 'sein',
        meaning: 'to be',
        level: 'A1',
        type: 'auxiliary',
        category: 'Auxiliary Verbs',
        present: {
            ich: 'bin',
            du: 'bist',
            er: 'ist',
            wir: 'sind',
            ihr: 'seid',
            sie: 'sind',
        },
        past: {
            ich: 'war',
            du: 'warst',
            er: 'war',
            wir: 'waren',
            ihr: 'wart',
            sie: 'waren',
        },
        perfect: { auxiliary: 'sein', participle: 'gewesen' },
        imperative: { du: 'sei', ihr: 'seid', Sie: 'seien Sie' },
        examples: [
            { german: 'Ich bin Student.', english: 'I am a student.' },
            { german: 'Wo bist du?', english: 'Where are you?' },
            { german: 'Er ist müde.', english: 'He is tired.' },
        ],
        notes: [
            'Used with professions without article: Ich bin Lehrer',
            'Used to form Perfect tense with motion/change verbs',
            'One of the most irregular verbs in German',
        ],
    },
    {
        id: 'haben',
        infinitive: 'haben',
        meaning: 'to have',
        level: 'A1',
        type: 'auxiliary',
        category: 'Auxiliary Verbs',
        present: {
            ich: 'habe',
            du: 'hast',
            er: 'hat',
            wir: 'haben',
            ihr: 'habt',
            sie: 'haben',
        },
        past: {
            ich: 'hatte',
            du: 'hattest',
            er: 'hatte',
            wir: 'hatten',
            ihr: 'hattet',
            sie: 'hatten',
        },
        perfect: { auxiliary: 'haben', participle: 'gehabt' },
        imperative: { du: 'hab', ihr: 'habt', Sie: 'haben Sie' },
        examples: [
            { german: 'Ich habe Hunger.', english: 'I am hungry.' },
            { german: 'Hast du Zeit?', english: 'Do you have time?' },
            { german: 'Wir haben ein Auto.', english: 'We have a car.' },
        ],
        notes: [
            'Used for physical states: Hunger, Durst, Angst',
            'Main auxiliary for Perfect tense',
            'du/er forms lose the "b"',
        ],
    },
    {
        id: 'werden',
        infinitive: 'werden',
        meaning: 'to become / will',
        level: 'A2',
        type: 'auxiliary',
        category: 'Auxiliary Verbs',
        present: {
            ich: 'werde',
            du: 'wirst',
            er: 'wird',
            wir: 'werden',
            ihr: 'werdet',
            sie: 'werden',
        },
        past: {
            ich: 'wurde',
            du: 'wurdest',
            er: 'wurde',
            wir: 'wurden',
            ihr: 'wurdet',
            sie: 'wurden',
        },
        perfect: { auxiliary: 'sein', participle: 'geworden' },
        examples: [
            { german: 'Ich werde Arzt.', english: 'I am becoming a doctor.' },
            { german: 'Es wird kalt.', english: 'It is getting cold.' },
            { german: 'Ich werde kommen.', english: 'I will come.' },
        ],
        notes: [
            'Used to form Future tense: werden + infinitive',
            'Used to form Passive voice: werden + past participle',
            'Vowel change: e → i in 2nd/3rd person singular',
        ],
    },

    // ==================== MODAL VERBS ====================
    {
        id: 'können',
        infinitive: 'können',
        meaning: 'can, to be able to',
        level: 'A1',
        type: 'modal',
        category: 'Modal Verbs',
        present: {
            ich: 'kann',
            du: 'kannst',
            er: 'kann',
            wir: 'können',
            ihr: 'könnt',
            sie: 'können',
        },
        past: {
            ich: 'konnte',
            du: 'konntest',
            er: 'konnte',
            wir: 'konnten',
            ihr: 'konntet',
            sie: 'konnten',
        },
        perfect: { auxiliary: 'haben', participle: 'gekonnt' },
        examples: [
            { german: 'Ich kann Deutsch sprechen.', english: 'I can speak German.' },
            { german: 'Kannst du schwimmen?', english: 'Can you swim?' },
            { german: 'Er kann nicht kommen.', english: 'He cannot come.' },
        ],
        notes: [
            'ich/er forms are identical (no ending)',
            'Main verb goes to the end in infinitive form',
            'Expresses ability or possibility',
        ],
    },
    {
        id: 'müssen',
        infinitive: 'müssen',
        meaning: 'must, to have to',
        level: 'A1',
        type: 'modal',
        category: 'Modal Verbs',
        present: {
            ich: 'muss',
            du: 'musst',
            er: 'muss',
            wir: 'müssen',
            ihr: 'müsst',
            sie: 'müssen',
        },
        past: {
            ich: 'musste',
            du: 'musstest',
            er: 'musste',
            wir: 'mussten',
            ihr: 'musstet',
            sie: 'mussten',
        },
        perfect: { auxiliary: 'haben', participle: 'gemusst' },
        examples: [
            { german: 'Ich muss arbeiten.', english: 'I must work.' },
            { german: 'Du musst lernen.', english: 'You have to study.' },
            { german: 'Wir müssen gehen.', english: 'We have to go.' },
        ],
        notes: [
            'Expresses necessity or obligation',
            'nicht müssen = don\'t have to (NOT must not)',
            'Loses umlaut in past tense',
        ],
    },
    {
        id: 'wollen',
        infinitive: 'wollen',
        meaning: 'to want',
        level: 'A1',
        type: 'modal',
        category: 'Modal Verbs',
        present: {
            ich: 'will',
            du: 'willst',
            er: 'will',
            wir: 'wollen',
            ihr: 'wollt',
            sie: 'wollen',
        },
        past: {
            ich: 'wollte',
            du: 'wolltest',
            er: 'wollte',
            wir: 'wollten',
            ihr: 'wolltet',
            sie: 'wollten',
        },
        perfect: { auxiliary: 'haben', participle: 'gewollt' },
        examples: [
            { german: 'Ich will nach Hause.', english: 'I want to go home.' },
            { german: 'Was willst du essen?', english: 'What do you want to eat?' },
            { german: 'Sie will Ärztin werden.', english: 'She wants to become a doctor.' },
        ],
        notes: [
            'Expresses desire or intention',
            'ich/er forms are identical',
            'More direct than möchten (would like)',
        ],
    },
    {
        id: 'sollen',
        infinitive: 'sollen',
        meaning: 'should, to be supposed to',
        level: 'A2',
        type: 'modal',
        category: 'Modal Verbs',
        present: {
            ich: 'soll',
            du: 'sollst',
            er: 'soll',
            wir: 'sollen',
            ihr: 'sollt',
            sie: 'sollen',
        },
        past: {
            ich: 'sollte',
            du: 'solltest',
            er: 'sollte',
            wir: 'sollten',
            ihr: 'solltet',
            sie: 'sollten',
        },
        perfect: { auxiliary: 'haben', participle: 'gesollt' },
        examples: [
            { german: 'Du sollst mehr lernen.', english: 'You should study more.' },
            { german: 'Was soll ich machen?', english: 'What should I do?' },
            { german: 'Er soll um 8 kommen.', english: 'He is supposed to come at 8.' },
        ],
        notes: [
            'Expresses obligation or expectation',
            'Often used for advice',
            'No vowel change in any form',
        ],
    },
    {
        id: 'dürfen',
        infinitive: 'dürfen',
        meaning: 'may, to be allowed to',
        level: 'A2',
        type: 'modal',
        category: 'Modal Verbs',
        present: {
            ich: 'darf',
            du: 'darfst',
            er: 'darf',
            wir: 'dürfen',
            ihr: 'dürft',
            sie: 'dürfen',
        },
        past: {
            ich: 'durfte',
            du: 'durftest',
            er: 'durfte',
            wir: 'durften',
            ihr: 'durftet',
            sie: 'durften',
        },
        perfect: { auxiliary: 'haben', participle: 'gedurft' },
        examples: [
            { german: 'Darf ich fragen?', english: 'May I ask?' },
            { german: 'Hier darf man nicht rauchen.', english: 'Smoking is not allowed here.' },
            { german: 'Du darfst gehen.', english: 'You may go.' },
        ],
        notes: [
            'Expresses permission',
            'nicht dürfen = must not (prohibition)',
            'Loses umlaut in past tense',
        ],
    },
    {
        id: 'mögen',
        infinitive: 'mögen',
        meaning: 'to like',
        level: 'A2',
        type: 'modal',
        category: 'Modal Verbs',
        present: {
            ich: 'mag',
            du: 'magst',
            er: 'mag',
            wir: 'mögen',
            ihr: 'mögt',
            sie: 'mögen',
        },
        past: {
            ich: 'mochte',
            du: 'mochtest',
            er: 'mochte',
            wir: 'mochten',
            ihr: 'mochtet',
            sie: 'mochten',
        },
        perfect: { auxiliary: 'haben', participle: 'gemocht' },
        examples: [
            { german: 'Ich mag Kaffee.', english: 'I like coffee.' },
            { german: 'Magst du Musik?', english: 'Do you like music?' },
            { german: 'Er mag sie nicht.', english: 'He doesn\'t like her.' },
        ],
        notes: [
            'Used with nouns directly (no infinitive needed)',
            'möchten (would like) is the Konjunktiv II form',
            'ich/er forms are identical',
        ],
    },

    // ==================== REGULAR VERBS ====================
    {
        id: 'machen',
        infinitive: 'machen',
        meaning: 'to do, to make',
        level: 'A1',
        type: 'regular',
        category: 'Regular Verbs',
        present: {
            ich: 'mache',
            du: 'machst',
            er: 'macht',
            wir: 'machen',
            ihr: 'macht',
            sie: 'machen',
        },
        past: {
            ich: 'machte',
            du: 'machtest',
            er: 'machte',
            wir: 'machten',
            ihr: 'machtet',
            sie: 'machten',
        },
        perfect: { auxiliary: 'haben', participle: 'gemacht' },
        imperative: { du: 'mach', ihr: 'macht', Sie: 'machen Sie' },
        examples: [
            { german: 'Was machst du?', english: 'What are you doing?' },
            { german: 'Ich mache Hausaufgaben.', english: 'I am doing homework.' },
            { german: 'Er macht Frühstück.', english: 'He is making breakfast.' },
        ],
        notes: [
            'Perfect example of regular conjugation',
            'Past participle: ge- + stem + -t',
            'Very common, versatile verb',
        ],
    },
    {
        id: 'lernen',
        infinitive: 'lernen',
        meaning: 'to learn, to study',
        level: 'A1',
        type: 'regular',
        category: 'Regular Verbs',
        present: {
            ich: 'lerne',
            du: 'lernst',
            er: 'lernt',
            wir: 'lernen',
            ihr: 'lernt',
            sie: 'lernen',
        },
        past: {
            ich: 'lernte',
            du: 'lerntest',
            er: 'lernte',
            wir: 'lernten',
            ihr: 'lerntet',
            sie: 'lernten',
        },
        perfect: { auxiliary: 'haben', participle: 'gelernt' },
        imperative: { du: 'lern', ihr: 'lernt', Sie: 'lernen Sie' },
        examples: [
            { german: 'Ich lerne Deutsch.', english: 'I am learning German.' },
            { german: 'Wir lernen zusammen.', english: 'We study together.' },
            { german: 'Er hat viel gelernt.', english: 'He has learned a lot.' },
        ],
        notes: [
            'Standard regular verb pattern',
            'Often confused with studieren (formal study)',
        ],
    },
    {
        id: 'arbeiten',
        infinitive: 'arbeiten',
        meaning: 'to work',
        level: 'A1',
        type: 'regular',
        category: 'Regular Verbs',
        present: {
            ich: 'arbeite',
            du: 'arbeitest',
            er: 'arbeitet',
            wir: 'arbeiten',
            ihr: 'arbeitet',
            sie: 'arbeiten',
        },
        past: {
            ich: 'arbeitete',
            du: 'arbeitetest',
            er: 'arbeitete',
            wir: 'arbeiteten',
            ihr: 'arbeitetet',
            sie: 'arbeiteten',
        },
        perfect: { auxiliary: 'haben', participle: 'gearbeitet' },
        imperative: { du: 'arbeite', ihr: 'arbeitet', Sie: 'arbeiten Sie' },
        examples: [
            { german: 'Ich arbeite bei Siemens.', english: 'I work at Siemens.' },
            { german: 'Arbeitest du heute?', english: 'Are you working today?' },
            { german: 'Sie arbeitet als Lehrerin.', english: 'She works as a teacher.' },
        ],
        notes: [
            'Stem ends in -t, so we add -e- for pronunciation: arbeitest (not arbeitst)',
            'Same rule for finden, warten, kosten',
        ],
    },
    {
        id: 'wohnen',
        infinitive: 'wohnen',
        meaning: 'to live, to reside',
        level: 'A1',
        type: 'regular',
        category: 'Regular Verbs',
        present: {
            ich: 'wohne',
            du: 'wohnst',
            er: 'wohnt',
            wir: 'wohnen',
            ihr: 'wohnt',
            sie: 'wohnen',
        },
        past: {
            ich: 'wohnte',
            du: 'wohntest',
            er: 'wohnte',
            wir: 'wohnten',
            ihr: 'wohntet',
            sie: 'wohnten',
        },
        perfect: { auxiliary: 'haben', participle: 'gewohnt' },
        examples: [
            { german: 'Ich wohne in Berlin.', english: 'I live in Berlin.' },
            { german: 'Wo wohnst du?', english: 'Where do you live?' },
            { german: 'Wir wohnen zusammen.', english: 'We live together.' },
        ],
        notes: [
            'Used for residence/address',
            'Different from leben (to live/exist)',
        ],
    },

    // ==================== IRREGULAR/STRONG VERBS ====================
    {
        id: 'gehen',
        infinitive: 'gehen',
        meaning: 'to go, to walk',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'gehe',
            du: 'gehst',
            er: 'geht',
            wir: 'gehen',
            ihr: 'geht',
            sie: 'gehen',
        },
        past: {
            ich: 'ging',
            du: 'gingst',
            er: 'ging',
            wir: 'gingen',
            ihr: 'gingt',
            sie: 'gingen',
        },
        perfect: { auxiliary: 'sein', participle: 'gegangen' },
        imperative: { du: 'geh', ihr: 'geht', Sie: 'gehen Sie' },
        examples: [
            { german: 'Ich gehe zur Schule.', english: 'I go to school.' },
            { german: 'Wohin gehst du?', english: 'Where are you going?' },
            { german: 'Er ist nach Hause gegangen.', english: 'He went home.' },
        ],
        notes: [
            'Uses SEIN in perfect (motion verb)',
            'Stem changes completely in past: geh → ging',
            'Wie geht es dir? = How are you?',
        ],
    },
    {
        id: 'kommen',
        infinitive: 'kommen',
        meaning: 'to come',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'komme',
            du: 'kommst',
            er: 'kommt',
            wir: 'kommen',
            ihr: 'kommt',
            sie: 'kommen',
        },
        past: {
            ich: 'kam',
            du: 'kamst',
            er: 'kam',
            wir: 'kamen',
            ihr: 'kamt',
            sie: 'kamen',
        },
        perfect: { auxiliary: 'sein', participle: 'gekommen' },
        imperative: { du: 'komm', ihr: 'kommt', Sie: 'kommen Sie' },
        examples: [
            { german: 'Ich komme aus Deutschland.', english: 'I come from Germany.' },
            { german: 'Kommst du heute?', english: 'Are you coming today?' },
            { german: 'Er ist spät gekommen.', english: 'He came late.' },
        ],
        notes: [
            'Uses SEIN in perfect (motion verb)',
            'Vowel change in past: o → a',
            'Woher kommst du? = Where are you from?',
        ],
    },
    {
        id: 'sehen',
        infinitive: 'sehen',
        meaning: 'to see',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'sehe',
            du: 'siehst',
            er: 'sieht',
            wir: 'sehen',
            ihr: 'seht',
            sie: 'sehen',
        },
        past: {
            ich: 'sah',
            du: 'sahst',
            er: 'sah',
            wir: 'sahen',
            ihr: 'saht',
            sie: 'sahen',
        },
        perfect: { auxiliary: 'haben', participle: 'gesehen' },
        imperative: { du: 'sieh', ihr: 'seht', Sie: 'sehen Sie' },
        examples: [
            { german: 'Ich sehe den Film.', english: 'I see/watch the movie.' },
            { german: 'Siehst du das?', english: 'Do you see that?' },
            { german: 'Wir haben uns gesehen.', english: 'We saw each other.' },
        ],
        notes: [
            'Vowel change e → ie in du/er forms',
            'Same pattern as lesen, empfehlen',
            'fernsehen = to watch TV (separable)',
        ],
    },
    {
        id: 'essen',
        infinitive: 'essen',
        meaning: 'to eat',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'esse',
            du: 'isst',
            er: 'isst',
            wir: 'essen',
            ihr: 'esst',
            sie: 'essen',
        },
        past: {
            ich: 'aß',
            du: 'aßest',
            er: 'aß',
            wir: 'aßen',
            ihr: 'aßt',
            sie: 'aßen',
        },
        perfect: { auxiliary: 'haben', participle: 'gegessen' },
        imperative: { du: 'iss', ihr: 'esst', Sie: 'essen Sie' },
        examples: [
            { german: 'Ich esse Brot.', english: 'I eat bread.' },
            { german: 'Was isst du?', english: 'What are you eating?' },
            { german: 'Wir haben Pizza gegessen.', english: 'We ate pizza.' },
        ],
        notes: [
            'Vowel change e → i in du/er forms',
            'du isst (not esst) - note the extra s',
            'Past uses ß (Eszett)',
        ],
    },
    {
        id: 'fahren',
        infinitive: 'fahren',
        meaning: 'to drive, to travel',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'fahre',
            du: 'fährst',
            er: 'fährt',
            wir: 'fahren',
            ihr: 'fahrt',
            sie: 'fahren',
        },
        past: {
            ich: 'fuhr',
            du: 'fuhrst',
            er: 'fuhr',
            wir: 'fuhren',
            ihr: 'fuhrt',
            sie: 'fuhren',
        },
        perfect: { auxiliary: 'sein', participle: 'gefahren' },
        imperative: { du: 'fahr', ihr: 'fahrt', Sie: 'fahren Sie' },
        examples: [
            { german: 'Ich fahre Auto.', english: 'I drive a car.' },
            { german: 'Fährst du mit dem Zug?', english: 'Are you going by train?' },
            { german: 'Wir sind nach Berlin gefahren.', english: 'We drove/traveled to Berlin.' },
        ],
        notes: [
            'Vowel change a → ä in du/er forms',
            'Uses SEIN (motion verb)',
            'Same pattern: schlafen, tragen, waschen',
        ],
    },
    {
        id: 'sprechen',
        infinitive: 'sprechen',
        meaning: 'to speak',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'spreche',
            du: 'sprichst',
            er: 'spricht',
            wir: 'sprechen',
            ihr: 'sprecht',
            sie: 'sprechen',
        },
        past: {
            ich: 'sprach',
            du: 'sprachst',
            er: 'sprach',
            wir: 'sprachen',
            ihr: 'spracht',
            sie: 'sprachen',
        },
        perfect: { auxiliary: 'haben', participle: 'gesprochen' },
        imperative: { du: 'sprich', ihr: 'sprecht', Sie: 'sprechen Sie' },
        examples: [
            { german: 'Ich spreche Deutsch.', english: 'I speak German.' },
            { german: 'Sprichst du Englisch?', english: 'Do you speak English?' },
            { german: 'Er hat mit ihr gesprochen.', english: 'He spoke with her.' },
        ],
        notes: [
            'Vowel change e → i in du/er forms',
            'Same pattern: helfen, nehmen, treffen',
        ],
    },
    {
        id: 'geben',
        infinitive: 'geben',
        meaning: 'to give',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'gebe',
            du: 'gibst',
            er: 'gibt',
            wir: 'geben',
            ihr: 'gebt',
            sie: 'geben',
        },
        past: {
            ich: 'gab',
            du: 'gabst',
            er: 'gab',
            wir: 'gaben',
            ihr: 'gabt',
            sie: 'gaben',
        },
        perfect: { auxiliary: 'haben', participle: 'gegeben' },
        imperative: { du: 'gib', ihr: 'gebt', Sie: 'geben Sie' },
        examples: [
            { german: 'Ich gebe dir das Buch.', english: 'I give you the book.' },
            { german: 'Es gibt viele Leute.', english: 'There are many people.' },
            { german: 'Er hat mir Geld gegeben.', english: 'He gave me money.' },
        ],
        notes: [
            'Vowel change e → i in du/er forms',
            'es gibt + accusative = there is/are',
            'Takes dative for recipient',
        ],
    },
    {
        id: 'nehmen',
        infinitive: 'nehmen',
        meaning: 'to take',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'nehme',
            du: 'nimmst',
            er: 'nimmt',
            wir: 'nehmen',
            ihr: 'nehmt',
            sie: 'nehmen',
        },
        past: {
            ich: 'nahm',
            du: 'nahmst',
            er: 'nahm',
            wir: 'nahmen',
            ihr: 'nahmt',
            sie: 'nahmen',
        },
        perfect: { auxiliary: 'haben', participle: 'genommen' },
        imperative: { du: 'nimm', ihr: 'nehmt', Sie: 'nehmen Sie' },
        examples: [
            { german: 'Ich nehme den Bus.', english: 'I take the bus.' },
            { german: 'Nimmst du Zucker?', english: 'Do you take sugar?' },
            { german: 'Er hat das Buch genommen.', english: 'He took the book.' },
        ],
        notes: [
            'Double vowel/consonant change: e → i, h → mm',
            'Unusual participle: genommen',
        ],
    },
    {
        id: 'lesen',
        infinitive: 'lesen',
        meaning: 'to read',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'lese',
            du: 'liest',
            er: 'liest',
            wir: 'lesen',
            ihr: 'lest',
            sie: 'lesen',
        },
        past: {
            ich: 'las',
            du: 'lasest',
            er: 'las',
            wir: 'lasen',
            ihr: 'last',
            sie: 'lasen',
        },
        perfect: { auxiliary: 'haben', participle: 'gelesen' },
        imperative: { du: 'lies', ihr: 'lest', Sie: 'lesen Sie' },
        examples: [
            { german: 'Ich lese ein Buch.', english: 'I am reading a book.' },
            { german: 'Liest du gern?', english: 'Do you like to read?' },
            { german: 'Er hat die Zeitung gelesen.', english: 'He read the newspaper.' },
        ],
        notes: [
            'Vowel change e → ie in du/er forms',
            'Same pattern as sehen',
        ],
    },
    {
        id: 'schreiben',
        infinitive: 'schreiben',
        meaning: 'to write',
        level: 'A1',
        type: 'irregular',
        category: 'Irregular Verbs',
        present: {
            ich: 'schreibe',
            du: 'schreibst',
            er: 'schreibt',
            wir: 'schreiben',
            ihr: 'schreibt',
            sie: 'schreiben',
        },
        past: {
            ich: 'schrieb',
            du: 'schriebst',
            er: 'schrieb',
            wir: 'schrieben',
            ihr: 'schriebt',
            sie: 'schrieben',
        },
        perfect: { auxiliary: 'haben', participle: 'geschrieben' },
        imperative: { du: 'schreib', ihr: 'schreibt', Sie: 'schreiben Sie' },
        examples: [
            { german: 'Ich schreibe einen Brief.', english: 'I am writing a letter.' },
            { german: 'Schreibst du mir?', english: 'Will you write to me?' },
            { german: 'Er hat das Buch geschrieben.', english: 'He wrote the book.' },
        ],
        notes: [
            'Regular in present, irregular in past',
            'Vowel change ei → ie in past',
        ],
    },

    // ==================== SEPARABLE VERBS ====================
    {
        id: 'aufstehen',
        infinitive: 'aufstehen',
        meaning: 'to get up, to stand up',
        level: 'A1',
        type: 'separable',
        category: 'Separable Verbs',
        present: {
            ich: 'stehe auf',
            du: 'stehst auf',
            er: 'steht auf',
            wir: 'stehen auf',
            ihr: 'steht auf',
            sie: 'stehen auf',
        },
        past: {
            ich: 'stand auf',
            du: 'standst auf',
            er: 'stand auf',
            wir: 'standen auf',
            ihr: 'standet auf',
            sie: 'standen auf',
        },
        perfect: { auxiliary: 'sein', participle: 'aufgestanden' },
        examples: [
            { german: 'Ich stehe um 7 Uhr auf.', english: 'I get up at 7 o\'clock.' },
            { german: 'Wann stehst du auf?', english: 'When do you get up?' },
            { german: 'Er ist früh aufgestanden.', english: 'He got up early.' },
        ],
        notes: [
            'Prefix "auf" goes to the end in main clause',
            'Prefix stays attached with modal verbs',
            'Participle: prefix + ge + stem + en',
        ],
    },
    {
        id: 'anfangen',
        infinitive: 'anfangen',
        meaning: 'to begin, to start',
        level: 'A1',
        type: 'separable',
        category: 'Separable Verbs',
        present: {
            ich: 'fange an',
            du: 'fängst an',
            er: 'fängt an',
            wir: 'fangen an',
            ihr: 'fangt an',
            sie: 'fangen an',
        },
        past: {
            ich: 'fing an',
            du: 'fingst an',
            er: 'fing an',
            wir: 'fingen an',
            ihr: 'fingt an',
            sie: 'fingen an',
        },
        perfect: { auxiliary: 'haben', participle: 'angefangen' },
        examples: [
            { german: 'Der Film fängt um 8 an.', english: 'The movie starts at 8.' },
            { german: 'Ich fange morgen an.', english: 'I start tomorrow.' },
            { german: 'Wir haben angefangen.', english: 'We have started.' },
        ],
        notes: [
            'Base verb "fangen" has vowel change a → ä',
            'Common separable prefixes: an-, auf-, aus-, ein-, mit-, zu-',
        ],
    },
    {
        id: 'einkaufen',
        infinitive: 'einkaufen',
        meaning: 'to shop, to buy',
        level: 'A1',
        type: 'separable',
        category: 'Separable Verbs',
        present: {
            ich: 'kaufe ein',
            du: 'kaufst ein',
            er: 'kauft ein',
            wir: 'kaufen ein',
            ihr: 'kauft ein',
            sie: 'kaufen ein',
        },
        past: {
            ich: 'kaufte ein',
            du: 'kauftest ein',
            er: 'kaufte ein',
            wir: 'kauften ein',
            ihr: 'kauftet ein',
            sie: 'kauften ein',
        },
        perfect: { auxiliary: 'haben', participle: 'eingekauft' },
        examples: [
            { german: 'Ich kaufe im Supermarkt ein.', english: 'I shop at the supermarket.' },
            { german: 'Gehst du einkaufen?', english: 'Are you going shopping?' },
            { german: 'Sie hat Lebensmittel eingekauft.', english: 'She bought groceries.' },
        ],
        notes: [
            'Base verb "kaufen" is regular',
            'ein- means "in"',
        ],
    },

    // ==================== REFLEXIVE VERBS ====================
    {
        id: 'sich_waschen',
        infinitive: 'sich waschen',
        meaning: 'to wash (oneself)',
        level: 'A2',
        type: 'reflexive',
        category: 'Reflexive Verbs',
        present: {
            ich: 'wasche mich',
            du: 'wäschst dich',
            er: 'wäscht sich',
            wir: 'waschen uns',
            ihr: 'wascht euch',
            sie: 'waschen sich',
        },
        past: {
            ich: 'wusch mich',
            du: 'wuschst dich',
            er: 'wusch sich',
            wir: 'wuschen uns',
            ihr: 'wuscht euch',
            sie: 'wuschen sich',
        },
        perfect: { auxiliary: 'haben', participle: 'gewaschen' },
        examples: [
            { german: 'Ich wasche mich.', english: 'I wash myself.' },
            { german: 'Er wäscht sich die Hände.', english: 'He washes his hands.' },
            { german: 'Hast du dich gewaschen?', english: 'Did you wash yourself?' },
        ],
        notes: [
            'Reflexive pronouns: mich, dich, sich, uns, euch, sich',
            'Base verb has vowel change a → ä',
            'With body parts: use dative reflexive + accusative body part',
        ],
    },
    {
        id: 'sich_freuen',
        infinitive: 'sich freuen',
        meaning: 'to be happy, to look forward to',
        level: 'A2',
        type: 'reflexive',
        category: 'Reflexive Verbs',
        present: {
            ich: 'freue mich',
            du: 'freust dich',
            er: 'freut sich',
            wir: 'freuen uns',
            ihr: 'freut euch',
            sie: 'freuen sich',
        },
        past: {
            ich: 'freute mich',
            du: 'freutest dich',
            er: 'freute sich',
            wir: 'freuten uns',
            ihr: 'freutet euch',
            sie: 'freuten sich',
        },
        perfect: { auxiliary: 'haben', participle: 'gefreut' },
        examples: [
            { german: 'Ich freue mich!', english: 'I\'m happy!' },
            { german: 'Ich freue mich auf das Wochenende.', english: 'I\'m looking forward to the weekend.' },
            { german: 'Er freut sich über das Geschenk.', english: 'He\'s happy about the gift.' },
        ],
        notes: [
            'sich freuen auf + acc = to look forward to',
            'sich freuen über + acc = to be happy about',
            'Regular verb with reflexive pronoun',
        ],
    },
];

// Helper functions
export const getVerbsByLevel = (level: CEFRLevel): VerbData[] => {
    return verbsData.filter(v => v.level === level);
};

export const getVerbsByType = (type: VerbData['type']): VerbData[] => {
    return verbsData.filter(v => v.type === type);
};

export const getVerbsByCategory = (category: string): VerbData[] => {
    return verbsData.filter(v => v.category === category);
};

export const getVerbCategories = (): string[] => {
    return [...new Set(verbsData.map(v => v.category))];
};

export const searchVerbs = (query: string): VerbData[] => {
    const q = query.toLowerCase();
    return verbsData.filter(v =>
        v.infinitive.toLowerCase().includes(q) ||
        v.meaning.toLowerCase().includes(q)
    );
};
