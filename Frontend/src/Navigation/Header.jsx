import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Avatar } from '../Components/Avatar';
import { useAuth } from '../Hooks/useAuth';
import { useUnreadNotifications } from '../Hooks/useUnreadNotifications';
import { Logo } from '../Components/Logo';
import { StyledDiv } from '../Components/Containers';

export function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = useUnreadNotifications();

  return (
    <header className="fixed w-screen flex align-center justify-between p-3 md:pl-20 md:pr-20 md:pt-12 pointer-events-none z-100">
      <div className="flex items-center gap-4 pointer-events-auto">
        <StyledDiv 
          className="aspect-square h-[60px] bg-gray-800/80 border border-gray-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-700/80 transition-colors"
          onClick={() => navigate(-1)}
          aria-label="Retour"
        >
          <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </StyledDiv>
        <div className="md:flex hidden h-[60px]">
          <Logo></Logo>
        </div>
      </div>
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
