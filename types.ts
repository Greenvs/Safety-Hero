export type Screen = 'dashboard' | 'simulation' | 'certificate';

export enum ModuleType {
  FALL = 'Jatuh dari Ketinggian',
  ELECTRICITY = 'Bahaya Listrik',
  FORKLIFT = 'Keselamatan Forklift'
}

export interface UserProgress {
  name: string;
  xp: number;
  level: number;
  completedModules: ModuleType[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface QuizQuestion {
  id: string;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface SimulationState {
  currentQuestionIndex: number;
  score: number;
  questions: QuizQuestion[];
  loading: boolean;
  completed: boolean;
}