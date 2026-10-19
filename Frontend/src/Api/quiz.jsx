import { apiFetch } from "./api";

// ============================================
// QUIZ ROUTES
// ============================================

/**
 * Récupère tous les quizs visibles par l'utilisateur
 * @param {Object} filters - Filtres optionnels
 * @param {boolean} filters.mine - true pour voir uniquement ses quizs
 * @returns {Promise<Array>} Liste des quizs
 */
export function getAllQuizs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.mine !== undefined) params.append('mine', filters.mine);
    const queryString = params.toString();
    return apiFetch(`/api/quizzes${queryString ? '?' + queryString : ''}`, { method: 'GET' });
}

/**
 * Récupère un quiz par son ID
 * @param {number} id - ID du quiz
 * @returns {Promise<Object>} Quiz avec ses questions
 */
export function getQuizById(id) {
    return apiFetch(`/api/quizzes/${id}`, { method: 'GET' });
}

/**
 * Crée un nouveau quiz (SANS les questions)
 * @param {string} title - Titre obligatoire
 * @param {string} [description] - Description optionnelle
 * @param {string} [visibility] - 'public' | 'friends' | 'private' (défaut: 'private')
 * @returns {Promise<Object>} Quiz créé
 */
export function createQuiz(title, description = null, visibility = 'private') {
    const body = { title };
    if (description !== null) body.description = description;
    if (visibility !== 'private') body.visibility = visibility;
    
    return apiFetch('/api/quizzes', {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * Met à jour un quiz (PATCH, pas PUT !)
 * @param {number} id - ID du quiz
 * @param {string} [title] - Nouveau titre
 * @param {string} [description] - Nouvelle description (null pour supprimer)
 * @param {string} [visibility] - Nouvelle visibilité
 * @returns {Promise<Object>} Quiz mis à jour
 */
export function updateQuiz(id, title = undefined, description = undefined, visibility = undefined) {
    const body = {};
    if (title !== undefined) body.title = title;
    if (description !== undefined) body.description = description;
    if (visibility !== undefined) body.visibility = visibility;
    
    // ⚠️ PATCH, pas PUT ! Le backend n'a pas de route PUT
    return apiFetch(`/api/quizzes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
}

/**
 * Supprime un quiz
 * @param {number} id - ID du quiz
 * @returns {Promise<void>}
 */
export function deleteQuiz(id) {
    return apiFetch(`/api/quizzes/${id}`, { method: 'DELETE' });
}


// ============================================
// QUIZ QUESTION ROUTES (Gestion des questions dans un quiz)
// ============================================

/**
 * Marche pas !!
 * Récupère toutes les questions d'un quiz
 * @param {number} quizId - ID du quiz
 * @returns {Promise<Array>} Liste des questions du quiz
 */
export function getQuizQuestions(quizId) {
    return apiFetch(`/api/quizzes/${quizId}/questions`, { method: 'GET' });
}

/**
 * Ajoute une question existante à un quiz
 * @param {number} quizId - ID du quiz
 * @param {number} questionId - ID de la question à ajouter
 * @returns {Promise<Object>} Quiz mis à jour
 */
export function addQuestionToQuiz(quizId, questionId) {
    return apiFetch(`/api/quizzes/${quizId}/questions`, {
        method: 'POST',
        body: JSON.stringify({ questionId }),
    });
}

/**
 * Retire une question d'un quiz
 * @param {number} quizId - ID du quiz
 * @param {number} questionId - ID de la question à retirer
 * @returns {Promise<void>}
 */
export function removeQuestionFromQuiz(quizId, questionId) {
    return apiFetch(`/api/quizzes/${quizId}/questions/${questionId}`, {
        method: 'DELETE',
    });
}


// ============================================
// ATTEMPT ROUTES (Tentatives de quiz)
// ============================================

/**
 * Démarre une tentative de quiz personnalisée
 * @param {Object} params - Paramètres de la tentative
 * @returns {Promise<Object>} Tentative créée
 */
export async function startCustomQuiz(params) {
    return apiFetch('/api/attempts', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

/**
 * Récupère une tentative par son ID
 * @param {number} attemptId - ID de la tentative
 * @returns {Promise<Object>} Détails de la tentative
 */
export async function getAttempt(attemptId) {
    return apiFetch(`/api/attempts/${attemptId}`, {
        method: 'GET',
    });
}

/**
 * Soumet une réponse à une tentative
 * @param {number} attemptId - ID de la tentative
 * @param {number} answerId - ID de la réponse
 * @returns {Promise<Object>} Résultat de la soumission
 */
export async function submitAnswer(attemptId, answerId) {
    return apiFetch(`/api/attempts/${attemptId}/answers`, {
        method: 'POST',
        body: JSON.stringify({ answerId }),
    });
}


// ============================================
// CATEGORY ROUTES
// ============================================

/**
 * Récupère toutes les catégories
 * @returns {Promise<Array>} Liste des catégories
 */
export function getAllCategories() {
    return apiFetch('/api/categories', { method: 'GET' });
}
