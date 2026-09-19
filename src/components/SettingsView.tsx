import React, { useState } from 'react';
import {
  User,
  Clock,
  Bell,
  RotateCcw,
  Download,
  Upload,
  Check,
  Shield,
  Smartphone
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetDemoData: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onSimulateNotification: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onResetDemoData,
  onExportData,
  onImportData,
  onSimulateNotification,
}) => {
  const [name, setName] = useState(profile.name);
  const [studentClass, setStudentClass] = useState(profile.studentClass);
  const [dailyHours, setDailyHours] = useState(profile.dailyStudyHours.toString());
  const [schoolEndTime, setSchoolEndTime] = useState(profile.schoolEndTime);
  const [sleepTime, setSleepTime] = useState(profile.sleepTime);
  const [pwBatch, setPwBatch] = useState(profile.pwBatchName);
  const [examDate, setExamDate] = useState(profile.targetExamDate);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim(),
      studentClass: studentClass.trim(),
      dailyStudyHours: parseFloat(dailyHours) || 4.5,
      schoolEndTime,
      sleepTime,
      pwBatchName: pwBatch.trim(),
      targetExamDate: examDate,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="settings-view" className="space-y-4 pb-20">
      <div>
        <h1 className="text-xl font-bold text-slate-900">App Settings</h1>
        <p className="text-xs text-slate-500">Manage Student Profile & Study Preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Profile Card */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            Student Identity
          </div>
          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Student Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Class / Curriculum</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Physics Wallah Batch Name</label>
              <input
                type="text"
                value={pwBatch}
                onChange={(e) => setPwBatch(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Timings & Pacing */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Clock className="w-4 h-4 text-emerald-600" />
            Study Timings & Target Pacing
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Daily Available Hours</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="12"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Target Board Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">School Dismissal Time</label>
              <input
                type="time"
                value={schoolEndTime}
                onChange={(e) => setSchoolEndTime(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Night Sleep Time</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Bell className="w-4 h-4 text-amber-600" />
              Notifications & Study Reminders
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="rounded text-blue-600"
            />
          </div>
          <p className="text-xs text-slate-500">
            Alerts you 10 minutes prior to every scheduled study session and PW live lectures.
          </p>
          <button
            type="button"
            onClick={onSimulateNotification}
            className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold rounded-lg transition"
          >
            🔔 Test Study Reminder Notification
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>

      {/* Data Backup & Reset */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Data Import & Export
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={onExportData}
            className="p-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            Export Data (JSON)
          </button>
          <label className="p-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            Import Backup
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>

        <div className="pt-2 border-t border-slate-100">
          {showResetConfirm ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
              <p className="text-xs text-rose-800 font-semibold">
                Reset database to default CBSE Class 10 demo state?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onResetDemoData();
                    setShowResetConfirm(false);
                  }}
                  className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded hover:bg-rose-700"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset App with Class 10 Demo Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
