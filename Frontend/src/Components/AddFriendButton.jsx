import { useState } from 'react';
import { sendFriendRequest, acceptRequest, removeFriend } from '../Api/friends';
import { useRelationship } from '../Hooks/useRelationship';
import styles from '../Styling/AddFriendButton.module.css';

export function AddFriendButton() {
    const { userId, relationship, friendshipId, isBlocked, loading: relLoading, update } = useRelationship();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleClick() {
        setLoading(true);
        setError(null);
        try {
            if (relationship === 'none') {
                await sendFriendRequest(userId);
                update({ relationship: 'pending_sent' });
            } else if (relationship === 'pending_received') {
                await acceptRequest(friendshipId);
                update({ relationship: 'friends' });
            } else if (relationship === 'friends') {
                await removeFriend(friendshipId);
                update({ relationship: 'none', friendshipId: null });
            }
        } catch (err) {
            setError(err.error || 'error');
        } finally {
            setLoading(false);
        }
    }

    if (isBlocked) return null;

    if (relLoading) return <button disabled>...</button>;

    if (relationship === 'pending_sent') {
        return <button disabled>Request Sent</button>;
    }

    const label =
        relationship === 'friends'
            ? 'Remove friend'
            : relationship === 'pending_received'
            ? 'Accept request'
            : 'Add friend';

    return (
        <>
            <button
                className={relationship === 'friends' ? styles.friends : undefined}
                onClick={handleClick}
                disabled={loading}
            >
                {loading ? '...' : label}
            </button>
            {error && <p className={styles.error}>{error}</p>}
        </>
    );
}