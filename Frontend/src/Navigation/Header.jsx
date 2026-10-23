import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import styles from '../Styling/Header.module.css';
import { Avatar } from '../Components/Avatar';

export function Header() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        LeQuizzDeLaMortQuiTue
      </Link>
      <nav className={styles.nav}>
        <Link
          to="/account"
          className={styles.loginButton}
          state={{ backgroundLocation: location.pathname }}
        >
          {user ? (
            <Avatar
              src={user.avatar_url}
              username={user.display_name}
              size={45}
            />
          ) : (
            <Avatar size={45} />
          )}
          <span className={styles.loginText}>
            {user ? user.display_name || user.email : 'Log in'}
          </span>
        </Link>
      </nav>
    </header>
  );
}
