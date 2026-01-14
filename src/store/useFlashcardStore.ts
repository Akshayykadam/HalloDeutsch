import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard, VocabularyWord } from '../types';

// Mock or util helper could go here
// I'll grab a few words from a dummy list if needed, or better, I will implement a helper to convert VocabularyWord to Flashcard.

interface FlashcardState {
    deck: Flashcard[];
    dueCards: Flashcard[];
    initialized: boolean;

    // Actions
    initializeDeck: (words: VocabularyWord[]) => void;
    getDueCards: () => void;
    reviewCard: (cardId: string, rating: 'easy' | 'good' | 'hard' | 'again') => void;
    resetDeck: () => void;
}

// Leitner Intervals (in days) for Boxes 0-5
const BOX_INTERVALS = [0, 1, 3, 7, 14, 30];

export const useFlashcardStore = create<FlashcardState>()(
    persist(
        (set, get) => ({
            deck: [],
            dueCards: [],
            initialized: false,

            initializeDeck: (words) => {
                const newCards: Flashcard[] = words.map(w => ({
                    id: w.id,
                    front: w.german,
                    back: w.english,
                    example: w.exampleSentence,
                    exampleEn: w.exampleTranslation,
                    box: 0,
                    nextReviewDate: new Date().toISOString(),
                    streak: 0,
                    easeFactor: 2.5,
                }));

                set({
                    deck: newCards,
                    initialized: true
                });
            },

            getDueCards: () => {
                const { deck } = get();
                const now = new Date();
                const due = deck.filter(card => new Date(card.nextReviewDate) <= now);
                // Shuffle the due cards
                // set({ dueCards: due.sort(() => Math.random() - 0.5) }); 
                // Better deterministic sort for consistency or pure random? Random is fine for flashcards.
                set({ dueCards: due });
            },

            reviewCard: (cardId, rating) => {
                set((state) => {
                    const cardIndex = state.deck.findIndex(c => c.id === cardId);
                    if (cardIndex === -1) return state;

                    const card = { ...state.deck[cardIndex] };
                    const now = new Date();

                    // Simple Leitner Logic with 'rating' nuance
                    // Again: Box 0 (Reset)
                    // Hard: Box 0 (Reset) - could be arguably Box 1 but let's be strict for learning
                    // Good: Box + 1
                    // Easy: Box + 2 (Bonus)

                    if (rating === 'again' || rating === 'hard') {
                        card.box = 0;
                        card.streak = 0;
                    } else if (rating === 'good') {
                        card.box = Math.min(card.box + 1, 5) as any;
                        card.streak += 1;
                    } else if (rating === 'easy') {
                        card.box = Math.min(card.box + 2, 5) as any;
                        card.streak += 1;
                    }

                    // Calculate next review date
                    const daysToAdd = BOX_INTERVALS[card.box];
                    const nextDate = new Date();
                    nextDate.setDate(now.getDate() + daysToAdd);

                    // If 'again', maybe review in 1 minute? For now, let's say 'tomorrow' or 'today logic'
                    // Actually, strict Leitner Box 0 usually means "review again today/tomorrow".
                    // If Box 0 review is meant to be immediate, we usually handle that in a session queue.
                    // For this simple implementation, let's set Box 0 next review to Tomorrow (Interval 0 is placeholder, let's use 0.5 days or just 1 day)
                    if (card.box === 0) {
                        // If failed, review tomorrow? Or set to now?
                        // Let's set it to tomorrow for simplicity of the "Daily" mechanic. 
                        // Ideally Spaced Repetition systems re-queue failed cards in the SAME session.
                        // We'll implement session queue logic in the Screen separately if needed.
                        // For deck state persistence, let's set it to tomorrow (1 day).
                        nextDate.setDate(now.getDate() + 1);
                    }

                    card.nextReviewDate = nextDate.toISOString();
                    card.lastReviewed = now.toISOString();

                    const newDeck = [...state.deck];
                    newDeck[cardIndex] = card;

                    // Remove from dueCards
                    const newDueCards = state.dueCards.filter(c => c.id !== cardId);

                    return { deck: newDeck, dueCards: newDueCards };
                });
            },

            resetDeck: () => set({ deck: [], dueCards: [], initialized: false }),
        }),
        {
            name: 'flashcard-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
