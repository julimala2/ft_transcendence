// Navigation/Header.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Modal } from './Modal';
import { Profile } from '../Profile/Profile';
import styles from '../Styling/Header.module.css';

export function Header() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (user) setAuthOpen(false);
  }, [user]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.brand}>LeQuizzDeLaMortQuiTue</div>

        <button
          className={styles.loginButton}
          onClick={() => setAuthOpen(true)}
        >
          {user ? user.email : 'Log in'}
        </button>
      </header>

      <Modal isOpen={authOpen} onClose={() => setAuthOpen(false)}>
        <Profile />
      </Modal>
    </>
  );
}