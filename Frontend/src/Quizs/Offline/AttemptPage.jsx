import { useState, useEffect } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { getAttempt, submitAnswer } from '../../Api/quiz';
import { StyledButton } from '../../Components/Buttons';
import {
  MainContainer,
  PageContainer,
  StyledDiv,
} from '../../Components/Containers';
import { StyledSeparator } from '../../Components/Separators';

export function AttemptPage() {
  const { attemptId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctAnswerId, setCorrectAnswerId] = useState(null);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimeout, setIsTimeout] = useState(false);
  const [answers,setAnswers] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i --) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j],newArray[i]];
    }
    return (newArray);
  }

  useEffect(() => {
    async function loadAttempt() {
      try {
        setLoading(true);
        const data = await getAttempt(Number(attemptId));
        // console.log('Attempt data:', data);

        //Shuffling
        if (data.question && data.question.answers) {
          data.question.answers = shuffleArray(data.question.answers);
        }
        setAttempt(data);
        setFeedback(null);
        setSelectedAnswer(null);
        setCorrectAnswerId(null);
        setTimeLeft(15);
        setIsTimeout(false);
      } catch (err) {
        setError(err.error || 'Impossible de charger la partie');
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [attemptId]);

  // Timer de 15 secondes
  useEffect(() => {
    let timer;
    if (attempt?.question && !feedback && !isSubmitting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimeout(true);
            handleAnswerClick(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [attempt?.question, feedback, isSubmitting, timeLeft]);

  async function handleAnswerClick(answerId = null) {
    if (!attempt || feedback || isSubmitting) return;

    setIsSubmitting(true);
    if (answerId !== null) {
      setSelectedAnswer(answerId);
    }

    try {
      let result;
      if (answerId !== null) {
        result = await submitAnswer(attempt.id, answerId);
      } else {
        result = await submitAnswer(attempt.id, 0);
      }
      setFeedback(result.isCorrect ? 'correct' : 'incorrect');
      setCorrectAnswerId(result.correctAnswerId);
      setCurrentExplanation(result.explanation);
    } catch (err) {
      setError(err.error || 'Erreur reponse');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleViewResults() {
    if (mode === 'quick') {
      navigate(`/results/quick/${attempt.id}`);
    } else if (mode === 'custom') {
      navigate(`/results/custom/${attempt.id}`);
    } else {
      navigate(`/results/quick/${attempt.id}`);
    }
  }

  async function handleNextQuestion() {
    if (!attempt || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);
    setSelectedAnswer(null);
    setCorrectAnswerId(null);
    setTimeLeft(15);
    setIsTimeout(false);

    try {
      const nextAttempt = await getAttempt(Number(attemptId));
      if (nextAttempt.question && nextAttempt.question.answers) {
        nextAttempt.question.answers = shuffleArray(nextAttempt.question.answers);
      }
      setAttempt(nextAttempt);
    } catch (err) {
      setError(err.error || 'Erreur chargement question');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <MainContainer>
        <PageContainer>
          <StyledDiv className="p-6">
            <p className="text-muted text-center">Chargement de la partie...</p>
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

  if (!attempt || !attempt.question) {
    return (
      <MainContainer>
        <PageContainer>
          <StyledDiv outerClassName="w-full max-w-xl" className="gap-5 p-6">
            <p className="text-danger text-center text-lg">
              Partie ou question introuvable
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

  if (attempt.finished) {
    return (
      <MainContainer>
        <PageContainer>
          <StyledDiv outerClassName="w-full max-w-xl" className="gap-6 p-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-center">
              Quiz terminé !
            </h1>
            <StyledSeparator />
            <p className="text-ok text-2xl font-extrabold text-center">
              Score: {attempt.score} / {attempt.total}
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
        <StyledDiv outerClassName="w-full max-w-2xl" className="gap-5 p-6">
          <div className="flex flex-row items-center justify-between w-full gap-3">
            <div className="text-3xl font-bold text-amber-300">
              Score: {attempt.score}
            </div>
            <div className="text-muted">Temps restant: {timeLeft}s</div>
          </div>

          <StyledSeparator />

          <h2 className="text-xl font-bold text-center leading-tight">
            {attempt.question.text}
          </h2>

          {attempt.question.image && (
            <div className="flex justify-center w-full">
              <img
                src={`${import.meta.env.VITE_API_URL}/quiz-images/${attempt.question.image.src}`}
                alt={attempt.question.image.alt || 'Image de la question'}
                className="max-w-full max-h-[300px] rounded-2xl object-contain"
              />
            </div>
          )}

          <div className="flex flex-col gap-3 w-full">
            {attempt.question.answers.map(answer => {
              const isSelected = selectedAnswer === answer.id;
              const showFeedback = feedback !== null;
              const isCorrectAnswer =
                showFeedback && answer.id === correctAnswerId;
              const isWrongSelection = feedback === 'incorrect' && isSelected;

              return (
                <StyledButton
                  key={answer.id}
                  variant="secondary"
                  onClick={() => handleAnswerClick(answer.id)}
                  disabled={isSubmitting || feedback !== null}
                  className={`w-full p-3.5 text-left border-2! transition-all duration-200 ${
                    isCorrectAnswer
                      ? 'bg-green-500/12! text-ok! border-ok!'
                      : isWrongSelection
                        ? 'bg-red-500/12! text-danger! border-danger!'
                        : isSelected
                          ? 'bg-amber-400! text-black! border-amber-300! font-bold'
                          : 'bg-gray-800! border-gray-200! hover:bg-gray-700!'
                  }`}
                >
                  {answer.text}
                  {isCorrectAnswer && (
                    <span className="font-bold ml-2">✓</span>
                  )}
                  {isWrongSelection && (
                    <span className="font-bold ml-2">✗</span>
                  )}
                </StyledButton>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-2xl text-center border ${
                feedback === 'correct'
                  ? 'bg-green-500/12 text-ok border-ok'
                  : 'bg-red-500/12 text-danger border-danger'
              }`}
            >
              <p className="font-bold">
                {isTimeout
                  ? 'Temps écoulé !'
                  : feedback === 'correct'
                    ? 'Bonne réponse ! ✓'
                    : 'Mauvaise réponse ✗'}
              </p>
              {currentExplanation && (
                <p className="text-sm italic opacity-80">{currentExplanation}</p>
              )}
            </div>
          )}

          {feedback && attempt.answered + 1 < attempt.total && (
            <div className="flex justify-center">
              <StyledButton
                onClick={handleNextQuestion}
                disabled={isSubmitting}
              >
                Question suivante
              </StyledButton>
            </div>
          )}

          {feedback && attempt.answered + 1 === attempt.total && (
            <div className="flex justify-center">
              <StyledButton
                onClick={handleViewResults}
                disabled={isSubmitting}
              >
                Voir les résultats
              </StyledButton>
            </div>
          )}
        </StyledDiv>
      </PageContainer>
    </MainContainer>
  );
}
