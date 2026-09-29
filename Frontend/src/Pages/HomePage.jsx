import { Link } from 'react-router-dom';
import { useAuth } from '../Api/auth';
import styles from '../Styling/style.module.css';
import layoutStyles from '../Styling/Layout.module.css';

export function HomePage() {
    const { user } = useAuth();

    return (
        <div className={layoutStyles.menu}>
            <h1>LeQuizzDeLaMortQuiTue</h1>
            <nav className={layoutStyles.menuNav}>
                <Link to="/game/1" className={`${styles.button} ${layoutStyles.menuLink}`}>
                    Online
                </Link>
                <Link to="/play" className={`${styles.button} ${layoutStyles.menuLink}`}>
                    Play
                </Link>
                <Link to="/settings" className={`${styles.button} ${layoutStyles.menuLink}`}>
                    Settings
                </Link>
                {user && (
                    <Link to="/friends" className={`${styles.button} ${layoutStyles.menuLink}`}>
                        Friends
                    </Link>
                )}
                <Link
                    to={user ? '/profile' : '/login'}
                    className={`${styles.button} ${layoutStyles.menuLink}`}
                >
                    Profile
                </Link>
            </nav>
        </div>
    );
}
