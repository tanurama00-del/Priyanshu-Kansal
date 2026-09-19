package com.studyosai.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.studyosai.app.data.model.*
import com.studyosai.app.data.repository.StudyRepository
import com.studyosai.app.engine.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val sender: String, // "user" or "coach"
    val message: String,
    val timestamp: String = "Just now"
)

class MainViewModel(private val repository: StudyRepository) : ViewModel() {

    private val aiEngine = AiCoachEngine()

    val profile: StateFlow<UserProfile> = repository.userProfile
        .map { it ?: UserProfile() }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), UserProfile())

    val subjects: StateFlow<List<Subject>> = repository.allSubjects
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val chapters: StateFlow<List<Chapter>> = repository.allChapters
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val tasks: StateFlow<List<StudyTask>> = repository.allTasks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val pwLectures: StateFlow<List<PWLecture>> = repository.allPWLectures
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val exams: StateFlow<List<Exam>> = repository.allExams
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val revisions: StateFlow<List<Revision>> = repository.allRevisions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val homework: StateFlow<List<Homework>> = repository.allHomework
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(
                sender = "coach",
                message = "Namaste! I'm your StudyOS AI Coach. I analyze your Class 10 CBSE syllabus, PW backlog, homework, and exam countdown to build your daily study targets. What would you like guidance on today?"
            )
        )
    )
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isAiThinking = MutableStateFlow(false)
    val isAiThinking: StateFlow<Boolean> = _isAiThinking.asStateFlow()

    // Calculated Dashboard Stats
    val totalChaptersCount: StateFlow<Int> = chapters.map { it.size }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val completedChaptersCount: StateFlow<Int> = chapters.map { list -> list.count { it.isCompleted } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val syllabusProgressPercentage: StateFlow<Int> = chapters.map { list ->
        if (list.isEmpty()) 0 else ((list.count { it.isCompleted }.toDouble() / list.size) * 100).toInt()
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val pwTotalCount: StateFlow<Int> = pwLectures.map { it.size }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val pwCompletedCount: StateFlow<Int> = pwLectures.map { list -> list.count { it.isCompleted } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val pendingHomeworkCount: StateFlow<Int> = homework.map { list -> list.count { !it.isCompleted } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val backlogCount: StateFlow<Int> = combine(chapters, pwLectures, homework) { c, pw, hw ->
        val pendingHighPriorityChapters = c.count { !it.isCompleted && it.priority == Priority.HIGH }
        val pendingPw = pw.count { !it.isCompleted }
        val pendingH = hw.count { !it.isCompleted }
        pendingHighPriorityChapters + pendingPw + pendingH
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val todayTasks: StateFlow<List<StudyTask>> = tasks.map { list ->
        val todayStr = try { LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE) } catch (e: Exception) { "2026-09-19" }
        list.filter { it.date == todayStr || it.date.isEmpty() }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val todayCompletionPercentage: StateFlow<Int> = todayTasks.map { list ->
        if (list.isEmpty()) 0 else ((list.count { it.isCompleted }.toDouble() / list.size) * 100).toInt()
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // Actions
    fun toggleChapterCompletion(chapter: Chapter) {
        viewModelScope.launch {
            val newStatus = !chapter.isCompleted
            repository.setChapterCompletion(chapter.id, newStatus)
            if (newStatus && chapter.revisionStage == RevisionStage.NONE) {
                // Automatically schedule first revision for 3 days later
                val nextRevDate = try {
                    LocalDate.now().plusDays(3).format(DateTimeFormatter.ISO_LOCAL_DATE)
                } catch (e: Exception) { "2026-09-22" }
                repository.insertRevision(
                    Revision(
                        chapterId = chapter.id,
                        chapterName = chapter.name,
                        subjectName = "Class 10",
                        stage = RevisionStage.FIRST_REVISION,
                        scheduledDate = nextRevDate
                    )
                )
            }
        }
    }

    fun addChapter(subjectId: Long, name: String, priority: Priority, estimatedHours: Double) {
        viewModelScope.launch {
            val currentList = chapters.value.filter { it.subjectId == subjectId }
            repository.insertChapter(
                Chapter(
                    subjectId = subjectId,
                    name = name,
                    chapterNumber = currentList.size + 1,
                    priority = priority,
                    estimatedHours = estimatedHours
                )
            )
        }
    }

    fun deleteChapter(chapter: Chapter) {
        viewModelScope.launch { repository.deleteChapter(chapter) }
    }

    fun addSubject(name: String, colorHex: String) {
        viewModelScope.launch { repository.insertSubject(Subject(name = name, colorHex = colorHex)) }
    }

    fun deleteSubject(subject: Subject) {
        viewModelScope.launch { repository.deleteSubject(subject) }
    }

    fun toggleTaskCompletion(task: StudyTask) {
        viewModelScope.launch {
            repository.setTaskCompleted(task.id, !task.isCompleted)
        }
    }

    fun addTask(task: StudyTask) {
        viewModelScope.launch { repository.insertTask(task) }
    }

    fun deleteTask(task: StudyTask) {
        viewModelScope.launch { repository.deleteTask(task) }
    }

    fun togglePWLecture(lecture: PWLecture) {
        viewModelScope.launch {
            repository.setPWLectureCompleted(lecture.id, !lecture.isCompleted)
        }
    }

    fun togglePWHomework(lecture: PWLecture) {
        viewModelScope.launch {
            repository.setPWLectureHomeworkStatus(lecture.id, !lecture.homeworkStatus)
        }
    }

    fun addPWLecture(lecture: PWLecture) {
        viewModelScope.launch { repository.insertPWLecture(lecture) }
    }

    fun deletePWLecture(lecture: PWLecture) {
        viewModelScope.launch { repository.deletePWLecture(lecture) }
    }

    fun toggleHomeworkCompletion(hw: Homework) {
        viewModelScope.launch {
            repository.setHomeworkCompleted(hw.id, !hw.isCompleted)
        }
    }

    fun addHomework(hw: Homework) {
        viewModelScope.launch { repository.insertHomework(hw) }
    }

    fun deleteHomework(hw: Homework) {
        viewModelScope.launch { repository.deleteHomework(hw) }
    }

    fun addExam(exam: Exam) {
        viewModelScope.launch { repository.insertExam(exam) }
    }

    fun deleteExam(exam: Exam) {
        viewModelScope.launch { repository.deleteExam(exam) }
    }

    fun generateSmartTimetable() {
        viewModelScope.launch {
            val userProf = profile.value
            val config = TimetableConfig(
                numberOfDays = 7,
                dailyHours = userProf.dailyStudyHours,
                prioritizePWBacklog = true
            )
            val generated = TimetableGenerator.generateSessions(
                config = config,
                subjects = subjects.value,
                chapters = chapters.value,
                pwLectures = pwLectures.value,
                homeworkList = homework.value
            )
            repository.insertTasks(generated)
        }
    }

    fun sendAiPrompt(query: String) {
        if (query.isBlank()) return
        val userMsg = ChatMessage(sender = "user", message = query)
        _chatMessages.update { it + userMsg }

        viewModelScope.launch {
            _isAiThinking.value = true
            val analysis = aiEngine.analyze(
                chapters = chapters.value,
                pwLectures = pwLectures.value,
                homework = homework.value,
                examDateStr = profile.value.targetExamDate,
                targetDailyHours = profile.value.dailyStudyHours
            )
            val responseText = aiEngine.getAdvice(query, analysis)
            val coachMsg = ChatMessage(sender = "coach", message = responseText)
            _chatMessages.update { it + coachMsg }
            _isAiThinking.value = false
        }
    }

    fun updateProfile(updated: UserProfile) {
        viewModelScope.launch { repository.saveProfile(updated) }
    }

    fun resetDemoData() {
        viewModelScope.launch { repository.resetWithDemoData() }
    }
}

class MainViewModelFactory(private val repository: StudyRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return MainViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
