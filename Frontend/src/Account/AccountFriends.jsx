import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  acceptRequest,
  declineRequest,
  getFriends,
  getReceivedRequests,
  sendFriendNamedRequest,
} from '../Api/friends';
import styles from './Styling/Account.module.css';
import { getBlockedUsers } from '../Api/blocks';
import { Avatar } from '../Components/Avatar';
import { UserSearch } from '../Components/UserSearch';
import { CardContainer, ListContainer } from '../Components/Containers';
import { StyledButton } from '../Components/Buttons';

export function AccountFriends() {
  const [friends, setFriends] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteTarget, setInviteTarget] = useState('');
  // const [inviteMessage, setInviteMessage] = useState(null);
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

  if (loading) return <><section className='card'>Loading...</section></>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className='flex flex-col gap-7'>
      <UserSearch onSelect={handleFriendClick} />
      {requests.length !== 0 && (
        <div>
          <h2 className="font-bold text-xl">
            Demande d'amis : {requests.length}
          </h2>
          <ListContainer className="list">
            {requests.map(r => (
              <CardContainer key={r.friendshipId}>
                <Avatar username={r.username} />
                <span>{r.username}</span>
                <div className='flex flex-row gap-2'>
                  <StyledButton
                    variant="success"
                    onClick={() =>
                      handleRequestAction(r.friendshipId, 'accept')
                    }
                  >
                    ✓
                  </StyledButton>
                  <StyledButton
                    variant="danger"
                    onClick={() =>
                      handleRequestAction(r.friendshipId, 'decline')
                    }
                  >
                    ✕
                  </StyledButton>
                </div>
              </CardContainer>
            ))}
          </ListContainer>
        </div>
      )}

      <section>
        <h2 className="font-bold text-xl">Mes amis</h2>
        {friends.length === 0 ? (
          <p className="text-gray-500">Pas d'amis (pour le moment !)</p>
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
    </div>
  );
}

export function FriendCard({ friend, onClick }) {
  return (
    <li
      className="bg-blue-900 flex justify-between p-3 pl-5 pr-5 rounded-2xl align-middle items-center"
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
      <div>
        <span className='font-bold'>{friend.username}</span>
        {friend.display_name && friend.display_name !== friend.username && (
          <span className='font-bold'>{friend.display_name}</span>
        )}
      </div>
    </li>
  );
}
