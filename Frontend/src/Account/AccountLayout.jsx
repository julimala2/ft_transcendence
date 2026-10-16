import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { AccountAuth } from './AccountAuth';
import { accountTabs } from './AccountTabs';
import styles from './Styling/Account.module.css';

export function AccountLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <AccountAuth />;
  }

  return (
    <div className={styles.account}>
      <nav className={styles.tabs}>
        {accountTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            replace
            state={location.state}
            className={({ isActive }) =>
              isActive ? `${styles.tab} ${styles.active}` : styles.tab
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}