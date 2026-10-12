import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { acceptRequest, declineRequest, getFriends, getReceivedRequests, sendFriendNamedRequest } from '../Api/friends';
import { FriendCard } from './FriendCard';
import styles from '../Styling/FriendsList.module.css';
import { UserSearch } from '../Components/UserSearch';
import { getBlockedUsers } from '../Api/blocks';

export function FriendsList() {
    const [friends, setFriends] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inviteTarget, setInviteTarget] = useState('');
    const [inviteMessage, setInviteMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getFriends();
                const requestData = await getReceivedRequests();
                const blockedData = await getBlockedUsers();
                if (!cancelled) {
                    setFriends(data);
                    setRequests(requestData);
                    setBlocked(blockedData);
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

    async function handleRequestAction(friendshipId, action) {
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

    async function sendNamedInvite() {
        const username = inviteTarget.trim();
        if (!username) return;

        try {
            await sendFriendNamedRequest(username);
            setInviteMessage({ type: 'success', text: `Invitation sent to ${username}` });
            setInviteTarget('');
        } catch (err) {
            setInviteMessage({ type: 'error', text: err.error || 'error!' });
        }
    }

    if (loading) return <div className='page'><section className='card'>Loading...</section></div>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <>
            <header className={styles.header}>
                <h1>Friends</h1>
                <span className={styles.count}>
                    {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
                </span>
            </header>

            {/* User search */}
            <section className="card">
                <UserSearch onSelect={handleFriendClick} />
            </section>

            {/* Friend requests */}
            {requests.length !== 0 && (
                <section className="card">
                    <h2 className={styles.cardTitle}>
                        Requests <span className={styles.badge}>{requests.length}</span>
                    </h2>
                    <ul className="list">
                        {requests.map((r) => (
                            <li key={r.friendshipId} className={styles.request}>
                                <div className={styles.avatar}>{r.username?.[0]}</div>
                                <span className={styles.requestName}>{r.username}</span>
                                <div className={styles.actions}>
                                    <button
                                        className={`${styles.iconBtn} ${styles.accept}`}
                                        aria-label={`Accept ${r.username}`}
                                        onClick={() => handleRequestAction(r.friendshipId, 'accept')}
                                    >
                                        ✓
                                    </button>
                                    <button
                                        className={`${styles.iconBtn} ${styles.decline}`}
                                        aria-label={`Decline ${r.username}`}
                                        onClick={() => handleRequestAction(r.friendshipId, 'decline')}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Friends list */}
            <section className="card">
                <h2 className={styles.cardTitle}>My friends</h2>
                {friends.length === 0 ? (
                    <p className="empty">No friends yet. Invite someone below to get started.</p>
                ) : (
                    <ul className="list">
                        {friends.map((f) => (
                            <FriendCard key={f.friendshipId} friend={f} onClick={handleFriendClick} />
                        ))}
                    </ul>
                )}
            </section>

            {/* Invite by username */}
            <section className="card">
                <h2 className={styles.cardTitle}>Invite a friend</h2>
                <div className={styles.inviteRow}>
                    <input
                        name="inviteInput"
                        placeholder="Username"
                        value={inviteTarget}
                        onChange={(e) => setInviteTarget(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendNamedInvite()}
                    />
                    <button
                        onClick={sendNamedInvite}
                        disabled={!inviteTarget.trim()}
                    >
                        Send invite
                    </button>
                </div>
                {inviteMessage && (
                    <p className={`alert ${inviteMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {inviteMessage.text}
                    </p>
                )}
            </section>

            {/* Blocked users */}
            <section className="card">
                <h2 className={styles.cardTitle}>Blocked users</h2>
                {blocked.length === 0 ? (
                    <p className='empty'>No user blocked.</p>
                ) :
                (
                    <ul className='list'>
                        {blocked.map((b) => (
                            <FriendCard key={b.id} friend={b} onClick={handleFriendClick}></FriendCard>
                        ))}
                    </ul>
                )}
            </section>

            <div className={styles.footer}>
                <Link to="/">
                    <button>Menu</button>
                </Link>
            </div>
        </>
    );
}
