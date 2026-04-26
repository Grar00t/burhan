import { useState, useEffect } from 'react';
import { wsService } from '../lib/WebSocketService';

export type WebSocketStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

/**
 * Hook to monitor the Sovereign Black Hole Network connection status.
 */
export function useWebSocket() {
  const [status, setStatus] = useState<WebSocketStatus>(
    wsService.status.toUpperCase() as WebSocketStatus
  );

  useEffect(() => {
    const unsubscribe = wsService.onStatusChange((newStatus) => {
      setStatus(newStatus.toUpperCase() as WebSocketStatus);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    status,
    wsService
  };
}
