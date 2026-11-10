import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { createQuiz } from '../../Api/quiz';
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
		<StyledDiv outerClassName="w-full max-w-2xl" className="gap-6 p-6">
		  <h1 className="text-3xl font-extrabold tracking-tight text-center">
			Création de quiz
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
			  <StyledButton type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Création en cours...' : 'Créer le quiz'}
			  </StyledButton>
			</div>
		  </form>
		</StyledDiv>
	  </PageContainer>
	</MainContainer>
  );
}
