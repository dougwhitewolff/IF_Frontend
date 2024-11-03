// /data/additiveInverses/questions.ts

export interface AdditiveInverseQuestion {
  id: string;
  difficulty: 'mild' | 'medium' | 'spicy';
  number: number;
}

export const additiveInverseQuestions: AdditiveInverseQuestion[] = [
  // Mild Difficulty
  { id: 'aiq-mild-1', difficulty: 'mild', number: 5 },
  { id: 'aiq-mild-2', difficulty: 'mild', number: -3 },
  { id: 'aiq-mild-3', difficulty: 'mild', number: 10 },
  
  // Medium Difficulty
  { id: 'aiq-medium-1', difficulty: 'medium', number: -7 },
  { id: 'aiq-medium-2', difficulty: 'medium', number: 12 },
  { id: 'aiq-medium-3', difficulty: 'medium', number: -15 },
  
  // Spicy Difficulty
  { id: 'aiq-spicy-1', difficulty: 'spicy', number: 25 },
  { id: 'aiq-spicy-2', difficulty: 'spicy', number: -30 },
  { id: 'aiq-spicy-3', difficulty: 'spicy', number: 50 },
  
  // Add more questions as needed
];
