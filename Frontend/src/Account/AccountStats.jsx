import { useEffect, useState } from 'react';
import { apiFetch } from '../Api/api';
import { useAuth } from '../Hooks/useAuth';

export function AccountStats() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        async function loadStats() {
            try {
                const data = await apiFetch('/api/statistics');
                if (!cancelled) setStats(data);
            } catch (err) {
                if (!cancelled) setError(err.error || 'Failed to load stats');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadStats();
        return () => {
            cancelled = true;
        };
    }, [user]);

    if (loading) {
        return <div>Chargement des statistiques...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    if (!stats) {
        return <div>Statistiques introuvables</div>;
    }

    return (
        <div className="page">
            <h1>Mes Statistiques (raw)</h1>
            <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
    );
}

