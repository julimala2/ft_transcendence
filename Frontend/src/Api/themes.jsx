import { apiFetch } from "./api";

// ============================================
// THEME ROUTES
// ============================================

/**
 * Récupère tous les thèmes
 * @returns {Promise<Array>} Liste des thèmes
 */
export function getAllThemes() {
    return apiFetch('/api/themes', { method: 'GET' });
}

/**
 * Récupère un thème par son ID
 * @param {number} id - ID du thème
 * @returns {Promise<Object>} Thème détaillé
 */
export function getThemeById(id) {
    return apiFetch(`/api/themes/${id}`, { method: 'GET' });
}

/**
 * Récupère un thème par son slug
 * @param {string} slug - Slug du thème
 * @returns {Promise<Object>} Thème détaillé
 */
export function getThemeBySlug(slug) {
    return apiFetch(`/api/themes/slug/${slug}`, { method: 'GET' });
}

/**
 * Récupère un thème par son nom
 * @param {string} name - Nom du thème
 * @returns {Promise<Object>} Thème détaillé
 */
export function getThemeByName(name) {
    return apiFetch(`/api/themes/name/${name}`, { method: 'GET' });
}