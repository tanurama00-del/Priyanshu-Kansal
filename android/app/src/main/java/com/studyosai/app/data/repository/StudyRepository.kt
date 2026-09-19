package com.studyosai.app.data.repository

import com.studyosai.app.data.local.AppDatabase
import com.studyosai.app.data.model.*
import kotlinx.coroutines.flow.Flow

class StudyRepository(private val database: AppDatabase) {

    // User Profile
    val userProfile: Flow<UserProfile?> = database.userProfileDao().getUserProfile()
    suspend fun saveProfile(profile: UserProfile) = database.userProfileDao().saveProfile(profile)

    // Subjects
    val allSubjects: Flow<List<Subject>> = database.subjectDao().getAllSubjects()
    suspend fun insertSubject(subject: Subject) = database.subjectDao().insertSubject(subject)
    suspend fun deleteSubject(subject: Subject) = database.subjectDao().deleteSubject(subject)

    // Chapters
    val allChapters: Flow<List<Chapter>> = database.chapterDao().getAllChapters()
    fun getChaptersForSubject(subjectId: Long): Flow<List<Chapter>> = database.chapterDao().getChaptersForSubject(subjectId)
    suspend fun insertChapter(chapter: Chapter) = database.chapterDao().insertChapter(chapter)
    suspend fun updateChapter(chapter: Chapter) = database.chapterDao().updateChapter(chapter)
    suspend fun setChapterCompletion(chapterId: Long, completed: Boolean) = database.chapterDao().updateCompletionStatus(chapterId, completed)
    suspend fun deleteChapter(chapter: Chapter) = database.chapterDao().deleteChapter(chapter)

    // Study Tasks
    val allTasks: Flow<List<StudyTask>> = database.taskDao().getAllTasks()
    fun getTasksForDate(date: String): Flow<List<StudyTask>> = database.taskDao().getTasksForDate(date)
    suspend fun insertTask(task: StudyTask) = database.taskDao().insertTask(task)
    suspend fun insertTasks(tasks: List<StudyTask>) = database.taskDao().insertTasks(tasks)
    suspend fun updateTask(task: StudyTask) = database.taskDao().updateTask(task)
    suspend fun setTaskCompleted(taskId: Long, completed: Boolean) = database.taskDao().setTaskCompleted(taskId, completed)
    suspend fun deleteTask(task: StudyTask) = database.taskDao().deleteTask(task)
    suspend fun deleteFutureTasks(startDate: String) = database.taskDao().deleteFutureTasks(startDate)

    // PW Lectures
    val allPWLectures: Flow<List<PWLecture>> = database.pwLectureDao().getAllLectures()
    suspend fun insertPWLecture(lecture: PWLecture) = database.pwLectureDao().insertLecture(lecture)
    suspend fun updatePWLecture(lecture: PWLecture) = database.pwLectureDao().updateLecture(lecture)
    suspend fun setPWLectureCompleted(lectureId: Long, completed: Boolean) = database.pwLectureDao().setLectureCompleted(lectureId, completed)
    suspend fun setPWLectureHomeworkStatus(lectureId: Long, hwDone: Boolean) = database.pwLectureDao().setHomeworkCompleted(lectureId, hwDone)
    suspend fun deletePWLecture(lecture: PWLecture) = database.pwLectureDao().deleteLecture(lecture)

    // Exams
    val allExams: Flow<List<Exam>> = database.examDao().getAllExams()
    suspend fun insertExam(exam: Exam) = database.examDao().insertExam(exam)
    suspend fun updateExam(exam: Exam) = database.examDao().updateExam(exam)
    suspend fun deleteExam(exam: Exam) = database.examDao().deleteExam(exam)

    // Revisions
    val allRevisions: Flow<List<Revision>> = database.revisionDao().getAllRevisions()
    suspend fun insertRevision(revision: Revision) = database.revisionDao().insertRevision(revision)
    suspend fun setRevisionCompleted(revisionId: Long, completed: Boolean) = database.revisionDao().setRevisionCompleted(revisionId, completed)
    suspend fun deleteRevision(revision: Revision) = database.revisionDao().deleteRevision(revision)

    // Homework
    val allHomework: Flow<List<Homework>> = database.homeworkDao().getAllHomework()
    suspend fun insertHomework(hw: Homework) = database.homeworkDao().insertHomework(hw)
    suspend fun updateHomework(hw: Homework) = database.homeworkDao().updateHomework(hw)
    suspend fun setHomeworkCompleted(hwId: Long, completed: Boolean) = database.homeworkDao().setHomeworkCompleted(hwId, completed)
    suspend fun deleteHomework(hw: Homework) = database.homeworkDao().deleteHomework(hw)

    suspend fun resetWithDemoData() {
        database.clearAllTables()
        AppDatabase.populateInitialClass10Data(database)
    }
}
