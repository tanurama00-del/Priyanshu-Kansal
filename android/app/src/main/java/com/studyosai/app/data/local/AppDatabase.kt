package com.studyosai.app.data.local

import android.content.Context
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import com.studyosai.app.data.model.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class Converters {
    @TypeConverter
    fun fromPriority(priority: Priority): String = priority.name

    @TypeConverter
    fun toPriority(value: String): Priority = try {
        Priority.valueOf(value)
    } catch (e: Exception) {
        Priority.MEDIUM
    }

    @TypeConverter
    fun fromRevisionStage(stage: RevisionStage): String = stage.name

    @TypeConverter
    fun toRevisionStage(value: String): RevisionStage = try {
        RevisionStage.valueOf(value)
    } catch (e: Exception) {
        RevisionStage.NONE
    }

    @TypeConverter
    fun fromTaskType(taskType: TaskType): String = taskType.name

    @TypeConverter
    fun toTaskType(value: String): TaskType = try {
        TaskType.valueOf(value)
    } catch (e: Exception) {
        TaskType.NEW_LEARNING
    }
}

@Database(
    entities = [
        Subject::class,
        Chapter::class,
        StudyTask::class,
        PWLecture::class,
        Exam::class,
        Revision::class,
        Homework::class,
        UserProfile::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {

    abstract fun subjectDao(): SubjectDao
    abstract fun chapterDao(): ChapterDao
    abstract fun taskDao(): TaskDao
    abstract fun pwLectureDao(): PWLectureDao
    abstract fun examDao(): ExamDao
    abstract fun revisionDao(): RevisionDao
    abstract fun homeworkDao(): HomeworkDao
    abstract fun userProfileDao(): UserProfileDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope = CoroutineScope(Dispatchers.IO)): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "studyos_database"
                )
                    .addCallback(DatabaseCallback(scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(private val scope: CoroutineScope) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialClass10Data(database)
                    }
                }
            }
        }

        suspend fun populateInitialClass10Data(database: AppDatabase) {
            val userProfileDao = database.userProfileDao()
            val subjectDao = database.subjectDao()
            val chapterDao = database.chapterDao()
            val pwDao = database.pwLectureDao()
            val examDao = database.examDao()
            val hwDao = database.homeworkDao()
            val taskDao = database.taskDao()

            userProfileDao.saveProfile(
                UserProfile(
                    id = 1,
                    name = "Aarav Sharma",
                    studentClass = "Class 10 CBSE",
                    dailyStudyHours = 4.5,
                    pwBatchName = "PW Udaan 2026",
                    targetExamDate = "2027-02-15",
                    currentStreak = 14,
                    isOnboardingCompleted = true
                )
            )

            // Subjects
            val scienceId = subjectDao.insertSubject(Subject(name = "Science", colorHex = "#2563EB", iconName = "flask"))
            val mathId = subjectDao.insertSubject(Subject(name = "Mathematics", colorHex = "#059669", iconName = "calculator"))
            val sstId = subjectDao.insertSubject(Subject(name = "Social Science", colorHex = "#D97706", iconName = "globe"))
            val engId = subjectDao.insertSubject(Subject(name = "English Language", colorHex = "#7C3AED", iconName = "book"))

            // Science Chapters
            chapterDao.insertChapter(Chapter(subjectId = scienceId, name = "Chemical Reactions & Equations", chapterNumber = 1, isCompleted = true, priority = Priority.HIGH, estimatedHours = 3.5, revisionStage = RevisionStage.FIRST_REVISION))
            chapterDao.insertChapter(Chapter(subjectId = scienceId, name = "Acids, Bases and Salts", chapterNumber = 2, isCompleted = true, priority = Priority.HIGH, estimatedHours = 4.0, revisionStage = RevisionStage.SECOND_REVISION))
            chapterDao.insertChapter(Chapter(subjectId = scienceId, name = "Metals and Non-metals", chapterNumber = 3, isCompleted = false, priority = Priority.MEDIUM, estimatedHours = 4.5))
            chapterDao.insertChapter(Chapter(subjectId = scienceId, name = "Carbon and its Compounds", chapterNumber = 4, isCompleted = false, priority = Priority.HIGH, estimatedHours = 5.5))
            chapterDao.insertChapter(Chapter(subjectId = scienceId, name = "Life Processes", chapterNumber = 5, isCompleted = true, priority = Priority.HIGH, estimatedHours = 6.0, revisionStage = RevisionStage.FIRST_REVISION))
            chapterDao.insertChapter(Chapter(subjectId = scienceId, name = "Control and Coordination", chapterNumber = 6, isCompleted = false, priority = Priority.MEDIUM, estimatedHours = 4.0))
            chapterDao.insertChapter(Chapter(subjectId = scienceId, name = "Light – Reflection and Refraction", chapterNumber = 9, isCompleted = false, priority = Priority.HIGH, estimatedHours = 5.0))
            chapterDao.insertChapter(Chapter(subjectId = scienceId, name = "Electricity", chapterNumber = 11, isCompleted = false, priority = Priority.HIGH, estimatedHours = 5.5))

            // Math Chapters
            chapterDao.insertChapter(Chapter(subjectId = mathId, name = "Real Numbers", chapterNumber = 1, isCompleted = true, priority = Priority.MEDIUM, estimatedHours = 3.0, revisionStage = RevisionStage.FINAL_REVISION))
            chapterDao.insertChapter(Chapter(subjectId = mathId, name = "Polynomials", chapterNumber = 2, isCompleted = true, priority = Priority.MEDIUM, estimatedHours = 3.5, revisionStage = RevisionStage.SECOND_REVISION))
            chapterDao.insertChapter(Chapter(subjectId = mathId, name = "Pair of Linear Equations in 2 Variables", chapterNumber = 3, isCompleted = false, priority = Priority.HIGH, estimatedHours = 4.5))
            chapterDao.insertChapter(Chapter(subjectId = mathId, name = "Quadratic Equations", chapterNumber = 4, isCompleted = false, priority = Priority.HIGH, estimatedHours = 5.0))
            chapterDao.insertChapter(Chapter(subjectId = mathId, name = "Arithmetic Progressions", chapterNumber = 5, isCompleted = true, priority = Priority.MEDIUM, estimatedHours = 4.0, revisionStage = RevisionStage.FIRST_REVISION))
            chapterDao.insertChapter(Chapter(subjectId = mathId, name = "Triangles", chapterNumber = 6, isCompleted = false, priority = Priority.HIGH, estimatedHours = 6.0))
            chapterDao.insertChapter(Chapter(subjectId = mathId, name = "Introduction to Trigonometry", chapterNumber = 8, isCompleted = false, priority = Priority.HIGH, estimatedHours = 6.5))

            // Social Science Chapters
            chapterDao.insertChapter(Chapter(subjectId = sstId, name = "Rise of Nationalism in Europe", chapterNumber = 1, isCompleted = true, priority = Priority.HIGH, estimatedHours = 4.5, revisionStage = RevisionStage.FIRST_REVISION))
            chapterDao.insertChapter(Chapter(subjectId = sstId, name = "Nationalism in India", chapterNumber = 2, isCompleted = false, priority = Priority.HIGH, estimatedHours = 5.0))
            chapterDao.insertChapter(Chapter(subjectId = sstId, name = "Resources and Development", chapterNumber = 3, isCompleted = true, priority = Priority.LOW, estimatedHours = 2.5))
            chapterDao.insertChapter(Chapter(subjectId = sstId, name = "Power Sharing", chapterNumber = 4, isCompleted = true, priority = Priority.MEDIUM, estimatedHours = 2.0))

            // English
            chapterDao.insertChapter(Chapter(subjectId = engId, name = "A Letter to God", chapterNumber = 1, isCompleted = true, priority = Priority.LOW, estimatedHours = 1.5))
            chapterDao.insertChapter(Chapter(subjectId = engId, name = "Nelson Mandela: Long Walk to Freedom", chapterNumber = 2, isCompleted = false, priority = Priority.MEDIUM, estimatedHours = 2.0))

            // PW Lectures
            pwDao.insertLecture(PWLecture(subject = "Physics", chapter = "Electricity", lectureNumber = 1, lectureTitle = "Electric Current & Circuit Basics", durationMinutes = 85, lectureDate = "2026-09-15", isCompleted = true, homeworkStatus = true))
            pwDao.insertLecture(PWLecture(subject = "Physics", chapter = "Electricity", lectureNumber = 2, lectureTitle = "Electric Potential & Potential Difference", durationMinutes = 90, lectureDate = "2026-09-16", isCompleted = true, homeworkStatus = true))
            pwDao.insertLecture(PWLecture(subject = "Physics", chapter = "Electricity", lectureNumber = 3, lectureTitle = "Ohm's Law & Resistance Factors", durationMinutes = 95, lectureDate = "2026-09-17", isCompleted = false, homeworkStatus = false))
            pwDao.insertLecture(PWLecture(subject = "Physics", chapter = "Electricity", lectureNumber = 4, lectureTitle = "Resistors in Series and Parallel", durationMinutes = 100, lectureDate = "2026-09-18", isCompleted = false, homeworkStatus = false))
            pwDao.insertLecture(PWLecture(subject = "Chemistry", chapter = "Carbon Compounds", lectureNumber = 1, lectureTitle = "Bonding in Carbon - Covalent Bond", durationMinutes = 75, lectureDate = "2026-09-17", isCompleted = true, homeworkStatus = true))
            pwDao.insertLecture(PWLecture(subject = "Chemistry", chapter = "Carbon Compounds", lectureNumber = 2, lectureTitle = "Versatile Nature & Homologous Series", durationMinutes = 85, lectureDate = "2026-09-19", isCompleted = false, homeworkStatus = false))
            pwDao.insertLecture(PWLecture(subject = "Mathematics", chapter = "Triangles", lectureNumber = 1, lectureTitle = "Basic Proportionality Theorem (BPT)", durationMinutes = 90, lectureDate = "2026-09-18", isCompleted = false, homeworkStatus = false))

            // Exams
            examDao.insertExam(Exam(name = "CBSE Class 10 Board Examinations", examDate = "2027-02-15", targetPercentage = 95, notes = "Main annual target"))
            examDao.insertExam(Exam(name = "Pre-Board 1 Exams", examDate = "2026-12-10", targetPercentage = 90, notes = "Complete syllabus revision mandatory"))

            // Homework
            hwDao.insertHomework(Homework(subjectName = "Mathematics", title = "NCERT Exercise 6.2 Triangles (Q1-Q8)", dueDate = "2026-09-20", isCompleted = false, estimatedMinutes = 45, priority = Priority.HIGH))
            hwDao.insertHomework(Homework(subjectName = "Science", title = "PW Electricity DPP 03 Resistance Numericals", dueDate = "2026-09-20", isCompleted = false, estimatedMinutes = 60, priority = Priority.HIGH))
            hwDao.insertHomework(Homework(subjectName = "Social Science", title = "Map Work: Major Soil Types of India", dueDate = "2026-09-22", isCompleted = true, estimatedMinutes = 30, priority = Priority.LOW))

            // Today's Study Tasks
            taskDao.insertTask(StudyTask(title = "PW Lecture 03: Ohm's Law & Factors", date = "2026-09-19", startTime = "17:00", endTime = "18:35", subjectName = "Science", chapterName = "Electricity", taskType = TaskType.PW_LECTURE, isCompleted = true, priority = Priority.HIGH))
            taskDao.insertTask(StudyTask(title = "Solve NCERT Intext Questions (Ohm's Law)", date = "2026-09-19", startTime = "18:45", endTime = "19:30", subjectName = "Science", chapterName = "Electricity", taskType = TaskType.PRACTICE, isCompleted = false, priority = Priority.HIGH))
            taskDao.insertTask(StudyTask(title = "Math BPT Proof & Theorem Practice", date = "2026-09-19", startTime = "19:45", endTime = "21:00", subjectName = "Mathematics", chapterName = "Triangles", taskType = TaskType.NEW_LEARNING, isCompleted = false, priority = Priority.HIGH))
            taskDao.insertTask(StudyTask(title = "Chemical Reactions Chapter 1 Revision", date = "2026-09-19", startTime = "21:30", endTime = "22:15", subjectName = "Science", chapterName = "Chemical Reactions", taskType = TaskType.REVISION, isCompleted = false, priority = Priority.MEDIUM))
        }
    }
}
