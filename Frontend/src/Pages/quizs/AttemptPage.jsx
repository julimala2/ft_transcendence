import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttempt, submitAnswer } from "../../Api/quiz";
import styles from "./AttemptPage.module.css";


export function AttemptPage() {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadAttempt() {
            try {
                setLoading(true);
                const data = await getAttempt(Number(attemptId));
                console.log("Attempt data:", data);
                setAttempt(data);
                setFeedback(null);
                setSelectedAnswer(null);
            } catch (err) {
                setError(err.error || "Impossible de charger la partie");
            } finally {
                setLoading(false);
            }
        }
        loadAttempt();
    }, [attemptId]);

    async function handleAnswerClick(answerId) {
        if (!attempt || feedback || isSubmitting) return;

        setIsSubmitting(true);
        setSelectedAnswer(answerId);

        try {
            const result = await submitAnswer(attempt.id, answerId);
            setFeedback(result.isCorrect ? "correct" : "incorrect");

            if (result.finished) {
                setTimeout(() => {
                    navigate(`/results/${attempt.id}`);
                }, 1500);
            } else {
                setTimeout(async () => {
                    try {
                        const nextAttempt = await getAttempt(Number(attemptId));
                        setAttempt(nextAttempt);
                        setFeedback(null);
                        setSelectedAnswer(null);
                        setIsSubmitting(false);
                    } catch (err) {
                        setError(err.error || "Erreur chargement question");
                        setIsSubmitting(false);
                    }
                }, 1500);
            }
        } catch (err) {
            setError(err.error || "Erreur reponse");
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <main className={`page ${styles.main}`}>
                <p className={styles.loading}>Chargement de la partie...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className={`page ${styles.main}`}>
                <p className={styles.error}>{error}</p>
                <button onClick={() => navigate("/")} className={styles.button}>
                    Retour à l'accueil
                </button>
            </main>
        );
    }

    if (!attempt || !attempt.question) {
        return (
            <main className={`page ${styles.main}`}>
                <p className={styles.error}>Partie ou question introuvable</p>
                <button onClick={() => navigate("/")} className={styles.button}>
                    Retour à l'accueil
                </button>
            </main>
        );
    }

    if (attempt.finished) {
        return (
            <main className={`page ${styles.main}`}>
                <h1 className={styles.title}>Quiz terminé !</h1>
                <p className={styles.score}>
                    Score: {attempt.score} / {attempt.total}
                </p>
                <button onClick={() => navigate("/")} className={styles.button}>
                    Retour à l'accueil
                </button>
            </main>
        );
    }

    return (
        <div className={`page ${styles.main}`}>
            {/* Progression */}
            <div className={styles.header}>
                <div className={styles.progress}>
                    Question {attempt.answered + 1} / {attempt.total}
                </div>
                <div className={styles.score}>
                    Score: {attempt.score}
                </div>
            </div>

            {/* Question */}
            <div className={styles.questionContainer}>
                <h2 className={styles.question}>
                    {attempt.question.text}
                </h2>

                {/* Image de la question */}
                {attempt.question.image && (
                    <div className={styles.questionImage}>
                        <img 
                            src={`/quiz-images/${attempt.question.image.src}`} 
                            alt={attempt.question.image.alt || "Image de la question"}
                        />
                    </div>
                )}

                {/* Reponses */}
                <div className={styles.answersContainer}>
                    {attempt.question.answers.map((answer) => {
                        const isSelected = selectedAnswer === answer.id;
                        const showFeedback = feedback !== null;
                        const isCorrect = feedback === "correct" && answer.isCorrect;
                        const isWrong = feedback === "incorrect" && isSelected;

                        return (
                            <button
                                key={answer.id}
                                onClick={() => handleAnswerClick(answer.id)}
                                disabled={isSubmitting || feedback !== null}
                                className={`${styles.answerButton}
                                    ${isSelected ? styles.selected : ""}
                                    ${showFeedback && isCorrect ? styles.correct : ""}
                                    ${showFeedback && isWrong ? styles.incorrect : ""}
                                `}
                            >
                                {answer.text}
                                {showFeedback && isCorrect && (
                                    <span className={styles.feedbackIcon}>✓</span>
                                )}
                                {showFeedback && isWrong && (
                                    <span className={styles.feedbackIcon}>✗</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className={`${styles.feedback}
                        ${feedback === "correct" ? styles.feedbackCorrect : styles.feedbackIncorrect}
                    `}>
                        <p>
                            {feedback === "correct" 
                                ? "Bonne réponse ! ✓" 
                                : "Mauvaise réponse ✗"}
                        </p>
                        {attempt.question.explanation && (
                            <p className={styles.explanation}>
                                {attempt.question.explanation}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
