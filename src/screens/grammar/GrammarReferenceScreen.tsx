import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea, Card, Badge } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { getGrammarTopics } from '../../services/contentService';
import { GrammarTable } from '../../components/grammar/GrammarTable';
import { GrammarTopic } from '../../data/content/grammar-content';

export const GrammarReferenceScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState<GrammarTopic[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<string>('All');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getGrammarTopics();
            setTopics(data);
        } catch (error) {
            console.error('Failed to load grammar tables:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTopics = topics.filter(t =>
        (selectedLevel === 'All' || t.level === selectedLevel) &&
        t.tables && t.tables.length > 0
    );

    const levels = ['All', 'A1', 'A2', 'B1', 'B2'];

    const styles = getStyles(theme);

    return (
        <SafeArea style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Grammar Tables</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Level Filter */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
                    {levels.map(level => (
                        <TouchableOpacity
                            key={level}
                            style={[
                                styles.filterChip,
                                selectedLevel === level && styles.activeFilterChip
                            ]}
                            onPress={() => setSelectedLevel(level)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedLevel === level && styles.activeFilterText
                            ]}>
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            ) : (
                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {filteredTopics.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="grid-outline" size={48} color={theme.text.tertiary} />
                            <Text style={styles.emptyText}>No tables found for this level</Text>
                        </View>
                    ) : (
                        filteredTopics.map((topic) => (
                            <View key={topic.id} style={styles.topicSection}>
                                <View style={styles.topicHeader}>
                                    <Badge variant="default" size="small" label={topic.level} />
                                    <Text style={styles.topicTitle}>{topic.title}</Text>
                                </View>

                                {topic.tables?.map((table, idx) => (
                                    <Card key={`${topic.id}-table-${idx}`} style={styles.tableCard}>
                                        <Text style={styles.tableTitle}>{table.title}</Text>
                                        <GrammarTable
                                            headers={table.headers}
                                            rows={table.rows}
                                        />
                                    </Card>
                                ))}
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeArea>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.primary,
    },
    backButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    filterContainer: {
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.primary,
    },
    filterContent: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
    },
    filterChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        backgroundColor: theme.background.secondary,
        borderWidth: 1,
        borderColor: theme.border.primary,
    },
    activeFilterChip: {
        backgroundColor: Colors.primary[500],
        borderColor: Colors.primary[500],
    },
    filterText: {
        fontSize: FontSize.sm,
        color: theme.text.secondary,
        fontWeight: FontWeight.medium,
    },
    activeFilterText: {
        color: Colors.white,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicSection: {
        marginBottom: Spacing.xl,
    },
    topicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    topicTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: theme.text.primary,
    },
    tableCard: {
        marginBottom: Spacing.md,
        padding: Spacing.md,
    },
    tableTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: theme.text.primary,
        marginBottom: Spacing.sm,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Spacing['3xl'],
        gap: Spacing.md,
    },
    emptyText: {
        fontSize: FontSize.md,
        color: theme.text.secondary,
    },
});

export default GrammarReferenceScreen;
