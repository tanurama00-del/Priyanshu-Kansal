# StudyOS AI — Class 10 Android Study Planner

A production-ready Android study planner app built with **Kotlin**, **Jetpack Compose (Material 3)**, and **Room Database**. Specifically engineered for Class 10 CBSE students with Physics Wallah (PW) batch tracking and offline AI study strategy assistance.

---

## 📱 Architecture & Tech Stack

- **UI Layer**: 100% Jetpack Compose + Material 3 design system with custom typography and smooth transitions.
- **Architecture**: Clean MVVM (Model-View-ViewModel) with unidirectional data flow (Flow & StateFlow).
- **Persistence**: Android Jetpack Room Database (SQLite) with preloaded Class 10 CBSE syllabus and PW Udaan batch data.
- **Offline AI Coach**: Rule-based heuristic reasoning engine analyzing syllabus completion, PW lecture backlog, upcoming exam deadlines, and daily targets. Structured with a clean interface for cloud LLM backend integration (never storing private API keys in client APK).
- **Smart Timetable Generator**: Constraint-based session distributor prioritizing board-weightage topics, high-priority backlog, and spaced repetition revisions.
- **Notifications**: AlarmManager & NotificationCompat scheduling with Android 13+ runtime permissions.

---

## 🚀 How to Build APK in Android Studio

### Prerequisites
1. **Android Studio**: Android Studio Hedgehog (2023.1.1) or newer / Ladybug / Koala.
2. **JDK**: Java Development Kit (JDK) 17 or higher.
3. **Android SDK**: API Level 34 (Android 14) with Build Tools 34.0.0.
4. **Minimum Device OS**: Android 6.0 (API Level 23) or higher.

---

### Step-by-Step Instructions

#### 1. Open the Project
1. Launch **Android Studio**.
2. Select **File > Open...** and navigate to the `android/` directory of this repository.
3. Click **OK** to open.

#### 2. Gradle Sync
Android Studio will automatically detect the Gradle files (`settings.gradle.kts`, `build.gradle.kts`, `app/build.gradle.kts`).
- Click **Sync Project with Gradle Files** (elephant icon on top toolbar).
- Ensure Gradle completes sync with 0 errors.

#### 3. Run on Device / Emulator
1. Connect your Android phone via USB with USB Debugging enabled, OR start an Android Virtual Device (AVD).
2. Select `app` in the run configuration dropdown.
3. Click **Run** (green triangle button) or press `Shift + F10`.

#### 4. Build APK (Debug or Release)

**Via Android Studio UI**:
1. From the top menu, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Once the build finishes, click the **locate** popup notification.
3. Your APK is located at:
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

**Via Terminal / Command Line**:
```bash
# In the android/ directory:
./gradlew assembleDebug

# For signed release APK:
./gradlew assembleRelease
```
The output APK will be in:
`app/build/outputs/apk/debug/app-debug.apk`

---

## 📂 Project Structure

```
android/
├── settings.gradle.kts          # Project name & repository management
├── build.gradle.kts             # Top-level Gradle plugins
├── gradle.properties            # JVM & AndroidX flags
├── app/
│   ├── build.gradle.kts         # Compose, Room, Coroutines, WorkManager
│   ├── proguard-rules.pro       # Room retention rules
│   └── src/main/
│       ├── AndroidManifest.xml  # Permissions & Activity declaration
│       ├── res/
│       │   ├── values/strings.xml
│       │   ├── values/colors.xml
│       │   └── values/themes.xml
│       └── java/com/studyosai/app/
│           ├── StudyOSApplication.kt       # App context, DB singleton & notification channels
│           ├── MainActivity.kt             # Scaffold, BottomNav & NavHost
│           ├── data/
│           │   ├── model/Entities.kt       # Subject, Chapter, Task, PWLecture, Exam, Homework
│           │   ├── local/StudyOSDao.kt     # Room DAOs with Flow
│           │   ├── local/AppDatabase.kt    # Room DB & Class 10 CBSE seed data
│           │   └── repository/StudyRepository.kt
│           ├── engine/
│           │   ├── AiCoachEngine.kt        # Rule-based offline AI coach + backend stub
│           │   └── TimetableGenerator.kt   # Dynamic study session scheduler
│           ├── notification/
│           │   ├── NotificationHelper.kt   # Alarm & notification scheduler
│           │   └── StudyReminderReceiver.kt
│           └── ui/
│               ├── theme/                  # Colors, Type, Material3 Theme
│               ├── navigation/Screen.kt    # Compose Navigation destinations
│               ├── viewmodel/MainViewModel.kt
│               └── screens/
│                   ├── HomeScreen.kt
│                   ├── SyllabusScreen.kt
│                   ├── TimetableScreen.kt
│                   ├── PwBatchScreen.kt
│                   ├── AiCoachScreen.kt
│                   ├── ExamCountdownScreen.kt
│                   ├── BacklogScreen.kt
│                   ├── AnalyticsScreen.kt
│                   ├── SettingsScreen.kt
│                   └── OnboardingScreen.kt
```

---

## 🔒 Security Best Practices
- **No Client-Side Secrets**: As mandated, no Gemini API keys or private AI credentials are embedded in the APK. The offline heuristic engine operates entirely on-device with zero network latency. If cloud LLM features are enabled, requests route through an authenticated backend server proxy.
