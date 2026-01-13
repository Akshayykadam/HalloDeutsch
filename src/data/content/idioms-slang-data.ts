// German Idioms and Slang Data
import { CEFRLevel } from '../../types';

export interface GermanIdiom {
    id: string;
    german: string;
    literal: string;
    meaning: string;
    example: string;
    exampleTranslation: string;
    level: CEFRLevel;
    category: 'animal' | 'food' | 'body' | 'weather' | 'everyday' | 'feelings' | 'work';
    usage: 'common' | 'occasional' | 'rare';
}

export const germanIdioms: GermanIdiom[] = [
    // === Common Everyday Idioms ===
    {
        id: 'idiom-001',
        german: 'Das ist mir Wurst!',
        literal: 'That is sausage to me!',
        meaning: 'I don\'t care / It doesn\'t matter to me',
        example: 'Pizza oder Pasta? - Das ist mir Wurst!',
        exampleTranslation: 'Pizza or pasta? - I don\'t care!',
        level: 'A2',
        category: 'food',
        usage: 'common',
    },
    {
        id: 'idiom-002',
        german: 'Ich verstehe nur Bahnhof',
        literal: 'I only understand train station',
        meaning: 'I don\'t understand anything',
        example: 'Kannst du das erklären? Ich verstehe nur Bahnhof.',
        exampleTranslation: 'Can you explain that? I don\'t understand anything.',
        level: 'A2',
        category: 'everyday',
        usage: 'common',
    },
    {
        id: 'idiom-003',
        german: 'Da steppt der Bär!',
        literal: 'The bear is tap-dancing there!',
        meaning: 'The party is really going / It\'s very lively',
        example: 'Komm zur Party! Da steppt der Bär!',
        exampleTranslation: 'Come to the party! It\'s going to be lit!',
        level: 'B1',
        category: 'everyday',
        usage: 'common',
    },
    {
        id: 'idiom-004',
        german: 'Daumen drücken',
        literal: 'To press thumbs',
        meaning: 'To wish someone luck (like crossing fingers)',
        example: 'Ich drücke dir die Daumen für die Prüfung!',
        exampleTranslation: 'I\'m crossing my fingers for your exam!',
        level: 'A2',
        category: 'body',
        usage: 'common',
    },
    {
        id: 'idiom-005',
        german: 'Alles in Butter',
        literal: 'Everything in butter',
        meaning: 'Everything is fine/okay',
        example: 'Wie geht\'s? - Alles in Butter!',
        exampleTranslation: 'How are you? - Everything\'s fine!',
        level: 'A2',
        category: 'food',
        usage: 'common',
    },

    // === Animal Idioms ===
    {
        id: 'idiom-006',
        german: 'Ich habe einen Kater',
        literal: 'I have a tomcat',
        meaning: 'I have a hangover',
        example: 'Nach der Party hatte ich einen schlimmen Kater.',
        exampleTranslation: 'After the party, I had a terrible hangover.',
        level: 'A2',
        category: 'animal',
        usage: 'common',
    },
    {
        id: 'idiom-007',
        german: 'Da liegt der Hund begraben',
        literal: 'That\'s where the dog is buried',
        meaning: 'That\'s the crux of the matter / the real issue',
        example: 'Ah, da liegt der Hund begraben!',
        exampleTranslation: 'Ah, that\'s the real issue!',
        level: 'B1',
        category: 'animal',
        usage: 'occasional',
    },
    {
        id: 'idiom-008',
        german: 'Schwein haben',
        literal: 'To have pig',
        meaning: 'To be lucky',
        example: 'Du hast den letzten Zug erwischt! Schwein gehabt!',
        exampleTranslation: 'You caught the last train! Lucky you!',
        level: 'A2',
        category: 'animal',
        usage: 'common',
    },
    {
        id: 'idiom-009',
        german: 'Jemandem einen Bären aufbinden',
        literal: 'To tie a bear onto someone',
        meaning: 'To lie to someone / tell tall tales',
        example: 'Er hat mir einen Bären aufgebunden!',
        exampleTranslation: 'He lied to me!',
        level: 'B2',
        category: 'animal',
        usage: 'occasional',
    },
    {
        id: 'idiom-010',
        german: 'Die Katze aus dem Sack lassen',
        literal: 'To let the cat out of the bag',
        meaning: 'To reveal a secret',
        example: 'Okay, ich lasse die Katze aus dem Sack: Wir heiraten!',
        exampleTranslation: 'Okay, I\'ll let the cat out of the bag: We\'re getting married!',
        level: 'B1',
        category: 'animal',
        usage: 'common',
    },

    // === Body Idioms ===
    {
        id: 'idiom-011',
        german: 'Hals- und Beinbruch!',
        literal: 'Neck and leg break!',
        meaning: 'Break a leg! / Good luck!',
        example: 'Dein Auftritt ist heute! Hals- und Beinbruch!',
        exampleTranslation: 'Your performance is today! Break a leg!',
        level: 'A2',
        category: 'body',
        usage: 'common',
    },
    {
        id: 'idiom-012',
        german: 'Einen dicken Kopf haben',
        literal: 'To have a thick head',
        meaning: 'To have a headache (often from a hangover)',
        example: 'Ich habe heute einen dicken Kopf.',
        exampleTranslation: 'I have a massive headache today.',
        level: 'B1',
        category: 'body',
        usage: 'occasional',
    },
    {
        id: 'idiom-013',
        german: 'Jemanden auf den Arm nehmen',
        literal: 'To take someone on the arm',
        meaning: 'To pull someone\'s leg / tease someone',
        example: 'Du nimmst mich auf den Arm, oder?',
        exampleTranslation: 'You\'re pulling my leg, right?',
        level: 'B1',
        category: 'body',
        usage: 'common',
    },

    // === Weather Idioms ===
    {
        id: 'idiom-014',
        german: 'Bei dir piept\'s wohl!',
        literal: 'It\'s beeping with you!',
        meaning: 'You must be crazy! / Are you nuts?',
        example: 'Du willst 100 Euro für das T-Shirt? Bei dir piept\'s wohl!',
        exampleTranslation: 'You want 100 euros for that T-shirt? Are you crazy?',
        level: 'B1',
        category: 'everyday',
        usage: 'common',
    },
    {
        id: 'idiom-015',
        german: 'Unter einer Decke stecken',
        literal: 'To be under the same blanket',
        meaning: 'To be in cahoots / conspiring together',
        example: 'Die beiden stecken unter einer Decke.',
        exampleTranslation: 'Those two are in cahoots.',
        level: 'B2',
        category: 'everyday',
        usage: 'occasional',
    },

    // === Feelings Idioms ===
    {
        id: 'idiom-016',
        german: 'Die Nase voll haben',
        literal: 'To have the full nose',
        meaning: 'To be fed up with something',
        example: 'Ich habe die Nase voll von diesem Wetter!',
        exampleTranslation: 'I\'m fed up with this weather!',
        level: 'A2',
        category: 'feelings',
        usage: 'common',
    },
    {
        id: 'idiom-017',
        german: 'Auf Wolke sieben schweben',
        literal: 'To float on cloud seven',
        meaning: 'To be on cloud nine / very happy',
        example: 'Seit sie verliebt ist, schwebt sie auf Wolke sieben.',
        exampleTranslation: 'Since she fell in love, she\'s been on cloud nine.',
        level: 'B1',
        category: 'feelings',
        usage: 'common',
    },
    {
        id: 'idiom-018',
        german: 'Mir fällt ein Stein vom Herzen',
        literal: 'A stone falls from my heart',
        meaning: 'I\'m relieved / A weight off my shoulders',
        example: 'Du hast die Prüfung bestanden? Mir fällt ein Stein vom Herzen!',
        exampleTranslation: 'You passed the exam? What a relief!',
        level: 'B1',
        category: 'feelings',
        usage: 'common',
    },

    // === Work Idioms ===
    {
        id: 'idiom-019',
        german: 'Kleinvieh macht auch Mist',
        literal: 'Small livestock also makes manure',
        meaning: 'Every little bit counts / Small amounts add up',
        example: 'Ein Euro pro Tag? Kleinvieh macht auch Mist!',
        exampleTranslation: 'One euro per day? Every little bit adds up!',
        level: 'B1',
        category: 'work',
        usage: 'common',
    },
    {
        id: 'idiom-020',
        german: 'Auf dem Holzweg sein',
        literal: 'To be on the wood path',
        meaning: 'To be on the wrong track / mistaken',
        example: 'Wenn du denkst, ich helfe dir, bist du auf dem Holzweg.',
        exampleTranslation: 'If you think I\'ll help you, you\'re mistaken.',
        level: 'B1',
        category: 'work',
        usage: 'common',
    },

    // === Slang Expressions ===
    {
        id: 'slang-001',
        german: 'Geil!',
        literal: '(Originally vulgar, now casual)',
        meaning: 'Cool! / Awesome!',
        example: 'Die Party gestern war echt geil!',
        exampleTranslation: 'The party yesterday was really awesome!',
        level: 'A2',
        category: 'feelings',
        usage: 'common',
    },
    {
        id: 'slang-002',
        german: 'Krass!',
        literal: 'Crass',
        meaning: 'Wow! / Crazy! / Intense!',
        example: 'Du hast das alleine gemacht? Krass!',
        exampleTranslation: 'You did that alone? Wow!',
        level: 'A2',
        category: 'feelings',
        usage: 'common',
    },
    {
        id: 'slang-003',
        german: 'Ich hab keinen Bock',
        literal: 'I have no billy goat',
        meaning: 'I don\'t feel like it / I can\'t be bothered',
        example: 'Kommst du mit? - Nee, ich hab keinen Bock.',
        exampleTranslation: 'Are you coming? - Nah, I don\'t feel like it.',
        level: 'A2',
        category: 'feelings',
        usage: 'common',
    },
    {
        id: 'slang-004',
        german: 'Mega!',
        literal: 'Mega',
        meaning: 'Really/Super (intensifier)',
        example: 'Das Konzert war mega gut!',
        exampleTranslation: 'The concert was really good!',
        level: 'A1',
        category: 'feelings',
        usage: 'common',
    },
    {
        id: 'slang-005',
        german: 'Was geht ab?',
        literal: 'What goes off?',
        meaning: 'What\'s up? / What\'s happening?',
        example: 'Hey! Was geht ab?',
        exampleTranslation: 'Hey! What\'s up?',
        level: 'A2',
        category: 'everyday',
        usage: 'common',
    },
];

export const getIdiomsByLevel = (level: CEFRLevel): GermanIdiom[] => {
    return germanIdioms.filter(idiom => idiom.level === level);
};

export const getIdiomsByCategory = (category: GermanIdiom['category']): GermanIdiom[] => {
    return germanIdioms.filter(idiom => idiom.category === category);
};

export const getRandomIdioms = (count: number = 10): GermanIdiom[] => {
    const shuffled = [...germanIdioms].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const idiomCategories: { key: GermanIdiom['category']; label: string; icon: string }[] = [
    { key: 'animal', label: 'Animals', icon: 'paw-outline' },
    { key: 'food', label: 'Food', icon: 'nutrition-outline' },
    { key: 'body', label: 'Body', icon: 'body-outline' },
    { key: 'weather', label: 'Weather', icon: 'cloud-outline' },
    { key: 'everyday', label: 'Everyday', icon: 'home-outline' },
    { key: 'feelings', label: 'Feelings', icon: 'happy-outline' },
    { key: 'work', label: 'Work', icon: 'briefcase-outline' },
];
