import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Calendar,
  AlertCircle,
  FileCheck,
  Video,
  BookOpen,
  X
} from 'lucide-react';
import { StudyTask, UserProfile, Priority, TaskType } from '../types';

interface DailyPlannerProps {
  tasks: StudyTask[];
  profile: UserProfile;
  onToggleTask: (taskId: number) => void;
  onAddTask: (task: Omit<StudyTask, 'id'>) => void;
  onRescheduleTask: (taskId: number, newDate: string) => void;
}

export const DailyPlanner: React.FC<DailyPlannerProps> = ({
  tasks,
  profile,
  onToggleTask,
  onAddTask,
  onRescheduleTask,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.date === todayStr || !t.date);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Science');
  const [newStart, setNewStart] = useState('17:00');
  const [newEnd, setNewEnd] = useState('18:00');
  const [newType, setNewType] = useState<TaskType>('NEW_LEARNING');
  const [newPriority, setNewPriority] = useState<Priority>('HIGH');

  const completedCount = todayTasks.filter((t) => t.isCompleted).length;
  const progressPct =
    todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      date: todayStr,
      startTime: newStart,
      endTime: newEnd,
      subjectName: newSubject,
      chapterName: 'General',
      taskType: newType,
      isCompleted: false,
      priority: newPriority,
      notes: 'Custom scheduled task',
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div id="daily-planner-view" className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Today's Planner</h1>
          <p className="text-xs text-slate-500">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>

      {/* Daily Progress Gauge Card */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-medium">Daily Target Progress</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">{progressPct}%</span>
            <span className="text-xs text-slate-500">
              ({completedCount} of {todayTasks.length} tasks completed)
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Target: {profile.dailyStudyHours} hours today
          </span>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-600 transition-all duration-500 stroke-current"
              strokeWidth="3.5"
              strokeDasharray={`${progressPct}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-xs font-bold text-slate-800">{completedCount}</span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {todayTasks.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No study sessions found for today. Add a new task or generate your timetable.
          </div>
        ) : (
          todayTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border transition ${
                task.isCompleted
                  ? 'bg-slate-50 border-slate-200 opacity-60'
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
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {task.startTime} - {task.endTime}
                    </span>
                    <div className="flex items-center gap-1.5">
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
                  </div>
                  <h3
                    className={`text-xs font-semibold mt-1 ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {task.subjectName} • {task.chapterName}
                  </p>
                  {task.notes && (
                    <p className="text-[10px] text-slate-400 italic mt-1">Focus: {task.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Add Study Session</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Chapter 4 Notes & Numericals"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Social Science">Social Science</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TaskType)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="NEW_LEARNING">New Learning</option>
                    <option value="PRACTICE">Practice & Numericals</option>
                    <option value="PW_LECTURE">PW Lecture</option>
                    <option value="REVISION">Revision</option>
                    <option value="HOMEWORK">Homework / DPP</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
