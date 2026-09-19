package com.studyosai.app.engine

import com.studyosai.app.data.model.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

data class TimetableConfig(
    val startDate: LocalDate = LocalDate.now(),
    val numberOfDays: Int = 7,
    val dailyHours: Double = 4.5,
    val schoolEndTime: String = "14:00",
    val sleepTime: String = "23:00",
    val prioritizePWBacklog: Boolean = true
)

object TimetableGenerator {

    fun generateSessions(
        config: TimetableConfig,
        subjects: List<Subject>,
        chapters: List<Chapter>,
        pwLectures: List<PWLecture>,
        homeworkList: List<Homework>
    ): List<StudyTask> {
        val tasks = mutableListOf<StudyTask>()
        val pendingChapters = chapters.filter { !it.isCompleted }
            .sortedWith(
                compareBy(
                    { it.priority != Priority.HIGH },
                    { it.priority != Priority.MEDIUM },
                    { it.chapterNumber }
                )
            )
            .toMutableList()

        val pendingLectures = pwLectures.filter { !it.isCompleted }.toMutableList()
        val pendingHomework = homeworkList.filter { !it.isCompleted }.toMutableList()

        val subjectMap = subjects.associateBy { it.id }
        val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE

        for (dayOffset in 0 until config.numberOfDays) {
            val currentDate = config.startDate.plusDays(dayOffset.toLong())
            val dateStr = currentDate.format(dateFormatter)

            // Daily study slots (Evening routine for Class 10 student)
            // Slot 1: 17:00 - 18:30 (1.5h) - PW Lecture or High-Priority New Learning
            // Slot 2: 18:45 - 19:45 (1.0h) - Practice / Homework
            // Slot 3: 20:00 - 21:00 (1.0h) - High Priority Subject Chapter
            // Slot 4: 21:15 - 22:00 (0.75h) - Revision / Formula Recap

            // Slot 1
            if (config.prioritizePWBacklog && pendingLectures.isNotEmpty()) {
                val lecture = pendingLectures.removeAt(0)
                tasks.add(
                    StudyTask(
                        title = "PW [${lecture.subject}]: ${lecture.lectureTitle}",
                        date = dateStr,
                        startTime = "17:00",
                        endTime = "18:30",
                        subjectName = lecture.subject,
                        chapterName = lecture.chapter,
                        taskType = TaskType.PW_LECTURE,
                        priority = Priority.HIGH,
                        notes = "Lecture #${lecture.lectureNumber}. Maintain clean formula sheets."
                    )
                )
            } else if (pendingChapters.isNotEmpty()) {
                val chapter = pendingChapters.removeAt(0)
                val subjectName = subjectMap[chapter.subjectId]?.name ?: "Science"
                tasks.add(
                    StudyTask(
                        title = "Concept Master: ${chapter.name}",
                        date = dateStr,
                        startTime = "17:00",
                        endTime = "18:30",
                        subjectName = subjectName,
                        chapterName = chapter.name,
                        taskType = TaskType.NEW_LEARNING,
                        priority = chapter.priority,
                        notes = "Read NCERT line-by-line and mark key definitions."
                    )
                )
            }

            // Slot 2: Homework or Practice
            if (pendingHomework.isNotEmpty()) {
                val hw = pendingHomework.removeAt(0)
                tasks.add(
                    StudyTask(
                        title = "HW: ${hw.title}",
                        date = dateStr,
                        startTime = "18:45",
                        endTime = "19:45",
                        subjectName = hw.subjectName,
                        chapterName = "Assignments",
                        taskType = TaskType.HOMEWORK,
                        priority = hw.priority,
                        notes = "Target errorless problem solving."
                    )
                )
            } else if (pendingChapters.isNotEmpty()) {
                val chapter = pendingChapters.firstOrNull() ?: chapters.first()
                val subjectName = subjectMap[chapter.subjectId]?.name ?: "Mathematics"
                tasks.add(
                    StudyTask(
                        title = "NCERT Exemplar Practice: ${chapter.name}",
                        date = dateStr,
                        startTime = "18:45",
                        endTime = "19:45",
                        subjectName = subjectName,
                        chapterName = chapter.name,
                        taskType = TaskType.PRACTICE,
                        priority = Priority.MEDIUM,
                        notes = "Solve 8-10 standard numericals/questions."
                    )
                )
            }

            // Slot 3: Deep study session
            if (pendingChapters.isNotEmpty()) {
                val chapter = pendingChapters.removeAt(0)
                val subjectName = subjectMap[chapter.subjectId]?.name ?: "Social Science"
                tasks.add(
                    StudyTask(
                        title = "Study: ${chapter.name}",
                        date = dateStr,
                        startTime = "20:00",
                        endTime = "21:00",
                        subjectName = subjectName,
                        chapterName = chapter.name,
                        taskType = TaskType.NEW_LEARNING,
                        priority = chapter.priority,
                        notes = "High-weightage topic for board exams."
                    )
                )
            }

            // Slot 4: Revision
            val completedChapter = chapters.firstOrNull { it.isCompleted }
            val revName = completedChapter?.name ?: "Previous Formulas"
            val revSubject = completedChapter?.let { subjectMap[it.subjectId]?.name } ?: "General"
            tasks.add(
                StudyTask(
                    title = "Active Recall & Revision: $revName",
                    date = dateStr,
                    startTime = "21:15",
                    endTime = "22:00",
                    subjectName = revSubject,
                    chapterName = revName,
                    taskType = TaskType.REVISION,
                    priority = Priority.MEDIUM,
                    notes = "Self-quiz on essential diagrams and formulas."
                )
            )
        }

        return tasks
    }
}
