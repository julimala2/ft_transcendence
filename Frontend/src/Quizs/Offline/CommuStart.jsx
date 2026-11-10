import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { getAllQuizs, startCustomQuiz } from '../../Api/quiz';
import { StyledButton } from '../../Components/Buttons';
import {
  MainContainer,
  PageContainer,
  StyledDiv,
} from '../../Components/Containers';
import { StyledSeparator } from '../../Components/Separators';

export default function CommuStart() {
  const [quizs, setQuizs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadQuizs() {
      try {
        const data = await getAllQuizs();
        if (!cancelled) {
          setQuizs(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadQuizs();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePlay(quizId) {
    setError(null);
    setStartingId(quizId);
    try {
      const attempt = await startCustomQuiz({ quizId });
      navigate(`/play/attempt/${attempt.id}?mode=custom`);
    } catch (err) {
      setError(err.error || err.message || 'Impossible de lancer ce quiz');
      setStartingId(null);
    }
  }

  return (
    <MainContainer>
      <PageContainer>
        <div className="flex flex-col w-full max-w-3xl min-h-0 max-h-full p-1">
          <StyledDiv
            outerClassName="w-full flex-1 min-h-0"
            className="gap-4 p-6 min-h-0"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-center">
              Quizs publics
            </h1>
            <StyledSeparator />

            {error && (
              <p className="p-3 rounded-2xl bg-red-500/12 text-danger border border-danger">
                {error}
              </p>
            )}

            {loading ? (
              <p className="text-muted text-center">Chargement des quizs...</p>
            ) : quizs.length === 0 ? (
              <p className="text-muted text-center">
                Aucun quiz public pour le moment.
              </p>
            ) : (
              <ul className="flex flex-col gap-3 w-full flex-1 min-h-0 overflow-y-auto">
                {quizs.map(quiz => (
                  <li
                    key={quiz.id}
                    className="flex items-center justify-between gap-3 bg-gray-800 rounded-2xl p-4"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="font-bold truncate">{quiz.title}</p>
                      <p className="text-sm text-muted">
                        par {quiz.owner?.username || 'inconnu'} ·{' '}
                        {quiz._count?.questions ?? 0} question(s)
                      </p>
                    </div>
                    <StyledButton
                      onClick={() => handlePlay(quiz.id)}
                      disabled={startingId !== null}
                    >
                      Jouer
                    </StyledButton>
                  </li>
                ))}
              </ul>
            )}
          </StyledDiv>
        </div>
      </PageContainer>
    </MainContainer>
  );
}
