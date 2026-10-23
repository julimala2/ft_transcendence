import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, startCustomQuiz } from '../../Api/quiz.jsx';
import styles from '../../Styling/QuizSelectionPage.module.css';
import { MainContainer,PageContainer,BlockContainer } from '../../Components/Components.jsx';
import { getAllThemes } from '../../Api/themes.jsx';

export function QuickStart() {
    const [categories, setCategories] = useState([]);
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [difficulty, setDifficulty] = useState(0);
    const [isStarting, setIsStarting] = useState(false);

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
                if (!cancelled ) {
                    console.log(data);
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
            alert("Veuillez sélectionner un thème !");
            return;
        }

        const requestBody = {
            categoryId: selectedCategory,
            count: questionCount,
        };

        if (difficulty !== 0) {
            requestBody.difficulty = difficulty;
        }

        setIsStarting(true);
        try {
            const attempt = await startCustomQuiz(requestBody);
            navigate(`/play/attempt/${attempt.id}?mode=quick`);
        } catch (err) {
            const errorMessage = err.error || err.message || "Erreur inconnue";
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
            <div className="justify-center flex flex-col gap-10 flex-wrap">
                <div>
                    <div className={styles.categoryTiles}>
                        {categories.map((cat) => (
                            <div
                            key={cat.id}
                            className={`${styles.categoryTile} ${selectedCategory === cat.id ? styles.tileSelected : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.name}
                            </div>
                        ))}
                    </div>
                </div>

                {selectedCategory && (
                    <>
                        <div>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value={0}
                                        checked={difficulty === 0}
                                        onChange={() => setDifficulty(0)}
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
                                        />
                                    ⭐⭐⭐ Difficile
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleStartQuickQuiz}
                            disabled={isStarting}
                            className={styles.button}
                            >
                            {isStarting ? "Demarrage..." : "Démarrer le quiz (10 questions)"}
                        </button>
                    </>
                )}
            </div>
            </PageContainer> 
        </MainContainer>
    );
}
