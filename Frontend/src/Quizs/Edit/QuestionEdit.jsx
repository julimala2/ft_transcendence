import { useState } from 'react';
import { createQuestion } from '../../Api/questions';
import { addQuestionToQuiz } from '../../Api/quiz';

export default function QuestionEdit({ quizId, onQuestionAdded }) {
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctOption, setCorrectOption] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!questionText.trim()) {
            setError('La question est requise');
            return;
        }

        const validOptions = options.filter(o => o.trim());
        if (validOptions.length < 2) {
            setError('Au moins 2 options sont requises');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            // Create the question first
            const questionData = {
                text: questionText,
                type: 'multiple',
                answers: validOptions.map((option, index) => ({
                    text: option,
                    isCorrect: index === correctOption
                }))
            };

            const createdQuestion = await createQuestion(questionData);
            
            // Then add it to the quiz
            await addQuestionToQuiz(quizId, createdQuestion.id);
            
            // Reset form
            setQuestionText('');
            setOptions(['', '', '', '']);
            setCorrectOption(0);
            setSuccess('Question ajoutée avec succès!');
            
            // Notify parent to refresh questions list
            if (onQuestionAdded) {
                onQuestionAdded(createdQuestion);
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Erreur lors de l\'ajout de la question:', err);
            setError(err.response?.data?.error || 'Erreur lors de l\'ajout de la question. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Ajouter une nouvelle question</h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Question
                    </label>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Entrez votre question"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Options
                    </label>
                    {options.map((option, index) => (
                        <div key={index} className="mb-2 flex items-center">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mr-2"
                                placeholder={`Option ${index + 1}`}
                            />
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={correctOption === index}
                                    onChange={() => setCorrectOption(index)}
                                    className="mr-2"
                                />
                                <span>Correcte</span>
                            </label>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                >
                    {isSubmitting ? 'Ajout en cours...' : 'Ajouter la question'}
                </button>
            </form>
        </div>
    );
}