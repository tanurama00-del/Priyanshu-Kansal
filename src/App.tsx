import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  PlayCircle,
  Sparkles,
  Settings,
  Bell,
  Smartphone,
  Maximize2,
  Minimize2,
  Code2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Download,
  Check,
  ChevronLeft,
  X
} from 'lucide-react';
import {
  Subject,
  Chapter,
  PWLecture,
  Homework,
  StudyTask,
  Exam,
  UserProfile,
  Priority
} from './types';
import {
  defaultProfile,
  defaultSubjects,
  defaultChapters,
  defaultPWLectures,
  defaultExams,
  defaultHomework,
  defaultTasks
} from './data/defaultData';
import { HomeDashboard } from './components/HomeDashboard';
import { SyllabusTracker } from './components/SyllabusTracker';
import { SmartTimetable } from './components/SmartTimetable';
import { PwBatchTracker } from './components/PwBatchTracker';
import { AiStudyCoach } from './components/AiStudyCoach';
import { DailyPlanner } from './components/DailyPlanner';
import { ExamCountdownView } from './components/ExamCountdownView';
import { BacklogManager } from './components/BacklogManager';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { OnboardingView } from './components/OnboardingView';
import { AndroidProjectExplorer } from './components/AndroidProjectExplorer';
import { generateSmartTimetableTasks } from './utils/timetableAlgo';

type ScreenType =
  | 'home'
  | 'syllabus'
  | 'timetable'
  | 'pw_batch'
  | 'ai_coach'
  | 'today'
  | 'exam_countdown'
  | 'backlog'
  | 'analytics'
  | 'settings'
  | 'project_explorer';

export default function App() {
  // Local persistence states
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('studyos_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('studyos_subjects');
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('studyos_chapters');
    return saved ? JSON.parse(saved) : defaultChapters;
  });

  const [pwLectures, setPwLectures] = useState<PWLecture[]>(() => {
    const saved = localStorage.getItem('studyos_pw_lectures');
    return saved ? JSON.parse(saved) : defaultPWLectures;
  });

  const [homework, setHomework] = useState<Homework[]>(() => {
    const saved = localStorage.getItem('studyos_homework');
    return saved ? JSON.parse(saved) : defaultHomework;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('studyos_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('studyos_exams');
    return saved ? JSON.parse(saved) : defaultExams;
  });

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem('studyos_profile', JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem('studyos_subjects', JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem('studyos_chapters', JSON.stringify(chapters));
  }, [chapters]);
  useEffect(() => {
    localStorage.setItem('studyos_pw_lectures', JSON.stringify(pwLectures));
  }, [pwLectures]);
  useEffect(() => {
    localStorage.setItem('studyos_homework', JSON.stringify(homework));
  }, [homework]);
  useEffect(() => {
    localStorage.setItem('studyos_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('studyos_exams', JSON.stringify(exams));
  }, [exams]);

  // Current Screen
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(true);

  // In-App Notification Toast Simulator
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Quick Action Dialogs
  const [quickAddChapterOpen, setQuickAddChapterOpen] = useState(false);
  const [quickAddLectureOpen, setQuickAddLectureOpen] = useState(false);

  // Quick Chapter Form state
  const [quickSubjectId, setQuickSubjectId] = useState<number>(subjects[0]?.id || 1);
  const [quickChapName, setQuickChapName] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('HIGH');
  const [quickHours, setQuickHours] = useState('3.5');

  // Quick PW Lecture Form state
  const [quickLecSubject, setQuickLecSubject] = useState('Physics');
  const [quickLecChap, setQuickLecChap] = useState('');
  const [quickLecTitle, setQuickLecTitle] = useState('');
  const [quickLecDuration, setQuickLecDuration] = useState('90');

  // Task Check-off Handlers
  const handleToggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleToggleChapter = (chapterId: number) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === chapterId ? { ...c, isCompleted: !c.isCompleted } : c))
    );
  };

  const handleToggleLecture = (lectureId: number) => {
    setPwLectures((prev) =>
      prev.map((l) => (l.id === lectureId ? { ...l, isCompleted: !l.isCompleted } : l))
    );
  };

  const handleToggleHomework = (homeworkId: number) => {
    setHomework((prev) =>
      prev.map((h) => (h.id === homeworkId ? { ...h, isCompleted: !h.isCompleted } : h))
    );
  };

  const handleTogglePWHomework = (lectureId: number) => {
    setPwLectures((prev) =>
      prev.map((l) => (l.id === lectureId ? { ...l, homeworkStatus: !l.homeworkStatus } : l))
    );
  };

  // Timetable Generator Handler
  const handleRegenerateTimetable = (options?: {
    days?: number;
    dailyHours?: number;
    schoolEndTime?: string;
    sleepTime?: string;
    prioritizePWBacklog?: boolean;
  }) => {
    const newTasks = generateSmartTimetableTasks(
      {
        days: options?.days || 7,
        dailyHours: options?.dailyHours || profile.dailyStudyHours || 4.5,
        schoolEndTime: options?.schoolEndTime || profile.schoolEndTime || '14:00',
        sleepTime: options?.sleepTime || profile.sleepTime || '23:00',
        prioritizePWBacklog: options?.prioritizePWBacklog ?? true,
      },
      subjects,
      chapters,
      pwLectures,
      homework
    );
    setTasks(newTasks);
    triggerToast('Smart Timetable generated & optimized for your exam deadline!');
  };

  // Reset to default Demo data
  const handleResetDemo = () => {
    setProfile(defaultProfile);
    setSubjects(defaultSubjects);
    setChapters(defaultChapters);
    setPwLectures(defaultPWLectures);
    setHomework(defaultHomework);
    setTasks(defaultTasks);
    setExams(defaultExams);
    triggerToast('Reset to Class 10 CBSE default data.');
  };

  // Export & Import
  const handleExportData = () => {
    const data = {
      profile,
      subjects,
      chapters,
      pwLectures,
      homework,
      tasks,
      exams,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyOS_AI_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Study data exported successfully.');
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (data.subjects) setSubjects(data.subjects);
      if (data.chapters) setChapters(data.chapters);
      if (data.pwLectures) setPwLectures(data.pwLectures);
      if (data.homework) setHomework(data.homework);
      if (data.tasks) setTasks(data.tasks);
      if (data.exams) setExams(data.exams);
      triggerToast('Study data imported successfully!');
    } catch (e) {
      alert('Invalid JSON file format.');
    }
  };

  // Check if onboarding is needed
  if (!profile.isOnboardingCompleted) {
    return (
      <OnboardingView
        onComplete={(newProfile) => {
          setProfile((prev) => ({ ...prev, ...newProfile, isOnboardingCompleted: true }));
        }}
      />
    );
  }

  // Quick navigation items for bottom bar
  const bottomNavItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'pw_batch', label: 'PW Batch', icon: PlayCircle },
    { id: 'ai_coach', label: 'AI Coach', icon: Sparkles },
  ];

  const renderContent = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeDashboard
            profile={profile}
            chapters={chapters}
            pwLectures={pwLectures}
            homework={homework}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onNavigate={(screen) => setCurrentScreen(screen as ScreenType)}
            onOpenAddChapter={() => setQuickAddChapterOpen(true)}
            onOpenAddLecture={() => setQuickAddLectureOpen(true)}
            onGenerateTimetable={() => handleRegenerateTimetable()}
          />
        );
      case 'syllabus':
        return (
          <SyllabusTracker
            subjects={subjects}
            chapters={chapters}
            onToggleChapter={handleToggleChapter}
            onAddChapter={(newChap) => {
              const id = Date.now();
              setChapters((prev) => [...prev, { ...newChap, id }]);
              triggerToast(`Added chapter '${newChap.name}'`);
            }}
            onDeleteChapter={(id) => {
              setChapters((prev) => prev.filter((c) => c.id !== id));
              triggerToast('Chapter deleted.');
            }}
            onAddSubject={(newSub) => {
              const id = Date.now();
              setSubjects((prev) => [...prev, { ...newSub, id }]);
              triggerToast(`Created subject '${newSub.name}'`);
            }}
            onUpdateChapterNotes={(id, notes) => {
              setChapters((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
              triggerToast('Saved revision notes.');
            }}
          />
        );
      case 'timetable':
        return (
          <SmartTimetable
            tasks={tasks}
            profile={profile}
            subjects={subjects}
            chapters={chapters}
            pwLectures={pwLectures}
            homework={homework}
            onToggleTask={handleToggleTask}
            onRegenerateTimetable={handleRegenerateTimetable}
            onAddTask={(task) => {
              setTasks((prev) => [...prev, { ...task, id: Date.now() }]);
              triggerToast('Study session scheduled.');
            }}
          />
        );
      case 'pw_batch':
        return (
          <PwBatchTracker
            lectures={pwLectures}
            profile={profile}
            onToggleLecture={handleToggleLecture}
            onToggleHomework={handleTogglePWHomework}
            onAddLecture={(lec) => {
              setPwLectures((prev) => [{ ...lec, id: Date.now() }, ...prev]);
              triggerToast(`Added lecture '${lec.lectureTitle}'`);
            }}
          />
        );
      case 'ai_coach':
        return (
          <AiStudyCoach
            profile={profile}
            chapters={chapters}
            pwLectures={pwLectures}
            homework={homework}
          />
        );
      case 'today':
        return (
          <DailyPlanner
            tasks={tasks}
            profile={profile}
            onToggleTask={handleToggleTask}
            onAddTask={(task) => {
              setTasks((prev) => [...prev, { ...task, id: Date.now() }]);
              triggerToast('Task scheduled for today.');
            }}
            onRescheduleTask={(id, newDate) => {
              setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, date: newDate } : t)));
              triggerToast('Task rescheduled.');
            }}
          />
        );
      case 'exam_countdown':
        return (
          <ExamCountdownView
            exams={exams}
            chapters={chapters}
            profile={profile}
            onAddExam={(exam) => {
              setExams((prev) => [...prev, { ...exam, id: Date.now() }]);
              triggerToast(`Scheduled exam milestone '${exam.name}'`);
            }}
            onDeleteExam={(id) => {
              setExams((prev) => prev.filter((e) => e.id !== id));
            }}
          />
        );
      case 'backlog':
        return (
          <BacklogManager
            chapters={chapters}
            pwLectures={pwLectures}
            homework={homework}
            onToggleChapter={handleToggleChapter}
            onToggleLecture={handleToggleLecture}
            onToggleHomework={handleToggleHomework}
            onAutoScheduleBacklog={() => {
              handleRegenerateTimetable({ prioritizePWBacklog: true });
              setCurrentScreen('timetable');
            }}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            subjects={subjects}
            chapters={chapters}
            pwLectures={pwLectures}
            homework={homework}
            profile={profile}
          />
        );
      case 'settings':
        return (
          <SettingsView
            profile={profile}
            onUpdateProfile={(updated) => {
              setProfile(updated);
              triggerToast('Profile & preferences updated.');
            }}
            onResetDemoData={handleResetDemo}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onSimulateNotification={() => {
              triggerToast('🔔 Reminder: PW Electricity Lecture 03 starts in 10 minutes!');
            }}
          />
        );
      case 'project_explorer':
        return <AndroidProjectExplorer />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Top Application Control Toolbar */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">StudyOS AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono border border-blue-700/50">
                Android Jetpack Compose
              </span>
            </div>
          </div>
        </div>

        {/* Global Navigation Shortcuts & Device Frame Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="nav-project-explorer-btn"
            onClick={() => setCurrentScreen('project_explorer')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              currentScreen === 'project_explorer'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Android Code (.ZIP)</span>
          </button>

          <button
            onClick={() => setCurrentScreen('settings')}
            className={`p-1.5 rounded-lg transition ${
              currentScreen === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="App Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setPhoneFrameMode(!phoneFrameMode)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={phoneFrameMode ? 'Switch to Full Width View' : 'Switch to Android Frame View'}
          >
            {phoneFrameMode ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex-1 flex justify-center p-2 sm:p-4 overflow-y-auto">
        <div
          className={`w-full transition-all duration-300 ${
            phoneFrameMode
              ? 'max-w-[440px] bg-slate-50 text-slate-900 rounded-[38px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col relative h-[840px] max-h-[92vh]'
              : 'max-w-5xl bg-slate-50 text-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col relative min-h-[85vh]'
          }`}
        >
          {/* Simulated Android Status Bar */}
          {phoneFrameMode && (
            <div className="h-7 bg-slate-100 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-700 select-none shrink-0 border-b border-slate-200/60">
              <span>9:41</span>
              {/* Punch-hole camera dot */}
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 mx-auto" />
              <div className="flex items-center gap-1.5 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Sub-Screen Back Navigation Header if not on a main tab */}
          {currentScreen !== 'home' &&
            currentScreen !== 'syllabus' &&
            currentScreen !== 'timetable' &&
            currentScreen !== 'pw_batch' &&
            currentScreen !== 'ai_coach' && (
              <div className="px-4 py-2 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
                <span className="text-xs font-bold text-slate-700 capitalize">
                  {currentScreen.replace('_', ' ')}
                </span>
              </div>
            )}

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-16 bg-slate-50">
            {renderContent()}
          </div>

          {/* Android Bottom Navigation Bar */}
          <nav
            id="android-bottom-nav"
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-20"
          >
            {bottomNavItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`bottom-nav-${item.id}`}
                  onClick={() => setCurrentScreen(item.id as ScreenType)}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                    isActive
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-800 font-medium'
                  }`}
                >
                  <div
                    className={`p-1 rounded-full transition ${
                      isActive ? 'bg-blue-50' : 'bg-transparent'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Android Navigation Bar Pill Indicator */}
          {phoneFrameMode && (
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-300 rounded-full pointer-events-none z-30" />
          )}

          {/* In-App Notification Toast */}
          {toastMessage && (
            <div
              id="in-app-toast"
              className="absolute top-9 left-4 right-4 z-50 bg-slate-900/95 text-white p-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-800"
            >
              <Bell className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="flex-1 font-medium">{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Quick Add Chapter Modal */}
      {quickAddChapterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Quick Add Chapter</h2>
              <button
                onClick={() => setQuickAddChapterOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!quickChapName.trim()) return;
                const newChap: Chapter = {
                  id: Date.now(),
                  subjectId: quickSubjectId,
                  name: quickChapName.trim(),
                  chapterNumber: chapters.filter((c) => c.subjectId === quickSubjectId).length + 1,
                  isCompleted: false,
                  priority: quickPriority,
                  estimatedHours: parseFloat(quickHours) || 3.5,
                  revisionStage: 'NONE',
                  notes: '',
                };
                setChapters((prev) => [...prev, newChap]);
                setQuickChapName('');
                setQuickAddChapterOpen(false);
                triggerToast(`Added chapter '${newChap.name}'`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={quickSubjectId}
                  onChange={(e) => setQuickSubjectId(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chapter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electricity, Carbon Compounds"
                  value={quickChapName}
                  onChange={(e) => setQuickChapName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={quickPriority}
                    onChange={(e) => setQuickPriority(e.target.value as Priority)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={quickHours}
                    onChange={(e) => setQuickHours(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAddChapterOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add PW Lecture Modal */}
      {quickAddLectureOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Add PW Lecture</h2>
              <button
                onClick={() => setQuickAddLectureOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!quickLecChap.trim() || !quickLecTitle.trim()) return;
                const newLec: PWLecture = {
                  id: Date.now(),
                  subject: quickLecSubject,
                  chapter: quickLecChap.trim(),
                  lectureNumber: pwLectures.filter((l) => l.subject === quickLecSubject).length + 1,
                  lectureTitle: quickLecTitle.trim(),
                  durationMinutes: parseInt(quickLecDuration) || 90,
                  lectureDate: new Date().toISOString().split('T')[0],
                  isCompleted: false,
                  homeworkStatus: false,
                };
                setPwLectures((prev) => [newLec, ...prev]);
                setQuickLecChap('');
                setQuickLecTitle('');
                setQuickAddLectureOpen(false);
                triggerToast(`Added lecture '${newLec.lectureTitle}'`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={quickLecSubject}
                  onChange={(e) => setQuickLecSubject(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chapter</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Light or Triangles"
                  value={quickLecChap}
                  onChange={(e) => setQuickLecChap(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concave & Convex Mirror Ray Diagrams"
                  value={quickLecTitle}
                  onChange={(e) => setQuickLecTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  min="20"
                  max="240"
                  value={quickLecDuration}
                  onChange={(e) => setQuickLecDuration(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAddLectureOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
