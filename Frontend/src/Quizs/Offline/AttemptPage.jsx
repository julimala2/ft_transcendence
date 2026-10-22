import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAttempt, submitAnswer } from "../../Api/quiz";
import styles from "../../Styling/AttemptPage.module.css";


export function AttemptPage() {
    const { attemptId } = useParams();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [correctAnswerId, setCorrectAnswerId] = useState(null);
    const [currentExplanation, setCurrentExplanation] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isTimeout, setIsTimeout] = useState(false);

    useEffect(() => {
        async function loadAttempt() {
            try {
                setLoading(true);
                const data = await getAttempt(Number(attemptId));
                console.log("Attempt data:", data);
                setAttempt(data);
                setFeedback(null);
                setSelectedAnswer(null);
                setCorrectAnswerId(null);
                setTimeLeft(15);
                setIsTimeout(false);
            } catch (err) {
                setError(err.error || "Impossible de charger la partie");
            } finally {
                setLoading(false);
            }
        }
        loadAttempt();
    }, [attemptId]);

    // Timer de 15 secondes
    useEffect(() => {
        let timer;
        if (attempt?.question && !feedback && !isSubmitting && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsTimeout(true);
                        handleAnswerClick(null);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 3000);
        }
        return () => clearInterval(timer);
    }, [attempt?.question, feedback, isSubmitting, timeLeft]);

    async function handleAnswerClick(answerId = null) {
        if (!attempt || feedback || isSubmitting) return;

        setIsSubmitting(true);
        if (answerId !== null) {
            setSelectedAnswer(answerId);
        }

        try {
            let result;
            if (answerId !== null) {
                result = await submitAnswer(attempt.id, answerId);
            } else {
                result = { 
                    isCorrect: false, 
                    finished: false, 
                    correctAnswerId: attempt.question.answers.find(a => a.isCorrect)?.id,
                    explanation: attempt.question.explanation
                };
            }
            setFeedback(result.isCorrect ? "correct" : "incorrect");
            setCorrectAnswerId(result.correctAnswerId);
            setCurrentExplanation(result.explanation);
        } catch (err) {
            setError(err.error || "Erreur reponse");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleViewResults() {
        if (mode === 'quick') {
            navigate(`/results/quick/${attempt.id}`);
        } else if (mode === 'custom') {
            navigate(`/results/custom/${attempt.id}`);
        } else {
            navigate(`/results/quick/${attempt.id}`);
        }
    }

    async function handleNextQuestion() {
        if (!attempt || isSubmitting) return;

        setIsSubmitting(true);
        setFeedback(null);
        setSelectedAnswer(null);
        setCorrectAnswerId(null);
        setTimeLeft(15);
        setIsTimeout(false);

        try {
            const nextAttempt = await getAttempt(Number(attemptId));
            setAttempt(nextAttempt);
        } catch (err) {
            setError(err.error || "Erreur chargement question");
        } finally {
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

                {/* Timer */}
                <div className={styles.timer}>
                    Temps restant: {timeLeft}s
                </div>

                {/* Image de la question */}
                {attempt.question.image && (
                    <div className={styles.questionImage}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/quiz-images/${attempt.question.image.src}`}
                        alt={attempt.question.image.alt || "Image de la question"}
                    />
                    </div>
                )}

                {/* Reponses */}
                <div className={styles.answersContainer}>
                    {attempt.question.answers.map((answer) => {
                        const isSelected = selectedAnswer === answer.id;
                        const showFeedback = feedback !== null;
                        const isCorrectAnswer = showFeedback && answer.id === correctAnswerId;
                        const isWrongSelection = feedback === "incorrect" && isSelected;

                        return (
                            <button
                                key={answer.id}
                                onClick={() => handleAnswerClick(answer.id)}
                                disabled={isSubmitting || feedback !== null}
                                className={`${styles.answerButton}
                                    ${isSelected ? styles.selected : ""}
                                    ${isCorrectAnswer ? styles.feedbackCorrect : ""}
                                    ${isWrongSelection ? styles.feedbackIncorrect : ""}
                                `}
                            >
                                {answer.text}
                                {isCorrectAnswer && (
                                    <span className={styles.feedbackIcon}>✓</span>
                                )}
                                {isWrongSelection && (
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
                            {isTimeout ? "Temps écoulé !" : feedback === "correct" 
                                ? "Bonne réponse ! ✓" 
                                : "Mauvaise réponse ✗"}
                        </p>
                        {currentExplanation && (
                            <p className={styles.explanation}>
                                {currentExplanation}
                            </p>
                        )}
                    </div>
                )}

                {/* Bouton Question suivante */}
                {feedback && attempt.answered + 1 < attempt.total && (
                    <button
                        onClick={handleNextQuestion}
                        disabled={isSubmitting}
                        className={styles.button}
                    >
                        Question suivante
                    </button>
                )}

                {/* Bouton Voir les résultats (dernière question) */}
                {feedback && attempt.answered + 1 === attempt.total && (
                    <button
                        onClick={handleViewResults}
                        disabled={isSubmitting}
                        className={styles.button}
                    >
                        Voir les résultats
                    </button>
                )}
            </div>
        </div>
    );
}
