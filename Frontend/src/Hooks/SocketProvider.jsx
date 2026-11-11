import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';

// 1️⃣ On crée un contexte
const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  // 2️⃣ On stocke la connexion WebSocket
  const wsRef = useRef(null);
  const handlersRef = useRef({});

  const [connected,setConnected] = useState(false);
  const [connectionError,setConnectionError] = useState(null);

  // 4️⃣ On initialise la connexion WebSocket
  useEffect(() => {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
        console.log('✅ Connecté au serveur');
        setConnected(true);
        setConnectionError(null);
    }

    ws.onerror = () => {
        setConnectionError('Impossible de se connecter au serveur WebSocket.');
    }

    ws.onclose = () => {
        console.log('deconnected');
        setConnected(false);
        setConnectionError(prev => prev ?? 'Connexion au serveur impossible ou perdue (session requise ?).');
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if(msg.type !== "mousePosition")
        console.log('WS <-', msg);
      // 🎯 SI ce message a un TYPE et qu'on a des handlers pour ce type,
      //    on les appelle TOUS avec les données du message
      if (msg.type && handlersRef.current[msg.type]) {
        handlersRef.current[msg.type].forEach(handler => {
          handler(msg.data); // On passe les données du message au handler
        });
      }
    };

    return () => ws.close(); // Nettoyage
  }, []);

  // 5️⃣ Fonction pour ENVoyer un message
  // (useCallback : identité stable, ne dépend que de refs)
  const send = useCallback((type, data) => {
    if (wsRef.current?.readyState === 1) { // 1 = OPEN
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  }, []);

  // 6️⃣ Fonction pour ÉCOUTER un type de message
  const on = useCallback((type, handler) => {
    if (!handlersRef.current[type]) handlersRef.current[type] = [];
    handlersRef.current[type].push(handler);
  }, []);

  // 7️⃣ Fonction pour ARRÊTER d'écouter
  const off = useCallback((type, handler) => {
    if (handlersRef.current[type]) {
      handlersRef.current[type] = handlersRef.current[type].filter(h => h !== handler);
    }
  }, []);

  // 8️⃣ On expose les fonctions au contexte (mémoizé pour garder une identité stable)
  const value = useMemo(
    () => ({ send, on, off, connected, connectionError }),
    [send, on, off, connected, connectionError]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// 9️⃣ Hook pour utiliser le socket facilement
export const useSocket = () => useContext(SocketContext);