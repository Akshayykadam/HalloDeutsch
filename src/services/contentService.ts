import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    limit,
    orderBy,
    startAfter,
} from '@react-native-firebase/firestore';
import { VocabularyWord } from '../types';

/**
 * Content Service - Fetches app content from Firestore
 */

const db = getFirestore();

// Interfaces
export interface SearchOptions {
    limit?: number;
    startAfter?: any;
}

/**
 * Fetch vocabulary by level
 */
export const getVocabularyByLevel = async (level: string, options: SearchOptions = { limit: 20 }): Promise<VocabularyWord[]> => {
    try {
        const wordsRef = collection(db, 'content', 'static', 'vocabulary');
        let q = query(
            wordsRef,
            where('level', '==', level),
            orderBy('german'),
            limit(options.limit || 20)
        );

        if (options.startAfter) {
            q = query(q, startAfter(options.startAfter));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc: any) => doc.data() as VocabularyWord);
    } catch (error) {
        console.error('Error fetching vocabulary by level:', error);
        return [];
    }
};

/**
 * Search vocabulary by german word (simple prefix search)
 * Note: Firestore doesn't support full-text search natively. 
 * We use >= queryText and <= queryText + '\uf8ff' for prefix matching.
 */
export const searchVocabulary = async (searchText: string): Promise<VocabularyWord[]> => {
    if (!searchText || searchText.length < 2) return [];

    try {
        const normalizedSearch = searchText; // Case sensitivity is tricky in Firestore without extra fields
        // Ideally we'd store a 'german_lowercase' field for case-insensitive search.
        // For now, we'll try strict match on the 'german' field which is capitalized usually.
        // A better approach for production is Algolia or a specialized 'keywords' array.

        // Strategy: We will fetch reasonable amount and filter client side if needed, 
        // or just rely on 'german' field exact prefix if user types Capitalized.
        // To make it friendlier, let's assume valid German nouns are capitalized.

        let searchTerm = searchText;
        if (searchText.length > 0) {
            searchTerm = searchText.charAt(0).toUpperCase() + searchText.slice(1);
        }

        const wordsRef = collection(db, 'content', 'static', 'vocabulary');
        const q = query(
            wordsRef,
            where('german', '>=', searchTerm),
            where('german', '<=', searchTerm + '\uf8ff'),
            limit(10)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc: any) => doc.data() as VocabularyWord);
    } catch (error) {
        console.error('Error searching vocabulary:', error);
        return [];
    }
};


/**
 * Get vocabulary words by domains
 */
export const getVocabularyByDomains = async (domains: string[]): Promise<VocabularyWord[]> => {
    if (!domains || domains.length === 0) return [];

    // Firestore 'in' query supports up to 10 values
    // If more, we might need multiple queries, but typically we have 1-3 domains per lesson.
    try {
        const vocabRef = collection(db, 'content', 'static', 'vocabulary');
        const q = query(vocabRef, where('domain', 'in', domains.slice(0, 10)));

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        } as VocabularyWord));
    } catch (error) {
        console.error('Error fetching vocabulary by domains:', error);
        return [];
    }
};

/**
 * Get a single vocabulary word by ID
 */
export const getVocabularyWord = async (id: string): Promise<VocabularyWord | null> => {
    try {
        const docRef = doc(db, 'content', 'static', 'vocabulary', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as VocabularyWord;
        }
        return null;
    } catch (error) {
        console.error('Error fetching word:', error);
        return null;
    }
};
/**
 * Get curriculum modules by level
 */
/**
 * Get curriculum modules by level
 */
export const getCurriculumModules = async (level: string): Promise<any[]> => {
    try {
        const modulesRef = collection(db, 'content', 'static', 'modules');
        // Client-side sort to avoid requiring composite index immediately
        const q = query(
            modulesRef,
            where('levelId', '==', level)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc: any) => doc.data());
        return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error('Error fetching modules:', error);
        return [];
    }
};

/**
 * Get lessons for a module
 */
export const getCurriculumLessons = async (moduleId: string): Promise<any[]> => {
    try {
        const lessonsRef = collection(db, 'content', 'static', 'lessons');
        // Client-side sort to avoid requiring composite index immediately
        const q = query(
            lessonsRef,
            where('moduleId', '==', moduleId)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc: any) => doc.data());
        return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return [];
    }
};

/**
 * Get grammar topics, optionally filtered by level
 */
export const getGrammarTopics = async (level?: string): Promise<any[]> => {
    try {
        const grammarRef = collection(db, 'content', 'static', 'grammar');
        let q;

        if (level) {
            q = query(grammarRef, where('level', '==', level));
        } else {
            q = query(grammarRef);
        }

        const snapshot = await getDocs(q);
        // Deserialize tables rowsJson back to rows array
        const topics = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            if (data.tables && Array.isArray(data.tables)) {
                data.tables = data.tables.map((table: any) => ({
                    ...table,
                    rows: table.rowsJson ? JSON.parse(table.rowsJson) : [],
                }));
            }
            return data;
        });

        // Sort client-side by level and order to avoid composite index
        return topics.sort((a, b) => {
            if (a.level !== b.level) {
                return a.level.localeCompare(b.level);
            }
            return (a.order || 0) - (b.order || 0);
        });
    } catch (error) {
        console.error('Error fetching grammar topics:', error);
        return [];
    }
};

/**
 * Get exercises, optionally filtered by type and level
 */
export const getExercises = async (type?: string, level?: string): Promise<any[]> => {
    try {
        const exercisesRef = collection(db, 'content', 'static', 'exercises');
        let q = query(exercisesRef, limit(50));

        if (type) q = query(q, where('type', '==', type));
        if (level) q = query(q, where('level', '==', level));

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc: any) => doc.data());
    } catch (error) {
        console.error('Error fetching exercises:', error);
        return [];
    }
};

/**
 * Get a specific curriculum module by ID
 */
export const getCurriculumModule = async (moduleId: string): Promise<any | null> => {
    try {
        const docRef = doc(db, 'content', 'static', 'modules', moduleId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error('Error fetching module:', error);
        return null;
    }
};

/**
 * Get a specific lesson by ID
 */
export const getLessonById = async (lessonId: string): Promise<any | null> => {
    try {
        const docRef = doc(db, 'content', 'static', 'lessons', lessonId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error('Error fetching lesson:', error);
        return null;
    }
};


