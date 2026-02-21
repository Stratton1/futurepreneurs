// Types for the Educational Hub / Learning Platform

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface LessonTask {
  id: string;
  title: string;
  description: string;
  type: 'reflection' | 'research' | 'exercise' | 'download';
  downloadUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  readingTime: number; // minutes
  content: string; // markdown
  quiz?: QuizQuestion[];
  tasks?: LessonTask[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  colour: string; // tailwind colour class (e.g. 'emerald', 'blue')
  sectionNumber: number;
  lessons: Lesson[];
}

export interface LearningProgress {
  id: string;
  user_id: string;
  module_id: string;
  lesson_id: string;
  completed_at: string;
  score: number | null;
}
