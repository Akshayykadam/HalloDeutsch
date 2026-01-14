// AI Pen Pal Screen - Letter/Email writing practice with AI
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store';
import {
    penPalCharacters,
    writingPrompts,
    PenPalCharacter,
    WritingPrompt,
    getPenPalById,
    getPromptsByLevel,
} from '../../data/content/penpal-characters';
import { checkGrammar } from '../../services/geminiService';
import { getLevelTitle } from '../../utils/levelUtils';

type ScreenState = 'select' | 'prompt' | 'write' | 'response';

interface Correction {
    original: string;
    corrected: string;
    explanation: string;
}

export const PenPalScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const { progress } = useUserStore();
    const styles = getStyles(theme, isDark);
    const scrollRef = useRef<ScrollView>(null);

    const [screenState, setScreenState] = useState<ScreenState>('select');
    const [selectedCharacter, setSelectedCharacter] = useState<PenPalCharacter | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
    const [userLetter, setUserLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [corrections, setCorrections] = useState<Correction[]>([]);
    const [aiResponse, setAiResponse] = useState('');
    const [showHints, setShowHints] = useState(false);

    const handleSelectCharacter = (character: PenPalCharacter) => {
        setSelectedCharacter(character);
        setScreenState('prompt');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSelectPrompt = (prompt: WritingPrompt) => {
        setSelectedPrompt(prompt);
        setScreenState('write');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSubmitLetter = async () => {
        if (!userLetter.trim() || !selectedCharacter) return;

        setIsLoading(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            // Check grammar using Gemini
            const grammarResult = await checkGrammar(userLetter, progress.level);
            setCorrections(grammarResult.corrections);

            // Generate AI response (simplified for now - could be expanded)
            const responseText = generateAIResponse();
            setAiResponse(responseText);

            setScreenState('response');
        } catch (error) {
            console.error('Error checking letter:', error);
            // Still show a response even if grammar check fails
            setCorrections([]);
            setAiResponse(generateAIResponse());
            setScreenState('response');
        } finally {
            setIsLoading(false);
        }
    };

    const generateAIResponse = (): string => {
        if (!selectedCharacter) return '';

        const greetings: Record<string, string[]> = {
            formal: ['Sehr geehrte(r) ', 'Vielen Dank für Ihre Nachricht! '],
            informal: ['Hallo! ', 'Hey! ', 'Liebe(r) '],
            'semi-formal': ['Hallo ', 'Vielen Dank für deine Nachricht! '],
        };

        const closings: Record<string, string[]> = {
            formal: ['Mit freundlichen Grüßen,\n', 'Hochachtungsvoll,\n'],
            informal: ['Liebe Grüße,\n', 'Bis bald!\n', 'Mach\'s gut!\n'],
            'semi-formal': ['Viele Grüße,\n', 'Beste Grüße,\n'],
        };

        const style = selectedCharacter.writingStyle;
        const greeting = greetings[style][Math.floor(Math.random() * greetings[style].length)];
        const closing = closings[style][Math.floor(Math.random() * closings[style].length)];

        const responses = [
            'Danke für deine Nachricht! Es freut mich sehr, von dir zu hören. ',
            'Das klingt sehr interessant! Erzähl mir mehr darüber. ',
            'Ich finde es toll, dass du Deutsch lernst! ',
            'Dein Deutsch wird immer besser! Weiter so! ',
        ];

        return greeting + responses[Math.floor(Math.random() * responses.length)] + '\n\n' + closing + selectedCharacter.name;
    };

    const handleNewLetter = () => {
        setUserLetter('');
        setCorrections([]);
        setAiResponse('');
        setSelectedPrompt(null);
        setScreenState('prompt');
    };

    const handleChangeCharacter = () => {
        setSelectedCharacter(null);
        setSelectedPrompt(null);
        setUserLetter('');
        setCorrections([]);
        setAiResponse('');
        setScreenState('select');
    };

    const renderCharacterSelect = () => (
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.sectionTitle}>Choose Your Pen Pal</Text>
            <Text style={styles.sectionSubtitle}>
                Each character has a unique personality and writing style
            </Text>

            {penPalCharacters.map((character) => (
                <TouchableOpacity
                    key={character.id}
                    style={styles.characterCard}
                    onPress={() => handleSelectCharacter(character)}
                >
                    <View style={styles.avatarContainer}>
                        <Ionicons name={character.avatar as any} size={32} color={Colors.white} />
                    </View>
                    <View style={styles.characterInfo}>
                        <Text style={styles.characterName}>{character.name}</Text>
                        <Text style={styles.characterRole}>{character.relationship}</Text>
                        <Text style={styles.characterDesc} numberOfLines={2}>
                            {character.description}
                        </Text>
                        <View style={styles.characterTags}>
                            <View style={[styles.tag, styles.styleTag]}>
                                <Text style={styles.tagText}>{character.writingStyle}</Text>
                            </View>
                            <View style={[styles.tag, styles.levelTag]}>
                                <Text style={styles.tagText}>{character.responseLevel}</Text>
                            </View>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={theme.text.tertiary} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderPromptSelect = () => {
        const prompts = selectedPrompt ? [selectedPrompt] : getPromptsByLevel(progress.level).filter(
            p => p.characterId === selectedCharacter?.id
        );
        const allPrompts = prompts.length > 0 ? prompts : getPromptsByLevel(progress.level);

        return (
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
                {/* Selected Character Card */}
                <TouchableOpacity
                    style={styles.selectedCharacterCard}
                    onPress={handleChangeCharacter}
                >
                    <View style={styles.selectedAvatarContainer}>
                        <Ionicons name={selectedCharacter?.avatar as any} size={32} color={Colors.white} />
                    </View>
                    <View style={styles.selectedCharacterInfo}>
                        <Text style={styles.characterName}>{selectedCharacter?.name}</Text>
                        <Text style={styles.characterRole}>{selectedCharacter?.relationship}</Text>
                    </View>
                    <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Writing Prompts</Text>

                {allPrompts.map((prompt) => (
                    <TouchableOpacity
                        key={prompt.id}
                        style={styles.promptCard}
                        onPress={() => handleSelectPrompt(prompt)}
                    >
                        <Text style={styles.promptTitle}>{prompt.title}</Text>
                        <Text style={styles.promptScenario}>{prompt.scenario}</Text>
                        <View style={styles.promptMeta}>
                            <Text style={styles.promptLevel}>{prompt.level}</Text>
                            <Text style={styles.promptWords}>
                                {prompt.wordCount.min}-{prompt.wordCount.max} words
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Free Writing Option */}
                <TouchableOpacity
                    style={[styles.promptCard, styles.freeWriteCard]}
                    onPress={() => {
                        setSelectedPrompt(null);
                        setScreenState('write');
                    }}
                >
                    <View style={styles.freeWriteIconContainer}>
                        <Ionicons name="create-outline" size={24} color={Colors.white} />
                    </View>
                    <View style={styles.freeWriteContent}>
                        <Text style={styles.freeWriteTitle}>Free Writing</Text>
                        <Text style={styles.freeWriteDesc}>Write anything you want!</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={Colors.primary[500]} />
                </TouchableOpacity>
            </ScrollView>
        );
    };

    const renderWriteScreen = () => {
        const wordCount = userLetter.trim().split(/\s+/).filter(Boolean).length;

        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    ref={scrollRef}
                    style={styles.scrollContent}
                    contentContainerStyle={styles.writeContainer}
                >
                    {/* Recipient */}
                    <View style={styles.recipientCard}>
                        <Text style={styles.recipientLabel}>To:</Text>
                        <View style={styles.recipientAvatarContainer}>
                            <Ionicons name={selectedCharacter?.avatar as any} size={20} color={Colors.white} />
                        </View>
                        <Text style={styles.recipientName}>{selectedCharacter?.name}</Text>
                    </View>

                    {/* Prompt (if selected) */}
                    {selectedPrompt && (
                        <View style={styles.promptDisplay}>
                            <Text style={styles.promptDisplayTitle}>{selectedPrompt.title}</Text>
                            <Text style={styles.promptDisplayText}>{selectedPrompt.scenario}</Text>

                            <TouchableOpacity
                                style={styles.hintsToggle}
                                onPress={() => setShowHints(!showHints)}
                            >
                                <Ionicons
                                    name={showHints ? 'chevron-up' : 'bulb-outline'}
                                    size={20}
                                    color={Colors.primary[500]}
                                />
                                <Text style={styles.hintsToggleText}>
                                    {showHints ? 'Hide Hints' : 'Show Helpful Phrases'}
                                </Text>
                            </TouchableOpacity>

                            {showHints && (
                                <View style={styles.hintsContainer}>
                                    {selectedPrompt.helpfulPhrases.map((phrase, index) => (
                                        <Text key={index} style={styles.hintPhrase}>
                                            • {phrase}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Sample Greetings */}
                    {selectedCharacter && (
                        <View style={styles.greetingsContainer}>
                            <Text style={styles.greetingsLabel}>Suggested greeting:</Text>
                            <View style={styles.greetingsList}>
                                {selectedCharacter.sampleGreetings.map((greeting, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.greetingChip}
                                        onPress={() => setUserLetter(greeting + '\n\n' + userLetter)}
                                    >
                                        <Text style={styles.greetingText}>{greeting}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Letter Input */}
                    <TextInput
                        style={styles.letterInput}
                        placeholder="Write your letter here..."
                        placeholderTextColor={theme.text.tertiary}
                        value={userLetter}
                        onChangeText={setUserLetter}
                        multiline
                        textAlignVertical="top"
                    />

                    {/* Word Count */}
                    <View style={styles.wordCountContainer}>
                        <Text style={styles.wordCountText}>
                            {wordCount} words
                            {selectedPrompt && ` (aim for ${selectedPrompt.wordCount.min}-${selectedPrompt.wordCount.max})`}
                        </Text>
                    </View>
                </ScrollView>

                {/* Submit Button */}
                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !userLetter.trim() && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmitLetter}
                        disabled={!userLetter.trim() || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <>
                                <Ionicons name="send" size={20} color={Colors.white} />
                                <Text style={styles.submitButtonText}>Send Letter</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    };

    const renderResponseScreen = () => (
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
            {/* Corrections Section */}
            {corrections.length > 0 && (
                <View style={styles.correctionsCard}>
                    <View style={styles.correctionsHeader}>
                        <Ionicons name="school" size={24} color={Colors.warning[500]} />
                        <Text style={styles.correctionsTitle}>Grammar Corrections</Text>
                    </View>
                    {corrections.map((correction, index) => (
                        <View key={index} style={styles.correctionItem}>
                            <View style={styles.correctionRow}>
                                <Text style={styles.correctionOriginal}>{correction.original}</Text>
                                <Ionicons name="arrow-forward" size={16} color={theme.text.tertiary} />
                                <Text style={styles.correctionFixed}>{correction.corrected}</Text>
                            </View>
                            <Text style={styles.correctionExplanation}>{correction.explanation}</Text>
                        </View>
                    ))}
                </View>
            )}

            {corrections.length === 0 && (
                <View style={styles.perfectCard}>
                    <Ionicons name="star" size={48} color={Colors.gold[500]} />
                    <Text style={styles.perfectTitle}>Great writing!</Text>
                    <Text style={styles.perfectText}>No grammar errors found!</Text>
                </View>
            )}

            {/* AI Response */}
            <View style={styles.responseCard}>
                <View style={styles.responseHeader}>
                    <View style={styles.responseAvatarContainer}>
                        <Ionicons name={selectedCharacter?.avatar as any} size={24} color={Colors.white} />
                    </View>
                    <View>
                        <Text style={styles.responseName}>{selectedCharacter?.name}</Text>
                        <Text style={styles.responseLabel}>replied:</Text>
                    </View>
                </View>
                <Text style={styles.responseText}>{aiResponse}</Text>
            </View>

            {/* Your Original Letter */}
            <View style={styles.originalCard}>
                <Text style={styles.originalLabel}>Your letter:</Text>
                <Text style={styles.originalText}>{userLetter}</Text>
            </View>

            {/* Actions */}
            <View style={styles.responseActions}>
                <TouchableOpacity style={styles.newLetterButton} onPress={handleNewLetter}>
                    <Ionicons name="create-outline" size={20} color={Colors.primary[500]} />
                    <Text style={styles.newLetterText}>Write Another</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.changeCharacterButton} onPress={handleChangeCharacter}>
                    <Text style={styles.changeCharacterText}>Change Pen Pal</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (screenState === 'select') {
                            navigation.goBack();
                        } else if (screenState === 'prompt') {
                            handleChangeCharacter();
                        } else if (screenState === 'write') {
                            setScreenState('prompt');
                        } else {
                            handleNewLetter();
                        }
                    }}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Pen Pal</Text>
                <View style={styles.headerRight}>
                    <Text style={styles.levelBadge}>{getLevelTitle(progress.level)}</Text>
                </View>
            </View>

            {screenState === 'select' && renderCharacterSelect()}
            {screenState === 'prompt' && renderPromptSelect()}
            {screenState === 'write' && renderWriteScreen()}
            {screenState === 'response' && renderResponseScreen()}
        </View>
    );
};

const getStyles = (theme: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.primary,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing.md,
            paddingTop: 50,
            paddingBottom: Spacing.md,
            backgroundColor: theme.background.primary,
            borderBottomWidth: 1,
            borderBottomColor: theme.border.light,
        },
        backButton: {
            padding: Spacing.xs,
        },
        headerTitle: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        headerRight: {
            width: 50,
            alignItems: 'flex-end',
        },
        levelBadge: {
            backgroundColor: Colors.primary[500],
            color: Colors.white,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: BorderRadius.sm,
            fontSize: FontSize.sm,
            fontWeight: FontWeight.bold,
            overflow: 'hidden',
        },
        scrollContent: {
            flex: 1,
        },
        scrollContainer: {
            padding: Spacing.md,
            paddingBottom: Spacing['2xl'],
        },
        sectionTitle: {
            fontSize: FontSize.xl,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.xs,
        },
        sectionSubtitle: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.lg,
        },
        characterCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.md,
            ...Shadows.sm,
        },
        avatarContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: Colors.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md,
        },
        selectedAvatarContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: Colors.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md,
        },
        recipientAvatarContainer: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: Colors.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
        },
        responseAvatarContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md,
        },
        characterInfo: {
            flex: 1,
        },
        characterName: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        characterRole: {
            fontSize: FontSize.sm,
            color: Colors.primary[500],
            marginBottom: Spacing.xs,
        },
        characterDesc: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.sm,
        },
        characterTags: {
            flexDirection: 'row',
            gap: Spacing.xs,
        },
        tag: {
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: BorderRadius.sm,
        },
        styleTag: {
            backgroundColor: Colors.primary[100],
        },
        levelTag: {
            backgroundColor: Colors.success[100],
        },
        tagText: {
            fontSize: FontSize.xs,
            color: Colors.primary[700],
            fontWeight: FontWeight.medium,
        },
        selectedCharacterCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.primary[50],
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.lg,
        },
        selectedCharacterInfo: {
            flex: 1,
        },
        changeText: {
            fontSize: FontSize.sm,
            color: Colors.primary[500],
            fontWeight: FontWeight.medium,
        },
        promptCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.md,
            ...Shadows.sm,
        },
        promptTitle: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
            marginBottom: Spacing.xs,
        },
        promptScenario: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.sm,
        },
        promptMeta: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        promptLevel: {
            fontSize: FontSize.xs,
            color: Colors.primary[500],
            fontWeight: FontWeight.bold,
        },
        promptWords: {
            fontSize: FontSize.xs,
            color: theme.text.tertiary,
        },
        freeWriteCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.primary[50],
            borderWidth: 1,
            borderColor: Colors.primary[200],
        },
        freeWriteIconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: Colors.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md,
        },
        freeWriteContent: {
            flex: 1,
        },
        freeWriteTitle: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.primary[600],
        },
        freeWriteDesc: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },
        writeContainer: {
            padding: Spacing.md,
            paddingBottom: 100,
        },
        recipientCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            marginBottom: Spacing.md,
            gap: Spacing.sm,
        },
        recipientLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
        },

        recipientName: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        promptDisplay: {
            backgroundColor: Colors.primary[50],
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            marginBottom: Spacing.md,
        },
        promptDisplayTitle: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.primary[700],
            marginBottom: Spacing.xs,
        },
        promptDisplayText: {
            fontSize: FontSize.sm,
            color: Colors.primary[600],
        },
        hintsToggle: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: Spacing.sm,
            gap: Spacing.xs,
        },
        hintsToggleText: {
            fontSize: FontSize.sm,
            color: Colors.primary[500],
        },
        hintsContainer: {
            marginTop: Spacing.sm,
            paddingTop: Spacing.sm,
            borderTopWidth: 1,
            borderTopColor: Colors.primary[200],
        },
        hintPhrase: {
            fontSize: FontSize.sm,
            color: Colors.primary[700],
            marginBottom: 4,
        },
        greetingsContainer: {
            marginBottom: Spacing.md,
        },
        greetingsLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.xs,
        },
        greetingsList: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: Spacing.xs,
        },
        greetingChip: {
            backgroundColor: theme.background.secondary,
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            borderRadius: BorderRadius.md,
        },
        greetingText: {
            fontSize: FontSize.sm,
            color: theme.text.primary,
        },
        letterInput: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            fontSize: FontSize.md,
            color: theme.text.primary,
            minHeight: 200,
            borderWidth: 1,
            borderColor: theme.border.light,
        },
        wordCountContainer: {
            alignItems: 'flex-end',
            marginTop: Spacing.sm,
        },
        wordCountText: {
            fontSize: FontSize.sm,
            color: theme.text.tertiary,
        },
        submitContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: Spacing.md,
            backgroundColor: theme.background.primary,
            borderTopWidth: 1,
            borderTopColor: theme.border.light,
        },
        submitButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.md,
            gap: Spacing.sm,
        },
        submitButtonDisabled: {
            backgroundColor: Colors.neutral[400],
        },
        submitButtonText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        correctionsCard: {
            backgroundColor: Colors.warning[50],
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: Colors.warning[200],
        },
        correctionsHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing.md,
        },
        correctionsTitle: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: Colors.warning[700],
        },
        correctionItem: {
            marginBottom: Spacing.md,
            paddingBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: Colors.warning[200],
        },
        correctionRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            flexWrap: 'wrap',
        },
        correctionOriginal: {
            fontSize: FontSize.md,
            color: Colors.error[600],
            textDecorationLine: 'line-through',
        },
        correctionFixed: {
            fontSize: FontSize.md,
            color: Colors.success[600],
            fontWeight: FontWeight.bold,
        },
        correctionExplanation: {
            fontSize: FontSize.sm,
            color: Colors.warning[700],
            marginTop: Spacing.xs,
            fontStyle: 'italic',
        },
        perfectCard: {
            backgroundColor: Colors.success[50],
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            alignItems: 'center',
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: Colors.success[200],
        },

        perfectTitle: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: Colors.success[700],
        },
        perfectText: {
            fontSize: FontSize.sm,
            color: Colors.success[600],
        },
        responseCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.md,
            ...Shadows.sm,
        },
        responseHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing.md,
        },
        responseName: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: theme.text.primary,
        },
        responseLabel: {
            fontSize: FontSize.xs,
            color: theme.text.secondary,
        },
        responseText: {
            fontSize: FontSize.md,
            color: theme.text.primary,
            lineHeight: 24,
        },
        originalCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.lg,
        },
        originalLabel: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            marginBottom: Spacing.sm,
        },
        originalText: {
            fontSize: FontSize.sm,
            color: theme.text.secondary,
            fontStyle: 'italic',
        },
        responseActions: {
            gap: Spacing.md,
        },
        newLetterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary[500],
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.md,
            gap: Spacing.sm,
        },
        newLetterText: {
            fontSize: FontSize.md,
            fontWeight: FontWeight.bold,
            color: Colors.white,
        },
        changeCharacterButton: {
            alignItems: 'center',
            paddingVertical: Spacing.md,
        },
        changeCharacterText: {
            fontSize: FontSize.md,
            color: theme.text.secondary,
        },
    });

export default PenPalScreen;
