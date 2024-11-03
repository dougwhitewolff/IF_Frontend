// src/services/ai/anthropic-service.ts

import { AIService, AIResponse, AIServiceConfig } from './types';

export class AnthropicService implements AIService {
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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: this.temperature
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.content[0].text,
        confidence: 1.0 // Anthropic doesn't provide this directly
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }
}
