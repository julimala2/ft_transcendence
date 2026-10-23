import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../Api/api';
import { useAuth } from '../Hooks/useAuth';
import {
  StyledButton,
  CardContainer,
  ListContainer,
} from '../Components/Components';

export function AccountMyQuizs() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function loadQuizzes() {
      try {
        const data = await apiFetch('/api/quizzes?mine=true');
        if (!cancelled) setQuizzes(data || []);
      } catch (err) {
        if (!cancelled) setError(err.error || 'Failed to load quizzes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadQuizzes();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return <div>Chargement des quizs...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col justify-between h-full">
      {!quizzes.length && <p>Vous n'avez pas encore créé de quiz.</p>}
      <ListContainer>
        {quizzes.map((q, idx) => (
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
