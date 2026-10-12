import { useEffect, useState } from 'react';
import { getAllQuizs } from '../Api/quiz';
import { QuizCard } from '../Components/QuizCard';
import styles from '../Styling/QuizSelectionPage.module.css';

export function QuizSelectionPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadQuizzes() {
            try {
                // TODO: Replace with real API call when backend QuizQuestion table is fixed
                const data = await getAllQuizs();
                
                // Mock data for prototype
                // const mockData = [
                //     { id: 1, title: "Culture Générale", description: "10 questions variées sur la culture générale", createdAt: "2024-01-01T10:00:00Z" },
                //     { id: 2, title: "Technologie", description: "Quiz sur les frameworks et languages modernes", createdAt: "2024-02-15T14:30:00Z" },
                //     { id: 3, title: "Mathématiques", description: "Problèmes de logique et calcul mental", createdAt: "2024-03-10T09:00:00Z" },
                //     { id: 4, title: "Géographie", description: "Capitales, pays et monuments célèbres", createdAt: "2024-04-05T16:20:00Z" },
                //     { id: 5, title: "Histoire", description: "Dates et événements marquants", createdAt: "2024-05-12T11:45:00Z" },
                //     { id: 6, title: "Cinéma", description: "Films cultes et réalisateurs", createdAt: "2024-06-20T13:10:00Z" },
                // ];
                
                if (!cancelled) {
                    setQuizzes(mockData);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.error || 'Failed to load quizzes');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadQuizzes();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <main className={`page ${styles.page}`}>
                <h1 className={styles.title}>Select a Quiz</h1>
                <p className={styles.loading}>Loading quizzes...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className={`page ${styles.page}`}>
                <h1 className={styles.title}>Select a Quiz</h1>
                <p className={styles.error}>{error}</p>
            </main>
        );
    }

    return (
        <main className={`page ${styles.page}`}>
            <h1 className={styles.title}>Select a Quiz</h1>
            
            {quizzes.length === 0 ? (
                <p className={styles.empty}>No quizzes available. Create one to get started!</p>
            ) : (
                <div className={styles.grid}>
                    {quizzes.map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>
            )}
        </main>
    );
}
