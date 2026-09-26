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