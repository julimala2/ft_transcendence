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

export function CategorySelector({value, onChange}) {
    const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return (

        <motion.div className="justify-center flex flex-col gap-10 flex-wrap" layout>
          <div>
            <motion.div className="flex flex-row flex-wrap justify-center gap-7" >
              {categories.map(cat => (
                <StyledButton key={cat.id} selected={(selectedCategory?.id === cat.id)} onClick={() => onChange(cat)}>
                    {cat.name}
                </StyledButton>
              ))}
            </motion.div>
          </div>
        </motion.div>
  );
}

