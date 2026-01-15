// Simple Markdown Renderer Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../../theme';

interface MarkdownRendererProps {
    content: string;
    theme: any;
}

interface ParsedLine {
    type: 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'code' | 'text';
    content: string;
    level?: number;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme }) => {
    const parseMarkdown = (md: string): ParsedLine[] => {
        const lines = md.split('\n');
        const parsed: ParsedLine[] = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Headers
            if (trimmed.startsWith('### ')) {
                parsed.push({ type: 'h3', content: trimmed.slice(4) });
            } else if (trimmed.startsWith('## ')) {
                parsed.push({ type: 'h2', content: trimmed.slice(3) });
            } else if (trimmed.startsWith('# ')) {
                parsed.push({ type: 'h1', content: trimmed.slice(2) });
            }
            // Bullet points
            else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                parsed.push({ type: 'bullet', content: trimmed.slice(2) });
            }
            // Numbered list
            else if (/^\d+\.\s/.test(trimmed)) {
                const match = trimmed.match(/^\d+\.\s(.*)$/);
                if (match) {
                    parsed.push({ type: 'numbered', content: match[1] });
                }
            }
            // Code block
            else if (trimmed.startsWith('```') || trimmed.startsWith('`')) {
                parsed.push({ type: 'code', content: trimmed.replace(/`/g, '') });
            }
            // Regular text
            else {
                parsed.push({ type: 'text', content: trimmed });
            }
        });

        return parsed;
    };

    const renderInlineStyles = (text: string) => {
        // Process bold and italic
        const parts: React.ReactNode[] = [];
        let remaining = text;
        let key = 0;

        // Simple bold handling: **text**
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index));
            }
            parts.push(
                <Text key={key++} style={{ fontWeight: FontWeight.bold }}>
                    {match[1]}
                </Text>
            );
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts.length > 0 ? parts : text;
    };

    const parsedLines = parseMarkdown(content);
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            {parsedLines.map((line, index) => {
                switch (line.type) {
                    case 'h1':
                        return (
                            <Text key={index} style={styles.h1}>
                                {renderInlineStyles(line.content)}
                            </Text>
                        );
                    case 'h2':
                        return (
                            <Text key={index} style={styles.h2}>
                                {renderInlineStyles(line.content)}
                            </Text>
                        );
                    case 'h3':
                        return (
                            <Text key={index} style={styles.h3}>
                                {renderInlineStyles(line.content)}
                            </Text>
                        );
                    case 'bullet':
                        return (
                            <View key={index} style={styles.bulletRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>
                                    {renderInlineStyles(line.content)}
                                </Text>
                            </View>
                        );
                    case 'numbered':
                        return (
                            <View key={index} style={styles.bulletRow}>
                                <Text style={styles.bullet}>{index + 1}.</Text>
                                <Text style={styles.bulletText}>
                                    {renderInlineStyles(line.content)}
                                </Text>
                            </View>
                        );
                    case 'code':
                        return (
                            <View key={index} style={styles.codeBlock}>
                                <Text style={styles.codeText}>{line.content}</Text>
                            </View>
                        );
                    default:
                        return (
                            <Text key={index} style={styles.text}>
                                {renderInlineStyles(line.content)}
                            </Text>
                        );
                }
            })}
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        gap: Spacing.xs,
    },
    h1: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
    },
    h2: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    h3: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginTop: Spacing.xs,
    },
    text: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        lineHeight: 20,
    },
    bulletRow: {
        flexDirection: 'row',
        paddingLeft: Spacing.sm,
    },
    bullet: {
        fontSize: FontSize.sm,
        color: Colors.primary[500],
        marginRight: Spacing.xs,
        width: 16,
    },
    bulletText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        lineHeight: 20,
    },
    codeBlock: {
        backgroundColor: theme.background.tertiary || theme.background.secondary,
        padding: Spacing.sm,
        borderRadius: 6,
        marginVertical: Spacing.xs,
    },
    codeText: {
        fontFamily: 'monospace',
        fontSize: FontSize.xs,
        color: theme.text.primary,
    },
});

export default MarkdownRenderer;
