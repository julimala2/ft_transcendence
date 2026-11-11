import { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { getAttempt } from '../../Api/quiz';
import { StyledButton } from '../../Components/Buttons';
import {
  MainContainer,
  PageContainer,
  StyledDiv,
} from '../../Components/Containers';
import { StyledSeparator } from '../../Components/Separators';

export function QuickResultsPage() {
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
        setError(err.error || 'Impossible de charger les résultats');
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [attemptId]);

  if (loading) {
    return (
      <MainContainer>
        <PageContainer>
          <StyledDiv className="p-6">
            <p className="text-muted text-center">
              Chargement des résultats...
            </p>
          </StyledDiv>
        </PageContainer>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer>
        <PageContainer>
          <StyledDiv outerClassName="w-full max-w-xl" className="gap-5 p-6">
            <p className="text-danger text-center text-lg">{error}</p>
            <div className="flex justify-center">
              <StyledButton onClick={() => navigate('/')}>
                Retour à l'accueil
              </StyledButton>
            </div>
          </StyledDiv>
        </PageContainer>
      </MainContainer>
    );
  }

  if (!attempt) {
    return (
      <MainContainer>
        <PageContainer>
          <StyledDiv outerClassName="w-full max-w-xl" className="gap-5 p-6">
            <p className="text-danger text-center text-lg">
              Résultats introuvables
            </p>
            <div className="flex justify-center">
              <StyledButton onClick={() => navigate('/')}>
                Retour à l'accueil
              </StyledButton>
            </div>
          </StyledDiv>
        </PageContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <PageContainer>
        <StyledDiv outerClassName="w-full max-w-xl" className="gap-6 p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-center">
            Résultats - Quiz rapide
          </h1>
          <StyledSeparator />
          <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-1 w-full">
            <p className="text-muted text-sm font-semibold uppercase tracking-wide">
              Score final
            </p>
            <p className="text-5xl font-extrabold text-ok">
              {attempt.score}
              <span className="text-2xl font-bold text-muted">
                {' '}
                / {attempt.total}
              </span>
            </p>
            <p className="text-muted text-sm">
              {attempt.total > 0
                ? `${Math.round((attempt.score / attempt.total) * 100)}% de réussite`
                : '—'}
            </p>
          </div>
          <div className="flex justify-center">
            <StyledButton onClick={() => navigate('/')}>
              Retour au menu
            </StyledButton>
          </div>
        </StyledDiv>
      </PageContainer>
    </MainContainer>
  );
}
