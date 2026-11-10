import { useEffect, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, startCustomQuiz } from '../../Api/quiz.jsx';
import { getAllThemes } from '../../Api/themes.jsx';
import {
  MainContainer,
  PageContainer,
  BlockContainer,
  TileButton,
  StyledButton,
  BlingButton,
} from '../../Components/Components.jsx';
import { motion } from 'motion/react';

import { DifficultySelector } from '../../Components/DifficultySelector.jsx';
import { getQuestionsCount } from '../../Api/questions.jsx';

export function QuickStart() {
  const [categories, setCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState(0);

  const navigate = useNavigate();
  const questionCount = 10;

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getAllCategories();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    async function loadThemes() {
      try {
        const data = await getAllThemes();
        console.log(data);
        if (!cancelled) {
          setThemes(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadThemes();
    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStartQuickQuiz() {
    if (!selectedCategory) {
      alert('Veuillez sélectionner un thème !');
      return;
    }

    const requestBody = {
      categoryId: selectedCategory.id,
    };

    setIsStarting(true);
    try {
      const attempt = await startCustomQuiz(requestBody);
      navigate(`/play/attempt/${attempt.id}?mode=quick`);
    } catch (err) {
      const errorMessage = err.error || err.message || 'Erreur inconnue';
      setError(errorMessage);
    } finally {
      setIsStarting(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p className="text-muted text-center">Chargement des quizs...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <p className="text-danger text-center">{error}</p>
      </main>
    );
  }

  return (
    <MainContainer>
      <PageContainer>
        <motion.div className="justify-center flex flex-col gap-10 flex-wrap" layout>
          {themes.length === 0 ? (
            <p className='flex flex-row justify-center'>Aucun theme disponibles.</p>
          ):(
            <div className='flex flex-col'>
              {themes.map(the => (
                <p key={the.key}>{the.text}</p>
              ))}
            </div>
          )}
          <div>
            <motion.div className="md:max-w-500 flex flex-row flex-wrap justify-center gap-7" >
              {categories.map(cat => (
                <BlingButton innerClassName='h-40' className='w-40' key={cat.id} variant='quiz' selected={(selectedCategory?.id === cat.id)} onClick={() => setSelectedCategory(cat)}>
                    {cat.name}
                </BlingButton>
              ))}
            </motion.div>
          </div>
          
          {selectedCategory && (
            <div className='flex flex-col gap-10 justify-center items-center'>
              {/* <DifficultySelector value={difficulty} onChange={setDifficulty} /> */}
              <StyledButton
                onClick={handleStartQuickQuiz}
                disabled={isStarting}
                className='w-80 p-5! text-2xl border-5'
              >
                {isStarting
                  ? 'Demarrage...'
                  : 'Démarrer le quiz'}
              </StyledButton>
            </div>
          )}
        </motion.div>
      </PageContainer>
    </MainContainer>
  );
}

