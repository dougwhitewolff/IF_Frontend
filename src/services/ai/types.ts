// src/services/ai/types.ts

export interface AIResponse {
  text: string;
  confidence?: number;
  alternatives?: string[];
}

export interface AIServiceConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIService {
  initialize(config: AIServiceConfig): Promise<void>;
  generateResponse(prompt: string): Promise<AIResponse>;
}
