import { Link } from 'react-router-dom';
import styles from '../Styling/style.module.css';
import layoutStyles from '../Styling/Layout.module.css';
import { MenuButton } from '../Components/NavButtons';

export function SettingsPage() {
    return (
        <div className={layoutStyles.menu}>
            <h1>Settings</h1>
            <p>Placeholder !2</p>
            <MenuButton/>
        </div>
    );
}
