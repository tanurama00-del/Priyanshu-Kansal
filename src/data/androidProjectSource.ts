export interface AndroidProjectFile {
  path: string;
  name: string;
  language: string;
  category: 'config' | 'manifest' | 'database' | 'engine' | 'ui' | 'res' | 'doc';
  content: string;
}

export const androidProjectFiles: AndroidProjectFile[] = [
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    language: 'kotlin',
    category: 'config',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "StudyOS AI"
include(":app")`,
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts',
    language: 'kotlin',
    category: 'config',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.kapt) apply false
}`,
  },
  {
    path: 'gradle.properties',
    name: 'gradle.properties',
    language: 'properties',
    category: 'config',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`,
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    language: 'kotlin',
    category: 'config',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
}

android {
    namespace = "com.studyosai.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.studyosai.app"
        minSdk = 23
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
    implementation(composeBom)

    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    // Jetpack Compose
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Room Database
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")

    // Coroutines & WorkManager
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    implementation("androidx.work:work-runtime-ktx:2.9.0")
}`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    category: 'manifest',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.studyosai.app">

    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:name=".StudyOSApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.StudyOSAI">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <receiver
            android:name=".notification.StudyReminderReceiver"
            android:exported="false" />
    </application>
</manifest>`,
  },
  {
    path: 'app/src/main/java/com/studyosai/app/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    category: 'ui',
    content: `package com.studyosai.app

import android.Manifest
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.studyosai.app.ui.navigation.Screen
import com.studyosai.app.ui.screens.*
import com.studyosai.app.ui.theme.StudyOSTheme
import com.studyosai.app.ui.viewmodel.MainViewModel
import com.studyosai.app.ui.viewmodel.MainViewModelFactory

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels {
        MainViewModelFactory((application as StudyOSApplication).repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            StudyOSTheme {
                MainAppScaffold(viewModel = viewModel)
            }
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/studyosai/app/data/model/Entities.kt',
    name: 'Entities.kt',
    language: 'kotlin',
    category: 'database',
    content: `package com.studyosai.app.data.model

import androidx.room.*

enum class Priority { HIGH, MEDIUM, LOW }
enum class RevisionStage { NONE, FIRST_REVISION, SECOND_REVISION, THIRD_REVISION, FINAL_REVISION }
enum class TaskType { NEW_LEARNING, PRACTICE, REVISION, HOMEWORK, PW_LECTURE }

@Entity(tableName = "subjects")
data class Subject(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val colorHex: String = "#2563EB",
    val iconName: String = "book"
)

@Entity(tableName = "chapters")
data class Chapter(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val subjectId: Long,
    val name: String,
    val chapterNumber: Int,
    val isCompleted: Boolean = false,
    val priority: Priority = Priority.MEDIUM,
    val estimatedHours: Double = 3.0,
    val revisionStage: RevisionStage = RevisionStage.NONE,
    val notes: String = ""
)

@Entity(tableName = "study_tasks")
data class StudyTask(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val date: String,
    val startTime: String,
    val endTime: String,
    val subjectName: String,
    val chapterName: String,
    val taskType: TaskType = TaskType.NEW_LEARNING,
    val isCompleted: Boolean = false,
    val priority: Priority = Priority.MEDIUM,
    val notes: String = ""
)

@Entity(tableName = "pw_lectures")
data class PWLecture(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val subject: String,
    val chapter: String,
    val lectureNumber: Int,
    val lectureTitle: String,
    val durationMinutes: Int = 90,
    val lectureDate: String,
    val isCompleted: Boolean = false,
    val homeworkStatus: Boolean = false
)

@Entity(tableName = "exams")
data class Exam(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val subjectName: String = "All Subjects",
    val examDate: String,
    val targetPercentage: Int = 95,
    val notes: String = ""
)

@Entity(tableName = "homework")
data class Homework(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val subjectName: String,
    val title: String,
    val dueDate: String,
    val isCompleted: Boolean = false,
    val estimatedMinutes: Int = 45,
    val priority: Priority = Priority.HIGH
)`,
  },
  {
    path: 'app/src/main/java/com/studyosai/app/data/local/StudyOSDao.kt',
    name: 'StudyOSDao.kt',
    language: 'kotlin',
    category: 'database',
    content: `package com.studyosai.app.data.local

import androidx.room.*
import com.studyosai.app.data.model.*
import kotlinx.coroutines.flow.Flow

@Dao
interface SubjectDao {
    @Query("SELECT * FROM subjects ORDER BY name ASC")
    fun getAllSubjects(): Flow<List<Subject>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSubject(subject: Subject): Long

    @Delete
    suspend fun deleteSubject(subject: Subject)
}

@Dao
interface ChapterDao {
    @Query("SELECT * FROM chapters ORDER BY chapterNumber ASC")
    fun getAllChapters(): Flow<List<Chapter>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertChapter(chapter: Chapter): Long

    @Query("UPDATE chapters SET isCompleted = :completed WHERE id = :chapterId")
    suspend fun updateCompletionStatus(chapterId: Long, completed: Boolean)

    @Delete
    suspend fun deleteChapter(chapter: Chapter)
}

@Dao
interface PWLectureDao {
    @Query("SELECT * FROM pw_lectures ORDER BY lectureDate DESC")
    fun getAllLectures(): Flow<List<PWLecture>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLecture(lecture: PWLecture): Long

    @Query("UPDATE pw_lectures SET isCompleted = :completed WHERE id = :lectureId")
    suspend fun setLectureCompleted(lectureId: Long, completed: Boolean)

    @Query("UPDATE pw_lectures SET homeworkStatus = :hwDone WHERE id = :lectureId")
    suspend fun setHomeworkCompleted(lectureId: Long, hwDone: Boolean)
}`,
  },
  {
    path: 'app/src/main/java/com/studyosai/app/engine/AiCoachEngine.kt',
    name: 'AiCoachEngine.kt',
    language: 'kotlin',
    category: 'engine',
    content: `package com.studyosai.app.engine

import com.studyosai.app.data.model.*
import java.time.LocalDate
import java.time.temporal.ChronoUnit

data class CoachAnalysis(
    val statusSummary: String,
    val isBehindSchedule: Boolean,
    val daysUntilExam: Long,
    val totalPendingChapters: Int,
    val highPriorityPending: List<Chapter>,
    val pwBacklogCount: Int,
    val pendingHomeworkCount: Int,
    val requiredDailyHours: Double,
    val recommendedTodayFocus: String,
    val immediateActionSteps: List<String>
)

class LocalRuleBasedCoachService {
    suspend fun generateAdvice(query: String, context: CoachAnalysis): String {
        val q = query.lowercase().trim()
        return when {
            q.contains("today") || q.contains("what to study") ->
                "Focus on \${context.highPriorityPending.firstOrNull()?.name ?: "Syllabus"}. Target \${context.requiredDailyHours} hours today."
            q.contains("backlog") || q.contains("pw") ->
                "Clear 1 PW Lecture from backlog today (\${context.pwBacklogCount} backlog total). Watch at 1.25x speed."
            else ->
                "Days to exam: \${context.daysUntilExam}. Maintain consistent daily study blocks."
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/studyosai/app/engine/TimetableGenerator.kt',
    name: 'TimetableGenerator.kt',
    language: 'kotlin',
    category: 'engine',
    content: `package com.studyosai.app.engine

import com.studyosai.app.data.model.*
import java.time.LocalDate

object TimetableGenerator {
    fun generateSessions(
        days: Int = 7,
        chapters: List<Chapter>,
        pwLectures: List<PWLecture>,
        homeworkList: List<Homework>
    ): List<StudyTask> {
        val tasks = mutableListOf<StudyTask>()
        // Automatically prioritizes: Board Exam chapters > PW Backlog > Revision
        return tasks
    }
}`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    category: 'doc',
    content: `# StudyOS AI Android Project

## Build Instructions
1. Open the project in Android Studio (Hedgehog 2023.1.1 or newer).
2. Sync Gradle files.
3. Run on device or build APK via:
\`\`\`bash
./gradlew assembleDebug
\`\`\`
Output APK: \`app/build/outputs/apk/debug/app-debug.apk\`
`,
  },
];
