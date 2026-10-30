import { Link, useLocation } from 'react-router-dom';

import { Avatar } from '../Components/Avatar';
import { useAuth } from '../Hooks/useAuth';
import { Logo } from '../Components/Logo';

export function Header() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed w-screen flex align-center justify-between p-15 pointer-events-none z-100">
      <div className="bg-gray-800 p-5 border-2 border-purple-800 rounded-2xl font-bold pointer-events-auto">
        <Logo className="h-7 text-xl p-0! border-0!"></Logo>
      </div>
      <div>
        <Link
          to="/account"
          className="flex items-center gap-10 p-1 pr-14 border-2 border-purple-800 rounded-full bg-slate-800 font-bold text-xl pointer-events-auto"
          state={{ backgroundLocation: location.pathname }}
        >
          {user ? (
            <Avatar
              src={user.avatar_url}
              username={user.display_name}
              size={60}
            />
          ) : (
            <Avatar size={60} />
          )}
          <span>
            {user ? user.display_name || user.email : 'Log in'}
          </span>
        </Link>
      </div>
    </header>
  );
}
