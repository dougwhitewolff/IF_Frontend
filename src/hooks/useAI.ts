// src/hooks/useAI.ts

'use client';

import { useState, useCallback } from 'react';

/**
 * Interface for the useAI hook's return type
 */
interface UseAIReturn {
  generateResponse: (prompt: string) => Promise<string | null>;
  isInitialized: boolean;
  error: string | null;
  isLoading: boolean;
  resetError: () => void;
}

/**
 * Custom hook to interact with AI via server-side API route
 */
export function useAI(): UseAIReturn {
  const [isInitialized, setIsInitialized] = useState(true); // AI service is handled via API
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Function to generate AI response by calling server-side API route
   */
  const generateResponse = useCallback(async (prompt: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to generate response';
        throw new Error(errorMsg);
      }

      const { response: aiText } = data;
      
      return aiText;
    } catch (err) {
      console.error('Error in generateResponse:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate response');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Function to reset the error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateResponse,
    isInitialized,
    error,
    isLoading,
    resetError,
  };
}
