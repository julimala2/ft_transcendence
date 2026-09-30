import { Link } from 'react-router-dom';
import { useAuth } from '../Api/auth';
import styles from '../Styling/HomePage.module.css';

export function HomePage() {
    const { user } = useAuth();

    return (
        <main className={`page ${styles.home}`}>
            <div className={styles.stack}>
                <Link to="/quizoffline" className={styles.play}>
                    <svg className={styles.playIcon} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor" />
                    </svg>
                    Play
                </Link>
                <Link to="/game/1" className={styles.playOnline}>
                    Online
                </Link>

                <nav className={styles.secondary}>
                    {/* <Link to="/settings" className={styles.link}>
                        Settings
                    </Link> */}
                    {user && ( <>
                        <Link to="/friends" className={styles.link}>
                            Friends
                        </Link>
                        <Link to="/myQuizs" className={styles.link}>
                            My Quizs
                        </Link>
                        </>
                    )}
                    <Link to={user ? '/profile' : '/login'} className={styles.link}>
                        {user ? ('Profile'):('Login')}
                    </Link>

                </nav>
            </div>
        </main>
    );
}
