import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export default function GpsSocket() {
  const [status, setStatus] = useState("Not connected");
  const [log, setLog] = useState("");
  const wsRef = useRef(null);

  function appendLog(msg) {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => `[${time}] ${msg}\n` + prev);
  }

  async function login() {
    try {
      appendLog("Logging in with email=office, password=1122...");

      const resp = await fetch("http://live.farostestip.online/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: "office", password: "1122" }),
        credentials: "include", // keep cookies
      });

      if (!resp.ok) throw new Error("Login failed: " + resp.status);

      const user = await resp.json();
      appendLog("Login OK: " + JSON.stringify(user));
      setStatus("Login successful. Ready to connect WebSocket.");
    } catch (err) {
      appendLog("Login error: " + err);
      setStatus("Login failed");
    }
  }

  function connect() {
    appendLog("Connecting to WebSocket...");
    setStatus("Connecting...");
    const ws = new WebSocket("ws://live.farostestip.online/api/socket");

    ws.onopen = () => {
      setStatus("Connected");
      appendLog("WebSocket OPEN");
    };

    ws.onmessage = (ev) => appendLog("Message: " + ev.data);

    ws.onerror = (err) => {
      setStatus("WebSocket error");
      appendLog("WebSocket ERROR: " + err);
    };

    ws.onclose = (ev) => {
      setStatus(`Closed (code ${ev.code})`);
      appendLog(`WebSocket CLOSED: code=${ev.code}, reason=${ev.reason || "(no reason)"}`);
      wsRef.current = null;
    };

    wsRef.current = ws;
  }

  function disconnect() {
    if (wsRef.current) {
      wsRef.current.close(1000, "Client disconnect");
      appendLog("Requested websocket close (1000).");
    }
  }

  return (
    <div className="p-6">
      <h1>GPS WebSocket Test</h1>
      <div className="flex items-center gap-4">
        <Button onClick={login}>Login</Button>
        <Button onClick={connect}>Connect</Button>
        <Button onClick={disconnect}>Disconnect</Button>
        <Button onClick={() => setLog("")}>Clear Log</Button>
      </div>

      <div style={{ fontWeight: "700", margin: "12px 0" }}>Status: {status}</div>

      <h3>Log</h3>
      <pre style={{ background: "#111", color: "#eee", padding: "12px", borderRadius: "6px", height: "300px", overflow: "auto" }}>
        {log}
      </pre>
    </div>
  );
}
