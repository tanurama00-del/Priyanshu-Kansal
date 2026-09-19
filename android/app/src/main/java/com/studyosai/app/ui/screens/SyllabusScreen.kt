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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.studyosai.app.data.model.Chapter
import com.studyosai.app.data.model.Priority
import com.studyosai.app.data.model.Subject
import com.studyosai.app.ui.theme.*
import com.studyosai.app.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SyllabusScreen(viewModel: MainViewModel) {
    val subjects by viewModel.subjects.collectAsState()
    val chapters by viewModel.chapters.collectAsState()

    var selectedSubjectId by remember { mutableStateOf<Long?>(null) }
    var searchQuery by remember { mutableStateOf("") }
    var filterStatus by remember { mutableStateOf("ALL") } // ALL, PENDING, COMPLETED
    var showAddChapterDialog by remember { mutableStateOf(false) }
    var showAddSubjectDialog by remember { mutableStateOf(false) }

    // Auto calculate overall and subject metrics
    val totalChapters = chapters.size
    val completedChapters = chapters.count { it.isCompleted }
    val remainingHours = chapters.filter { !it.isCompleted }.sumOf { it.estimatedHours }

    val filteredChapters = chapters.filter { chapter ->
        val matchesSubject = selectedSubjectId == null || chapter.subjectId == selectedSubjectId
        val matchesSearch = searchQuery.isBlank() || chapter.name.contains(searchQuery, ignoreCase = true)
        val matchesFilter = when (filterStatus) {
            "PENDING" -> !chapter.isCompleted
            "COMPLETED" -> chapter.isCompleted
            else -> true
        }
        matchesSubject && matchesSearch && matchesFilter
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("Class 10 Syllabus", fontWeight = FontWeight.Bold, color = Slate900)
                },
                actions = {
                    IconButton(onClick = { showAddSubjectDialog = true }) {
                        Icon(Icons.Filled.FolderSpecial, contentDescription = "Add Subject", tint = PrimaryBlue)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddChapterDialog = true },
                containerColor = PrimaryBlue,
                contentColor = Color.White
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add Chapter")
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
            // Summary Header Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Slate100)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Total Syllabus Progress", fontSize = 13.sp, color = Slate600)
                                Text(
                                    text = "$completedChapters of $totalChapters Chapters",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Slate900
                                )
                            }
                            Text(
                                text = "${String.format("%.1f", remainingHours)} hrs left",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = PrimaryBlue
                            )
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        val progressRatio = if (totalChapters > 0) completedChapters.toFloat() / totalChapters else 0f
                        LinearProgressIndicator(
                            progress = { progressRatio },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = EmeraldGreen,
                            trackColor = Slate200
                        )
                    }
                }
            }

            // Search Bar & Filter Chips
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search chapters...") },
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
                        label = { Text("All (${chapters.size})") }
                    )
                    FilterChip(
                        selected = filterStatus == "PENDING",
                        onClick = { filterStatus = "PENDING" },
                        label = { Text("Pending (${chapters.count { !it.isCompleted }})") }
                    )
                    FilterChip(
                        selected = filterStatus == "COMPLETED",
                        onClick = { filterStatus = "COMPLETED" },
                        label = { Text("Done (${chapters.count { it.isCompleted }})") }
                    )
                }
            }

            // Subject Filter Badges
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AssistChip(
                        onClick = { selectedSubjectId = null },
                        label = { Text("All Subjects") },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = if (selectedSubjectId == null) PrimaryBlue.copy(alpha = 0.15f) else Color.Transparent
                        )
                    )
                    subjects.forEach { subj ->
                        val count = chapters.count { it.subjectId == subj.id }
                        AssistChip(
                            onClick = { selectedSubjectId = subj.id },
                            label = { Text("${subj.name} ($count)") },
                            colors = AssistChipDefaults.assistChipColors(
                                containerColor = if (selectedSubjectId == subj.id) PrimaryBlue.copy(alpha = 0.15f) else Color.Transparent
                            )
                        )
                    }
                }
            }

            // Chapter list items
            if (filteredChapters.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("No chapters found matching criteria.", color = Slate600)
                    }
                }
            } else {
                items(filteredChapters) { chapter ->
                    val subject = subjects.firstOrNull { it.id == chapter.subjectId }
                    ChapterRowCard(
                        chapter = chapter,
                        subjectName = subject?.name ?: "Subject",
                        onToggle = { viewModel.toggleChapterCompletion(chapter) },
                        onDelete = { viewModel.deleteChapter(chapter) }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(72.dp))
            }
        }
    }

    // Add Chapter Dialog
    if (showAddChapterDialog) {
        var chapterName by remember { mutableStateOf("") }
        var selectedSubject by remember { mutableStateOf(subjects.firstOrNull()?.id ?: 1L) }
        var priority by remember { mutableStateOf(Priority.HIGH) }
        var estHours by remember { mutableStateOf("3.5") }

        AlertDialog(
            onDismissRequest = { showAddChapterDialog = false },
            title = { Text("Add New Chapter") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = chapterName,
                        onValueChange = { chapterName = it },
                        label = { Text("Chapter Title") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = estHours,
                        onValueChange = { estHours = it },
                        label = { Text("Estimated Study Hours") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Priority: ", fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        listOf(Priority.HIGH, Priority.MEDIUM, Priority.LOW).forEach { p ->
                            FilterChip(
                                selected = priority == p,
                                onClick = { priority = p },
                                label = { Text(p.name) },
                                modifier = Modifier.padding(end = 4.dp)
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (chapterName.isNotBlank()) {
                            viewModel.addChapter(
                                subjectId = selectedSubject,
                                name = chapterName,
                                priority = priority,
                                estimatedHours = estHours.toDoubleOrNull() ?: 3.0
                            )
                            showAddChapterDialog = false
                        }
                    }
                ) { Text("Save Chapter") }
            },
            dismissButton = {
                TextButton(onClick = { showAddChapterDialog = false }) { Text("Cancel") }
            }
        )
    }

    // Add Subject Dialog
    if (showAddSubjectDialog) {
        var subjectName by remember { mutableStateOf("") }
        AlertDialog(
            onDismissRequest = { showAddSubjectDialog = false },
            title = { Text("Add Subject") },
            text = {
                OutlinedTextField(
                    value = subjectName,
                    onValueChange = { subjectName = it },
                    label = { Text("Subject Name (e.g. Hindi, Computer)") },
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (subjectName.isNotBlank()) {
                            viewModel.addSubject(subjectName, "#2563EB")
                            showAddSubjectDialog = false
                        }
                    }
                ) { Text("Add") }
            },
            dismissButton = {
                TextButton(onClick = { showAddSubjectDialog = false }) { Text("Cancel") }
            }
        )
    }
}

@Composable
fun ChapterRowCard(
    chapter: Chapter,
    subjectName: String,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (chapter.isCompleted) Slate100 else MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = chapter.isCompleted,
                onCheckedChange = { onToggle() },
                colors = CheckboxDefaults.colors(checkedColor = EmeraldGreen)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "${chapter.chapterNumber}. ${chapter.name}",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 15.sp,
                    color = if (chapter.isCompleted) Slate400 else Slate900
                )
                Spacer(modifier = Modifier.height(2.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "$subjectName • ${chapter.estimatedHours}h", fontSize = 12.sp, color = Slate600)
                    Spacer(modifier = Modifier.width(8.dp))
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = when (chapter.priority) {
                            Priority.HIGH -> RoseDanger.copy(alpha = 0.15f)
                            Priority.MEDIUM -> AmberWarning.copy(alpha = 0.15f)
                            Priority.LOW -> EmeraldGreen.copy(alpha = 0.15f)
                        }
                    ) {
                        Text(
                            text = chapter.priority.name,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = when (chapter.priority) {
                                Priority.HIGH -> RoseDanger
                                Priority.MEDIUM -> AmberWarning
                                Priority.LOW -> EmeraldGreen
                            },
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                    if (chapter.revisionStage != com.studyosai.app.data.model.RevisionStage.NONE) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "• ${chapter.revisionStage.name.replace("_", " ")}", fontSize = 11.sp, color = PrimaryBlue)
                    }
                }
            }
            IconButton(onClick = onDelete) {
                Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = Slate400, modifier = Modifier.size(18.dp))
            }
        }
    }
}
