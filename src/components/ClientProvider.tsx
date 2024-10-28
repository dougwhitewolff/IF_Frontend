'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import theme, { ThemePreset } from '../styles/theme';

type DifficultyContextType = {
  level: number;
  preset: keyof ThemePreset;
  setLevel: (level: number) => void;
  setPreset: (preset: keyof ThemePreset) => void;
};

const DifficultyContext = createContext<DifficultyContextType>({
  level: 1,
  preset: 'standard',
  setLevel: () => {},
  setPreset: () => {},
});

export const useDifficulty = () => useContext(DifficultyContext);

interface ClientProviderProps {
  children: ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [level, setLevel] = useState(1);
  const [preset, setPreset] = useState<keyof ThemePreset>('standard');

  const currentTheme = {
    ...theme,
    current: theme.difficulties[level as keyof typeof theme.difficulties],
    preset,
  };

  return (
    <DifficultyContext.Provider value={{ level, preset, setLevel, setPreset }}>
      <StyledThemeProvider theme={currentTheme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </DifficultyContext.Provider>
  );
};

export default ClientProvider;