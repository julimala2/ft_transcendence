import { Link } from 'react-router-dom';
import styles from '../Styling/style.module.css';
import layoutStyles from '../Styling/Layout.module.css';

export function SettingsPage() {
    return (
        <div className={layoutStyles.menu}>
            <h1>Settings</h1>
            <p>Placeholder !2</p>
            <Link to="/">
                <button>Menu</button>
            </Link>
        </div>
    );
}
