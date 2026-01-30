import { getFirestore, collection, writeBatch, doc, serverTimestamp } from '@react-native-firebase/firestore';
import { extendedVocabulary } from '../data/content/extended-vocabulary';
import { a1Vocabulary } from '../data/content/a1-vocabulary';
import { A1_VOCABULARY } from '../data/content/vocabulary-comprehensive';
import { A1_MODULES } from '../data/content/a1-curriculum';
import { A2_MODULES } from '../data/content/a2-curriculum';
import { B1_MODULES } from '../data/content/b1-curriculum';
import { B2_MODULES } from '../data/content/b2-curriculum';
import { grammarTopics } from '../data/content/grammar-content';
import { allExercises } from '../data/content/exercise-data';





const db = getFirestore();

/**
 * Uploads all local content to Firestore
 * This handles Vocabulary, Curriculum, Grammar, Exercises, Reading, and Dialogues
 */
export const seedDatabase = async (
    onProgress: (status: string, progress: number) => void
) => {
    try {
        await seedVocabulary((p) => onProgress('Seeding Vocabulary...', p * 0.16));
        await seedCurriculum((p) => onProgress('Seeding Curriculum...', 0.16 + p * 0.16));
        await seedGrammar((p) => onProgress('Seeding Grammar...', 0.32 + p * 0.16));
        await seedExercises((p) => onProgress('Seeding Exercises...', 0.48 + p * 0.16));
        onProgress('Done!', 1);
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

export const seedVocabulary = async (onProgress?: (progress: number) => void) => {
    // Merge all vocabulary sources, using German word as key to avoid duplicate words
    const allVocabularyMap = new Map<string, typeof extendedVocabulary[0]>();

    // Add extended vocabulary first (will be the primary source for duplicates)
    extendedVocabulary.forEach(word => {
        const key = word.german.toLowerCase().trim();
        allVocabularyMap.set(key, word);
    });

    // Add a1Vocabulary (only if German word doesn't already exist)
    a1Vocabulary.forEach(word => {
        const key = word.german.toLowerCase().trim();
        if (!allVocabularyMap.has(key)) {
            allVocabularyMap.set(key, word);
        }
    });

    // Add A1_VOCABULARY from vocabulary-comprehensive.ts (only if German word doesn't already exist)
    A1_VOCABULARY.forEach(word => {
        const key = word.german.toLowerCase().trim();
        if (!allVocabularyMap.has(key)) {
            allVocabularyMap.set(key, word);
        }
    });

    const allVocabulary = Array.from(allVocabularyMap.values());

    console.log(`Starting migration of ${allVocabulary.length} unique words...`);
    const batchSize = 400; // Firestore limit is 500
    const chunks = [];

    for (let i = 0; i < allVocabulary.length; i += batchSize) {
        chunks.push(allVocabulary.slice(i, i + batchSize));
    }

    let processed = 0;
    for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(word => {
            // Use word.id as document ID to prevent duplicates on re-seed
            const docRef = doc(db, 'content', 'static', 'vocabulary', word.id);
            batch.set(docRef, { ...word, updatedAt: serverTimestamp() });
        });
        await batch.commit();
        processed += chunk.length;
        if (onProgress) onProgress(processed / allVocabulary.length);
    }
    return true;
};

export const seedCurriculum = async (onProgress?: (progress: number) => void) => {
    const allModules = [...A1_MODULES, ...A2_MODULES, ...B1_MODULES, ...B2_MODULES];
    console.log(`Starting migration of ${allModules.length} modules...`);
    const batch = writeBatch(db);

    // Upload Modules
    allModules.forEach(module => {
        // Path: content/static/modules/{moduleId}
        const modRef = doc(db, 'content', 'static', 'modules', module.id);

        // Sanitize module for static storage (no user progress)
        const sanitizedModule = {
            ...module,
            isCompleted: false,
            progress: 0,
            lessons: module.lessons.map(l => ({
                ...l,
                isCompleted: false,
                progress: 0,
            })),
            updatedAt: serverTimestamp()
        };
        batch.set(modRef, sanitizedModule);

        // Upload Lessons
        // Path: content/static/lessons/{lessonId}
        module.lessons.forEach(lesson => {
            const lessonRef = doc(db, 'content', 'static', 'lessons', lesson.id);
            const sanitizedLesson = {
                ...lesson,
                isCompleted: false,
                progress: 0,
                updatedAt: serverTimestamp()
            };
            batch.set(lessonRef, sanitizedLesson);
        });
    });

    await batch.commit();
    if (onProgress) onProgress(1);
    return true;
};

export const seedGrammar = async (onProgress?: (progress: number) => void) => {
    console.log(`Starting migration of ${grammarTopics.length} grammar topics...`);
    const batch = writeBatch(db);

    grammarTopics.forEach(topic => {
        const docRef = doc(db, 'content', 'static', 'grammar', topic.id);

        // Serialize tables to avoid Firestore nested array limitation
        const serializedTables = topic.tables?.map(table => ({
            title: table.title,
            headers: table.headers,
            rowsJson: JSON.stringify(table.rows), // Convert nested array to JSON string
        }));

        const sanitizedTopic = {
            ...topic,
            tables: serializedTables || [],
            completedLessons: 0,
            updatedAt: serverTimestamp()
        };
        batch.set(docRef, sanitizedTopic);
    });

    await batch.commit();
    if (onProgress) onProgress(1);
    return true;
};

export const seedExercises = async (onProgress?: (progress: number) => void) => {
    console.log(`Starting migration of ${allExercises.length} exercises...`);
    const batchSize = 400;
    const chunks = [];

    for (let i = 0; i < allExercises.length; i += batchSize) {
        chunks.push(allExercises.slice(i, i + batchSize));
    }

    let processed = 0;
    for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(ex => {
            const docRef = doc(db, 'content', 'static', 'exercises', ex.id);
            batch.set(docRef, { ...ex, updatedAt: serverTimestamp() });
        });
        await batch.commit();
        processed += chunk.length;
        if (onProgress) onProgress(processed / allExercises.length);
    }
    return true;
};


