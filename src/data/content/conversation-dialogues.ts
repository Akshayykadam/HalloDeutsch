// Conversation Practice Dialogues
// Realistic German dialogues for different scenarios

import { CEFRLevel } from '../../types';

export interface DialogueLine {
    speaker: string;
    german: string;
    english: string;
    audio?: boolean;
}

export interface ConversationDialogue {
    id: string;
    level: CEFRLevel;
    title: string;
    titleDe: string;
    scenario: string;
    lines: DialogueLine[];
    keyPhrases: KeyPhrase[];
    culturalNote?: string;
}

export interface KeyPhrase {
    german: string;
    english: string;
    usage: string;
}

// ============================================
// A1 DIALOGUES - Basic conversations
// ============================================

export const a1Dialogues: ConversationDialogue[] = [
    {
        id: 'convo-a1-01',
        level: 'A1',
        title: 'Meeting Someone',
        titleDe: 'Jemanden kennenlernen',
        scenario: 'You meet a new person at a party',
        lines: [
            { speaker: 'A', german: 'Hallo! Ich bin Anna. Wie heißt du?', english: 'Hello! I am Anna. What is your name?' },
            { speaker: 'B', german: 'Hallo! Ich heiße Thomas. Freut mich!', english: 'Hello! My name is Thomas. Nice to meet you!' },
            { speaker: 'A', german: 'Woher kommst du?', english: 'Where are you from?' },
            { speaker: 'B', german: 'Ich komme aus Berlin. Und du?', english: 'I come from Berlin. And you?' },
            { speaker: 'A', german: 'Ich komme aus München. Was machst du beruflich?', english: 'I come from Munich. What do you do for work?' },
            { speaker: 'B', german: 'Ich bin Student. Ich studiere Informatik.', english: 'I am a student. I study computer science.' },
            { speaker: 'A', german: 'Interessant! Wie alt bist du?', english: 'Interesting! How old are you?' },
            { speaker: 'B', german: 'Ich bin 24 Jahre alt.', english: 'I am 24 years old.' },
        ],
        keyPhrases: [
            { german: 'Wie heißt du?', english: 'What is your name?', usage: 'Informal greeting' },
            { german: 'Woher kommst du?', english: 'Where are you from?', usage: 'Asking about origin' },
            { german: 'Freut mich!', english: 'Nice to meet you!', usage: 'Polite response' },
            { german: 'Was machst du beruflich?', english: 'What do you do for work?', usage: 'Asking about profession' },
        ],
    },
    {
        id: 'convo-a1-02',
        level: 'A1',
        title: 'At the Café',
        titleDe: 'Im Café',
        scenario: 'Ordering at a café',
        lines: [
            { speaker: 'Kellner', german: 'Guten Tag! Was möchten Sie bestellen?', english: 'Good day! What would you like to order?' },
            { speaker: 'Gast', german: 'Ich hätte gern einen Kaffee, bitte.', english: 'I would like a coffee, please.' },
            { speaker: 'Kellner', german: 'Mit Milch und Zucker?', english: 'With milk and sugar?' },
            { speaker: 'Gast', german: 'Nur mit Milch, bitte. Kein Zucker.', english: 'Only with milk, please. No sugar.' },
            { speaker: 'Kellner', german: 'Möchten Sie etwas essen?', english: 'Would you like something to eat?' },
            { speaker: 'Gast', german: 'Ja, ein Croissant, bitte.', english: 'Yes, a croissant, please.' },
            { speaker: 'Kellner', german: 'Das macht 5,50 Euro.', english: 'That will be 5.50 Euro.' },
            { speaker: 'Gast', german: 'Hier sind 6 Euro. Stimmt so!', english: 'Here are 6 Euro. Keep the change!' },
        ],
        keyPhrases: [
            { german: 'Ich hätte gern...', english: 'I would like...', usage: 'Polite way to order' },
            { german: 'Das macht...', english: 'That will be...', usage: 'Stating the price' },
            { german: 'Stimmt so!', english: 'Keep the change!', usage: 'Leaving a tip' },
        ],
        culturalNote: 'In Germany, it is common to round up or leave a small tip of 5-10% at cafés.',
    },
    {
        id: 'convo-a1-03',
        level: 'A1',
        title: 'Shopping for Groceries',
        titleDe: 'Lebensmittel einkaufen',
        scenario: 'At the supermarket checkout',
        lines: [
            { speaker: 'Kassierer', german: 'Guten Tag! Brauchen Sie eine Tüte?', english: 'Good day! Do you need a bag?' },
            { speaker: 'Kunde', german: 'Ja, bitte. Eine kleine Tüte.', english: 'Yes, please. A small bag.' },
            { speaker: 'Kassierer', german: 'Das macht zusammen 23,45 Euro.', english: 'That comes to 23.45 Euro in total.' },
            { speaker: 'Kunde', german: 'Kann ich mit Karte zahlen?', english: 'Can I pay with card?' },
            { speaker: 'Kassierer', german: 'Ja, natürlich. Bitte legen Sie die Karte auf.', english: 'Yes, of course. Please place the card on [the reader].' },
            { speaker: 'Kunde', german: 'Brauche ich die Quittung?', english: 'Do I need the receipt?' },
            { speaker: 'Kassierer', german: 'Möchten Sie den Bon?', english: 'Would you like the receipt?' },
            { speaker: 'Kunde', german: 'Nein, danke. Tschüss!', english: 'No, thank you. Bye!' },
        ],
        keyPhrases: [
            { german: 'Mit Karte zahlen', english: 'To pay with card', usage: 'Payment method' },
            { german: 'Der Bon / Die Quittung', english: 'The receipt', usage: 'Asking for receipt' },
            { german: 'Das macht zusammen...', english: 'That comes to... in total', usage: 'Total price' },
        ],
    },
];

// ============================================
// A2 DIALOGUES - Intermediate conversations
// ============================================

export const a2Dialogues: ConversationDialogue[] = [
    {
        id: 'convo-a2-01',
        level: 'A2',
        title: 'At the Doctor',
        titleDe: 'Beim Arzt',
        scenario: 'Visiting a doctor',
        lines: [
            { speaker: 'Arzt', german: 'Guten Tag! Was kann ich für Sie tun?', english: 'Good day! What can I do for you?' },
            { speaker: 'Patient', german: 'Ich habe seit zwei Tagen Kopfschmerzen.', english: 'I have had headaches for two days.' },
            { speaker: 'Arzt', german: 'Haben Sie auch Fieber?', english: 'Do you also have a fever?' },
            { speaker: 'Patient', german: 'Nein, aber ich bin sehr müde und habe Halsschmerzen.', english: 'No, but I am very tired and have a sore throat.' },
            { speaker: 'Arzt', german: 'Das klingt nach einer Erkältung. Ich verschreibe Ihnen Medikamente.', english: 'That sounds like a cold. I\'ll prescribe you medication.' },
            { speaker: 'Patient', german: 'Wie oft soll ich die Tabletten nehmen?', english: 'How often should I take the tablets?' },
            { speaker: 'Arzt', german: 'Dreimal täglich nach dem Essen. Und trinken Sie viel Wasser.', english: 'Three times daily after eating. And drink lots of water.' },
            { speaker: 'Patient', german: 'Muss ich wieder kommen?', english: 'Do I need to come back?' },
            { speaker: 'Arzt', german: 'Wenn es nach einer Woche nicht besser ist, kommen Sie wieder.', english: 'If it\'s not better after a week, come back.' },
        ],
        keyPhrases: [
            { german: 'Kopfschmerzen / Halsschmerzen', english: 'Headache / Sore throat', usage: 'Describing pain' },
            { german: 'Ich verschreibe Ihnen...', english: 'I\'ll prescribe you...', usage: 'Doctor giving prescription' },
            { german: 'Dreimal täglich', english: 'Three times daily', usage: 'Medication dosage' },
        ],
    },
    {
        id: 'convo-a2-02',
        level: 'A2',
        title: 'Asking for Directions',
        titleDe: 'Nach dem Weg fragen',
        scenario: 'Finding your way in a city',
        lines: [
            { speaker: 'Tourist', german: 'Entschuldigung, können Sie mir helfen?', english: 'Excuse me, can you help me?' },
            { speaker: 'Person', german: 'Ja, natürlich. Was suchen Sie?', english: 'Yes, of course. What are you looking for?' },
            { speaker: 'Tourist', german: 'Ich suche den Bahnhof. Ist er weit von hier?', english: 'I\'m looking for the train station. Is it far from here?' },
            { speaker: 'Person', german: 'Nein, nicht weit. Gehen Sie hier geradeaus, dann an der Ampel links.', english: 'No, not far. Go straight ahead here, then left at the traffic light.' },
            { speaker: 'Tourist', german: 'Und dann?', english: 'And then?' },
            { speaker: 'Person', german: 'Dann gehen Sie etwa 200 Meter weiter. Der Bahnhof ist auf der rechten Seite.', english: 'Then go about 200 meters further. The train station is on the right side.' },
            { speaker: 'Tourist', german: 'Wie lange dauert es zu Fuß?', english: 'How long does it take on foot?' },
            { speaker: 'Person', german: 'Ungefähr 10 Minuten.', english: 'About 10 minutes.' },
            { speaker: 'Tourist', german: 'Vielen Dank für Ihre Hilfe!', english: 'Thank you very much for your help!' },
        ],
        keyPhrases: [
            { german: 'Geradeaus', english: 'Straight ahead', usage: 'Direction' },
            { german: 'An der Ampel links/rechts', english: 'Left/right at the traffic light', usage: 'Navigation' },
            { german: 'Auf der rechten/linken Seite', english: 'On the right/left side', usage: 'Location' },
            { german: 'Zu Fuß', english: 'On foot / Walking', usage: 'Mode of transport' },
        ],
    },
];

// ============================================
// B1 DIALOGUES - Advanced conversations
// ============================================

export const b1Dialogues: ConversationDialogue[] = [
    {
        id: 'convo-b1-01',
        level: 'B1',
        title: 'Job Interview',
        titleDe: 'Vorstellungsgespräch',
        scenario: 'A formal job interview',
        lines: [
            { speaker: 'Chef', german: 'Guten Tag, Herr Müller. Setzen Sie sich bitte.', english: 'Good day, Mr. Müller. Please have a seat.' },
            { speaker: 'Bewerber', german: 'Vielen Dank. Freut mich, Sie kennenzulernen.', english: 'Thank you very much. Nice to meet you.' },
            { speaker: 'Chef', german: 'Erzählen Sie mir bitte etwas über sich.', english: 'Please tell me something about yourself.' },
            { speaker: 'Bewerber', german: 'Ich habe Wirtschaftswissenschaften studiert und arbeite seit drei Jahren im Marketing.', english: 'I studied economics and have been working in marketing for three years.' },
            { speaker: 'Chef', german: 'Warum möchten Sie bei uns arbeiten?', english: 'Why do you want to work for us?' },
            { speaker: 'Bewerber', german: 'Ihre Firma ist für Innovation bekannt, und ich möchte meine Erfahrung in einem dynamischen Umfeld einbringen.', english: 'Your company is known for innovation, and I want to contribute my experience in a dynamic environment.' },
            { speaker: 'Chef', german: 'Was sind Ihre Stärken?', english: 'What are your strengths?' },
            { speaker: 'Bewerber', german: 'Ich bin teamfähig, kreativ und arbeite gut unter Druck.', english: 'I am a team player, creative, and work well under pressure.' },
            { speaker: 'Chef', german: 'Wann könnten Sie bei uns anfangen?', english: 'When could you start with us?' },
            { speaker: 'Bewerber', german: 'Ich könnte in einem Monat anfangen, nach meiner Kündigungsfrist.', english: 'I could start in a month, after my notice period.' },
        ],
        keyPhrases: [
            { german: 'Erzählen Sie mir über sich', english: 'Tell me about yourself', usage: 'Common interview opener' },
            { german: 'Meine Stärken sind...', english: 'My strengths are...', usage: 'Describing skills' },
            { german: 'Die Kündigungsfrist', english: 'Notice period', usage: 'Job transition' },
            { german: 'Unter Druck arbeiten', english: 'To work under pressure', usage: 'Work skill' },
        ],
        culturalNote: 'In German job interviews, formal language (Sie) is always used. Punctuality is extremely important.',
    },
];

// ============================================
// EXPORT ALL DIALOGUES
// ============================================

export const allDialogues: ConversationDialogue[] = [
    ...a1Dialogues,
    ...a2Dialogues,
    ...b1Dialogues,
];

export const getDialoguesByLevel = (level: CEFRLevel): ConversationDialogue[] => {
    return allDialogues.filter(d => d.level === level);
};

export const getDialoguesByScenario = (scenario: string): ConversationDialogue[] => {
    return allDialogues.filter(d => d.scenario.toLowerCase().includes(scenario.toLowerCase()));
};
