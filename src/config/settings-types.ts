
export interface AppSettings {
  difficulty: {
    level: number;
    preset: string;
    customLabel?: string;
  };
  appearance: {
    colorScheme: string;
    fontSize: string;
    animations: boolean;
  };
  interaction: {
    aiPersonality: string;
    responseLength: 'concise' | 'detailed';
    voiceEnabled: boolean;
  };
  accessibility: {
    highContrast: boolean;
    textToSpeech: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
  };
}

// src/config/settings-manager.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateDifficulty: (level: number, preset: string) => void;
  updateAppearance: (appearance: Partial<AppSettings['appearance']>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        difficulty: {
          level: 1,
          preset: 'standard',
        },
        appearance: {
          colorScheme: 'default',
          fontSize: 'normal',
          animations: true,
        },
        interaction: {
          aiPersonality: 'friendly',
          responseLength: 'concise',
          voiceEnabled: true,
        },
        accessibility: {
          highContrast: false,
          textToSpeech: false,
          fontSize: 'normal',
        },
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateDifficulty: (level, preset) =>
        set((state) => ({
          settings: {
            ...state.settings,
            difficulty: { ...state.settings.difficulty, level, preset },
          },
        })),
      updateAppearance: (appearance) =>
        set((state) => ({
          settings: {
            ...state.settings,
            appearance: { ...state.settings.appearance, ...appearance },
          },
        })),
    }),
    {
      name: 'app-settings',
    }
  )
);

// src/components/AISettingsManager.tsx

import React, { useEffect } from 'react';
import { useSettingsStore } from '../config/settings-manager';
import { useDifficulty } from './ClientProvider';

const AISettingsManager: React.FC = () => {
  const { updateSettings } = useSettingsStore();
  const { setLevel, setPreset } = useDifficulty();

  // This function will be called by your AI voice processing system
  const handleAICommand = async (command: string) => {
    // Example commands:
    // "Change difficulty to spicy level 2"
    // "Switch to mountain theme"
    // "Make text larger"
    
    if (command.includes('difficulty')) {
      // Parse difficulty level and preset from command
      // Update both the settings store and difficulty context
      const level = parseLevel(command);
      const preset = parsePreset(command);
      
      setLevel(level);
      setPreset(preset);
      updateSettings({
        difficulty: { level, preset }
      });
    }
    
    // Handle other settings...
  };

  return null; // This is a logical component, no UI needed
};

export default AISettingsManager;