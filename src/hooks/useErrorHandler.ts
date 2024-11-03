// src/hooks/useErrorHandler.ts

import { useState, useCallback } from 'react';

interface ErrorState {
  aiError: Error | null;
  speechError: Error | null;
  systemError: Error | null;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorState>({
    aiError: null,
    speechError: null,
    systemError: null
  });

  const setError = useCallback((type: keyof ErrorState, error: Error | null) => {
    setErrors(prev => ({
      ...prev,
      [type]: error
    }));
    if (error) {
      console.error(`${type}:`, error);
    }
  }, []);

  const clearError = useCallback((type: keyof ErrorState) => {
    setErrors(prev => ({
      ...prev,
      [type]: null
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({
      aiError: null,
      speechError: null,
      systemError: null
    });
  }, []);

  return {
    errors,
    setError,
    clearError,
    clearAllErrors,
    hasErrors: Object.values(errors).some(error => error !== null)
  };
}
