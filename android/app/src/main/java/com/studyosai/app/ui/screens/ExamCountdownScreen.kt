package com.studyosai.app.ui.screens

import androidx.compose.foundation.background
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
import com.studyosai.app.data.model.Exam
import com.studyosai.app.ui.theme.*
import com.studyosai.app.ui.viewmodel.MainViewModel
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExamCountdownScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit
) {
    val exams by viewModel.exams.collectAsState()
    val chapters by viewModel.chapters.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

    val pendingChapters = chapters.count { !it.isCompleted }
    val remainingHours = chapters.filter { !it.isCompleted }.sumOf { it.estimatedHours }

    val primaryExam = exams.firstOrNull()

    val daysLeft = if (primaryExam != null) {
        try {
            val examDate = LocalDate.parse(primaryExam.examDate)
            val today = LocalDate.now()
            maxOf(1L, ChronoUnit.DAYS.between(today, examDate))
        } catch (e: Exception) { 149L }
    } else 149L

    val weeksLeft = maxOf(1L, daysLeft / 7)
    val chaptersPerDay = String.format("%.2f", pendingChapters.toDouble() / daysLeft)
    val hoursPerDay = String.format("%.1f", remainingHours / daysLeft)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Exam Countdown", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { showAddDialog = true }) {
                        Icon(Icons.Filled.AddAlert, contentDescription = "Add Exam", tint = PrimaryBlue)
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Main Countdown Hero Banner
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = PrimaryBlue)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            text = primaryExam?.name ?: "CBSE Class 10 Board Exam",
                            color = Color.White.copy(alpha = 0.85f),
                            fontSize = 14.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "$daysLeft",
                                fontSize = 42.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Days Remaining",
                                fontSize = 18.sp,
                                color = Color.White.copy(alpha = 0.9f),
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                        }
                        Text(
                            text = "($weeksLeft weeks left) • Target Date: ${primaryExam?.examDate ?: "2027-02-15"}",
                            color = Color.White.copy(alpha = 0.75f),
                            fontSize = 12.sp
                        )
                    }
                }
            }

            // Pacing Breakdown Metrics
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    MetricBox(
                        title = "Remaining Chapters",
                        value = "$pendingChapters",
                        subtitle = "Pending in syllabus",
                        modifier = Modifier.weight(1f)
                    )
                    MetricBox(
                        title = "Required Pace",
                        value = "$chaptersPerDay / day",
                        subtitle = "To finish before exam",
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    MetricBox(
                        title = "Est. Total Hours",
                        value = "${String.format("%.0f", remainingHours)} hrs",
                        subtitle = "Syllabus workload",
                        modifier = Modifier.weight(1f)
                    )
                    MetricBox(
                        title = "Daily Study Target",
                        value = "$hoursPerDay hrs/day",
                        subtitle = "Minimum daily hours",
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // List of Registered Exams
            item {
                Text("Scheduled Exams", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
            }

            items(exams) { exam ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Slate100)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(exam.name, fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = Slate900)
                            Text("Exam Date: ${exam.examDate} • Target: ${exam.targetPercentage}%", fontSize = 12.sp, color = Slate600)
                        }
                        IconButton(onClick = { viewModel.deleteExam(exam) }) {
                            Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = Slate400)
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        var name by remember { mutableStateOf("") }
        var date by remember { mutableStateOf("2026-12-15") }
        var targetScore by remember { mutableStateOf("95") }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("Add Target Exam") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Exam Name (e.g. Mid-Term 1, Pre-Board)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = date,
                        onValueChange = { date = it },
                        label = { Text("Exam Date (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = targetScore,
                        onValueChange = { targetScore = it },
                        label = { Text("Target Percentage (%)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (name.isNotBlank()) {
                            viewModel.addExam(
                                Exam(
                                    name = name,
                                    examDate = date,
                                    targetPercentage = targetScore.toIntOrNull() ?: 95
                                )
                            )
                            showAddDialog = false
                        }
                    }
                ) { Text("Save Exam") }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) { Text("Cancel") }
            }
        )
    }
}

@Composable
fun MetricBox(
    title: String,
    value: String,
    subtitle: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = Slate100)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, fontSize = 12.sp, color = Slate600)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Slate900)
            Text(subtitle, fontSize = 11.sp, color = Slate400)
        }
    }
}
