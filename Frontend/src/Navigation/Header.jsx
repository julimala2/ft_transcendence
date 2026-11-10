import { Link, useLocation } from 'react-router-dom';

import { Avatar } from '../Components/Avatar';
import { useAuth } from '../Hooks/useAuth';
import { useUnreadNotifications } from '../Hooks/useUnreadNotifications';
import { Logo } from '../Components/Logo';
import { StyledDiv } from '../Components/Containers';

export function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const unreadCount = useUnreadNotifications();

  return (
    <header className="fixed w-screen flex align-center md:justify-between justify-end p-3 md:pl-20 md:pr-20 md:pt-12 pointer-events-none z-100">
      <StyledDiv outerClassName='md:flex hidden' className=" md:flex hidden pointer-events-auto">
        <Logo></Logo>
      </StyledDiv>
      <StyledDiv outerClassName='rounded-full!' className='rounded-full!'>
        <Link
          to="/account"
          className="flex items-center pointer-events-auto gap-3 md:pr-3"
          state={{ backgroundLocation: location.pathname }}
        >
          {user ? (
            <div className="relative">
              <Avatar
                src={user.avatar_url}
                username={user.display_name}
                size={60}
              />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-slate-900"
                  title={`${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''} notification${unreadCount > 1 ? 's' : ''}`}
                />
              )}
            </div>
          ) : (
            <Avatar size={60} />
          )}
          <span className='md:flex hidden'>
            {user ? user.display_name || user.email : 'Log in'}
          </span>
        </Link>
      </StyledDiv>
    </header>
  );
}
