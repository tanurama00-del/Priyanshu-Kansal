export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type RevisionStage = 'NONE' | 'FIRST_REVISION' | 'SECOND_REVISION' | 'THIRD_REVISION' | 'FINAL_REVISION';

export type TaskType = 'NEW_LEARNING' | 'PRACTICE' | 'REVISION' | 'HOMEWORK' | 'PW_LECTURE';

export interface Subject {
  id: number;
  name: string;
  colorHex: string;
  iconName: string;
}

export interface Chapter {
  id: number;
  subjectId: number;
  name: string;
  chapterNumber: number;
  isCompleted: boolean;
  priority: Priority;
  estimatedHours: number;
  revisionStage: RevisionStage;
  notes: string;
}

export interface StudyTask {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  subjectName: string;
  chapterName: string;
  taskType: TaskType;
  isCompleted: boolean;
  priority: Priority;
  notes?: string;
}

export interface PWLecture {
  id: number;
  subject: string;
  chapter: string;
  lectureNumber: number;
  lectureTitle: string;
  durationMinutes: number;
  lectureDate: string; // YYYY-MM-DD
  isCompleted: boolean;
  homeworkStatus: boolean;
}

export interface Exam {
  id: number;
  name: string;
  subjectName: string;
  examDate: string; // YYYY-MM-DD
  targetPercentage: number;
  notes?: string;
}

export interface Revision {
  id: number;
  chapterId: number;
  chapterName: string;
  subjectName: string;
  stage: RevisionStage;
  scheduledDate: string;
  isCompleted: boolean;
}

export interface Homework {
  id: number;
  subjectName: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  estimatedMinutes: number;
  priority: Priority;
}

export interface UserProfile {
  name: string;
  studentClass: string;
  dailyStudyHours: number;
  schoolStartTime: string;
  schoolEndTime: string;
  sleepTime: string;
  preferredStudySlot: string;
  pwBatchName: string;
  targetExamDate: string;
  currentStreak: number;
  isOnboardingCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  message: string;
  timestamp: string;
}
