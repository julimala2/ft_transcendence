import { useEffect, useState } from 'react';
import {
  getNotifications,
  readAllNotifications,
  readOneNotification,
  deleteAllNotifications,
  deleteOneNotification,
} from '../Api/notifications';
import { useAuth } from '../Hooks/useAuth';
import { StyledButton, ListContainer } from '../Components/Components';

// Le backend limite par defaut a 10 notifications, max 100
const NOTIF_LIMIT = 100;

const TYPE_LABELS = {
  friend_request: "Demande d'ami",
  friend_accepted: 'Demande acceptée',
  achievement: 'Succès',
  updated_display_name: 'Profil',
  updated_email: 'Profil',
  updated_avatar: 'Profil',
  updated_password: 'Sécurité',
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AccountNotifs() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function loadNotifications() {
      try {
        const data = await getNotifications(NOTIF_LIMIT);
        if (!cancelled) setNotifications(data || []);
      } catch (err) {
        if (!cancelled) setError(err.error || 'Failed to load notifications');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNotifications();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleReadOne(notif) {
    if (notif.is_read) return;
    try {
      setActionError(null);
      await readOneNotification(notif.id);
      setNotifications(prev =>
        prev.map(n => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      setActionError(
        err.error || 'Impossible de marquer la notification comme lue'
      );
    }
  }

  async function handleDeleteOne(notif, e) {
    e.stopPropagation();
    try {
      setActionError(null);
      await deleteOneNotification(notif.id);
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    } catch (err) {
      setActionError(err.error || 'Impossible de supprimer la notification');
    }
  }

  async function handleReadAll() {
    try {
      setActionError(null);
      await readAllNotifications();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      setActionError(
        err.error || 'Impossible de marquer toutes les notifications comme lues'
      );
    }
  }

  async function handleDeleteAll() {
    try {
      setActionError(null);
      await deleteAllNotifications();
      setNotifications([]);
    } catch (err) {
      setActionError(err.error || 'Impossible de supprimer les notifications');
    }
  }

  if (loading) {
    return <div>Chargement des notifications...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="w-full h-full min-h-0 flex flex-1 flex-col gap-2">
      <h2 className="font-bold text-xl">
        Notifications
        {unreadCount > 0 && (
          <span className="ml-2 text-amber-400">
            ({unreadCount} non lue{unreadCount > 1 ? 's' : ''})
          </span>
        )}
      </h2>
      {actionError && <p className="text-red-500">{actionError}</p>}
      {!notifications.length ? (
        <p className="text-gray-500">
          Vous n'avez pas de nouvelles notifications.
        </p>
      ) : (
        <div className="flex flex-1 flex-col min-h-0 w-full">
          <ListContainer>
            {notifications.map(n => (
              <NotifCard
                key={n.id}
                notif={n}
                onRead={handleReadOne}
                onDelete={handleDeleteOne}
              />
            ))}
          </ListContainer>
        </div>
      )}
      <div className="flex w-full flex-row justify-end gap-2">
        <StyledButton
          variant="success"
          onClick={handleReadAll}
          disabled={!unreadCount}
        >
          Tout lire
        </StyledButton>
        <StyledButton
          variant="danger"
          onClick={handleDeleteAll}
          disabled={!notifications.length}
        >
          Tout supprimer
        </StyledButton>
      </div>
    </div>
  );
}

function NotifCard({ notif, onRead, onDelete }) {
  const unread = !notif.is_read;
  return (
    <li
      className={`flex w-full items-center justify-between gap-2 p-2 pl-3 pr-2 rounded-md border ${
        unread
          ? 'bg-blue-900 border-amber-400 cursor-pointer'
          : 'bg-blue-950 border-gray-500 opacity-75 cursor-pointer'
      }`}
      onClick={() => onRead(notif)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRead(notif);
        }
      }}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          unread ? 'bg-amber-400' : 'bg-gray-600'
        }`}
        title={unread ? 'Non lue' : 'Lue'}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <span className={unread ? 'font-bold' : 'text-gray-400 break-words'}>
          {notif.message}
        </span>
        <span className="text-xs text-gray-500">
          {TYPE_LABELS[notif.type] || 'Info'}
          {formatDate(notif.created_at) && ` · ${formatDate(notif.created_at)}`}
        </span>
      </div>
      <StyledButton
        variant="danger"
        className="py-1 px-2 text-sm shrink-0"
        onClick={e => onDelete(notif, e)}
        aria-label="Supprimer la notification"
      >
        ✕
      </StyledButton>
    </li>
  );
}
