import { useEffect, useState } from 'react';
import { apiFetch } from '../Api/api';
import { Avatar } from '../Components/Avatar';
import { AddFriendButton } from '../Components/AddFriendButton';
import { getFriends, getReceivedRequests, getSentRequests } from '../Api/friends';

async function fetchRelationship(profile){
    const [friends,received,sent] = await Promise.all([
        getFriends(),
        getReceivedRequests(),
        getSentRequests(),
    ]
    );

    const friend = friends.find((f)=>f.id === profile.id);
    if(friend){
        return {relationship: 'friends', friendshipId: friend.friendshipId};
    } 

    const inReceived = received.find((r) => r.username === profile.username);
    if(inReceived) return {relationship: 'pending_received', friendshipId:inReceived.friendshipId};

    const inSent = sent.find((r) => r.username === profile.username);
    if(inSent) return {relationship: 'pending_sent', friendshipId: inSent.friendshipId};

    return {relationship: 'none', friendshipId: null};
}

export function PublicProfile({ userId }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relation,setRelation] = useState({relationship: 'none', friendshipId: null});

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiFetch(`/api/users/${userId}`);
                const relationData = await fetchRelationship(data);
                if (!cancelled) {
                    setProfile(data);
                    setRelation(relationData);
                }
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

    //TODO loading animation would be nice
    // if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!profile) return <p></p>;

    return (
        <div className="page">

            <div className="card">
                <Avatar src={profile.avatar_url} username={profile.username} size={80} />
                <p>Username: {profile.username}</p>
                <p>Display name: {profile.display_name}</p>
                <AddFriendButton 
                    userId={profile.id} 
                    friendshipId={relation.friendshipId} 
                    relationship={relation.relationship}
                    onChange={(newRelationship)=>setRelation((prev) => ({...prev, relationship: newRelationship}))}>
                        Add friend
                    </AddFriendButton>
            </div>
        </div>
    );
}
