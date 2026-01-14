// Extended Vocabulary from German Wikibook PDF
// Comprehensive food, number, and daily vocabulary

import { VocabularyWord } from '../../types';

// ============================================
// FOOD VOCABULARY (from German Wikibook - Lesson 1.03 Essen)
// ============================================

export const foodVocabulary: VocabularyWord[] = [
    // === FRUITS (die Früchte / das Obst) ===
    { id: 'food-001', german: 'der Apfel', english: 'apple', pronunciation: 'AP-fel', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Äpfel' },
    { id: 'food-002', german: 'die Banane', english: 'banana', pronunciation: 'ba-NA-ne', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Bananen' },
    { id: 'food-003', german: 'die Erdbeere', english: 'strawberry', pronunciation: 'ERD-beh-re', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Erdbeeren' },
    { id: 'food-004', german: 'die Kirsche', english: 'cherry', pronunciation: 'KIR-she', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Kirschen' },
    { id: 'food-005', german: 'die Orange', english: 'orange', pronunciation: 'o-RAN-zhe', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Orangen' },
    { id: 'food-006', german: 'die Traube', english: 'grape', pronunciation: 'TROW-be', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Trauben' },
    { id: 'food-007', german: 'die Zitrone', english: 'lemon', pronunciation: 'tsi-TRO-ne', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Zitronen' },
    { id: 'food-008', german: 'die Grapefruit', english: 'grapefruit', pronunciation: 'GRAPE-froot', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },

    // === VEGETABLES (das Gemüse) ===
    { id: 'food-010', german: 'der Champignon', english: 'mushroom', pronunciation: 'sham-pin-YONG', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Champignons' },
    { id: 'food-011', german: 'der Spargel', english: 'asparagus', pronunciation: 'SHPAR-gel', gender: 'der', partOfSpeech: 'noun', level: 'A2', domain: 'food' },
    { id: 'food-012', german: 'der Spinat', english: 'spinach', pronunciation: 'shpi-NAT', gender: 'der', partOfSpeech: 'noun', level: 'A2', domain: 'food' },
    { id: 'food-013', german: 'die Erbsen', english: 'peas', pronunciation: 'ERB-zen', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-014', german: 'die Kartoffel', english: 'potato', pronunciation: 'kar-TOF-fel', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Kartoffeln' },
    { id: 'food-015', german: 'die Tomate', english: 'tomato', pronunciation: 'to-MA-te', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Tomaten' },
    { id: 'food-016', german: 'die Zwiebel', english: 'onion', pronunciation: 'TSVEE-bel', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Zwiebeln' },
    { id: 'food-017', german: 'die Bohnen', english: 'beans', pronunciation: 'BOH-nen', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-018', german: 'die Möhre', english: 'carrot', pronunciation: 'MOE-re', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Möhren' },
    { id: 'food-019', german: 'die Karotte', english: 'carrot', pronunciation: 'ka-ROT-te', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Karotten' },

    // === MEAT (das Fleisch) ===
    { id: 'food-020', german: 'das Lammfleisch', english: 'lamb', pronunciation: 'LAM-flysh', gender: 'das', partOfSpeech: 'noun', level: 'A2', domain: 'food' },
    { id: 'food-021', german: 'der Truthahn', english: 'turkey', pronunciation: 'TROOT-hahn', gender: 'der', partOfSpeech: 'noun', level: 'A2', domain: 'food' },
    { id: 'food-022', german: 'der Schinken', english: 'ham', pronunciation: 'SHINK-en', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-023', german: 'das Schweinefleisch', english: 'pork', pronunciation: 'SHVY-ne-flysh', gender: 'das', partOfSpeech: 'noun', level: 'A2', domain: 'food' },
    { id: 'food-024', german: 'das Hähnchen', english: 'chicken', pronunciation: 'HAYN-shen', gender: 'das', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-025', german: 'das Rindfleisch', english: 'beef', pronunciation: 'RINT-flysh', gender: 'das', partOfSpeech: 'noun', level: 'A2', domain: 'food' },
    { id: 'food-026', german: 'die Wurst', english: 'sausage', pronunciation: 'voorst', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Würste' },
    { id: 'food-027', german: 'die Bratwurst', english: 'fried sausage', pronunciation: 'BRAT-voorst', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },

    // === SEAFOOD (die Meeresfrüchte) ===
    { id: 'food-030', german: 'die Krabbe', english: 'crab', pronunciation: 'KRAB-be', gender: 'die', partOfSpeech: 'noun', level: 'A2', domain: 'food', plural: 'die Krabben' },
    { id: 'food-031', german: 'die Garnele', english: 'shrimp', pronunciation: 'gar-NEL-e', gender: 'die', partOfSpeech: 'noun', level: 'A2', domain: 'food', plural: 'die Garnelen' },
    { id: 'food-032', german: 'der Lachs', english: 'salmon', pronunciation: 'laks', gender: 'der', partOfSpeech: 'noun', level: 'A2', domain: 'food' },
    { id: 'food-033', german: 'der Aal', english: 'eel', pronunciation: 'ahl', gender: 'der', partOfSpeech: 'noun', level: 'B1', domain: 'food' },

    // === DAIRY (die Milchprodukte) ===
    { id: 'food-040', german: 'die Butter', english: 'butter', pronunciation: 'BOO-ter', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-041', german: 'der Käse', english: 'cheese', pronunciation: 'KAY-ze', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-042', german: 'die Milch', english: 'milk', pronunciation: 'milch', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-043', german: 'der Joghurt', english: 'yogurt', pronunciation: 'YO-goort', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },

    // === DESSERTS (die Nachspeise) ===
    { id: 'food-050', german: 'das Bonbon', english: 'candy', pronunciation: 'bon-BON', gender: 'das', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Bonbons' },
    { id: 'food-051', german: 'die Schokolade', english: 'chocolate', pronunciation: 'sho-ko-LA-de', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-052', german: 'die Torte', english: 'tart/cake', pronunciation: 'TOR-te', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Torten' },
    { id: 'food-053', german: 'der Kuchen', english: 'cake', pronunciation: 'KOO-chen', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Kuchen' },
    { id: 'food-054', german: 'der Apfelstrudel', english: 'apple strudel', pronunciation: 'AP-fel-shtroo-del', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-055', german: 'der Apfelkuchen', english: 'apple pie', pronunciation: 'AP-fel-koo-chen', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-056', german: 'das Eis', english: 'ice cream', pronunciation: 'ice', gender: 'das', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-057', german: 'der Eisbecher', english: 'bowl of ice cream', pronunciation: 'ICE-be-cher', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },

    // === OTHER FOODS ===
    { id: 'food-060', german: 'die Suppe', english: 'soup', pronunciation: 'ZOO-pe', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Suppen' },
    { id: 'food-061', german: 'die Pommes frites', english: 'French fries', pronunciation: 'POM-frit', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-062', german: 'die Pizza', english: 'pizza', pronunciation: 'PIT-sa', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Pizzen' },
    { id: 'food-063', german: 'der Hamburger', english: 'hamburger', pronunciation: 'HAM-boor-ger', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-064', german: 'der Senf', english: 'mustard', pronunciation: 'zenf', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-065', german: 'das Brot', english: 'bread', pronunciation: 'broht', gender: 'das', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Brote' },
    { id: 'food-066', german: 'der Salat', english: 'salad', pronunciation: 'za-LAT', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food', plural: 'die Salate' },
    { id: 'food-067', german: 'der Pfeffer', english: 'pepper', pronunciation: 'PFEF-fer', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-068', german: 'der Reis', english: 'rice', pronunciation: 'rice', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-069', german: 'das Salz', english: 'salt', pronunciation: 'zalts', gender: 'das', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-070', german: 'der Zucker', english: 'sugar', pronunciation: 'TSOO-ker', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
    { id: 'food-071', german: 'die Konfitüre', english: 'jam', pronunciation: 'kon-fi-TUE-re', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'food' },
];

// ============================================
// NUMBERS VOCABULARY (from German Wikibook)
// ============================================

export const numberVocabulary: VocabularyWord[] = [
    // 1-12
    { id: 'num-001', german: 'null', english: 'zero', pronunciation: 'nool', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-002', german: 'eins', english: 'one', pronunciation: 'ines', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-003', german: 'zwei', english: 'two', pronunciation: 'tsvy', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-004', german: 'drei', english: 'three', pronunciation: 'dry', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-005', german: 'vier', english: 'four', pronunciation: 'feer', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-006', german: 'fünf', english: 'five', pronunciation: 'fuenf', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-007', german: 'sechs', english: 'six', pronunciation: 'zeks', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-008', german: 'sieben', english: 'seven', pronunciation: 'ZEE-ben', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-009', german: 'acht', english: 'eight', pronunciation: 'akht', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-010', german: 'neun', english: 'nine', pronunciation: 'noyn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-011', german: 'zehn', english: 'ten', pronunciation: 'tsayn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-012', german: 'elf', english: 'eleven', pronunciation: 'elf', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-013', german: 'zwölf', english: 'twelve', pronunciation: 'tsvoelf', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },

    // 13-20
    { id: 'num-014', german: 'dreizehn', english: 'thirteen', pronunciation: 'DRY-tsayn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-015', german: 'vierzehn', english: 'fourteen', pronunciation: 'FEER-tsayn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-016', german: 'fünfzehn', english: 'fifteen', pronunciation: 'FUENF-tsayn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-017', german: 'sechzehn', english: 'sixteen', pronunciation: 'ZEKH-tsayn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-018', german: 'siebzehn', english: 'seventeen', pronunciation: 'ZEEP-tsayn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-019', german: 'achtzehn', english: 'eighteen', pronunciation: 'AKHT-tsayn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-020', german: 'neunzehn', english: 'nineteen', pronunciation: 'NOYN-tsayn', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-021', german: 'zwanzig', english: 'twenty', pronunciation: 'TSVAN-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },

    // 21-29 (showing reverse order pattern)
    { id: 'num-022', german: 'einundzwanzig', english: 'twenty-one', pronunciation: 'ine-oont-TSVAN-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-023', german: 'zweiundzwanzig', english: 'twenty-two', pronunciation: 'tsvy-oont-TSVAN-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-024', german: 'dreiundzwanzig', english: 'twenty-three', pronunciation: 'dry-oont-TSVAN-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },

    // Tens
    { id: 'num-030', german: 'dreißig', english: 'thirty', pronunciation: 'DRY-sikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-040', german: 'vierzig', english: 'forty', pronunciation: 'FEER-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-050', german: 'fünfzig', english: 'fifty', pronunciation: 'FUENF-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-060', german: 'sechzig', english: 'sixty', pronunciation: 'ZEKH-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-070', german: 'siebzig', english: 'seventy', pronunciation: 'ZEEP-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-080', german: 'achtzig', english: 'eighty', pronunciation: 'AKHT-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-090', german: 'neunzig', english: 'ninety', pronunciation: 'NOYN-tsikh', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },

    // Large numbers
    { id: 'num-100', german: 'hundert', english: 'hundred', pronunciation: 'HOON-dert', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-101', german: 'hunderteins', english: 'hundred and one', pronunciation: 'HOON-dert-ines', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-200', german: 'zweihundert', english: 'two hundred', pronunciation: 'tsvy-HOON-dert', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-1000', german: 'tausend', english: 'thousand', pronunciation: 'TOW-zent', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
    { id: 'num-2000', german: 'zweitausend', english: 'two thousand', pronunciation: 'tsvy-TOW-zent', partOfSpeech: 'noun', level: 'A1', domain: 'numbers' },
];

// ============================================
// RESTAURANT DIALOGUE VOCABULARY
// ============================================

export const restaurantVocabulary: VocabularyWord[] = [
    { id: 'rest-001', german: 'die Gaststätte', english: 'restaurant', pronunciation: 'GAST-shtet-te', gender: 'die', partOfSpeech: 'noun', level: 'A1', domain: 'restaurant' },
    { id: 'rest-002', german: 'der Hunger', english: 'hunger', pronunciation: 'HOONG-er', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'restaurant' },
    { id: 'rest-003', german: 'möchten', english: 'would like', pronunciation: 'MOECH-ten', partOfSpeech: 'verb', level: 'A1', domain: 'restaurant' },
    { id: 'rest-004', german: 'bestellen', english: 'to order', pronunciation: 'be-SHTEL-len', partOfSpeech: 'verb', level: 'A1', domain: 'restaurant' },
    { id: 'rest-005', german: 'bekommen', english: 'to get/receive', pronunciation: 'be-KOM-men', partOfSpeech: 'verb', level: 'A1', domain: 'restaurant' },
    { id: 'rest-006', german: 'ein Stück', english: 'a piece', pronunciation: 'ine shtuek', partOfSpeech: 'noun', level: 'A1', domain: 'restaurant' },
    { id: 'rest-007', german: 'zufrieden', english: 'satisfied', pronunciation: 'tsoo-FREE-den', partOfSpeech: 'adjective', level: 'A1', domain: 'restaurant' },
    { id: 'rest-008', german: 'genug', english: 'enough', pronunciation: 'ge-NOOK', partOfSpeech: 'adverb', level: 'A1', domain: 'restaurant' },
    { id: 'rest-009', german: 'schrecklich', english: 'terrible', pronunciation: 'SHREK-likh', partOfSpeech: 'adjective', level: 'A1', domain: 'restaurant' },
    { id: 'rest-010', german: 'das Wasser', english: 'water', pronunciation: 'VAS-ser', gender: 'das', partOfSpeech: 'noun', level: 'A1', domain: 'restaurant' },
];

// ============================================
// GREETING AND INTRODUCTION VOCABULARY (from Wikibook Lesson 1.01)
// ============================================

export const greetingVocabulary: VocabularyWord[] = [
    { id: 'greet-001', german: 'Hallo', english: 'Hello', pronunciation: 'HA-lo', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-002', german: 'ich', english: 'I', pronunciation: 'ikh', partOfSpeech: 'pronoun', level: 'A1', domain: 'greetings' },
    { id: 'greet-003', german: 'ich bin', english: 'I am', pronunciation: 'ikh bin', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-004', german: 'wie', english: 'how', pronunciation: 'vee', partOfSpeech: 'adverb', level: 'A1', domain: 'greetings' },
    { id: 'greet-005', german: 'du', english: 'you (informal)', pronunciation: 'doo', partOfSpeech: 'pronoun', level: 'A1', domain: 'greetings' },
    { id: 'greet-006', german: 'du heißt', english: 'your name is', pronunciation: 'doo hyst', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-007', german: 'Wie heißt du?', english: 'What is your name?', pronunciation: 'vee hyst doo', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-008', german: 'ich heiße', english: 'my name is', pronunciation: 'ikh HY-se', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-009', german: 'es', english: 'it', pronunciation: 'es', partOfSpeech: 'pronoun', level: 'A1', domain: 'greetings' },
    { id: 'greet-010', german: 'es geht', english: 'it goes', pronunciation: 'es gayt', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-011', german: 'Wie geht\'s?', english: 'How are you?', pronunciation: 'vee gayts', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-012', german: 'gut', english: 'good/well', pronunciation: 'goot', partOfSpeech: 'adjective', level: 'A1', domain: 'greetings' },
    { id: 'greet-013', german: 'Es geht mir gut', english: 'I am doing well', pronunciation: 'es gayt meer goot', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-014', german: 'kennen', english: 'to know (person)', pronunciation: 'KEN-nen', partOfSpeech: 'verb', level: 'A1', domain: 'greetings' },
    { id: 'greet-015', german: 'der Lehrer', english: 'teacher (male)', pronunciation: 'LAY-rer', gender: 'der', partOfSpeech: 'noun', level: 'A1', domain: 'greetings' },
    { id: 'greet-016', german: 'Herr', english: 'Mr.', pronunciation: 'hair', partOfSpeech: 'noun', level: 'A1', domain: 'greetings' },
    { id: 'greet-017', german: 'danke', english: 'thank you', pronunciation: 'DANK-e', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-018', german: 'bis dann', english: 'see you then', pronunciation: 'bis dan', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-019', german: 'Wiedersehen', english: 'goodbye', pronunciation: 'VEE-der-zay-en', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
    { id: 'greet-020', german: 'Auf Wiedersehen', english: 'goodbye (formal)', pronunciation: 'owf VEE-der-zay-en', partOfSpeech: 'phrase', level: 'A1', domain: 'greetings' },
];

// ============================================
// PRONUNCIATION NOTES (from German Wikibook)
// ============================================

export interface PronunciationRule {
    letter: string;
    pronunciation: string;
    example: string;
    exampleTranslation: string;
    note: string;
}

export const pronunciationRules: PronunciationRule[] = [
    { letter: 'a', pronunciation: 'ah', example: 'Hallo', exampleTranslation: 'Hello', note: 'Similar to "a" in "hard"' },
    { letter: 'i', pronunciation: 'ih', example: 'ich', exampleTranslation: 'I', note: 'Similar to "i" in "hit"' },
    { letter: 'ch', pronunciation: 'kh', example: 'ich', exampleTranslation: 'I', note: 'Like "ch" in Scottish "Loch"' },
    { letter: 'z', pronunciation: 'ts', example: 'Franz', exampleTranslation: 'Franz', note: '"z" is pronounced like "ts"' },
    { letter: 'w', pronunciation: 'v', example: 'wie', exampleTranslation: 'how', note: 'Similar to "v" in "vat"' },
    { letter: 'ie', pronunciation: 'ee', example: 'wie', exampleTranslation: 'how', note: 'Similar to "ee" in "meet"' },
    { letter: 'ei', pronunciation: 'ai', example: 'heißt', exampleTranslation: 'is called', note: 'Like "i" in "time"' },
    { letter: 'ß', pronunciation: 's', example: 'heißt', exampleTranslation: 'is called', note: '"ß" is pronounced like "s"' },
    { letter: 'e (short)', pronunciation: 'eh', example: 'es', exampleTranslation: 'it', note: 'Similar to "e" in "pet"' },
    { letter: 'e (long)', pronunciation: 'ay', example: 'gehen', exampleTranslation: 'to go', note: 'Between "i" in "hit" and "e" in "pet"' },
];

// ============================================
// EXPORT ALL EXTENDED VOCABULARY
// ============================================

export const extendedVocabulary: VocabularyWord[] = [
    ...foodVocabulary,
    ...numberVocabulary,
    ...restaurantVocabulary,
    ...greetingVocabulary,
];

export const getExtendedVocabularyByDomain = (domain: string): VocabularyWord[] => {
    return extendedVocabulary.filter(v => v.domain === domain);
};
