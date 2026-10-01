import { useParams } from 'react-router-dom';
import { Profile } from '../Profile/Profile';

export function ProfilePage() {
    const { userId } = useParams();
    return <Profile userId={userId ?? null} />;
}
