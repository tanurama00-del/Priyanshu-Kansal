import React from 'react';
import {
  TrendingUp,
  Flame,
  BookOpen,
  PlayCircle,
  FileCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Award
} from 'lucide-react';
import { Subject, Chapter, PWLecture, Homework, UserProfile } from '../types';

interface AnalyticsViewProps {
  subjects: Subject[];
  chapters: Chapter[];
  pwLectures: PWLecture[];
  homework: Homework[];
  profile: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  subjects,
  chapters,
  pwLectures,
  homework,
  profile,
}) => {
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.isCompleted).length;
  const syllabusPct = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const totalPw = pwLectures.length;
  const completedPw = pwLectures.filter((l) => l.isCompleted).length;
  const pwPct = totalPw > 0 ? Math.round((completedPw / totalPw) * 100) : 0;

  const totalHw = homework.length;
  const completedHw = homework.filter((h) => h.isCompleted).length;
  const hwPct = totalHw > 0 ? Math.round((completedHw / totalHw) * 100) : 0;

  // Study hours weekly distribution
  const weeklyData = [
    { day: 'Mon', hours: 4.5, target: 4.5 },
    { day: 'Tue', hours: 5.0, target: 4.5 },
    { day: 'Wed', hours: 4.0, target: 4.5 },
    { day: 'Thu', hours: 5.5, target: 4.5 },
    { day: 'Fri', hours: 3.5, target: 4.5 },
    { day: 'Sat', hours: 6.5, target: 4.5 },
    { day: 'Sun', hours: 5.5, target: 4.5 },
  ];

  const totalWeekHours = weeklyData.reduce((acc, d) => acc + d.hours, 0);

  return (
    <div id="analytics-view" className="space-y-4 pb-20">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Study Analytics</h1>
        <p className="text-xs text-slate-500">Effort, Consistency & Syllabus Trajectory</p>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">Syllabus Completion</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              {syllabusPct}%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {completedChapters}/{totalChapters}
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${syllabusPct}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{profile.currentStreak} Days</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
            Best streak: 18 days
          </span>
        </div>
      </div>

      {/* Weekly Hours Bar Graph */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex justify-between items-center text-xs">
          <div>
            <h3 className="font-bold text-slate-900">Weekly Effort Breakdown</h3>
            <p className="text-slate-500 text-[11px]">Total this week: {totalWeekHours} hours</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Avg: {(totalWeekHours / 7).toFixed(1)} hrs/day
          </span>
        </div>

        <div className="flex items-end justify-between h-36 pt-4 px-2">
          {weeklyData.map((item) => {
            const heightPct = Math.min(100, Math.round((item.hours / 8.0) * 100));
            return (
              <div key={item.day} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] font-mono text-slate-600 font-semibold">
                  {item.hours}h
                </span>
                <div className="w-6 sm:w-8 bg-slate-100 h-24 rounded-t-md relative flex items-end justify-center overflow-hidden">
                  <div
                    className="w-full bg-blue-600 rounded-t-md transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-600">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-Wise Mastery Progress */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Subject-Wise Syllabus Progress
        </h3>
        <div className="space-y-3">
          {subjects.map((sub) => {
            const subChapters = chapters.filter((c) => c.subjectId === sub.id);
            const subCompleted = subChapters.filter((c) => c.isCompleted).length;
            const pct =
              subChapters.length > 0 ? Math.round((subCompleted / subChapters.length) * 100) : 0;

            return (
              <div key={sub.id} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: sub.colorHex }}
                    />
                    {sub.name}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {subCompleted}/{subChapters.length} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ backgroundColor: sub.colorHex, width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PW & Homework Completion KPIs */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5">
          <span className="text-slate-500 font-medium">PW Batch Completion</span>
          <p className="text-xl font-bold text-purple-700">
            {completedPw}/{totalPw} ({pwPct}%)
          </p>
          <span className="text-[11px] text-slate-400">
            {totalPw - completedPw} lectures remaining
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5">
          <span className="text-slate-500 font-medium">DPP / Homework</span>
          <p className="text-xl font-bold text-amber-700">
            {completedHw}/{totalHw} ({hwPct}%)
          </p>
          <span className="text-[11px] text-slate-400">
            {totalHw - completedHw} pending submissions
          </span>
        </div>
      </div>
    </div>
  );
};
