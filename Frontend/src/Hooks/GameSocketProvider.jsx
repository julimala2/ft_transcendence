import { createContext, useEffect, useRef, useState } from 'react';

// Contexte qui partage la connexion WebSocket entre toutes les pages,
// pour qu'elle survive aux changements de route.
export const GameSocketContext = createContext(null);

export function GameSocketProvider({ children }) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users] = useState([]);
  const messageHandlersRef = useRef({});
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [isInRoom,setIsInRoom] = useState(false);

  //TODO not use local stored token
  useEffect(() => {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connecté');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WS <-', message);
      setMessages(prev => [...prev, message]);

      switch(message.type){
        case "chat":
          // afficher le message dans l'UI
        case "roomCreated":
          console.log('room?')
          Navigate(`/room/${roomId}`);
        case "joinedRoom":
          // naviguer dans la room si c'est soit meme
          // si un autre user rejoint la room, afficher un message dans l'UI
        
        
      }


      // // Call all registered handlers for this message type
      // if (message.type && messageHandlersRef.current[message.type]) {
      //   messageHandlersRef.current[message.type].forEach(handler => {
      //     handler(message.data);
      //   });
      // }
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

  const joinRoom = (roomId) => {
    setCurrentRoomId(roomId);
    setIsInRoom(true);
    send({
      type: 'joinRoom',
      data: {roomId: roomId}
    });
  }

  const createRoom = (roomName) => {
    send({
      type: 'createRoom',
      data: {roomName: roomName}
    });
  }

  // Register a handler for a specific message type
  const on = (type, handler) => {
    if (!messageHandlersRef.current[type]) {
      messageHandlersRef.current[type] = [];
    }
    messageHandlersRef.current[type].push(handler);
  };

  // Unregister a handler for a specific message type
  const off = (type, handler) => {
    if (messageHandlersRef.current[type]) {
      messageHandlersRef.current[type] = messageHandlersRef.current[type]
        .filter(h => h !== handler);
    }
  };

  // Clear all handlers (useful for cleanup)
  const clearHandlers = () => {
    messageHandlersRef.current = {};
  };

  const closeSocket = () => {
    if(wsRef.current && wsRef.current.readyState ===
        WebSocket.OPEN) {
          wsRef.current.close();
          setConnected(false);
          console.log('Websocket ferme');
        }
  };

  return (
    <GameSocketContext.Provider
      value={{ connected, messages, users, send, sendChat, on, off, clearHandlers, closeSocket }}
    >
      {children}
    </GameSocketContext.Provider>
  );
}