// German Landscape Illustration - Stylized Brandenburg Gate with hills and clouds
// Built entirely from View shapes and LinearGradient
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme';

interface GermanLandscapeProps {
    width?: number;
    height?: number;
    variant?: 'light' | 'dark';
}

export const GermanLandscape: React.FC<GermanLandscapeProps> = ({
    width = 280,
    height = 180,
    variant = 'light',
}) => {
    const isLight = variant === 'light';
    const skyColors = isLight
        ? [Colors.primary[200], Colors.primary[400]] as const
        : [Colors.primary[800], Colors.primary[600]] as const;

    return (
        <View style={[styles.container, { width, height }]}>
            {/* Sky */}
            <LinearGradient
                colors={[...skyColors]}
                style={styles.sky}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            {/* Sun/Moon */}
            <View style={[
                styles.sun,
                {
                    backgroundColor: isLight ? Colors.warning[300] : Colors.primary[300],
                    shadowColor: isLight ? Colors.warning[400] : Colors.primary[400],
                }
            ]} />

            {/* Clouds */}
            <View style={[styles.cloud, styles.cloud1]}>
                <View style={[styles.cloudPart, styles.cloudPartLarge, { backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)' }]} />
                <View style={[styles.cloudPart, styles.cloudPartSmall, { backgroundColor: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.12)' }]} />
            </View>
            <View style={[styles.cloud, styles.cloud2]}>
                <View style={[styles.cloudPart, styles.cloudPartMedium, { backgroundColor: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)' }]} />
                <View style={[styles.cloudPart, styles.cloudPartSmall, { backgroundColor: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)' }]} />
            </View>

            {/* Mountains/Hills - Far */}
            <View style={styles.hillsFar}>
                <View style={[styles.hillFar1, { backgroundColor: isLight ? Colors.primary[300] : Colors.primary[700] }]} />
                <View style={[styles.hillFar2, { backgroundColor: isLight ? Colors.primary[400] : Colors.primary[600] }]} />
            </View>

            {/* Brandenburg Gate - Simplified */}
            <View style={styles.gateContainer}>
                {/* Gate pillars */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={[styles.gatePillar, {
                        left: 30 + i * 22,
                        backgroundColor: isLight ? Colors.primary[600] : Colors.primary[300],
                    }]} />
                ))}
                {/* Gate top beam */}
                <View style={[styles.gateBeam, {
                    backgroundColor: isLight ? Colors.primary[700] : Colors.primary[200],
                }]} />
                {/* Gate roof */}
                <View style={[styles.gateRoof, {
                    backgroundColor: isLight ? Colors.primary[700] : Colors.primary[200],
                }]} />
                {/* Gate decorative top */}
                <View style={[styles.gateTop, {
                    backgroundColor: isLight ? Colors.warning[400] : Colors.warning[300],
                }]} />
            </View>

            {/* Mountains/Hills - Near */}
            <View style={styles.hills}>
                <View style={[styles.hill1, { backgroundColor: isLight ? Colors.success[400] : Colors.success[800] }]} />
                <View style={[styles.hill2, { backgroundColor: isLight ? Colors.success[500] : Colors.success[700] }]} />
                <View style={[styles.hill3, { backgroundColor: isLight ? Colors.success[300] : Colors.success[900] }]} />
            </View>

            {/* Ground */}
            <View style={[styles.ground, {
                backgroundColor: isLight ? Colors.success[400] : Colors.success[800],
            }]} />

            {/* Trees */}
            <View style={[styles.tree, styles.tree1]}>
                <View style={[styles.trunk, { backgroundColor: isLight ? Colors.secondary[700] : Colors.secondary[900] }]} />
                <View style={[styles.canopy, { backgroundColor: isLight ? Colors.success[600] : Colors.success[700] }]} />
                <View style={[styles.canopyTop, { backgroundColor: isLight ? Colors.success[500] : Colors.success[600] }]} />
            </View>
            <View style={[styles.tree, styles.tree2]}>
                <View style={[styles.trunk, { backgroundColor: isLight ? Colors.secondary[700] : Colors.secondary[900] }]} />
                <View style={[styles.canopy, styles.canopySmall, { backgroundColor: isLight ? Colors.success[700] : Colors.success[800] }]} />
                <View style={[styles.canopyTop, styles.canopyTopSmall, { backgroundColor: isLight ? Colors.success[600] : Colors.success[700] }]} />
            </View>

            {/* Stars (only for dark variant) */}
            {!isLight && (
                <>
                    <View style={[styles.star, { top: 15, left: 30 }]} />
                    <View style={[styles.star, { top: 25, left: 80 }]} />
                    <View style={[styles.star, { top: 10, left: 200 }]} />
                    <View style={[styles.star, { top: 30, left: 240 }]} />
                    <View style={[styles.star, styles.starLarge, { top: 20, left: 150 }]} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 20,
        position: 'relative',
    },
    sky: {
        ...StyleSheet.absoluteFillObject,
    },
    sun: {
        position: 'absolute',
        top: 20,
        right: 40,
        width: 30,
        height: 30,
        borderRadius: 15,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 5,
    },
    cloud: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    cloud1: {
        top: 25,
        left: 40,
    },
    cloud2: {
        top: 18,
        right: 80,
    },
    cloudPart: {
        borderRadius: 20,
    },
    cloudPartLarge: {
        width: 40,
        height: 16,
    },
    cloudPartMedium: {
        width: 32,
        height: 14,
    },
    cloudPartSmall: {
        width: 24,
        height: 12,
        marginLeft: -8,
    },
    hillsFar: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        height: 60,
    },
    hillFar1: {
        position: 'absolute',
        bottom: 0,
        left: -20,
        width: 160,
        height: 60,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 80,
    },
    hillFar2: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        width: 180,
        height: 50,
        borderTopLeftRadius: 90,
        borderTopRightRadius: 90,
    },
    gateContainer: {
        position: 'absolute',
        bottom: 35,
        left: '50%',
        marginLeft: -75,
        width: 150,
        height: 80,
    },
    gatePillar: {
        position: 'absolute',
        bottom: 0,
        width: 8,
        height: 55,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    gateBeam: {
        position: 'absolute',
        bottom: 55,
        left: 25,
        right: 25,
        height: 10,
        borderRadius: 2,
    },
    gateRoof: {
        position: 'absolute',
        bottom: 62,
        left: 20,
        right: 20,
        height: 8,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    gateTop: {
        position: 'absolute',
        bottom: 68,
        left: '50%',
        marginLeft: -8,
        width: 16,
        height: 12,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    hills: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
    },
    hill1: {
        position: 'absolute',
        bottom: 0,
        left: -30,
        width: 140,
        height: 40,
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
    },
    hill2: {
        position: 'absolute',
        bottom: 0,
        right: -20,
        width: 160,
        height: 35,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 80,
    },
    hill3: {
        position: 'absolute',
        bottom: 0,
        left: 80,
        width: 120,
        height: 30,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
    },
    ground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 15,
    },
    tree: {
        position: 'absolute',
        alignItems: 'center',
    },
    tree1: {
        bottom: 15,
        left: 25,
    },
    tree2: {
        bottom: 15,
        right: 35,
    },
    trunk: {
        width: 6,
        height: 18,
        borderRadius: 2,
    },
    canopy: {
        position: 'absolute',
        bottom: 14,
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    canopyTop: {
        position: 'absolute',
        bottom: 26,
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    canopySmall: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    canopyTopSmall: {
        bottom: 22,
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    star: {
        position: 'absolute',
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    starLarge: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
});
