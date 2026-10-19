import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../Api/api';

export function EditQuiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [editedQuestions, setEditedQuestions] = useState({});
    const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionAnswers, setNewQuestionAnswers] = useState([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
    ]);

    useEffect(() => {
        if (!id) {
            setError('No quiz ID provided');
            setLoading(false);
            return;
        }

        async function loadQuiz() {
            try {
                const data = await apiFetch(`/api/quizzes/${id}`);
                setQuiz(data);
                setTitle(data.title || '');
            } catch (err) {
                setError(err.error || 'Failed to load quiz');
            } finally {
                setLoading(false);
            }
        }

        loadQuiz();
    }, [id]);

    if (loading) {
        return <div className='page'>Chargement du quiz...</div>;
    }

    if (error) {
        return <div className='page'>Erreur: {error}</div>;
    }

    if (!quiz) {
        return <div className='page'>Aucun quiz trouvé</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiFetch(`/api/quizzes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });

            // Update the quiz object with new title
            setQuiz({ ...quiz, title });

            // Update all edited questions
            if (Object.keys(editedQuestions).length > 0) {
                for (const [questionId, newText] of Object.entries(editedQuestions)) {
            await apiFetch(`/api/quizzes/${id}/questions/${questionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newText }),
            });
        }
            }
            setEditedQuestions({});
        } catch (err) {
            setError(err.error || 'Failed to update quiz');
        }
    };

    const handleAddQuestion = async () => {
        try {

        const updatedQuiz = {
            ...quiz,
                questions: [...(quiz.questions || []), { ...newQuestion, id: Date.now().toString() }]
        };
        setQuiz(updatedQuiz);

            await apiFetch(`/api/quizzes/${id}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuestion),
            });

        } catch (err) {
            setError(err.error || 'Failed to add question');
        }
    };

    const handleEditQuestion = (questionId, newText) => {
        setEditedQuestions(prev => ({
            ...prev,
            [questionId]: newText
        }));
    };

    const handleAddNewQuestion = async () => {
        // Validate that the question has text
        if (!newQuestionText.trim()) {
            setError('La question doit avoir un texte');
            return;
        }

        try {
            // Calculate the questionId based on current number of questions + 1
            const questionId = (quiz.questions?.length || 0) + 1;
            // Create new question object with proper questionId as expected by backend
            const newQuestion = {
                questionId: questionId,
                text: newQuestionText,
                answers: newQuestionAnswers.filter(answer => answer.text.trim() !== '')
            };

            // Add the new question to the quiz locally first
        const updatedQuiz = {
            ...quiz,
                questions: [...(quiz.questions || []), { ...newQuestion, id: Date.now().toString() }]
        };
        setQuiz(updatedQuiz);

            // Send to backend API - include questionId as expected by backend
            const response = await apiFetch(`/api/quizzes/${id}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuestion),
            });

            // Update quiz with the response from backend (which should include the new question ID)
            setQuiz({
                ...quiz,
                questions: [...(quiz.questions || []), { ...response, id: response.id }]
            });

            // Reset form
            setNewQuestionText('');
            setNewQuestionAnswers([
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ]);
            setShowAddQuestionForm(false);
        } catch (err) {
            setError(err.error || 'Failed to add question');
        }
    };

    const handleAddAnswer = () => {
        setNewQuestionAnswers([...newQuestionAnswers, { text: '', isCorrect: false }]);
    };

    const handleRemoveAnswer = (index) => {
        if (newQuestionAnswers.length > 1) {
            const updatedAnswers = newQuestionAnswers.filter((_, i) => i !== index);
            setNewQuestionAnswers(updatedAnswers);
        }
    };

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...newQuestionAnswers];
        updatedAnswers[index][field] = value;
        setNewQuestionAnswers(updatedAnswers);
    };

    return (
        <div className='page'>
            <h1>Modifier le Quiz</h1>
            <p>ID: {quiz.id}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Titre:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 m-2"
                    />
                </label>
                <br />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Mettre à jour
                </button>
            </form>
            <p>Description: {quiz.description}</p>
            <p>Nombre de questions: {quiz.questions?.length || 0}</p>

            <button onClick={handleAddQuestion} className="bg-green-500 text-white p-2 rounded m-2">
                Ajouter une question de test
            </button>

            <button
                onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}
                className="bg-purple-500 text-white p-2 rounded m-2"
            >
                {showAddQuestionForm ? 'Annuler' : 'Ajouter une nouvelle question'}
            </button>

            {showAddQuestionForm && (
                <div className="border p-4 m-2 bg-gray-100">
                    <h3>Ajouter une nouvelle question</h3>
                    <div className="mb-4">
                        <label>Texte de la question:</label>
                                <input
                                    type="text"
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                                    className="border p-2 m-2 w-full"
                            placeholder="Entrez le texte de la question"
                                />
                    </div>

                    <h4>Réponses:</h4>
                    {newQuestionAnswers.map((answer, index) => (
                        <div key={index} className="mb-2 flex items-center">
                            <input
                                type="text"
                                value={answer.text}
                                onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                                className="border p-2 m-2 flex-grow"
                                placeholder={`Réponse ${index + 1}`}
                            />
                            <label className="mr-2">
                                <input
                                    type="checkbox"
                                    checked={answer.isCorrect}
                                    onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                                />
                                Correcte
                            </label>
                            <button
                                type="button"
                                onClick={() => handleRemoveAnswer(index)}
                                className="bg-red-500 text-white p-2 rounded m-2"
                                disabled={newQuestionAnswers.length <= 1}
                            >
                                Supprimer
                            </button>
            </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddAnswer}
                        className="bg-blue-500 text-white p-2 rounded m-2"
                    >
                        Ajouter une réponse
                    </button>

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={handleAddNewQuestion}
                            className="bg-green-500 text-white p-2 rounded m-2"
                        >
                            Enregistrer la question
                        </button>
        </div>
                </div>
            )}

            <div>
                {quiz.questions && quiz.questions.length > 0 ? (
                    <div>
                        <h2>Questions :</h2>
                        {quiz.questions.map((question, index) => (
                            <div key={question.id} className="border p-4 m-2">
                                <p><strong>Question {index + 1}:</strong></p>
                                <input
                                    type="text"
                                    value={editedQuestions[question.id] || question.text}
                                    onChange={(e) => handleEditQuestion(question.id, e.target.value)}
                                    className="border p-2 m-2 w-full"
                                />
                                <p><strong>Réponses:</strong></p>
                                <ul>
                                    {question.answers?.map((answer, ansIndex) => (
                                        <li key={ansIndex}>
                                            {answer.text} {answer.isCorrect ? '(correcte)' : ''}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Aucune question dans ce quiz</p>
                )}
            </div>
        </div>
    );
}

