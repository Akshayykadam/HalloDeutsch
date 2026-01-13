// Image Service - Fetches images from free sources (Unsplash/Pexels)
// No API key required for basic usage with attribution

const UNSPLASH_BASE = 'https://source.unsplash.com';
const PEXELS_PHOTOS_BASE = 'https://images.pexels.com/photos';

// Pre-curated image IDs from Pexels (free to use)
const CURATED_IMAGES = {
    // German landmarks
    brandenburgGate: '1128416/pexels-photo-1128416.jpeg',
    cologne: '1559699/pexels-photo-1559699.jpeg',
    neuschwanstein: '1680044/pexels-photo-1680044.jpeg',
    berlin: '109629/pexels-photo-109629.jpeg',
    munich: '161893/pexels-photo-161893.jpeg',

    // Food & culture
    pretzel: '1893556/pexels-photo-1893556.jpeg',
    beer: '1269025/pexels-photo-1269025.jpeg',
    christmas: '717988/pexels-photo-717988.jpeg',
    coffee: '312418/pexels-photo-312418.jpeg',
    bakery: '205961/pexels-photo-205961.jpeg',

    // Learning & education
    books: '256455/pexels-photo-256455.jpeg',
    study: '301926/pexels-photo-301926.jpeg',
    notebook: '733857/pexels-photo-733857.jpeg',
    desk: '1925536/pexels-photo-1925536.jpeg',
    library: '590493/pexels-photo-590493.jpeg',

    // Nature
    forest: '1179229/pexels-photo-1179229.jpeg',
    alps: '753772/pexels-photo-753772.jpeg',
    river: '1770809/pexels-photo-1770809.jpeg',

    // Abstract/patterns
    gradient: '1939485/pexels-photo-1939485.jpeg',
    abstract: '1762851/pexels-photo-1762851.jpeg',
};

export type ImageCategory =
    | 'germany'
    | 'food'
    | 'education'
    | 'nature'
    | 'culture'
    | 'city'
    | 'abstract';

/**
 * Get a random image URL from Unsplash based on search query
 * Uses Unsplash Source API (no API key needed, includes attribution in image)
 */
export const getRandomImage = (
    query: string,
    width: number = 400,
    height: number = 300
): string => {
    const encodedQuery = encodeURIComponent(query);
    return `${UNSPLASH_BASE}/${width}x${height}/?${encodedQuery}`;
};

/**
 * Get a specific curated image from Pexels
 */
export const getCuratedImage = (
    imageKey: keyof typeof CURATED_IMAGES,
    width: number = 400
): string => {
    const imageId = CURATED_IMAGES[imageKey];
    return `${PEXELS_PHOTOS_BASE}/${imageId}?auto=compress&cs=tinysrgb&w=${width}`;
};

/**
 * Get themed images for different app sections
 */
export const getThemedImage = (
    category: ImageCategory,
    width: number = 400
): string => {
    const categoryQueries: Record<ImageCategory, string> = {
        germany: 'germany,berlin,munich',
        food: 'german food,pretzel,sausage',
        education: 'books,study,learning',
        nature: 'german forest,alps,landscape',
        culture: 'oktoberfest,christmas market,german',
        city: 'german city,architecture',
        abstract: 'gradient,abstract,minimal',
    };

    return getRandomImage(categoryQueries[category], width, Math.round(width * 0.75));
};

/**
 * Image URLs for Cultural Guide topics
 */
export const culturalImages: Record<string, string> = {
    punctuality: getRandomImage('clock,time', 400, 300),
    greetings: getRandomImage('handshake,greeting', 400, 300),
    recycling: getRandomImage('recycling,germany', 400, 300),
    sundays: getRandomImage('german sunday,quiet', 400, 300),
    bread: getRandomImage('german bread,bakery', 400, 300),
    beer: getCuratedImage('beer'),
    christmas: getCuratedImage('christmas'),
    transportation: getRandomImage('german train,bus', 400, 300),
    cafe: getCuratedImage('coffee'),
    documents: getRandomImage('documents,paperwork', 400, 300),
};

/**
 * Image URLs for vocabulary categories
 */
export const vocabularyImages: Record<string, string> = {
    food: getRandomImage('food,kitchen', 300, 200),
    animals: getRandomImage('animals,pets', 300, 200),
    family: getRandomImage('family,people', 300, 200),
    home: getRandomImage('home,house,interior', 300, 200),
    weather: getRandomImage('weather,sky', 300, 200),
    travel: getRandomImage('travel,vacation', 300, 200),
    work: getRandomImage('office,work', 300, 200),
    hobbies: getRandomImage('hobbies,leisure', 300, 200),
    clothing: getRandomImage('clothing,fashion', 300, 200),
    nature: getRandomImage('nature,forest', 300, 200),
};

/**
 * Get a placeholder image with specific dimensions
 */
export const getPlaceholder = (width: number, height: number): string => {
    return `https://via.placeholder.com/${width}x${height}/6366F1/FFFFFF?text=`;
};

/**
 * Pre-load images for better UX (returns image URLs to cache)
 */
export const getPreloadImages = (): string[] => {
    return [
        getCuratedImage('brandenburgGate'),
        getCuratedImage('books'),
        getCuratedImage('pretzel'),
        getCuratedImage('coffee'),
    ];
};

export default {
    getRandomImage,
    getCuratedImage,
    getThemedImage,
    culturalImages,
    vocabularyImages,
    getPlaceholder,
    getPreloadImages,
};
