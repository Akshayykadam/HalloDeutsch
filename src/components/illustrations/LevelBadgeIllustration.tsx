// Level Badge Illustration - Decorative concentric circles with level icon
// Used as header visual on Level Selection Screen
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, LevelColors } from '../../theme';

interface LevelBadgeIllustrationProps {
    size?: number;
}

export const LevelBadgeIllustration: React.FC<LevelBadgeIllustrationProps> = ({
    size = 140,
}) => {
    const scale = size / 140;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Outermost ring */}
            <View style={[styles.ring, styles.outerRing, {
                width: 140 * scale,
                height: 140 * scale,
                borderRadius: 70 * scale,
                borderWidth: 2 * scale,
            }]} />

            {/* Second ring */}
            <View style={[styles.ring, styles.middleRing, {
                width: 110 * scale,
                height: 110 * scale,
                borderRadius: 55 * scale,
                borderWidth: 2 * scale,
            }]} />

            {/* Inner gradient circle */}
            <LinearGradient
                colors={[Colors.primary[500], Colors.primary[700]]}
                style={[styles.innerCircle, {
                    width: 80 * scale,
                    height: 80 * scale,
                    borderRadius: 40 * scale,
                }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Ionicons name="trophy" size={32 * scale} color={Colors.warning[400]} />
            </LinearGradient>

            {/* Orbiting level dots */}
            <View style={[styles.orbitDot, {
                width: 24 * scale,
                height: 24 * scale,
                borderRadius: 12 * scale,
                top: 2 * scale,
                left: 58 * scale,
                backgroundColor: LevelColors.A1,
            }]}>
                <Text style={[styles.dotText, { fontSize: 9 * scale }]}>A1</Text>
            </View>

            <View style={[styles.orbitDot, {
                width: 24 * scale,
                height: 24 * scale,
                borderRadius: 12 * scale,
                top: 58 * scale,
                right: 2 * scale,
                backgroundColor: LevelColors.A2,
            }]}>
                <Text style={[styles.dotText, { fontSize: 9 * scale }]}>A2</Text>
            </View>

            <View style={[styles.orbitDot, {
                width: 24 * scale,
                height: 24 * scale,
                borderRadius: 12 * scale,
                bottom: 2 * scale,
                left: 58 * scale,
                backgroundColor: LevelColors.B1,
            }]}>
                <Text style={[styles.dotText, { fontSize: 9 * scale }]}>B1</Text>
            </View>

            <View style={[styles.orbitDot, {
                width: 24 * scale,
                height: 24 * scale,
                borderRadius: 12 * scale,
                top: 58 * scale,
                left: 2 * scale,
                backgroundColor: LevelColors.B2,
            }]}>
                <Text style={[styles.dotText, { fontSize: 9 * scale }]}>B2</Text>
            </View>

            {/* Decorative sparkle dots */}
            <View style={[styles.sparkle, {
                width: 8 * scale,
                height: 8 * scale,
                borderRadius: 4 * scale,
                top: 20 * scale,
                right: 15 * scale,
            }]} />
            <View style={[styles.sparkle, styles.sparkleAlt, {
                width: 6 * scale,
                height: 6 * scale,
                borderRadius: 3 * scale,
                bottom: 20 * scale,
                left: 15 * scale,
            }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerRing: {
        borderColor: Colors.primary[200],
        borderStyle: 'dashed',
    },
    middleRing: {
        borderColor: Colors.primary[300],
        opacity: 0.6,
    },
    innerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    orbitDot: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    dotText: {
        color: Colors.white,
        fontWeight: '800',
    },
    sparkle: {
        position: 'absolute',
        backgroundColor: Colors.warning[400],
        opacity: 0.7,
    },
    sparkleAlt: {
        backgroundColor: Colors.success[400],
        opacity: 0.6,
    },
});
