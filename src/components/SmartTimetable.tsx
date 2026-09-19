import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Circle,
  Plus,
  PlayCircle,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { StudyTask, UserProfile, Chapter, PWLecture, Homework, Subject } from '../types';

interface SmartTimetableProps {
  tasks: StudyTask[];
  profile: UserProfile;
  subjects: Subject[];
  chapters: Chapter[];
  pwLectures: PWLecture[];
  homework: Homework[];
  onToggleTask: (taskId: number) => void;
  onRegenerateTimetable: (options: {
    days: number;
    dailyHours: number;
    schoolEndTime: string;
    sleepTime: string;
    prioritizePWBacklog: boolean;
  }) => void;
  onAddTask: (task: Omit<StudyTask, 'id'>) => void;
}

export const SmartTimetable: React.FC<SmartTimetableProps> = ({
  tasks,
  profile,
  subjects,
  chapters,
  pwLectures,
  homework,
  onToggleTask,
  onRegenerateTimetable,
  onAddTask,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [daysCount, setDaysCount] = useState(7);
  const [dailyHours, setDailyHours] = useState(profile.dailyStudyHours || 4.5);
  const [schoolEndTime, setSchoolEndTime] = useState(profile.schoolEndTime || '14:00');
  const [sleepTime, setSleepTime] = useState(profile.sleepTime || '23:00');
  const [prioritizeBacklog, setPrioritizeBacklog] = useState(true);

  // Day filter
  const uniqueDates = Array.from(new Set(tasks.map((t) => t.date))).sort();
  const [selectedDate, setSelectedDate] = useState<string>(
    uniqueDates[0] || new Date().toISOString().split('T')[0]
  );

  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const completedCount = dayTasks.filter((t) => t.isCompleted).length;
  const progressPct = dayTasks.length > 0 ? Math.round((completedCount / dayTasks.length) * 100) : 0;

  const handleTriggerGenerate = () => {
    onRegenerateTimetable({
      days: daysCount,
      dailyHours,
      schoolEndTime,
      sleepTime,
      prioritizePWBacklog: prioritizeBacklog,
    });
    setShowConfig(false);
  };

  return (
    <div id="smart-timetable-view" className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Smart Timetable</h1>
          <p className="text-xs text-slate-500">Constraint-Based Study Scheduler</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            Config
          </button>
          <button
            id="regen-timetable-btn"
            onClick={handleTriggerGenerate}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
        </div>
      </div>

      {/* Generator Configuration Panel */}
      {showConfig && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Algorithm Scheduling Parameters
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Daily Study Hours</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="10"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value) || 4.5)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Schedule Horizon</label>
              <select
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              >
                <option value={3}>Next 3 Days</option>
                <option value={7}>Next 7 Days (1 Week)</option>
                <option value={14}>Next 14 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">School End Time</label>
              <input
                type="time"
                value={schoolEndTime}
                onChange={(e) => setSchoolEndTime(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Night Sleep Time</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={prioritizeBacklog}
                onChange={(e) => setPrioritizeBacklog(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold">Auto-prioritize PW lectures & Backlog chapters</span>
            </label>
            <button
              onClick={handleTriggerGenerate}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Apply & Generate
            </button>
          </div>
        </div>
      )}

      {/* Date Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {uniqueDates.map((dateStr, idx) => {
          const isSelected = selectedDate === dateStr;
          const d = new Date(dateStr);
          const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = d.getDate();

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`px-3 py-2 rounded-xl text-center min-w-[70px] transition ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-medium uppercase tracking-wider">{dayName}</div>
              <div className="text-sm font-bold mt-0.5">{dayNum}</div>
            </button>
          );
        })}
      </div>

      {/* Daily Progress summary */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-500 font-medium">Session Completion:</span>{' '}
          <span className="font-bold text-slate-900">
            {completedCount} / {dayTasks.length} Done
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-bold text-emerald-600">{progressPct}%</span>
        </div>
      </div>

      {/* Day's Scheduled Slots List */}
      <div className="space-y-3">
        {dayTasks.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No study sessions generated for this date.
            <button
              onClick={handleTriggerGenerate}
              className="block mx-auto mt-2 text-blue-600 font-semibold hover:underline"
            >
              Generate timetable now
            </button>
          </div>
        ) : (
          dayTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border transition ${
                task.isCompleted
                  ? 'bg-slate-50/80 border-slate-200 opacity-65'
                  : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-slate-300 hover:text-emerald-600 transition"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {task.startTime} - {task.endTime}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
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
                  <h3
                    className={`text-xs font-bold mt-1.5 ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {task.subjectName} • {task.chapterName}
                  </p>
                  {task.notes && (
                    <p className="text-[10px] text-slate-400 italic mt-1 bg-slate-50/60 p-1 rounded">
                      Focus: {task.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
