import { useEffect, useState } from 'react';

import { getNotifications } from '../Api/notifications';
import { useAuth } from './useAuth';

// Le backend limite a 100 notifications max par requete
const NOTIF_LIMIT = 100;
const POLL_INTERVAL_MS = 30000;

export function useUnreadNotifications() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    async function fetchUnreadCount() {
      try {
        const data = await getNotifications(NOTIF_LIMIT);
        if (!cancelled) {
          setUnreadCount((data || []).filter(n => !n.is_read).length);
        }
      } catch (err) {
        // On ne fait pas remonter l'erreur : le rond est indicatif
        console.error('Erreur chargement notifications:', err);
      }
    }

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  return unreadCount;
}
