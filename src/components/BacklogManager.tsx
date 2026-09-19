import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Circle,
  Video,
  BookOpen,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Chapter, PWLecture, Homework, StudyTask } from '../types';

interface BacklogManagerProps {
  chapters: Chapter[];
  pwLectures: PWLecture[];
  homework: Homework[];
  onToggleChapter: (id: number) => void;
  onToggleLecture: (id: number) => void;
  onToggleHomework: (id: number) => void;
  onAutoScheduleBacklog: () => void;
}

export const BacklogManager: React.FC<BacklogManagerProps> = ({
  chapters,
  pwLectures,
  homework,
  onToggleChapter,
  onToggleLecture,
  onToggleHomework,
  onAutoScheduleBacklog,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PW' | 'CHAPTERS' | 'HW'>('ALL');

  const pendingChapters = chapters.filter((c) => !c.isCompleted && c.priority === 'HIGH');
  const pendingLectures = pwLectures.filter((l) => !l.isCompleted);
  const pendingHw = homework.filter((h) => !h.isCompleted);

  const totalBacklogCount = pendingChapters.length + pendingLectures.length + pendingHw.length;
  const totalBacklogHours = (
    pendingChapters.reduce((acc, c) => acc + c.estimatedHours, 0) +
    pendingLectures.reduce((acc, l) => acc + l.durationMinutes / 60, 0) +
    pendingHw.reduce((acc, h) => acc + h.estimatedMinutes / 60, 0)
  ).toFixed(1);

  return (
    <div id="backlog-manager-view" className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Backlog Manager</h1>
          <p className="text-xs text-slate-500">Triage & Eliminate Pending Academic Workload</p>
        </div>
        <button
          onClick={onAutoScheduleBacklog}
          className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs flex items-center gap-1 active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Auto-Schedule All
        </button>
      </div>

      {/* Summary Alert Banner */}
      <div
        className={`p-4 rounded-xl border ${
          totalBacklogCount > 0
            ? 'bg-rose-50 border-rose-200/90 text-rose-950'
            : 'bg-emerald-50 border-emerald-200/90 text-emerald-950'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertTriangle
              className={`w-4 h-4 ${totalBacklogCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}
            />
            {totalBacklogCount > 0 ? 'Action Required: Active Backlog' : 'Zero Academic Backlog!'}
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/70 shadow-2xs">
            {totalBacklogCount} Items • ~{totalBacklogHours} Hours Workload
          </span>
        </div>
        <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
          {totalBacklogCount > 0
            ? 'Your Smart Timetable algorithm automatically gives highest slot priority to high-weightage backlog chapters and PW lectures.'
            : 'Outstanding consistency! All high-priority syllabus chapters, PW batch classes, and homework are up to date.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All ({totalBacklogCount})
        </button>
        <button
          onClick={() => setActiveTab('PW')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'PW'
              ? 'bg-purple-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          PW ({pendingLectures.length})
        </button>
        <button
          onClick={() => setActiveTab('CHAPTERS')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'CHAPTERS'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Chapters ({pendingChapters.length})
        </button>
        <button
          onClick={() => setActiveTab('HW')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'HW'
              ? 'bg-amber-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          HW ({pendingHw.length})
        </button>
      </div>

      {/* Backlog Items List */}
      <div className="space-y-2.5">
        {/* PW Lectures */}
        {(activeTab === 'ALL' || activeTab === 'PW') &&
          pendingLectures.map((lec) => (
            <div
              key={`lec-${lec.id}`}
              className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-purple-200 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Video className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    PW {lec.subject} • Lecture {lec.lectureNumber}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Est: {lec.durationMinutes}m
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{lec.lectureTitle}</h4>
                <p className="text-[11px] text-slate-500">Chapter: {lec.chapter}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    PRIORITY: HIGH
                  </span>
                  <button
                    onClick={() => onToggleLecture(lec.id)}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Mark Watched ✓
                  </button>
                </div>
              </div>
            </div>
          ))}

        {/* Chapters */}
        {(activeTab === 'ALL' || activeTab === 'CHAPTERS') &&
          pendingChapters.map((chap) => (
            <div
              key={`chap-${chap.id}`}
              className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-200 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Board Core Syllabus
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Est: {chap.estimatedHours} hrs
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{chap.name}</h4>
                <p className="text-[11px] text-slate-500">Weightage: Essential for 95% target</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    PRIORITY: {chap.priority}
                  </span>
                  <button
                    onClick={() => onToggleChapter(chap.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Mark Done ✓
                  </button>
                </div>
              </div>
            </div>
          ))}

        {/* Homework */}
        {(activeTab === 'ALL' || activeTab === 'HW') &&
          pendingHw.map((hw) => (
            <div
              key={`hw-${hw.id}`}
              className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-200 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {hw.subjectName} Homework
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Due: {hw.dueDate}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{hw.title}</h4>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Est: {hw.estimatedMinutes} mins
                  </span>
                  <button
                    onClick={() => onToggleHomework(hw.id)}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                  >
                    Submit Assignment ✓
                  </button>
                </div>
              </div>
            </div>
          ))}

        {totalBacklogCount === 0 && (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No backlog items found! All tasks are currently on schedule.
          </div>
        )}
      </div>
    </div>
  );
};
