import { apiFetch } from "./api";

export function getAllQuizs() {
    return (
        apiFetch(`/api/quizzes`, {method : 'GET'})
    );
}

export function getAllCategories() {
    return (
        apiFetch('/api/categories', {method : 'GET'})
    );
}

export function getQuizById(id) {
    return (
        apiFetch(`/api/quizzes/${id}`, {method : 'GET'})
    );
}

export function CreateQuiz(title,description) {
    return (
        apiFetch('/api/quizzes', {
            method: 'POST',
            body: JSON.stringify({title:title, description:description}),
        })
    );
}

export async function startCustomQuiz(params) {
    return (
        apiFetch('/api/attempts', {
            method: 'POST',
            body: JSON.stringify(params),
        })
    );
}

export async function getAttempt(attemptId) {
    return (
        apiFetch(`/api/attempts/${attemptId}`, {
            method: 'GET',
        })
    );
}

export async function submitAnswer(attemptId, answerId) {
    return (
        apiFetch (`/api/attempts/${attemptId}/answers`, {
            method: 'POST',
            body: JSON.stringify({answerId}),
        })
    );
}