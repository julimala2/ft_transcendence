import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttempt } from "../../Api/quiz";
import { StyledButton } from "../../Components/Buttons";


export function CustomResultsPage() {
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
                <StyledButton onClick={() => navigate("/")}>Retour à l'accueil</StyledButton>
            </div>
        );
    }

    if (!attempt) {
        return (
            <div>
                <p>Résultats introuvables</p>
                <StyledButton onClick={() => navigate("/")}>Retour à l'accueil</StyledButton>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Résultats - Quiz custom</h1>
            <div>
                <p>Score: {attempt.score} / {attempt.total}</p>
            </div>
            <div>
                <StyledButton onClick={() => navigate("/play/offline/custom")} className="button">
                    Retour aux paramètres
                </StyledButton>
            </div>
        </div>
    );
}
