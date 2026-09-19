import { Subject, Chapter, PWLecture, Exam, Homework, StudyTask, UserProfile, Revision } from '../types';

export const defaultProfile: UserProfile = {
  name: 'Aarav Sharma',
  studentClass: 'Class 10 CBSE',
  dailyStudyHours: 4.5,
  schoolStartTime: '07:30',
  schoolEndTime: '14:00',
  sleepTime: '23:00',
  preferredStudySlot: 'Evening (17:00 - 22:00)',
  pwBatchName: 'PW Udaan 2026',
  targetExamDate: '2027-02-15',
  currentStreak: 14,
  isOnboardingCompleted: true,
};

export const defaultSubjects: Subject[] = [
  { id: 1, name: 'Science', colorHex: '#2563EB', iconName: 'flask' },
  { id: 2, name: 'Mathematics', colorHex: '#059669', iconName: 'calculator' },
  { id: 3, name: 'Social Science', colorHex: '#D97706', iconName: 'globe' },
  { id: 4, name: 'English Language', colorHex: '#7C3AED', iconName: 'book' },
];

export const defaultChapters: Chapter[] = [
  // Science
  { id: 101, subjectId: 1, name: 'Chemical Reactions & Equations', chapterNumber: 1, isCompleted: true, priority: 'HIGH', estimatedHours: 3.5, revisionStage: 'FIRST_REVISION', notes: 'Important redox & balancing rules' },
  { id: 102, subjectId: 1, name: 'Acids, Bases and Salts', chapterNumber: 2, isCompleted: true, priority: 'HIGH', estimatedHours: 4.0, revisionStage: 'SECOND_REVISION', notes: 'Chlor-alkali process & salts pH' },
  { id: 103, subjectId: 1, name: 'Metals and Non-metals', chapterNumber: 3, isCompleted: false, priority: 'MEDIUM', estimatedHours: 4.5, revisionStage: 'NONE', notes: 'Electrolytic refining & reactivity series' },
  { id: 104, subjectId: 1, name: 'Carbon and its Compounds', chapterNumber: 4, isCompleted: false, priority: 'HIGH', estimatedHours: 5.5, revisionStage: 'NONE', notes: 'Covalent bonding & homologous series' },
  { id: 105, subjectId: 1, name: 'Life Processes', chapterNumber: 5, isCompleted: true, priority: 'HIGH', estimatedHours: 6.0, revisionStage: 'FIRST_REVISION', notes: 'Heart circulation, nephron diagram' },
  { id: 106, subjectId: 1, name: 'Control and Coordination', chapterNumber: 6, isCompleted: false, priority: 'MEDIUM', estimatedHours: 4.0, revisionStage: 'NONE', notes: 'Reflex arc & plant hormones' },
  { id: 107, subjectId: 1, name: 'Light – Reflection and Refraction', chapterNumber: 9, isCompleted: false, priority: 'HIGH', estimatedHours: 5.0, revisionStage: 'NONE', notes: 'Mirror & lens ray diagrams, sign convention' },
  { id: 108, subjectId: 1, name: 'Electricity', chapterNumber: 11, isCompleted: false, priority: 'HIGH', estimatedHours: 5.5, revisionStage: 'NONE', notes: "Ohm's law & equivalent resistance" },

  // Mathematics
  { id: 201, subjectId: 2, name: 'Real Numbers', chapterNumber: 1, isCompleted: true, priority: 'MEDIUM', estimatedHours: 3.0, revisionStage: 'FINAL_REVISION', notes: 'Fundamental Theorem of Arithmetic' },
  { id: 202, subjectId: 2, name: 'Polynomials', chapterNumber: 2, isCompleted: true, priority: 'MEDIUM', estimatedHours: 3.5, revisionStage: 'SECOND_REVISION', notes: 'Relationship between zeroes & coefficients' },
  { id: 203, subjectId: 2, name: 'Pair of Linear Equations in 2 Variables', chapterNumber: 3, isCompleted: false, priority: 'HIGH', estimatedHours: 4.5, revisionStage: 'NONE', notes: 'Elimination and substitution methods' },
  { id: 204, subjectId: 2, name: 'Quadratic Equations', chapterNumber: 4, isCompleted: false, priority: 'HIGH', estimatedHours: 5.0, revisionStage: 'NONE', notes: 'Quadratic formula & nature of roots' },
  { id: 205, subjectId: 2, name: 'Arithmetic Progressions', chapterNumber: 5, isCompleted: true, priority: 'MEDIUM', estimatedHours: 4.0, revisionStage: 'FIRST_REVISION', notes: 'nth term and sum of first n terms' },
  { id: 206, subjectId: 2, name: 'Triangles', chapterNumber: 6, isCompleted: false, priority: 'HIGH', estimatedHours: 6.0, revisionStage: 'NONE', notes: 'Basic Proportionality Theorem (BPT)' },
  { id: 207, subjectId: 2, name: 'Introduction to Trigonometry', chapterNumber: 8, isCompleted: false, priority: 'HIGH', estimatedHours: 6.5, revisionStage: 'NONE', notes: 'Trigonometric identities and table' },

  // Social Science
  { id: 301, subjectId: 3, name: 'The Rise of Nationalism in Europe', chapterNumber: 1, isCompleted: true, priority: 'HIGH', estimatedHours: 4.5, revisionStage: 'FIRST_REVISION', notes: 'Unification of Germany and Italy' },
  { id: 302, subjectId: 3, name: 'Nationalism in India', chapterNumber: 2, isCompleted: false, priority: 'HIGH', estimatedHours: 5.0, revisionStage: 'NONE', notes: 'Non-Cooperation and Civil Disobedience' },
  { id: 303, subjectId: 3, name: 'Resources and Development', chapterNumber: 3, isCompleted: true, priority: 'LOW', estimatedHours: 2.5, revisionStage: 'NONE', notes: 'Soil classification & conservation' },
  { id: 304, subjectId: 3, name: 'Power Sharing', chapterNumber: 4, isCompleted: true, priority: 'MEDIUM', estimatedHours: 2.0, revisionStage: 'NONE', notes: 'Belgium and Sri Lanka case studies' },

  // English
  { id: 401, subjectId: 4, name: 'A Letter to God', chapterNumber: 1, isCompleted: true, priority: 'LOW', estimatedHours: 1.5, revisionStage: 'NONE', notes: 'Faith and human nature' },
  { id: 402, subjectId: 4, name: 'Nelson Mandela: Long Walk to Freedom', chapterNumber: 2, isCompleted: false, priority: 'MEDIUM', estimatedHours: 2.0, revisionStage: 'NONE', notes: 'Apartheid and courage' },
];

export const defaultPWLectures: PWLecture[] = [
  { id: 1, subject: 'Physics', chapter: 'Electricity', lectureNumber: 1, lectureTitle: 'Electric Current & Circuit Basics', durationMinutes: 85, lectureDate: '2026-09-15', isCompleted: true, homeworkStatus: true },
  { id: 2, subject: 'Physics', chapter: 'Electricity', lectureNumber: 2, lectureTitle: 'Electric Potential & Potential Difference', durationMinutes: 90, lectureDate: '2026-09-16', isCompleted: true, homeworkStatus: true },
  { id: 3, subject: 'Physics', chapter: 'Electricity', lectureNumber: 3, lectureTitle: "Ohm's Law & Resistance Factors", durationMinutes: 95, lectureDate: '2026-09-17', isCompleted: false, homeworkStatus: false },
  { id: 4, subject: 'Physics', chapter: 'Electricity', lectureNumber: 4, lectureTitle: 'Resistors in Series and Parallel', durationMinutes: 100, lectureDate: '2026-09-18', isCompleted: false, homeworkStatus: false },
  { id: 5, subject: 'Chemistry', chapter: 'Carbon Compounds', lectureNumber: 1, lectureTitle: 'Bonding in Carbon - Covalent Bond', durationMinutes: 75, lectureDate: '2026-09-17', isCompleted: true, homeworkStatus: true },
  { id: 6, subject: 'Chemistry', chapter: 'Carbon Compounds', lectureNumber: 2, lectureTitle: 'Versatile Nature & Homologous Series', durationMinutes: 85, lectureDate: '2026-09-19', isCompleted: false, homeworkStatus: false },
  { id: 7, subject: 'Mathematics', chapter: 'Triangles', lectureNumber: 1, lectureTitle: 'Basic Proportionality Theorem (BPT)', durationMinutes: 90, lectureDate: '2026-09-18', isCompleted: false, homeworkStatus: false },
];

export const defaultExams: Exam[] = [
  { id: 1, name: 'CBSE Class 10 Board Examinations', subjectName: 'All Subjects', examDate: '2027-02-15', targetPercentage: 95, notes: 'Target score: 95%+ across all five subjects' },
  { id: 2, name: 'Pre-Board 1 Exams', subjectName: 'All Subjects', examDate: '2026-12-10', targetPercentage: 90, notes: 'Complete full syllabus revision by Nov 30' },
];

export const defaultHomework: Homework[] = [
  { id: 1, subjectName: 'Mathematics', title: 'NCERT Exercise 6.2 Triangles (Q1-Q8)', dueDate: '2026-09-20', isCompleted: false, estimatedMinutes: 45, priority: 'HIGH' },
  { id: 2, subjectName: 'Science', title: 'PW Electricity DPP 03 Resistance Numericals', dueDate: '2026-09-20', isCompleted: false, estimatedMinutes: 60, priority: 'HIGH' },
  { id: 3, subjectName: 'Social Science', title: 'Map Work: Major Soil Types of India', dueDate: '2026-09-22', isCompleted: true, estimatedMinutes: 30, priority: 'LOW' },
];

export const defaultTasks: StudyTask[] = [
  { id: 1, title: "PW Lecture 03: Ohm's Law & Factors", date: '2026-09-19', startTime: '17:00', endTime: '18:35', subjectName: 'Science', chapterName: 'Electricity', taskType: 'PW_LECTURE', isCompleted: true, priority: 'HIGH', notes: 'Focus on temperature dependence of resistivity' },
  { id: 2, title: "Solve NCERT Intext Questions (Ohm's Law)", date: '2026-09-19', startTime: '18:45', endTime: '19:30', subjectName: 'Science', chapterName: 'Electricity', taskType: 'PRACTICE', isCompleted: false, priority: 'HIGH', notes: 'Solve examples 11.3 to 11.6' },
  { id: 3, title: 'Math BPT Proof & Theorem Practice', date: '2026-09-19', startTime: '19:45', endTime: '21:00', subjectName: 'Mathematics', chapterName: 'Triangles', taskType: 'NEW_LEARNING', isCompleted: false, priority: 'HIGH', notes: 'Master standard theorem statement & figure' },
  { id: 4, title: 'Chemical Reactions Chapter 1 Revision', date: '2026-09-19', startTime: '21:30', endTime: '22:15', subjectName: 'Science', chapterName: 'Chemical Reactions', taskType: 'REVISION', isCompleted: false, priority: 'MEDIUM', notes: 'Active recall on precipitation & redox tests' },
];

export const defaultRevisions: Revision[] = [
  { id: 1, chapterId: 101, chapterName: 'Chemical Reactions & Equations', subjectName: 'Science', stage: 'FIRST_REVISION', scheduledDate: '2026-09-19', isCompleted: false },
  { id: 2, chapterId: 102, chapterName: 'Acids, Bases and Salts', subjectName: 'Science', stage: 'SECOND_REVISION', scheduledDate: '2026-09-21', isCompleted: false },
  { id: 3, chapterId: 201, chapterName: 'Real Numbers', subjectName: 'Mathematics', stage: 'FINAL_REVISION', scheduledDate: '2026-09-24', isCompleted: false },
];
