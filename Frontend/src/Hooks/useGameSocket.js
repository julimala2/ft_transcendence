import { useContext } from 'react';

import { GameSocketContext } from './GameSocketProvider';

// La connexion WebSocket est portée par GameSocketProvider (monté au-dessus
// des routes dans main.jsx) : ce hook expose simplement son contexte, donc
// chaque page qui l'appelle partage la MÊME connexion et les MÊMES messages.
export function useGameSocket() {
  const context = useContext(GameSocketContext);
  if (!context) {
    throw new Error('useGameSocket doit être utilisé dans un GameSocketProvider');
  }
  return context;
}
