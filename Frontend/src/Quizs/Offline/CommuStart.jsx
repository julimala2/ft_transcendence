import { useEffect, useState } from 'react';

import { getAllQuizs } from '../../Api/quiz';
import { StyledButton } from '../../Components/Buttons';
import {
  CardContainer,
  MainContainer,
  PageContainer,
} from '../../Components/Containers';

export default function CommuStart() {
  const [quizs, setQuizs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <MainContainer>
      <PageContainer>
        {JSON.stringify(quizs)}
        <h3 className="text-3xl">Quizs Publics:</h3>
        {quizs.map(quiz => (
          <CardContainer key={quiz.id}>
            <div className="text-xl font-bold pl-2">
              "{quiz.title}" created by {quiz.owner.username} (
              {quiz._count.questions ? quiz._count.questions : '0'} questions)
            </div>
            <div>
              <StyledButton variant="success">Jouer</StyledButton>
            </div>
          </CardContainer>
        ))}
      </PageContainer>
    </MainContainer>
  );
}
