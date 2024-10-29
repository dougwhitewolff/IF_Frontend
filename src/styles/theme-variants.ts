interface ThemeVariant {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  ui: {
    borderRadius: string;
    spacing: Record<string, string>;
  };
}

const themeVariants: Record<string, Record<number, ThemeVariant>> = {
  standard: {
    1: {
      colors: {
        primary: '#EA731B',
        secondary: '#A5AE71',
        // ... other colors
      },
      ui: {
        borderRadius: '0.5rem',
        spacing: {
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
        },
      },
    },
    // ... levels 2 and 3
  },
  spicy: {
    // ... similar structure for spicy theme
  },
  terrain: {
    // ... similar structure for terrain theme
  },
};

export const getThemeVariant = (preset: string, level: number): ThemeVariant => {
  return themeVariants[preset]?.[level] || themeVariants.standard[1];
};

// src/components/ThemeManager.tsx

import React, { useEffect } from 'react';
import { useSettingsStore } from '../config/settings-manager';
import { getThemeVariant } from '../styles/theme-variants';
import { useDifficulty } from './ClientProvider';

const ThemeManager: React.FC = () => {
  const settings = useSettingsStore(state => state.settings);
  const { level, preset } = useDifficulty();

  useEffect(() => {
    const theme = getThemeVariant(preset, level);
    // Apply theme changes
    document.documentElement.style.setProperty('--primary-color', theme.colors.primary);
    // ... apply other theme properties
  }, [level, preset, settings.appearance]);

  return null;
};

export default ThemeManager;