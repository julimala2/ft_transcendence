import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteQuiz, getQuizById, updateQuiz } from '../../Api/quiz';
import { deleteQuestion } from '../../Api/questions';
import QuestionEdit from './QuestionEdit';
import { StyledButton, MainContainer, PageContainer, BlockContainer} from '../../Components/Components';

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

    const handleQuestionRemoved = async (questionId) => {
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

    const handleSubmit = async (e) => {
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

    const handleDelete = async (e) => {
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
    }

    if (loading) {
        return <div className="page">Chargement...</div>;
    }

    if (error) {
        return <div className="page">{error}</div>;
    }

    if (!quiz) {
        return <div className="page">Quiz non trouvé</div>;
    }

    return (
        <MainContainer>
            <PageContainer>
                <BlockContainer>
                    <h1 className="text-3xl font-bold">Édition du Quiz: {title}</h1>
                </BlockContainer>
                <BlockContainer>
                <form onSubmit={handleSubmit} className="w-full mx-auto bg-gray-850 rounded-md">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-lg font-medium mb-2">
                            Titre du quiz
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Entrez le titre de votre quiz"
                            />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-lg font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Décrivez votre quiz (optionnel)"
                            />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="visibility" className="block text-lg font-medium mb-2">
                            Visibilité
                        </label>
                        <select
                            id="visibility"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                            <option value="private">Privé</option>
                            <option value="friends">Amis</option>
                            <option value="public">Public</option>
                        </select>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}


                    <div className="flex justify-end">
                        <StyledButton variant='primary' type='submit' disabled={isSubmitting}>
                            Mettre a jour le quiz
                        </StyledButton>
                    </div>
                </form>
                </BlockContainer>
                <BlockContainer>
                    {questions.length > 0 ? (
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">Questions</h2>
                            <div className="space-y-4">
                                {questions.map((question) => (
                                    <div key={question.id} className="bg-gray-900 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-medium">{question.text}</p>
                                            <StyledButton
                                                type="button"
                                                variant="danger"
                                                onClick={() => handleQuestionRemoved(question.id)}
                                                >
                                                Supprimer
                                            </StyledButton>
                                        </div>
                                        <div className="mt-2">
                                            {question.answers.map((answer, index) => (
                                                <div key={index} className="flex items-center">
                                                    <span className={`mr-2 mb-1 ${answer.isCorrect ? 'text-green-600 font-semibold' : 'text-gray-100'}`}>
                                                        - {answer.text}
                                                    </span>
                                                    {answer.isCorrect && <span className="text-green-600">(bonne réponse)</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-300">Aucune question pour ce quiz.</p>
                    )}
                </BlockContainer>
                <BlockContainer>

                    <QuestionEdit quizId={id} onQuestionAdded={handleQuestionAdded} />
                </BlockContainer>
                <BlockContainer>
                <div className='flex justify-center'>
                    <StyledButton 
                        variant='danger'
                        onClick={handleDelete}
                        disabled={isDeleting}
                        >
                        Supprimer le quiz
                    </StyledButton>
                </div>
                </BlockContainer>
            </PageContainer>
        </MainContainer>
    );
}