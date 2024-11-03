// src/context/SessionContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { StorageService } from '@/services/storage/storageService';
import { UserProgress, UserPreferences, SessionContext as SessionContextType } from '@/services/storage/types';

interface SessionContextValue {
  progress: UserProgress | null;
  preferences: UserPreferences | null;
  sessionData: SessionContextType | null;
  updateProgress: (newProgress: Partial<UserProgress>) => void;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  updateSessionData: (newData: Partial<SessionContextType>) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [sessionData, setSessionData] = useState<SessionContextType | null>(null);

  useEffect(() => {
    // Initialize data from storage
    setProgress(StorageService.getProgress());
    setPreferences(StorageService.getPreferences());
    setSessionData(StorageService.getSessionContext());

    // If no progress exists, initialize with defaults
    if (!StorageService.getProgress()) {
      const initialProgress: UserProgress = {
        currentActivity: '',
        currentCategory: '',
        difficulty: 'mild',
        completedQuestions: [],
        score: 0
      };
      StorageService.saveProgress(initialProgress);
      setProgress(initialProgress);
    }

    // If no preferences exist, initialize with defaults
    if (!StorageService.getPreferences()) {
      const initialPreferences: UserPreferences = {
        preferredCategories: [],
        aiResponseStyle: 'concise',
        voiceEnabled: false
      };
      StorageService.savePreferences(initialPreferences);
      setPreferences(initialPreferences);
    }
  }, []);

  const updateProgress = (newProgress: Partial<UserProgress>) => {
    const updated = { ...progress, ...newProgress } as UserProgress;
    setProgress(updated);
    StorageService.saveProgress(updated);
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs } as UserPreferences;
    setPreferences(updated);
    StorageService.savePreferences(updated);
  };

  const updateSessionData = (newData: Partial<SessionContextType>) => {
    const updated = { ...sessionData, ...newData } as SessionContextType;
    setSessionData(updated);
    StorageService.saveSessionContext(updated);
  };

  const value = {
    progress,
    preferences,
    sessionData,
    updateProgress,
    updatePreferences,
    updateSessionData
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export default SessionContext;
