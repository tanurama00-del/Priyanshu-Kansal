import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Target,
  Plus,
  Trash2,
  AlertCircle,
  X
} from 'lucide-react';
import { Exam, Chapter, UserProfile } from '../types';

interface ExamCountdownViewProps {
  exams: Exam[];
  chapters: Chapter[];
  profile: UserProfile;
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
  onDeleteExam: (examId: number) => void;
}

export const ExamCountdownView: React.FC<ExamCountdownViewProps> = ({
  exams,
  chapters,
  profile,
  onAddExam,
  onDeleteExam,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [date, setDate] = useState('2026-12-10');
  const [targetScore, setTargetScore] = useState('95');

  const pendingChapters = chapters.filter((c) => !c.isCompleted);
  const pendingHours = pendingChapters.reduce((acc, c) => acc + c.estimatedHours, 0);

  const primaryExam = exams[0];
  const today = new Date();
  const examDate = new Date(primaryExam?.examDate || profile.targetExamDate || '2027-02-15');
  const daysLeft = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const weeksLeft = Math.max(1, Math.floor(daysLeft / 7));

  const chaptersPerDay = (pendingChapters.length / daysLeft).toFixed(2);
  const hoursPerDay = (pendingHours / daysLeft).toFixed(1);

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddExam({
      name: name.trim(),
      subjectName: subject,
      examDate: date,
      targetPercentage: parseInt(targetScore) || 95,
      notes: 'Scheduled exam milestone',
    });

    setName('');
    setShowAddModal(false);
  };

  return (
    <div id="exam-countdown-view" className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Exam Countdown</h1>
          <p className="text-xs text-slate-500">Board Exam Pacing & Strategic Milestones</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Target Exam
        </button>
      </div>

      {/* Main Hero Countdown */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-lg space-y-4">
        <div>
          <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">
            Primary Target Milestone
          </span>
          <h2 className="text-lg font-bold mt-0.5">
            {primaryExam?.name || 'CBSE Class 10 Board Examination'}
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">Scheduled Date: {primaryExam?.examDate || '2027-02-15'}</p>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-black tracking-tight">{daysLeft}</span>
          <div className="text-sm">
            <span className="font-bold text-white block">Days Remaining</span>
            <span className="text-blue-200 text-xs">({weeksLeft} weeks left to prepare)</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/20 flex justify-between text-xs text-blue-100">
          <span>Target Score: {primaryExam?.targetPercentage || 95}%</span>
          <span>Buffer Phase: 45 Days for Full Mocks</span>
        </div>
      </div>

      {/* Pacing Metrics 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 font-medium">Pending Chapters</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{pendingChapters.length}</p>
          <span className="text-[11px] text-slate-400">Chapters remaining in syllabus</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 font-medium">Required Pace</span>
          <p className="text-xl font-bold text-blue-600 mt-1">{chaptersPerDay} / day</p>
          <span className="text-[11px] text-slate-400">Pace to finish before exams</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 font-medium">Remaining Workload</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{pendingHours.toFixed(0)} hrs</p>
          <span className="text-[11px] text-slate-400">Total estimated study hours</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 font-medium">Daily Study Target</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{hoursPerDay} hrs/day</p>
          <span className="text-[11px] text-slate-400">Suggested daily hours</span>
        </div>
      </div>

      {/* Scheduled Exams List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Scheduled Exam Milestones</h3>
        {exams.map((exam) => {
          const eDate = new Date(exam.examDate);
          const diffDays = Math.max(1, Math.ceil((eDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
          return (
            <div
              key={exam.id}
              className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900">{exam.name}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span className="font-mono">{exam.examDate}</span>
                  <span>•</span>
                  <span>Target: {exam.targetPercentage}%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-600">{diffDays}</span>
                  <span className="text-[10px] text-slate-400 block">days left</span>
                </div>
                {exams.length > 1 && (
                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Add Target Exam</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateExam} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Assessment / Pre-Board 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Score (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
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
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
