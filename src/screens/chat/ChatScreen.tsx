// Chat Screen - Free-form AI conversation for German practice
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatBubble, SuggestedResponses } from '../../components/chat';
import { SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { generateConversationResponse, checkGrammar } from '../../services/geminiService';
import { useUserStore } from '../../store';

interface Message {
    id: string;
    content: string;
    translation?: string;
    isUser: boolean;
    timestamp: Date;
    corrections?: Array<{ original: string; corrected: string; explanation: string }>;
}

import { SCENARIOS } from '../../data/scenarios';

// ...

export const ChatScreen = () => {
    // ...
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { progress } = useUserStore();
    // ...
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
    const [chatStarted, setChatStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showTranslations, setShowTranslations] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    const resetChat = () => {
        setChatStarted(false);
        setSelectedScenario(null);
        setMessages([]);
        setInputText('');
    };

    const startConversation = async (scenarioId: string) => {
        setSelectedScenario(scenarioId);
        setChatStarted(true);
        setIsLoading(true);
        setMessages([]);

        const scenario = SCENARIOS.find(s => s.id === scenarioId);
        if (!scenario) return;

        // Use defined initial message instead of generating one
        const aiMessage: Message = {
            id: `msg-${Date.now()}`,
            content: scenario.initialMessage,
            translation: scenario.initialMessageEn,
            isUser: false,
            timestamp: new Date(),
        };

        setMessages([aiMessage]);

        // Generate suggestions for the user to respond to the initial message
        try {
            // We do a mock call or a quick gen for suggestions
            // For now, let's just hardcode some generic ones or let the user type
            setSuggestions(['Hallo!', 'Guten Tag!', 'Ich möchte...']);
        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    };

    const handleSend = async (text: string = inputText) => {
        if (!text.trim() || isLoading || !selectedScenario) return;

        const scenario = SCENARIOS.find(s => s.id === selectedScenario);
        if (!scenario) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            content: text.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);
        setSuggestions([]);

        try {
            const grammarCheck = await checkGrammar(text, progress.level);

            const conversationHistory = messages.map(m => ({
                role: m.isUser ? 'user' as const : 'assistant' as const,
                content: m.content,
            }));

            const response = await generateConversationResponse(
                `${scenario.titleEn} (${scenario.description})`,
                scenario.systemPrompt,
                text,
                progress.level,
                conversationHistory
            );

            if (!grammarCheck.isCorrect && grammarCheck.corrections.length > 0) {
                setMessages(prev =>
                    prev.map(m =>
                        m.id === userMessage.id
                            ? { ...m, corrections: grammarCheck.corrections }
                            : m
                    )
                );
            }

            const aiMessage: Message = {
                id: `msg-${Date.now()}`,
                content: response.response,
                translation: response.translation,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
            setSuggestions(response.suggestions || []);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: `msg-${Date.now()}`,
                content: 'Entschuldigung, es gab einen Fehler. Versuchen wir es noch einmal.',
                translation: 'Sorry, there was an error. Let\'s try again.',
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setIsLoading(false);
    };

    // ... (rest of component)

    // Scenario Selection Screen
    if (!chatStarted) {
        return (
            <SafeArea style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Conversation Practice</Text>
                    <Text style={styles.headerSubtitle}>Roleplay in real-world situations</Text>
                </View>

                <ScrollView style={styles.scenarioList} contentContainerStyle={styles.scenarioContent}>
                    <Text style={styles.sectionTitle}>Choose a scenario:</Text>

                    {SCENARIOS.map((scenario) => (
                        <TouchableOpacity
                            key={scenario.id}
                            style={[styles.scenarioCard, { backgroundColor: theme.background.tertiary }]}
                            onPress={() => startConversation(scenario.id)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={scenario.id === 'free'
                                    ? [Colors.secondary[500], Colors.secondary[600]]
                                    : [Colors.primary[500], Colors.primary[600]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.scenarioIconContainer}
                            >
                                <Ionicons name={scenario.icon as any} size={24} color={Colors.white} />
                            </LinearGradient>

                            <View style={[styles.scenarioTextContent, { backgroundColor: theme.background.tertiary }]}>
                                <View style={styles.scenarioHeader}>
                                    <Text style={[styles.scenarioTitle, { color: theme.text.primary }]}>{scenario.title}</Text>
                                    <View style={[styles.levelBadge, { borderColor: theme.border.medium }]}>
                                        <Text style={[styles.levelText, { color: theme.text.secondary }]}>{scenario.level}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.scenarioSubtitle, { color: theme.text.secondary }]}>{scenario.titleEn}</Text>
                                <Text style={[styles.scenarioDescription, { color: theme.text.tertiary }]} numberOfLines={2}>
                                    {scenario.description}
                                </Text>
                            </View>

                            <View style={styles.chevron}>
                                <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
                            </View>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.tipCard}>
                        <Ionicons name="bulb" size={20} color={Colors.warning[500]} />
                        <Text style={styles.tipText}>
                            Each scenario has a tailored AI persona to help you practice specific vocabulary and situations.
                        </Text>
                    </View>
                </ScrollView>
            </SafeArea>
        );
    }

    // Chat Screen
    const scenario = SCENARIOS.find(s => s.id === selectedScenario);

    return (
        <SafeArea style={styles.container}>
            <View style={styles.chatHeader}>
                <TouchableOpacity onPress={resetChat} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.chatHeaderTitle}>{scenario?.title}</Text>
                    <Text style={styles.chatHeaderSubtitle}>{scenario?.titleEn}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setShowTranslations(!showTranslations)}
                    style={styles.translateToggle}
                >
                    <Ionicons
                        name={showTranslations ? 'language' : 'language-outline'}
                        size={22}
                        color={showTranslations ? Colors.primary[500] : Colors.neutral[400]}
                    />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((message) => (
                        <ChatBubble
                            key={message.id}
                            message={message.content}
                            translation={message.translation}
                            isUser={message.isUser}
                            timestamp={message.timestamp}
                            showTranslation={showTranslations}
                            corrections={message.corrections}
                        />
                    ))}

                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <View style={styles.loadingBubble}>
                                <ActivityIndicator size="small" color={Colors.primary[500]} />
                                <Text style={styles.loadingText}>Typing...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {suggestions.length > 0 && !isLoading && (
                    <SuggestedResponses
                        suggestions={suggestions}
                        onSelect={handleSend}
                        disabled={isLoading}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type in German..."
                        placeholderTextColor={Colors.neutral[400]}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={styles.micButton}
                        onPress={() => {
                            // TODO: Implement voice input
                            alert('Voice input coming soon!');
                        }}
                        disabled={isLoading}
                    >
                        <Ionicons
                            name="mic"
                            size={22}
                            color={isLoading ? Colors.neutral[400] : Colors.primary[500]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!inputText.trim() || isLoading) && styles.sendButtonDisabled
                        ]}
                        onPress={() => handleSend()}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={inputText.trim() && !isLoading ? Colors.white : Colors.neutral[400]}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeArea>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    header: {
        padding: Spacing.lg,
        paddingTop: Spacing.xl,
        backgroundColor: theme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        marginTop: 4,
    },
    scenarioList: {
        flex: 1,
    },
    scenarioContent: {
        padding: Spacing.base,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.secondary,
        marginBottom: Spacing.md,
    },
    scenarioCard: {
        marginBottom: Spacing.md,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        flexDirection: 'row',
        height: 100,
    },
    scenarioIconContainer: {
        width: 80,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scenarioTextContent: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'center',
    },
    scenarioHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    scenarioTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
    levelBadge: {
        borderWidth: 1,
        borderRadius: BorderRadius.sm,
        paddingHorizontal: Spacing.xs,
        paddingVertical: 2,
    },
    levelText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    scenarioSubtitle: {
        fontSize: FontSize.sm,
        marginBottom: Spacing.xs,
    },
    scenarioDescription: {
        fontSize: FontSize.xs,
        lineHeight: 16,
    },
    chevron: {
        justifyContent: 'center',
        paddingRight: Spacing.md,
        backgroundColor: 'transparent',
    },
    // ... existing tipCard and chat styles ...
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.warning[50],
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
    tipText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.warning[700],
    },
    // Chat styles
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: theme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.light,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContent: {
        flex: 1,
        marginHorizontal: Spacing.sm,
    },
    chatHeaderTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    chatHeaderSubtitle: {
        fontSize: FontSize.xs,
        color: theme.text.tertiary,
    },
    translateToggle: {
        padding: Spacing.sm,
    },
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        paddingVertical: Spacing.base,
    },
    loadingContainer: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
    },
    loadingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background.tertiary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        alignSelf: 'flex-start',
        gap: Spacing.sm,
    },
    loadingText: {
        fontSize: FontSize.sm,
        color: theme.text.tertiary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Changed to center for single line default
        padding: Spacing.base,
        backgroundColor: theme.background.primary,
        borderTopWidth: 1,
        borderTopColor: theme.border.light,
        gap: Spacing.sm,
    },
    textInput: {
        flex: 1,
        backgroundColor: theme.background.tertiary,
        borderRadius: BorderRadius.full, // Rounded
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm, // Smaller vertical padding
        fontSize: FontSize.base,
        color: theme.text.primary,
        maxHeight: 100,
    },
    micButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: theme.border.light,
    },
});
