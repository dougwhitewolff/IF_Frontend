// src/services/storage/types.ts

export interface UserProgress {
  currentActivity: string;
  currentCategory: string;
  difficulty: 'mild' | 'medium' | 'spicy';
  completedQuestions: string[];
  score: number;
  lastQuestionTimestamp?: string;
  streakCount?: number;
}

export interface UserPreferences {
  preferredCategories: string[];
  aiResponseStyle: 'concise' | 'detailed';
  voiceEnabled: boolean;
  theme?: 'light' | 'dark';
}

export interface SessionContext {
  lastInteraction: string;
  currentConversation: string[];
  temporaryState: Record<string, any>;
  activeStreak?: boolean;
}

export interface ActivityMetrics {
  totalAttempts: number;
  successRate: number;
  averageTime: number;
  lastAttempt: string;
}

export interface StorageKeys {
  PROGRESS_KEY: string;
  PREFS_KEY: string;
  SESSION_KEY: string;
  METRICS_KEY: string;
}
