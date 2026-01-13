// Lesson state store - handles current lesson and session state
import { create } from 'zustand';
import { Lesson, Exercise, ExerciseResult, LessonSession } from '../types';

interface LessonState {
    // Current lesson
    currentLesson: Lesson | null;
    currentExerciseIndex: number;
    exercises: Exercise[];

    // Session tracking
    session: LessonSession | null;
    exerciseResults: ExerciseResult[];
    heartsRemaining: number;
    hintsUsed: number;

    // Actions
    startLesson: (lesson: Lesson, exercises: Exercise[]) => void;
    submitAnswer: (result: ExerciseResult) => void;
    nextExercise: () => void;
    previousExercise: () => void;
    useHint: () => void;
    loseHeart: () => void;
    completeLesson: () => LessonSession;
    resetLesson: () => void;
}

const MAX_HEARTS = 5;
const MAX_HINTS = 3;

export const useLessonStore = create<LessonState>((set, get) => ({
    currentLesson: null,
    currentExerciseIndex: 0,
    exercises: [],
    session: null,
    exerciseResults: [],
    heartsRemaining: MAX_HEARTS,
    hintsUsed: 0,

    startLesson: (lesson, exercises) =>
        set({
            currentLesson: lesson,
            exercises,
            currentExerciseIndex: 0,
            exerciseResults: [],
            heartsRemaining: MAX_HEARTS,
            hintsUsed: 0,
            session: {
                lessonId: lesson.id,
                startedAt: new Date(),
                exerciseResults: [],
                totalXP: 0,
                accuracy: 0,
            },
        }),

    submitAnswer: (result) =>
        set((state) => {
            const newResults = [...state.exerciseResults, result];
            if (!result.isCorrect) {
                return {
                    exerciseResults: newResults,
                    heartsRemaining: Math.max(0, state.heartsRemaining - 1),
                };
            }
            return { exerciseResults: newResults };
        }),

    nextExercise: () =>
        set((state) => ({
            currentExerciseIndex: Math.min(
                state.currentExerciseIndex + 1,
                state.exercises.length - 1
            ),
        })),

    previousExercise: () =>
        set((state) => ({
            currentExerciseIndex: Math.max(0, state.currentExerciseIndex - 1),
        })),

    useHint: () =>
        set((state) => ({
            hintsUsed: Math.min(state.hintsUsed + 1, MAX_HINTS),
        })),

    loseHeart: () =>
        set((state) => ({
            heartsRemaining: Math.max(0, state.heartsRemaining - 1),
        })),

    completeLesson: () => {
        const state = get();
        const correctAnswers = state.exerciseResults.filter((r) => r.isCorrect).length;
        const accuracy =
            state.exerciseResults.length > 0
                ? (correctAnswers / state.exerciseResults.length) * 100
                : 0;

        // Calculate XP based on accuracy and hearts remaining
        const baseXP = state.currentLesson?.xpReward ?? 10;
        const accuracyBonus = Math.floor(accuracy / 10);
        const heartBonus = state.heartsRemaining * 2;
        const totalXP = baseXP + accuracyBonus + heartBonus;

        const completedSession: LessonSession = {
            lessonId: state.currentLesson?.id ?? '',
            startedAt: state.session?.startedAt ?? new Date(),
            completedAt: new Date(),
            exerciseResults: state.exerciseResults,
            totalXP,
            accuracy,
        };

        return completedSession;
    },

    resetLesson: () =>
        set({
            currentLesson: null,
            currentExerciseIndex: 0,
            exercises: [],
            session: null,
            exerciseResults: [],
            heartsRemaining: MAX_HEARTS,
            hintsUsed: 0,
        }),
}));
