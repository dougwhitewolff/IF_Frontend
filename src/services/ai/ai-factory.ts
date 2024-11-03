// src/services/ai/ai-factory.ts

import { AIService } from './types';
import { AnthropicService } from './anthropic-service';
import { OpenAIService } from './openai-service';

export class AIFactory {
  static createService(provider: 'anthropic' | 'openai'): AIService {
    switch (provider) {
      case 'anthropic':
        return new AnthropicService();
      case 'openai':
        return new OpenAIService();
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
}
