// src/hooks/useAssistant.ts

import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/apiConfig';

interface UseAssistantProps {
  assistantId: string;
  activityId: string;
}

interface UseAssistantReturn {
  getAssistantResponse: (prompt: string) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

export function useAssistant({ assistantId, activityId }: UseAssistantProps): UseAssistantReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the assistant's response based on the provided prompt.
   * Sends the prompt along with assistantId and activityId to the backend API.
   *
   * @param prompt - The user's input prompt.
   * @returns The assistant's response or null if an error occurs.
   */
  const getAssistantResponse = useCallback(
    async (prompt: string): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Sending prompt to AI assistant:', prompt);
        const response = await fetch(API_ENDPOINTS.CHAT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            assistantId,
            activityId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get assistant response');
        }

        console.log('Received response from AI assistant:', data.response);
        return data.response;
      } catch (err: any) {
        console.error('Assistant response error:', err);
        setError(err.message || 'Failed to get assistant response');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [assistantId, activityId]
  );

  return {
    getAssistantResponse,
    isLoading,
    error,
  };
}
