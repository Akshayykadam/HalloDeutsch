// Reading Comprehension Passages - Short texts with questions for practice
// Authentic beginner to intermediate German texts

import { CEFRLevel } from '../../types';

export interface ReadingPassage {
    id: string;
    level: CEFRLevel;
    title: string;
    titleDe: string;
    topic: string;
    text: string;
    wordCount: number;
    questions: ReadingQuestion[];
    vocabulary: VocabularyHelp[];
}

export interface ReadingQuestion {
    question: string;
    questionDe?: string;
    options: string[];
    correctIndex: number;
}

export interface VocabularyHelp {
    german: string;
    english: string;
}

// ============================================
// A1 READING PASSAGES - Simple texts
// ============================================

export const a1ReadingPassages: ReadingPassage[] = [
    {
        id: 'read-a1-01',
        level: 'A1',
        title: 'My Family',
        titleDe: 'Meine Familie',
        topic: 'family',
        text: `Hallo! Ich heiße Anna. Ich bin 25 Jahre alt und komme aus Berlin. Ich habe eine kleine Familie. Mein Vater heißt Thomas und meine Mutter heißt Maria. Ich habe einen Bruder. Er heißt Max und ist 22 Jahre alt. Max studiert in München. Wir haben auch einen Hund. Er heißt Bello.`,
        wordCount: 52,
        questions: [
            { question: 'How old is Anna?', options: ['22 years old', '25 years old', '30 years old'], correctIndex: 1 },
            { question: 'Where does Anna come from?', options: ['Munich', 'Hamburg', 'Berlin'], correctIndex: 2 },
            { question: 'What is the name of Anna\'s brother?', options: ['Thomas', 'Max', 'Bello'], correctIndex: 1 },
            { question: 'Where does Max study?', options: ['Berlin', 'Hamburg', 'Munich'], correctIndex: 2 },
        ],
        vocabulary: [
            { german: 'die Familie', english: 'family' },
            { german: 'der Bruder', english: 'brother' },
            { german: 'der Hund', english: 'dog' },
            { german: 'studieren', english: 'to study' },
        ],
    },
    {
        id: 'read-a1-02',
        level: 'A1',
        title: 'My Day',
        titleDe: 'Mein Tag',
        topic: 'daily routine',
        text: `Ich stehe um 7 Uhr auf. Dann frühstücke ich. Ich esse Brot und trinke Kaffee. Um 8 Uhr gehe ich zur Arbeit. Ich arbeite von 9 bis 17 Uhr. Nach der Arbeit gehe ich einkaufen. Am Abend koche ich Essen. Ich esse um 19 Uhr. Dann sehe ich fern oder lese ein Buch. Um 23 Uhr gehe ich schlafen.`,
        wordCount: 61,
        questions: [
            { question: 'What time does the person wake up?', options: ['6 o\'clock', '7 o\'clock', '8 o\'clock'], correctIndex: 1 },
            { question: 'What does the person eat for breakfast?', options: ['Eggs', 'Bread', 'Cereal'], correctIndex: 1 },
            { question: 'How long does the person work?', options: ['6 hours', '8 hours', '10 hours'], correctIndex: 1 },
            { question: 'What time does the person go to sleep?', options: ['10 PM', '11 PM', '12 AM'], correctIndex: 1 },
        ],
        vocabulary: [
            { german: 'aufstehen', english: 'to get up' },
            { german: 'frühstücken', english: 'to have breakfast' },
            { german: 'einkaufen', english: 'to shop' },
            { german: 'fernsehen', english: 'to watch TV' },
        ],
    },
    {
        id: 'read-a1-03',
        level: 'A1',
        title: 'At the Restaurant',
        titleDe: 'Im Restaurant',
        topic: 'food',
        text: `Lisa und Tom gehen ins Restaurant. Sie sind hungrig. Der Kellner kommt und fragt: "Was möchten Sie bestellen?" Lisa möchte eine Pizza und ein Wasser. Tom bestellt Spaghetti und ein Bier. Das Essen ist lecker. Lisa bezahlt 15 Euro und Tom bezahlt 12 Euro.`,
        wordCount: 47,
        questions: [
            { question: 'Who is hungry?', options: ['Only Lisa', 'Only Tom', 'Both Lisa and Tom'], correctIndex: 2 },
            { question: 'What does Lisa order?', options: ['Spaghetti', 'Pizza', 'Salad'], correctIndex: 1 },
            { question: 'What does Tom drink?', options: ['Water', 'Cola', 'Beer'], correctIndex: 2 },
            { question: 'How much does Lisa pay?', options: ['12 Euro', '15 Euro', '20 Euro'], correctIndex: 1 },
        ],
        vocabulary: [
            { german: 'der Kellner', english: 'waiter' },
            { german: 'bestellen', english: 'to order' },
            { german: 'lecker', english: 'delicious' },
            { german: 'bezahlen', english: 'to pay' },
        ],
    },
];

// ============================================
// A2 READING PASSAGES - Intermediate texts
// ============================================

export const a2ReadingPassages: ReadingPassage[] = [
    {
        id: 'read-a2-01',
        level: 'A2',
        title: 'A Trip to Berlin',
        titleDe: 'Eine Reise nach Berlin',
        topic: 'travel',
        text: `Letzten Sommer bin ich nach Berlin gefahren. Ich habe den Zug genommen. Die Fahrt hat drei Stunden gedauert. In Berlin habe ich viele Sehenswürdigkeiten besucht. Ich habe das Brandenburger Tor gesehen und bin zum Fernsehturm gegangen. Das Wetter war sehr schön. Ich habe auch viele Fotos gemacht. Abends bin ich in ein Restaurant gegangen und habe Currywurst gegessen. Berlin ist eine tolle Stadt!`,
        wordCount: 70,
        questions: [
            { question: 'How did the person travel to Berlin?', options: ['By car', 'By train', 'By plane'], correctIndex: 1 },
            { question: 'How long was the journey?', options: ['2 hours', '3 hours', '4 hours'], correctIndex: 1 },
            { question: 'What did the person eat in the evening?', options: ['Pizza', 'Currywurst', 'Döner'], correctIndex: 1 },
            { question: 'What was the weather like?', options: ['Rainy', 'Very nice', 'Cold'], correctIndex: 1 },
        ],
        vocabulary: [
            { german: 'die Sehenswürdigkeiten', english: 'sights, attractions' },
            { german: 'der Fernsehturm', english: 'TV tower' },
            { german: 'gedauert', english: 'lasted' },
            { german: 'toll', english: 'great' },
        ],
    },
    {
        id: 'read-a2-02',
        level: 'A2',
        title: 'Job Interview',
        titleDe: 'Vorstellungsgespräch',
        topic: 'work',
        text: `Gestern hatte ich ein Vorstellungsgespräch. Ich war sehr nervös. Das Gespräch war um 10 Uhr. Ich bin früh aufgestanden und habe mich gut angezogen. Die Firma war im Stadtzentrum. Der Chef war sehr freundlich. Er hat viele Fragen gestellt. Ich habe über meine Erfahrung und meine Ausbildung gesprochen. Das Gespräch hat 45 Minuten gedauert. Ich hoffe, dass ich die Stelle bekomme!`,
        wordCount: 68,
        questions: [
            { question: 'When was the interview?', options: ['Today', 'Yesterday', 'Last week'], correctIndex: 1 },
            { question: 'What time was the interview?', options: ['9 o\'clock', '10 o\'clock', '11 o\'clock'], correctIndex: 1 },
            { question: 'How was the boss?', options: ['Strict', 'Unfriendly', 'Friendly'], correctIndex: 2 },
            { question: 'How long did the interview last?', options: ['30 minutes', '45 minutes', '60 minutes'], correctIndex: 1 },
        ],
        vocabulary: [
            { german: 'nervös', english: 'nervous' },
            { german: 'die Firma', english: 'company' },
            { german: 'die Erfahrung', english: 'experience' },
            { german: 'die Ausbildung', english: 'training/education' },
        ],
    },
];

// ============================================
// B1 READING PASSAGES - Advanced texts
// ============================================

export const b1ReadingPassages: ReadingPassage[] = [
    {
        id: 'read-b1-01',
        level: 'B1',
        title: 'Working from Home',
        titleDe: 'Homeoffice',
        topic: 'work',
        text: `Seit der Pandemie arbeiten viele Menschen von zu Hause aus. Das hat Vorteile und Nachteile. Einerseits spart man Zeit, weil man nicht zur Arbeit pendeln muss. Man kann auch flexibler arbeiten und mehr Zeit mit der Familie verbringen. Andererseits vermissen viele Mitarbeiter den Kontakt zu Kollegen. Es ist auch schwieriger, Arbeit und Privatleben zu trennen, wenn man zu Hause arbeitet. Manche Unternehmen bieten jetzt hybride Modelle an: Die Mitarbeiter können teilweise im Büro und teilweise von zu Hause arbeiten.`,
        wordCount: 85,
        questions: [
            { question: 'What advantage is mentioned about working from home?', options: ['Higher salary', 'Time savings', 'Better equipment'], correctIndex: 1 },
            { question: 'What do many employees miss?', options: ['Money', 'Contact with colleagues', 'Vacation'], correctIndex: 1 },
            { question: 'What is a disadvantage of working from home?', options: ['More commuting', 'Difficult to separate work and personal life', 'Less flexibility'], correctIndex: 1 },
            { question: 'What solution are some companies offering?', options: ['Only office work', 'Only home office', 'Hybrid models'], correctIndex: 2 },
        ],
        vocabulary: [
            { german: 'pendeln', english: 'to commute' },
            { german: 'vermissen', english: 'to miss' },
            { german: 'trennen', english: 'to separate' },
            { german: 'teilweise', english: 'partially' },
        ],
    },
    {
        id: 'read-b1-02',
        level: 'B1',
        title: 'Sustainable Living',
        titleDe: 'Nachhaltiges Leben',
        topic: 'environment',
        text: `Immer mehr Menschen interessieren sich für ein nachhaltiges Leben. Sie wollen die Umwelt schützen und weniger Ressourcen verbrauchen. Es gibt viele Möglichkeiten, nachhaltiger zu leben. Man kann zum Beispiel weniger Fleisch essen, mit dem Fahrrad fahren statt mit dem Auto, und Produkte kaufen, die lokal hergestellt wurden. Auch das Recycling ist wichtig. Viele Städte haben jetzt getrennte Mülltonnen für Papier, Plastik und Biomüll. Kleine Veränderungen im Alltag können einen großen Unterschied machen.`,
        wordCount: 80,
        questions: [
            { question: 'What are more people interested in?', options: ['Fast food', 'Sustainable living', 'Online shopping'], correctIndex: 1 },
            { question: 'What can people do instead of driving a car?', options: ['Take a taxi', 'Ride a bicycle', 'Stay at home'], correctIndex: 1 },
            { question: 'What is also mentioned as important?', options: ['Recycling', 'Fast fashion', 'Air travel'], correctIndex: 0 },
            { question: 'What do many cities now have?', options: ['More cars', 'Separated trash bins', 'Free parking'], correctIndex: 1 },
        ],
        vocabulary: [
            { german: 'die Umwelt', english: 'environment' },
            { german: 'verbrauchen', english: 'to consume' },
            { german: 'hergestellt', english: 'produced' },
            { german: 'der Unterschied', english: 'difference' },
        ],
    },
];

// ============================================
// EXPORT ALL PASSAGES
// ============================================

export const allReadingPassages: ReadingPassage[] = [
    ...a1ReadingPassages,
    ...a2ReadingPassages,
    ...b1ReadingPassages,
];

export const getReadingPassagesByLevel = (level: CEFRLevel): ReadingPassage[] => {
    return allReadingPassages.filter(p => p.level === level);
};

export const getReadingPassagesByTopic = (topic: string): ReadingPassage[] => {
    return allReadingPassages.filter(p => p.topic === topic);
};
