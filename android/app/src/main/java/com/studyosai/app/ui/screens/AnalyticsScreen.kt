package com.studyosai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.studyosai.app.ui.theme.*
import com.studyosai.app.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnalyticsScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit
) {
    val subjects by viewModel.subjects.collectAsState()
    val chapters by viewModel.chapters.collectAsState()
    val pwLectures by viewModel.pwLectures.collectAsState()
    val homework by viewModel.homework.collectAsState()
    val profile by viewModel.profile.collectAsState()
    val syllabusProgress by viewModel.syllabusProgressPercentage.collectAsState()

    val totalChapters = chapters.size
    val completedChapters = chapters.count { it.isCompleted }
    val totalPw = pwLectures.size
    val completedPw = pwLectures.count { it.isCompleted }
    val totalHw = homework.size
    val completedHw = homework.count { it.isCompleted }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Study Analytics", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
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
            // Overall Syllabus Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Slate100)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Syllabus Completion", fontSize = 13.sp, color = Slate600)
                                Text("$syllabusProgress%", fontSize = 32.sp, fontWeight = FontWeight.ExtraBold, color = PrimaryBlue)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("Study Streak", fontSize = 13.sp, color = Slate600)
                                Text("${profile.currentStreak} Days 🔥", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = AmberWarning)
                            }
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        LinearProgressIndicator(
                            progress = { syllabusProgress / 100f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(10.dp)
                                .clip(RoundedCornerShape(5.dp)),
                            color = PrimaryBlue,
                            trackColor = Slate200
                        )
                    }
                }
            }

            // Subject-wise Breakdown
            item {
                Text("Subject-wise Progress", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
            }

            items(subjects) { subject ->
                val subjectChapters = chapters.filter { it.subjectId == subject.id }
                val subTotal = subjectChapters.size
                val subCompleted = subjectChapters.count { it.isCompleted }
                val pct = if (subTotal > 0) (subCompleted * 100) / subTotal else 0

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Slate100)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(subject.name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text("$subCompleted / $subTotal ($pct%)", fontSize = 13.sp, color = Slate600)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = { if (subTotal > 0) subCompleted.toFloat() / subTotal else 0f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(6.dp)
                                .clip(RoundedCornerShape(3.dp)),
                            color = EmeraldGreen,
                            trackColor = Slate200
                        )
                    }
                }
            }

            // Weekly Study Hours & Efficiency
            item {
                Text("Weekly Effort Distribution", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
                Spacer(modifier = Modifier.height(8.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Slate100)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
                        val hours = listOf(4.0f, 4.5f, 5.0f, 3.5f, 4.5f, 6.0f, 5.5f)

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Bottom
                        ) {
                            days.forEachIndexed { i, day ->
                                val h = hours[i]
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Bottom,
                                    modifier = Modifier.fillMaxHeight()
                                ) {
                                    Text("${h}h", fontSize = 10.sp, color = Slate600)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Box(
                                        modifier = Modifier
                                            .width(22.dp)
                                            .height((h * 14).dp)
                                            .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                                            .background(PrimaryBlue)
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(day, fontSize = 11.sp, color = Slate700)
                                }
                            }
                        }
                    }
                }
            }

            // Homework & PW Breakdown stats
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    MetricBox(
                        title = "PW Lectures Watched",
                        value = "$completedPw / $totalPw",
                        subtitle = "${if (totalPw > 0) (completedPw * 100) / totalPw else 0}% Completed",
                        modifier = Modifier.weight(1f)
                    )
                    MetricBox(
                        title = "Homework Submitted",
                        value = "$completedHw / $totalHw",
                        subtitle = "${if (totalHw > 0) (completedHw * 100) / totalHw else 0}% Done",
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
