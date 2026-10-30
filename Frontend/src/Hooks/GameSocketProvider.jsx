import { createContext, useEffect, useRef, useState } from 'react';

// Contexte qui partage la connexion WebSocket entre toutes les pages,
// pour qu'elle survive aux changements de route.
export const GameSocketContext = createContext(null);

export function GameSocketProvider({ children }) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users] = useState([]);

  //TODO not use local stored token
  useEffect(() => {
    const token = localStorage.getItem('token');

    console.log('🔍 Debug WebSocket:');
    console.log('  Token:', token ? '✅ Trouvé' : '❌ Pas de token!');

    // Le backend est servi en HTTPS (server.js), donc toujours wss
    const protocol = 'wss:';
    const wsUrl = `${protocol}//localhost:3000/ws?token=${encodeURIComponent(token || '')}`;
    console.log('  URL:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connecté');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WS <-', message);
      setMessages(prev => [...prev, message]);
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket erreur:', error);
      setConnected(false);
    };

    ws.onclose = (event) => {
      console.log('🔴 WebSocket déconnecté');
      console.log('  Code:', event.code);
      console.log('  Raison:', event.reason);
      setConnected(false);
    };

    return () => {
      if (ws && ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  const send = (message) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify(message));
      console.log('sent:', message);
    } else {
      console.error('WebSocket non connecté');
    }
  };

  const sendChat = (text) => {
    send({
      type: 'chat',
      data: { text: text }
    });
  };

  return (
    <GameSocketContext.Provider
      value={{ connected, messages, users, send, sendChat }}
    >
      {children}
    </GameSocketContext.Provider>
  );
}
