import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Modal,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as audioService from '../../services/audioService';
import { SafeArea } from '../../components/ui';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../theme';
import { identifyObject } from '../../services/geminiService';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export const SnapScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme() as any;
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [result, setResult] = useState<{
        word: string;
        gender: string;
        translation: string;
        sentence: string;
    } | null>(null);

    if (!permission) {
        // Camera permissions are still loading
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <SafeArea style={[styles.permissionContainer, { backgroundColor: theme.background.primary }]}>
                <Ionicons name="camera-outline" size={64} color={Colors.primary[500]} />
                <Text style={[styles.permissionText, { color: theme.text.primary }]}>
                    We need your permission to show the camera
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.closeButtonText, { color: theme.text.secondary }]}>Cancel</Text>
                </TouchableOpacity>
            </SafeArea>
        );
    }

    const takePicture = async () => {
        if (!cameraRef.current) return;

        try {
            setIsProcessing(true);
            const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: 0.7,
                exif: false,
            });

            if (photo && photo.uri) {
                // On Android, add a small delay to ensure the file is fully written
                if (Platform.OS === 'android') {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                setImageLoaded(false);
                setCapturedImage(photo.uri);

                if (photo.base64) {
                    const data = await identifyObject(photo.base64);
                    setResult(data);
                }
            }
        } catch (error) {
            console.error('Failed to take picture:', error);
            setCapturedImage(null); // Reset if failed
        } finally {
            setIsProcessing(false);
        }
    };

    const reset = () => {
        setResult(null);
        setCapturedImage(null);
        setImageLoaded(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {!capturedImage ? (
                <CameraView style={styles.camera} ref={cameraRef} facing="back">
                    <SafeArea style={styles.overlay}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                            <View style={styles.titleContainer}>
                                <Ionicons name="scan-circle" size={24} color={Colors.primary[400]} />
                                <Text style={styles.titleText}>AI VISION</Text>
                            </View>
                            <View style={{ width: 40 }} />
                        </View>

                        <View style={styles.controls}>
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={takePicture}
                                activeOpacity={0.7}
                            >
                                <View style={styles.captureInner} />
                            </TouchableOpacity>
                            <Text style={styles.hintText}>
                                Snap an object to learn its name
                            </Text>
                        </View>
                    </SafeArea>
                </CameraView>
            ) : (
                <View style={[styles.previewContainer, { backgroundColor: 'black' }]}>
                    {!imageLoaded && (
                        <View style={styles.imageLoadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary[400]} />
                        </View>
                    )}
                    <Image
                        source={{ uri: capturedImage }}
                        style={[StyleSheet.absoluteFillObject, { opacity: imageLoaded ? 1 : 0 }]}
                        resizeMode="cover"
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            console.error('Image load error:', e.nativeEvent.error);
                            setImageLoaded(true); // Still show the overlay even if image fails
                        }}
                    />
                    <SafeArea style={styles.previewOverlay}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={reset} style={styles.iconButton}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {isProcessing && (
                            <View style={styles.loadingContainer}>
                                <View style={styles.loadingBlur} />
                                <ActivityIndicator size="large" color={Colors.primary[400]} />
                                <Text style={styles.loadingText}>Analyzing...</Text>
                            </View>
                        )}

                        {result && !isProcessing && (
                            <View style={styles.resultSheet}>
                                <View style={[styles.card, { backgroundColor: theme.background.primary }]}>
                                    <View style={styles.handleIndicator} />

                                    <View style={styles.wordHeader}>
                                        <Text style={styles.gender}>{result.gender}</Text>
                                        <Text style={[styles.word, { color: theme.text.primary }]}>{result.word}</Text>
                                        <TouchableOpacity
                                            onPress={() => audioService.speak(result.word)}
                                            style={styles.speakerButton}
                                        >
                                            <Ionicons name="volume-high" size={24} color={Colors.primary[500]} />
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={[styles.translation, { color: theme.text.secondary }]}>{result.translation}</Text>

                                    <View style={[styles.sentenceContainer, { backgroundColor: theme.background.secondary }]}>
                                        <Text style={[styles.sentence, { color: theme.text.primary }]}>{result.sentence}</Text>
                                        <TouchableOpacity
                                            onPress={() => audioService.speak(result.sentence)}
                                            style={styles.sentenceSpeaker}
                                        >
                                            <Ionicons name="volume-medium" size={16} color={Colors.primary[400]} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.actions}>
                                        <TouchableOpacity style={styles.actionButton} onPress={reset}>
                                            <Text style={styles.actionButtonText}>Scan Another</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    </SafeArea>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    permissionText: {
        fontSize: FontSize.lg,
        textAlign: 'center',
        marginVertical: Spacing.xl,
    },
    permissionButton: {
        backgroundColor: Colors.primary[500],
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.full,
    },
    permissionButtonText: {
        color: 'white',
        fontWeight: FontWeight.bold,
        fontSize: FontSize.md,
    },
    closeButton: {
        marginTop: Spacing.lg,
    },
    closeButtonText: {
        fontSize: FontSize.md,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    titleText: {
        color: 'white',
        fontWeight: FontWeight.extrabold,
        fontSize: FontSize.lg,
        letterSpacing: 1,
    },
    controls: {
        alignItems: 'center',
        paddingBottom: Spacing['3xl'],
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
    },
    hintText: {
        color: 'white',
        fontSize: FontSize.sm,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    previewContainer: {
        flex: 1,
    },
    imageLoadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    previewOverlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -75 }, { translateY: -60 }],
        width: 150,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: BorderRadius.xl,
        gap: Spacing.md,
        zIndex: 10,
    },
    loadingBlur: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: BorderRadius.xl,
    },
    loadingText: {
        color: 'white',
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
    },
    resultSheet: {
        justifyContent: 'flex-end',
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    card: {
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    handleIndicator: {
        width: 40,
        height: 5,
        backgroundColor: Colors.neutral[200],
        borderRadius: 2.5,
        marginBottom: Spacing.lg,
    },
    wordHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    gender: {
        fontSize: FontSize.lg,
        color: Colors.primary[500],
        fontWeight: FontWeight.medium,
        marginRight: 4,
    },
    word: {
        fontSize: FontSize['4xl'],
        fontWeight: FontWeight.bold,
    },
    speakerButton: {
        marginLeft: Spacing.sm,
        padding: 4,
    },
    translation: {
        fontSize: FontSize.xl,
        marginBottom: Spacing.lg,
    },
    sentenceContainer: {
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        width: '100%',
        marginBottom: Spacing.xl,
    },
    sentence: {
        fontSize: FontSize.md,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    sentenceSpeaker: {
        alignSelf: 'center',
        padding: 4,
    },
    actions: {
        width: '100%',
    },
    actionButton: {
        backgroundColor: Colors.primary[500],
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        width: '100%',
    },
    actionButtonText: {
        color: 'white',
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
});
