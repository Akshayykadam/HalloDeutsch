// Suggested Responses Component - Tappable suggestion chips for beginners
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface SuggestedResponsesProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    disabled?: boolean;
}

export const SuggestedResponses: React.FC<SuggestedResponsesProps> = ({
    suggestions,
    onSelect,
    disabled = false,
}) => {
    const { theme, isDark } = useTheme();

    if (!suggestions || suggestions.length === 0) return null;

    return (
        <View style={[styles.container, {
            backgroundColor: theme.background.primary,
            borderTopColor: theme.border.light,
        }]}>
            <View style={styles.header}>
                <Ionicons name="chatbubble-ellipses-outline" size={14} color={theme.text.tertiary} />
                <Text style={[styles.headerText, { color: theme.text.tertiary }]}>Suggested responses:</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isDark ? theme.background.tertiary : Colors.white,
                                borderColor: isDark ? Colors.primary[400] : Colors.primary[300],
                            },
                            disabled && [styles.chipDisabled, {
                                backgroundColor: theme.background.tertiary,
                                borderColor: theme.border.medium,
                            }]
                        ]}
                        onPress={() => onSelect(suggestion)}
                        activeOpacity={0.7}
                        disabled={disabled}
                    >
                        <Text style={[
                            styles.chipText,
                            { color: isDark ? Colors.primary[300] : Colors.primary[600] },
                            disabled && [styles.chipTextDisabled, { color: theme.text.tertiary }]
                        ]}>
                            {suggestion}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.sm,
        borderTopWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.xs,
        gap: Spacing.xs,
    },
    headerText: {
        fontSize: FontSize.xs,
    },
    scrollContent: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
    },
    chip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
    },
    chipDisabled: {
        // Dynamic styles applied inline
    },
    chipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    chipTextDisabled: {
        // Dynamic styles applied inline
    },
});
