import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../Api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const me = await apiFetch('/api/users/me');
      setUser(me);
    } catch (err) {
      if (err.status !== 401) {
        console.error(err);
      }
      setUser(null);
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data);
    return data;
  }

  async function logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  function loginWithOAuth() {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/oauth/42`;
  }

  async function register(email, password, username) {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
    setUser(data);
    return data;
  }

  async function changePassword(currentPassword, newPassword) {
    return await apiFetch('/api/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  async function updateProfile(data) {
    const updated = await apiFetch('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    setUser(updated);
    return updated;
  }

  async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const updated = await apiFetch('/api/users/me/avatar', {
      method: 'POST',
      body: formData,
    });

    // Si le backend retourne une URL relative, on la transforme en absolue
    if (updated.avatar_url && !updated.avatar_url.startsWith('http')) {
      updated.avatar_url = `${import.meta.env.VITE_API_URL}${updated.avatar_url}`;
    }

    setUser(updated);
    return updated;
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithOAuth,
    refreshUser,
    changePassword,
    updateProfile,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
