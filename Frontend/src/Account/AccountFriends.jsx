import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  acceptRequest,
  declineRequest,
  getFriends,
  getReceivedRequests,
  sendFriendNamedRequest,
} from '../Api/friends';
import styles from './Styling/Account.module.css';
import { UserSearch } from '../Components/UserSearch';
import { getBlockedUsers } from '../Api/blocks';
import { Avatar } from '../Components/Avatar';

export function AccountFriends() {
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
      setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId));
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
      setInviteMessage({
        type: 'success',
        text: `Invitation envoyee a ${username}`,
      });
      setInviteTarget('');
    } catch (err) {
      setInviteMessage({ type: 'error', text: err.error || 'error!' });
    }
  }

  // if (loading) return <><section className='card'>Loading...</section></>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <section>
        <UserSearch onSelect={handleFriendClick} />
      </section>

      {requests.length !== 0 && (
        <section className="card">
          <h2 className={styles.cardTitle}>
            Requests <span className={styles.badge}>{requests.length}</span>
          </h2>
          <ul className="list">
            {requests.map(r => (
              <li key={r.friendshipId} className={styles.request}>
                <div className={styles.avatar}>{r.username?.[0]}</div>
                <span className={styles.requestName}>{r.username}</span>
                <div className={styles.actions}>
                  <button
                    className={`${styles.iconBtn} ${styles.accept}`}
                    aria-label={`Accept ${r.username}`}
                    onClick={() =>
                      handleRequestAction(r.friendshipId, 'accept')
                    }
                  >
                    ✓
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.decline}`}
                    aria-label={`Decline ${r.username}`}
                    onClick={() =>
                      handleRequestAction(r.friendshipId, 'decline')
                    }
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className={styles.cardTitle}>Mes amis</h2>
        {friends.length === 0 ? (
          <p className="empty">Pas d'amis (pour le moment !)</p>
        ) : (
          <ul className="list">
            {friends.map(f => (
              <FriendCard
                key={f.friendshipId}
                friend={f}
                onClick={handleFriendClick}
              />
            ))}
          </ul>
        )}
      </section>

      <section>
        {blocked.length !== 0 && (
          <>
            <h2 className={styles.cardTitle}>Bloques</h2>
            <ul className="list">
              {blocked.map(b => (
                <FriendCard
                  key={b.id}
                  friend={b}
                  onClick={handleFriendClick}
                ></FriendCard>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

export function FriendCard({ friend, onClick }) {
  return (
    <li
      className={styles.card}
      onClick={() => onClick(friend)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(friend);
        }
      }}
    >
      <Avatar src={friend.avatar_url} username={friend.username} size={40} />
      <div className={styles.info}>
        <span className={styles.username}>{friend.username}</span>
        {friend.display_name && friend.display_name !== friend.username && (
          <span className={styles.displayName}>{friend.display_name}</span>
        )}
      </div>
    </li>
  );
}
