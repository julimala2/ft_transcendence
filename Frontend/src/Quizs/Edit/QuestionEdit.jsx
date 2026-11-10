import { useState } from 'react';

import { createQuestion } from '../../Api/questions';
import { addQuestionToQuiz } from '../../Api/quiz';
import { StyledButton } from '../../Components/Buttons';
import { StyledInput } from '../../Components/Inputs';

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

  const handleSubmit = async e => {
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
          isCorrect: index === correctOption,
        })),
      };

      const createdQuestion = await createQuestion(questionData);

      await addQuestionToQuiz(quizId, createdQuestion.id);

      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectOption(0);
      setSuccess('Question ajoutée avec succès!');

      if (onQuestionAdded) {
        onQuestionAdded(createdQuestion);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la question:", err);
      setError(
        err.response?.data?.error ||
          "Erreur lors de l'ajout de la question. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-bold">Ajouter une question</h2>

      {error && (
        <p className="p-3 rounded-2xl bg-red-500/12 text-danger border border-danger">
          {error}
        </p>
      )}

      {success && (
        <p className="p-3 rounded-2xl bg-green-500/12 text-ok border border-ok">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <StyledInput
          id="question"
          label="Question"
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          placeholder="Entrez votre question"
        />

        <div className="flex flex-col gap-2 w-full">
          <p className="text-xl font-bold">
            Options{' '}
            <span className="text-sm font-normal text-muted">
              (cochez la bonne réponse)
            </span>
          </p>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-3 w-full">
              <input
                type="text"
                value={option}
                onChange={e => handleOptionChange(index, e.target.value)}
                className="flex-1 min-w-0 bg-gray-800 p-2 rounded-2xl border-2 border-gray-200"
                placeholder={`Option ${index + 1}`}
              />
              <label
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 cursor-pointer select-none transition-colors ${
                  correctOption === index
                    ? 'bg-amber-400 text-black border-amber-300 font-bold'
                    : 'bg-gray-800 border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOption === index}
                  onChange={() => setCorrectOption(index)}
                  className="sr-only"
                />
                Correcte
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <StyledButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter la question'}
          </StyledButton>
        </div>
      </form>
    </div>
  );
}
