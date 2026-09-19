import React, { useState } from 'react';
import {
  Video,
  PlayCircle,
  CheckCircle2,
  Circle,
  FileCheck,
  Search,
  Plus,
  Clock,
  AlertCircle,
  Calendar,
  Sparkles,
  X
} from 'lucide-react';
import { PWLecture, UserProfile } from '../types';

interface PwBatchTrackerProps {
  lectures: PWLecture[];
  profile: UserProfile;
  onToggleLecture: (lectureId: number) => void;
  onToggleHomework: (lectureId: number) => void;
  onAddLecture: (lecture: Omit<PWLecture, 'id'>) => void;
}

export const PwBatchTracker: React.FC<PwBatchTrackerProps> = ({
  lectures,
  profile,
  onToggleLecture,
  onToggleHomework,
  onAddLecture,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<'ALL' | 'Physics' | 'Chemistry' | 'Mathematics'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [lectureNum, setLectureNum] = useState(1);
  const [duration, setDuration] = useState('90');

  const filteredLectures = lectures.filter((lec) => {
    if (subjectFilter !== 'ALL' && lec.subject !== subjectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lec.lectureTitle.toLowerCase().includes(q) ||
        lec.chapter.toLowerCase().includes(q) ||
        lec.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingLectures = lectures.filter((l) => !l.isCompleted);
  const totalBacklogHours = (
    pendingLectures.reduce((acc, l) => acc + l.durationMinutes, 0) / 60
  ).toFixed(1);
  const completedCount = lectures.filter((l) => l.isCompleted).length;
  const progressPct = lectures.length > 0 ? Math.round((completedCount / lectures.length) * 100) : 0;

  const handleCreateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter.trim() || !title.trim()) return;

    onAddLecture({
      subject,
      chapter: chapter.trim(),
      lectureNumber: Number(lectureNum) || 1,
      lectureTitle: title.trim(),
      durationMinutes: parseInt(duration) || 90,
      lectureDate: new Date().toISOString().split('T')[0],
      isCompleted: false,
      homeworkStatus: false,
    });

    setChapter('');
    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div id="pw-batch-tracker-view" className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">PW Batch Tracker</h1>
            <span className="text-[11px] px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded-full">
              {profile.pwBatchName || 'PW Udaan 2026'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Physics Wallah Daily Lectures & DPP Tracker</p>
        </div>
        <button
          id="add-pw-lecture-btn"
          onClick={() => setShowAddModal(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold shadow-xs flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Lecture
        </button>
      </div>

      {/* PW Backlog Assistant Banner */}
      <div className="p-4 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-950 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-purple-600" />
            PW Backlog Assistant
          </div>
          <span className="text-[11px] font-semibold bg-purple-200/70 text-purple-800 px-2 py-0.5 rounded-full">
            {pendingLectures.length} Lectures in Backlog (~{totalBacklogHours} hrs)
          </span>
        </div>
        <p className="text-xs text-purple-900 leading-relaxed">
          {pendingLectures.length > 0
            ? `Recommended Catch-up Pace: Watch 1 backlog lecture daily at 1.25x speed during evening study slot. Prioritize physics numericals first.`
            : `Phenomenal discipline! You have zero PW lecture backlog. Focus on solving DPPs and chapter-end tests.`}
        </p>
      </div>

      {/* Progress & Stats */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700">
            Batch Completion: {completedCount} / {lectures.length} Watched
          </span>
          <span className="font-bold text-purple-600">{progressPct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-purple-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Search & Subject Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search lectures, topics, chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {(['ALL', 'Physics', 'Chemistry', 'Mathematics'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  subjectFilter === sub
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lectures List */}
      <div className="space-y-2.5">
        {filteredLectures.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No lectures found for this filter.
          </div>
        ) : (
          filteredLectures.map((lec) => (
            <div
              key={lec.id}
              className={`p-3.5 rounded-xl border transition ${
                lec.isCompleted
                  ? 'bg-slate-50/80 border-slate-200 opacity-70'
                  : 'bg-white border-slate-200/90 shadow-2xs hover:border-purple-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleLecture(lec.id)}
                  className="mt-0.5 text-slate-300 hover:text-purple-600 transition"
                >
                  {lec.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-purple-600 fill-purple-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {lec.subject} • Lec {lec.lectureNumber}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {lec.durationMinutes} mins
                    </span>
                  </div>
                  <h3
                    className={`text-xs font-semibold mt-1 ${
                      lec.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {lec.lectureTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">Chapter: {lec.chapter}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onToggleHomework(lec.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded transition ${
                        lec.homeworkStatus
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{lec.homeworkStatus ? 'DPP Completed' : 'Pending DPP / HW'}</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">{lec.lectureDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Lecture Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Add PW Lecture</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLecture} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lecture Number</label>
                  <input
                    type="number"
                    min="1"
                    value={lectureNum}
                    onChange={(e) => setLectureNum(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electricity"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Series and Parallel Combination Numericals"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="240"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
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
                  className="px-4 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
};
