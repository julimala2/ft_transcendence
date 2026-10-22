import { apiFetch } from './api';

export function getFriends() {
    return apiFetch('/api/friends');
}

export function getReceivedRequests() {
    return apiFetch('/api/friends/requests/received');
}

export function getSentRequests() {
    return apiFetch('/api/friends/requests/sent');
}

export function acceptRequest(friendshipId) {
    return apiFetch(`/api/friends/${friendshipId}/accept`, { method: 'PATCH' });
}

export function declineRequest(friendshipId) {
    return apiFetch(`/api/friends/${friendshipId}/decline`, { method: 'PATCH' });
}

export function removeFriend(friendshipId) {
    return apiFetch(`/api/friends/${friendshipId}`, { method: 'DELETE' });
}

export function sendFriendRequest(addresseeId) {
    return apiFetch('/api/friends', {
        method: 'POST',
        body: JSON.stringify({ addressee_id: addresseeId }),
    });
}

export function sendFriendNamedRequest(username) {
    return apiFetch('/api/friends', {
        method: 'POST',
        body: JSON.stringify({username:username}),
    });
}

export function searchUsers(query) {
    return apiFetch(`/api/users/search?search=${encodeURIComponent(query)}`);
}

