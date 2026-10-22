import { Navigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { MyProfile } from './MyProfile';
import { PublicProfile } from './PublicProfile';

export function Profile({ userId = null }) {
    const { user, loading } = useAuth();

    // if (loading) return <p>Loading...</p>;

    const lookingAtMe = !userId || (user && String(userId) === String(user.id));

    if (lookingAtMe) {
        if (!user) return <Navigate to="/login" replace />;
        return <MyProfile />;
    }

    return <PublicProfile userId={userId} />;
}
