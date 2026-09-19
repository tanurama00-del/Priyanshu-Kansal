package com.studyosai.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val selectedIcon: ImageVector, val unselectedIcon: ImageVector) {
    object Home : Screen("home", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    object Syllabus : Screen("syllabus", "Syllabus", Icons.Filled.MenuBook, Icons.Outlined.MenuBook)
    object Timetable : Screen("timetable", "Timetable", Icons.Filled.CalendarMonth, Icons.Outlined.CalendarMonth)
    object PwBatch : Screen("pw_batch", "PW Batch", Icons.Filled.PlayCircle, Icons.Outlined.PlayCircle)
    object AiCoach : Screen("ai_coach", "AI Coach", Icons.Filled.Psychology, Icons.Outlined.Psychology)
    object Today : Screen("today", "Today", Icons.Filled.Today, Icons.Outlined.Today)
    object ExamCountdown : Screen("exam_countdown", "Exams", Icons.Filled.Timer, Icons.Outlined.Timer)
    object Backlog : Screen("backlog", "Backlog", Icons.Filled.Warning, Icons.Outlined.Warning)
    object Analytics : Screen("analytics", "Analytics", Icons.Filled.BarChart, Icons.Outlined.BarChart)
    object Settings : Screen("settings", "Settings", Icons.Filled.Settings, Icons.Outlined.Settings)
    object Onboarding : Screen("onboarding", "Setup", Icons.Filled.Person, Icons.Outlined.Person)

    companion object {
        val bottomNavItems = listOf(Home, Syllabus, Timetable, PwBatch, AiCoach)
    }
}
