// src/services/realtime/WebSocketManager.ts

import { EventEmitter } from 'events';
import { 
    WebSocketCallbacks, 
    ConnectionState, 
    OpenAIMessage,
    WebSocketConfig, 
    RateLimits, 
    PendingMessage,
    SessionConfig
} from './types';
import { formatMessage } from '../utils/messageFormatter';
import { logger } from '../../utils/logger';
import { wsConfig } from '@config/wsConfig';
import { config } from '../../config/env';

export class WebSocketManager extends EventEmitter {
    private ws: WebSocket | null = null;
    private connectionState: ConnectionState = 'disconnected';
    private callbacks: WebSocketCallbacks = {};
    private pendingMessages: Map<string, PendingMessage> = new Map();
    private sessionId: string | null = null;
    private connectionAttempts: number = 0;
    private maxRetries: number = wsConfig.maxRetries;
    private rateLimits: RateLimits = {
        tokens: { limit: 0, remaining: 0, resetTime: 0 },
        requests: { limit: 0, remaining: 0, resetTime: 0 }
    };

    constructor(callbacks: WebSocketCallbacks = {}) {
        super();
        this.callbacks = callbacks;
    }

    public connect(): void {
        if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
            return;
        }

        this.setConnectionState('connecting');

        try {
            this.ws = new WebSocket(wsConfig.url);
            this.setupEventListeners();
        } catch (error) {
            this.handleError(error as Error);
        }
    }

    private setupEventListeners(): void {
        if (!this.ws) return;

        this.ws.onopen = () => {
            this.setConnectionState('connected');
            this.connectionAttempts = 0;
            this.callbacks.onOpen?.();
            this.initializeSession();
        };

        this.ws.onclose = () => {
            const previousState = this.connectionState;
            this.setConnectionState('disconnected');
            this.callbacks.onClose?.();

            if (previousState === 'connected') {
                this.handleReconnection();
            }
        };

        this.ws.onerror = (event) => {
            this.handleError(event);
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as OpenAIMessage;
                this.handleIncomingMessage(message);
            } catch (error) {
                logger.error('Failed to parse message:', error);
            }
        };
    }

    private async initializeSession(): Promise<void> {
        const sessionConfig: SessionConfig = {
            modalities: wsConfig.defaultModalities,
            voice: wsConfig.defaultVoice,
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
            }
        };

        try {
            await this.send({
                type: 'session.update',
                event_id: `session_${Date.now()}`,
                session: sessionConfig
            });
        } catch (error) {
            logger.error('Failed to initialize session:', error);
            this.handleError(error as Error);
        }
    }

    private handleIncomingMessage(message: OpenAIMessage): void {
        // Handle rate limits
        if (message.type === 'rate_limits.updated') {
            this.updateRateLimits(message);
        }

        // Handle session updates
        if (message.type === 'session.created' || message.type === 'session.updated') {
            this.sessionId = message.item?.id ?? null;
        }

        // Handle errors
        if (message.type === 'error') {
            this.handleApiError(message);
            return;
        }

        // Resolve pending messages
        if (message.event_id && this.pendingMessages.has(message.event_id)) {
            const { resolve } = this.pendingMessages.get(message.event_id)!;
            resolve(message);
            this.pendingMessages.delete(message.event_id);
        }

        // Emit message event
        this.callbacks.onMessage?.(message);
        this.emit('message', message);
    }

    private updateRateLimits(message: OpenAIMessage): void {
        const limits = message as any;
        if (!Array.isArray(limits.rate_limits)) return;

        limits.rate_limits.forEach((limit: any) => {
            if (limit.name in this.rateLimits) {
                this.rateLimits[limit.name as keyof RateLimits] = {
                    limit: limit.limit,
                    remaining: limit.remaining,
                    resetTime: Date.now() + (limit.reset_seconds * 1000)
                };
            }
        });

        this.checkRateLimits();
    }

    private checkRateLimits(): void {
        Object.entries(this.rateLimits).forEach(([type, data]) => {
            if (data.remaining < data.limit * 0.1) {
                this.emit('rate_limit_warning', {
                    type,
                    remaining: data.remaining,
                    resetTime: data.resetTime
                });
            }
        });
    }

    private handleApiError(message: OpenAIMessage): void {
        if (!message.error) return;

        const error = new Error(message.error.message);
        logger.error('API Error:', error);
        this.callbacks.onError?.(new ErrorEvent('error', { error }));
        this.emit('error', error);
    }

    private handleError(event: Event | Error): void {
        const error = event instanceof Error ? event : new Error('WebSocket error');
        this.setConnectionState('error');
        logger.error('WebSocket error:', error);
        this.callbacks.onError?.(event instanceof ErrorEvent ? event : new ErrorEvent('error', { error }));
        this.emit('error', error);
    }

    private async handleReconnection(): Promise<void> {
        if (this.connectionAttempts >= this.maxRetries) {
            logger.error('Max reconnection attempts reached');
            return;
        }

        this.connectionAttempts++;
        const delay = wsConfig.retryDelay * Math.pow(2, this.connectionAttempts - 1);

        logger.info(`Attempting reconnection in ${delay}ms (attempt ${this.connectionAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        this.connect();
    }

    public async send(message: any): Promise<any> {
        if (this.connectionState !== 'connected') {
            throw new Error('WebSocket is not connected');
        }

        const formattedMessage = formatMessage(message);
        
        return new Promise((resolve, reject) => {
            try {
                const timeoutId = setTimeout(() => {
                    this.pendingMessages.delete(formattedMessage.event_id);
                    reject(new Error('Message timeout'));
                }, wsConfig.messageTimeout);

                this.pendingMessages.set(formattedMessage.event_id, {
                    message: formattedMessage,
                    resolve,
                    reject,
                    timeoutId
                });

                this.ws!.send(JSON.stringify(formattedMessage));
            } catch (error) {
                reject(error);
            }
        });
    }

    private setConnectionState(state: ConnectionState): void {
        this.connectionState = state;
        this.callbacks.onStateChange?.(state);
        this.emit('stateChange', state);
    }

    public getConnectionState(): ConnectionState {
        return this.connectionState;
    }

    public isConnected(): boolean {
        return this.connectionState === 'connected';
    }

    public getSessionId(): string | null {
        return this.sessionId;
    }

    public getRateLimits(): RateLimits {
        return { ...this.rateLimits };
    }

    public disconnect(): void {
        if (this.ws && this.connectionState === 'connected') {
            this.ws.close(1000, 'Client disconnected');
        }

        // Clean up pending messages
        this.pendingMessages.forEach(({ reject, timeoutId }) => {
            if (timeoutId) clearTimeout(timeoutId);
            reject(new Error('Connection closed'));
        });
        this.pendingMessages.clear();

        this.ws = null;
        this.sessionId = null;
        this.setConnectionState('disconnected');
    }
}