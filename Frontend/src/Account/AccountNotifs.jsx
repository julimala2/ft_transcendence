import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../Api/api';
import { useAuth } from '../Hooks/useAuth';

export function AccountNotifs() {
    const { user } = useAuth();
    const [notifs, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        async function loadNotifications() {
            try {
            const data = await apiFetch('/api/notifications');
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

    if (loading) {
        return <div>Chargement des notifications...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
    <div className="w-full flex flex-col justify-between h-full">
      {!notifications.length && <p>Vous n'avez pas de nouvelles notifications.</p>}
      <ListContainer>
        {notifications.map((q, idx) => (
          <CardContainer key={q.id}>
            <li className="flex items-center justify-between py-1">
              <span>{q.title}</span>
            </li>
            <Link to={`/quiz/edit/${q.id}`}>
              <StyledButton>Modifier</StyledButton>
            </Link>
          </CardContainer>
        ))}
      </ListContainer>
      <p className="flex w-full flex-row justify-end">
        <Link to="/quiz/create">
          <StyledButton>Creer un nouveau quiz</StyledButton>
        </Link>
      </p>
    </div>
  );
}