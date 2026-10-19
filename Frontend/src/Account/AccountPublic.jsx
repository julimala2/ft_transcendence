import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../Api/api';
import { getFriends, getReceivedRequests, getSentRequests, sendFriendRequest, removeFriend, acceptRequest, declineRequest } from '../Api/friends';
import { getBlockedUsers, blockUser, unblockUser } from '../Api/blocks';
import { Avatar } from '../Components/Avatar';

export function AccountPublic() {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    
    // Relationship state
    const [relationship, setRelationship] = useState('loading');
    const [friendshipId, setFriendshipId] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);

    // Load profile
    useEffect(() => {
        let cancelled = false;
        
        async function loadProfile() {
            try {
                const data = await apiFetch(`/api/users/${userId}`);
                if (!cancelled) setProfile(data);
            } catch (err) {
                if (!cancelled) setError(err.error || 'Could not load profile');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        
        loadProfile();
        
        return () => {
            cancelled = true;
        };
    }, [userId]);

    // Load relationship status
    useEffect(() => {
        if (!profile) return;
        
        let cancelled = false;
        
        async function loadRelationship() {
            try {
                const [friends, received, sent, blocked] = await Promise.all([
                    getFriends(),
                    getReceivedRequests(),
                    getSentRequests(),
                    getBlockedUsers(),
                ]);
                
                if (cancelled) return;
                
                // Check if blocked
                const blockedUser = blocked.find(b => b.id === profile.id);
                if (blockedUser) {
                    setIsBlocked(true);
                    setRelationship('none');
                    return;
                }
                
                // Check if friend
                const friend = friends.find(f => f.id === profile.id);
                if (friend) {
                    setRelationship('friends');
                    setFriendshipId(friend.friendshipId);
                    return;
                }
                
                // Check received requests
                const inReceived = received.find(r => r.id === profile.id);
                if (inReceived) {
                    setRelationship('pending_received');
                    setFriendshipId(inReceived.friendshipId);
                    return;
                }
                
                // Check sent requests
                const inSent = sent.find(r => r.id === profile.id);
                if (inSent) {
                    setRelationship('pending_sent');
                    setFriendshipId(inSent.friendshipId);
                    return;
                }
                
                // Default
                setRelationship('none');
                setFriendshipId(null);
                
            } catch (err) {
                console.error('Error loading relationship:', err);
            }
        }
        
        loadRelationship();
        
        return () => {
            cancelled = true;
        };
    }, [profile]);

    // Actions
    async function handleAddFriend() {
        if (!profile) return;
        
        setActionLoading(true);
        setActionError(null);
        
        try {
            await sendFriendRequest(profile.id);
            setRelationship('pending_sent');
        } catch (err) {
            setActionError(err.error || 'Failed to send friend request');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleRemoveFriend() {
        if (!friendshipId) return;
        
        setActionLoading(true);
        setActionError(null);
        
        try {
            await removeFriend(friendshipId);
            setRelationship('none');
            setFriendshipId(null);
        } catch (err) {
            setActionError(err.error || 'Failed to remove friend');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleAcceptRequest() {
        if (!friendshipId) return;
        
        setActionLoading(true);
        setActionError(null);
        
        try {
            await acceptRequest(friendshipId);
            setRelationship('friends');
        } catch (err) {
            setActionError(err.error || 'Failed to accept request');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDeclineRequest() {
        if (!friendshipId) return;
        
        setActionLoading(true);
        setActionError(null);
        
        try {
            await declineRequest(friendshipId);
            setRelationship('none');
            setFriendshipId(null);
        } catch (err) {
            setActionError(err.error || 'Failed to decline request');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleBlock() {
        if (!profile) return;
        
        setActionLoading(true);
        setActionError(null);
        
        try {
            await blockUser(profile.id);
            setIsBlocked(true);
            setRelationship('none');
        } catch (err) {
            setActionError(err.error || 'Failed to block user');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleUnblock() {
        if (!profile) return;
        
        setActionLoading(true);
        setActionError(null);
        
        try {
            await unblockUser(profile.id);
            setIsBlocked(false);
        } catch (err) {
            setActionError(err.error || 'Failed to unblock user');
        } finally {
            setActionLoading(false);
        }
    }

    // Render
    if (loading) {
        return <div>Chargement du profil...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    if (!profile) {
        return <div>Profil introuvable</div>;
    }

    return (
        <div className="page">
            <h1>Profil de {profile.username}</h1>
            
            {/* Basic info */}
            <div>
                <Avatar src={profile.avatar_url} username={profile.username} size={80} />
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    {profile.display_name && (
                        <p><strong>Display Name:</strong> {profile.display_name}</p>
                    )}
                    {profile.bio && (
                        <p><strong>Bio:</strong> {profile.bio}</p>
                    )}
                    <p><strong>Score:</strong> {profile.score}</p>
                    <p><strong>Niveau:</strong> {profile.level}</p>
                    <p><strong>Quizs créés:</strong> {profile.quizzesCreated || 0}</p>
                </div>
            </div>

            {/* Action buttons */}
            <div>
                <h2>Actions</h2>
                
                {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
                
                {isBlocked ? (
                    <>
                        <p>Utilisateur bloqué</p>
                        <button onClick={handleUnblock} disabled={actionLoading}>
                            {actionLoading ? '...' : 'Dé bloquer'}
                        </button>
                    </>
                ) : (
                    <>
                        {relationship === 'friends' && (
                            <button onClick={handleRemoveFriend} disabled={actionLoading}>
                                {actionLoading ? '...' : 'Retirer des amis'}
                            </button>
                        )}
                        
                        {relationship === 'pending_sent' && (
                            <button disabled>
                                Demande d'ami envoyée
                            </button>
                        )}
                        
                        {relationship === 'pending_received' && (
                            <>
                                <button onClick={handleAcceptRequest} disabled={actionLoading}>
                                    {actionLoading ? '...' : 'Accepter la demande'}
                                </button>
                                <button onClick={handleDeclineRequest} disabled={actionLoading}>
                                    {actionLoading ? '...' : 'Refuser la demande'}
                                </button>
                            </>
                        )}
                        
                        {relationship === 'none' && (
                            <button onClick={handleAddFriend} disabled={actionLoading}>
                                {actionLoading ? '...' : 'Ajouter en ami'}
                            </button>
                        )}
                        
                        <button onClick={handleBlock} disabled={actionLoading || isBlocked}>
                            {actionLoading ? '...' : 'Bloquer'}
                        </button>
                    </>
                )}
            </div>

            {/* Stats */}
            <div>
                <h2>Statistiques</h2>
                <p>Nombre de quizs joués: {profile.quizzesPlayed || 0}</p>
                <p>Taux de réussite: {profile.successRate || 0}%</p>
            </div>

            <button onClick={() => navigate(-1)}>
                Retour
            </button>
        </div>
    );
}
