package com.studyosai.app.data.local

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

    @Query("DELETE FROM subjects WHERE id = :subjectId")
    suspend fun deleteSubjectById(subjectId: Long)
}

@Dao
interface ChapterDao {
    @Query("SELECT * FROM chapters ORDER BY chapterNumber ASC")
    fun getAllChapters(): Flow<List<Chapter>>

    @Query("SELECT * FROM chapters WHERE subjectId = :subjectId ORDER BY chapterNumber ASC")
    fun getChaptersForSubject(subjectId: Long): Flow<List<Chapter>>

    @Query("SELECT * FROM chapters WHERE isCompleted = 1")
    fun getCompletedChapters(): Flow<List<Chapter>>

    @Query("SELECT * FROM chapters WHERE isCompleted = 0")
    fun getPendingChapters(): Flow<List<Chapter>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertChapter(chapter: Chapter): Long

    @Update
    suspend fun updateChapter(chapter: Chapter)

    @Query("UPDATE chapters SET isCompleted = :completed WHERE id = :chapterId")
    suspend fun updateCompletionStatus(chapterId: Long, completed: Boolean)

    @Delete
    suspend fun deleteChapter(chapter: Chapter)
}

@Dao
interface TaskDao {
    @Query("SELECT * FROM study_tasks ORDER BY date ASC, startTime ASC")
    fun getAllTasks(): Flow<List<StudyTask>>

    @Query("SELECT * FROM study_tasks WHERE date = :date ORDER BY startTime ASC")
    fun getTasksForDate(date: String): Flow<List<StudyTask>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: StudyTask): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTasks(tasks: List<StudyTask>)

    @Update
    suspend fun updateTask(task: StudyTask)

    @Query("UPDATE study_tasks SET isCompleted = :completed WHERE id = :taskId")
    suspend fun setTaskCompleted(taskId: Long, completed: Boolean)

    @Delete
    suspend fun deleteTask(task: StudyTask)

    @Query("DELETE FROM study_tasks WHERE date >= :startDate")
    suspend fun deleteFutureTasks(startDate: String)
}

@Dao
interface PWLectureDao {
    @Query("SELECT * FROM pw_lectures ORDER BY lectureDate DESC, lectureNumber DESC")
    fun getAllLectures(): Flow<List<PWLecture>>

    @Query("SELECT * FROM pw_lectures WHERE isCompleted = 0 ORDER BY lectureDate ASC")
    fun getPendingLectures(): Flow<List<PWLecture>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLecture(lecture: PWLecture): Long

    @Update
    suspend fun updateLecture(lecture: PWLecture)

    @Query("UPDATE pw_lectures SET isCompleted = :completed WHERE id = :lectureId")
    suspend fun setLectureCompleted(lectureId: Long, completed: Boolean)

    @Query("UPDATE pw_lectures SET homeworkStatus = :hwDone WHERE id = :lectureId")
    suspend fun setHomeworkCompleted(lectureId: Long, hwDone: Boolean)

    @Delete
    suspend fun deleteLecture(lecture: PWLecture)
}

@Dao
interface ExamDao {
    @Query("SELECT * FROM exams ORDER BY examDate ASC")
    fun getAllExams(): Flow<List<Exam>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExam(exam: Exam): Long

    @Update
    suspend fun updateExam(exam: Exam)

    @Delete
    suspend fun deleteExam(exam: Exam)
}

@Dao
interface RevisionDao {
    @Query("SELECT * FROM revisions ORDER BY scheduledDate ASC")
    fun getAllRevisions(): Flow<List<Revision>>

    @Query("SELECT * FROM revisions WHERE scheduledDate = :date AND isCompleted = 0")
    fun getRevisionsForDate(date: String): Flow<List<Revision>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRevision(revision: Revision): Long

    @Update
    suspend fun updateRevision(revision: Revision)

    @Query("UPDATE revisions SET isCompleted = :completed WHERE id = :revisionId")
    suspend fun setRevisionCompleted(revisionId: Long, completed: Boolean)

    @Delete
    suspend fun deleteRevision(revision: Revision)
}

@Dao
interface HomeworkDao {
    @Query("SELECT * FROM homework ORDER BY dueDate ASC")
    fun getAllHomework(): Flow<List<Homework>>

    @Query("SELECT * FROM homework WHERE isCompleted = 0 ORDER BY dueDate ASC")
    fun getPendingHomework(): Flow<List<Homework>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHomework(hw: Homework): Long

    @Update
    suspend fun updateHomework(hw: Homework)

    @Query("UPDATE homework SET isCompleted = :completed WHERE id = :hwId")
    suspend fun setHomeworkCompleted(hwId: Long, completed: Boolean)

    @Delete
    suspend fun deleteHomework(hw: Homework)
}

@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profile WHERE id = 1")
    fun getUserProfile(): Flow<UserProfile?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveProfile(profile: UserProfile)
}
