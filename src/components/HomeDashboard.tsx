import React from 'react';
import {
  BookOpen,
  PlayCircle,
  AlertTriangle,
  FileText,
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Video,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { UserProfile, Chapter, PWLecture, Homework, StudyTask } from '../types';

interface HomeDashboardProps {
  profile: UserProfile;
  chapters: Chapter[];
  pwLectures: PWLecture[];
  homework: Homework[];
  tasks: StudyTask[];
  onToggleTask: (taskId: number) => void;
  onNavigate: (screen: string) => void;
  onOpenAddChapter: () => void;
  onOpenAddLecture: () => void;
  onGenerateTimetable: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  chapters,
  pwLectures,
  homework,
  tasks,
  onToggleTask,
  onNavigate,
  onOpenAddChapter,
  onOpenAddLecture,
  onGenerateTimetable,
}) => {
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.isCompleted).length;
  const syllabusPct = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const totalPw = pwLectures.length;
  const completedPw = pwLectures.filter((l) => l.isCompleted).length;

  const pendingHw = homework.filter((h) => !h.isCompleted).length;
  const backlogCount =
    chapters.filter((c) => !c.isCompleted && c.priority === 'HIGH').length +
    pwLectures.filter((l) => !l.isCompleted).length +
    pendingHw;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.date === todayStr || !t.date);
  const completedTodayTasks = todayTasks.filter((t) => t.isCompleted).length;
  const todayProgressPct = todayTasks.length > 0 ? Math.round((completedTodayTasks / todayTasks.length) * 100) : 0;

  // Exam days countdown
  const examDate = new Date(profile.targetExamDate || '2027-02-15');
  const today = new Date();
  const daysUntilExam = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const formattedDate = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div id="home-dashboard-container" className="space-y-4 pb-20">
      {/* Student Welcome Header */}
      <div id="dashboard-header" className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">StudyOS AI</h1>
          <p className="text-xs text-slate-500 font-medium">
            {profile.name} • {profile.studentClass}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{profile.currentStreak} Day Streak</span>
        </div>
      </div>

      {/* Hero Exam Countdown & Syllabus Card */}
      <div
        id="hero-status-card"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg shadow-blue-600/15"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-blue-200 tracking-wide uppercase">
              Target: CBSE Class 10 Board Exam
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold tracking-tight">{daysUntilExam}</span>
              <span className="text-sm text-blue-100 font-medium">Days Remaining</span>
            </div>
            <p className="text-xs text-blue-200/90 mt-0.5">{formattedDate}</p>
          </div>
          <button
            id="view-exam-btn"
            onClick={() => onNavigate('exam_countdown')}
            className="text-xs bg-white/15 hover:bg-white/25 active:scale-95 transition px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 text-white border border-white/20"
          >
            Exam Intel
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-blue-100">Overall Syllabus Completion</span>
            <span className="font-bold text-white">{syllabusPct}%</span>
          </div>
          <div className="w-full bg-black/25 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, syllabusPct))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-blue-200/80 mt-1.5">
            <span>{completedChapters} of {totalChapters} Chapters Mastered</span>
            <span>Target: 95%+</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div id="stats-grid" className="grid grid-cols-2 gap-3">
        {/* Chapters */}
        <button
          id="stat-chapters-btn"
          onClick={() => onNavigate('syllabus')}
          className="text-left p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-slate-900 leading-tight">
            {completedChapters}/{totalChapters}
          </p>
          <p className="text-xs font-medium text-slate-600">Syllabus Chapters</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
            {totalChapters - completedChapters} remaining
          </span>
        </button>

        {/* PW Lectures */}
        <button
          id="stat-pw-btn"
          onClick={() => onNavigate('pw_batch')}
          className="text-left p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <PlayCircle className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-slate-900 leading-tight">
            {completedPw}/{totalPw}
          </p>
          <p className="text-xs font-medium text-slate-600">PW Udaan Lectures</p>
          <span className="text-[10px] text-purple-600 font-semibold mt-1 inline-block">
            {totalPw - completedPw} in backlog
          </span>
        </button>

        {/* Backlog Items */}
        <button
          id="stat-backlog-btn"
          onClick={() => onNavigate('backlog')}
          className="text-left p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition group"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-slate-900 leading-tight">{backlogCount}</p>
          <p className="text-xs font-medium text-slate-600">Backlog Items</p>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 inline-block">
            Needs triage
          </span>
        </button>

        {/* Pending Homework */}
        <button
          id="stat-homework-btn"
          onClick={() => onNavigate('timetable')}
          className="text-left p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-slate-900 leading-tight">{pendingHw}</p>
          <p className="text-xs font-medium text-slate-600">Pending Homework</p>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-block">
            Due this week
          </span>
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div id="quick-actions-bar" className="space-y-2">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-2">
          <button
            id="quick-add-chapter-btn"
            onClick={onOpenAddChapter}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition border border-blue-100 active:scale-95"
          >
            <Plus className="w-4 h-4 mb-1 text-blue-600" />
            <span className="text-[11px] font-semibold">Chapter</span>
          </button>
          <button
            id="quick-add-lecture-btn"
            onClick={onOpenAddLecture}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition border border-purple-100 active:scale-95"
          >
            <Video className="w-4 h-4 mb-1 text-purple-600" />
            <span className="text-[11px] font-semibold">PW Lecture</span>
          </button>
          <button
            id="quick-generate-timetable-btn"
            onClick={onGenerateTimetable}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-100 active:scale-95"
          >
            <RefreshCw className="w-4 h-4 mb-1 text-emerald-600" />
            <span className="text-[11px] font-semibold">Timetable</span>
          </button>
          <button
            id="quick-ask-ai-coach-btn"
            onClick={() => onNavigate('ai_coach')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition border border-indigo-100 active:scale-95"
          >
            <Sparkles className="w-4 h-4 mb-1 text-indigo-600" />
            <span className="text-[11px] font-semibold">AI Coach</span>
          </button>
        </div>
      </div>

      {/* Today's Study Sessions */}
      <div id="today-sessions-container" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Today's Study Sessions</h2>
            <p className="text-[11px] text-slate-500">
              Target: {profile.dailyStudyHours} hrs • {todayProgressPct}% completed
            </p>
          </div>
          <button
            onClick={() => onNavigate('today')}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            Planner View
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
            <p className="text-xs text-slate-500">No sessions scheduled for today.</p>
            <button
              onClick={onGenerateTimetable}
              className="mt-2 text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Generate Daily Sessions
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                  task.isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {task.startTime} - {task.endTime}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-600">{task.subjectName}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        task.taskType === 'PW_LECTURE'
                          ? 'bg-purple-100 text-purple-700'
                          : task.taskType === 'REVISION'
                          ? 'bg-emerald-100 text-emerald-700'
                          : task.taskType === 'HOMEWORK'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {task.taskType.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
