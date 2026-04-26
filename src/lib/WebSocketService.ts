type WSCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<WSCallback> = new Set();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private statusListeners: Set<(status: 'connecting' | 'connected' | 'disconnected') => void> = new Set();
  private _status: 'connecting' | 'connected' | 'disconnected' = 'disconnected';

  get status() {
    return this._status;
  }

  private setStatus(status: 'connecting' | 'connected' | 'disconnected') {
    this._status = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    console.log(`[NIYAH WS] Connecting to ${wsUrl}...`);
    this.setStatus('connecting');

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('[NIYAH WS] Connected');
      this.setStatus('connected');
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach(listener => listener(data));
      } catch (e) {
        this.listeners.forEach(listener => listener(event.data));
      }
    };

    this.ws.onclose = () => {
      console.log('[NIYAH WS] Disconnected');
      this.setStatus('disconnected');
      this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('[NIYAH WS] Error:', error);
      this.ws?.close();
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
      console.warn('[NIYAH WS] Cannot send message, socket not open');
    }
  }

  subscribe(callback: WSCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  onStatusChange(callback: (status: 'connecting' | 'connected' | 'disconnected') => void) {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }
}

export const wsService = new WebSocketService();
