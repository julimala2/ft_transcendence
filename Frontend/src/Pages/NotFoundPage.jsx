import { Link } from 'react-router-dom';
import styles from '../Styling/style.module.css';
import layoutStyles from '../Styling/Layout.module.css';

export function NotFoundPage() {
    return (
        <div className={layoutStyles.menu}>
            <h1>404</h1>
            <p>This page does not exist.</p>
            <Link to="/" className={`${styles.button} ${layoutStyles.menuLink}`}>
                Menu
            </Link>
        </div>
    );
}
