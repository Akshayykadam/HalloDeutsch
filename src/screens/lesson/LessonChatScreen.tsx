// Lesson Chat Screen - AI Conversation-based lesson experience
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
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, LevelColors } from '../../theme';
import { CurriculumLesson } from '../../types';
import { getLessonById } from '../../services/contentService';
import { generateLessonResponse, checkGrammar } from '../../services/geminiService';

interface Message {
    id: string;
    content: string;
    translation?: string;
    isUser: boolean;
    timestamp: Date;
    corrections?: Array<{ original: string; corrected: string; explanation: string }>;
}

export const LessonChatScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const { lessonId } = route.params;
    const [lesson, setLesson] = useState<CurriculumLesson | null>(null);
    const [initializing, setInitializing] = useState(true);

    const scrollViewRef = useRef<ScrollView>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTranslations, setShowTranslations] = useState(true);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const fetchLesson = async () => {
            const l = await getLessonById(lessonId);
            setLesson(l);
            setInitializing(false);
        };
        fetchLesson();
    }, [lessonId]);

    const levelColor = lesson ? LevelColors[lesson.type === 'vocabulary' ? 'A1' : 'A1'] : LevelColors.A1;

    // Initialize with AI greeting
    useEffect(() => {
        if (lesson) {
            initializeConversation();
        }
    }, [lesson]);

    const initializeConversation = async () => {
        if (!lesson) return;

        setIsLoading(true);

        // Create context-specific greeting based on lesson
        const greetingPrompt = getInitialGreeting(lesson);

        try {
            const response = await generateLessonResponse(
                lesson.title,
                lesson.whatLearning,
                lesson.type,
                'Start the lesson',
                'A1',
                [],
                0
            );

            const aiMessage: Message = {
                id: `msg-${Date.now()}`,
                content: response.response,
                translation: response.translation,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages([aiMessage]);
            setSuggestions(response.suggestions || getDefaultSuggestions(lesson));
        } catch (error) {
            console.error('Error initializing conversation:', error);
            // Fallback greeting
            const fallbackMessage: Message = {
                id: `msg-${Date.now()}`,
                content: `Hallo! Willkommen zur Lektion "${lesson.titleDe}". Lass uns zusammen lernen!`,
                translation: `Hello! Welcome to the lesson "${lesson.title}". Let's learn together!`,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages([fallbackMessage]);
            setSuggestions(getDefaultSuggestions(lesson));
        }

        setIsLoading(false);
    };

    const getInitialGreeting = (lesson: CurriculumLesson): string => {
        switch (lesson.type) {
            case 'pronunciation':
                return 'Start a friendly lesson about German pronunciation and the alphabet';
            case 'vocabulary':
                return 'Introduce the vocabulary topic with enthusiasm';
            case 'grammar':
                return 'Begin explaining the grammar concept in a simple way';
            default:
                return 'Start teaching the lesson topic';
        }
    };

    const getDefaultSuggestions = (lesson: CurriculumLesson): string[] => {
        switch (lesson.type) {
            case 'pronunciation':
                return ['Wie spricht man das aus?', 'Können Sie das wiederholen?', 'Ich verstehe'];
            case 'vocabulary':
                return ['Was bedeutet das?', 'Noch einmal, bitte', 'Wie schreibt man das?'];
            case 'grammar':
                return ['Können Sie ein Beispiel geben?', 'Ich verstehe nicht', 'Weiter, bitte'];
            default:
                return ['Ja, ich verstehe', 'Können Sie das erklären?', 'Noch einmal'];
        }
    };

    const handleSend = async (text: string = inputText) => {
        if (!text.trim() || isLoading || !lesson) return;

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
            // Check grammar
            const grammarCheck = await checkGrammar(text, 'A1');

            // Get AI response
            const conversationHistory = messages.map(m => ({
                role: m.isUser ? 'user' as const : 'assistant' as const,
                content: m.content,
            }));

            const response = await generateLessonResponse(
                lesson.title,
                lesson.whatLearning,
                lesson.type,
                text,
                'A1',
                conversationHistory,
                messages.length
            );

            // Update user message with corrections if any
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
            console.error('Error getting response:', error);
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

    const handleSuggestionSelect = (suggestion: string) => {
        handleSend(suggestion);
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (initializing) {
        return (
            <SafeArea style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            </SafeArea>
        );
    }

    if (!lesson) {
        return (
            <SafeArea style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Lesson not found</Text>
                </View>
            </SafeArea>
        );
    }

    return (
        <SafeArea style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={LightTheme.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {lesson.title}
                    </Text>
                    <Text style={styles.headerSubtitle}>{lesson.titleDe}</Text>
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

            {/* Lesson Context Banner */}
            <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.contextBanner}
            >
                <Ionicons name="bulb" size={16} color={Colors.white} />
                <Text style={styles.contextText} numberOfLines={2}>
                    {lesson.whatLearning}
                </Text>
            </LinearGradient>

            {/* Chat Messages */}
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

                {/* Suggested Responses */}
                {suggestions.length > 0 && !isLoading && (
                    <SuggestedResponses
                        suggestions={suggestions}
                        onSelect={handleSuggestionSelect}
                        disabled={isLoading}
                    />
                )}

                {/* Input Area */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LightTheme.background.secondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: LightTheme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: LightTheme.border.light,
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
    headerTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    headerSubtitle: {
        fontSize: FontSize.xs,
        color: LightTheme.text.tertiary,
        fontStyle: 'italic',
    },
    translateToggle: {
        padding: Spacing.sm,
    },
    contextBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
    },
    contextText: {
        flex: 1,
        fontSize: FontSize.xs,
        color: Colors.white,
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
        backgroundColor: Colors.neutral[100],
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        alignSelf: 'flex-start',
        gap: Spacing.sm,
    },
    loadingText: {
        fontSize: FontSize.sm,
        color: Colors.neutral[500],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: Spacing.base,
        backgroundColor: LightTheme.background.primary,
        borderTopWidth: 1,
        borderTopColor: LightTheme.border.light,
        gap: Spacing.sm,
    },
    textInput: {
        flex: 1,
        backgroundColor: Colors.neutral[100],
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        fontSize: FontSize.base,
        color: LightTheme.text.primary,
        maxHeight: 100,
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
        backgroundColor: Colors.neutral[200],
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: FontSize.base,
        color: Colors.error[500],
    },
});
