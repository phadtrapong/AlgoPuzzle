export interface Option {
  id: string;
  code: string;
  isCorrect: boolean;
}

export interface Slot {
  id: string;
  options: Option[];
}

export interface Question {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  description: string;
  codeTemplate: string;
  slots: Slot[];
  explanation: string;
}

export interface HistoryItem {
  id: string;
  question: Question;
  dateSolved: string;
}

export type GameState = 'loading' | 'playing' | 'success' | 'error';