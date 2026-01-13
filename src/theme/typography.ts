// Typography System for German Learner App
// Using Inter font family with responsive scaling

import { Platform, PixelRatio } from 'react-native';

// Base font sizes (designed for 375pt width - iPhone standard)
const BASE_FONT_SIZE = 16;

// Scale factor for tablets (768pt+ width)
const fontScale = (size: number, isTablet: boolean = false): number => {
    const baseScale = isTablet ? 1.15 : 1;
    // Ensure we don't go below minimum readable sizes
    return Math.round(PixelRatio.roundToNearestPixel(size * baseScale));
};

export const FontFamily = {
    regular: Platform.select({
        ios: 'System',
        android: 'Roboto',
        default: 'System',
    }),
    medium: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
        default: 'System',
    }),
    semibold: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
        default: 'System',
    }),
    bold: Platform.select({
        ios: 'System',
        android: 'Roboto-Bold',
        default: 'System',
    }),
};

export const FontWeight = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

// Font sizes
export const FontSize = {
    // Extra small - captions, labels
    xs: 11,
    // Small - secondary text, hints
    sm: 13,
    // Base - body text
    base: 15,
    // Medium - emphasized body
    md: 17,
    // Large - section titles
    lg: 20,
    // Extra large - screen titles
    xl: 24,
    // 2XL - hero text
    '2xl': 30,
    // 3XL - display text
    '3xl': 36,
    // 4XL - large display
    '4xl': 48,
    // 5XL - extra large display
    '5xl': 60,
};

// Line heights (as multipliers of font size)
export const LineHeight = {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    loose: 2,
};

// Letter spacing
export const LetterSpacing = {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
};

// Pre-defined text styles
export const TextStyles = {
    // Display styles - for heroes and splash
    displayLarge: {
        fontSize: FontSize['4xl'],
        fontWeight: FontWeight.bold,
        lineHeight: FontSize['4xl'] * LineHeight.tight,
        letterSpacing: LetterSpacing.tighter,
    },
    displayMedium: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        lineHeight: FontSize['3xl'] * LineHeight.tight,
        letterSpacing: LetterSpacing.tight,
    },
    displaySmall: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        lineHeight: FontSize['2xl'] * LineHeight.snug,
        letterSpacing: LetterSpacing.tight,
    },

    // Heading styles
    headingLarge: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.semibold,
        lineHeight: FontSize.xl * LineHeight.snug,
        letterSpacing: LetterSpacing.normal,
    },
    headingMedium: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        lineHeight: FontSize.lg * LineHeight.snug,
        letterSpacing: LetterSpacing.normal,
    },
    headingSmall: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        lineHeight: FontSize.md * LineHeight.snug,
        letterSpacing: LetterSpacing.normal,
    },

    // Body styles
    bodyLarge: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.regular,
        lineHeight: FontSize.md * LineHeight.relaxed,
        letterSpacing: LetterSpacing.normal,
    },
    bodyMedium: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.regular,
        lineHeight: FontSize.base * LineHeight.relaxed,
        letterSpacing: LetterSpacing.normal,
    },
    bodySmall: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.regular,
        lineHeight: FontSize.sm * LineHeight.relaxed,
        letterSpacing: LetterSpacing.normal,
    },

    // Label styles
    labelLarge: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        lineHeight: FontSize.base * LineHeight.normal,
        letterSpacing: LetterSpacing.wide,
    },
    labelMedium: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        lineHeight: FontSize.sm * LineHeight.normal,
        letterSpacing: LetterSpacing.wide,
    },
    labelSmall: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        lineHeight: FontSize.xs * LineHeight.normal,
        letterSpacing: LetterSpacing.wider,
    },

    // Caption style
    caption: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.regular,
        lineHeight: FontSize.xs * LineHeight.normal,
        letterSpacing: LetterSpacing.normal,
    },
};
