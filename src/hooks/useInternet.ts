import { useEffect, useState } from "react";

export function useNetworkStatus(pingUrl: string = "https://www.google.com/favicon.ico") {
  const [isOnline, setIsOnline] = useState(true);

  async function checkConnection() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(pingUrl, { method: "HEAD", signal: controller.signal, cache: "no-store" });
      clearTimeout(timeout);
      setIsOnline(res.ok);
    } catch {
      setIsOnline(false);
    }
  }

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  return isOnline;
}
