# 🇩🇪 HalloDeutsch - German Learning App

![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android)
![Tech](https://img.shields.io/badge/Built%20With-Expo%20%7C%20React%20Native-61DAFB?style=for-the-badge&logo=react)
![AI](https://img.shields.io/badge/Powered%20By-Google%20Gemini-8E75B2?style=for-the-badge&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**HalloDeutsch** is a comprehensive German language learning application built with React Native and Expo. It combines structured curriculum content with AI-powered features to create an engaging and effective learning experience.

---

## ✨ Features

### 📚 Learning Modules

| Module | Description |
|--------|-------------|
| **Grammar Reference** | Complete A1-B2 grammar lessons with explanations and examples |
| **Vocabulary Training** | Curated word lists organized by topic with audio pronunciation |
| **Reading Practice** | Level-appropriate texts with translation support |
| **Sentence Formation** | Practice building German sentences with grammar tips |
| **Dictionary** | Integrated German-English dictionary lookup |

### 🤖 AI-Powered Features

- **Snap & Learn**: Take a photo of any object to learn its German word, gender (der/die/das), and example sentences
- **AI Stories**: Generate custom stories on any topic for your level with vocabulary highlights
- **Interactive Chat**: Role-play real-world scenarios with AI feedback on grammar and vocabulary
- **AI Pen Pal**: Practice written German with an AI writing partner that provides corrections

### 🎯 Practice & Skills

- **Pronunciation Coach**: Listen to native pronunciation and practice speaking
- **Flashcards**: Spaced repetition system (SRS) for effective vocabulary retention
- **Quizzes**: Test your knowledge with interactive multiple-choice quizzes
- **Word of the Day**: Daily vocabulary boost with example sentences

### 🌍 Cultural Learning

- **Cultural Guide**: Essential tips about German customs, etiquette, and daily life
- **Culture Quiz**: Test your knowledge of German culture
- **Useful Phrases**: Common expressions for real-world situations

### 🎮 Gamification

- **XP & Levels**: Earn experience points for completing lessons
- **Daily Streaks**: Build consistency with streak tracking
- **Hearts System**: Encourages careful learning
- **Achievements**: Unlock badges for reaching milestones

### 🎨 User Experience

- **Modern UI**: Clean, intuitive design with smooth animations
- **Dark Mode**: Full dark theme support for comfortable night learning
- **Haptic Feedback**: Tactile responses for interactions
- **Offline Support**: Core lessons work without internet

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native with Expo SDK 53 |
| **Language** | TypeScript |
| **Navigation** | React Navigation (Stack + Bottom Tabs) |
| **State** | React Context + Zustand |
| **Storage** | AsyncStorage |
| **AI** | Google Gemini API |
| **TTS** | expo-speech (German voice) |
| **Styling** | Custom Theme System |
| **Icons** | Ionicons |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/          # Buttons, cards, inputs
│   ├── gamification/    # XP bars, hearts, streaks
│   └── ...
├── context/             # React Context providers
│   ├── ThemeContext.tsx
│   └── UserContext.tsx
├── data/                # Static content and data
│   └── content/         # Vocabulary, grammar, stories
├── navigation/          # App navigation setup
├── screens/             # Screen components
│   ├── home/
│   ├── learn/
│   ├── practice/
│   ├── tools/
│   ├── profile/
│   └── ...
├── services/            # API and utility services
│   └── audioService.ts  # TTS functionality
├── stores/              # Zustand stores
└── theme/               # Colors, typography, spacing
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ (required for Metro bundler)
- **npm** or **yarn**
- **Android Studio** with an emulator (for development)
- **Expo CLI** (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GermanLearnerApp.git
   cd GermanLearnerApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**
   
   Create `src/config.ts`:
   ```typescript
   export const Config = {
       GEMINI_API_KEY: 'your-gemini-api-key-here',
   };
   ```
   > ⚠️ `src/config.ts` is git-ignored to protect your API keys.

4. **Start development server**
   ```bash
   npx expo run:android
   ```

---

## 📦 Building Release APK

1. **Generate native Android project**
   ```bash
   npx expo prebuild --platform android
   ```

2. **Build release APK**
   ```bash
   cd android && ./gradlew assembleRelease
   ```

3. **Find APK at**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Signing for Production

For Play Store submission, configure signing in `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('your-keystore.jks')
            storePassword 'your-store-password'
            keyAlias 'your-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### Optimization for Production

To significantly reduce the APK size (often by 30-50%), you should enable ProGuard/R8 in the release build.

1. Open `android/app/build.gradle`
2. Find the `def enableProGuardInReleaseBuilds = false` line
3. Change it to `true`:
   ```gradle
   def enableProGuardInReleaseBuilds = true
   ```
4. Rebuild the release APK.

---

## 📱 Screenshots

| Home | Learn | Practice | Cultural Guide |
|:----:|:-----:|:--------:|:--------------:|
| *Add screenshot* | *Add screenshot* | *Add screenshot* | *Add screenshot* |

---

## 🔧 Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features |

### Customization

- **Theme Colors**: Edit `src/theme/colors.ts`
- **Content**: Add vocabulary/grammar in `src/data/content/`
- **App Config**: Modify `app.json` for app name, icons, splash

---

## 📋 Roadmap

- [ ] iOS support
- [ ] Cloud sync for progress
- [ ] Social features (friends, leaderboards)
- [ ] Speech recognition for pronunciation feedback
- [ ] C1-C2 level content
- [ ] Offline AI features

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- [React Navigation](https://reactnavigation.org/) for navigation
- German language resources and native speakers who contributed content

---

**Made with ❤️ for German learners everywhere**
