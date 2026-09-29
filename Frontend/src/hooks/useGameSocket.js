import { useEffect, useRef, useState } from 'react';

export function useGameSocket(roomId) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Se connecter au serveur WebSocket (wss pour HTTPS)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//localhost:3000/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connecté');
      setConnected(true);

      // Rejoindre la room spécifiée
      if (roomId) {
        ws.send(JSON.stringify({
          type: 'joinRoom',
          roomId: roomId
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'chat') {
          setMessages(prev => [...prev, {
            user: data.user,
            text: data.text,
            timestamp: new Date()
          }]);
        }

        if (data.type === 'userJoined') {
          console.log(`${data.user} a rejoint la room`);
          setUsers(prev => [...new Set([...prev, data.user])]);
        }
      } catch (error) {
        console.error('Erreur parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket erreur:', error);
      setConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket déconnecté');
      setConnected(false);
    };

    return () => {
      if (ws && ws.readyState === 1) {
        ws.close();
      }
    };
  }, [roomId]);

  const send = (message) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket non connecté');
    }
  };

  const sendChat = (text) => {
    send({
      type: 'chat',
      text: text
    });
  };

  return {
    connected,
    messages,
    users,
    send,
    sendChat
  };
}
