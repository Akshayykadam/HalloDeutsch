// Grammar Reference Panel - Visible, accessible grammar rules
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, LightTheme, Shadows, LevelColors } from '../../theme';
import { CEFRLevel } from '../../types';
import { grammarRules, getGrammarByLevel, getCategoriesForLevel, GrammarRule } from '../../data/content/grammar-rules';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// Grammar Reference Panel (Modal)
// ============================================
interface GrammarReferencePanelProps {
    visible: boolean;
    onClose: () => void;
    highlightedRuleId?: string;  // If provided, scroll to this rule
    level?: CEFRLevel;           // Filter by level
}

export const GrammarReferencePanel: React.FC<GrammarReferencePanelProps> = ({
    visible,
    onClose,
    highlightedRuleId,
    level = 'A1',
}) => {
    const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(level);
    const [expandedRule, setExpandedRule] = useState<string | null>(highlightedRuleId || null);

    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
    const categories = getCategoriesForLevel(selectedLevel);
    const rules = getGrammarByLevel(selectedLevel);

    const toggleRule = (ruleId: string) => {
        setExpandedRule(expandedRule === ruleId ? null : ruleId);
    };

    const renderRuleCard = (rule: GrammarRule) => {
        const isExpanded = expandedRule === rule.id;
        const levelColor = LevelColors[rule.level];

        return (
            <TouchableOpacity
                key={rule.id}
                activeOpacity={0.8}
                onPress={() => toggleRule(rule.id)}
                style={[
                    styles.ruleCard,
                    isExpanded && styles.ruleCardExpanded,
                    highlightedRuleId === rule.id && styles.ruleCardHighlighted,
                ]}
            >
                {/* Header */}
                <View style={styles.ruleHeader}>
                    <View style={styles.ruleTitleRow}>
                        <View style={[styles.levelDot, { backgroundColor: levelColor }]} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.ruleTitle}>{rule.title}</Text>
                            <Text style={styles.ruleTitleDe}>{rule.titleDe}</Text>
                        </View>
                        <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={Colors.neutral[400]}
                        />
                    </View>
                    <Text style={styles.ruleCategory}>{rule.category}</Text>
                </View>

                {/* Expanded Content */}
                {isExpanded && (
                    <View style={styles.ruleContent}>
                        {/* Explanation */}
                        <Text style={styles.ruleExplanation}>{rule.explanation}</Text>

                        {/* Key Points */}
                        {rule.keyPoints && rule.keyPoints.length > 0 && (
                            <View style={styles.keyPointsContainer}>
                                <Text style={styles.sectionLabel}>Key Points</Text>
                                {rule.keyPoints.map((point, idx) => (
                                    <View key={idx} style={styles.keyPointItem}>
                                        <Ionicons name="checkmark-circle" size={14} color={Colors.success[500]} />
                                        <Text style={styles.keyPointText}>{point}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Tables (Conjugation, Declension) */}
                        {rule.tables && rule.tables.map((table, tIdx) => (
                            <View key={tIdx} style={styles.tableContainer}>
                                <Text style={styles.tableTitle}>{table.title}</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.table}>
                                        {/* Header Row */}
                                        <View style={styles.tableRow}>
                                            {table.headers.map((header, hIdx) => (
                                                <View key={hIdx} style={styles.tableHeaderCell}>
                                                    <Text style={styles.tableHeaderText}>{header}</Text>
                                                </View>
                                            ))}
                                        </View>
                                        {/* Data Rows */}
                                        {table.rows.map((row, rIdx) => (
                                            <View key={rIdx} style={styles.tableRow}>
                                                {row.map((cell, cIdx) => (
                                                    <View key={cIdx} style={styles.tableCell}>
                                                        <Text style={styles.tableCellText}>{cell}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        ))}

                        {/* Examples */}
                        {rule.examples && rule.examples.length > 0 && (
                            <View style={styles.examplesContainer}>
                                <Text style={styles.sectionLabel}>Examples</Text>
                                {rule.examples.map((example, idx) => (
                                    <View key={idx} style={styles.exampleItem}>
                                        <Text style={styles.exampleGerman}>
                                            {example.german}
                                            {example.highlight && (
                                                <Text style={styles.exampleHighlight}> ({example.highlight})</Text>
                                            )}
                                        </Text>
                                        <Text style={styles.exampleEnglish}>{example.english}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Common Mistakes */}
                        {rule.commonMistakes && rule.commonMistakes.length > 0 && (
                            <View style={styles.mistakesContainer}>
                                <Text style={[styles.sectionLabel, { color: Colors.error[600] }]}>
                                    Common Mistakes
                                </Text>
                                {rule.commonMistakes.map((mistake, idx) => (
                                    <View key={idx} style={styles.mistakeItem}>
                                        <View style={styles.mistakeRow}>
                                            <Ionicons name="close-circle" size={14} color={Colors.error[500]} />
                                            <Text style={styles.mistakeWrong}>{mistake.wrong}</Text>
                                        </View>
                                        <View style={styles.mistakeRow}>
                                            <Ionicons name="checkmark-circle" size={14} color={Colors.success[500]} />
                                            <Text style={styles.mistakeCorrect}>{mistake.correct}</Text>
                                        </View>
                                        <Text style={styles.mistakeExplanation}>{mistake.explanation}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Tips */}
                        {rule.tips && rule.tips.length > 0 && (
                            <View style={styles.tipsContainer}>
                                <Text style={[styles.sectionLabel, { color: Colors.warning[600] }]}>
                                    Tips
                                </Text>
                                {rule.tips.map((tip, idx) => (
                                    <Text key={idx} style={styles.tipText}>• {tip}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.modalHeader}>
                    <View>
                        <Text style={styles.modalTitle}>Grammar Reference</Text>
                        <Text style={styles.modalSubtitle}>Always visible, always reviewable</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={LightTheme.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Level Tabs */}
                <View style={styles.levelTabs}>
                    {levels.map((lvl) => {
                        const isActive = selectedLevel === lvl;
                        const color = LevelColors[lvl];
                        return (
                            <TouchableOpacity
                                key={lvl}
                                onPress={() => setSelectedLevel(lvl)}
                                style={[
                                    styles.levelTab,
                                    isActive && { borderBottomColor: color, borderBottomWidth: 2 },
                                ]}
                            >
                                <Text style={[
                                    styles.levelTabText,
                                    isActive && { color: color, fontWeight: FontWeight.bold },
                                ]}>
                                    {lvl}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Rules List */}
                <ScrollView
                    style={styles.rulesScroll}
                    contentContainerStyle={styles.rulesContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {categories.map((category) => {
                        const categoryRules = rules.filter(r => r.category === category);
                        if (categoryRules.length === 0) return null;

                        return (
                            <View key={category} style={styles.categorySection}>
                                <Text style={styles.categoryHeader}>{category}</Text>
                                {categoryRules.map(renderRuleCard)}
                            </View>
                        );
                    })}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </Modal>
    );
};

// ============================================
// Floating Grammar Button (for screens)
// ============================================
interface GrammarButtonProps {
    onPress: () => void;
}

export const GrammarFloatingButton: React.FC<GrammarButtonProps> = ({ onPress }) => (
    <TouchableOpacity
        style={styles.floatingButton}
        onPress={onPress}
        activeOpacity={0.9}
    >
        <Ionicons name="book" size={20} color={Colors.white} />
        <Text style={styles.floatingButtonText}>Grammar</Text>
    </TouchableOpacity>
);

// ============================================
// Inline Grammar Tip (for exercises)
// ============================================
interface GrammarTipProps {
    ruleId: string;
    onLearnMore?: () => void;
}

export const InlineGrammarTip: React.FC<GrammarTipProps> = ({ ruleId, onLearnMore }) => {
    const rule = grammarRules.find(r => r.id === ruleId);
    if (!rule) return null;

    return (
        <View style={styles.inlineTip}>
            <View style={styles.inlineTipHeader}>
                <Ionicons name="information-circle" size={16} color={Colors.primary[500]} />
                <Text style={styles.inlineTipTitle}>{rule.title}</Text>
            </View>
            <Text style={styles.inlineTipText}>
                {rule.explanation.substring(0, 150)}...
            </Text>
            {onLearnMore && (
                <TouchableOpacity onPress={onLearnMore} style={styles.learnMoreButton}>
                    <Text style={styles.learnMoreText}>Learn more</Text>
                    <Ionicons name="arrow-forward" size={14} color={Colors.primary[500]} />
                </TouchableOpacity>
            )}
        </View>
    );
};

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LightTheme.background.secondary,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.base,
        paddingTop: Spacing.xl,
        backgroundColor: LightTheme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: LightTheme.border.light,
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    modalSubtitle: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        marginTop: 2,
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelTabs: {
        flexDirection: 'row',
        backgroundColor: LightTheme.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: LightTheme.border.light,
    },
    levelTab: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    levelTabText: {
        fontSize: FontSize.base,
        color: LightTheme.text.secondary,
    },
    rulesScroll: {
        flex: 1,
    },
    rulesContainer: {
        padding: Spacing.base,
    },
    categorySection: {
        marginBottom: Spacing.lg,
    },
    categoryHeader: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.md,
    },
    ruleCard: {
        backgroundColor: LightTheme.background.primary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.md,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    ruleCardExpanded: {
        borderColor: Colors.primary[200],
    },
    ruleCardHighlighted: {
        borderColor: Colors.primary[500],
        borderWidth: 2,
    },
    ruleHeader: {},
    ruleTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: Spacing.sm,
    },
    ruleTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    ruleTitleDe: {
        fontSize: FontSize.sm,
        color: LightTheme.text.tertiary,
        fontStyle: 'italic',
    },
    ruleCategory: {
        fontSize: FontSize.xs,
        color: LightTheme.text.tertiary,
        marginTop: Spacing.xs,
    },
    ruleContent: {
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: LightTheme.border.light,
    },
    ruleExplanation: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        lineHeight: 22,
        marginBottom: Spacing.md,
    },
    sectionLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.neutral[600],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
    },
    keyPointsContainer: {
        marginBottom: Spacing.md,
    },
    keyPointItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.xs,
    },
    keyPointText: {
        fontSize: FontSize.sm,
        color: LightTheme.text.primary,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    tableContainer: {
        marginBottom: Spacing.md,
    },
    tableTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: LightTheme.text.primary,
        marginBottom: Spacing.sm,
    },
    table: {
        borderWidth: 1,
        borderColor: LightTheme.border.light,
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeaderCell: {
        backgroundColor: Colors.neutral[100],
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        minWidth: 80,
        borderRightWidth: 1,
        borderRightColor: LightTheme.border.light,
    },
    tableHeaderText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: LightTheme.text.primary,
    },
    tableCell: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        minWidth: 80,
        borderRightWidth: 1,
        borderRightColor: LightTheme.border.light,
        borderBottomWidth: 1,
        borderBottomColor: LightTheme.border.light,
        backgroundColor: LightTheme.background.primary,
    },
    tableCellText: {
        fontSize: FontSize.sm,
        color: LightTheme.text.primary,
    },
    examplesContainer: {
        marginBottom: Spacing.md,
    },
    exampleItem: {
        backgroundColor: Colors.primary[50],
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.xs,
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary[500],
    },
    exampleGerman: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: LightTheme.text.primary,
    },
    exampleHighlight: {
        color: Colors.primary[600],
        fontWeight: FontWeight.regular,
    },
    exampleEnglish: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        fontStyle: 'italic',
        marginTop: 2,
    },
    mistakesContainer: {
        backgroundColor: Colors.error[50],
        padding: Spacing.md,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.md,
    },
    mistakeItem: {
        marginBottom: Spacing.sm,
    },
    mistakeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    mistakeWrong: {
        fontSize: FontSize.sm,
        color: Colors.error[700],
        marginLeft: Spacing.xs,
        textDecorationLine: 'line-through',
    },
    mistakeCorrect: {
        fontSize: FontSize.sm,
        color: Colors.success[700],
        marginLeft: Spacing.xs,
        fontWeight: FontWeight.semibold,
    },
    mistakeExplanation: {
        fontSize: FontSize.xs,
        color: Colors.error[600],
        marginTop: 4,
        marginLeft: 18,
    },
    tipsContainer: {
        backgroundColor: Colors.warning[50],
        padding: Spacing.md,
        borderRadius: BorderRadius.sm,
    },
    tipText: {
        fontSize: FontSize.sm,
        color: Colors.warning[800],
        marginBottom: 4,
    },

    // Floating Button
    floatingButton: {
        position: 'absolute',
        bottom: Spacing.xl,
        right: Spacing.base,
        backgroundColor: Colors.primary[500],
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
        ...Shadows.md,
    },
    floatingButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
        marginLeft: Spacing.xs,
    },

    // Inline Tip
    inlineTip: {
        backgroundColor: Colors.primary[50],
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.primary[200],
        marginVertical: Spacing.sm,
    },
    inlineTipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    inlineTipTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary[700],
        marginLeft: Spacing.xs,
    },
    inlineTipText: {
        fontSize: FontSize.sm,
        color: LightTheme.text.secondary,
        lineHeight: 20,
    },
    learnMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    learnMoreText: {
        fontSize: FontSize.sm,
        color: Colors.primary[500],
        fontWeight: FontWeight.semibold,
        marginRight: 4,
    },
});
