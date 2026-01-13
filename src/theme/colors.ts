// German Learner App - Color Palette
// Vibrant, engaging colors for a premium learning experience

export const Colors = {
  // Primary palette - Deep blues for trust and learning
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main primary
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Secondary palette - Warm accent colors
  secondary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main secondary
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Success - For correct answers and achievements
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Error - For incorrect answers
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Warning - For hints and cautions
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Gold - For XP and rewards
  gold: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
  },

  // Neutrals
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },

  // Accent - Purple
  accent: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Info - Sky Blue
  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Light Theme
export const LightTheme = {
  background: {
    primary: Colors.white,
    secondary: Colors.neutral[50],
    tertiary: Colors.neutral[100],
    elevated: Colors.white,
  },
  text: {
    primary: Colors.neutral[900],
    secondary: Colors.neutral[600],
    tertiary: Colors.neutral[400],
    inverse: Colors.white,
  },
  border: {
    light: Colors.neutral[200],
    medium: Colors.neutral[300],
    strong: Colors.neutral[400],
  },
  accent: Colors.primary[500],
  accentLight: Colors.primary[100],
};

// Dark Theme
// Dark Theme - Premium contrast and depth
export const DarkTheme = {
  background: {
    primary: Colors.neutral[900], // Surface (Cards, Headers) - Lighter than background
    secondary: Colors.neutral[950], // Base Background - Deepest dark
    tertiary: Colors.neutral[800], // Inputs, Modals
    elevated: Colors.neutral[800], // Higher elevation
  },
  text: {
    primary: Colors.neutral[50], // High contrast white
    secondary: Colors.neutral[400], // Readable grey
    tertiary: Colors.neutral[500], // Subtle
    inverse: Colors.neutral[900], // For text on light accents
  },
  border: {
    light: Colors.neutral[800], // Visible separation
    medium: Colors.neutral[700], // Stronger border
    strong: Colors.neutral[600], // High contrast border
  },
  accent: Colors.primary[400], // Lighter primary for dark mode visibility
  accentLight: Colors.primary[900], // Dark primary background
};

// CEFR Level Colors
export const LevelColors = {
  A1: '#22C55E', // Green - Beginner
  A2: '#3B82F6', // Blue - Elementary
  B1: '#8B5CF6', // Purple - Intermediate
  B2: '#F59E0B', // Amber - Upper-Intermediate
};
