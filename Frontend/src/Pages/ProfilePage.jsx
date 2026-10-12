import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { PublicProfile } from '../Account/PublicProfile';

export function ProfilePage() {
    const { userId } = useParams();
    const { user } = useAuth();

    // Si c'est le profil de l'utilisateur connecté, redirige vers la modale /account/profile
    const lookingAtMe = !userId || (user && String(userId) === String(user.id));
    if (lookingAtMe) {
        if (!user) return <Navigate to="/account" replace />;
        return <Navigate to="/account/profile" replace />;
    }

    // Sinon, affiche le profil public
    return <PublicProfile userId={userId} />;
}
