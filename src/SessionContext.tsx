'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SessionData {
  currentActivity: string;
  difficultyLevel: number;
  attempts: {
    [activityId: string]: {
      count: number;
      successRate: number;
      lastAttempt: string;
    };
  };
  preferences: {
    voiceEnabled: boolean;
    voiceSpeed: number;
    aiResponseStyle: 'concise' | 'detailed';
  };
  temporaryState: {
    lastResponse: string;
    currentFeedback: string;
    needsHelp: boolean;
  };
}

interface SessionContextType {
  sessionData: SessionData;
  updateActivity: (activityId: string) => void;
  updateDifficulty: (newLevel: number) => void;
  recordAttempt: (activityId: string, success: boolean) => void;
  updatePreferences: (newPrefs: Partial<SessionData['preferences']>) => void;
  setTemporaryState: (newState: Partial<SessionData['temporaryState']>) => void;
  resetSession: () => void;
}

const defaultSessionData: SessionData = {
  currentActivity: '',
  difficultyLevel: 1,
  attempts: {},
  preferences: {
    voiceEnabled: false,
    voiceSpeed: 1,
    aiResponseStyle: 'concise'
  },
  temporaryState: {
    lastResponse: '',
    currentFeedback: '',
    needsHelp: false
  }
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionData>(() => {
    // Try to load from sessionStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('sessionData');
      return saved ? JSON.parse(saved) : defaultSessionData;
    }
    return defaultSessionData;
  });

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
  }, [sessionData]);

  const updateActivity = (activityId: string) => {
    setSessionData(prev => ({
      ...prev,
      currentActivity: activityId,
      temporaryState: {
        ...prev.temporaryState,
        lastResponse: '',
        currentFeedback: ''
      }
    }));
  };

  const updateDifficulty = (newLevel: number) => {
    setSessionData(prev => ({
      ...prev,
      difficultyLevel: newLevel
    }));
  };

  const recordAttempt = (activityId: string, success: boolean) => {
    setSessionData(prev => {
      const currentAttempts = prev.attempts[activityId] || { count: 0, successRate: 0 };
      const newCount = currentAttempts.count + 1;
      const newSuccessRate = ((currentAttempts.successRate * currentAttempts.count) + (success ? 1 : 0)) / newCount;
      
      return {
        ...prev,
        attempts: {
          ...prev.attempts,
          [activityId]: {
            count: newCount,
            successRate: newSuccessRate,
            lastAttempt: new Date().toISOString()
          }
        }
      };
    });
  };

  const updatePreferences = (newPrefs: Partial<SessionData['preferences']>) => {
    setSessionData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...newPrefs
      }
    }));
  };

  const setTemporaryState = (newState: Partial<SessionData['temporaryState']>) => {
    setSessionData(prev => ({
      ...prev,
      temporaryState: {
        ...prev.temporaryState,
        ...newState
      }
    }));
  };

  const resetSession = () => {
    setSessionData(defaultSessionData);
    sessionStorage.removeItem('sessionData');
  };

  return (
    <SessionContext.Provider value={{
      sessionData,
      updateActivity,
      updateDifficulty,
      recordAttempt,
      updatePreferences,
      setTemporaryState,
      resetSession
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};