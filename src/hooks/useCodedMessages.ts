// src/hooks/useCodedMessages.ts

import { useState, useCallback } from 'react';
import { Question } from '@/data/codedMessages/questions';
import { toast } from 'react-hot-toast';

interface UseCodedMessagesProps {
  onProgressUpdate?: (progress: string) => void;
}

export function useCodedMessages({ onProgressUpdate }: UseCodedMessagesProps = {}) {
  const [userGuess, setUserGuess] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [encodedAnswer, setEncodedAnswer] = useState('');
  const [progressHistory, setProgressHistory] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);

  const letterToCode = useCallback((letter: string): string => {
    return letter === ' ' ? '0' : (letter.charCodeAt(0) - 64).toString();
  }, []);

  const encodeAnswer = useCallback((text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map(letterToCode)
      .join('-');
  }, [letterToCode]);

  const addProgressEntry = useCallback((entry: string) => {
    setProgressHistory(prev => {
      const newHistory = [...prev.slice(-49), entry];
      onProgressUpdate?.(entry);
      return newHistory;
    });
  }, [onProgressUpdate]);

  const resetState = useCallback(() => {
    setUserGuess('');
    setProgressHistory([]);
    setAttemptCount(0);
  }, []);

  return {
    state: {
      userGuess,
      currentCategory,
      currentQuestion,
      encodedAnswer,
      progressHistory,
      attemptCount
    },
    actions: {
      setUserGuess,
      setCurrentCategory,
      setCurrentQuestion,
      setEncodedAnswer,
      addProgressEntry,
      resetState,
      letterToCode,
      encodeAnswer
    }
  };
}
