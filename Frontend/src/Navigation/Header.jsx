import { Link } from 'react-router-dom';
import { useAuth } from '../Api/auth';
import styles from '../Styling/Header.module.css';
import layoutStyles from '../Styling/Layout.module.css';

export function Header() {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <Link to="/" className={`${styles.brand} ${layoutStyles.brandLink}`}>
                LeQuizzDeLaMortQuiTue
            </Link>
            <nav className={layoutStyles.headerNav}>
                <Link to={user ? '/profile' : '/login'} className={styles.loginButton}>
                    {user ? user.display_name || user.email : 'Log in'}
                </Link>
            </nav>
        </header>
    );
}
