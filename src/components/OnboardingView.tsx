import React, { useState } from 'react';
import { Sparkles, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingViewProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [name, setName] = useState('Aarav Sharma');
  const [studentClass, setStudentClass] = useState('Class 10 CBSE');
  const [dailyHours, setDailyHours] = useState('4.5');
  const [pwBatch, setPwBatch] = useState('PW Udaan 2026');
  const [examDate, setExamDate] = useState('2027-02-15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name: name.trim() || 'Class 10 Scholar',
      studentClass: studentClass.trim() || 'Class 10 CBSE',
      dailyStudyHours: parseFloat(dailyHours) || 4.5,
      pwBatchName: pwBatch.trim() || 'PW Udaan 2026',
      targetExamDate: examDate,
      isOnboardingCompleted: true,
    });
  };

  return (
    <div id="onboarding-flow" className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome to StudyOS AI
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Offline-first study planner, PW batch companion, and intelligent syllabus scheduler for
            Class 10 students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Class / Board</label>
              <input
                type="text"
                required
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Daily Study Target</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="12"
                required
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Physics Wallah Batch</label>
            <input
              type="text"
              required
              value={pwBatch}
              onChange={(e) => setPwBatch(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Board Exam Date</label>
            <input
              type="date"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2 text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Preloads authentic Class 10 CBSE Science, Maths, Social Science, English syllabus and PW
              Udaan batch sample data.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Launch Personalized StudyOS</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
