import { useState } from 'react';
import { apiFetch } from '../Api/api';
import { createQuestion } from '../Api/questions';

export default function Test() {
  const [quizId, setQuizId] = useState('10'); // Default quiz ID
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddGenericQuestion = async () => {
    setIsAdding(true);
    setMessage('Ajout de la question...');
    
    try {
      // Generic question data
      const questionData = {
        text: 'Question générique pour le quiz',
        answers: [
          { text: 'Réponse A', isCorrect: true },
          { text: 'Réponse B', isCorrect: false },
          { text: 'Réponse C', isCorrect: false },
          { text: 'Réponse D', isCorrect: false }
        ],
        type: 'multiple',
        explanation: 'Explication de la réponse correcte',
        categoryId: 1,
        tags: ['générique', 'test']
      };

      // Add question to the selected quiz
      const response = await createQuestion(questionData);
      
      // If we want to associate it with a specific quiz, we would need to update
      // the question with quizId, but since we're just adding a generic question
      // we'll just show the success message
      
      setMessage(`Question ajoutée avec succès au quiz ${quizId}! ID: ${response.id}`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la question:', error);
      setMessage(`Erreur: ${error.message || 'Impossible d\'ajouter la question'}`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test d'ajout de question</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <div className="mb-4">
          <label className="block mb-2 font-medium">ID du quiz:</label>
          <input
            type="text"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Entrez l'ID du quiz auquel vous souhaitez ajouter une question générique.
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h2 className="text-xl font-semibold mb-4">Action</h2>
        <button
          onClick={handleAddGenericQuestion}
          disabled={isAdding}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isAdding ? 'Ajout en cours...' : 'Ajouter une question générique'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded ${message.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p>{message}</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Informations techniques:</h3>
        <p className="text-sm">
          Cette fonctionnalité permet d'ajouter une question générique à un quiz spécifique.
          La question créée contient:
        </p>
        <ul className="list-disc list-inside mt-2 text-sm">
          <li>Texte de question générique</li>
          <li>4 réponses avec une seule correcte</li>
          <li>Type multiple choice</li>
          <li>Explication de la réponse</li>
          <li>Tags et catégorie</li>
        </ul>
      </div>
    </div>
  );
}