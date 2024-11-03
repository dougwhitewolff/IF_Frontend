// src/hooks/useVoiceAI.ts
'use client';

import { useState, useCallback } from 'react';
import { useAI } from './useAI';

interface UseVoiceAIProps {
  activityId: string;
}

export function useVoiceAI({ activityId }: UseVoiceAIProps) {
  const [isListening, setIsListening] = useState(false);
  
  const {
    generateResponse,
    isLoading,
    error,
    isInitialized
  } = useAI('anthropic', {
    activityId,
    temperature: 0.7
  });

  const handleSpeech = useCallback(async (text: string) => {
    if (!isInitialized || !generateResponse) return;

    try {
      const response = await generateResponse(text);
      return response?.text;
    } catch (error) {
      console.error('AI response error:', error);
      return 'I had trouble understanding that. Could you try again?';
    }
  }, [generateResponse, isInitialized]);

  const startListening = useCallback(() => {
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    handleSpeech,
    isLoading,
    error
  };
}
