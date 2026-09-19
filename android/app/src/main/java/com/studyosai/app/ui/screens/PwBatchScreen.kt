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
import com.studyosai.app.data.model.PWLecture
import com.studyosai.app.ui.theme.*
import com.studyosai.app.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PwBatchScreen(viewModel: MainViewModel) {
    val lectures by viewModel.pwLectures.collectAsState()
    val profile by viewModel.profile.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var filterStatus by remember { mutableStateOf("ALL") } // ALL, PENDING, COMPLETED
    var showAddDialog by remember { mutableStateOf(false) }

    val totalLectures = lectures.size
    val completedLectures = lectures.count { it.isCompleted }
    val pendingLectures = lectures.count { !it.isCompleted }
    val totalHours = lectures.sumOf { it.durationMinutes } / 60.0
    val completedHours = lectures.filter { it.isCompleted }.sumOf { it.durationMinutes } / 60.0

    val firstBacklogLecture = lectures.firstOrNull { !it.isCompleted }

    val filteredLectures = lectures.filter { lecture ->
        val matchesSearch = searchQuery.isBlank() ||
                lecture.lectureTitle.contains(searchQuery, ignoreCase = true) ||
                lecture.subject.contains(searchQuery, ignoreCase = true) ||
                lecture.chapter.contains(searchQuery, ignoreCase = true)
        val matchesFilter = when (filterStatus) {
            "PENDING" -> !lecture.isCompleted
            "COMPLETED" -> lecture.isCompleted
            else -> true
        }
        matchesSearch && matchesFilter
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(profile.pwBatchName, fontWeight = FontWeight.Bold, color = Slate900)
                        Text("Physics Wallah Batch Tracker", fontSize = 12.sp, color = Slate600)
                    }
                },
                actions = {
                    IconButton(onClick = { showAddDialog = true }) {
                        Icon(Icons.Filled.AddCircle, contentDescription = "Add Lecture", tint = PwPurple)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Metrics Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = PwPurple)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Lectures Watched", color = Color.White.copy(alpha = 0.85f), fontSize = 13.sp)
                                Text(
                                    text = "$completedLectures / $totalLectures",
                                    fontSize = 26.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color.White.copy(alpha = 0.2f)
                            ) {
                                Text(
                                    text = "${String.format("%.1f", completedHours)}h / ${String.format("%.1f", totalHours)}h",
                                    color = Color.White,
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Progress bar
                        val progress = if (totalLectures > 0) completedLectures.toFloat() / totalLectures else 0f
                        LinearProgressIndicator(
                            progress = { progress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(6.dp),
                            color = Color(0xFFC084FC),
                            trackColor = Color.White.copy(alpha = 0.3f)
                        )
                    }
                }
            }

            // PW Backlog Assistant Recommendation Card
            if (firstBacklogLecture != null) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFAF5FF))
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Filled.Bolt, contentDescription = null, tint = PwPurple, modifier = Modifier.size(24.dp))
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text("PW Backlog Assistant", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = PwPurple)
                                Text(
                                    text = "Watch next: [${firstBacklogLecture.subject}] Lec ${firstBacklogLecture.lectureNumber} - ${firstBacklogLecture.lectureTitle} (${firstBacklogLecture.durationMinutes}m)",
                                    fontSize = 12.sp,
                                    color = Slate700
                                )
                            }
                        }
                    }
                }
            }

            // Search and filters
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search lectures, topics, chapters...") },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null, tint = Slate400) },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = filterStatus == "ALL",
                        onClick = { filterStatus = "ALL" },
                        label = { Text("All ($totalLectures)") }
                    )
                    FilterChip(
                        selected = filterStatus == "PENDING",
                        onClick = { filterStatus = "PENDING" },
                        label = { Text("Backlog ($pendingLectures)") }
                    )
                    FilterChip(
                        selected = filterStatus == "COMPLETED",
                        onClick = { filterStatus = "COMPLETED" },
                        label = { Text("Done ($completedLectures)") }
                    )
                }
            }

            // Lecture List
            if (filteredLectures.isEmpty()) {
                item {
                    Box(modifier = Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                        Text("No lectures found.", color = Slate600)
                    }
                }
            } else {
                items(filteredLectures) { lecture ->
                    PWLectureItemCard(
                        lecture = lecture,
                        onToggleWatched = { viewModel.togglePWLecture(lecture) },
                        onToggleHomework = { viewModel.togglePWHomework(lecture) },
                        onDelete = { viewModel.deletePWLecture(lecture) }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(72.dp))
            }
        }
    }

    if (showAddDialog) {
        var title by remember { mutableStateOf("") }
        var subject by remember { mutableStateOf("Physics") }
        var chapter by remember { mutableStateOf("Electricity") }
        var duration by remember { mutableStateOf("90") }
        var lecNumber by remember { mutableStateOf("${totalLectures + 1}") }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("Add PW Batch Lecture") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("Lecture Title") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = subject,
                        onValueChange = { subject = it },
                        label = { Text("Subject (Physics/Chemistry/Math/Bio)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = chapter,
                        onValueChange = { chapter = it },
                        label = { Text("Chapter") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = lecNumber,
                            onValueChange = { lecNumber = it },
                            label = { Text("Lec #") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = duration,
                            onValueChange = { duration = it },
                            label = { Text("Duration (mins)") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (title.isNotBlank()) {
                            viewModel.addPWLecture(
                                PWLecture(
                                    subject = subject,
                                    chapter = chapter,
                                    lectureNumber = lecNumber.toIntOrNull() ?: 1,
                                    lectureTitle = title,
                                    durationMinutes = duration.toIntOrNull() ?: 90,
                                    lectureDate = "2026-09-19"
                                )
                            )
                            showAddDialog = false
                        }
                    }
                ) { Text("Add Lecture") }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) { Text("Cancel") }
            }
        )
    }
}

@Composable
fun PWLectureItemCard(
    lecture: PWLecture,
    onToggleWatched: () -> Unit,
    onToggleHomework: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (lecture.isCompleted) Slate100 else MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Checkbox(
                    checked = lecture.isCompleted,
                    onCheckedChange = { onToggleWatched() },
                    colors = CheckboxDefaults.colors(checkedColor = PwPurple)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Lec ${lecture.lectureNumber}: ${lecture.lectureTitle}",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 15.sp,
                        color = if (lecture.isCompleted) Slate400 else Slate900
                    )
                    Text(
                        text = "${lecture.subject} • ${lecture.chapter} • ${lecture.durationMinutes} mins",
                        fontSize = 12.sp,
                        color = Slate600
                    )
                }
                IconButton(onClick = onDelete) {
                    Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = Slate400, modifier = Modifier.size(18.dp))
                }
            }

            Divider(modifier = Modifier.padding(vertical = 8.dp), color = Slate200)

            // Bottom controls: Homework/DPP toggle
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(
                        checked = lecture.homeworkStatus,
                        onCheckedChange = { onToggleHomework() },
                        colors = CheckboxDefaults.colors(checkedColor = EmeraldGreen)
                    )
                    Text(
                        text = if (lecture.homeworkStatus) "DPP / Homework Completed" else "Pending DPP / Homework",
                        fontSize = 12.sp,
                        color = if (lecture.homeworkStatus) EmeraldGreen else AmberWarning,
                        fontWeight = FontWeight.Medium
                    )
                }
                Text(
                    text = lecture.lectureDate,
                    fontSize = 11.sp,
                    color = Slate400
                )
            }
        }
    }
}
