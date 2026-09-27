import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptRequest, declineRequest, getFriends, getReceivedRequests } from '../Api/friends';
import { FriendCard } from './FriendCard';
import { Link } from 'react-router-dom';
import layoutStyles from '../Styling/Layout.module.css'
import styles from '../Styling/FriendsList.module.css';
import mainstyle from '../Styling/style.module.css'
import { MenuButton } from '../Components/NavButtons';

export function FriendsList() {
    const [friends, setFriends] = useState([]);
    const [requests,setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getFriends();
                const requestData = await getReceivedRequests();
                if (!cancelled) {
                setFriends(data);
                setRequests(requestData);
                }
            } catch (err) {
                if (!cancelled) setError(err.error || 'error receiving requests');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    async function handleRequestAction(friendshipId, action){
        try {
            if (action === 'accept') {
                await acceptRequest(friendshipId);
                const updated = await getFriends();
                setFriends(updated);
            } else if (action === 'decline') {
                await declineRequest(friendshipId);
            }
            setRequests((prev) => prev.filter((r) => r.friendshipId !== friendshipId));
        } catch (err) {
            setError(err.error || 'error');
        }
    }

    function handleFriendClick(friend) {
        navigate(`/users/${friend.id}`);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return ( <div className={styles.main}>
        {/* Friends requests  */}
        <div className={styles.container}>
            {requests.length === 0 ? (
                <p>No friend requests</p>
            ):
            (
                <ul>
                    {requests.map((r)=> (
                        <li key={r.friendshipId}>
                            <span>
                                {r.username}
                            <button onClick={()=> handleRequestAction(r.friendshipId,'accept')}>✅</button>
                            <button onClick={()=> handleRequestAction(r.friendshipId,'decline')}>❌</button>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        {/* Friends list */}
        <div className={styles.container}>
            <h2>My friends</h2>
            {friends.length === 0 ? (
                <p className={styles.empty}>No friends yet</p>
            ) : (
                <ul className={styles.list}>
                    {friends.map((f) => (
                        <FriendCard
                            key={f.friendshipId}
                            friend={f}
                            onClick={handleFriendClick}
                        />
                    ))}
                </ul>
            )}
        </div>
        <MenuButton/>
        </div>
    );
}
