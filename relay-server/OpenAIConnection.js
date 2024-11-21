// relay-server/OpenAIConnection.js

import EventEmitter from 'events';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have uuid installed via npm

class OpenAIConnection extends EventEmitter {
  constructor(apiKey, modelName, options = {}) {
    super();
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.ws = null;
    this.connectionAttempts = 0;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // in ms
    this.connectionTimeout = options.connectionTimeout || 10000; // in ms
    this.pendingMessages = new Map();
    this.isReconnecting = false;
    this.sessionId = null;
    this.rateLimits = {
      tokens: { limit: 0, remaining: 0, resetTime: 0 },
      requests: { limit: 0, remaining: 0, resetTime: 0 }
    };
  }

  /**
   * Establishes the WebSocket connection to OpenAI's Real-Time API.
   */
  async connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      await this.createConnection();
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  /**
   * Creates the WebSocket connection.
   */
  createConnection() {
    return new Promise((resolve, reject) => {
      const url = `wss://api.openai.com/v1/realtime?model=${this.modelName}`;

      try {
        this.ws = new WebSocket(url, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        });
      } catch (error) {
        reject(new Error(`Failed to create WebSocket: ${error.message}`));
        return;
      }

      // Set up a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.terminate();
          reject(new Error('Connection timeout'));
        }
      }, this.connectionTimeout);

      // Setup WebSocket event handlers
      this.setupWebSocketHandlers(resolve, connectionTimeout);
    });
  }

  /**
   * Sets up event handlers for the WebSocket connection.
   * @param {Function} resolve - Function to call upon successful connection.
   * @param {NodeJS.Timeout} connectionTimeout - Timeout handler.
   */
  setupWebSocketHandlers(resolve, connectionTimeout) {
    if (!this.ws) return;

    this.ws.on('open', () => {
      clearTimeout(connectionTimeout);
      this.connectionAttempts = 0;
      this.isReconnecting = false;
      this.emit('connected');
      this.processPendingMessages();
      resolve();
    });

    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleIncomingMessage(message);
      } catch (error) {
        this.emit('error', new Error('Failed to parse incoming message'));
      }
    });

    this.ws.on('close', (code, reason) => {
      clearTimeout(connectionTimeout);
      this.handleClose(code, reason);
    });

    this.ws.on('error', (error) => {
      clearTimeout(connectionTimeout);
      this.emit('error', error);
    });

    // Optional: Handle pong responses for heartbeat
    this.ws.on('pong', () => {
      this.isAlive = true;
    });
  }

  /**
   * Sends a heartbeat ping to keep the connection alive.
   */
  setupHeartbeat() {
    const HEARTBEAT_INTERVAL = 30000; // 30 seconds

    this.isAlive = true;

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        if (!this.isAlive) {
          console.warn('No pong received. Terminating connection.');
          this.ws.terminate();
          return;
        }

        this.isAlive = false;
        this.ws.ping();
      }
    }, HEARTBEAT_INTERVAL);
  }

  /**
   * Handles incoming messages from OpenAI.
   * @param {Object} message - The message object received.
   */
  handleIncomingMessage(message) {
    switch (message.type) {
      case 'session.created':
      case 'session.updated':
        if (message.session && message.session.id) {
          this.sessionId = message.session.id;
          this.emit('session', this.sessionId);
        }
        break;

      case 'rate_limits.updated':
        this.updateRateLimits(message.rate_limits);
        break;

      case 'authentication.success':
        this.emit('authenticated', message.token);
        break;

      case 'authentication.error':
        this.emit('auth_error', message.error);
        break;

      case 'error':
        this.handleApiError(message.error);
        break;

      default:
        break;
    }

    // Resolve pending messages
    if (message.event_id && this.pendingMessages.has(message.event_id)) {
      const { resolve } = this.pendingMessages.get(message.event_id);
      resolve(message);
      this.pendingMessages.delete(message.event_id);
    }

    this.emit('message', message);
  }

  /**
   * Updates the rate limits based on OpenAI's response.
   * @param {Array} limits - Array of rate limit objects.
   */
  updateRateLimits(limits) {
    if (!Array.isArray(limits)) return;

    for (const limit of limits) {
      if (limit.name in this.rateLimits) {
        this.rateLimits[limit.name] = {
          limit: limit.limit,
          remaining: limit.remaining,
          resetTime: Date.now() + (limit.reset_seconds * 1000)
        };
      }
    }

    // Emit warnings if approaching limits
    for (const [type, data] of Object.entries(this.rateLimits)) {
      if (data.remaining < data.limit * 0.1) {
        this.emit('rate_limit_warning', {
          type,
          remaining: data.remaining,
          resetTime: data.resetTime
        });
      }
    }
  }

  /**
   * Handles API errors received from OpenAI.
   * @param {Object} error - The error object received.
   */
  handleApiError(error) {
    const errorTypes = {
      'rate_limit_exceeded': 'Rate limit exceeded',
      'invalid_request': 'Invalid request',
      'server_error': 'OpenAI server error'
      // Add more error types as needed
    };

    const errorMessage = errorTypes[error.code] || error.message;
    this.emit('api_error', { code: error.code, message: errorMessage });
  }

  /**
   * Handles the closing of the WebSocket connection.
   * @param {number} code - The close code.
   * @param {string} reason - The reason for closing.
   */
  handleClose(code, reason) {
    this.ws = null;
    this.emit('close', code, reason);

    if (this.shouldReconnect(code)) {
      this.attemptReconnection();
    }
  }

  /**
   * Determines whether the connection should attempt to reconnect based on the close code.
   * @param {number} code - The close code.
   * @returns {boolean} - Whether to attempt reconnection.
   */
  shouldReconnect(code) {
    const normalClosure = code === 1000;
    const maxRetriesExceeded = this.connectionAttempts >= this.maxRetries;
    return !normalClosure && !maxRetriesExceeded && !this.isReconnecting;
  }

  /**
   * Attempts to reconnect with exponential backoff.
   */
  async attemptReconnection() {
    if (this.isReconnecting) return;

    this.isReconnecting = true;
    this.connectionAttempts++;

    const delay = this.retryDelay * Math.pow(2, this.connectionAttempts - 1);

    console.log(`Attempting reconnection in ${delay}ms (Attempt ${this.connectionAttempts}/${this.maxRetries})`);

    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect();
      this.isReconnecting = false;
    } catch (error) {
      console.error(`Reconnection attempt ${this.connectionAttempts} failed:`, error.message);
      this.isReconnecting = false;
      if (this.connectionAttempts < this.maxRetries) {
        this.attemptReconnection();
      } else {
        this.emit('reconnection_failed', error);
      }
    }
  }

  /**
   * Sends a message to OpenAI.
   * @param {Object} message - The message object to send.
   * @param {number} [timeout=30000] - The timeout in milliseconds.
   * @returns {Promise<Object>} - Resolves with the response message.
   */
  send(message, timeout = 30000) {
    if (!this.isConnected()) {
      return new Promise((resolve, reject) => {
        this.pendingMessages.set(message.event_id, { message, resolve, reject });
        this.connect();
      });
    }

    try {
      const messageString = JSON.stringify(message);
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          this.pendingMessages.delete(message.event_id);
          reject(new Error('Message timeout'));
        }, timeout);

        this.pendingMessages.set(message.event_id, {
          message,
          resolve: (response) => {
            clearTimeout(timeoutId);
            resolve(response);
          },
          reject,
          timeoutId
        });

        this.ws.send(messageString, (err) => {
          if (err) {
            clearTimeout(timeoutId);
            this.pendingMessages.delete(message.event_id);
            reject(err);
          }
        });
      });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Processes any pending messages queued while the connection was down.
   */
  processPendingMessages() {
    for (const [eventId, { message, resolve, reject, timeoutId }] of this.pendingMessages) {
      try {
        this.send(message).then(resolve).catch(reject);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
        this.pendingMessages.delete(eventId);
      }
    }
  }

  /**
   * Checks if the WebSocket connection is open.
   * @returns {boolean} - Whether the connection is open.
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Closes the WebSocket connection.
   */
  close() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnected'); // 1000: Normal closure
      this.ws = null;
      this.sessionId = null;

      // Clear pending messages
      for (const [_, { reject, timeoutId }] of this.pendingMessages) {
        clearTimeout(timeoutId);
        reject(new Error('Connection closed'));
      }
      this.pendingMessages.clear();

      // Clear heartbeat interval if any
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
      }
    }
  }
}

export default OpenAIConnection;
