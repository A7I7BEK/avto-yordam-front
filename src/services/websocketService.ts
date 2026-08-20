/**
 * Minimal STOMP-over-WebSocket client for realtime notifications.
 *
 * Connects to the backend STOMP endpoint at `ws://<host>/ws/websocket`
 * (the SockJS raw-websocket transport) using the browser's native WebSocket
 * and speaking the STOMP protocol directly — no external libraries required.
 *
 * Subscribes to:
 *  - `/topic/notifications`          → broadcast notifications
 *  - `/user/queue/notifications`     → the user's own queue (Spring resolves
 *    this to the session-specific destination from the CONNECT-time principal).
 *
 * Handlers are invoked whenever a notification message arrives.
 */

type NotificationHandler = (message: string) => void;

interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body: string;
}

const RECONNECT_DELAY_MS = 5000;
const FRAME_TERMINATOR = '\u0000';
const API_SUFFIX_REGEX = /\/api\/?$/;
const PROTOCOL_PREFIX_REGEX = /^https?:\/\//;

function buildWebSocketUrl(): string {
  const apiBase = import.meta.env.VITE_URL_API || 'http://localhost:8700/api';
  const host = apiBase
    .replace(API_SUFFIX_REGEX, '')
    .replace(PROTOCOL_PREFIX_REGEX, '');
  const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  // Raw WebSockets cannot set HTTP headers, so the JWT is passed as a query
  // parameter. The backend's JwtHandshakeInterceptor validates it during the
  // handshake and sets the session principal — required for
  // `/user/queue/notifications` delivery.
  const token = localStorage.getItem('token');
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  return `${scheme}://${host}/ws/websocket${query}`;
}

class NotificationSocketService {
  private socket: WebSocket | null = null;
  private connected = false;
  private shouldReconnect = true;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private buffer = '';
  private readonly handlers = new Set<NotificationHandler>();

  get isConnected(): boolean {
    return this.connected;
  }

  /** Register a handler. Returns an unsubscribe function. */
  onNotification(handler: NotificationHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  connect(): void {
    if (this.connected) {
      return;
    }
    this.shouldReconnect = true;
    this.open();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        // ignore
      }
      this.socket = null;
    }
    this.connected = false;
    this.buffer = '';
  }

  private open(): void {
    const url = buildWebSocketUrl();
    try {
      this.socket = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }
    this.socket.onopen = () => this.handleOpen();
    this.socket.onmessage = (event) => this.handleMessage(String(event.data));
    this.socket.onclose = () => this.handleClose();
    this.socket.onerror = () => {
      // The subsequent onclose event drives reconnection.
    };
  }

  private handleOpen(): void {
    const headers: Record<string, string> = {
      'accept-version': '1.1,1.2',
      'heart-beat': '0,0',
    };
    // Send the JWT so the backend can set the user principal on the session.
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    this.sendFrame('CONNECT', headers);
  }

  private handleMessage(data: string): void {
    // Concatenate into the buffer and split on the STOMP frame terminator.
    this.buffer += data;
    const frames = this.buffer.split(FRAME_TERMINATOR);
    this.buffer = frames.pop() ?? '';
    for (const raw of frames) {
      const frame = this.parseFrame(raw);
      if (!frame) {
        continue;
      }
      if (frame.command === 'CONNECTED') {
        this.connected = true;
        this.subscribe();
      } else if (frame.command === 'MESSAGE') {
        this.dispatch(frame.body);
      }
    }
  }

  private handleClose(): void {
    this.connected = false;
    if (this.shouldReconnect) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldReconnect) {
        this.open();
      }
    }, RECONNECT_DELAY_MS);
  }

  private subscribe(): void {
    this.sendFrame('SUBSCRIBE', {
      id: 'sub-topic',
      destination: '/topic/notifications',
    });
    this.sendFrame('SUBSCRIBE', {
      id: 'sub-user',
      destination: '/user/queue/notifications',
    });
  }

  private sendFrame(command: string, headers: Record<string, string>): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    const headerLines = Object.entries(headers).map(
      ([key, value]) => `${key}:${value}`,
    );
    const frame = [command, ...headerLines, '', FRAME_TERMINATOR].join('\n');
    this.socket.send(frame);
  }

  private parseFrame(raw: string): StompFrame | null {
    const terminatorIndex = raw.indexOf('\n\n');
    const headerBlock =
      terminatorIndex >= 0 ? raw.slice(0, terminatorIndex) : raw;
    const body = terminatorIndex >= 0 ? raw.slice(terminatorIndex + 2) : '';
    const lines = headerBlock.split('\n');
    const command = lines[0]?.trim();
    if (!command) {
      return null;
    }
    const headers: Record<string, string> = {};
    for (const line of lines.slice(1)) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        headers[line.slice(0, colonIndex).trim()] = line
          .slice(colonIndex + 1)
          .trim();
      }
    }
    return { command, headers, body };
  }

  private dispatch(body: string): void {
    for (const handler of this.handlers) {
      handler(body);
    }
  }
}

/** Singleton used across the app (bell, notifications pages). */
export const notificationSocket = new NotificationSocketService();
