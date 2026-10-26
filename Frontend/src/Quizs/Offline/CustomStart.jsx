import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { getCategoryTags } from '../../Api/categories.jsx';
import { getAllCategories, startCustomQuiz } from '../../Api/quiz.jsx';
import { StyledButton, TileButton } from '../../Components/Buttons.jsx';
import { MainContainer, PageContainer } from '../../Components/Containers.jsx';
import styles from '../../Styling/QuizSelectionPage.module.css';

export function CustomStart() {
  //Data
  const [categories, setCategories] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //Filtres
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
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
  }, [selectedTag, categoryTags, selectedCategory]);

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
        <div className="justify-center flex flex-col gap-10 flex-wrap">
          <div className="flex gap-7 flex-wrap justify-center">
            {categories.map(cat => (
              <TileButton 
                key={cat.id} 
                variant='quiz' 
                onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedTag(null);
                  }}
                selected={(selectedCategory === cat.id)}
                  >
                    {cat.name}
              </TileButton>
              // <div
              //   key={cat.id}
              //   className={`${styles.categoryTile} ${selectedCategory === cat.id ? styles.tileSelected : ''}`}
              //   onClick={() => {
              //     setSelectedCategory(cat.id);
              //     setSelectedTag(null);
              //   }}
              // >
              //   {cat.name}
              // </div>
            ))}
          </div>
          {selectedCategory && (
            <div className={styles.tagTiles}>
              <div
                key="all"
                className={`${styles.tagTile} ${selectedTag === null ? styles.tileSelected : ''}`}
                onClick={() => setSelectedTag(null)}
              >
                Tous
              </div>
              {categoryTags.map((tag, index) => {
                const tagId = tag.id || tag.slug || index;
                const tagName = tag.name || tag.slug || `Tag ${index + 1}`;

                return (
                  <div
                    key={tagId}
                    className={`${styles.tagTile} ${selectedTag === tagId ? styles.tileSelected : ''}`}
                    onClick={() => setSelectedTag(tagId)}
                  >
                    {tagName}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.filterGroup}>
          <p className={styles.availableInfo}>
            Questions disponibles : {availableQuestions}
            {selectedTag === null
              ? selectedCategory
                ? ' (tous tags)'
                : ''
              : ` (tag: ${categoryTags.find(t => t.id === selectedTag || t.slug === selectedTag)?.name || categoryTags.find(t => t.id === selectedTag || t.slug === selectedTag)?.slug || selectedTag})`}
          </p>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="difficulty"
                value={0}
                checked={difficulty === 0}
                onChange={() => setDifficulty(0)}
                disabled={!selectedCategory}
              />
              Aléatoire
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="difficulty"
                value={1}
                checked={difficulty === 1}
                onChange={() => setDifficulty(1)}
                disabled={!selectedCategory}
              />
              ⭐ Facile
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="difficulty"
                value={2}
                checked={difficulty === 2}
                onChange={() => setDifficulty(2)}
                disabled={!selectedCategory}
              />
              ⭐⭐ Moyenne
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="difficulty"
                value={3}
                checked={difficulty === 3}
                onChange={() => setDifficulty(3)}
                disabled={!selectedCategory}
              />
              ⭐⭐⭐ Difficile
            </label>
          </div>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="length"
                value={0}
                checked={questionCount === 10}
                onChange={() => setQuestionCount(10)}
                disabled={!selectedCategory}
              />
              Court ⏱️ (10)
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="length"
                value={0}
                checked={questionCount === 25}
                onChange={() => setQuestionCount(25)}
                disabled={!selectedCategory}
              />
              Moyen ⏱️⏱️ (25)
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="length"
                checked={questionCount === 50}
                onChange={() => setQuestionCount(50)}
                disabled={!selectedCategory}
              />
              Long ⏱️⏱️⏱️ (50)
            </label>
          </div>
        </div>
        {questionCount > availableQuestions && selectedCategory && (
          <p className={styles.warning}>
            ⚠️ Seules {availableQuestions} questions sont disponibles. Réduisez
            le nombre de questions.
          </p>
        )}
        <StyledButton
          onClick={handleStartCustomQuiz}
          disabled={
            isStarting ||
            !selectedCategory ||
            questionCount > availableQuestions
          }
          variant="success"
        >
          {isStarting ? 'Demarrage...' : 'Démarrer le quiz'}
        </StyledButton>
      </PageContainer>
    </MainContainer>
  );
}
