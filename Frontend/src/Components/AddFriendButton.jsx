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
        return <button className={styles.friends} disabled>Friends</button>;
    }
}