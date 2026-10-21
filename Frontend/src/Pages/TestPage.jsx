import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../Api/api';
import { createQuestion, getAllQuestions, getQuestionById, updateQuestion } from '../Api/questions';
import { getQuizById, getQuizQuestions } from '../Api/quiz';

export default function TestPage(){
    
    const [test, setTest] = useState({});
    const [questionForm, setQuestionForm] = useState({
        text: '',
        answers: [
            { id: null, text: '', isCorrect: true },
            { id: null, text: '', isCorrect: false },
            { id: null, text: '', isCorrect: false },
            { id: null, text: '', isCorrect: false }
        ],
        type: 'multiple',
        explanation: '',
        categoryId: null,
        tags: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {         
        if (id) {
            setIsEditing(true);
            getQuestionById(id)
                .then(questionData => {
                    const answers = questionData.answers || [];
                    const filledAnswers = [];
                    
                    // Fill with existing answers
                    for (let i = 0; i < 4; i++) {
                        if (answers[i]) {
                            filledAnswers.push(answers[i]);
                        } else {
                            filledAnswers.push({ id: null, text: '', isCorrect: false });
                        }
                    }
                    
                    if (!filledAnswers.some(a => a.isCorrect)) {
                        filledAnswers[0].isCorrect = true;
                    }
                    
                    // Fix for controlled input issue - ensure no undefined values
                    const fixedAnswers = filledAnswers.map(answer => ({
                        ...answer,
                        text: answer.text || ''
                    }));
        setQuestionForm(prev => ({
            ...prev,
                        text: questionData.text || '',
                        answers: fixedAnswers,
                        type: questionData.type || 'multiple',
                        explanation: questionData.explanation || '',
                        categoryId: questionData.categoryId || null,
                        tags: []
                    }));
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération de la question:", error);
                    setSubmitMessage('Erreur lors de la récupération de la question');
                });
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuestionForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAnswerTextChange = (index, text) => {
        const newAnswers = [...questionForm.answers];
        newAnswers[index].text = text;
        setQuestionForm(prev => ({
            ...prev,
            answers: newAnswers
        }));
    };

    const handleAnswerCorrectChange = (index) => {
        // When selecting a correct answer, set all others to false
        const newAnswers = questionForm.answers.map((answer, i) => ({
            ...answer,
            isCorrect: i === index
        }));
        setQuestionForm(prev => ({
            ...prev,
            answers: newAnswers
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        
        // Validate the form
        if (!questionForm.text.trim()) {
            setSubmitMessage('Le texte de la question est obligatoire');
            setIsSubmitting(false);
            return;
        }
        
        if (questionForm.answers.some(answer => !answer.text.trim())) {
            setSubmitMessage('Toutes les réponses doivent être remplies');
            setIsSubmitting(false);
            return;
        }
        
        // Determine if we're creating or updating
        if (isEditing && id) {
            // Update existing question
            updateQuestion(id, questionForm)
                .then(response => {
                    console.log("Question mise à jour avec succès:", response);
                    setSubmitMessage('Question mise à jour avec succès!');
                    // navigate('/questions'); // Redirect to questions list after update
                })
                .catch(error => {
                    console.error("Erreur lors de la mise à jour de la question:", error);
                    setSubmitMessage('Erreur :' + (error.message || error.error));
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            // Create new question
            createQuestion(questionForm)
                .then(response => {
                    console.log("Question créée avec succès:", response);
                    setSubmitMessage('Question créée avec succès!');
                    // Reset form after successful submission
                    setQuestionForm({
                        text: '',
                        answers: [
                            { id: null, text: '', isCorrect: true },
                            { id: null, text: '', isCorrect: false },
                            { id: null, text: '', isCorrect: false },
                            { id: null, text: '', isCorrect: false }
                        ],
                        type: 'multiple',
                        explanation: '',
                        categoryId: 0,
                        tags: []
                    });
                })
                .catch(error => {
                    console.error("Erreur lors de la création de la question:", error);
                    setSubmitMessage('Erreur lors de la création de la question');
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    return (
        <div className='page'>            
            <h2>{isEditing ? 'Modification de Question' : 'Création de Question'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Texte de la question:</label>
                    <input
                        type="text"
                        name="text"
                        value={questionForm.text}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <h3>Réponses:</h3>
                {questionForm.answers.map((answer, index) => (
                    <div key={index} className='flex flex-row items-center justify-center gap-2'>
                        <input
                            type="text"
                            placeholder={`Texte de la réponse ${index + 1}`}
                            value={answer.text || ''}
                            onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                            required
                            disabled={isEditing && answer.id !== null}
                        />
                        <span className='ml-1'>✅</span>
                        <label className='flex items-center justify-center ml-2'>
                            <input
                                type="radio"
                                name="correct-answer"
                                checked={answer.isCorrect}
                                onChange={() => handleAnswerCorrectChange(index)}
                                disabled={isEditing && answer.id !== null}
                            />
                        </label>
                    </div>
                ))}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Traitement en cours...' : isEditing ? 'Mettre à jour la question' : 'Créer la question'}
                </button>

                {submitMessage && (
                    <p className={submitMessage.includes('succès') ? 'success' : 'error'}>
                        {submitMessage}
                    </p>
                )}
            </form>
        </div>
    )
}