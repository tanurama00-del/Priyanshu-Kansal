package com.studyosai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.School
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
fun OnboardingScreen(
    viewModel: MainViewModel,
    onComplete: () -> Unit
) {
    var name by remember { mutableStateOf("Aarav Sharma") }
    var studentClass by remember { mutableStateOf("Class 10 CBSE") }
    var dailyHours by remember { mutableStateOf("4.5") }
    var examDate by remember { mutableStateOf("2027-02-15") }
    var pwBatch by remember { mutableStateOf("PW Udaan 2026") }

    Scaffold { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Spacer(modifier = Modifier.height(24.dp))
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(PrimaryBlue, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Filled.School, contentDescription = null, tint = Color.White, modifier = Modifier.size(32.dp))
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Welcome to StudyOS AI",
                    fontSize = 26.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Slate900
                )
                Text(
                    text = "Your offline-first, AI-powered Class 10 study planner and PW batch companion.",
                    fontSize = 14.sp,
                    color = Slate600
                )
                Spacer(modifier = Modifier.height(24.dp))

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Your Name") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(
                    value = studentClass,
                    onValueChange = { studentClass = it },
                    label = { Text("Class / Board") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(
                    value = pwBatch,
                    onValueChange = { pwBatch = it },
                    label = { Text("Physics Wallah Batch Name") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(
                    value = dailyHours,
                    onValueChange = { dailyHours = it },
                    label = { Text("Daily Study Target (Hours)") },
                    modifier = Modifier.fillMaxWidth()
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    onClick = {
                        val profile = UserProfile(
                            name = name,
                            studentClass = studentClass,
                            pwBatchName = pwBatch,
                            dailyStudyHours = dailyHours.toDoubleOrNull() ?: 4.5,
                            targetExamDate = examDate,
                            isOnboardingCompleted = true
                        )
                        viewModel.updateProfile(profile)
                        onComplete()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Get Started with Personalized Dashboard")
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(Icons.Filled.AutoAwesome, contentDescription = null, modifier = Modifier.size(18.dp))
                    }
                }
            }
        }
    }
}
