import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getFriends, getReceivedRequests, getSentRequests } from '../Api/friends';
import { getBlockedUsers } from '../Api/blocks';

const RelationshipContext = createContext(null);

async function fetchRelationship(profile) {
    const [friends, received, sent, blocked] = await Promise.all([
        getFriends(),
        getReceivedRequests(),
        getSentRequests(),
        getBlockedUsers(),
    ]);

    const isBlocked = blocked.some((b) => b.id === profile.id);

    const friend = friends.find((f) => f.id === profile.id);
    if (friend) {
        return { relationship: 'friends', friendshipId: friend.friendshipId, isBlocked };
    }

    const inReceived = received.find((r) => r.username === profile.username);
    if (inReceived) {
        return { relationship: 'pending_received', friendshipId: inReceived.friendshipId, isBlocked };
    }

    const inSent = sent.find((r) => r.username === profile.username);
    if (inSent) {
        return { relationship: 'pending_sent', friendshipId: inSent.friendshipId, isBlocked };
    }

    return { relationship: 'none', friendshipId: null, isBlocked };
}

export function RelationshipProvider({ profile, children }) {
    const [state, setState] = useState({
        loading: true,
        error: null,
        relationship: 'none',
        friendshipId: null,
        isBlocked: false,
    });

    const { id, username } = profile;

    useEffect(() => {
        let cancelled = false;
        setState((prev) => ({ ...prev, loading: true, error: null }));

        fetchRelationship({ id, username })
            .then((data) => {
                if (!cancelled) setState({ loading: false, error: null, ...data });
            })
            .catch((err) => {
                if (!cancelled) {
                    setState((prev) => ({ ...prev, loading: false, error: err.error || 'error' }));
                }
            });

        return () => {
            cancelled = true;
        };
    }, [id, username]);

    const refresh = useCallback(async () => {
        try {
            const data = await fetchRelationship({ id, username });
            setState({ loading: false, error: null, ...data });
        } catch (err) {
            setState((prev) => ({ ...prev, error: err.error || 'error' }));
        }
    }, [id, username]);

    const update = useCallback((patch) => {
        setState((prev) => ({ ...prev, ...patch }));
    }, []);

    const value = useMemo(
        () => ({ ...state, userId: id, update, refresh }),
        [state, id, update, refresh]
    );

    return <RelationshipContext.Provider value={value}>{children}</RelationshipContext.Provider>;
}

export function useRelationship() {
    const ctx = useContext(RelationshipContext);
    if (!ctx) {
        throw new Error('useRelationship should be used in a <RelationshipProvider>');
    }
    return ctx;
}