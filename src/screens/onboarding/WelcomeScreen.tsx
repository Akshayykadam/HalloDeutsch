// Welcome Screen - First screen of onboarding with name/age input
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button, SafeArea } from '../../components/ui';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { OnboardingStackParamList } from '../../types';
import { useUserStore } from '../../store';

type WelcomeScreenProps = {
    navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const { setProfile } = useUserStore();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const mascotAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Mascot bounce animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(mascotAnim, {
                    toValue: -10,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(mascotAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleGetStarted = () => {
        // Save profile with name and age
        setProfile({
            id: Date.now().toString(),
            displayName: name.trim() || 'Learner',
            age: age ? parseInt(age, 10) : undefined,
            createdAt: new Date(),
            onboardingCompleted: false,
        });
        navigation.navigate('LevelSelection');
    };

    const isNameValid = name.trim().length > 0;

    return (
        <LinearGradient
            colors={[Colors.primary[600], Colors.primary[800]]}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <SafeArea style={styles.safeArea}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Animated.View
                            style={[
                                styles.content,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            {/* Mascot */}
                            <Animated.View
                                style={[
                                    styles.mascotContainer,
                                    { transform: [{ translateY: mascotAnim }] },
                                ]}
                            >
                                <Ionicons name="school" size={64} color={Colors.white} />
                            </Animated.View>

                            {/* Title */}
                            <Text style={styles.title}>Willkommen!</Text>
                            <Text style={styles.subtitle}>
                                Let's set up your profile
                            </Text>

                            {/* Input Fields */}
                            <View style={styles.inputContainer}>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Your Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your name"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                    />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Your Age (optional)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your age"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        value={age}
                                        onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
                                        keyboardType="number-pad"
                                        maxLength={3}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>

                            {/* Features */}
                            <View style={styles.features}>
                                <FeatureItem icon="navigate" text="Personalized learning path" />
                                <FeatureItem icon="chatbubbles" text="AI conversation practice" />
                            </View>
                        </Animated.View>

                        {/* CTA Button */}
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Get Started"
                                onPress={handleGetStarted}
                                size="large"
                                fullWidth
                                disabled={!isNameValid}
                            />
                            <Text style={styles.termsText}>
                                By continuing, you agree to our Terms of Service
                            </Text>
                        </View>
                    </ScrollView>
                </SafeArea>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const FeatureItem: React.FC<{ icon: keyof typeof Ionicons.glyphMap; text: string }> = ({ icon, text }) => (
    <View style={styles.featureItem}>
        <View style={styles.featureIcon}>
            <Ionicons name={icon} size={24} color={Colors.white} />
        </View>
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: Spacing.xl,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mascotContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.white,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: Colors.white,
        opacity: 0.9,
        marginBottom: Spacing.xl,
    },
    inputContainer: {
        width: '100%',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    inputWrapper: {
        width: '100%',
    },
    inputLabel: {
        fontSize: FontSize.sm,
        color: Colors.white,
        opacity: 0.8,
        marginBottom: Spacing.xs,
        marginLeft: Spacing.xs,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        paddingHorizontal: Spacing.lg,
        fontSize: FontSize.base,
        color: Colors.white,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    features: {
        width: '100%',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    featureIcon: {
        width: 32,
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    featureText: {
        fontSize: FontSize.base,
        color: Colors.white,
        fontWeight: FontWeight.medium,
    },
    buttonContainer: {
        paddingTop: Spacing.xl,
    },
    termsText: {
        fontSize: FontSize.xs,
        color: Colors.white,
        opacity: 0.6,
        textAlign: 'center',
        marginTop: Spacing.md,
    },
});
