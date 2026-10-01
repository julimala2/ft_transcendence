const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
    const { headers: extraHeaders, ...rest } = options;
    const isFormData = rest.body instanceof FormData;

    const res = await fetch(`${API_URL}${endpoint}`, {
        credentials: 'include',
        ...rest,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...extraHeaders,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw { status: res.status, ...error };
    }

    return res.status !== 204 ? res.json() : null;
}
