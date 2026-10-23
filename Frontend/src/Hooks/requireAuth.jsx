import { useAuth } from './useAuth';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user)
    return <Navigate to="/account" replace state={{ from: location }} />;
  return <Outlet />;
}
