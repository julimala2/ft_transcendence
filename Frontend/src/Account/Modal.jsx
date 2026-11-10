import { useEffect } from 'react';

import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { StyledDiv } from "../Components/Containers";

export function Modal({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const close = () => {
    // Navigate back to the background location or home if none exists
    if (location.state?.backgroundLocation) {
      navigate(location.state.backgroundLocation, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    const onKeyDown = e => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [navigate, location]);

return createPortal(
  <div
    className="fixed flex items-center justify-center inset-0 z-1000 p-6 bg-gray-950/50"
    onClick={close}
  >
    <StyledDiv
      outerClassName='max-w-200 max-h-200 relative flex flex-row flex-1 size-full min-w-0 min-h-0 '
      role="dialog"
      aria-modal="true"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute -top-5 -right-5 bg-slate-900 border-4 border-amber-400 rounded-full h-10 w-10 text-2xl font-bold "
        onClick={close}
        aria-label="Fermer"
      >
        ×
      </button>
      {children}
    </StyledDiv>
  </div>,
  document.body
)}