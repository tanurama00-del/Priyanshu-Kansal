package com.studyosai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.studyosai.app.data.model.StudyTask
import com.studyosai.app.data.model.TaskType
import com.studyosai.app.ui.theme.*
import com.studyosai.app.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TimetableScreen(viewModel: MainViewModel) {
    val tasks by viewModel.tasks.collectAsState()
    val profile by viewModel.profile.collectAsState()
    val todayCompletion by viewModel.todayCompletionPercentage.collectAsState()

    var showAddTaskDialog by remember { mutableStateOf(false) }
    var selectedFilterType by remember { mutableStateOf<TaskType?>(null) }

    val filteredTasks = if (selectedFilterType == null) tasks else tasks.filter { it.taskType == selectedFilterType }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("Smart Timetable", fontWeight = FontWeight.Bold, color = Slate900)
                },
                actions = {
                    IconButton(onClick = { viewModel.generateSmartTimetable() }) {
                        Icon(Icons.Filled.Autorenew, contentDescription = "Regenerate Timetable", tint = PrimaryBlue)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddTaskDialog = true },
                containerColor = PrimaryBlue,
                contentColor = Color.White
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add Task")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header Info & Algorithm Controls
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Slate100)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Study Rhythm Config", fontSize = 13.sp, color = Slate600)
                                Text(
                                    text = "${profile.dailyStudyHours} hrs/day • Evening Slot",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Slate900
                                )
                            }
                            Button(
                                onClick = { viewModel.generateSmartTimetable() },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Filled.Bolt, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Auto-Distribute", fontSize = 12.sp)
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "Prioritizes: Board Exam Chapters > PW Lecture Backlog > Daily Revision",
                            fontSize = 12.sp,
                            color = Slate600
                        )
                    }
                }
            }

            // Task Type Filter Chips
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    FilterChip(
                        selected = selectedFilterType == null,
                        onClick = { selectedFilterType = null },
                        label = { Text("All (${tasks.size})", fontSize = 12.sp) }
                    )
                    FilterChip(
                        selected = selectedFilterType == TaskType.PW_LECTURE,
                        onClick = { selectedFilterType = TaskType.PW_LECTURE },
                        label = { Text("PW", fontSize = 12.sp) }
                    )
                    FilterChip(
                        selected = selectedFilterType == TaskType.NEW_LEARNING,
                        onClick = { selectedFilterType = TaskType.NEW_LEARNING },
                        label = { Text("Learning", fontSize = 12.sp) }
                    )
                    FilterChip(
                        selected = selectedFilterType == TaskType.REVISION,
                        onClick = { selectedFilterType = TaskType.REVISION },
                        label = { Text("Revision", fontSize = 12.sp) }
                    )
                    FilterChip(
                        selected = selectedFilterType == TaskType.HOMEWORK,
                        onClick = { selectedFilterType = TaskType.HOMEWORK },
                        label = { Text("HW", fontSize = 12.sp) }
                    )
                }
            }

            // Task list items
            if (filteredTasks.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 40.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("No study sessions scheduled.", color = Slate600)
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(onClick = { viewModel.generateSmartTimetable() }) {
                                Text("Generate 7-Day Timetable")
                            }
                        }
                    }
                }
            } else {
                items(filteredTasks) { task ->
                    TimetableSessionCard(
                        task = task,
                        onToggle = { viewModel.toggleTaskCompletion(task) },
                        onDelete = { viewModel.deleteTask(task) }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(72.dp))
            }
        }
    }

    if (showAddTaskDialog) {
        var title by remember { mutableStateOf("") }
        var subject by remember { mutableStateOf("Science") }
        var startTime by remember { mutableStateOf("17:00") }
        var endTime by remember { mutableStateOf("18:30") }
        var taskType by remember { mutableStateOf(TaskType.NEW_LEARNING) }

        AlertDialog(
            onDismissRequest = { showAddTaskDialog = false },
            title = { Text("Add Study Session") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("Session Title") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = subject,
                        onValueChange = { subject = it },
                        label = { Text("Subject") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = startTime,
                            onValueChange = { startTime = it },
                            label = { Text("Start Time") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = endTime,
                            onValueChange = { endTime = it },
                            label = { Text("End Time") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (title.isNotBlank()) {
                            viewModel.addTask(
                                StudyTask(
                                    title = title,
                                    date = "2026-09-19",
                                    startTime = startTime,
                                    endTime = endTime,
                                    subjectName = subject,
                                    chapterName = "General",
                                    taskType = taskType
                                )
                            )
                            showAddTaskDialog = false
                        }
                    }
                ) { Text("Add Session") }
            },
            dismissButton = {
                TextButton(onClick = { showAddTaskDialog = false }) { Text("Cancel") }
            }
        )
    }
}

@Composable
fun TimetableSessionCard(
    task: StudyTask,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    val tagColor = when (task.taskType) {
        TaskType.PW_LECTURE -> PwPurple
        TaskType.NEW_LEARNING -> PrimaryBlue
        TaskType.REVISION -> EmeraldGreen
        TaskType.PRACTICE -> AmberWarning
        TaskType.HOMEWORK -> RoseDanger
    }

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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = tagColor.copy(alpha = 0.15f)
                    ) {
                        Text(
                            text = task.taskType.name.replace("_", " "),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = tagColor,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "${task.startTime} - ${task.endTime}", fontSize = 12.sp, color = Slate600)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = task.title,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 15.sp,
                    color = if (task.isCompleted) Slate400 else Slate900
                )
                Text(
                    text = "${task.subjectName} • ${task.date}",
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
