package com.studyosai.app.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class StudyReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val title = intent.getStringExtra("EXTRA_TITLE") ?: "StudyOS AI Reminder"
        val message = intent.getStringExtra("EXTRA_MESSAGE") ?: "Time for your scheduled study session!"
        val id = intent.getIntExtra("EXTRA_ID", 1001)

        NotificationHelper.showInstantNotification(context, id, title, message)
    }
}
