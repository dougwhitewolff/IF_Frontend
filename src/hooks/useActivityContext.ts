// src/hooks/useActivityContext.ts

import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage/storageService';
import { 
  UserProgress, 
  UserPreferences, 
  SessionContext, 
  ActivityMetrics 
} from '../services/storage/types';

export function useActivityContext(activityId: string) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);

  // Load initial state
  useEffect(() => {
    setProgress(StorageService.getProgress());
    setPreferences(StorageService.getPreferences());
    setSessionContext(StorageService.getSessionContext());
  }, []);

  // Initialize progress if none exists
  useEffect(() => {
    if (!progress) {
      const initialProgress: UserProgress = {
        currentActivity: activityId,
        currentCategory: '',
        difficulty: 'mild',
        completedQuestions: [],
        score: 0,
        streakCount: 0
      };
      setProgress(initialProgress);
      StorageService.saveProgress(initialProgress);
    }
  }, [activityId, progress]);

  // Progress management
  const updateProgress = useCallback((newProgress: Partial<UserProgress>) => {
    const updated = { ...progress, ...newProgress } as UserProgress;
    setProgress(updated);
    StorageService.saveProgress(updated);
  }, [progress]);

  // Preferences management
  const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs } as UserPreferences;
    setPreferences(updated);
    StorageService.savePreferences(updated);
  }, [preferences]);

  // Conversation management
  const addToConversation = useCallback((message: string) => {
    StorageService.updateConversationHistory(message);
    setSessionContext(StorageService.getSessionContext());
  }, []);

  // Activity metrics
  const recordAttempt = useCallback((success: boolean, timeSpent: number) => {
    StorageService.updateMetrics(activityId, success, timeSpent);
  }, [activityId]);

  // Difficulty management
  const adjustDifficulty = useCallback(() => {
    if (!progress) return;

    const successRate = progress.score / progress.completedQuestions.length;
    let newDifficulty = progress.difficulty;

    if (successRate > 0.8 && progress.difficulty === 'mild') {
      newDifficulty = 'medium';
    } else if (successRate > 0.8 && progress.difficulty === 'medium') {
      newDifficulty = 'spicy';
    } else if (successRate < 0.4 && progress.difficulty === 'spicy') {
      newDifficulty = 'medium';
    } else if (successRate < 0.4 && progress.difficulty === 'medium') {
      newDifficulty = 'mild';
    }

    if (newDifficulty !== progress.difficulty) {
      updateProgress({ difficulty: newDifficulty });
    }
  }, [progress, updateProgress]);

  return {
    progress,
    preferences,
    sessionContext,
    updateProgress,
    updatePreferences,
    addToConversation,
    recordAttempt,
    adjustDifficulty
  };
}
