import { Link } from 'react-router-dom';
import styles from '../Styling/QuizCard.module.css';

export function QuizCard({ quiz }) {
    return (
        <Link to={`/play/${quiz.id}`} className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>{quiz.title}</h3>
                {quiz._count?.questions !== undefined && (
                    <span className={styles.questionCount}>{quiz._count.questions} questions</span>
                )}
            </div>
            {quiz.description && (
                <p className={styles.description}>{quiz.description}</p>
            )}
        </Link>
    );
}
