import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send("Hello from frontend!");
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("❌ WebSocket closed");
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [url]);

  return { messages, isConnected };
};
