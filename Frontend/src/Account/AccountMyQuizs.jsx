import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../Api/api';
import { useAuth } from '../Hooks/useAuth';

export function AccountMyQuizs() {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        async function loadQuizzes() {
            try {
                const data = await apiFetch('/api/quizzes');
                if (!cancelled) setQuizzes(data || []);
            } catch (err) {
                if (!cancelled) setError(err.error || 'Failed to load quizzes');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadQuizzes();
        return () => { cancelled = true; };
    }, [user]);

    if (loading) {
        return <div>Chargement des quizs...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div>
            <h1>Mes quizs</h1>
            <p>
                <Link to="/quiz/edit">Créer un nouveau quiz</Link>
            </p>
            {!quizzes.length && <p>Vous n'avez pas encore créé de quiz.</p>}
            <ul>
                {quizzes.map((q, idx) => (
                    <li key={q.id} className="flex items-center justify-between py-1">
                        <span>{q.title ? `${q.title} (ID: ${q.id})` : `Quiz ${idx + 1} (ID: ${q.id})`}</span>
                        <Link
                            to={`/quiz/edit/${q.id}`}
                            className="btn btn-sm btn-primary"
                        >
                            Modifier
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

