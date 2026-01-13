// Animated Splash Screen Component
import React, { useEffect, useRef } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

const { width } = Dimensions.get('window');

interface AnimatedSplashProps {
    onAnimationComplete: () => void;
}

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onAnimationComplete }) => {
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Start animation sequence
        Animated.sequence([
            // Fade in and scale up
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // Gentle pulse effect
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.08,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            // Hold for a moment
            Animated.delay(500),
        ]).start(() => {
            // Animation complete
            onAnimationComplete();
        });
    }, []);

    return (
        <LinearGradient
            colors={[Colors.primary[600], Colors.primary[800]]}
            style={styles.container}
        >
            <Animated.View
                style={[
                    styles.iconContainer,
                    {
                        opacity: opacityAnim,
                        transform: [
                            { scale: Animated.multiply(scaleAnim, pulseAnim) },
                        ],
                    },
                ]}
            >
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.icon}
                    resizeMode="contain"
                />
            </Animated.View>

            <Animated.Text
                style={[
                    styles.appName,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                German Learner
            </Animated.Text>

            <Animated.Text
                style={[
                    styles.tagline,
                    {
                        opacity: opacityAnim,
                    },
                ]}
            >
                Master German, One Word at a Time
            </Animated.Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: width * 0.4,
        height: width * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    appName: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});
