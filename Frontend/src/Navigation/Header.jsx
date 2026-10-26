import { Link, useLocation } from 'react-router-dom';

import { Avatar } from '../Components/Avatar';
import { useAuth } from '../Hooks/useAuth';
import styles from '../Styling/Header.module.css';

export function Header() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed w-screen flex align-center justify-between p-15 pointer-none:">
      <Link to="/" className="bg-gray-800 p-5 border-2 border-purple-600 rounded-2xl font-bold">
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
