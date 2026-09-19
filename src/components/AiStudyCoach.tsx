import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { UserProfile, Chapter, PWLecture, Homework, ChatMessage } from '../types';
import { analyzeStudyState, generateCoachResponse } from '../utils/aiCoachLogic';

interface AiStudyCoachProps {
  profile: UserProfile;
  chapters: Chapter[];
  pwLectures: PWLecture[];
  homework: Homework[];
}

export const AiStudyCoach: React.FC<AiStudyCoachProps> = ({
  profile,
  chapters,
  pwLectures,
  homework,
}) => {
  const analysis = analyzeStudyState(chapters, pwLectures, homework, profile);

  const initialCoachGreeting: ChatMessage = {
    id: 'welcome',
    sender: 'coach',
    message: `Hello ${profile.name}! 👋 I am your **StudyOS AI Coach**. I have analyzed your CBSE Class 10 syllabus, PW batch lectures, and exam date (${analysis.daysUntilExam} days away).\n\nAsk me anything about what to study today, how to clear your ${analysis.pwBacklogCount} PW backlog lectures, or how to pace your revision!`,
    timestamp: 'Just now',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialCoachGreeting]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const quickPrompts = [
    'What should I study today?',
    'Triage my PW backlog',
    'Am I behind schedule?',
    'When and how should I revise?',
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const responseText = generateCoachResponse(q, analysis, profile);
      const coachMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        message: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachMsg]);
      setIsThinking(false);
    }, 450);
  };

  return (
    <div id="ai-coach-view" className="flex flex-col h-[calc(100vh-140px)] pb-2">
      {/* Top Header Card */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs mb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">AI Study Coach</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Offline Rule Engine • Zero Data Leakage</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Target Pace</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {analysis.requiredDailyHours} hrs/day
            </span>
          </div>
        </div>

        {/* Live Diagnostics Pill Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-slate-500 block">Exam Days</span>
            <span className="font-bold text-slate-900">{analysis.daysUntilExam} Days</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-slate-500 block">PW Backlog</span>
            <span className="font-bold text-purple-700">{analysis.pwBacklogCount} Lectures</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-slate-500 block">Schedule Status</span>
            <span
              className={`font-bold ${
                analysis.isBehindSchedule ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {analysis.isBehindSchedule ? 'Needs Sprint' : 'On Track'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-medium">{msg.message}</div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit text-xs text-slate-500 shadow-2xs">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse delay-150" />
            <span className="ml-1">AI Coach is analyzing syllabus & backlog...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="py-2 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-2xs transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 items-center shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI Coach study strategy, pacing, backlog..."
          className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
