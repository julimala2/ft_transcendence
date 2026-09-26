import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends } from '../Api/friends';
import { FriendCard } from './FriendCard';
import { Link } from 'react-router-dom';
import layoutStyles from '../Styling/Layout.module.css'
import styles from '../Styling/FriendsList.module.css';
import mainstyle from '../Styling/style.module.css'

export function FriendsList() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getFriends();
                if (!cancelled) setFriends(data);
            } catch (err) {
                if (!cancelled) setError(err.error || 'error');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    function handleFriendClick(friend) {
        navigate(`/users/${friend.id}`);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return ( <>
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
        {/* <Link to="/" className={`${mainstyle.button} ${layoutStyles.menuLink}`}>
            Menu
        </Link> */}
        </>
    );
}
