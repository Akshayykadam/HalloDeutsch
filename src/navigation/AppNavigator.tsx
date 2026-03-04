// App Navigator - Main navigation structure
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

import {
    WelcomeScreen,
    LevelSelectionScreen,
    GoalsScreen,
    ScheduleScreen,
} from '../screens/onboarding';
import { HomeScreen } from '../screens/home';
import { LearnScreen } from '../screens/lesson';
import { PracticeScreen } from '../screens/practice';
import { ProfileScreen, AboutScreen } from '../screens/profile';
import { ChatScreen } from '../screens/chat';
import { GrammarScreen, GrammarReferenceScreen } from '../screens/grammar';

import { VocabularyScreen } from '../screens/vocabulary';
import { DictionaryScreen } from '../screens/dictionary';
import { SnapScreen } from '../screens/vision/SnapScreen';
import { StoryScreen } from '../screens/learn/StoryScreen';
import { FlashcardScreen } from '../screens/practice/FlashcardScreen';
import { ToolsScreen } from '../screens/tools';
// New Feature Screens
import { PronunciationCoachScreen } from '../screens/pronunciation';
import { ArticleDrillScreen } from '../screens/drills';
import { DictationScreen } from '../screens/dictation';
import { PenPalScreen } from '../screens/penpal';
import { ExamPrepScreen } from '../screens/exam';
import { CulturalGuideScreen } from '../screens/culture';
import { IdiomsSlangScreen } from '../screens/idioms';
import { FillInBlankScreen } from '../screens/fillInBlank';
import { useUserStore } from '../store';
import { Colors, FontWeight } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';
import {
    RootStackParamList,
    OnboardingStackParamList,
    MainTabParamList,
} from '../types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

/* ─── Tab icon helper ─── */
const getTabIconName = (routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
        case 'Home':
            return focused ? 'home' : 'home-outline';
        case 'Learn':
            return focused ? 'library' : 'library-outline';
        case 'Practice':
            return focused ? 'game-controller' : 'game-controller-outline';
        case 'Tools':
            return focused ? 'construct' : 'construct-outline';
        case 'Chat':
            return focused ? 'chatbubbles' : 'chatbubbles-outline';
        default:
            return 'ellipse-outline';
    }
};

/* ─── Animated Tab Item ─── */
const TabItem: React.FC<{
    iconName: keyof typeof Ionicons.glyphMap;
    label: string;
    isFocused: boolean;
    onPress: () => void;
    isDark: boolean;
}> = ({ iconName, label, isFocused, onPress, isDark }) => {
    const scale = useSharedValue(isFocused ? 1 : 0);
    const iconScale = useSharedValue(1);

    React.useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0, { damping: 15, stiffness: 180 });
    }, [isFocused]);

    const pillStyle = useAnimatedStyle(() => ({
        opacity: scale.value,
        transform: [{ scale: 0.7 + scale.value * 0.3 }],
    }));

    const labelStyle = useAnimatedStyle(() => ({
        opacity: 0.45 + scale.value * 0.55,
        transform: [{ scale: 0.95 + scale.value * 0.05 }],
    }));

    const handlePress = () => {
        iconScale.value = withSpring(0.85, { damping: 10 }, () => {
            iconScale.value = withSpring(1, { damping: 10 });
        });
        onPress();
    };

    const activeColor = '#fff';
    const inactiveColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)';
    const activeLabelColor = isDark ? '#C7D2FE' : '#6366F1';
    const inactiveLabelColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={handlePress}
            activeOpacity={0.8}
            style={tabStyles.tab}
        >
            <View style={tabStyles.iconArea}>
                <Animated.View style={[tabStyles.pillBg, pillStyle]}>
                    <LinearGradient
                        colors={['#6366F1', '#4F46E5'] as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
                <Ionicons
                    name={iconName}
                    size={21}
                    color={isFocused ? activeColor : inactiveColor}
                />
            </View>
            <Animated.Text
                style={[
                    tabStyles.label,
                    {
                        color: isFocused ? activeLabelColor : inactiveLabelColor,
                        fontWeight: isFocused ? FontWeight.bold : FontWeight.medium,
                    },
                    labelStyle,
                ]}
                numberOfLines={1}
            >
                {label}
            </Animated.Text>
        </TouchableOpacity>
    );
};

/* ─── Custom Floating Tab Bar ─── */
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { isDark } = useTheme();

    return (
        <View style={tabStyles.wrapper}>
            <View style={[
                tabStyles.container,
                isDark ? tabStyles.containerDark : tabStyles.containerLight,
            ]}>
                {/* Inner glow overlay for glassmorphism */}
                <View style={[
                    tabStyles.innerGlow,
                    { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)' },
                ]} />

                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = (options.tabBarLabel as string) ?? route.name;
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const iconName = getTabIconName(route.name, isFocused);

                    return (
                        <TabItem
                            key={route.key}
                            iconName={iconName}
                            label={label}
                            isFocused={isFocused}
                            onPress={onPress}
                            isDark={isDark}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const tabStyles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 30 : 18,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '88%',
        borderRadius: 32,
        paddingVertical: 10,
        paddingHorizontal: 4,
        overflow: 'hidden',
    },
    containerDark: {
        backgroundColor: '#12121C',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 24,
            },
            android: { elevation: 20 },
        }),
    },
    containerLight: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
            },
            android: { elevation: 20 },
        }),
    },
    innerGlow: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 32,
        borderWidth: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    iconArea: {
        width: 44,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillBg: {
        position: 'absolute',
        width: 44,
        height: 38,
        borderRadius: 14,
        overflow: 'hidden',
    },
    label: {
        fontSize: 10,
    },
});

// Onboarding Navigator
const OnboardingNavigator: React.FC = () => (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
        <OnboardingStack.Screen name="LevelSelection" component={LevelSelectionScreen} />
        <OnboardingStack.Screen name="Goals" component={GoalsScreen} />
        <OnboardingStack.Screen name="Schedule" component={ScheduleScreen} />
    </OnboardingStack.Navigator>
);

/* ─── Standalone Floating Tab Bar (no React Navigation dependency) ─── */
const TAB_CONFIG = [
    { key: 'Home', label: 'Home' },
    { key: 'Learn', label: 'Learn' },
    { key: 'Chat', label: 'Chat' },
    { key: 'Practice', label: 'Practice' },
    { key: 'Tools', label: 'Tools' },
] as const;

const StandaloneTabBar: React.FC<{
    activeIndex: number;
    onTabPress: (index: number) => void;
}> = ({ activeIndex, onTabPress }) => {
    const { isDark } = useTheme();

    return (
        <View style={tabStyles.wrapper}>
            <View style={[
                tabStyles.container,
                isDark ? tabStyles.containerDark : tabStyles.containerLight,
            ]}>
                <View style={[
                    tabStyles.innerGlow,
                    { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)' },
                ]} />

                {TAB_CONFIG.map((tab, index) => {
                    const isFocused = activeIndex === index;
                    const iconName = getTabIconName(tab.key, isFocused);

                    return (
                        <TabItem
                            key={tab.key}
                            iconName={iconName}
                            label={tab.label}
                            isFocused={isFocused}
                            onPress={() => onTabPress(index)}
                            isDark={isDark}
                        />
                    );
                })}
            </View>
        </View>
    );
};

/* ─── Tab screen components in order ─── */
const TAB_SCREENS = [HomeScreen, LearnScreen, ChatScreen, PracticeScreen, ToolsScreen];

/* ─── Horizontal Pager Tab Navigator ─── */
const MainTabNavigator: React.FC = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const translateX = useSharedValue(0);
    const { width } = useWindowDimensions();

    const handleTabPress = React.useCallback((index: number) => {
        setActiveIndex(index);
        translateX.value = withTiming(-index * width, {
            duration: 280,
            easing: Easing.out(Easing.cubic),
        });
    }, [width]);

    const pagerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={{ flex: 1, overflow: 'hidden' }}>
            <Animated.View style={[{ flexDirection: 'row', width: width * TAB_SCREENS.length, flex: 1 }, pagerStyle]}>
                {TAB_SCREENS.map((Screen, i) => (
                    <View key={i} style={{ width, flex: 1 }}>
                        <Screen />
                    </View>
                ))}
            </Animated.View>
            <StandaloneTabBar activeIndex={activeIndex} onTabPress={handleTabPress} />
        </View>
    );
};

// Root Navigator
export const AppNavigator: React.FC = () => {
    const { isOnboarded } = useUserStore();

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                {!isOnboarded ? (
                    <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
                ) : (
                    <>
                        <RootStack.Screen name="Main" component={MainTabNavigator} />
                        <RootStack.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom'
                            }}
                        />
                        <RootStack.Screen name="Grammar" component={GrammarScreen} />
                        <RootStack.Screen
                            name="GrammarReference"
                            component={GrammarReferenceScreen}
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom'
                            }}
                        />
                        <RootStack.Screen name="Vocabulary" component={VocabularyScreen} />
                        <RootStack.Screen name="Dictionary" component={DictionaryScreen} />
                        <RootStack.Screen
                            name="Snap"
                            component={SnapScreen}
                            options={{
                                presentation: 'fullScreenModal',
                                headerShown: false
                            }}
                        />
                        <RootStack.Screen
                            name="Story"
                            component={StoryScreen}
                            options={{
                                animation: 'slide_from_right',
                                headerShown: false
                            }}
                        />
                        <RootStack.Screen
                            name="Flashcards"
                            component={FlashcardScreen}
                            options={{
                                animation: 'slide_from_bottom',
                                headerShown: false
                            }}
                        />
                        {/* New Feature Screens */}
                        <RootStack.Screen
                            name="Pronunciation"
                            component={PronunciationCoachScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <RootStack.Screen
                            name="ArticleDrill"
                            component={ArticleDrillScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <RootStack.Screen
                            name="Dictation"
                            component={DictationScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <RootStack.Screen
                            name="PenPal"
                            component={PenPalScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <RootStack.Screen
                            name="ExamPrep"
                            component={ExamPrepScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <RootStack.Screen
                            name="CulturalGuide"
                            component={CulturalGuideScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <RootStack.Screen
                            name="IdiomsSlang"
                            component={IdiomsSlangScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <RootStack.Screen
                            name="About"
                            component={AboutScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <RootStack.Screen
                            name="FillInBlank"
                            component={FillInBlankScreen}
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                    </>
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};
