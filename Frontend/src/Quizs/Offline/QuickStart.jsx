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
import { StyledDiv } from '../../Components/Containers.jsx';
import { CategorySelector } from '../../Components/CategorySelector.jsx';
import { motion } from 'motion/react';

import { DifficultySelector } from '../../Components/DifficultySelector.jsx';
import { getQuestionsCount } from '../../Api/questions.jsx';

export function QuickStart() {
  const [categories, setCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
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
      <MainContainer>
        <PageContainer>
          <p className="text-muted text-center">Chargement des quizs...</p>
        </PageContainer>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer>
        <PageContainer>
          <p className="text-danger text-center text-lg">{error}</p>
        </PageContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <PageContainer>
        <div
          className="flex flex-col items-center gap-10 w-full md:p-10 min-h-0 max-h-full overflow-y-auto p-1"
        >
          <CategorySelector
            categories={categories}
            selectedId={selectedCategory?.id}
            onSelect={cat => setSelectedCategory(cat)}
            themes={themes}
            selectedThemeId={selectedThemeId}
            onSelectTheme={id => {
              setSelectedThemeId(id);
              setSelectedCategory(null);
            }}
          />

          {selectedCategory && (
            <StyledDiv outerClassName="w-full" className="gap-5 p-6">
              {/* <DifficultySelector value={difficulty} onChange={setDifficulty} /> */}
              <StyledButton
                onClick={handleStartQuickQuiz}
                disabled={isStarting}
                className="w-80 p-5! text-2xl! self-center"
              >
                {isStarting ? 'Demarrage...' : 'Démarrer le quiz'}
              </StyledButton>
            </StyledDiv>
          )}
        </div>
      </PageContainer>
    </MainContainer>
  );
}

