export interface CulturalTip {
    id: string;
    category: 'etiquette' | 'recycling' | 'transport' | 'dos-donts' | 'food' | 'work';
    title: string;
    titleDe: string;
    icon: string; // Changed from emoji
    content: string;
    germanPhrase?: string;
    germanPhraseTranslation?: string;
    didYouKnow?: string;
    importance: 'essential' | 'helpful' | 'interesting';
}

export const culturalTips: CulturalTip[] = [
    // === Etiquette ===
    {
        id: 'etiq-001',
        category: 'etiquette',
        title: 'Punctuality is Key',
        titleDe: 'Pünktlichkeit ist wichtig',
        icon: 'time-outline',
        content: 'Germans value punctuality highly. Being on time shows respect. If you\'re running late, always call ahead to inform the other person.',
        germanPhrase: 'Ich komme 10 Minuten später.',
        germanPhraseTranslation: 'I\'m arriving 10 minutes late.',
        didYouKnow: 'In business settings, arriving even 5 minutes late is considered unprofessional.',
        importance: 'essential',
    },
    {
        id: 'etiq-002',
        category: 'etiquette',
        title: 'The Art of Greeting',
        titleDe: 'Die Kunst der Begrüßung',
        icon: 'hand-left-outline',
        content: 'A firm handshake is the standard greeting in professional settings. Maintain eye contact while greeting. Among friends, hugs or cheek kisses may be appropriate.',
        germanPhrase: 'Freut mich, Sie kennenzulernen.',
        germanPhraseTranslation: 'Nice to meet you.',
        importance: 'essential',
    },
    {
        id: 'etiq-003',
        category: 'etiquette',
        title: 'Sie vs. Du',
        titleDe: 'Sie oder Du?',
        icon: 'person-outline',
        content: 'Use "Sie" (formal you) with strangers, colleagues, and in professional settings. Only switch to "Du" when offered. The older or higher-ranking person typically offers the "Du."',
        germanPhrase: 'Wollen wir uns duzen?',
        germanPhraseTranslation: 'Shall we use "du" with each other?',
        didYouKnow: 'In some modern startups, everyone uses "Du" from day one.',
        importance: 'essential',
    },
    {
        id: 'etiq-004',
        category: 'etiquette',
        title: 'Sunday is Quiet Day',
        titleDe: 'Sonntagsruhe',
        icon: 'volume-mute-outline',
        content: 'Sundays are traditionally quiet days. Avoid loud activities like mowing the lawn, noisy DIY projects, or loud music. Most shops are closed.',
        germanPhrase: 'Ruhezeit beachten!',
        germanPhraseTranslation: 'Observe quiet hours!',
        didYouKnow: 'The Ruhezeit (quiet time) is often from 1-3 PM and after 10 PM on weekdays too.',
        importance: 'essential',
    },
    {
        id: 'etiq-005',
        category: 'etiquette',
        title: 'Birthday Wishes',
        titleDe: 'Geburtstagswünsche',
        icon: 'gift-outline',
        content: 'Never wish someone happy birthday before the actual day! It\'s considered bad luck. Also, the birthday person often brings cake to work.',
        germanPhrase: 'Alles Gute zum Geburtstag!',
        germanPhraseTranslation: 'Happy Birthday!',
        importance: 'helpful',
    },

    // === Recycling ===
    {
        id: 'recycle-001',
        category: 'recycling',
        title: 'Mülltrennung Basics',
        titleDe: 'Grundlagen der Mülltrennung',
        icon: 'trash-outline',
        content: 'Germany has strict recycling rules. You\'ll typically have bins for: paper (blue), packaging (yellow), glass (by color), organic waste (brown), and regular waste (black).',
        didYouKnow: 'Germany recycles about 70% of its waste - one of the highest rates in the world.',
        importance: 'essential',
    },
    {
        id: 'recycle-002',
        category: 'recycling',
        title: 'Pfand System',
        titleDe: 'Das Pfandsystem',
        icon: 'sync-outline',
        content: 'Most bottles and cans have a deposit (Pfand). Return them at supermarket machines to get your money back. Single-use plastic: 25 cents. Reusable: 8-15 cents.',
        germanPhrase: 'Wo ist der Pfandautomat?',
        germanPhraseTranslation: 'Where is the bottle return machine?',
        importance: 'essential',
    },
    {
        id: 'recycle-003',
        category: 'recycling',
        title: 'Glass Container Rules',
        titleDe: 'Glascontainer-Regeln',
        icon: 'wine-outline',
        content: 'Glass is sorted by color: white, green, and brown. Only throw glass in containers during allowed hours (usually not Sundays or late evenings).',
        didYouKnow: 'Blue glass goes in the green container!',
        importance: 'helpful',
    },
    {
        id: 'recycle-004',
        category: 'recycling',
        title: 'Organic Waste',
        titleDe: 'Bioabfall',
        icon: 'leaf-outline',
        content: 'Organic waste (Bioabfall) includes food scraps, coffee grounds, and garden waste. No plastic bags allowed - use paper or compostable bags.',
        germanPhrase: 'Das gehört in die Biotonne.',
        germanPhraseTranslation: 'That goes in the organic bin.',
        importance: 'helpful',
    },

    // === Transport ===
    {
        id: 'trans-001',
        category: 'transport',
        title: 'Validate Your Ticket',
        titleDe: 'Ticket entwerten',
        icon: 'ticket-outline',
        content: 'Always validate your ticket before boarding or at the start of your journey. Controllers (Kontrolleure) can fine you €60 or more for invalid tickets.',
        germanPhrase: 'Bitte den Fahrschein entwerten!',
        germanPhraseTranslation: 'Please validate your ticket!',
        importance: 'essential',
    },
    {
        id: 'trans-002',
        category: 'transport',
        title: 'Right Side Standing',
        titleDe: 'Rechts stehen',
        icon: 'arrow-forward-outline',
        content: 'On escalators, stand on the right and walk on the left. This unwritten rule is strictly followed, especially in busy cities.',
        didYouKnow: 'Breaking this rule might earn you annoyed looks and comments!',
        importance: 'essential',
    },
    {
        id: 'trans-003',
        category: 'transport',
        title: 'The 49-Euro Ticket',
        titleDe: 'Das 49-Euro-Ticket',
        icon: 'card-outline',
        content: 'The Deutschlandticket allows unlimited travel on local and regional public transport throughout Germany for €49/month.',
        germanPhrase: 'Gilt das Deutschlandticket hier?',
        germanPhraseTranslation: 'Is the Deutschlandticket valid here?',
        importance: 'helpful',
    },
    {
        id: 'trans-004',
        category: 'transport',
        title: 'Bicycle Culture',
        titleDe: 'Fahrradkultur',
        icon: 'bicycle-outline',
        content: 'Cycling is huge in Germany. Use bike lanes where available, have proper lights, and always lock your bike securely. A good lock is essential!',
        didYouKnow: 'There are more bikes than cars in many German cities.',
        importance: 'helpful',
    },
    {
        id: 'trans-005',
        category: 'transport',
        title: 'Autobahn Rules',
        titleDe: 'Autobahnregeln',
        icon: 'car-sport-outline',
        content: 'While some sections have no speed limit, safety comes first. Always check for faster cars when overtaking. The left lane is for passing only.',
        germanPhrase: 'Rechts überholen verboten!',
        germanPhraseTranslation: 'Overtaking on the right is forbidden!',
        importance: 'helpful',
    },

    // === Do's and Don'ts ===
    {
        id: 'dos-001',
        category: 'dos-donts',
        title: 'Cash is King',
        titleDe: 'Bargeld ist König',
        icon: 'cash-outline',
        content: 'Many German shops, restaurants, and cafes only accept cash. Always carry some euros with you, especially in smaller cities.',
        germanPhrase: 'Kann ich bar zahlen?',
        germanPhraseTranslation: 'Can I pay in cash?',
        didYouKnow: 'Germans use cash for about 60% of transactions.',
        importance: 'essential',
    },
    {
        id: 'dos-002',
        category: 'dos-donts',
        title: 'Don\'t Jay-Walk',
        titleDe: 'Nicht bei Rot gehen',
        icon: 'walk-outline',
        content: 'Wait for the green light at pedestrian crossings, even if the street is empty. It\'s especially important when children are around - set a good example!',
        didYouKnow: 'You can be fined €5 for crossing on red, more if it causes an accident.',
        importance: 'essential',
    },
    {
        id: 'dos-003',
        category: 'dos-donts',
        title: 'Register Your Address',
        titleDe: 'Anmeldung',
        icon: 'document-text-outline',
        content: 'Within two weeks of moving to Germany, you must register your address at the local Bürgeramt (citizen\'s office). This is legally required.',
        germanPhrase: 'Ich möchte mich anmelden.',
        germanPhraseTranslation: 'I would like to register my address.',
        importance: 'essential',
    },
    {
        id: 'dos-004',
        category: 'dos-donts',
        title: 'Eye Contact When Toasting',
        titleDe: 'Blickkontakt beim Anstoßen',
        icon: 'beer-outline',
        content: 'When clinking glasses, always make eye contact with each person. Not doing so is said to bring 7 years of bad luck!',
        germanPhrase: 'Prost! / Zum Wohl!',
        germanPhraseTranslation: 'Cheers!',
        importance: 'helpful',
    },
    {
        id: 'dos-005',
        category: 'dos-donts',
        title: 'Bring Houseplants as Gifts',
        titleDe: 'Gastgeschenke',
        icon: 'flower-outline',
        content: 'When invited to someone\'s home, bring a small gift: flowers, wine, or chocolates. Unwrap flowers before giving them. Avoid lilies (funerals) and red roses (romantic).',
        germanPhrase: 'Das ist für Sie / für dich.',
        germanPhraseTranslation: 'This is for you.',
        importance: 'helpful',
    },

    // === Food ===
    {
        id: 'food-001',
        category: 'food',
        title: 'Bread Paradise',
        titleDe: 'Brotparadies',
        icon: 'nutrition-outline',
        content: 'Germany has over 3,000 registered bread varieties. Bakeries (Bäckerei) open early and are found everywhere. Try different breads - each region has specialties!',
        germanPhrase: 'Welches Brot empfehlen Sie?',
        germanPhraseTranslation: 'Which bread do you recommend?',
        didYouKnow: 'German bread culture is on the UNESCO heritage list.',
        importance: 'interesting',
    },
    {
        id: 'food-002',
        category: 'food',
        title: 'Sparkling Water Default',
        titleDe: 'Sprudelwasser',
        icon: 'water-outline',
        content: 'When ordering water in Germany, you\'ll usually get sparkling (mit Gas) unless you specifically ask for still water (ohne Gas / stilles Wasser).',
        germanPhrase: 'Stilles Wasser, bitte.',
        germanPhraseTranslation: 'Still water, please.',
        importance: 'helpful',
    },
    {
        id: 'food-003',
        category: 'food',
        title: 'Meal Times',
        titleDe: 'Essenszeiten',
        icon: 'time-outline',
        content: 'Germans typically eat: breakfast 7-9 AM, lunch 12-1 PM (often warm), coffee time 3-4 PM (Kaffee und Kuchen), dinner 6-7 PM (often cold/sandwiches).',
        germanPhrase: 'Guten Appetit!',
        germanPhraseTranslation: 'Enjoy your meal!',
        didYouKnow: 'Many Germans have a cold dinner (Abendbrot) with bread, cheese, and cold cuts.',
        importance: 'interesting',
    },

    // === Work ===
    {
        id: 'work-001',
        category: 'work',
        title: 'Work-Life Balance',
        titleDe: 'Work-Life-Balance',
        icon: 'home-outline',
        content: 'Germans typically work around 38-40 hours per week. Overtime isn\'t expected. After work hours and vacations are respected - don\'t expect immediate email replies.',
        didYouKnow: 'Germany has a minimum of 24 paid vacation days by law!',
        importance: 'helpful',
    },
    {
        id: 'work-002',
        category: 'work',
        title: 'The Lunch Break',
        titleDe: 'Die Mittagspause',
        icon: 'fast-food-outline',
        content: 'Lunch breaks typically last 30-60 minutes. Many employees eat in the cafeteria (Kantine) or bring food. Eating at your desk is less common than in other countries.',
        germanPhrase: 'Gehen wir zusammen essen?',
        germanPhraseTranslation: 'Shall we go eat together?',
        importance: 'interesting',
    },
];

// Quiz questions about German culture
export interface CultureQuiz {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    relatedTipId: string;
}

export const cultureQuizQuestions: CultureQuiz[] = [
    {
        id: 'quiz-001',
        question: 'What should you do on escalators in Germany?',
        options: [
            'Stand wherever you want',
            'Stand on the right, walk on the left',
            'Stand on the left, walk on the right',
            'Always walk on both sides',
        ],
        correctAnswer: 'Stand on the right, walk on the left',
        explanation: 'Standing on the right allows people in a hurry to walk past on the left.',
        relatedTipId: 'trans-002',
    },
    {
        id: 'quiz-002',
        question: 'How long do you have to register your address after moving to Germany?',
        options: [
            'One week',
            'Two weeks',
            'One month',
            'Three months',
        ],
        correctAnswer: 'Two weeks',
        explanation: 'The Anmeldung (registration) must be done within 14 days of moving.',
        relatedTipId: 'dos-003',
    },
    {
        id: 'quiz-003',
        question: 'What\'s special about Sundays in Germany?',
        options: [
            'Everything is open 24 hours',
            'It\'s a quiet day - shops closed, no loud activities',
            'It\'s the main shopping day',
            'Banks are open for special services',
        ],
        correctAnswer: 'It\'s a quiet day - shops closed, no loud activities',
        explanation: 'Sonntagsruhe (Sunday rest) is taken seriously in Germany.',
        relatedTipId: 'etiq-004',
    },
    {
        id: 'quiz-004',
        question: 'What should you do when toasting with drinks?',
        options: [
            'Look away shyly',
            'Close your eyes',
            'Make eye contact with each person',
            'Look at your drink',
        ],
        correctAnswer: 'Make eye contact with each person',
        explanation: 'Not making eye contact is said to bring 7 years of bad luck!',
        relatedTipId: 'dos-004',
    },
    {
        id: 'quiz-005',
        question: 'What is Pfand?',
        options: [
            'A type of bread',
            'A bottle deposit system',
            'A train ticket',
            'A greeting',
        ],
        correctAnswer: 'A bottle deposit system',
        explanation: 'You pay a deposit on bottles and get it back when you return them.',
        relatedTipId: 'recycle-002',
    },
];

export const getTipsByCategory = (category: CulturalTip['category']): CulturalTip[] => {
    return culturalTips.filter(tip => tip.category === category);
};

export const getEssentialTips = (): CulturalTip[] => {
    return culturalTips.filter(tip => tip.importance === 'essential');
};

export const getRandomQuizQuestions = (count: number = 5): CultureQuiz[] => {
    const shuffled = [...cultureQuizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const categories: { key: CulturalTip['category']; label: string; icon: string }[] = [
    { key: 'etiquette', label: 'Etiquette', icon: 'people-outline' },
    { key: 'recycling', label: 'Recycling', icon: 'leaf-outline' },
    { key: 'transport', label: 'Transport', icon: 'train-outline' },
    { key: 'dos-donts', label: "Do's & Don'ts", icon: 'alert-circle-outline' },
    { key: 'food', label: 'Food & Drink', icon: 'restaurant-outline' },
    { key: 'work', label: 'Work Life', icon: 'briefcase-outline' },
];
