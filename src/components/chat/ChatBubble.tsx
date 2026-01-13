// Chat Bubble Component - Message display for AI conversations
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface ChatBubbleProps {
    message: string;
    translation?: string;
    isUser: boolean;
    timestamp?: Date;
    showTranslation?: boolean;
    corrections?: Array<{ original: string; corrected: string; explanation: string }>;
    onToggleTranslation?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    message,
    translation,
    isUser,
    timestamp,
    showTranslation = false,
    corrections,
    onToggleTranslation,
}) => {
    const { theme, isDark } = useTheme();
    const [expanded, setExpanded] = useState(false);

    const hasCorrections = corrections && corrections.length > 0;

    // Dynamic styles based on theme
    const aiBubbleStyle = {
        backgroundColor: isDark ? theme.background.tertiary : Colors.neutral[100],
    };

    const aiMessageStyle = {
        color: theme.text.primary,
    };

    const translationContainerStyle = {
        borderTopColor: isDark ? theme.border.light : Colors.neutral[200],
    };

    const translationLabelStyle = {
        color: theme.text.tertiary,
    };

    const translationTextStyle = {
        color: theme.text.secondary,
    };

    const timestampAiStyle = {
        color: theme.text.tertiary,
    };

    return (
        <View style={[
            styles.container,
            isUser ? styles.userContainer : styles.aiContainer
        ]}>
            {/* Avatar for AI */}
            {!isUser && (
                <View style={[styles.avatar, { backgroundColor: isDark ? Colors.primary[900] : Colors.primary[100] }]}>
                    <Ionicons name="school" size={20} color={Colors.primary[500]} />
                </View>
            )}

            <View style={[
                styles.bubble,
                isUser ? styles.userBubble : [styles.aiBubble, aiBubbleStyle],
                hasCorrections && styles.correctionBubble
            ]}>
                {/* Main message */}
                <Text style={[
                    styles.message,
                    isUser ? styles.userMessage : [styles.aiMessage, aiMessageStyle]
                ]}>
                    {message}
                </Text>

                {/* Translation (toggleable) */}
                {!isUser && translation && showTranslation && (
                    <View style={[styles.translationContainer, translationContainerStyle]}>
                        <Text style={[styles.translationLabel, translationLabelStyle]}>English:</Text>
                        <Text style={[styles.translation, translationTextStyle]}>{translation}</Text>
                    </View>
                )}

                {/* Corrections section */}
                {hasCorrections && (
                    <TouchableOpacity
                        onPress={() => setExpanded(!expanded)}
                        style={[styles.correctionsToggle, { borderTopColor: isDark ? Colors.warning[700] : Colors.warning[200] }]}
                    >
                        <Ionicons
                            name="alert-circle"
                            size={14}
                            color={Colors.warning[500]}
                        />
                        <Text style={styles.correctionsLabel}>
                            {corrections.length} correction{corrections.length > 1 ? 's' : ''}
                        </Text>
                        <Ionicons
                            name={expanded ? 'chevron-up' : 'chevron-down'}
                            size={14}
                            color={Colors.warning[500]}
                        />
                    </TouchableOpacity>
                )}

                {expanded && corrections && (
                    <View style={styles.correctionsContainer}>
                        {corrections.map((correction, index) => (
                            <View key={index} style={[styles.correctionItem, { backgroundColor: isDark ? Colors.warning[900] : Colors.warning[50] }]}>
                                <View style={styles.correctionRow}>
                                    <Text style={styles.originalText}>
                                        {correction.original}
                                    </Text>
                                    <Ionicons name="arrow-forward" size={14} color={theme.text.tertiary} />
                                    <Text style={styles.correctedText}>
                                        {correction.corrected}
                                    </Text>
                                </View>
                                <Text style={[styles.explanationText, { color: theme.text.secondary }]}>
                                    {correction.explanation}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Timestamp */}
                {timestamp && (
                    <Text style={[
                        styles.timestamp,
                        isUser ? styles.userTimestamp : [styles.aiTimestamp, timestampAiStyle]
                    ]}>
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                )}
            </View>

            {/* Toggle translation button for AI messages */}
            {!isUser && translation && onToggleTranslation && (
                <TouchableOpacity
                    onPress={onToggleTranslation}
                    style={styles.translateButton}
                >
                    <Ionicons
                        name={showTranslation ? 'eye-off' : 'eye'}
                        size={16}
                        color={theme.text.tertiary}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: Spacing.xs,
        paddingHorizontal: Spacing.base,
        alignItems: 'flex-end',
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    aiContainer: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    bubble: {
        maxWidth: '75%',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    userBubble: {
        backgroundColor: Colors.primary[500],
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        borderBottomLeftRadius: 4,
    },
    correctionBubble: {
        borderWidth: 1,
        borderColor: Colors.warning[300],
    },
    message: {
        fontSize: FontSize.base,
        lineHeight: 22,
    },
    userMessage: {
        color: Colors.white,
    },
    aiMessage: {
        // Dynamic color applied inline
    },
    translationContainer: {
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
    },
    translationLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        marginBottom: 2,
    },
    translation: {
        fontSize: FontSize.sm,
        fontStyle: 'italic',
    },
    correctionsToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        gap: 4,
    },
    correctionsLabel: {
        fontSize: FontSize.xs,
        color: Colors.warning[600],
        flex: 1,
    },
    correctionsContainer: {
        marginTop: Spacing.sm,
    },
    correctionItem: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.xs,
    },
    correctionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        flexWrap: 'wrap',
    },
    originalText: {
        fontSize: FontSize.sm,
        color: Colors.error[600],
        textDecorationLine: 'line-through',
    },
    correctedText: {
        fontSize: FontSize.sm,
        color: Colors.success[600],
        fontWeight: FontWeight.semibold,
    },
    explanationText: {
        fontSize: FontSize.xs,
        marginTop: 4,
    },
    timestamp: {
        fontSize: 10,
        marginTop: Spacing.xs,
    },
    userTimestamp: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'right',
    },
    aiTimestamp: {
        // Dynamic color applied inline
    },
    translateButton: {
        padding: Spacing.xs,
        marginLeft: Spacing.xs,
    },
});
