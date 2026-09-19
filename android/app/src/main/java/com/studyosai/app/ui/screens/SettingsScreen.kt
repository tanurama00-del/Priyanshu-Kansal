package com.studyosai.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.RestartAlt
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.studyosai.app.data.model.UserProfile
import com.studyosai.app.ui.theme.*
import com.studyosai.app.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit
) {
    val profile by viewModel.profile.collectAsState()

    var name by remember(profile.name) { mutableStateOf(profile.name) }
    var studentClass by remember(profile.studentClass) { mutableStateOf(profile.studentClass) }
    var dailyHours by remember(profile.dailyStudyHours) { mutableStateOf(profile.dailyStudyHours.toString()) }
    var schoolEndTime by remember(profile.schoolEndTime) { mutableStateOf(profile.schoolEndTime) }
    var sleepTime by remember(profile.sleepTime) { mutableStateOf(profile.sleepTime) }
    var pwBatch by remember(profile.pwBatchName) { mutableStateOf(profile.pwBatchName) }
    var notificationsEnabled by remember { mutableStateOf(true) }

    var showResetDialog by remember { mutableStateOf(false) }
    var saveSuccessMsg by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("App Settings", fontWeight = FontWeight.Bold) },
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
            item {
                Text("Student Profile", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
                Spacer(modifier = Modifier.height(8.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Slate100)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedTextField(
                            value = name,
                            onValueChange = { name = it },
                            label = { Text("Full Name") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = studentClass,
                            onValueChange = { studentClass = it },
                            label = { Text("Class / Board") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = pwBatch,
                            onValueChange = { pwBatch = it },
                            label = { Text("PW Batch Name") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            item {
                Text("Study Timetable Preferences", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
                Spacer(modifier = Modifier.height(8.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Slate100)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedTextField(
                            value = dailyHours,
                            onValueChange = { dailyHours = it },
                            label = { Text("Daily Available Study Hours") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = schoolEndTime,
                                onValueChange = { schoolEndTime = it },
                                label = { Text("School End") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = sleepTime,
                                onValueChange = { sleepTime = it },
                                label = { Text("Sleep Time") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
            }

            item {
                Text("Notifications & Reminders", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
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
                            Text("Study Session Reminders", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text("Alert 10 minutes before every timetable slot", fontSize = 12.sp, color = Slate600)
                        }
                        Switch(checked = notificationsEnabled, onCheckedChange = { notificationsEnabled = it })
                    }
                }
            }

            item {
                Button(
                    onClick = {
                        val updated = profile.copy(
                            name = name,
                            studentClass = studentClass,
                            pwBatchName = pwBatch,
                            dailyStudyHours = dailyHours.toDoubleOrNull() ?: 4.5,
                            schoolEndTime = schoolEndTime,
                            sleepTime = sleepTime
                        )
                        viewModel.updateProfile(updated)
                        saveSuccessMsg = true
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
                ) {
                    Text("Save Settings", modifier = Modifier.padding(vertical = 4.dp))
                }
                if (saveSuccessMsg) {
                    Text("Settings saved successfully!", color = EmeraldGreen, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
                }
            }

            item {
                Divider(color = Slate200, modifier = Modifier.padding(vertical = 8.dp))
                Text("Data Management", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = { showResetDialog = true },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = RoseDanger)
                ) {
                    Icon(Icons.Filled.RestartAlt, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Reset with Class 10 Demo Data")
                }
            }

            item {
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }

    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            title = { Text("Reset to Class 10 Demo Data?") },
            text = { Text("This will reload CBSE Class 10 syllabus chapters, PW batch lectures, and sample timetable.") },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.resetDemoData()
                        showResetDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoseDanger)
                ) {
                    Text("Reset Now")
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetDialog = false }) { Text("Cancel") }
            }
        )
    }
}
