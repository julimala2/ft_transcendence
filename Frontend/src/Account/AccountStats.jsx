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
                const data = await apiFetch(`/api/users/${user.id}/stats`);
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
            <h1>Mes Statistiques</h1>
            
            <div>
                <h2>Score et Niveau</h2>
                <p><strong>Score total:</strong> {stats.score || 0}</p>
                <p><strong>Niveau:</strong> {stats.level || 1}</p>
            </div>

            <div>
                <h2>Activité Quiz</h2>
                <p><strong>Quizs joués:</strong> {stats.quizzesPlayed || 0}</p>
                <p><strong>Quizs créés:</strong> {stats.quizzesCreated || 0}</p>
                <p><strong>Taux de réussite:</strong> {stats.successRate || 0}%</p>
            </div>

            {stats.streaks && (
                <div>
                    <h2>Series</h2>
                    <p><strong>Meilleure série:</strong> {stats.streaks.best || 0} jours</p>
                    <p><strong>Série actuelle:</strong> {stats.streaks.current || 0} jours</p>
                </div>
            )}

            {stats.byCategory && Object.keys(stats.byCategory).length > 0 && (
                <div>
                    <h2>Par catégorie</h2>
                    {Object.entries(stats.byCategory).map(([category, categoryStats]) => (
                        <div key={category}>
                            <p><strong>{category}:</strong> {categoryStats.score || 0} points, {categoryStats.accuracy || 0}% de réussite</p>
                        </div>
                    ))}
                </div>
            )}

            {stats.recentActivity && stats.recentActivity.length > 0 && (
                <div>
                    <h2>Activité récente</h2>
                    {stats.recentActivity.map((activity, index) => (
                        <p key={index}>
                            {activity.date} - {activity.type} - Score: {activity.score}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
