import { Navigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { FriendsList } from '../Profile/FriendsList';

export function FriendsPage() {
    const { user, loading } = useAuth();

    // if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;

    return <FriendsList />;
}
