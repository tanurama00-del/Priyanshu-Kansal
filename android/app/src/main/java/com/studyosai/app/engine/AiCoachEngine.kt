package com.studyosai.app.engine

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

interface StudyCoachService {
    suspend fun generateAdvice(query: String, context: CoachAnalysis): String
}

class LocalRuleBasedCoachService : StudyCoachService {
    override suspend fun generateAdvice(query: String, context: CoachAnalysis): String {
        val q = query.lowercase().trim()
        val highPriorityNames = context.highPriorityPending.take(3).joinToString(", ") { it.name }

        return when {
            q.contains("today") || q.contains("what to study") -> {
                buildString {
                    append("🎯 **Target for Today**:\n\n")
                    if (context.highPriorityPending.isNotEmpty()) {
                        append("1. Primary Focus: Study high-priority chapter **${context.highPriorityPending.first().name}** (Allocated: 2.0 hrs).\n")
                    } else {
                        append("1. Primary Focus: Pick up next pending syllabus chapter.\n")
                    }
                    if (context.pwBacklogCount > 0) {
                        append("2. PW Backlog Sprint: Clear at least 1 pending lecture today (${context.pwBacklogCount} backlog lectures total).\n")
                    }
                    if (context.pendingHomeworkCount > 0) {
                        append("3. Homework: Finish pending homework/DPP before 21:00.\n")
                    }
                    append("4. Quick Revision: Spend 30 mins recalling previous formulas.\n\n")
                    append("Recommended target study hours today: **${String.format("%.1f", context.requiredDailyHours)} hours**.")
                }
            }
            q.contains("backlog") || q.contains("pw") -> {
                buildString {
                    append("⚡ **Backlog Clearance Strategy**:\n\n")
                    append("You currently have **${context.pwBacklogCount} pending PW lectures** and **${context.pendingHomeworkCount} pending homework items**.\n\n")
                    append("• **Rule 1 (Stop New Backlog)**: Attend today's live lecture on time so you don't accumulate more.\n")
                    append("• **Rule 2 (1.25x Speed)**: Watch backlog theory lectures at 1.25x speed with concise notes.\n")
                    append("• **Rule 3 (Weekend Buffer)**: Reserve Sunday mornings (8 AM - 12 PM) solely for backlog annihilation.\n")
                    append("• Top pending priority: Watch high-weightage topics first before minor theoretical chapters.")
                }
            }
            q.contains("behind") || q.contains("schedule") || q.contains("status") -> {
                buildString {
                    if (context.isBehindSchedule) {
                        append("⚠️ **Pacing Alert**: You are currently slightly behind ideal pace for your Class 10 Board exam (${context.daysUntilExam} days left).\n\n")
                        append("With ${context.totalPendingChapters} chapters remaining, you need to cover approximately **${String.format("%.2f", context.totalPendingChapters.toDouble() / maxOf(1, context.daysUntilExam / 7))} chapters per week**.\n\n")
                        append("Increase your daily study time by 45–60 minutes to re-align with your 95% target.")
                    } else {
                        append("✅ **Great Pacing**: You are on track! With ${context.daysUntilExam} days remaining, your steady progress covers the syllabus comfortably with adequate buffer for 3 revision cycles.")
                    }
                }
            }
            q.contains("revise") || q.contains("revision") -> {
                buildString {
                    append("🧠 **Spaced Repetition Protocol**:\n\n")
                    append("For Class 10 CBSE, revision is the difference between 80% and 95%+:\n")
                    append("• **Stage 1 (Day 1)**: Active recall + summarize notes immediately after completing the chapter.\n")
                    append("• **Stage 2 (Day 7)**: Solve 10 PYQs (Previous Year Questions) and NCERT Exemplar.\n")
                    append("• **Stage 3 (Day 21)**: Formula test and high-frequency numericals without reference.\n")
                    append("• **Stage 4 (Day 60)**: Full timed chapter test with board presentation style.")
                }
            }
            else -> {
                buildString {
                    append("🤖 **AI Study Coach Recommendation**:\n\n")
                    append("Based on your syllabus state:\n")
                    append("• Remaining days to exam: **${context.daysUntilExam} days**\n")
                    append("• High priority pending chapters: **$highPriorityNames**\n")
                    append("• Daily study requirement: **${String.format("%.1f", context.requiredDailyHours)} hours/day**\n\n")
                    append("Actionable tip: Focus strictly on deep-work blocks of 50 minutes with 10-minute active breaks. Start with Math/Physics when your mind is fresh in the morning or early evening!")
                }
            }
        }
    }
}

/**
 * Cloud LLM implementation stub.
 * Note: Never store private keys in the APK!
 * This class illustrates how the client connects securely through an authenticated
 * backend endpoint (e.g., https://your-server.com/api/ai/coach) which holds the Gemini API Key.
 */
class SecureBackendCoachService(private val backendUrl: String, private val authToken: String) : StudyCoachService {
    override suspend fun generateAdvice(query: String, context: CoachAnalysis): String {
        // Sends context + query to secure backend proxy
        // Returns server-generated Gemini response
        return LocalRuleBasedCoachService().generateAdvice(query, context)
    }
}

class AiCoachEngine(private val coachService: StudyCoachService = LocalRuleBasedCoachService()) {

    fun analyze(
        chapters: List<Chapter>,
        pwLectures: List<PWLecture>,
        homework: List<Homework>,
        examDateStr: String,
        targetDailyHours: Double
    ): CoachAnalysis {
        val totalChapters = chapters.size
        val completedChapters = chapters.count { it.isCompleted }
        val pendingChapters = chapters.filter { !it.isCompleted }
        val highPriorityPending = pendingChapters.filter { it.priority == Priority.HIGH }

        val today = try { LocalDate.now() } catch (e: Exception) { LocalDate.of(2026, 9, 19) }
        val examDate = try {
            LocalDate.parse(examDateStr)
        } catch (e: Exception) {
            today.plusMonths(5)
        }
        val daysUntil = maxOf(1L, ChronoUnit.DAYS.between(today, examDate))

        val pwBacklog = pwLectures.count { !it.isCompleted }
        val pendingHw = homework.count { !it.isCompleted }

        val remainingStudyHours = pendingChapters.sumOf { it.estimatedHours } + (pwBacklog * 1.5)
        val calculatedDailyHours = maxOf(targetDailyHours, remainingStudyHours / daysUntil)

        val isBehind = (pendingChapters.size.toDouble() / maxOf(1, totalChapters)) > 0.5 && daysUntil < 120

        val focus = if (highPriorityPending.isNotEmpty()) {
            "Master high-yield chapter '${highPriorityPending.first().name}' & finish PW lecture backlog"
        } else {
            "Complete revision cycle and solve 5-year board question papers"
        }

        val steps = mutableListOf<String>()
        if (highPriorityPending.isNotEmpty()) {
            steps.add("Complete ${highPriorityPending.first().name} (High Priority)")
        }
        if (pwBacklog > 0) {
            steps.add("Clear 1 PW Lecture from backlog today")
        }
        if (pendingHw > 0) {
            steps.add("Submit pending homework before 9 PM")
        }
        steps.add("Do 30 minutes formula revision before sleep")

        val summary = if (isBehind) {
            "Pacing warning: ${pendingChapters.size} chapters pending with $daysUntil days left. Accelerate with focused 4.5+ hr daily sessions."
        } else {
            "Healthy pace: $completedChapters/$totalChapters chapters completed. Maintain your study rhythm!"
        }

        return CoachAnalysis(
            statusSummary = summary,
            isBehindSchedule = isBehind,
            daysUntilExam = daysUntil,
            totalPendingChapters = pendingChapters.size,
            highPriorityPending = highPriorityPending,
            pwBacklogCount = pwBacklog,
            pendingHomeworkCount = pendingHw,
            requiredDailyHours = calculatedDailyHours,
            recommendedTodayFocus = focus,
            immediateActionSteps = steps
        )
    }

    suspend fun getAdvice(query: String, analysis: CoachAnalysis): String {
        return coachService.generateAdvice(query, analysis)
    }
}
