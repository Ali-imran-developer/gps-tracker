import React, { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import AuthController from '@/controllers/authController';

// Example component showing how to use the WebSocket hook with cookie authentication
export function WebSocketExample() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Get the current session for authentication
  const session = AuthController.getSession();

  // Initialize WebSocket with authentication
  const { send, readyState, disconnect } = useWebSocket('ws://localhost:8080/ws', {
    // Option 1: Let the hook automatically get cookies from AuthController
    withCredentials: true, // This will automatically include stored cookies

    // Option 2: Manually provide sessionId if needed
    sessionId: session?.sessionId || undefined,

    // Option 3: Add custom headers if your WebSocket server supports them
    customHeaders: {
      'Authorization': `Bearer ${session?.token}`,
      'X-Custom-Header': 'value'
    },

    // WebSocket event handlers
    onOpen: () => {
      console.log('WebSocket connected with authentication');
      setMessages(prev => [...prev, '✅ Connected to WebSocket']);
    },

    onMessage: (data) => {
      console.log('Received message:', data);
      setMessages(prev => [...prev, `📩 ${JSON.stringify(data)}`]);
    },

    onError: (error) => {
      console.error('WebSocket error:', error);
      setMessages(prev => [...prev, '❌ Connection error']);
    },

    onClose: (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setMessages(prev => [...prev, `🔌 Disconnected: ${event.reason || 'Connection closed'}`]);
    },

    // Auto-reconnect every 3 seconds if connection drops
    autoReconnectMs: 3000
  });

  // Send a message
  const handleSend = () => {
    if (inputMessage && readyState === WebSocket.OPEN) {
      const success = send({
        type: 'message',
        content: inputMessage,
        timestamp: new Date().toISOString()
      });

      if (success) {
        setMessages(prev => [...prev, `📤 Sent: ${inputMessage}`]);
        setInputMessage('');
      }
    }
  };

  // Connection status indicator
  const getConnectionStatus = () => {
    switch (readyState) {
      case WebSocket.CONNECTING:
        return '🟡 Connecting...';
      case WebSocket.OPEN:
        return '🟢 Connected';
      case WebSocket.CLOSING:
        return '🟠 Closing...';
      case WebSocket.CLOSED:
        return '🔴 Disconnected';
      default:
        return '⚫ Unknown';
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">WebSocket with Cookie Authentication</h2>

      <div className="mb-4">
        <span className="font-semibold">Status: </span>
        {getConnectionStatus()}
      </div>

      <div className="mb-4">
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Disconnect
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="px-3 py-2 border rounded mr-2"
        />
        <button
          onClick={handleSend}
          disabled={readyState !== WebSocket.OPEN}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>

      <div className="border rounded p-4 h-64 overflow-y-auto">
        <h3 className="font-semibold mb-2">Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index} className="mb-1">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// Usage in your main component or page:
// import { WebSocketExample } from '@/hooks/useWebSocket.example';
//
// function YourComponent() {
//   return <WebSocketExample />;
// }