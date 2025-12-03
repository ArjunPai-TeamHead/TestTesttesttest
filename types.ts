
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for credential auth
  role: UserRole | null;
  avatar: string;
  bio?: string;
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  summary?: string;
  tags: string[];
  createdAt: string;
  authorId: string;
  isPublic?: boolean; // For teacher notes
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  room: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  role: UserRole;
}

export interface Grade {
  id: string;
  studentId?: string; // For teacher view
  studentName?: string;
  subject: string;
  score: number;
  total: number;
  testName: string;
  remarks?: string;
  grade?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}
