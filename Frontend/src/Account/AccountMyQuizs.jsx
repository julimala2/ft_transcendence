import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { apiFetch } from '../Api/api';
import {
  StyledButton,
  CardContainer,
  ListContainer,
} from '../Components/Components';
import { useAuth } from '../Hooks/useAuth';

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
    <div className="w-full flex flex-col justify-between gap-2 flex-1 overflow-y-auto h-full min-h-0">
      {!quizzes.length && <p>Vous n'avez pas encore créé de quiz.</p>}
        <div className='flex flex-1 flex-col gap-2 overflow-y-scroll'>
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
        </div>
      <p className="flex w-full flex-row justify-end">
        <Link to="/quiz/create">
          <StyledButton>Creer un nouveau quiz</StyledButton>
        </Link>
      </p>
    </div>
  );
}
