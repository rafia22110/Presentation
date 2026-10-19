export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface SlideData {
  id: number;
  navLabel: string;
  badge: string;
  holoTitle: string;
  subTitle: string;
  title: string;
  emoji: string;
  verse: string;
  story: string;
  noaAdvice: string; // Special friendly message from female guide Noa
  createdItems: string[];
  magicText: string;
  question: string;
  options: QuizOption[];
}

export interface GameQuestion {
  id: number;
  emoji: string;
  name: string;
  day: number;
  dayHebrewName: string;
  hint: string;
}

export interface DictionaryWord {
  id: number;
  word: string;
  day: number;
  dayLabel: string;
  emoji: string;
  simpleMeaning: string;
  kidExample: string;
  verseQuote: string;
}

export type ViewMode = '3d' | 'pixel' | 'both';
