import {useState} from 'react';
import {sendFriendRequest,acceptRequest} from '../Api/friends';
import styles from '../Styling/AddFriendButton.module.css'

export function AddFriendButton({userId,friendshipId,relationship,onChange}){
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    async function handleClick() {
        setLoading(true);
        setError(null);
        try {
            if (relationship === 'none'){
                await sendFriendRequest(userId);
                onChange?.('pending_sent');
            }
            else if (relationship === 'pending_received') {
                await acceptRequest(friendshipId);
                onChange?.('friends');
            }
        } catch (err) {
            setError(err.error || 'error');
        } finally {
            setLoading(false);
        }
    }

    if (relationship ==='friends') {
        return <button className={styles.friends} disabled>Already friends 🤝</button>;
    }
    else if (relationship ==='pending_sent') {
        return <button disabled>Request Sent</button>
    }

    return (
        <>
            <button onClick={handleClick} disabled={loading}>
                {loading
                ? '...'
                : relationship === 'pending_received'
                ? 'Accept request'
                : 'Add friend'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
        </>
    );
}