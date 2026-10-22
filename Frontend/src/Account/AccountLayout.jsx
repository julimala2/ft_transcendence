import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { accountTabs } from './AccountTabs';
import styles from '../Styling/Account.module.css';

export function AccountLayout() {
  const location = useLocation();

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