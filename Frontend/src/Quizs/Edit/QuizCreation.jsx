import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { createQuiz } from '../../Api/quiz';
import { StyledButton } from '../../Components/Buttons';
import { MainContainer, PageContainer } from '../../Components/Containers';

export function QuizCreation() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
	e.preventDefault();

	if (!title.trim()) {
	  setError('Le titre du quiz est requis');
	  return;
	}

	setIsSubmitting(true);
	setError('');

	try {
	  // Create the quiz with title, description and visibility
	  const createdQuiz = await createQuiz(title, description, visibility);

	  // Redirect to the quiz edit page to add questions
	  navigate(`/quiz/edit/${createdQuiz.id}`);
	} catch (error) {
	  console.error('Erreur lors de la création du quiz:', error);
	  setError('Erreur lors de la création du quiz. Veuillez réessayer.');
	} finally {
	  setIsSubmitting(false);
	}
  };

  return (
	<MainContainer>
	  <PageContainer>
		<h1 className="text-3xl font-bold mb-6">Création de Quiz</h1>

		<form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
		  <div className="mb-6">
			<label htmlFor="title" className="block text-lg font-medium mb-2">
			  Titre du quiz
			</label>
			<input
			  type="text"
			  id="title"
			  value={title}
			  onChange={e => setTitle(e.target.value)}
			  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			  placeholder="Entrez le titre de votre quiz"
			/>
		  </div>

		  <div className="mb-6">
			<label
			  htmlFor="description"
			  className="block text-lg font-medium mb-2"
			>
			  Description
			</label>
			<textarea
			  id="description"
			  value={description}
			  onChange={e => setDescription(e.target.value)}
			  rows={4}
			  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			  placeholder="Décrivez votre quiz (optionnel)"
			/>
		  </div>

		  <div className="mb-6">
			<label
			  htmlFor="visibility"
			  className="block text-lg font-medium mb-2"
			>
			  Visibilité
			</label>
			<select
			  id="visibility"
			  value={visibility}
			  onChange={e => setVisibility(e.target.value)}
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
			<StyledButton type="submit" disabled={isSubmitting}>
			  {isSubmitting ? 'Création en cours...' : 'Créer le quiz'}
			</StyledButton>
		  </div>
		</form>
	  </PageContainer>
	</MainContainer>
  );
}
