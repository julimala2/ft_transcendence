import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import QuestionEdit from './QuestionEdit';
import { deleteQuestion } from '../../Api/questions';
import { deleteQuiz, getQuizById, updateQuiz } from '../../Api/quiz';
import { StyledButton } from '../../Components/Buttons';
import {
  MainContainer,
  PageContainer,
  StyledDiv,
} from '../../Components/Containers';
import {
  StyledInput,
  StyledSelect,
  StyledTextarea,
} from '../../Components/Inputs';
import { StyledSeparator } from '../../Components/Separators';

const VISIBILITY_OPTIONS = [
  { value: 'private', label: 'Privé' },
  { value: 'friends', label: 'Amis' },
  { value: 'public', label: 'Public' },
];

export function QuizEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [questions, setQuestions] = useState([]);

  const fetchQuiz = async () => {
    try {
      const quizData = await getQuizById(id);
      setQuiz(quizData);
      setTitle(quizData.title);
      setDescription(quizData.description || '');
      setVisibility(quizData.visibility || 'private');
      setQuestions(quizData.questions || []);
      console.log(quizData);
    } catch (err) {
      console.error('Erreur lors du chargement du quiz:', err);
      setError('Impossible de charger le quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionAdded = async () => {
    await fetchQuiz();
  };

  const handleQuestionRemoved = async questionId => {
    try {
      await deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la question:', err);
      setError('Erreur lors de la suppression de la question.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre du quiz est requis');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Update the quiz with title, description and visibility
      await updateQuiz(id, title, description, visibility);
      navigate(`/quiz/edit/${id}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du quiz:', error);
      setError('Erreur lors de la mise à jour du quiz. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async e => {
    setIsDeleting(true);
    setError('');
    try {
      await deleteQuiz(id);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la suppresion du quiz :', error);
      setError('Erreur lors de la suppression du quiz. Veuillez reessayer.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <MainContainer>
        <PageContainer>
          <p className="text-muted text-center">Chargement du quiz...</p>
        </PageContainer>
      </MainContainer>
    );
  }

  if (!quiz) {
    return (
      <MainContainer>
        <PageContainer>
          <p className="text-danger text-center text-lg">
            {error || 'Quiz non trouvé'}
          </p>
        </PageContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <PageContainer>
        <div className="flex flex-col gap-4 w-full max-w-3xl min-h-0 max-h-full overflow-y-auto p-1">
          <StyledDiv outerClassName="w-full" className="gap-6 p-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-center">
              Édition du quiz : {title}
            </h1>
            <StyledSeparator />
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              <StyledInput
                id="title"
                label="Titre du quiz"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Entrez le titre de votre quiz"
              />

              <StyledTextarea
                id="description"
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Décrivez votre quiz (optionnel)"
              />

              <StyledSelect
                id="visibility"
                label="Visibilité"
                value={visibility}
                onChange={e => setVisibility(e.target.value)}
                options={VISIBILITY_OPTIONS}
              />

              {error && (
                <p className="p-3 rounded-2xl bg-red-500/12 text-danger border border-danger">
                  {error}
                </p>
              )}

              <div className="flex justify-end">
                <StyledButton
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le quiz'}
                </StyledButton>
              </div>
            </form>
          </StyledDiv>

          <StyledDiv outerClassName="w-full" className="gap-4 p-6">
            <h2 className="text-2xl font-bold">
              Questions ({questions.length})
            </h2>
            <StyledSeparator />
            {questions.length > 0 ? (
              <ul className="flex flex-col gap-3 w-full">
                {questions.map((question, qIndex) => (
                  <li
                    key={question.id}
                    className="flex flex-col gap-2 bg-gray-800 rounded-2xl p-4"
                  >
                    <div className="flex justify-between items-center gap-3">
                      <p className="font-bold">
                        <span className="text-muted mr-2">Q{qIndex + 1}</span>
                        {question.text}
                      </p>
                      <StyledButton
                        type="button"
                        variant="danger"
                        className="px-3! py-1! text-sm!"
                        onClick={() => handleQuestionRemoved(question.id)}
                      >
                        Supprimer
                      </StyledButton>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {question.answers.map((answer, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span
                            className={
                              answer.isCorrect
                                ? 'text-ok font-semibold'
                                : 'text-muted'
                            }
                          >
                            - {answer.text}
                          </span>
                          {answer.isCorrect && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/12 text-ok border border-ok">
                              bonne réponse
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Aucune question pour ce quiz.</p>
            )}
          </StyledDiv>

          <StyledDiv outerClassName="w-full" className="gap-4 p-6">
            <QuestionEdit quizId={id} onQuestionAdded={handleQuestionAdded} />
          </StyledDiv>

          <StyledDiv outerClassName="w-full" className="p-4">
            <div className="flex justify-center">
              <StyledButton
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer le quiz'}
              </StyledButton>
            </div>
          </StyledDiv>
        </div>
      </PageContainer>
    </MainContainer>
  );
}
