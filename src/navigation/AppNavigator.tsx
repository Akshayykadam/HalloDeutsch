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

/* ─── Tab Item ─── */
const TabItem: React.FC<{
    iconName: keyof typeof Ionicons.glyphMap;
    label: string;
    isFocused: boolean;
    onPress: () => void;
    isDark: boolean;
}> = ({ iconName, label, isFocused, onPress, isDark }) => {
    const inactiveColor = isDark ? 'rgba(255,255,255,0.5)' : '#9CA3AF';
    const ACTIVE_BG = isDark ? '#6366F1' : '#6366F1';

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={tabStyles.tab}>
            {isFocused ? (
                <View style={[tabStyles.activePill, { backgroundColor: ACTIVE_BG }]}>
                    <Ionicons name={iconName} size={18} color="#FFFFFF" />
                    <Text style={tabStyles.activeLabel} numberOfLines={1}>{label}</Text>
                </View>
            ) : (
                <Ionicons name={iconName} size={23} color={inactiveColor} />
            )}
        </TouchableOpacity>
    );
};

/* ─── Custom Floating Tab Bar ─── */
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { isDark } = useTheme();

    return (
        <View style={tabStyles.outerWrap}>
            <View style={[
                tabStyles.bar,
                isDark ? tabStyles.barDark : tabStyles.barLight,
            ]}>
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

                    return (
                        <TabItem
                            key={route.key}
                            iconName={getTabIconName(route.name, isFocused)}
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

const TAB_HEIGHT = 64;

const tabStyles = StyleSheet.create({
    outerWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 32 : 20,
        paddingHorizontal: 16,
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: TAB_HEIGHT,
        borderRadius: TAB_HEIGHT / 2,
        paddingHorizontal: 12,
        justifyContent: 'space-evenly',
    },
    barDark: {
        backgroundColor: '#171728',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
            },
            android: { elevation: 28 },
        }),
    },
    barLight: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.12,
                shadowRadius: 20,
            },
            android: { elevation: 28 },
        }),
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        paddingHorizontal: 4,
    },
    activePill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        height: TAB_HEIGHT - 16,
        paddingHorizontal: 18,
        borderRadius: (TAB_HEIGHT - 16) / 2,
    },
    activeLabel: {
        fontSize: 14,
        fontWeight: '600' as any,
        color: '#FFFFFF',
        letterSpacing: 0.3,
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
        <View style={tabStyles.outerWrap}>
            <View style={[
                tabStyles.bar,
                isDark ? tabStyles.barDark : tabStyles.barLight,
            ]}>
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
            duration: 250,
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
