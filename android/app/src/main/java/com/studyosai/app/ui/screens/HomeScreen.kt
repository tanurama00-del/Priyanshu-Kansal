package com.studyosai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.studyosai.app.data.model.StudyTask
import com.studyosai.app.ui.theme.*
import com.studyosai.app.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    onNavigateToSyllabus: () -> Unit,
    onNavigateToTimetable: () -> Unit,
    onNavigateToPW: () -> Unit,
    onNavigateToAiCoach: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToExams: () -> Unit,
    onNavigateToBacklog: () -> Unit,
    onNavigateToAnalytics: () -> Unit
) {
    val profile by viewModel.profile.collectAsState()
    val syllabusProgress by viewModel.syllabusProgressPercentage.collectAsState()
    val completedChapters by viewModel.completedChaptersCount.collectAsState()
    val totalChapters by viewModel.totalChaptersCount.collectAsState()
    val pwCompleted by viewModel.pwCompletedCount.collectAsState()
    val pwTotal by viewModel.pwTotalCount.collectAsState()
    val pendingHw by viewModel.pendingHomeworkCount.collectAsState()
    val backlogCount by viewModel.backlogCount.collectAsState()
    val todayTasks by viewModel.todayTasks.collectAsState()

    var showQuickAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "StudyOS AI",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryBlue
                        )
                        Text(
                            text = "Welcome back, ${profile.name} • ${profile.studentClass}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Slate600
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToAnalytics) {
                        Icon(Icons.Outlined.BarChart, contentDescription = "Analytics", tint = Slate700)
                    }
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Outlined.Settings, contentDescription = "Settings", tint = Slate700)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Hero Status Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = PrimaryBlue)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Class 10 Board Countdown",
                                    color = Color.White.copy(alpha = 0.85f),
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Medium
                                )
                                Text(
                                    text = "149 Days Left",
                                    color = Color.White,
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color.White.copy(alpha = 0.2f),
                                modifier = Modifier.clickable { onNavigateToExams() }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Filled.LocalFireDepartment, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = "${profile.currentStreak} Day Streak", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Syllabus progress bar
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Overall Syllabus Covered", color = Color.White, fontSize = 13.sp)
                            Text(text = "$syllabusProgress%", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        LinearProgressIndicator(
                            progress = { syllabusProgress / 100f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = Color(0xFF60A5FA),
                            trackColor = Color.White.copy(alpha = 0.25f)
                        )
                    }
                }
            }

            // Quick Stats Grid
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatMetricCard(
                        title = "Chapters",
                        value = "$completedChapters/$totalChapters",
                        subtitle = "Target: 100%",
                        icon = Icons.Filled.MenuBook,
                        color = EmeraldGreen,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToSyllabus
                    )
                    StatMetricCard(
                        title = "PW Lectures",
                        value = "$pwCompleted/$pwTotal",
                        subtitle = profile.pwBatchName,
                        icon = Icons.Filled.PlayCircle,
                        color = PwPurple,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToPW
                    )
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatMetricCard(
                        title = "Backlog Items",
                        value = "$backlogCount",
                        subtitle = "Needs clearance",
                        icon = Icons.Filled.Warning,
                        color = if (backlogCount > 0) RoseDanger else EmeraldGreen,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToBacklog
                    )
                    StatMetricCard(
                        title = "Pending HW",
                        value = "$pendingHw",
                        subtitle = "Due this week",
                        icon = Icons.Filled.Assignment,
                        color = AmberWarning,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToTimetable
                    )
                }
            }

            // Quick Action Buttons
            item {
                Text(
                    text = "Quick Actions",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Slate900
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    ActionButton(label = "Add Chapter", icon = Icons.Filled.Add, color = PrimaryBlue, modifier = Modifier.weight(1f)) {
                        onNavigateToSyllabus()
                    }
                    ActionButton(label = "Add Lecture", icon = Icons.Filled.VideoCall, color = PwPurple, modifier = Modifier.weight(1f)) {
                        onNavigateToPW()
                    }
                    ActionButton(label = "Gen Timetable", icon = Icons.Filled.Autorenew, color = EmeraldGreen, modifier = Modifier.weight(1f)) {
                        viewModel.generateSmartTimetable()
                        onNavigateToTimetable()
                    }
                    ActionButton(label = "Ask AI Coach", icon = Icons.Filled.Psychology, color = Color(0xFF4F46E5), modifier = Modifier.weight(1f)) {
                        onNavigateToAiCoach()
                    }
                }
            }

            // Today's Study Sessions Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Today's Study Plan",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Slate900
                        )
                        Text(
                            text = "Target: ${profile.dailyStudyHours} hours",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Slate600
                        )
                    }
                    TextButton(onClick = onNavigateToTimetable) {
                        Text("Full Timetable")
                    }
                }
            }

            // Today's Task Items
            if (todayTasks.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Slate100)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(text = "No study sessions scheduled for today.", color = Slate600)
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(onClick = { viewModel.generateSmartTimetable() }) {
                                Text("Auto-Generate Plan")
                            }
                        }
                    }
                }
            } else {
                items(todayTasks) { task ->
                    TaskCard(
                        task = task,
                        onToggle = { viewModel.toggleTaskCompletion(task) },
                        onDelete = { viewModel.deleteTask(task) }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
fun StatMetricCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Slate100)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .background(color.copy(alpha = 0.15f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(text = value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Slate900)
            Text(text = title, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Slate700)
            Text(text = subtitle, fontSize = 11.sp, color = Slate600, maxLines = 1)
        }
    }
}

@Composable
fun ActionButton(
    label: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(containerColor = color),
        contentPadding = PaddingValues(vertical = 10.dp, horizontal = 4.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, maxLines = 1)
        }
    }
}

@Composable
fun TaskCard(
    task: StudyTask,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (task.isCompleted) Slate100 else MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = task.isCompleted,
                onCheckedChange = { onToggle() },
                colors = CheckboxDefaults.colors(checkedColor = EmeraldGreen)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = task.title,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp,
                    color = if (task.isCompleted) Slate400 else Slate900
                )
                Text(
                    text = "${task.startTime} - ${task.endTime} • ${task.subjectName} (${task.taskType.name.replace("_", " ")})",
                    fontSize = 12.sp,
                    color = Slate600
                )
            }
            IconButton(onClick = onDelete) {
                Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = Slate400, modifier = Modifier.size(18.dp))
            }
        }
    }
}
