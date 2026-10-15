import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCategories, startCustomQuiz } from '../../Api/quiz.jsx';
import { QuizCard } from '../../Components/QuizCard';
import styles from '../../Styling/QuizSelectionPage.module.css';

export function QuizSelectionPage() {
    //Data
    const [categories,setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //Filtres
    const [selectedCategory,setSelectedCategory] = useState(null);
    const [difficulty,setDifficulty] = useState(2);
    const [questionCount, setQuestionCount] = useState(10);
    const [isStarting, setIsStarting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                const data = await getAllCategories();
                console.log(data);
                if(!cancelled) {
                    setCategories(data);
                    // Initialise avec la première catégorie si disponible
                    if (data.length > 0) {
                        setSelectedCategory(data[0].id);
                    }
                }   
            }
            catch(err) {
                if(!cancelled){
                    setError(err.error);
                }
            } finally {
                if(!cancelled){
                    setLoading(false);
                }
            }
        }
        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleStartCustomQuiz(){
        // Vérification : une catégorie doit être sélectionnée
        if (!selectedCategory) {
            alert("Veuillez sélectionner un thème !");
            return;
        }

        const requestBody = {
            categoryId: selectedCategory,
            difficulty: difficulty,
            count: questionCount,
        };

        console.log("Envoi requete:",requestBody);
        setIsStarting(true);
        try {
            const attempt = await startCustomQuiz(requestBody);
            console.log("Quiz start :",attempt);
            navigate(`/play/attempt/${attempt.id}`);
        } catch (err) {
            setError(err.error);
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
        <main className={`page ${styles.page}`}>
            <h1 className={styles.title}>Commencer un quizz personalise :</h1>
            
            {/* Selecteur de theme */}
            <div className={styles.filters}>
            <div className={styles.filterGroup}>
                <label>theme :</label>
                <select
                    value={selectedCategory || ""}
                    onChange={(e)=> setSelectedCategory(Number(e.target.value))}
                    className={styles.select}>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name} ({cat.id})
                            </option>
                        ))}
                    </select>
            </div>

            {/* Selecteur difficulte */}
            <div className={styles.filterGroup}>
                <label>Difficulte :</label>
                <select
                    value={difficulty}
                    onChange={(e)=> setDifficulty(Number(e.target.value))}
                    className={styles.select}>
                        <option value={1}>Facile</option>
                        <option value={2}>Moyen</option>
                        <option value={3}>Difficile</option>
                    </select>
            </div>

            <div className={styles.filterGroup}>
                <label>Nombre de questions:</label>
                <select
                    value={questionCount}
                    onChange={(e)=> setQuestionCount(Number(e.target.value))}
                    className={styles.select}>
                        <option value={10}>Court (10)</option>
                        <option value={20}>Moyen (20)</option>
                        <option value={30}>Long (30)</option>
                </select>
            </div>

            {/* Bouton start */}
            <button
                onClick={handleStartCustomQuiz}
                disabled={isStarting || !selectedCategory}
                className={styles.button}>
                    {isStarting ? "Demarrage..." : "Demarrer le quiz"}
                </button>
            </div>

            {/* {categories.length === 0 ? (
                <p className={styles.empty}>Aucun theme disponible</p>
            ) : (
                <div className={styles.grid}>
                    {categories.map((cat) => (
                                <Link to={`/play/${cat.id}`} className={styles.card}>
                        <div className={styles.header}>
                            <h3 className={styles.title}>{cat.name}</h3>
                        </div>
                        {cat.description && (
                            <p className={styles.description}>{cat.description}</p>
                        )}
                    </Link>
                    ))}
                </div>
            )} */}
        </main>
    );
}
