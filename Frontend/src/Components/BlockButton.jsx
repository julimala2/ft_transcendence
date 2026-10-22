import { useState } from 'react';
import { blockUser, unblockUser } from '../Api/blocks';
import { useRelationship } from '../Hooks/useRelationship';
import styles from '../Styling/AddFriendButton.module.css';

export function BlockButton() {
    const { userId, isBlocked, loading: relLoading, update, refresh } = useRelationship();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleClick() {
        setLoading(true);
        setError(null);
        try {
            if (isBlocked) {
                await unblockUser(userId);
                update({ isBlocked: false });
            } else {
                await blockUser(userId);
                update({ isBlocked: true });
                await refresh();
            }
        } catch (err) {
            setError(err.error || 'error');
        } finally {
            setLoading(false);
        }
    }

    if (relLoading) return <button disabled>...</button>;

    return (
        <>
            <button onClick={handleClick} disabled={loading}>
                {loading ? '...' : isBlocked ? 'Unblock' : 'Block'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
        </>
    );
}