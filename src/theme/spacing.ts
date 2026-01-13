// Spacing and Layout Constants

export const Spacing = {
    // Base spacing scale (4pt grid)
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
    '6xl': 80,
};

// Border radius
export const BorderRadius = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
};

// Shadows
export const Shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 12,
    },
};

// Layout constants
export const Layout = {
    // Screen padding
    screenPaddingHorizontal: Spacing.base,
    screenPaddingVertical: Spacing.lg,

    // Content max width for tablets
    contentMaxWidth: 600,
    wideContentMaxWidth: 900,

    // Bottom tab bar height
    tabBarHeight: 60,

    // Header heights
    headerHeight: 56,
    largeHeaderHeight: 96,

    // Card padding
    cardPadding: Spacing.base,

    // Input heights
    inputHeight: 48,
    buttonHeight: 48,
    smallButtonHeight: 36,

    // Icon sizes
    iconSizeSmall: 16,
    iconSizeMedium: 24,
    iconSizeLarge: 32,
    iconSizeXLarge: 48,
};
