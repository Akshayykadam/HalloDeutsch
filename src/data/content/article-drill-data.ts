// Article Drill Data - Der/Die/Das game nouns organized by level and gender patterns
import { CEFRLevel } from '../../types';

export interface ArticleNoun {
    id: string;
    german: string;
    english: string;
    article: 'der' | 'die' | 'das';
    level: CEFRLevel;
    pattern?: string; // Pattern hint like "-ung → die"
}

// Der (Masculine) patterns:
// -er, -en, -el endings (for people), -ling, -ich, -ig endings
// Days, months, seasons, compass directions, weather, cars

// Die (Feminine) patterns:
// -ung, -heit, -keit, -schaft, -ion, -tät, -ie, -ik, -ur endings
// Trees, flowers, many occupations (with -in suffix)

// Das (Neuter) patterns:
// -chen, -lein (diminutives), -um, -ment, -ma
// Infinitives used as nouns, most metals, colors as nouns

export const articleNouns: ArticleNoun[] = [
    // === A1 Level Nouns ===
    // Der (Masculine)
    { id: 'art-a1-001', german: 'Mann', english: 'man', article: 'der', level: 'A1' },
    { id: 'art-a1-002', german: 'Vater', english: 'father', article: 'der', level: 'A1' },
    { id: 'art-a1-003', german: 'Bruder', english: 'brother', article: 'der', level: 'A1' },
    { id: 'art-a1-004', german: 'Tag', english: 'day', article: 'der', level: 'A1' },
    { id: 'art-a1-005', german: 'Morgen', english: 'morning', article: 'der', level: 'A1' },
    { id: 'art-a1-006', german: 'Abend', english: 'evening', article: 'der', level: 'A1' },
    { id: 'art-a1-007', german: 'Tisch', english: 'table', article: 'der', level: 'A1' },
    { id: 'art-a1-008', german: 'Stuhl', english: 'chair', article: 'der', level: 'A1' },
    { id: 'art-a1-009', german: 'Hund', english: 'dog', article: 'der', level: 'A1' },
    { id: 'art-a1-010', german: 'Apfel', english: 'apple', article: 'der', level: 'A1' },
    { id: 'art-a1-011', german: 'Kaffee', english: 'coffee', article: 'der', level: 'A1' },
    { id: 'art-a1-012', german: 'Tee', english: 'tea', article: 'der', level: 'A1' },
    { id: 'art-a1-013', german: 'Zug', english: 'train', article: 'der', level: 'A1' },
    { id: 'art-a1-014', german: 'Bus', english: 'bus', article: 'der', level: 'A1' },
    { id: 'art-a1-015', german: 'Montag', english: 'Monday', article: 'der', level: 'A1' },

    // Die (Feminine)
    { id: 'art-a1-016', german: 'Frau', english: 'woman', article: 'die', level: 'A1' },
    { id: 'art-a1-017', german: 'Mutter', english: 'mother', article: 'die', level: 'A1' },
    { id: 'art-a1-018', german: 'Schwester', english: 'sister', article: 'die', level: 'A1' },
    { id: 'art-a1-019', german: 'Nacht', english: 'night', article: 'die', level: 'A1' },
    { id: 'art-a1-020', german: 'Woche', english: 'week', article: 'die', level: 'A1' },
    { id: 'art-a1-021', german: 'Schule', english: 'school', article: 'die', level: 'A1' },
    { id: 'art-a1-022', german: 'Katze', english: 'cat', article: 'die', level: 'A1' },
    { id: 'art-a1-023', german: 'Straße', english: 'street', article: 'die', level: 'A1' },
    { id: 'art-a1-024', german: 'Stadt', english: 'city', article: 'die', level: 'A1' },
    { id: 'art-a1-025', german: 'Milch', english: 'milk', article: 'die', level: 'A1' },
    { id: 'art-a1-026', german: 'Zeit', english: 'time', article: 'die', level: 'A1' },
    { id: 'art-a1-027', german: 'Uhr', english: 'clock/watch', article: 'die', level: 'A1' },
    { id: 'art-a1-028', german: 'Zeitung', english: 'newspaper', article: 'die', level: 'A1', pattern: '-ung → die' },
    { id: 'art-a1-029', german: 'Wohnung', english: 'apartment', article: 'die', level: 'A1', pattern: '-ung → die' },
    { id: 'art-a1-030', german: 'Tasche', english: 'bag', article: 'die', level: 'A1' },

    // Das (Neuter)
    { id: 'art-a1-031', german: 'Kind', english: 'child', article: 'das', level: 'A1' },
    { id: 'art-a1-032', german: 'Mädchen', english: 'girl', article: 'das', level: 'A1', pattern: '-chen → das' },
    { id: 'art-a1-033', german: 'Brötchen', english: 'bread roll', article: 'das', level: 'A1', pattern: '-chen → das' },
    { id: 'art-a1-034', german: 'Buch', english: 'book', article: 'das', level: 'A1' },
    { id: 'art-a1-035', german: 'Haus', english: 'house', article: 'das', level: 'A1' },
    { id: 'art-a1-036', german: 'Auto', english: 'car', article: 'das', level: 'A1' },
    { id: 'art-a1-037', german: 'Wasser', english: 'water', article: 'das', level: 'A1' },
    { id: 'art-a1-038', german: 'Brot', english: 'bread', article: 'das', level: 'A1' },
    { id: 'art-a1-039', german: 'Bild', english: 'picture', article: 'das', level: 'A1' },
    { id: 'art-a1-040', german: 'Telefon', english: 'telephone', article: 'das', level: 'A1' },
    { id: 'art-a1-041', german: 'Restaurant', english: 'restaurant', article: 'das', level: 'A1' },
    { id: 'art-a1-042', german: 'Hotel', english: 'hotel', article: 'das', level: 'A1' },
    { id: 'art-a1-043', german: 'Zimmer', english: 'room', article: 'das', level: 'A1' },
    { id: 'art-a1-044', german: 'Wetter', english: 'weather', article: 'das', level: 'A1' },
    { id: 'art-a1-045', german: 'Jahr', english: 'year', article: 'das', level: 'A1' },

    // === A2 Level Nouns ===
    // Der (Masculine)
    { id: 'art-a2-001', german: 'Arzt', english: 'doctor', article: 'der', level: 'A2' },
    { id: 'art-a2-002', german: 'Lehrer', english: 'teacher (m)', article: 'der', level: 'A2' },
    { id: 'art-a2-003', german: 'Bahnhof', english: 'train station', article: 'der', level: 'A2' },
    { id: 'art-a2-004', german: 'Flughafen', english: 'airport', article: 'der', level: 'A2' },
    { id: 'art-a2-005', german: 'Computer', english: 'computer', article: 'der', level: 'A2' },
    { id: 'art-a2-006', german: 'Kühlschrank', english: 'refrigerator', article: 'der', level: 'A2' },
    { id: 'art-a2-007', german: 'Frühling', english: 'spring', article: 'der', level: 'A2', pattern: '-ling → der' },
    { id: 'art-a2-008', german: 'Schmetterling', english: 'butterfly', article: 'der', level: 'A2', pattern: '-ling → der' },
    { id: 'art-a2-009', german: 'Kuchen', english: 'cake', article: 'der', level: 'A2' },
    { id: 'art-a2-010', german: 'Salat', english: 'salad', article: 'der', level: 'A2' },
    { id: 'art-a2-011', german: 'Norden', english: 'north', article: 'der', level: 'A2' },
    { id: 'art-a2-012', german: 'Winter', english: 'winter', article: 'der', level: 'A2' },
    { id: 'art-a2-013', german: 'Sommer', english: 'summer', article: 'der', level: 'A2' },
    { id: 'art-a2-014', german: 'Führerschein', english: 'driver\'s license', article: 'der', level: 'A2' },
    { id: 'art-a2-015', german: 'Schlüssel', english: 'key', article: 'der', level: 'A2' },

    // Die (Feminine)
    { id: 'art-a2-016', german: 'Ärztin', english: 'doctor (f)', article: 'die', level: 'A2', pattern: '-in → die' },
    { id: 'art-a2-017', german: 'Lehrerin', english: 'teacher (f)', article: 'die', level: 'A2', pattern: '-in → die' },
    { id: 'art-a2-018', german: 'Bäckerei', english: 'bakery', article: 'die', level: 'A2', pattern: '-ei → die' },
    { id: 'art-a2-019', german: 'Metzgerei', english: 'butcher shop', article: 'die', level: 'A2', pattern: '-ei → die' },
    { id: 'art-a2-020', german: 'Übung', english: 'exercise', article: 'die', level: 'A2', pattern: '-ung → die' },
    { id: 'art-a2-021', german: 'Rechnung', english: 'bill', article: 'die', level: 'A2', pattern: '-ung → die' },
    { id: 'art-a2-022', german: 'Gesundheit', english: 'health', article: 'die', level: 'A2', pattern: '-heit → die' },
    { id: 'art-a2-023', german: 'Krankheit', english: 'illness', article: 'die', level: 'A2', pattern: '-heit → die' },
    { id: 'art-a2-024', german: 'Möglichkeit', english: 'possibility', article: 'die', level: 'A2', pattern: '-keit → die' },
    { id: 'art-a2-025', german: 'Sauberkeit', english: 'cleanliness', article: 'die', level: 'A2', pattern: '-keit → die' },
    { id: 'art-a2-026', german: 'Klimaanlage', english: 'air conditioning', article: 'die', level: 'A2' },
    { id: 'art-a2-027', german: 'Waschmaschine', english: 'washing machine', article: 'die', level: 'A2' },
    { id: 'art-a2-028', german: 'Heizung', english: 'heating', article: 'die', level: 'A2', pattern: '-ung → die' },
    { id: 'art-a2-029', german: 'Prüfung', english: 'exam', article: 'die', level: 'A2', pattern: '-ung → die' },
    { id: 'art-a2-030', german: 'Erfahrung', english: 'experience', article: 'die', level: 'A2', pattern: '-ung → die' },

    // Das (Neuter)
    { id: 'art-a2-031', german: 'Hähnchen', english: 'chicken', article: 'das', level: 'A2', pattern: '-chen → das' },
    { id: 'art-a2-032', german: 'Kätzchen', english: 'kitten', article: 'das', level: 'A2', pattern: '-chen → das' },
    { id: 'art-a2-033', german: 'Geschäft', english: 'shop/business', article: 'das', level: 'A2' },
    { id: 'art-a2-034', german: 'Gedächtnis', english: 'memory', article: 'das', level: 'A2', pattern: '-nis → das' },
    { id: 'art-a2-035', german: 'Ergebnis', english: 'result', article: 'das', level: 'A2', pattern: '-nis → das' },
    { id: 'art-a2-036', german: 'Medikament', english: 'medicine', article: 'das', level: 'A2', pattern: '-ment → das' },
    { id: 'art-a2-037', german: 'Dokument', english: 'document', article: 'das', level: 'A2', pattern: '-ment → das' },
    { id: 'art-a2-038', german: 'Gemüse', english: 'vegetables', article: 'das', level: 'A2' },
    { id: 'art-a2-039', german: 'Obst', english: 'fruit', article: 'das', level: 'A2' },
    { id: 'art-a2-040', german: 'Fleisch', english: 'meat', article: 'das', level: 'A2' },
    { id: 'art-a2-041', german: 'Frühstück', english: 'breakfast', article: 'das', level: 'A2' },
    { id: 'art-a2-042', german: 'Mittagessen', english: 'lunch', article: 'das', level: 'A2' },
    { id: 'art-a2-043', german: 'Abendessen', english: 'dinner', article: 'das', level: 'A2' },
    { id: 'art-a2-044', german: 'Zentrum', english: 'center', article: 'das', level: 'A2', pattern: '-um → das' },
    { id: 'art-a2-045', german: 'Museum', english: 'museum', article: 'das', level: 'A2', pattern: '-um → das' },

    // === B1 Level Nouns ===
    // Der (Masculine)
    { id: 'art-b1-001', german: 'Angestellte', english: 'employee (m)', article: 'der', level: 'B1' },
    { id: 'art-b1-002', german: 'Bewerber', english: 'applicant', article: 'der', level: 'B1' },
    { id: 'art-b1-003', german: 'Unterschied', english: 'difference', article: 'der', level: 'B1' },
    { id: 'art-b1-004', german: 'Einfluss', english: 'influence', article: 'der', level: 'B1' },
    { id: 'art-b1-005', german: 'Erfolg', english: 'success', article: 'der', level: 'B1' },
    { id: 'art-b1-006', german: 'Fortschritt', english: 'progress', article: 'der', level: 'B1' },
    { id: 'art-b1-007', german: 'Gedanke', english: 'thought', article: 'der', level: 'B1' },
    { id: 'art-b1-008', german: 'Hinweis', english: 'hint/reference', article: 'der', level: 'B1' },
    { id: 'art-b1-009', german: 'Konflikt', english: 'conflict', article: 'der', level: 'B1' },
    { id: 'art-b1-010', german: 'Lehrling', english: 'apprentice', article: 'der', level: 'B1', pattern: '-ling → der' },
    { id: 'art-b1-011', german: 'Zusammenhang', english: 'context', article: 'der', level: 'B1' },
    { id: 'art-b1-012', german: 'Vertrag', english: 'contract', article: 'der', level: 'B1' },
    { id: 'art-b1-013', german: 'Antrag', english: 'application', article: 'der', level: 'B1' },
    { id: 'art-b1-014', german: 'Zeitraum', english: 'period', article: 'der', level: 'B1' },
    { id: 'art-b1-015', german: 'Bereich', english: 'area/field', article: 'der', level: 'B1' },

    // Die (Feminine)
    { id: 'art-b1-016', german: 'Wissenschaft', english: 'science', article: 'die', level: 'B1', pattern: '-schaft → die' },
    { id: 'art-b1-017', german: 'Gesellschaft', english: 'society', article: 'die', level: 'B1', pattern: '-schaft → die' },
    { id: 'art-b1-018', german: 'Beziehung', english: 'relationship', article: 'die', level: 'B1', pattern: '-ung → die' },
    { id: 'art-b1-019', german: 'Entwicklung', english: 'development', article: 'die', level: 'B1', pattern: '-ung → die' },
    { id: 'art-b1-020', german: 'Verantwortung', english: 'responsibility', article: 'die', level: 'B1', pattern: '-ung → die' },
    { id: 'art-b1-021', german: 'Universität', english: 'university', article: 'die', level: 'B1', pattern: '-tät → die' },
    { id: 'art-b1-022', german: 'Qualität', english: 'quality', article: 'die', level: 'B1', pattern: '-tät → die' },
    { id: 'art-b1-023', german: 'Information', english: 'information', article: 'die', level: 'B1', pattern: '-ion → die' },
    { id: 'art-b1-024', german: 'Diskussion', english: 'discussion', article: 'die', level: 'B1', pattern: '-ion → die' },
    { id: 'art-b1-025', german: 'Situation', english: 'situation', article: 'die', level: 'B1', pattern: '-ion → die' },
    { id: 'art-b1-026', german: 'Gelegenheit', english: 'opportunity', article: 'die', level: 'B1', pattern: '-heit → die' },
    { id: 'art-b1-027', german: 'Schwierigkeit', english: 'difficulty', article: 'die', level: 'B1', pattern: '-keit → die' },
    { id: 'art-b1-028', german: 'Ausbildung', english: 'training/education', article: 'die', level: 'B1', pattern: '-ung → die' },
    { id: 'art-b1-029', german: 'Umgebung', english: 'environment', article: 'die', level: 'B1', pattern: '-ung → die' },
    { id: 'art-b1-030', german: 'Verbesserung', english: 'improvement', article: 'die', level: 'B1', pattern: '-ung → die' },

    // Das (Neuter)
    { id: 'art-b1-031', german: 'Verhalten', english: 'behavior', article: 'das', level: 'B1' },
    { id: 'art-b1-032', german: 'Verhältnis', english: 'ratio/relationship', article: 'das', level: 'B1', pattern: '-nis → das' },
    { id: 'art-b1-033', german: 'Ereignis', english: 'event', article: 'das', level: 'B1', pattern: '-nis → das' },
    { id: 'art-b1-034', german: 'Zeugnis', english: 'certificate', article: 'das', level: 'B1', pattern: '-nis → das' },
    { id: 'art-b1-035', german: 'Argument', english: 'argument', article: 'das', level: 'B1', pattern: '-ment → das' },
    { id: 'art-b1-036', german: 'Instrument', english: 'instrument', article: 'das', level: 'B1', pattern: '-ment → das' },
    { id: 'art-b1-037', german: 'Studium', english: 'studies', article: 'das', level: 'B1', pattern: '-um → das' },
    { id: 'art-b1-038', german: 'Praktikum', english: 'internship', article: 'das', level: 'B1', pattern: '-um → das' },
    { id: 'art-b1-039', german: 'Publikum', english: 'audience', article: 'das', level: 'B1', pattern: '-um → das' },
    { id: 'art-b1-040', german: 'Einkommen', english: 'income', article: 'das', level: 'B1' },
    { id: 'art-b1-041', german: 'Unternehmen', english: 'company', article: 'das', level: 'B1' },
    { id: 'art-b1-042', german: 'System', english: 'system', article: 'das', level: 'B1' },
    { id: 'art-b1-043', german: 'Thema', english: 'topic', article: 'das', level: 'B1', pattern: '-ma → das' },
    { id: 'art-b1-044', german: 'Problem', english: 'problem', article: 'das', level: 'B1' },
    { id: 'art-b1-045', german: 'Klima', english: 'climate', article: 'das', level: 'B1', pattern: '-ma → das' },

    // === B2 Level Nouns ===
    // Der (Masculine)
    { id: 'art-b2-001', german: 'Aspekt', english: 'aspect', article: 'der', level: 'B2' },
    { id: 'art-b2-002', german: 'Begriff', english: 'concept/term', article: 'der', level: 'B2' },
    { id: 'art-b2-003', german: 'Beitrag', english: 'contribution', article: 'der', level: 'B2' },
    { id: 'art-b2-004', german: 'Eindruck', english: 'impression', article: 'der', level: 'B2' },
    { id: 'art-b2-005', german: 'Faktor', english: 'factor', article: 'der', level: 'B2' },
    { id: 'art-b2-006', german: 'Hintergrund', english: 'background', article: 'der', level: 'B2' },
    { id: 'art-b2-007', german: 'Schwerpunkt', english: 'focus/emphasis', article: 'der', level: 'B2' },
    { id: 'art-b2-008', german: 'Standpunkt', english: 'viewpoint', article: 'der', level: 'B2' },
    { id: 'art-b2-009', german: 'Zusammenhang', english: 'connection', article: 'der', level: 'B2' },
    { id: 'art-b2-010', german: 'Widerspruch', english: 'contradiction', article: 'der', level: 'B2' },

    // Die (Feminine)
    { id: 'art-b2-011', german: 'Eigenschaft', english: 'characteristic', article: 'die', level: 'B2', pattern: '-schaft → die' },
    { id: 'art-b2-012', german: 'Wirtschaft', english: 'economy', article: 'die', level: 'B2', pattern: '-schaft → die' },
    { id: 'art-b2-013', german: 'Unabhängigkeit', english: 'independence', article: 'die', level: 'B2', pattern: '-keit → die' },
    { id: 'art-b2-014', german: 'Nachhaltigkeit', english: 'sustainability', article: 'die', level: 'B2', pattern: '-keit → die' },
    { id: 'art-b2-015', german: 'Globalisierung', english: 'globalization', article: 'die', level: 'B2', pattern: '-ung → die' },
    { id: 'art-b2-016', german: 'Voraussetzung', english: 'prerequisite', article: 'die', level: 'B2', pattern: '-ung → die' },
    { id: 'art-b2-017', german: 'Komplexität', english: 'complexity', article: 'die', level: 'B2', pattern: '-tät → die' },
    { id: 'art-b2-018', german: 'Identität', english: 'identity', article: 'die', level: 'B2', pattern: '-tät → die' },
    { id: 'art-b2-019', german: 'Integration', english: 'integration', article: 'die', level: 'B2', pattern: '-ion → die' },
    { id: 'art-b2-020', german: 'Perspektive', english: 'perspective', article: 'die', level: 'B2' },

    // Das (Neuter)
    { id: 'art-b2-021', german: 'Bewusstsein', english: 'awareness', article: 'das', level: 'B2' },
    { id: 'art-b2-022', german: 'Gleichgewicht', english: 'balance', article: 'das', level: 'B2' },
    { id: 'art-b2-023', german: 'Phänomen', english: 'phenomenon', article: 'das', level: 'B2' },
    { id: 'art-b2-024', german: 'Prinzip', english: 'principle', article: 'das', level: 'B2' },
    { id: 'art-b2-025', german: 'Engagement', english: 'commitment', article: 'das', level: 'B2', pattern: '-ment → das' },
    { id: 'art-b2-026', german: 'Management', english: 'management', article: 'das', level: 'B2', pattern: '-ment → das' },
    { id: 'art-b2-027', german: 'Paradigma', english: 'paradigm', article: 'das', level: 'B2', pattern: '-ma → das' },
    { id: 'art-b2-028', german: 'Spektrum', english: 'spectrum', article: 'das', level: 'B2', pattern: '-um → das' },
    { id: 'art-b2-029', german: 'Kriterium', english: 'criterion', article: 'das', level: 'B2', pattern: '-um → das' },
    { id: 'art-b2-030', german: 'Potenzial', english: 'potential', article: 'das', level: 'B2' },
];

// Gender patterns for learning
export const genderPatterns = [
    { pattern: '-ung', article: 'die', examples: ['Zeitung', 'Wohnung', 'Übung'] },
    { pattern: '-heit', article: 'die', examples: ['Gesundheit', 'Krankheit', 'Freiheit'] },
    { pattern: '-keit', article: 'die', examples: ['Möglichkeit', 'Schwierigkeit', 'Sauberkeit'] },
    { pattern: '-schaft', article: 'die', examples: ['Wissenschaft', 'Gesellschaft', 'Freundschaft'] },
    { pattern: '-ion', article: 'die', examples: ['Information', 'Diskussion', 'Situation'] },
    { pattern: '-tät', article: 'die', examples: ['Universität', 'Qualität', 'Identität'] },
    { pattern: '-ie', article: 'die', examples: ['Energie', 'Demokratie', 'Philosophie'] },
    { pattern: '-ei', article: 'die', examples: ['Bäckerei', 'Metzgerei', 'Polizei'] },
    { pattern: '-in (feminine)', article: 'die', examples: ['Ärztin', 'Lehrerin', 'Studentin'] },
    { pattern: '-chen', article: 'das', examples: ['Mädchen', 'Brötchen', 'Hähnchen'] },
    { pattern: '-lein', article: 'das', examples: ['Fräulein', 'Büchlein', 'Kindlein'] },
    { pattern: '-um', article: 'das', examples: ['Museum', 'Zentrum', 'Studium'] },
    { pattern: '-ment', article: 'das', examples: ['Dokument', 'Argument', 'Instrument'] },
    { pattern: '-nis', article: 'das', examples: ['Ergebnis', 'Ereignis', 'Zeugnis'] },
    { pattern: '-ma', article: 'das', examples: ['Thema', 'Problem', 'Klima'] },
    { pattern: '-ling', article: 'der', examples: ['Frühling', 'Schmetterling', 'Lehrling'] },
];

export const getNounsByLevel = (level: CEFRLevel): ArticleNoun[] => {
    return articleNouns.filter(noun => noun.level === level);
};

export const getRandomNounsForGame = (level: CEFRLevel, count: number = 20): ArticleNoun[] => {
    const levelNouns = getNounsByLevel(level);
    const shuffled = [...levelNouns].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getAllNouns = (): ArticleNoun[] => articleNouns;
