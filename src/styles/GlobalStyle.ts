import { createGlobalStyle, css } from 'styled-components';
import { Theme } from './theme';

// Reusable focus styles
const focusStyles = css`
  outline: 2px solid ${props => props.theme.colors.accent};
  outline-offset: 2px;
`;

// Animation keyframes
const fadeIn = css`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const slideIn = css`
  @keyframes slideIn {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  ${fadeIn}
  ${slideIn}

  /* CSS Reset */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Root styles for CSS variables */
  :root {
    --page-max-width: ${props => props.theme.globals?.maxWidth || '1200px'};
    --header-height: ${props => props.theme.globals?.headerHeight || '64px'};
    --footer-height: ${props => props.theme.globals?.footerHeight || '80px'};
    --transition-fast: ${props => props.theme.globals?.transition.fast || '150ms ease'};
    --transition-medium: ${props => props.theme.globals?.transition.medium || '300ms ease'};
  }

  /* Base HTML styles */
  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.secondary};
    margin-bottom: ${props => props.theme.current?.ui.spacing.md || '1rem'};
    line-height: 1.2;
    font-weight: 600;
  }

  h1 {
    font-size: ${props => props.theme.current?.ui.fontSize['2xl'] || '2.5rem'};
    margin-bottom: ${props => props.theme.current?.ui.spacing.lg || '1.5rem'};
    animation: slideIn 0.5s ease-out;
  }

  h2 { font-size: ${props => props.theme.current?.ui.fontSize.xl || '2rem'}; }
  h3 { font-size: ${props => props.theme.current?.ui.fontSize.lg || '1.75rem'}; }
  h4 { font-size: ${props => props.theme.current?.ui.fontSize.base || '1.5rem'}; }
  h5 { font-size: ${props => props.theme.current?.ui.fontSize.sm || '1.25rem'}; }
  h6 { font-size: ${props => props.theme.current?.ui.fontSize.xs || '1rem'}; }

  p {
    margin-bottom: ${props => props.theme.current?.ui.spacing.md || '1rem'};
    max-width: 70ch; /* Optimal line length for readability */
  }

  /* Links */
  a {
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
    transition: var(--transition-fast);
    
    &:hover {
      color: ${props => props.theme.baseColors.blue.dark};
      text-decoration: underline;
    }

    &:focus-visible {
      ${focusStyles}
    }
  }

  /* Buttons */
  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
    transition: var(--transition-fast);

    &:focus-visible {
      ${focusStyles}
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    padding: ${props => props.theme.current?.ui.spacing.sm || '0.5rem'};
    border: 1px solid ${props => props.theme.colors.secondary};
    border-radius: ${props => props.theme.current?.ui.borderRadius || '0.25rem'};
    background-color: ${props => props.theme.colors.background};
    transition: var(--transition-fast);

    &:focus {
      ${focusStyles}
      border-color: ${props => props.theme.colors.accent};
    }

    &::placeholder {
      color: ${props => props.theme.baseColors.neutral.gray};
    }

    &:disabled {
      background-color: ${props => props.theme.baseColors.neutral.lightGray};
      cursor: not-allowed;
    }
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${props => props.theme.current?.ui.spacing.md || '1rem'};
    padding-left: ${props => props.theme.current?.ui.spacing.lg || '1.5rem'};
  }

  li {
    margin-bottom: ${props => props.theme.current?.ui.spacing.xs || '0.25rem'};
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${props => props.theme.current?.ui.spacing.lg || '1.5rem'};
  }

  th, td {
    padding: ${props => props.theme.current?.ui.spacing.sm || '0.5rem'};
    border: 1px solid ${props => props.theme.baseColors.neutral.lightGray};
    text-align: left;
  }

  th {
    background-color: ${props => props.theme.baseColors.neutral.lightGray};
    font-weight: 600;
  }

  /* Images and media */
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Code blocks */
  pre, code {
    font-family: 'Consolas', 'Monaco', monospace;
    background-color: ${props => props.theme.baseColors.neutral.lightGray};
    padding: ${props => props.theme.current?.ui.spacing.xs || '0.25rem'};
    border-radius: ${props => props.theme.current?.ui.borderRadius || '0.25rem'};
  }

  pre {
    padding: ${props => props.theme.current?.ui.spacing.md || '1rem'};
    overflow-x: auto;
    margin-bottom: ${props => props.theme.current?.ui.spacing.md || '1rem'};
  }

  /* Utility classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.baseColors.neutral.lightGray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.accent};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.baseColors.blue.dark};
    }
  }

  /* Selection styling */
  ::selection {
    background-color: ${props => props.theme.baseColors.blue.light};
    color: white;
  }

  /* Responsive typography */
  @media (max-width: ${props => props.theme.globals?.breakpoints.lg || '1024px'}) {
    html { font-size: 15px; }
  }

  @media (max-width: ${props => props.theme.globals?.breakpoints.md || '768px'}) {
    html { font-size: 14px; }
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.5rem; }
  }

  @media (max-width: ${props => props.theme.globals?.breakpoints.sm || '640px'}) {
    html { font-size: 13px; }
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
  }

  /* Print styles */
  @media print {
    body {
      background-color: white;
      color: black;
    }

    a {
      text-decoration: underline;
      color: black;
    }

    button {
      display: none;
    }
  }
`;

export default GlobalStyle;