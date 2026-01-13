// Responsive hooks for phone/tablet layout adaptation
import { useWindowDimensions } from 'react-native';

export interface ResponsiveBreakpoints {
    isPhone: boolean;
    isTablet: boolean;
    isLargeTablet: boolean;
    isLandscape: boolean;
    width: number;
    height: number;
}

// Breakpoints
const PHONE_MAX_WIDTH = 767;
const TABLET_MAX_WIDTH = 1023;

export const useResponsive = (): ResponsiveBreakpoints => {
    const { width, height } = useWindowDimensions();

    return {
        isPhone: width <= PHONE_MAX_WIDTH,
        isTablet: width > PHONE_MAX_WIDTH && width <= TABLET_MAX_WIDTH,
        isLargeTablet: width > TABLET_MAX_WIDTH,
        isLandscape: width > height,
        width,
        height,
    };
};

// Hook for responsive values
export const useResponsiveValue = <T>(
    phoneValue: T,
    tabletValue: T,
    largeTabletValue?: T
): T => {
    const { isPhone, isTablet } = useResponsive();

    if (isPhone) return phoneValue;
    if (isTablet) return tabletValue;
    return largeTabletValue ?? tabletValue;
};

// Hook for responsive spacing
export const useResponsiveSpacing = () => {
    const { isPhone } = useResponsive();

    return {
        containerPadding: isPhone ? 16 : 24,
        cardPadding: isPhone ? 16 : 20,
        itemGap: isPhone ? 12 : 16,
        sectionGap: isPhone ? 24 : 32,
    };
};

// Hook for responsive grid columns
export const useGridColumns = (minColumns: number = 1): number => {
    const { width, isPhone, isTablet } = useResponsive();

    if (isPhone) return minColumns;
    if (isTablet) return Math.min(minColumns + 1, 3);
    return Math.min(minColumns + 2, 4);
};
