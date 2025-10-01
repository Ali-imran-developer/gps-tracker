import { Button } from "@/components/ui/button";
import AuthController from "@/controllers/authController";
import { useState, useRef } from "react";

export default function GpsSocket() {
  const [status, setStatus] = useState("Not connected");
  const [log, setLog] = useState("");
  const wsRef = useRef(null);
  const session = AuthController.getSession();

  function appendLog(msg: any) {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => `[${time}] ${msg}\n` + prev);
  }

  async function login() {
    try {
      appendLog("Logging in with email=office, password=1122...");
      const resp = await fetch("http://live.farostestip.online/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: session?.credentials?.user, password: session?.credentials?.pass }),
        credentials: "include",
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

  return (
    <div className="p-6">
      <h1>GPS WebSocket Test</h1>
      <div className="flex items-center gap-4">
        <Button onClick={login}>Login</Button>
        <Button onClick={connect}>Connect</Button>
      </div>
    </div>
  );
}
