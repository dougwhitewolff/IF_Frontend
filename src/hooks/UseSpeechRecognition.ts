// src/hooks/useSpeechRecognition.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface UseSpeechRecognitionProps {
  onSpeechResult?: (text: string) => Promise<void>;
  autoStart?: boolean;
}

interface SpeechState {
  isListening: boolean;
  isSpeaking: boolean;
  error: Error | null;
}

export const useSpeechRecognition = ({
  onSpeechResult,
  autoStart = true,
}: UseSpeechRecognitionProps) => {
  // States
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    isSpeaking: false,
    error: null,
  });

  // Refs for managing real-time state
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const recognitionStoppedByUserRef = useRef(false);
  const synthesisPendingRef = useRef(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const onSpeechResultRef = useRef(onSpeechResult);

  // Function to update onSpeechResult callback
  const updateOnSpeechResult = useCallback(
    (callback: (text: string) => Promise<void>) => {
      onSpeechResultRef.current = callback;
    },
    []
  );

  // Update the onSpeechResult ref when it changes
  useEffect(() => {
    onSpeechResultRef.current = onSpeechResult;
  }, [onSpeechResult]);

  // Start and stop listening functions
  const startListening = useCallback(() => {
    if (
      !recognitionRef.current ||
      isListeningRef.current ||
      isSpeakingRef.current ||
      synthesisPendingRef.current
    ) {
      return;
    }

    recognitionStoppedByUserRef.current = false;

    try {
      recognitionRef.current.start();
      console.log('Speech recognition initiated.');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setTimeout(startListening, 1000);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListeningRef.current) return;

    try {
      recognitionStoppedByUserRef.current = true;
      recognitionRef.current.stop();
      console.log('Speech recognition stopped.');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, []);

  // Check browser support
  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSpeechSupported) {
      setState((prev) => ({ ...prev, error: new Error('Speech recognition not supported') }));
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition =
      (window.SpeechRecognition || window.webkitSpeechRecognition) as typeof SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setState((prev) => ({ ...prev, isListening: true }));
      isListeningRef.current = true;
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setState((prev) => ({ ...prev, isListening: false }));
      isListeningRef.current = false;

      // Auto-restart if not manually stopped and not speaking
      if (
        !recognitionStoppedByUserRef.current &&
        !isSpeakingRef.current &&
        !synthesisPendingRef.current
      ) {
        console.log('Restarting speech recognition...');
        setTimeout(() => {
          startListening();
        }, 1000);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      let errorMessage = 'An unknown error occurred during speech recognition.';

      if (event.error) {
        errorMessage = `Speech recognition error: ${event.error}`;
      } else if (event.message) {
        errorMessage = `Speech recognition error: ${event.message}`;
      }

      setState((prev) => ({
        ...prev,
        isListening: false,
        error: new Error(errorMessage),
      }));
      isListeningRef.current = false;

      // Optionally display the error to the user
      toast.error(errorMessage);

      // Decide whether to restart listening based on the error
      if (
        event.error !== 'aborted' &&
        !isSpeakingRef.current &&
        !synthesisPendingRef.current
      ) {
        console.log('Attempting to restart speech recognition after error...');
        setTimeout(() => {
          startListening();
        }, 2000);
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log('Speech recognized:', transcript);
      if (onSpeechResultRef.current) {
        onSpeechResultRef.current(transcript);
      }
    };

    recognitionRef.current = recognition;

    // Initialize voice
    if (window.speechSynthesis) {
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.map((voice) => voice.name));
        if (voices.length > 0) {
          const preferredVoice = voices.find(
            (voice) => voice.name === 'Microsoft Ava Online (Natural) - English (United States)'
          );
          selectedVoiceRef.current =
            preferredVoice ||
            voices.find((voice) => voice.lang.startsWith('en')) ||
            voices[0];
          console.log('Selected voice:', selectedVoiceRef.current?.name);
        } else {
          console.warn('No voices available.');
        }
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    } else {
      console.error('Speech synthesis not supported in this browser.');
      toast.error('Speech synthesis is not supported in your browser.');
    }

    // Start listening if autoStart is true
    if (autoStart) {
      startListening();
    }

    // Cleanup
    return () => {
      stopListening();
      // Removed speech synthesis cancellation on unmount
      // if (currentUtteranceRef.current) {
      //   window.speechSynthesis.cancel();
      // }
    };
  }, [
    isSpeechSupported,
    autoStart,
    startListening,
    stopListening,
  ]);

  const speak = useCallback(
    async (text: string) => {
      if (!('speechSynthesis' in window)) {
        toast.error('Speech synthesis not supported');
        return;
      }

      synthesisPendingRef.current = true;

      try {
        // Cancel any ongoing speech synthesis
        if (window.speechSynthesis.speaking) {
          console.log('Cancelling ongoing speech synthesis.');
          window.speechSynthesis.cancel();
        }

        // Stop listening
        stopListening();

        const utterance = new SpeechSynthesisUtterance(text);
        currentUtteranceRef.current = utterance;

        if (selectedVoiceRef.current) {
          utterance.voice = selectedVoiceRef.current;
        } else {
          // Select default voice if no voice was selected
          const voices = window.speechSynthesis.getVoices();
          utterance.voice = voices.find((voice) => voice.lang.startsWith('en')) || voices[0];
          console.log('Using default voice:', utterance.voice?.name);
        }

        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;

        utterance.onstart = () => {
          console.log('Speech synthesis started');
          setState((prev) => ({ ...prev, isSpeaking: true }));
          isSpeakingRef.current = true;
        };

        utterance.onend = () => {
          console.log('Speech synthesis ended');
          setState((prev) => ({ ...prev, isSpeaking: false }));
          isSpeakingRef.current = false;
          currentUtteranceRef.current = null;
          synthesisPendingRef.current = false;

          // Restart listening after speaking
          setTimeout(() => {
            if (!isListeningRef.current && !isSpeakingRef.current) {
              startListening();
            }
          }, 1000);
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error || event);
          setState((prev) => ({
            ...prev,
            isSpeaking: false,
            error: new Error('Speech synthesis error'),
          }));
          isSpeakingRef.current = false;
          currentUtteranceRef.current = null;
          synthesisPendingRef.current = false;
          toast.error('An error occurred during speech synthesis.');
        };

        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error in speak:', error);
        synthesisPendingRef.current = false;
        setState((prev) => ({
          ...prev,
          isSpeaking: false,
          error: error instanceof Error ? error : new Error('Speech error'),
        }));
        isSpeakingRef.current = false;
        toast.error('An error occurred during speech synthesis.');
      }
    },
    [stopListening, startListening]
  );

  return {
    isListening: state.isListening,
    isSpeaking: state.isSpeaking,
    error: state.error,
    startListening,
    stopListening,
    speak,
    isSpeechSupported,
    updateOnSpeechResult,
  };
};
