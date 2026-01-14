// Unified Curriculum Service - Access all CEFR levels
// Provides unified access to modules and lessons across A1, A2, B1, B2

import { CEFRLevel, CurriculumModule, CurriculumLesson } from '../../types';
import { A1_MODULES } from './a1-curriculum';
import { A2_MODULES } from './a2-curriculum';
import { B1_MODULES } from './b1-curriculum';
import { B2_MODULES } from './b2-curriculum';

// All modules by level
export const ALL_MODULES: Record<CEFRLevel, CurriculumModule[]> = {
    'A1': A1_MODULES,
    'A2': A2_MODULES,
    'B1': B1_MODULES,
    'B2': B2_MODULES,
};

// Get modules for a specific level
export const getModulesForLevel = (level: CEFRLevel): CurriculumModule[] => {
    return ALL_MODULES[level] || [];
};

// Get all modules across all levels
export const getAllModules = (): CurriculumModule[] => {
    return [...A1_MODULES, ...A2_MODULES, ...B1_MODULES, ...B2_MODULES];
};

// Get module by ID (searches all levels)
export const getModuleById = (moduleId: string): CurriculumModule | undefined => {
    return getAllModules().find(m => m.id === moduleId);
};

// Get lesson by ID (searches all levels)
export const getLessonById = (lessonId: string): CurriculumLesson | undefined => {
    return getAllLessons().find(l => l.id === lessonId);
};

// Get all lessons for a level
export const getLessonsForLevel = (level: CEFRLevel): CurriculumLesson[] => {
    const modules = getModulesForLevel(level);
    return modules.flatMap(m => m.lessons);
};

// Get all lessons across all levels
export const getAllLessons = (): CurriculumLesson[] => {
    return getAllModules().flatMap(m => m.lessons);
};

// Calculate stats for a specific level
export const getLevelStats = (level: CEFRLevel) => {
    const modules = getModulesForLevel(level);
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const totalHours = modules.reduce((sum, m) => sum + m.estimatedHours, 0);
    return {
        level,
        modules: modules.length,
        lessons: totalLessons,
        estimatedHours: totalHours,
    };
};

// Calculate overall curriculum stats
export const getCurriculumStats = () => {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
    const byLevel = levels.map(getLevelStats);

    return {
        totalModules: byLevel.reduce((sum, s) => sum + s.modules, 0),
        totalLessons: byLevel.reduce((sum, s) => sum + s.lessons, 0),
        totalHours: byLevel.reduce((sum, s) => sum + s.estimatedHours, 0),
        byLevel,
    };
};

// Get next lesson after completing a lesson
export const getNextLesson = (currentLessonId: string): CurriculumLesson | undefined => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);

    if (currentIndex === -1 || currentIndex >= allLessons.length - 1) {
        return undefined;
    }

    return allLessons[currentIndex + 1];
};

// Check if a level is unlocked based on previous level completion
export const isLevelUnlocked = (level: CEFRLevel, completedLessons: string[]): boolean => {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
    const levelIndex = levels.indexOf(level);

    // A1 is always unlocked
    if (levelIndex === 0) return true;

    // Check if previous level has at least 80% completion
    const previousLevel = levels[levelIndex - 1];
    const previousLessons = getLessonsForLevel(previousLevel);
    const completedCount = previousLessons.filter(l =>
        completedLessons.includes(l.id)
    ).length;

    return completedCount >= previousLessons.length * 0.8;
};

// Get the module containing a specific lesson
export const getModuleForLesson = (lessonId: string): CurriculumModule | undefined => {
    const allModules = getAllModules();
    return allModules.find(m => m.lessons.some(l => l.id === lessonId));
};

// Check if a lesson is the last one in its module
export const isLastLessonInModule = (lessonId: string): boolean => {
    const module = getModuleForLesson(lessonId);
    if (!module) return false;
    const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
    return lessonIndex === module.lessons.length - 1;
};

// Get next lesson within the same module (returns undefined if at end of module)
export const getNextLessonInModule = (lessonId: string): CurriculumLesson | undefined => {
    const module = getModuleForLesson(lessonId);
    if (!module) return undefined;
    const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1 || lessonIndex >= module.lessons.length - 1) {
        return undefined;
    }
    return module.lessons[lessonIndex + 1];
};

// Available CEFR levels
export const AVAILABLE_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

// Level descriptions for UI
export const LEVEL_DESCRIPTIONS: Record<CEFRLevel, { name: string; description: string }> = {
    'A1': { name: 'Beginner', description: 'Basic phrases and simple interactions' },
    'A2': { name: 'Elementary', description: 'Everyday situations and past events' },
    'B1': { name: 'Intermediate', description: 'Complex grammar and detailed discussions' },
    'B2': { name: 'Upper Intermediate', description: 'Professional German and nuanced expression' },
};
