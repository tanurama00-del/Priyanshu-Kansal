import { Chapter, PWLecture, Homework, StudyTask, Subject, Priority, TaskType } from '../types';

export interface TimetableGenOptions {
  days: number;
  dailyHours: number;
  schoolEndTime: string;
  sleepTime: string;
  prioritizePWBacklog: boolean;
}

export function generateSmartTimetableTasks(
  options: TimetableGenOptions,
  subjects: Subject[],
  chapters: Chapter[],
  pwLectures: PWLecture[],
  homework: Homework[]
): StudyTask[] {
  const tasks: StudyTask[] = [];

  const pendingChapters = [...chapters]
    .filter((c) => !c.isCompleted)
    .sort((a, b) => {
      const priorityVal = (p: Priority) => (p === 'HIGH' ? 3 : p === 'MEDIUM' ? 2 : 1);
      if (priorityVal(b.priority) !== priorityVal(a.priority)) {
        return priorityVal(b.priority) - priorityVal(a.priority);
      }
      return a.chapterNumber - b.chapterNumber;
    });

  const pendingLectures = [...pwLectures].filter((l) => !l.isCompleted);
  const pendingHw = [...homework].filter((h) => !h.isCompleted);

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const baseDate = new Date();

  let idCounter = Date.now();

  for (let day = 0; day < options.days; day++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + day);
    const dateStr = d.toISOString().split('T')[0];

    // Slot 1: 17:00 - 18:30 (1.5h) - PW Lecture or High-Priority Chapter
    if (options.prioritizePWBacklog && pendingLectures.length > 0) {
      const lec = pendingLectures.shift()!;
      tasks.push({
        id: ++idCounter,
        title: `PW [${lec.subject}]: ${lec.lectureTitle}`,
        date: dateStr,
        startTime: '17:00',
        endTime: '18:30',
        subjectName: lec.subject,
        chapterName: lec.chapter,
        taskType: 'PW_LECTURE',
        isCompleted: day === 0, // today's first task done for demo
        priority: 'HIGH',
        notes: `Lecture #${lec.lectureNumber}. Prepare formula flashcard.`,
      });
    } else if (pendingChapters.length > 0) {
      const chap = pendingChapters.shift()!;
      const subName = subjectMap.get(chap.subjectId) || 'Science';
      tasks.push({
        id: ++idCounter,
        title: `Deep Concept Study: ${chap.name}`,
        date: dateStr,
        startTime: '17:00',
        endTime: '18:30',
        subjectName: subName,
        chapterName: chap.name,
        taskType: 'NEW_LEARNING',
        isCompleted: false,
        priority: chap.priority,
        notes: 'Read NCERT textbook line-by-line & highlight key definitions.',
      });
    }

    // Slot 2: 18:45 - 19:45 (1.0h) - Homework / Numerical Practice
    if (pendingHw.length > 0) {
      const hw = pendingHw.shift()!;
      tasks.push({
        id: ++idCounter,
        title: `HW: ${hw.title}`,
        date: dateStr,
        startTime: '18:45',
        endTime: '19:45',
        subjectName: hw.subjectName,
        chapterName: 'Assignments',
        taskType: 'HOMEWORK',
        isCompleted: false,
        priority: hw.priority,
        notes: 'Target step-by-step problem presentation for CBSE board examiner.',
      });
    } else {
      const chap = pendingChapters[0] || chapters[0];
      const subName = subjectMap.get(chap?.subjectId) || 'Mathematics';
      tasks.push({
        id: ++idCounter,
        title: `NCERT Exemplar Practice: ${chap?.name || 'Problem Solving'}`,
        date: dateStr,
        startTime: '18:45',
        endTime: '19:45',
        subjectName: subName,
        chapterName: chap?.name || 'Practice',
        taskType: 'PRACTICE',
        isCompleted: false,
        priority: 'MEDIUM',
        notes: 'Solve 6-8 standard questions without looking at hints.',
      });
    }

    // Slot 3: 20:00 - 21:00 (1.0h) - High Priority Subject
    if (pendingChapters.length > 0) {
      const chap = pendingChapters.shift()!;
      const subName = subjectMap.get(chap.subjectId) || 'Social Science';
      tasks.push({
        id: ++idCounter,
        title: `Study: ${chap.name}`,
        date: dateStr,
        startTime: '20:00',
        endTime: '21:00',
        subjectName: subName,
        chapterName: chap.name,
        taskType: 'NEW_LEARNING',
        isCompleted: false,
        priority: chap.priority,
        notes: 'High weightage topic for annual examinations.',
      });
    }

    // Slot 4: 21:15 - 22:00 (0.75h) - Spaced Revision & Formula Recall
    const completedChap = chapters.find((c) => c.isCompleted);
    tasks.push({
      id: ++idCounter,
      title: `Active Recall Revision: ${completedChap?.name || 'Formula Sheets'}`,
      date: dateStr,
      startTime: '21:15',
      endTime: '22:00',
      subjectName: completedChap ? subjectMap.get(completedChap.subjectId) || 'Science' : 'General',
      chapterName: completedChap?.name || 'Formulas',
      taskType: 'REVISION',
      isCompleted: false,
      priority: 'MEDIUM',
      notes: 'Active recall & memory retention protocol.',
    });
  }

  return tasks;
}
