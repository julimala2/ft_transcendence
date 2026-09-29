import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styling/style.module.css';
import layoutStyles from '../Styling/Layout.module.css';

class Question {
    constructor(question, answers, correctIndex) {
        this.question = question;
        this.answers = answers;
        this.correctIndex = correctIndex;
    }
}

const DURATION = 5;

function DisplayQuestion({ question, onAnswered }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [timeLeft, setTimeLeft] = useState(DURATION);

    useEffect(() => {
        if (selectedIndex !== null) return;

        const intervalId = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [selectedIndex]);

    useEffect(() => {
        if (timeLeft <= 0 && selectedIndex === null) {
            setSelectedIndex(-1);
            onAnswered(false);
        }
    }, [timeLeft, selectedIndex, onAnswered]);

    const handleClick = (index) => {
        if (selectedIndex !== null) return;

        setSelectedIndex(index);
        onAnswered(index === question.correctIndex);
    };

    const getButtonClass = (index) => {
        if (selectedIndex === null) return styles.button;
        if (index === question.correctIndex) return `${styles.button} ${styles.correct}`;
        if (index === selectedIndex) return `${styles.button} ${styles.wrong}`;
        return `${styles.button} ${styles.disabled}`;
    };

    return (
        <>
            <div>{question.question}</div>
            <ul className={styles.list}>
                {question.answers.map((answer, index) => (
                    <li key={index}>
                        <button
                            onClick={() => handleClick(index)}
                            disabled={selectedIndex !== null}
                            className={getButtonClass(index)}
                        >
                            {answer}
                        </button>
                    </li>
                ))}
            </ul>
            <div>{timeLeft}</div>
        </>
    );
}

const QUESTIONS = [
    new Question('2+2=?', ['3', '2', '4', '12'], 2),
    new Question('Capitale du Listenbourg ?', ['Carmenia', 'Missbalder', 'Costilla', 'Lurenberg'], 3),
    new Question('Le javascript est ?', ['Une erreur', 'Un language fort sympathique', 'Une danse peruvienne', 'Je sais pas'], 1),
];

export function QuizPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);

    const handleAnswered = (isCorrect) => {
        setAnswered(true);
        if (isCorrect) setScore((s) => s + 1);
    };

    function nextQuestion() {
        setAnswered(false);
        setCurrentIndex((i) => i + 1);
    }

    if (currentIndex >= QUESTIONS.length) {
        return (
            <>
                <div>Fin! Mon score: {score}</div>
                <Link to="/" className={`${styles.button} ${layoutStyles.menuLink}`}>
                    Menu
                </Link>
            </>
        );
    }

    return (
        <div style={{ backgroundColor: 'darkblue', textAlign: 'center', padding: '20px' }}>
            <DisplayQuestion
                key={currentIndex}
                question={QUESTIONS[currentIndex]}
                onAnswered={handleAnswered}
            />
            {answered && (
                <button onClick={nextQuestion} className={styles.button}>
                    Next
                </button>
            )}
        </div>
    );
}
