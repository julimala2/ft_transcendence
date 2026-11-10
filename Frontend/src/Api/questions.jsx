import { apiFetch } from './api';

// ============================================
// QUESTION ROUTES
// ============================================

/**
 * Récupère toutes les questions avec options de filtrage
 * @param {Object} filters - Filtres optionnels
 * @param {number} filters.categoryId - ID de la catégorie
 * @param {number} filters.difficulty - Difficulté (1, 2, ou 3)
 * @param {string} filters.tag - Tag pour filtrer
 * @param {number} filters.limit - Nombre max de questions (défaut: 50)
 * @param {number} filters.offset - Offset pour pagination (défaut: 0)
 * @returns {Promise<Array>} Liste des questions
 */
export function getAllQuestions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.categoryId !== undefined)
    params.append('categoryId', filters.categoryId);
  if (filters.difficulty !== undefined)
    params.append('difficulty', filters.difficulty);
  if (filters.tag !== undefined) params.append('tag', filters.tag);
  if (filters.limit !== undefined) params.append('limit', filters.limit);
  if (filters.offset !== undefined) params.append('offset', filters.offset);

  const queryString = params.toString();
  return apiFetch(`/api/questions${queryString ? '?' + queryString : ''}`, {
    method: 'GET',
  });
}

/**
 * Récupère une question par son ID
 * @param {number} id - ID de la question
 * @returns {Promise<Object>} Question détaillée
 */
export function getQuestionById(id) {
  return apiFetch(`/api/questions/${id}`, { method: 'GET' });
}

/**
 * Crée une nouvelle question
 * @param {Object} questionData - Données de la question
 * @param {string} questionData.text - Texte de la question (obligatoire)
 * @param {Array} questionData.answers - Tableau de réponses (obligatoire, min 2)
 * @param {string} [questionData.type] - 'multiple' | 'boolean'
 * @param {number} [questionData.difficulty] - 1 (facile), 2 (moyen), 3 (difficile)
 * @param {string} [questionData.explanation] - Explication de la bonne réponse
 * @param {number} [questionData.categoryId] - ID de la catégorie
 * @param {Array} [questionData.tags] - Tableau de tags
 * @returns {Promise<Object>} Question créée
 */
export function createQuestion(questionData) {
  return apiFetch('/api/questions', {
    method: 'POST',
    body: JSON.stringify(questionData),
  });
}

/**
 * Met à jour une question existante
 * @param {number} id - ID de la question
 * @param {Object} updateData - Champs à mettre à jour
 * @param {string} [updateData.text] - Nouveau texte
 * @param {Array} [updateData.answers] - Nouvelles réponses
 * @param {number} [updateData.difficulty] - Nouvelle difficulté
 * @param {string} [updateData.explanation] - Nouvelle explication
 * @param {number} [updateData.categoryId] - Nouvelle catégorie
 * @param {Array} [updateData.tags] - Nouveaux tags
 * @returns {Promise<Object>} Question mise à jour
 */
export function updateQuestion(id, updateData) {
  const body = {};
  if (updateData.text !== undefined) body.text = updateData.text;
  if (updateData.difficulty !== undefined)
    body.difficulty = updateData.difficulty;
  if (updateData.explanation !== undefined)
    body.explanation = updateData.explanation;
  if (updateData.categoryId !== undefined)
    body.categoryId = updateData.categoryId;
  if (updateData.tags !== undefined) body.tags = updateData.tags;

  return apiFetch(`/api/questions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteQuestion(id) {
  return apiFetch(`/api/questions/${id}`, { method: 'DELETE' });
}

export function getQuestionsCount(filters = {}) {
  const categorySlug = filters.categorySlug;
  const tagSlug = filters.tagSlug || 'all';
  const difficulty = filters.difficulty;
  const s = `/api/categories/${categorySlug}/${tagSlug}/${difficulty}`;
  console.log('Sent :', s);
  return apiFetch(s, {
    method: 'GET',
  });
}

