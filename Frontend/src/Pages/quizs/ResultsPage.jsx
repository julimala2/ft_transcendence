import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttempt } from "../../Api/quiz";


export function ResultsPage() {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadResults() {
            try {
                setLoading(true);
                const data = await getAttempt(Number(attemptId));
                setAttempt(data);
            } catch (err) {
                setError(err.error || "Impossible de charger les résultats");
            } finally {
                setLoading(false);
            }
        }
        loadResults();
    }, [attemptId]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={() => navigate("/")}>Retour à l'accueil</button>
            </div>
        );
    }

    if (!attempt) {
        return (
            <div>
                <p>Résultats introuvables</p>
                <button onClick={() => navigate("/")}>Retour à l'accueil</button>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Résultats</h1>
            <div>
                <p>Score: {attempt.score} / {attempt.total}</p>
            </div>
            <div>
                <button onClick={() => navigate("/")}>Retour à l'accueil</button>
                <button onClick={() => navigate("/quizzes")}>Rejouer</button>
            </div>
        </div>
    );
}
