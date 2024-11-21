// src/config/sessionConfig.ts
import { SessionConfig } from '../services/realtime/types';

export const defaultSessionConfig: SessionConfig = {
  modalities: ['text', 'audio'] as const,
  instructions: `You are an AI tutor helping students understand inverse functions. 
                Explain concepts clearly and provide step-by-step guidance.`,
  voice: 'alloy',
  input_audio_format: 'pcm16',
  output_audio_format: 'pcm16',
  input_audio_transcription: {
    model: 'whisper-1'
  },
  turn_detection: {
    type: 'server_vad',
    threshold: 0.5,
    prefix_padding_ms: 300,
    silence_duration_ms: 500
  },
  temperature: 0.7,
  max_response_output_tokens: 'inf'
} as const;

// Add configuration validation helper
export function validateSessionConfig(config: Partial<SessionConfig>): { isValid: boolean; error?: string } {
  const validModalities = ['text', 'audio'];
  const validVoices = ['ash', 'ballad', 'coral', 'sage', 'verse', 'alloy', 'echo', 'shimmer'];
  const validAudioFormats = ['pcm16', 'g711_ulaw', 'g711_alaw'];

  if (config.modalities && !config.modalities.every(m => validModalities.includes(m))) {
    return { isValid: false, error: 'Invalid modality specified' };
  }

  if (config.voice && !validVoices.includes(config.voice)) {
    return { isValid: false, error: 'Invalid voice specified' };
  }

  if (config.input_audio_format && !validAudioFormats.includes(config.input_audio_format)) {
    return { isValid: false, error: 'Invalid input audio format' };
  }

  if (config.temperature && (config.temperature < 0.6 || config.temperature > 1.2)) {
    return { isValid: false, error: 'Temperature must be between 0.6 and 1.2' };
  }

  return { isValid: true };
}