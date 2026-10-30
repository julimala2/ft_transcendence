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
} from '../../Components/Components.jsx';
import { motion } from 'motion/react';

import styles from '../../Styling/QuizSelectionPage.module.css';
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

  useEffect(() => {
    // Remove this useless effect
    // setAvailableQuestions(availableQuestions);
  }, [difficulty])

  async function handleStartQuickQuiz() {
    if (!selectedCategory) {
      alert('Veuillez sélectionner un thème !');
      return;
    }

    const requestBody = {
      categoryId: selectedCategory.id,
    };

    if (difficulty !== 0) {
      requestBody.difficulty = difficulty;
    }

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
      <main className={`page ${styles.page}`}>
        <p className={styles.loading}>Chargement des quizs...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`page ${styles.page}`}>
        <p className={styles.error}>{error}</p>
      </main>
    );
  }

  return (
    <MainContainer>
      <PageContainer>
        {availableQuestions}
        <motion.div className="justify-center flex flex-col gap-10 flex-wrap" layout>
          <div>
            <motion.div className="flex flex-row flex-wrap justify-center gap-7" >
              {categories.map(cat => (
                <TileButton key={cat.id} variant='quiz' selected={(selectedCategory?.id === cat.id)} onClick={() => setSelectedCategory(cat)}>
                    {cat.name}
                </TileButton>
              ))}
            </motion.div>
          </div>

          {selectedCategory && (
            <div className='flex flex-col gap-10 justify-center items-center'>
              <DifficultySelector value={difficulty} onChange={setDifficulty} />
              <StyledButton
                onClick={handleStartQuickQuiz}
                disabled={isStarting}
                variant='danger'
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

