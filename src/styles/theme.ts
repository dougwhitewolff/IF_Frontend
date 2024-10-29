
export type DifficultyTheme = {
  name: string;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
    background: string;
    text: string;
  };
  ui: {
    borderRadius: string;
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    shadow: {
      sm: string;
      md: string;
      lg: string;
    };
  };
};

export type ThemePreset = {
  standard: string[];
  spicy: string[];
  terrain: string[];
  custom?: string[];
};

const baseColors = {
  orange: {
    light: '#FFAD60',
    main: '#EA731B',
    dark: '#D65A00',
  },
  olive: {
    light: '#B8C086',
    main: '#A5AE71',
    dark: '#8A9259',
  },
  blue: {
    light: '#1A91D1',
    main: '#0077B5',
    dark: '#005C8F',
  },
  neutral: {
    white: '#FFFFFF',
    background: '#F8F9FA',
    lightGray: '#E9ECEF',
    gray: '#6C757D',
    darkGray: '#343A40',
    black: '#212529',
  },
};

const difficultyPresets: ThemePreset = {
  standard: ['Easy', 'Medium', 'Hard'],
  spicy: ['Mild', 'Medium', 'Spicy'],
  terrain: ['Flat', 'Hilly', 'Mountainous'],
  custom: ['Beginner', 'Intermediate', 'Advanced'],
};

const createDifficultyTheme = (level: number, preset: keyof ThemePreset = 'standard'): DifficultyTheme => {
  const intensity = level / 2;

  return {
    name: `level-${level}`,
    label: difficultyPresets[preset][level - 1],
    colors: {
      primary: baseColors.orange.main,
      secondary: baseColors.olive.main,
      accent: baseColors.blue.main,
      highlight: baseColors.orange.light,
      background: baseColors.neutral.background,
      text: baseColors.neutral.darkGray,
    },
    ui: {
      borderRadius: '0.5rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      shadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  };
};

// Add visual variations for each difficulty level
const difficultyThemes = {
  1: createDifficultyTheme(1),
  2: createDifficultyTheme(2),
  3: createDifficultyTheme(3),
};

const theme = {
  // Legacy structure for backward compatibility
  colors: {
    primary: baseColors.orange.main,
    secondary: baseColors.olive.main,
    accent: baseColors.blue.main,
    highlight: baseColors.orange.light,
    background: baseColors.neutral.background,
    text: baseColors.neutral.darkGray,
  },
  fonts: {
    primary: 'Cambria Math, serif',
    secondary: 'Arial Rounded MT Bold, sans-serif',
  },
  // New structure
  baseColors,
  difficulties: difficultyThemes,
  presets: difficultyPresets,
  // Global styles that apply regardless of difficulty
  globals: {
    maxWidth: '1200px',
    headerHeight: '64px',
    footerHeight: '80px',
    borderRadius: '0.5rem',
    transition: {
      fast: '150ms ease',
      medium: '300ms ease',
      slow: '500ms ease',
    },
    breakpoints: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    zIndex: {
      modal: 1000,
      overlay: 900,
      drawer: 800,
      header: 700,
      footer: 600,
    },
  },
  // Helper functions
  utils: {
    // Add alpha channel to hex color
    alpha: (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
  },
};

export type Theme = typeof theme;
export default theme;
