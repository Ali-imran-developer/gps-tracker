// useWebSocket.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import AuthController from "@/controllers/authController";
import { APP_KEY } from "@/config/constants";

type WSOptions = {
  sessionId?: string;                 // JSESSIONID value
  onMessage?: (data: any) => void;    // parsed JSON or raw string
  onOpen?: () => void;
  onError?: (e: Event) => void;
  onClose?: (e: CloseEvent) => void;
  autoReconnectMs?: number;           // e.g. 3000
  withCredentials?: boolean;          // Send cookies with request
  customHeaders?: Record<string, string>; // Additional headers if needed
};

export function useWebSocket(url: string, {
  sessionId,
  onMessage,
  onOpen,
  onError,
  onClose,
  autoReconnectMs = 0,
  withCredentials = true,
  customHeaders,
}: WSOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const reconnectTimer = useRef<number | null>(null);

  const getCookieValue = useCallback((name: string) => {
    return Cookies.get(name) || "";
  }, []);

  const buildWebSocketUrl = useCallback(() => {
    try {
      const wsUrl = new URL(url, window.location.href);

      // Get session from AuthController or cookies
      const session = AuthController.getSession();
      const appCookie = getCookieValue(APP_KEY);

      // Add authentication parameters to WebSocket URL if needed
      if (withCredentials && session) {
        // Option 1: Add session ID as query parameter
        if (session.sessionId) {
          wsUrl.searchParams.append('sessionId', session.sessionId);
        }
        // Option 2: Add token if available
        if (session.token) {
          wsUrl.searchParams.append('token', session.token);
        }
      }

      // If JSESSIONID is provided, add it as well
      if (sessionId) {
        wsUrl.searchParams.append('JSESSIONID', sessionId);
      }

      return wsUrl.toString();
    } catch (error) {
      console.error('Error building WebSocket URL:', error);
      return url;
    }
  }, [url, sessionId, withCredentials, getCookieValue]);

  const setCookieIfSameOrigin = useCallback(() => {
    try {
      const u = new URL(url, window.location.href);
      const sameOrigin = (u.hostname === window.location.hostname && u.port === window.location.port && u.protocol.replace("ws", "http") === window.location.protocol);

      if (sameOrigin) {
        // Set JSESSIONID if provided
        if (sessionId) {
          const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toUTCString();
          document.cookie = `JSESSIONID=${encodeURIComponent(sessionId)}; path=/; expires=${expires}`;
        }

        // Ensure app cookie is also set if withCredentials is true
        if (withCredentials) {
          const appCookie = getCookieValue(APP_KEY);
          if (appCookie) {
            // Cookie already exists, no need to set again
            console.log('Authentication cookie already set');
          }
        }
      }
    } catch (error) {
      console.error('Error setting cookies:', error);
    }
  }, [url, sessionId, withCredentials, getCookieValue]);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setCookieIfSameOrigin();

    // Build URL with authentication parameters
    const wsUrl = buildWebSocketUrl();

    // Create WebSocket connection
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;
    setReadyState(socket.readyState);

    socket.onopen = () => {
      setReadyState(socket.readyState);
      onOpen?.();
    };

    socket.onmessage = (event) => {
      const text = event.data;
      try {
        const parsed = JSON.parse(text);
        onMessage?.(parsed);
      } catch {
        onMessage?.(text);
      }
    };

    socket.onerror = (e) => {
      onError?.(e);
    };

    socket.onclose = (e) => {
      setReadyState(socket.readyState);
      onClose?.(e);
      if (autoReconnectMs > 0) {
        reconnectTimer.current = window.setTimeout(connect, autoReconnectMs);
      }
    };
  }, [buildWebSocketUrl, onOpen, onMessage, onError, onClose, autoReconnectMs, setCookieIfSameOrigin]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    wsRef.current?.close(1000, "Client disconnect");
    wsRef.current = null;
    setReadyState(WebSocket.CLOSED);
  }, []);

  const send = useCallback((payload: unknown) => {
    const s = wsRef.current;
    if (!s || s.readyState !== WebSocket.OPEN) return false;
    s.send(typeof payload === "string" ? payload : JSON.stringify(payload));
    return true;
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return useMemo(() => ({
    socket: wsRef.current,
    readyState,
    connect,
    disconnect,
    send,
  }), [readyState, connect, disconnect, send]);
}
