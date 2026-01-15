// App Navigator - Main navigation structure
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
import { useUserStore } from '../store';
import { Colors, FontSize, FontWeight, Shadows } from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
    RootStackParamList,
    OnboardingStackParamList,
    MainTabParamList,
} from '../types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Tab Bar Icon Component
const getTabIcon = (routeName: string, focused: boolean) => {
    let iconName: keyof typeof Ionicons.glyphMap;
    const color = focused ? Colors.primary[500] : Colors.neutral[400];
    const size = 24;

    switch (routeName) {
        case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
        case 'Learn':
            iconName = focused ? 'library' : 'library-outline';
            break;
        case 'Practice':
            iconName = focused ? 'game-controller' : 'game-controller-outline';
            break;
        case 'Tools':
            iconName = focused ? 'construct' : 'construct-outline';
            break;
        case 'Chat':
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            break;
        case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        default:
            iconName = 'ellipse-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
};

// Onboarding Navigator
const OnboardingNavigator: React.FC = () => (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
        <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
        <OnboardingStack.Screen name="LevelSelection" component={LevelSelectionScreen} />
        <OnboardingStack.Screen name="Goals" component={GoalsScreen} />
        <OnboardingStack.Screen name="Schedule" component={ScheduleScreen} />
    </OnboardingStack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator: React.FC = () => {
    const { theme, isDark } = useTheme();

    return (
        <MainTab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.background.primary,
                    borderTopWidth: 1,
                    borderTopColor: theme.border.light,
                    height: 85,
                    paddingBottom: 24,
                    paddingTop: 8,
                    ...(isDark ? {} : Shadows.sm),
                },
                tabBarActiveTintColor: Colors.primary[500],
                tabBarInactiveTintColor: isDark ? Colors.neutral[500] : Colors.neutral[400],
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
            })}
        >
            <MainTab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: 'Home' }}
            />
            <MainTab.Screen
                name="Learn"
                component={LearnScreen}
                options={{ tabBarLabel: 'Learn' }}
            />
            <MainTab.Screen
                name="Chat"
                component={ChatScreen}
                options={{ tabBarLabel: 'Chat' }}
            />
            <MainTab.Screen
                name="Practice"
                component={PracticeScreen}
                options={{ tabBarLabel: 'Practice' }}
            />
            <MainTab.Screen
                name="Tools"
                component={ToolsScreen}
                options={{ tabBarLabel: 'Tools' }}
            />

        </MainTab.Navigator>
    );
};

// Root Navigator
export const AppNavigator: React.FC = () => {
    const { isOnboarded } = useUserStore();

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
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
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            name="ArticleDrill"
                            component={ArticleDrillScreen}
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            name="Dictation"
                            component={DictationScreen}
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            name="PenPal"
                            component={PenPalScreen}
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            name="ExamPrep"
                            component={ExamPrepScreen}
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            name="CulturalGuide"
                            component={CulturalGuideScreen}
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            name="IdiomsSlang"
                            component={IdiomsSlangScreen}
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            name="About"
                            component={AboutScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBarLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
    },
});
