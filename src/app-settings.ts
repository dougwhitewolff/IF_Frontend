
export interface VoiceCommand {
  type: 'difficulty' | 'theme' | 'accessibility';
  action: string;
  value: string | number;
}

export interface ThemeSettings {
  preset: string;
  level: number;
  accessibility: {
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
  };
}

export type DifficultyPreset = 'standard' | 'spicy' | 'terrain';