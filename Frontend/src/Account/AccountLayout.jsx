import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { AccountAuth } from './AccountAuth';
import { accountTabs } from './AccountTabs';
import { useAuth } from '../Hooks/useAuth';

export function AccountLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <AccountAuth />;
  }

  return (
    <div className="p-2 flex-col md:flex-row flex flex-1 gap-4 size-full ">
      <nav className="flex flex-row md:flex-col wrap flex-wrap">
        {accountTabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            replace
            state={location.state}
            className={({ isActive }) =>
              isActive ? `bg-amber-400 text-black p-3 rounded-xl` : 'p-3 text-white border-b-1'
          }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
