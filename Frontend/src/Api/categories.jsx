import { apiFetch } from './api';

// Récupère toutes les catégories
// export function getAllCategories() {
//     return apiFetch('/api/categories', { method: 'GET' });
// }

// Récupère les tags d'une catégorie
// GET /api/categories/:id/tags
// Paramètres optionnels : ?search=... (pour filtrer les tags)
export function getCategoryTags(categoryId, search = null) {
  let url = `/api/categories/${categoryId}/tags`;
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }
  return apiFetch(url, { method: 'GET' });
}

// Récupère une catégorie par son ID
export function getCategoryById(categoryId) {
  return apiFetch(`/api/categories/${categoryId}`, { method: 'GET' });
}
