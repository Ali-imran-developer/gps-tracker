import { useState, useRef, useEffect, useCallback } from "react";
import AuthController from "@/controllers/authController";

export function useAuthWebSocket() {
  const [status, setStatus] = useState("Not connected");
  const [log, setLog] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const session = AuthController.getSession();

  function appendLog(msg: string) {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => `[${time}] ${msg}\n` + prev);
  }

  const loginAndConnect = useCallback(async () => {
    try {
      appendLog("Logging in...");
      const resp = await fetch("http://live.farostestip.online/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: session?.credentials?.user,
          password: session?.credentials?.pass,
        }),
        credentials: "include",
      });

      if (!resp.ok) throw new Error("Login failed: " + resp.status);

      const user = await resp.json();
      appendLog("Login OK: " + JSON.stringify(user));
      setStatus("Login successful. Connecting WebSocket...");

      connect();
    } catch (err: any) {
      appendLog("Login error: " + err.message);
      setStatus("Login failed");
      reconnectTimer.current = setTimeout(() => loginAndConnect(), 5000);
    }
  }, [session]);

  const connect = useCallback(() => {
    appendLog("Connecting to WebSocket...");
    setStatus("Connecting...");
    const ws = new WebSocket("ws://live.farostestip.online/api/socket");

    ws.onopen = () => {
      setStatus("Connected");
      appendLog("WebSocket OPEN");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (err) => {
      setStatus("WebSocket error");
      appendLog("WebSocket ERROR: " + JSON.stringify(err));
    };

    ws.onclose = (ev) => {
      setStatus(`Closed (code ${ev.code})`);
      appendLog(`WebSocket CLOSED: code=${ev.code}, reason=${ev.reason || "(no reason)"}`);
      wsRef.current = null;
    };

    wsRef.current = ws;
  }, [loginAndConnect]);

  useEffect(() => {
    loginAndConnect();
    const handleOnline = () => {
      appendLog("Network online — reconnecting WebSocket...");
      connect();
    };
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, []);

  function manualReconnect() {
    appendLog("Manual reconnect triggered by user");
    connect();
  }

  return {
    messages,
    status,
    log,
    reconnect: manualReconnect,
  };
}
