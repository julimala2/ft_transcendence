import { useEffect, useState } from 'react';

import { FriendCard } from '../Account/AccountFriends';
import { searchUsers } from '../Api/friends';

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
      <input
        type="search"
        placeholder="Search users"
        aria-label="Search users"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {!query ? (
        <></>
      ) : searching ? (
        <p className="empty">Searching...</p>
      ) : results.length === 0 ? (
        <p className="empty">No user called « {search} »</p>
      ) : (
        <ul className="list">
          {results.map(u => (
            <FriendCard key={u.id} friend={u} onClick={onSelect} />
          ))}
        </ul>
      )}
    </>
  );
}
