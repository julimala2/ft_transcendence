import { useEffect, useState } from 'react';
import { getAllCategories } from '../../Api/quiz.jsx';
import {
  StyledButton,
} from '../../Components/Components.jsx';

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

  const changedCategory = (cat) => {
    console.log("bonjour");
    setSelectedCategory(cat);
    onChange(cat);
  }

  return (

    <div className="p-5 flex flex-row flex-wrap justify-center justify-around gap-5" >
      {categories.map(cat => (
        <StyledButton key={cat.id} variant={cat === selectedCategory ? 'bling': 'bling'} onClick={() => changedCategory(cat)}>
            {cat.name}
        </StyledButton>
      ))}
    </div>
  );
}

