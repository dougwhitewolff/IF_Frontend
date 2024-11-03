// src/services/ai/utils.ts

export function sanitizePrompt(prompt: string): string {
  return prompt.trim();
}

export function validateConfig(config: {
  apiKey?: string;
  model?: string;
}): boolean {
  if (!config.apiKey || !config.model) {
    throw new Error('Missing required configuration: apiKey and model must be provided');
  }
  return true;
}

export function handleAIError(error: unknown): never {
  if (error instanceof Error) {
    throw new Error(`AI Service Error: ${error.message}`);
  }
  throw new Error('Unknown AI Service Error');
}
