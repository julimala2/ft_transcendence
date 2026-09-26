import { Outlet } from 'react-router-dom';
import { Header } from '../Navigation/Header';
import styles from '../Styling/Layout.module.css';

export function Layout() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
        </>
    );
}
