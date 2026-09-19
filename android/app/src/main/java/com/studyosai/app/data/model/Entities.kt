package com.studyosai.app.data.model

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

enum class Priority {
    HIGH,
    MEDIUM,
    LOW
}

enum class RevisionStage {
    NONE,
    FIRST_REVISION,
    SECOND_REVISION,
    THIRD_REVISION,
    FINAL_REVISION
}

enum class TaskType {
    NEW_LEARNING,
    PRACTICE,
    REVISION,
    HOMEWORK,
    PW_LECTURE
}

@Entity(tableName = "subjects")
data class Subject(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val colorHex: String = "#2563EB",
    val iconName: String = "book"
)

@Entity(
    tableName = "chapters",
    foreignKeys = [
        ForeignKey(
            entity = Subject::class,
            parentColumns = ["id"],
            childColumns = ["subjectId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["subjectId"])]
)
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
    val date: String, // YYYY-MM-DD
    val startTime: String, // HH:mm
    val endTime: String, // HH:mm
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
    val lectureDate: String, // YYYY-MM-DD
    val isCompleted: Boolean = false,
    val homeworkStatus: Boolean = false // whether associated HW/DPP is done
)

@Entity(tableName = "exams")
data class Exam(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val subjectName: String = "All Subjects",
    val examDate: String, // YYYY-MM-DD
    val targetPercentage: Int = 95,
    val notes: String = ""
)

@Entity(tableName = "revisions")
data class Revision(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val chapterId: Long,
    val chapterName: String,
    val subjectName: String,
    val stage: RevisionStage,
    val scheduledDate: String, // YYYY-MM-DD
    val isCompleted: Boolean = false
)

@Entity(tableName = "homework")
data class Homework(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val subjectName: String,
    val title: String,
    val dueDate: String, // YYYY-MM-DD
    val isCompleted: Boolean = false,
    val estimatedMinutes: Int = 45,
    val priority: Priority = Priority.HIGH
)

@Entity(tableName = "user_profile")
data class UserProfile(
    @PrimaryKey val id: Int = 1,
    val name: String = "Aarav Sharma",
    val studentClass: String = "Class 10 CBSE",
    val dailyStudyHours: Double = 4.5,
    val schoolStartTime: String = "07:30",
    val schoolEndTime: String = "14:00",
    val sleepTime: String = "23:00",
    val preferredStudySlot: String = "Evening (17:00 - 22:00)",
    val pwBatchName: String = "Udaan 2026 Batch",
    val targetExamDate: String = "2027-02-15",
    val currentStreak: Int = 12,
    val isOnboardingCompleted: Boolean = true
)
