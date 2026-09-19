import { Chapter, PWLecture, Homework, UserProfile } from '../types';

export interface CoachAnalysisResult {
  daysUntilExam: number;
  totalChapters: number;
  completedChapters: number;
  pendingChapters: Chapter[];
  highPriorityPending: Chapter[];
  pwBacklogCount: number;
  pwBacklogHours: number;
  pendingHomeworkCount: number;
  requiredDailyHours: number;
  isBehindSchedule: boolean;
  recommendedTodayFocus: string;
  actionSteps: string[];
}

export function analyzeStudyState(
  chapters: Chapter[],
  pwLectures: PWLecture[],
  homework: Homework[],
  profile: UserProfile
): CoachAnalysisResult {
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.isCompleted).length;
  const pendingChapters = chapters.filter((c) => !c.isCompleted);
  const highPriorityPending = pendingChapters.filter((c) => c.priority === 'HIGH');

  const today = new Date();
  const examDate = new Date(profile.targetExamDate || '2027-02-15');
  const diffTime = Math.max(1, examDate.getTime() - today.getTime());
  const daysUntilExam = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const pendingPW = pwLectures.filter((l) => !l.isCompleted);
  const pwBacklogCount = pendingPW.length;
  const pwBacklogHours = pendingPW.reduce((acc, l) => acc + l.durationMinutes / 60, 0);

  const pendingHomeworkCount = homework.filter((h) => !h.isCompleted).length;

  const remainingStudyHours =
    pendingChapters.reduce((acc, c) => acc + c.estimatedHours, 0) + pwBacklogHours;

  const requiredDailyHours = Math.max(
    profile.dailyStudyHours,
    Number((remainingStudyHours / daysUntilExam).toFixed(1))
  );

  const isBehindSchedule =
    pendingChapters.length / Math.max(1, totalChapters) > 0.45 && daysUntilExam < 160;

  const topPriority = highPriorityPending[0]?.name || pendingChapters[0]?.name || 'Revision & PYQs';

  const actionSteps: string[] = [];
  if (highPriorityPending.length > 0) {
    actionSteps.push(`Focus on High Priority chapter: ${highPriorityPending[0].name}`);
  }
  if (pwBacklogCount > 0) {
    actionSteps.push(`Clear 1 PW Lecture from backlog today (${pendingPW[0]?.lectureTitle})`);
  }
  if (pendingHomeworkCount > 0) {
    actionSteps.push(`Submit pending homework/DPP before night session`);
  }
  actionSteps.push(`Spend 30 mins active recall on previous formulas`);

  return {
    daysUntilExam,
    totalChapters,
    completedChapters,
    pendingChapters,
    highPriorityPending,
    pwBacklogCount,
    pwBacklogHours: Number(pwBacklogHours.toFixed(1)),
    pendingHomeworkCount,
    requiredDailyHours,
    isBehindSchedule,
    recommendedTodayFocus: `Master '${topPriority}' + eliminate PW backlog sprint`,
    actionSteps,
  };
}

export function generateCoachResponse(
  query: string,
  analysis: CoachAnalysisResult,
  profile: UserProfile
): string {
  const q = query.toLowerCase().trim();
  const highPriorityNames = analysis.highPriorityPending
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ');

  if (q.includes('today') || q.includes('what to study') || q.includes('target')) {
    return [
      `🎯 **Personalized Daily Study Directive for ${profile.name}**:`,
      '',
      `1. **Prime Core Focus (2.0 hrs)**: Study high-yield chapter **${analysis.highPriorityPending[0]?.name || 'Triangles'}**. Practice NCERT examples without looking at solutions.`,
      `2. **PW Backlog Sprint (1.5 hrs)**: ${analysis.pwBacklogCount > 0 ? `Watch pending lecture '${analysis.pwBacklogCount} lectures in backlog'. Watch at 1.25x speed and make handwritten short notes.` : `Great job! You have zero PW lecture backlog. Focus on chapter-end tests.`}`,
      `3. **Homework / DPP (45 mins)**: You have **${analysis.pendingHomeworkCount} pending assignments**. Complete and check off before 21:00.`,
      `4. **Night Recall (30 mins)**: Formulas and chemical reaction equations flashcard self-testing.`,
      '',
      `⏱️ **Recommended Study Time Today**: **${analysis.requiredDailyHours} hours**. Keep your ${profile.currentStreak}-day study streak alive! 🔥`,
    ].join('\n');
  }

  if (q.includes('backlog') || q.includes('pw') || q.includes('lecture')) {
    return [
      `⚡ **PW Batch & Backlog Annihilation Plan**:`,
      '',
      `• **Current Backlog**: **${analysis.pwBacklogCount} lectures** (~${analysis.pwBacklogHours} hours) and **${analysis.pendingHomeworkCount} pending assignments**.`,
      '',
      `• **Golden Rule 1 — Stop Accumulation**: NEVER miss today's scheduled live lecture to catch up on old ones. Always prioritize the current flow!`,
      `• **Golden Rule 2 — The 1.25x Rule**: Watch backlog concept videos at 1.25x or 1.5x speed. Focus on questions asked in class; don't pause unnecessarily.`,
      `• **Golden Rule 3 — Weekend Sprints**: Reserve Saturday & Sunday 08:00–12:00 exclusively to clear 2 backlog lectures each weekend.`,
      `• **Top Priority Lecture**: Complete high-weightage topics like Electricity & Triangles first before descriptive theory chapters.`,
    ].join('\n');
  }

  if (q.includes('behind') || q.includes('schedule') || q.includes('status') || q.includes('pace')) {
    if (analysis.isBehindSchedule) {
      return [
        `⚠️ **Pacing Diagnostic Alert**:`,
        '',
        `You are currently **slightly behind the ideal timeline** for the CBSE Class 10 Board exam (${analysis.daysUntilExam} days remaining).`,
        '',
        `• **Chapters Remaining**: **${analysis.pendingChapters.length}** of ${analysis.totalChapters}`,
        `• **Required Completion Rate**: ~${(analysis.pendingChapters.length / Math.max(1, analysis.daysUntilExam / 7)).toFixed(1)} chapters per week`,
        `• **Recommendation**: Increase your daily study target from ${profile.dailyStudyHours}h to **${(profile.dailyStudyHours + 0.75).toFixed(1)}h**. Cut non-essential screen time and make your 17:00–21:00 evening slot strictly non-negotiable.`,
      ].join('\n');
    } else {
      return [
        `✅ **Pacing Diagnostic**: You are **on track**!`,
        '',
        `With **${analysis.daysUntilExam} days** until the board exam and **${analysis.completedChapters}/${analysis.totalChapters} chapters completed**, you are positioned well within the top percentile pace.`,
        '',
        `Keep maintaining your **${analysis.requiredDailyHours} hours/day** target to leave a solid 45-day buffer for full-length mock tests and 3 revision cycles!`,
      ].join('\n');
    }
  }

  if (q.includes('revise') || q.includes('revision') || q.includes('forget')) {
    return [
      `🧠 **Scientific Spaced-Repetition System (For Class 10)**:`,
      '',
      `The human brain forgets 70% of new information within 48 hours without retrieval practice. Follow this 4-stage system:`,
      '',
      `1. **Stage 1 (Day 1 after finishing chapter)**: Blank sheet test — write down all formulas, definitions, and ray diagrams from memory without opening the textbook.`,
      `2. **Stage 2 (Day 7)**: Solve 10 Previous Year Questions (PYQs) and mark any weak areas in red.`,
      `3. **Stage 3 (Day 21)**: Speed test: 5 high-difficulty numericals in under 20 minutes.`,
      `4. **Stage 4 (Day 60)**: Full timed 3-hour chapter test matching CBSE board presentation layout.`,
      '',
      `Check your **Revision Planner** tab to see which chapters are due for Stage 1 & Stage 2 revision this week.`,
    ].join('\n');
  }

  // General fallback reasoning
  return [
    `🤖 **StudyOS AI Strategy Recommendation**:`,
    '',
    `• **Exam Target**: CBSE Class 10 Board Exam (**${analysis.daysUntilExam} days away**)`,
    `• **Syllabus Progress**: ${analysis.completedChapters}/${analysis.totalChapters} chapters done (${Math.round((analysis.completedChapters / Math.max(1, analysis.totalChapters)) * 100)}%)`,
    `• **High-Yield Priorities**: ${highPriorityNames || 'All high-priority chapters completed!'}`,
    `• **Immediate Action**: ${analysis.recommendedTodayFocus}`,
    '',
    `💡 *Pro Tip*: Use 50-minute focused pomodoros with 10-minute active stretch breaks. Study Math or Physics problem-solving in the first block when alertness is peak!`,
  ].join('\n');
}
