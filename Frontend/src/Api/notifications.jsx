import { apiFetch } from './api';

// limit: optionnel, entre 1 et 100 (defaut backend: 10)
export function getNotifications(limit) {
    const query = Number.isInteger(limit) && limit > 0 ? `?limit=${limit}` : '';
    return apiFetch(`/api/notifications/${query}`);
}

export function readAllNotifications() {
    return apiFetch('/api/notifications/read-all/', {method : 'PATCH'});
}

export function readOneNotification(id) {
    return apiFetch(`/api/notifications/${id}/read`, {method : 'PATCH'});
}

export function deleteAllNotifications() {
    return apiFetch('/api/notifications/delete-all', {method : 'DELETE'});
}

export function deleteOneNotification(id) {
    return apiFetch(`/api/notifications/${id}`, {method : 'DELETE'});
}