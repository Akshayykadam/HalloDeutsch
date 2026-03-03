// BookStack Illustration - Colorful stacked books with decorative elements
// Built from View shapes with theme colors
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme';

interface BookStackProps {
    size?: number;
}

export const BookStack: React.FC<BookStackProps> = ({ size = 100 }) => {
    const scale = size / 100;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Bottom book - widest */}
            <View style={[styles.book, styles.book1, {
                width: 70 * scale,
                height: 16 * scale,
                borderRadius: 3 * scale,
                bottom: 10 * scale,
            }]}>
                <View style={[styles.bookSpine, {
                    width: 4 * scale,
                    backgroundColor: Colors.primary[700],
                    borderTopLeftRadius: 3 * scale,
                    borderBottomLeftRadius: 3 * scale,
                }]} />
                <View style={[styles.bookStripe, {
                    height: 2 * scale,
                    top: 5 * scale,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                }]} />
            </View>

            {/* Middle book - slightly offset */}
            <View style={[styles.book, styles.book2, {
                width: 60 * scale,
                height: 14 * scale,
                borderRadius: 3 * scale,
                bottom: 26 * scale,
            }]}>
                <View style={[styles.bookSpine, {
                    width: 4 * scale,
                    backgroundColor: Colors.secondary[700],
                    borderTopLeftRadius: 3 * scale,
                    borderBottomLeftRadius: 3 * scale,
                }]} />
                <View style={[styles.bookStripe, {
                    height: 2 * scale,
                    top: 4 * scale,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                }]} />
            </View>

            {/* Top book - smallest */}
            <View style={[styles.book, styles.book3, {
                width: 55 * scale,
                height: 13 * scale,
                borderRadius: 3 * scale,
                bottom: 40 * scale,
            }]}>
                <View style={[styles.bookSpine, {
                    width: 4 * scale,
                    backgroundColor: Colors.success[700],
                    borderTopLeftRadius: 3 * scale,
                    borderBottomLeftRadius: 3 * scale,
                }]} />
            </View>

            {/* Tilted book leaning against stack */}
            <View style={[styles.tiltedBook, {
                width: 14 * scale,
                height: 50 * scale,
                borderRadius: 3 * scale,
                bottom: 10 * scale,
                right: 5 * scale,
            }]}>
                <View style={[styles.tiltedSpine, {
                    height: 3 * scale,
                    backgroundColor: Colors.accent[700],
                }]} />
            </View>

            {/* Graduation cap on top */}
            <View style={[styles.capContainer, {
                bottom: 53 * scale,
            }]}>
                <Ionicons
                    name="school"
                    size={24 * scale}
                    color={Colors.warning[500]}
                />
            </View>

            {/* Decorative sparkles */}
            <View style={[styles.sparkle, {
                top: 10 * scale,
                right: 10 * scale,
                width: 6 * scale,
                height: 6 * scale,
                borderRadius: 3 * scale,
            }]} />
            <View style={[styles.sparkle, styles.sparkleSecondary, {
                top: 25 * scale,
                right: 2 * scale,
                width: 4 * scale,
                height: 4 * scale,
                borderRadius: 2 * scale,
            }]} />
            <View style={[styles.sparkle, styles.sparkleTertiary, {
                top: 5 * scale,
                left: 5 * scale,
                width: 5 * scale,
                height: 5 * scale,
                borderRadius: 2.5 * scale,
            }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    book: {
        position: 'absolute',
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    book1: {
        backgroundColor: Colors.primary[500],
        alignSelf: 'center',
        transform: [{ rotate: '-2deg' }],
    },
    book2: {
        backgroundColor: Colors.secondary[500],
        alignSelf: 'center',
        transform: [{ rotate: '3deg' }],
    },
    book3: {
        backgroundColor: Colors.success[500],
        alignSelf: 'center',
        transform: [{ rotate: '-1deg' }],
    },
    bookSpine: {
        height: '100%',
    },
    bookStripe: {
        position: 'absolute',
        left: 12,
        right: 8,
    },
    tiltedBook: {
        position: 'absolute',
        backgroundColor: Colors.accent[500],
        transform: [{ rotate: '15deg' }],
        overflow: 'hidden',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tiltedSpine: {
        width: '100%',
        backgroundColor: Colors.accent[700],
    },
    capContainer: {
        position: 'absolute',
        alignSelf: 'center',
        left: '25%',
    },
    sparkle: {
        position: 'absolute',
        backgroundColor: Colors.warning[400],
        opacity: 0.8,
    },
    sparkleSecondary: {
        backgroundColor: Colors.primary[400],
        opacity: 0.6,
    },
    sparkleTertiary: {
        backgroundColor: Colors.success[400],
        opacity: 0.7,
    },
});
