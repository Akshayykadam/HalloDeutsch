// Confetti Overlay - Celebration animation for achievements and completions

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
    Colors.primary[500],
    Colors.secondary[500],
    Colors.success[500],
    Colors.warning[500],
    '#8B5CF6', // purple
    Colors.gold[500],
    '#EC4899', // pink
];

interface ConfettiPiece {
    x: number;
    y: Animated.Value;
    rotate: Animated.Value;
    opacity: Animated.Value;
    color: string;
    size: number;
    drift: number;
    shape: 'square' | 'circle' | 'strip';
}

interface ConfettiOverlayProps {
    visible: boolean;
    onComplete?: () => void;
    count?: number;
    duration?: number;
}

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({
    visible,
    onComplete,
    count = 50,
    duration = 2500,
}) => {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (visible) {
            const newPieces: ConfettiPiece[] = Array.from({ length: count }).map(() => {
                const shapes: Array<'square' | 'circle' | 'strip'> = ['square', 'circle', 'strip'];
                return {
                    x: Math.random() * SCREEN_WIDTH,
                    y: new Animated.Value(-50),
                    rotate: new Animated.Value(0),
                    opacity: new Animated.Value(1),
                    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                    size: 6 + Math.random() * 8,
                    drift: (Math.random() - 0.5) * 80,
                    shape: shapes[Math.floor(Math.random() * shapes.length)],
                };
            });

            setPieces(newPieces);

            // Animate all pieces
            const animations = newPieces.map((piece, index) => {
                const delay = Math.random() * 400;
                const pieceDuration = duration + Math.random() * 800;

                return Animated.parallel([
                    Animated.timing(piece.y, {
                        toValue: SCREEN_HEIGHT + 50,
                        duration: pieceDuration,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(piece.rotate, {
                        toValue: 3 + Math.random() * 5,
                        duration: pieceDuration,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(piece.opacity, {
                        toValue: 0,
                        duration: pieceDuration,
                        delay: delay + pieceDuration * 0.6,
                        useNativeDriver: true,
                    }),
                ]);
            });

            Animated.parallel(animations).start(() => {
                setPieces([]);
                onComplete?.();
            });
        } else {
            setPieces([]);
        }
    }, [visible]);

    if (!visible || pieces.length === 0) return null;

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {pieces.map((piece, index) => {
                const spin = piece.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                });

                const shapeStyle =
                    piece.shape === 'circle'
                        ? { borderRadius: piece.size / 2 }
                        : piece.shape === 'strip'
                            ? { width: piece.size * 0.4, height: piece.size * 1.5, borderRadius: 2 }
                            : { borderRadius: 2 };

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.piece,
                            {
                                left: piece.x + piece.drift,
                                width: piece.size,
                                height: piece.size,
                                backgroundColor: piece.color,
                                opacity: piece.opacity,
                                transform: [
                                    { translateY: piece.y as any },
                                    { rotate: spin },
                                ],
                            },
                            shapeStyle,
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    piece: {
        position: 'absolute',
        top: 0,
    },
});
