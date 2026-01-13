import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CEFRLevel } from '../types';

export interface SavedStory {
    id: string;
    title: string;
    content: string;
    translation: string;
    vocabulary: Array<{ word: string; translation: string }>;
    level: CEFRLevel;
    topic: string;
    createdAt: number;
}

interface StoryState {
    stories: SavedStory[];
    addStory: (story: Omit<SavedStory, 'id' | 'createdAt'>) => void;
    removeStory: (id: string) => void;
    isSaved: (title: string) => boolean;
}

export const useStoryStore = create<StoryState>()(
    persist(
        (set, get) => ({
            stories: [],
            addStory: (story) => {
                const newStory: SavedStory = {
                    ...story,
                    id: Date.now().toString(),
                    createdAt: Date.now(),
                };
                set((state) => ({ stories: [newStory, ...state.stories] }));
            },
            removeStory: (id) => {
                set((state) => ({
                    stories: state.stories.filter((s) => s.id !== id),
                }));
            },
            isSaved: (title) => {
                return get().stories.some((s) => s.title === title);
            },
        }),
        {
            name: 'story-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
