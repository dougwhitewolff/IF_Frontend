declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

// Extend Window interface for potential speech recognition
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

// Activity types
type Difficulty = 'mild' | 'medium' | 'spicy';

interface ActivityProgress {
  id: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttempt?: string;
}

// Additional UI component props
interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

interface ActivityIconProps extends IconProps {
  difficulty: Difficulty;
  animate?: boolean;
}
