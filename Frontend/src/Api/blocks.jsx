import { apiFetch } from "./api";

export function getBlockedUsers() {
    return apiFetch(`/api/blocks`, {method: 'GET'});
}

export function blockUser(userId) {
    return apiFetch(`/api/blocks`, {
        method : 'POST',
        body: JSON.stringify({blocked_id:userId}),
    });
}

export function unblockUser(userId) {
    return apiFetch(`/api/blocks/${userId}`, {
        method : 'DELETE',
        body: JSON.stringify({blocked_id:userId,})
    });
}