//pas oublier de creer le .env dans le root du dossier (il est git excluded)
const API_URL = import.meta.env.VITE_API_URL;

//fetch wrapper w/ cookie include 🍪
export async function apiFetch(endpoint, options = {}){
    const res = await fetch(`${API_URL}${endpoint}`, {credentials: 'include', headers: {'Content-Type': 'application/json', ...options.headers}, ...options});

    if(!res.ok) {
        //catch error to empty function
        const error = await res.json().catch(() => ({}));
        throw{ status: res.status, ...error};
    }

    return res.status !== 204 ? res.json() : null;
}