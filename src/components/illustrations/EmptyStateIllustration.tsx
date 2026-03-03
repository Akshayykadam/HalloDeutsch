// Empty State Illustration - Friendly character with speech bubble
// For use on screens with no data
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface EmptyStateIllustrationProps {
    message?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    size?: number;
}

export const EmptyStateIllustration: React.FC<EmptyStateIllustrationProps> = ({
    message = 'Nichts hier!',
    icon = 'search',
    size = 160,
}) => {
    const { theme, isDark } = useTheme();
    const scale = size / 160;

    return (
        <View style={[styles.container, { width: size, height: size * 1.1 }]}>
            {/* Background circle */}
            <View style={[styles.bgCircle, {
                width: 120 * scale,
                height: 120 * scale,
                borderRadius: 60 * scale,
                backgroundColor: isDark ? Colors.primary[900] + '40' : Colors.primary[100],
            }]} />

            {/* Inner circle with icon */}
            <View style={[styles.innerCircle, {
                width: 80 * scale,
                height: 80 * scale,
                borderRadius: 40 * scale,
                backgroundColor: isDark ? Colors.primary[800] : Colors.primary[200],
            }]}>
                <Ionicons
                    name={icon}
                    size={36 * scale}
                    color={isDark ? Colors.primary[400] : Colors.primary[500]}
                />
            </View>

            {/* Speech bubble */}
            <View style={[styles.speechBubble, {
                bottom: 0,
                paddingHorizontal: 14 * scale,
                paddingVertical: 8 * scale,
                borderRadius: 16 * scale,
                backgroundColor: isDark ? Colors.neutral[800] : Colors.white,
                shadowColor: Colors.black,
            }]}>
                <Text style={[styles.speechText, {
                    fontSize: 13 * scale,
                    color: isDark ? Colors.neutral[300] : Colors.neutral[600],
                }]}>
                    {message}
                </Text>
                {/* Speech bubble tail */}
                <View style={[styles.speechTail, {
                    borderBottomColor: isDark ? Colors.neutral[800] : Colors.white,
                }]} />
            </View>

            {/* Decorative dots around */}
            <View style={[styles.dot, {
                width: 8 * scale,
                height: 8 * scale,
                borderRadius: 4 * scale,
                top: 10 * scale,
                right: 20 * scale,
                backgroundColor: Colors.warning[400],
            }]} />
            <View style={[styles.dot, {
                width: 6 * scale,
                height: 6 * scale,
                borderRadius: 3 * scale,
                top: 30 * scale,
                left: 15 * scale,
                backgroundColor: Colors.success[400],
            }]} />
            <View style={[styles.dot, {
                width: 5 * scale,
                height: 5 * scale,
                borderRadius: 2.5 * scale,
                top: 60 * scale,
                right: 10 * scale,
                backgroundColor: Colors.secondary[400],
            }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgCircle: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    speechBubble: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    speechText: {
        fontWeight: '600',
        textAlign: 'center',
    },
    speechTail: {
        position: 'absolute',
        top: -8,
        alignSelf: 'center',
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    dot: {
        position: 'absolute',
        opacity: 0.6,
    },
});
