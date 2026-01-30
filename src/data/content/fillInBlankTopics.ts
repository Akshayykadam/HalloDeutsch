// Fill in the Blank Quiz Topics
// 25 template topics organized by category

export interface FillInBlankTopic {
    id: string;
    name: string;
    nameDE: string;
    icon: string;
    category: 'grammar' | 'vocabulary' | 'everyday' | 'intermediate';
    level: 'A1' | 'A2' | 'B1' | 'B2';
}

export const FILL_IN_BLANK_TOPICS: FillInBlankTopic[] = [
    // Grammar Topics (A1-A2)
    { id: 'articles', name: 'Articles (der/die/das)', nameDE: 'Artikel', icon: 'book', category: 'grammar', level: 'A1' },
    { id: 'verb-conjugation', name: 'Verb Conjugation', nameDE: 'Verbkonjugation', icon: 'create', category: 'grammar', level: 'A1' },
    { id: 'adjective-endings', name: 'Adjective Endings', nameDE: 'Adjektivendungen', icon: 'color-wand', category: 'grammar', level: 'A2' },
    { id: 'prepositions', name: 'Prepositions', nameDE: 'Präpositionen', icon: 'navigate', category: 'grammar', level: 'A2' },
    { id: 'cases', name: 'Cases (Nom/Akk/Dat)', nameDE: 'Fälle', icon: 'layers', category: 'grammar', level: 'A2' },
    { id: 'negation', name: 'Negation (nicht/kein)', nameDE: 'Verneinung', icon: 'close-circle', category: 'grammar', level: 'A1' },

    // Vocabulary Topics (A1)
    { id: 'food-drinks', name: 'Food & Drinks', nameDE: 'Essen & Trinken', icon: 'restaurant', category: 'vocabulary', level: 'A1' },
    { id: 'family', name: 'Family Members', nameDE: 'Familie', icon: 'people', category: 'vocabulary', level: 'A1' },
    { id: 'colors', name: 'Colors', nameDE: 'Farben', icon: 'color-palette', category: 'vocabulary', level: 'A1' },
    { id: 'numbers', name: 'Numbers', nameDE: 'Zahlen', icon: 'calculator', category: 'vocabulary', level: 'A1' },
    { id: 'clothing', name: 'Clothing', nameDE: 'Kleidung', icon: 'shirt', category: 'vocabulary', level: 'A1' },
    { id: 'body-parts', name: 'Body Parts', nameDE: 'Körperteile', icon: 'body', category: 'vocabulary', level: 'A1' },
    { id: 'weather', name: 'Weather', nameDE: 'Wetter', icon: 'partly-sunny', category: 'vocabulary', level: 'A1' },
    { id: 'transport', name: 'Transport', nameDE: 'Verkehrsmittel', icon: 'car', category: 'vocabulary', level: 'A1' },

    // Everyday Topics (A1-A2)
    { id: 'greetings', name: 'Greetings & Goodbyes', nameDE: 'Begrüßungen', icon: 'hand-left', category: 'everyday', level: 'A1' },
    { id: 'shopping', name: 'Shopping Phrases', nameDE: 'Einkaufen', icon: 'cart', category: 'everyday', level: 'A1' },
    { id: 'restaurant', name: 'At the Restaurant', nameDE: 'Im Restaurant', icon: 'cafe', category: 'everyday', level: 'A2' },
    { id: 'time-expressions', name: 'Time Expressions', nameDE: 'Zeitausdrücke', icon: 'time', category: 'everyday', level: 'A1' },
    { id: 'directions', name: 'Asking Directions', nameDE: 'Nach dem Weg fragen', icon: 'compass', category: 'everyday', level: 'A2' },

    // Intermediate Topics (B1-B2)
    { id: 'perfekt-tense', name: 'Perfekt Tense', nameDE: 'Perfekt', icon: 'checkmark-done', category: 'intermediate', level: 'B1' },
    { id: 'modal-verbs', name: 'Modal Verbs', nameDE: 'Modalverben', icon: 'options', category: 'intermediate', level: 'A2' },
    { id: 'konjunktiv2', name: 'Konjunktiv II', nameDE: 'Konjunktiv II', icon: 'help-circle', category: 'intermediate', level: 'B1' },
    { id: 'relative-clauses', name: 'Relative Clauses', nameDE: 'Relativsätze', icon: 'link', category: 'intermediate', level: 'B1' },
    { id: 'passive-voice', name: 'Passive Voice', nameDE: 'Passiv', icon: 'swap-horizontal', category: 'intermediate', level: 'B2' },
    { id: 'subordinate-clauses', name: 'Subordinate Clauses', nameDE: 'Nebensätze', icon: 'git-branch', category: 'intermediate', level: 'B1' },
];

// Get topics by category
export const getTopicsByCategory = (category: FillInBlankTopic['category']): FillInBlankTopic[] => {
    return FILL_IN_BLANK_TOPICS.filter(t => t.category === category);
};

// Get topics by level
export const getTopicsByLevel = (level: FillInBlankTopic['level']): FillInBlankTopic[] => {
    return FILL_IN_BLANK_TOPICS.filter(t => t.level === level);
};
