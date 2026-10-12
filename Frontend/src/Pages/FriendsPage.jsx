import { Navigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';

export function FriendsPage() {
    const { user } = useAuth();

    if (!user) return <Navigate to="/account" replace />;
    
    // Redirige vers la modale Account avec l'onglet friends
    return <Navigate to="/account/friends" replace />;
}
