import { useEffect, useState } from 'react';
import { apiFetch } from '../Api/api';
import { Avatar } from '../Components/Avatar';
import { AddFriendButton } from '../Components/AddFriendButton';
import { BlockButton } from '../Components/BlockButton';
import { RelationshipProvider } from '../Hooks/useRelationship';

export function PublicProfile({ userId }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setError(null);
            try {
                const data = await apiFetch(`/api/users/${userId}`);
                if (!cancelled) setProfile(data);
            } catch (err) {
                if (!cancelled) setError(err.error || 'Could not load profile');
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    if (error) return <p>{error}</p>;
    if (!profile) return null;

    return (
        <div className="page">
            <div className="card">
                <Avatar src={profile.avatar_url} username={profile.username} size={80} />
                <p>Username: {profile.username}</p>
                <p>Display name: {profile.display_name}</p>

                <RelationshipProvider profile={profile}>
                    <AddFriendButton />
                    <BlockButton />
                </RelationshipProvider>
            </div>
        </div>
    );
}
