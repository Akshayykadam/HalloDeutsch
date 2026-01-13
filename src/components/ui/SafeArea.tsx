// SafeArea Component - Uses react-native-safe-area-context
import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export const SafeArea: React.FC<SafeAreaProps> = ({
    children,
    style,
    edges = ['top', 'right', 'left'],
}) => {
    return (
        <SafeAreaView style={[styles.container, style]} edges={edges}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
