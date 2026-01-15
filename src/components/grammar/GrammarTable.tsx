// GrammarTable - A reusable table component for grammar content
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

interface TableProps {
    headers: string[];
    rows: string[][];
    highlightColumn?: number;
}

export const GrammarTable: React.FC<TableProps> = ({ headers, rows, highlightColumn }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={styles.tableContainer}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                {headers.map((header, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.headerCell,
                            idx === highlightColumn && styles.highlightCell,
                        ]}
                    >
                        <Text style={styles.headerText}>{header}</Text>
                    </View>
                ))}
            </View>

            {/* Data Rows */}
            {rows.map((row, rowIdx) => (
                <View
                    key={rowIdx}
                    style={[
                        styles.dataRow,
                        rowIdx % 2 === 1 && styles.alternateRow,
                    ]}
                >
                    {row.map((cell, cellIdx) => (
                        <View
                            key={cellIdx}
                            style={[
                                styles.dataCell,
                                cellIdx === highlightColumn && styles.highlightCell,
                            ]}
                        >
                            <Text style={[
                                styles.cellText,
                                cellIdx === 0 && styles.firstColumnText,
                            ]}>
                                {cell}
                            </Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    tableContainer: {
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
        marginVertical: Spacing.md,
        borderWidth: 1,
        borderColor: theme.border.primary,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: Colors.primary[600],
    },
    headerCell: {
        flex: 1,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
        textAlign: 'center',
    },
    dataRow: {
        flexDirection: 'row',
        backgroundColor: theme.background.secondary,
    },
    alternateRow: {
        backgroundColor: theme.background.primary,
    },
    dataCell: {
        flex: 1,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: theme.border.primary,
    },
    cellText: {
        fontSize: FontSize.sm,
        color: theme.text.primary,
        textAlign: 'center',
    },
    firstColumnText: {
        fontWeight: FontWeight.medium,
        color: theme.text.secondary,
    },
    highlightCell: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
});

export default GrammarTable;
