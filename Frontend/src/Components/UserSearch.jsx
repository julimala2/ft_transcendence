import { useEffect, useState } from 'react';

import { FriendCard } from '../Account/AccountFriends';
import { searchUsers } from '../Api/friends';
import { StyledInput } from './Inputs';

export function UserSearch({ onSelect, children }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const query = search.trim();

  useEffect(() => {
    if (!query) {
      setResults([]);
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);

    const timer = setTimeout(async () => {
      try {
        const data = await searchUsers(query);
        if (!cancelled) setResults(data);
      } catch (err) {
        console.error('searchUsers error:', err);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <>
      <StyledInput
        type="search"
        placeholder="Chercher un utilisateur"
        aria-label="Search users"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {!query ? (
        <></>
      ) : searching ? (
        <p className="empty">Recherche...</p>
      ) : results.length === 0 ? (
        <p className="empty">Aucun utilisateur commencant par : « {search} »</p>
      ) : (
        <ul className="list flex flex-col gap-2">
          {results.map(u => (
            <FriendCard key={u.id} friend={u} onClick={onSelect} />
          ))}
        </ul>
      )}
    </>
  );
}
