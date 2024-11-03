// src/services/storage/storageService.ts

import { 
  UserProgress, 
  UserPreferences, 
  SessionContext, 
  ActivityMetrics,
  StorageKeys 
} from './types';

export class StorageService {
  private static readonly KEYS: StorageKeys = {
    PROGRESS_KEY: 'user_progress',
    PREFS_KEY: 'user_preferences',
    SESSION_KEY: 'session_context',
    METRICS_KEY: 'activity_metrics'
  };

  // Progress Management
  static saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(this.KEYS.PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  static getProgress(): UserProgress | null {
    try {
      const data = localStorage.getItem(this.KEYS.PROGRESS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get progress:', error);
      return null;
    }
  }

  // Preferences Management
  static savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(this.KEYS.PREFS_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  static getPreferences(): UserPreferences | null {
    try {
      const data = localStorage.getItem(this.KEYS.PREFS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return null;
    }
  }

  // Session Context Management
  static saveSessionContext(context: SessionContext): void {
    try {
      sessionStorage.setItem(this.KEYS.SESSION_KEY, JSON.stringify(context));
    } catch (error) {
      console.error('Failed to save session context:', error);
    }
  }

  static getSessionContext(): SessionContext | null {
    try {
      const data = sessionStorage.getItem(this.KEYS.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get session context:', error);
      return null;
    }
  }

  // Conversation History Management
  static updateConversationHistory(message: string): void {
    try {
      const context = this.getSessionContext() || {
        lastInteraction: '',
        currentConversation: [],
        temporaryState: {},
        activeStreak: false
      };
      
      context.currentConversation.push(message);
      context.lastInteraction = new Date().toISOString();
      
      // Keep only last 10 messages to prevent session storage overflow
      if (context.currentConversation.length > 10) {
        context.currentConversation = context.currentConversation.slice(-10);
      }
      
      this.saveSessionContext(context);
    } catch (error) {
      console.error('Failed to update conversation history:', error);
    }
  }

  // Activity Metrics Management
  static updateMetrics(activityId: string, success: boolean, timeSpent: number): void {
    try {
      const metricsKey = `${this.KEYS.METRICS_KEY}_${activityId}`;
      const existingData = localStorage.getItem(metricsKey);
      const metrics: ActivityMetrics = existingData ? JSON.parse(existingData) : {
        totalAttempts: 0,
        successRate: 0,
        averageTime: 0,
        lastAttempt: ''
      };

      metrics.totalAttempts++;
      metrics.successRate = ((metrics.successRate * (metrics.totalAttempts - 1) + 
        (success ? 100 : 0)) / metrics.totalAttempts);
      metrics.averageTime = ((metrics.averageTime * (metrics.totalAttempts - 1) + 
        timeSpent) / metrics.totalAttempts);
      metrics.lastAttempt = new Date().toISOString();

      localStorage.setItem(metricsKey, JSON.stringify(metrics));
    } catch (error) {
      console.error('Failed to update metrics:', error);
    }
  }

  // Clear all stored data
  static clearAll(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}
