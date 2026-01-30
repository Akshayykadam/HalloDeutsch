// TypeScript type definitions for German Learner App

// CEFR Proficiency Levels
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

// Learning Goals
export type LearningGoal = 'travel' | 'business' | 'academic' | 'general';

// Daily Time Commitment (in minutes)
export type DailyGoal = 5 | 10 | 15 | 30;

// User Profile
export interface UserProfile {
    id: string;
    displayName: string;
    age?: number;
    email?: string;
    avatarUrl?: string;
    createdAt: Date;
    onboardingCompleted: boolean;
}

// User Progress
export interface UserProgress {
    level: CEFRLevel;
    xp: number;
    totalXP: number;
    streak: number;
    longestStreak: number;
    dailyGoal: DailyGoal;
    learningGoal: LearningGoal;
    lessonsCompleted: number;
    wordsLearned: number;
    grammarTopicsCompleted: number;
    minutesToday: number;
    lastActiveDate: string;
    dailyStats?: Record<string, number>; // Date "YYYY-MM-DD" -> minutes

    lastStreakUpdate: string;
}

// Vocabulary Word - Comprehensive word entry
export interface VocabularyWord {
    id: string;
    german: string;
    english: string;
    pronunciation: string;

    // Grammar details
    partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'article' | 'phrase';
    gender?: 'der' | 'die' | 'das';
    plural?: string;

    // Verb-specific (for verbs only)
    verbForms?: {
        infinitive: string;
        presentIch: string;
        presentDu: string;
        presentEr: string;
        pastParticiple: string;
        auxiliary: 'haben' | 'sein';
        isIrregular: boolean;
        isSeparable: boolean;
        separablePrefix?: string;
    };

    // Level and categorization
    level: CEFRLevel;
    category?: VocabularyCategory;      // Optional for legacy compatibility
    domain: string;                     // Specific topic (e.g., "kitchen", "doctor visit")
    frequency?: 'high' | 'medium' | 'low';  // Optional for legacy compatibility

    // Usage examples
    exampleSentence?: string;           // Optional for legacy compatibility
    exampleTranslation?: string;        // Optional for legacy compatibility
    advancedExamples?: Array<{
        german: string;
        english: string;
        level: CEFRLevel;
    }>;

    // Collocations and usage
    collocations?: string[];           // Common word combinations
    formalVariant?: string;            // Formal alternative
    informalVariant?: string;          // Casual alternative
    usageNotes?: string;               // Formal vs informal context

    // Exam and learning metadata
    isExamRelevant?: boolean;           // Optional for legacy compatibility
    examTags?: ('goethe' | 'telc' | 'ösd' | 'academic')[];

    // Lesson connections
    introducedIn?: string;             // "A1 → Module 3, Lesson 2"
    usedIn?: string[];                 // ["A2 → Travel", "B1 → Work"]

    // Media
    imageUrl?: string;
    audioUrl?: string;
}

// Vocabulary Categories
export type VocabularyCategory =
    | 'people_and_roles'
    | 'objects_and_things'
    | 'actions'
    | 'descriptions'
    | 'time_and_numbers'
    | 'places_and_directions'
    | 'abstract_concepts'
    | 'exam_and_academic'
    | 'connectors'
    | 'daily_life';


// Vocabulary Mastery
export interface VocabularyMastery {
    wordId: string;
    masteryLevel: number; // 0-5
    correctCount: number;
    incorrectCount: number;
    lastReviewed: Date;
    nextReview: Date;
}

// Grammar Topic
export interface GrammarTopic {
    id: string;
    title: string;
    titleDe?: string;
    description: string;
    level: CEFRLevel;
    order: number;
    estimatedMinutes: number;
    concepts?: string[];
    lessons: number;
    completedLessons: number;
    examples: Array<{ german: string; english: string }>;
}

// Lesson (legacy - kept for compatibility)
export interface Lesson {
    id: string;
    title: string;
    description: string;
    level: CEFRLevel;
    unitNumber: number;
    lessonNumber: number;
    type: 'vocabulary' | 'grammar' | 'conversation' | 'reading' | 'writing';
    estimatedMinutes: number;
    xpReward: number;
    isLocked: boolean;
    isCompleted: boolean;
    progress: number; // 0-100
}

// ============================================
// CEFR Curriculum Structure Types
// ============================================

// Module within a CEFR level (e.g., "Alphabet & Pronunciation" in A1)
export interface CurriculumModule {
    id: string;
    levelId: CEFRLevel;
    order: number;
    title: string;
    titleDe: string;
    description: string;
    outcome: string;                    // "User can read German words aloud confidently"
    estimatedHours: number;
    lessons: CurriculumLesson[];
    isLocked: boolean;
    isCompleted: boolean;
    progress: number;
    iconName: string;                   // Ionicons name
}

// Enhanced Lesson with What/Why/Where context
export interface CurriculumLesson {
    id: string;
    moduleId: string;
    order: number;
    title: string;
    titleDe: string;
    type: 'vocabulary' | 'grammar' | 'pronunciation' | 'reading' | 'writing' | 'mixed' | 'quiz' | 'conversation';
    whatLearning: string;               // Clear learning objective
    whyLearning: string;                // Real-world application
    whereUsed: string;                  // Context of usage
    estimatedMinutes: number;
    grammarTopics?: string[];           // Grammar rule IDs
    vocabularyDomains?: string[];       // Vocabulary domain IDs
    exercises: CurriculumExercise[];
    masteryThreshold: number;           // % required to unlock next (default 80)
    isLocked: boolean;
    isCompleted: boolean;
    progress: number;                   // 0-100
}

// Enhanced Exercise with detailed feedback
export interface CurriculumExercise {
    id: string;
    lessonId: string;
    type: ExerciseType;
    order: number;
    instruction: string;                // "Select the correct article"
    question: string;
    questionAudio?: string;
    questionImage?: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;                // Shown after answering
    grammarRuleId?: string;             // Link to grammar reference
    hint?: string;
    commonMistake?: string;             // "Many learners confuse..."
}

// Mastery tracking per concept
export interface ConceptMastery {
    id: string;
    conceptId: string;
    conceptType: 'vocabulary' | 'grammar' | 'pronunciation';
    conceptLabel: string;               // Human readable label
    correctCount: number;
    incorrectCount: number;
    masteryLevel: 0 | 1 | 2 | 3 | 4 | 5;  // 0=new, 5=mastered
    weakPoints: string[];               // Specific areas needing work
    lastReviewed: Date;
    nextReviewDate: Date;
}

// Level progress tracker
export interface LevelProgress {
    level: CEFRLevel;
    isUnlocked: boolean;
    completedModules: number;
    totalModules: number;
    completedLessons: number;
    totalLessons: number;
    assessmentPassed: boolean;
    assessmentScore?: number;
    startedAt?: Date;
    completedAt?: Date;
}

// Level assessment
export interface LevelAssessment {
    id: string;
    level: CEFRLevel;
    title: string;
    description: string;
    sections: AssessmentSection[];
    passingScore: number;               // Percentage required to pass
    timeLimit: number;                  // Minutes
}

export interface AssessmentSection {
    id: string;
    type: 'reading' | 'listening' | 'writing' | 'speaking';
    title: string;
    exercises: CurriculumExercise[];
    weight: number;                     // Percentage of total score
}

// Exercise Types
export type ExerciseType =
    | 'multiple_choice'
    | 'fill_blank'
    | 'translation'
    | 'matching'
    | 'sentence_order'
    | 'listening'
    | 'speaking'
    | 'image_selection';

// Exercise
export interface Exercise {
    id: string;
    type: ExerciseType;
    question: string;
    questionAudio?: string;
    questionImage?: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation?: string;
    hint?: string;
    xpReward: number;
}

// Exercise Result
export interface ExerciseResult {
    exerciseId: string;
    isCorrect: boolean;
    userAnswer: string | string[];
    timeSpent: number; // in seconds
    hintsUsed: number;
}

// Lesson Session
export interface LessonSession {
    lessonId: string;
    startedAt: Date;
    completedAt?: Date;
    exerciseResults: ExerciseResult[];
    totalXP: number;
    accuracy: number;
}

// Conversation Scenario
export interface ConversationScenario {
    id: string;
    title: string;
    description: string;
    level: CEFRLevel;
    scenario: string;
    aiPersona: string;
    suggestedPrompts: string[];
    vocabularyFocus: string[];
    grammarFocus: string[];
}

// Conversation Message
export interface ConversationMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    audioUrl?: string;
    transcription?: string;
    pronunciationScore?: number;
    timestamp: Date;
}

// Achievement
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'streak' | 'xp' | 'lessons' | 'vocabulary' | 'conversation';
    requirement: number;
    xpReward: number;
    unlockedAt?: Date;
}

// League
export interface League {
    id: string;
    name: string;
    tier: 'bronze' | 'silver' | 'gold' | 'sapphire' | 'ruby' | 'emerald' | 'amethyst' | 'pearl' | 'obsidian' | 'diamond';
    minXP: number;
    maxXP: number;
    icon: string;
    color: string;
}

// Leaderboard Entry
export interface LeaderboardEntry {
    userId: string;
    displayName: string;
    avatarUrl?: string;
    weeklyXP: number;
    rank: number;
    league: League;
}

// Settings
export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    reminderTime: string;
    soundEnabled: boolean;
    hapticEnabled: boolean;
    autoPlayAudio: boolean;
    showTransliteration: boolean;
}

// Navigation Types
export type RootStackParamList = {
    Onboarding: undefined;
    Main: undefined;
    Profile: undefined;
    Grammar: undefined;
    Vocabulary: undefined;
    Dictionary: undefined;
    Lesson: { lessonId: string };
    GrammarLesson: { lessonId: string }; // Add this
    Conversation: { scenarioId: string };
    VocabularyDetail: { wordId: string };
    GrammarDetail: { topicId: string };
    Achievement: { achievementId: string };
    Snap: undefined;
    Story: undefined;
    Flashcards: undefined;
    // New Feature Screens
    Pronunciation: undefined;
    ArticleDrill: undefined;
    Dictation: undefined;
    PenPal: undefined;
    ExamPrep: undefined;
    CulturalGuide: undefined;
    IdiomsSlang: undefined;
    GrammarReference: undefined;
    FillInBlank: undefined;
    About: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Learn: undefined;
    Chat: undefined;
    Practice: undefined;
    Tools: undefined;
    Profile: undefined;
};

export type OnboardingStackParamList = {
    Welcome: undefined;
    LevelSelection: undefined;
    Goals: undefined;
    Schedule: undefined;
    Notifications: undefined;
};


// Flashcard System
export interface Flashcard {
    id: string;             // References VocabularyWord.id
    front: string;          // German word
    back: string;           // English translation
    example?: string;       // German example sentence
    exampleEn?: string;     // English translation of example

    // Leitner System Metadata
    box: 0 | 1 | 2 | 3 | 4 | 5; // 0 = New/Failed, 5 = Mastered
    nextReviewDate: string;     // ISO Date string
    lastReviewed?: string;      // ISO Date string
    streak: number;             // Consecutive correct answers
    easeFactor: number;         // 2.5 default (Simpler SuperMemo-2 style)
}

export type FlashcardDeck = Flashcard[];

