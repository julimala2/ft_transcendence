import { apiFetch } from "./api";

export function getAllQuizs() {
    return (
        apiFetch(`/api/quiz`, {method : 'GET'})
    );
}

export function getQuizById(id) {
    return (
        apiFetch(`/quiz/${id}`, {method : 'GET'})
    );
}

export function CreateQuiz(title,description) {
    return (
        apiFetch('/api/quiz', {
            method: 'POST',
            body: JSON.stringify({title:title, description:description}),
        })
    );
}