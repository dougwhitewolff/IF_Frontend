// src/components/VoiceInteraction.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface VoiceInteractionProps {
  onSpeechResult: (text: string) => void;
  isListening?: boolean;
}

const VoiceInteraction: React.FC<VoiceInteractionProps> = ({ onSpeechResult, isListening = false }) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for browser support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setIsSupported(false);
        toast.error('Speech recognition is not supported in your browser');
        return;
      }

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      setRecognition(recognitionInstance);
      setSynthesis(window.speechSynthesis);
    }
  }, []);

  // Handle speech recognition results
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onSpeechResult(text);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('There was a problem understanding you');
    };

    recognition.onend = () => {
      // Could restart listening here if needed
    };
  }, [recognition, onSpeechResult]);

  // Control listening state
  useEffect(() => {
    if (!recognition || !isSupported) return;

    if (isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
      }
    } else {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Speech recognition stop error:', error);
      }
    }

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Speech recognition cleanup error:', error);
      }
    };
  }, [isListening, recognition, isSupported]);

  // Function to speak text
  const speak = useCallback((text: string) => {
    if (!synthesis || !isSupported) return;

    // Cancel any ongoing speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    
    synthesis.speak(utterance);
  }, [synthesis, isSupported]);

  return null; // This component doesn't render anything
};

export default VoiceInteraction;
