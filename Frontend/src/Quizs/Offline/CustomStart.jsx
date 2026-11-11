import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

import { getCategoryTags } from '../../Api/categories.jsx';
import { getAllThemes } from '../../Api/themes.jsx';
import { getAllCategories, startCustomQuiz } from '../../Api/quiz.jsx';
import { StyledButton } from '../../Components/Buttons.jsx';
import { CategorySelector } from '../../Components/CategorySelector.jsx';
import {
  MainContainer,
  PageContainer,
  StyledDiv,
} from '../../Components/Containers.jsx';
import { StyledSeparator } from '../../Components/Separators.jsx';
import { DifficultySelector } from '../../Components/DifficultySelector.jsx';
import { TimeSelector } from '../../Components/TimeSelector.jsx';
import { getQuestionsCount } from '../../Api/questions.jsx';

const tagChipClass = selected =>
  `px-3 py-2 rounded-2xl border-2 cursor-pointer select-none transition-colors ${
    selected
      ? 'bg-amber-400 text-black border-amber-300 font-bold'
      : 'bg-gray-800 border-gray-200'
  }`;

export function CustomStart() {
  //Data
  const [categories, setCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //Filtres
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [difficulty, setDifficulty] = useState(0);
  const [questionCount, setQuestionCount] = useState(10);
  const [isStarting, setIsStarting] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getAllCategories();
        console.log(data);
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
        console.error('Erreur chargement themes:', err);
      }
    }
    loadThemes();
    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setCategoryTags([]);
      setAvailableQuestions(0);
      return;
    }

    async function loadTags() {
      try {
        const tags = await getCategoryTags(selectedCategory);
        console.log('Tags reçus:', tags);
        setCategoryTags(tags || []);
        setSelectedTag(null);

        const total =
          tags?.reduce((sum, tag) => {
            return sum + (tag.questionCount || 0);
          }, 0) || 0;
        setAvailableQuestions(total);
      } catch (err) {
        console.error('Erreur chargement tags:', err);
        setAvailableQuestions(0);
      }
    }
    loadTags();
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedCategory || categoryTags.length === 0) return;

    if (selectedTag === null) {
      const total = categoryTags.reduce(
        (sum, tag) => sum + (tag.questionCount || 0),
        0
      );
      setAvailableQuestions(total);
    } else {
      const selected = categoryTags.find(t => {
        return t.id === selectedTag || t.slug === selectedTag;
      });
      setAvailableQuestions(selected?.questionCount || 0);
    }
  }, [selectedTag, categoryTags, selectedCategory, selectedDifficulty]);

  async function handleStartCustomQuiz() {
    if (!selectedCategory) {
      alert('Veuillez sélectionner un thème !');
      return;
    }

    const requestBody = {
      categoryId: selectedCategory,
      count: questionCount,
    };

    if (selectedTag !== null) {
      requestBody.tag = selectedTag;
    }

    if (difficulty != 0) {
      requestBody.difficulty = difficulty;
    }

    console.log('Envoi requete:', requestBody);
    setIsStarting(true);
    try {
      const attempt = await startCustomQuiz(requestBody);
      console.log('Quiz start :', attempt);
      navigate(`/play/attempt/${attempt.id}?mode=custom`);
    } catch (err) {
      const errorMessage = err.error || err.message || 'Erreur inconnue';
      if (
        errorMessage.includes('pas assez') ||
        errorMessage.includes('questions') ||
        errorMessage.includes('disponibles')
      ) {
        setError(
          "Il n'y a pas assez de questions pour cette combinaison (thème/tag/difficulté). Essayez avec moins de questions ou une autre difficulte."
        );
      } else {
        setError(errorMessage);
      }
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

  const handleDifficultyChange = async(newDifficulty) => {
    setDifficulty(newDifficulty);
    if(selectedCategory && selectedDifficulty){
      try {
        console.log(selectedCategory);
        const data = await getQuestionsCount({categorySlug : selectedCategory.slug, tagId: null, difficulty : newDifficulty})
        console.log('Count : ',JSON.stringify(data));
        setAvailableQuestions(data.count);
      } catch (error) { }
    }
  }

  return (
    <MainContainer>
      <PageContainer>
        <motion.div
          className="flex flex-col items-center gap-10 w-full min-h-0 max-h-full overflow-y-auto p-1"
          layout
        >
          <CategorySelector
            categories={categories}
            selectedId={selectedCategory}
            onSelect={cat => {
              setSelectedCategory(cat.id);
              setSelectedTag(null);
            }}
            themes={themes}
            selectedThemeId={selectedThemeId}
            onSelectTheme={id => {
              setSelectedThemeId(id);
              setSelectedCategory(null);
              setSelectedTag(null);
            }}
          />

          {selectedCategory && (
            <StyledDiv outerClassName="w-full" className="gap-5 p-6">
              <h2 className="text-2xl font-bold text-center">
                Personnalisez votre quiz
              </h2>
              <StyledSeparator />

              <div className="flex flex-col gap-2 items-center">
                <p className="text-xl font-bold">Tag</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    className={tagChipClass(selectedTag === null)}
                    onClick={() => setSelectedTag(null)}
                  >
                    Tous
                  </button>
                  {categoryTags.map((tag, index) => {
                    const tagId = tag.id || tag.slug || index;
                    const tagName = tag.name || tag.slug || `Tag ${index + 1}`;

                    return (
                      <button
                        type="button"
                        key={tagId}
                        className={tagChipClass(selectedTag === tagId)}
                        onClick={() => setSelectedTag(tagId)}
                      >
                        {tagName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-center text-muted">
                Questions disponibles :{' '}
                <span className="text-text font-bold">{availableQuestions}</span>
                {selectedTag === null
                  ? ' (tous tags)'
                  : ` (tag: ${categoryTags.find(t => t.id === selectedTag || t.slug === selectedTag)?.name || categoryTags.find(t => t.id === selectedTag || t.slug === selectedTag)?.slug || selectedTag})`}
              </p>

              <div className="flex flex-col gap-2 items-center">
                <p className="text-xl font-bold">Difficulté</p>
                <DifficultySelector
                  onChange={handleDifficultyChange}
                  value={difficulty}
                />
              </div>

              <div className="flex flex-col gap-2 items-center">
                <p className="text-xl font-bold">Nombre de questions</p>
                <TimeSelector onChange={setQuestionCount} value={questionCount} />
              </div>

              {questionCount > availableQuestions && (
                <p className="p-3 rounded-2xl bg-amber-500/12 text-amber-400 border border-amber-500/50 text-center">
                  Seules {availableQuestions} questions sont disponibles.
                  Réduisez le nombre de questions.
                </p>
              )}

              <StyledButton
                onClick={handleStartCustomQuiz}
                disabled={
                  isStarting || questionCount > availableQuestions
                }
                className="w-80 p-5! text-2xl! self-center"
              >
                {isStarting ? 'Démarrage...' : 'Démarrer le quiz'}
              </StyledButton>
            </StyledDiv>
          )}
        </motion.div>
      </PageContainer>
    </MainContainer>
  );
}
