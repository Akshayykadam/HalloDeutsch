# 🇩🇪 HalloDeutsch - German Learning App

![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android)
![Tech](https://img.shields.io/badge/Built%20With-Expo%20%7C%20React%20Native-61DAFB?style=for-the-badge&logo=react)
![AI](https://img.shields.io/badge/Powered%20By-Google%20Gemini-8E75B2?style=for-the-badge&logo=google)
![Backend](https://img.shields.io/badge/Database-Firebase%20Firestore-FFCA28?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**HalloDeutsch** is a comprehensive German language learning application built with React Native and Expo. It combines cloud-synced curriculum content with cutting-edge AI features to create a personalized, high-retention learning journey.

---
## Screenshots
<p align="center">
  <img src="https://github.com/user-attachments/assets/e32f2d72-8a3a-43f5-8cbb-8891d1dc2e3a" width="16%" />
  <img src="https://github.com/user-attachments/assets/e7dac5f7-a596-4fbc-9215-337499989891" width="16%" />
  <img src="https://github.com/user-attachments/assets/d5c1eb87-92e6-4553-b028-715e6141e109" width="16%" />
  <img src="https://github.com/user-attachments/assets/a8c8a69d-a747-49c9-b47e-405929ebd310" width="16%" />
  <img src="https://github.com/user-attachments/assets/2451dfec-dbd1-46f4-8cd0-f4b56691b622" width="16%" />
  <img src="https://github.com/user-attachments/assets/03400d7c-c8a6-47d2-9c26-981ff29e70e4" width="16%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/c10c36a9-cf02-419a-ba6c-48b04d607e2d" width="16%" />
  <img src="https://github.com/user-attachments/assets/ead29f9b-91b0-4bc4-99eb-3c8421dc68da" width="16%" />
  <img src="https://github.com/user-attachments/assets/1474c105-ad13-4e8b-af51-fd4488f3f349" width="16%" />
  <img src="https://github.com/user-attachments/assets/e1f8f427-6455-424c-91cd-4c2ef85c48da" width="16%" />
  <img src="https://github.com/user-attachments/assets/d1120c21-cd54-4e92-9e7f-9890ca956c51" width="16%" />
  <img src="https://github.com/user-attachments/assets/8160f3eb-4bc2-472b-b561-4c33f6ec3d18" width="16%" />
</p>

---

## ✨ Features

### 📚 Structured Curriculum (Cloud-Powered)
All course content is delivered via **Google Cloud Firestore**, allowing for real-time updates and extensive data coverage.
| Level | Status | Content |
|-------|--------|---------|
| **A1** | ✅ Complete | Alphabet, Numbers, Greetings, Basic Grammar |
| **A2** | ✅ Complete | Extended Vocabulary, Past Tense, Modal Verbs |
| **B1** | ✅ Complete | Complex Sentences, Subordinate Clauses, Travel |
| **B2** | 🚧 Beta | Academic Vocabulary, Professional Communication |

### 🤖 AI-Powered Features
- **✨ AI Flashcards**: Generate custom vocabulary decks on any topic (e.g., "Space", "Coffee Shop", "Tech Interviews"). 
- **Snap & Learn**: Take a photo of objects to learn their German word, gender, and usage.
- **AI Stories**: Personalize your reading practice with level-appropriate stories generated on-demand.
- **Interactive Chat**: Practice role-playing scenarios with real-time AI feedback.

### 🎯 Spaced Repetition System (SRS)
- **Leitner System Implementation**: Optimize your memory retention with a smart flashcard system.
- **Progressive Learning**: Cards move through boxes as you master them.
- **Session Complete Screen**: Dynamic feedback showing XP earned and summary of cards mastered.
- **Audio Integration**: Native-like Text-to-Speech (TTS) for every German word.

### 🎮 Gamification & Growth
- **Daily Streaks**: Stay motivated with daily consistency tracking.
- **XP & Leveling Up**: Earn experience for every lesson and flashcard mastered.
- **Success UI**: Rewarding animations and glassmorphic design elements.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native with Expo SDK 53 |
| **Backend** | Firebase (Auth + Firestore) |
| **AI Engine** | Google Gemini (1.5 Flash/Pro) |
| **State** | Zustand (Persistent Storage) |
| **TTS** | Expo Speech (German-DE Voice) |
| **Navigation** | React Navigation 7 |
| **Styling** | Modern Theme System (Dark/Light) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v20+
- **Expo Go** (available on Play Store/App Store)
- **Firebase Project** (configured for web/android)

### Installation
1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/HalloDeutsch.git
   cd HalloDeutsch
   npm install
   ```

2. **Configuration**
   Add your API keys in `src/config.ts`:
   ```typescript
   export const Config = {
       GEMINI_API_KEY: 'your-gemini-key',
       FIREBASE_CONFIG: {
           apiKey: "...",
           projectId: "...",
           // ... other firebase keys
       }
   };
   ```

3. **Running**
   ```bash
   npx expo start
   ```

---

## 📋 Roadmap
- [ ] **Offline Mode**: Local caching of Firestore content.
- [ ] **Speech Recognition**: Voice-activated pronunciation grading.
- [ ] **C1 Professional**: Preparation for TestDaF/Telc C1 exams.
- [ ] **Social**: Global leaderboards and friend challenges.

---

## 📄 License
MIT License - Made with ❤️ for German learners everywhere.
