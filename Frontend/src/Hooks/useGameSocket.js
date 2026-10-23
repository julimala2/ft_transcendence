import { useEffect, useRef, useState } from 'react';

export function useGameSocket(roomId) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    console.log('🔍 Debug WebSocket:');
    console.log('  Token:', token ? '✅ Trouvé' : '❌ Pas de token!');
    console.log('  Room ID:', roomId);

    // Se connecter au serveur WebSocket (wss pour HTTPS)
    const protocol = 'wss:';
    const wsUrl = `${protocol}//localhost:3000/ws?token=${encodeURIComponent(token || '')}`;
    console.log('  URL:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connecté');
      setConnected(true);

      // choix partie rapide / creer room / rejoindre room

      
      // Rejoindre la room spécifiée
      if (roomId) {
        console.log(`📍 Tentative de rejoindre la room: ${roomId}`);
        ws.send(
          JSON.stringify({
            type: 'joinRoom',
            roomId: roomId,
          })
        );
      }
    };

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        console.log('💬 Message reçu:', data);

        if (data.type === 'chat') {
          setMessages(prev => [
            ...prev,
            {
              user: data.user,
              text: data.text,
              timestamp: new Date(),
            },
          ]);
        }

        if (data.type === 'joined_room') {
          console.log(`${data.data.user} a rejoint la room`);
          setUsers(prev => [...new Set([...prev, data.data.user])]);
          setMessages(prev => [...prev, {
            text: data.data.user + ' a rejoint room',
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('Erreur parsing message:', error);
      }
    };

    ws.onerror = error => {
      console.error('❌ WebSocket erreur:', error);
      setConnected(false);
    };

    ws.onclose = event => {
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
  }, [roomId]);

  const send = message => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket non connecté');
    }
  };

  const sendChat = text => {
    send({
      type: 'chat',
      text: text,
    });
  };

  return {
    connected,
    messages,
    users,
    send,
    sendChat,
  };
}
