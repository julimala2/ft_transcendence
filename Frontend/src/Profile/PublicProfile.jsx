import { useEffect, useState } from 'react';
import { apiFetch } from '../Api/api';
import { Avatar } from '../Components/Avatar';

export function PublicProfile({ userId }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiFetch(`/api/users/${userId}`);
                if (!cancelled) setProfile(data);
            } catch (err) {
                if (!cancelled) setError(err.error || 'Could not load profile');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!profile) return <p>User not found.</p>;

    return (
        <div>
            <Avatar src={profile.avatar_url} username={profile.username} size={80} />
            <p>Username: {profile.username}</p>
            <p>Display name: {profile.display_name}</p>
        </div>
    );
}
