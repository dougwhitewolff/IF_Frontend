// src/services/ai/openai-service.ts

import { AIService, AIResponse, AIServiceConfig } from './types';

export class OpenAIService implements AIService {
  private apiKey: string = '';
  private model: string = '';
  private temperature: number = 0.7;

  async initialize(config: AIServiceConfig): Promise<void> {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.temperature = config.temperature || 0.7;
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Ensure you're using a model available to your API key
          messages: [
            { role: 'system', content: 'You are an AI tutor helping with inverse functions.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: this.maxTokens,
          temperature: this.temperature,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error('OpenAI API error:', errorBody); // Log the detailed error response
        throw new Error(`OpenAI API error: ${response.statusText}\n${JSON.stringify(errorBody)}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content,
        confidence: 1.0 // OpenAI doesn't provide this directly
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}
