package com.studyosai.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.studyosai.app.ui.theme.*
import com.studyosai.app.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BacklogScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit
) {
    val chapters by viewModel.chapters.collectAsState()
    val pwLectures by viewModel.pwLectures.collectAsState()
    val homework by viewModel.homework.collectAsState()

    val pendingHighPriorityChapters = chapters.filter { !it.isCompleted && it.priority == com.studyosai.app.data.model.Priority.HIGH }
    val pendingLectures = pwLectures.filter { !it.isCompleted }
    val pendingHw = homework.filter { !it.isCompleted }

    val totalBacklogItems = pendingHighPriorityChapters.size + pendingLectures.size + pendingHw.size

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Backlog Manager", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Button(
                        onClick = { viewModel.generateSmartTimetable() },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Filled.AutoFixHigh, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Auto-Schedule All", fontSize = 12.sp)
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
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Summary Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = if (totalBacklogItems > 0) RoseDanger else EmeraldGreen)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text(
                            text = if (totalBacklogItems > 0) "Backlog Alert" else "Zero Backlog!",
                            color = Color.White.copy(alpha = 0.85f),
                            fontSize = 13.sp
                        )
                        Text(
                            text = "$totalBacklogItems Pending Priority Items",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Timetable generator gives highest slot weighting to these items.",
                            color = Color.White.copy(alpha = 0.85f),
                            fontSize = 12.sp
                        )
                    }
                }
            }

            // Pending PW Lectures Section
            if (pendingLectures.isNotEmpty()) {
                item {
                    Text("PW Lectures Backlog (${pendingLectures.size})", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Slate900)
                }
                items(pendingLectures) { lec ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = Slate100)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("[${lec.subject}] Lec ${lec.lectureNumber}: ${lec.lectureTitle}", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                Text("Chapter: ${lec.chapter} • ${lec.durationMinutes} mins • High Priority", fontSize = 12.sp, color = Slate600)
                            }
                            Button(
                                onClick = { viewModel.togglePWLecture(lec) },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = PwPurple),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text("Mark Done", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            // Pending High Priority Chapters
            if (pendingHighPriorityChapters.isNotEmpty()) {
                item {
                    Text("High Priority Chapter Backlog (${pendingHighPriorityChapters.size})", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Slate900)
                }
                items(pendingHighPriorityChapters) { chap ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = Slate100)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(chap.name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                Text("Est. Time: ${chap.estimatedHours} hrs • Board Weightage: High", fontSize = 12.sp, color = Slate600)
                            }
                            Button(
                                onClick = { viewModel.toggleChapterCompletion(chap) },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text("Complete", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            // Pending Homework
            if (pendingHw.isNotEmpty()) {
                item {
                    Text("Pending Homework / DPP (${pendingHw.size})", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Slate900)
                }
                items(pendingHw) { hw ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = Slate100)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(hw.title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                Text("${hw.subjectName} • Due: ${hw.dueDate} • Est: ${hw.estimatedMinutes}m", fontSize = 12.sp, color = Slate600)
                            }
                            Button(
                                onClick = { viewModel.toggleHomeworkCompletion(hw) },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = AmberWarning),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text("Submit", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
