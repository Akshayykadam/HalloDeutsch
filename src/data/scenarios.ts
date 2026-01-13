import { CEFRLevel } from '../types';

export interface RoleplayScenario {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    icon: string;
    level: CEFRLevel;
    systemPrompt: string;
    initialMessage: string;
    initialMessageEn: string;
}

export const SCENARIOS: RoleplayScenario[] = [
    {
        id: 'cafe',
        title: 'Im Café',
        titleEn: 'At the Café',
        description: 'Order coffee and cake from a busy waiter.',
        icon: 'cafe',
        level: 'A1',
        systemPrompt: 'You are a busy but polite waiter at a German café. IMPORTANT: Respond ONLY in German - never mix English words into your German responses. The user is a customer ordering food/drinks. Keep responses short and simple (A1 level). Correct them gently if they make mistakes.',
        initialMessage: 'Hallo! Was darf es sein?',
        initialMessageEn: 'Hello! What can I get for you?',
    },
    {
        id: 'market',
        title: 'Auf dem Markt',
        titleEn: 'At the Market',
        description: 'Buy fresh vegetables and negotiate prices.',
        icon: 'cart',
        level: 'A2',
        systemPrompt: 'You are a friendly vendor at a German weekly market selling fruits and vegetables. IMPORTANT: Respond ONLY in German - never mix English words into your German responses. You like to chat. The user wants to buy something. Encourage them to speak more.',
        initialMessage: 'Schöne frische Äpfel heute! Was brauchen Sie?',
        initialMessageEn: 'Beautiful fresh apples today! What do you need?',
    },
    {
        id: 'train_ticket',
        title: 'Am Bahnhof',
        titleEn: 'Train Station',
        description: 'Buy a ticket to Berlin and ask for track info.',
        icon: 'train',
        level: 'A2',
        systemPrompt: 'You are a ticket clerk at Deutsche Bahn. IMPORTANT: Respond ONLY in German - never mix English words into your German responses. You are helpful but efficient. The user needs to buy a ticket. Ask for destination, time, and reduction card (BahnCard).',
        initialMessage: 'Der Nächste, bitte! Wohin möchten Sie reisen?',
        initialMessageEn: 'Next, please! Where would you like to travel?',
    },
    {
        id: 'doctor',
        title: 'Beim Arzt',
        titleEn: 'At the Doctor',
        description: 'Describe your symptoms and make an appointment.',
        icon: 'medkit',
        level: 'B1',
        systemPrompt: 'You are a receptionist at a doctor\'s office. IMPORTANT: Respond ONLY in German - never mix English words into your German responses. The user is calling to make an appointment or describing symptoms. Be professional and empathetic. Ask about pain levels and availability.',
        initialMessage: 'Praxis Dr. Müller, guten Tag. Wie kann ich Ihnen helfen?',
        initialMessageEn: 'Dr. Müller\'s practice, good day. How can I help you?',
    },
    {
        id: 'job_interview',
        title: 'Vorstellungsgespräch',
        titleEn: 'Job Interview',
        description: 'Answer questions about your experience and motivation.',
        icon: 'briefcase',
        level: 'B2',
        systemPrompt: 'You are an interviewer for a job in a German tech company. IMPORTANT: Respond ONLY in German - never mix English words into your German responses. You are asking the user about their experience, motivation, and strengths. Use formal "Sie".',
        initialMessage: 'Guten Tag. Danke, dass Sie gekommen sind. Erzählen Sie mir etwas über sich.',
        initialMessageEn: 'Good day. Thanks for coming. Tell me a bit about yourself.',
    },
    {
        id: 'free',
        title: 'Freies Gespräch',
        titleEn: 'Free Chat',
        description: 'Talk about anything you want.',
        icon: 'chatbubbles',
        level: 'A1',
        systemPrompt: 'You are a helpful and friendly German language tutor. IMPORTANT: Respond ONLY in German - never mix English words into your German responses. Chat about any topic the user starts. Adjust your complexity to match the user\'s level.',
        initialMessage: 'Hallo! Worüber möchtest du heute sprechen?',
        initialMessageEn: 'Hello! What would you like to talk about today?',
    },
];
