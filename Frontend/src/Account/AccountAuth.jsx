//Authentification widget containing both login and register + 42auth
//only use that (not loginForm/register etc...)

import { useState } from 'react';

import { useAuth } from '../Hooks/useAuth';
import styles from './Styling/Account.module.css';

// Validation functions
export function validatePassword(password) {
  const specialCharsRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  if (password.length < 8) {
    throw { error: 'Password must be 8 characters or more.' };
  }
  if (!/[A-Z]/.test(password)) {
    throw { error: 'Password must contain a uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    throw { error: 'Password must contain a lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    throw { error: 'Password must contain a number.' };
  }
  if (!specialCharsRegex.test(password)) {
    throw { error: 'Password must contain a special character.' };
  }
}

function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw { error: 'Invalid Email.' };
  }
}

// Login Form Component
function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.error || 'Error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.login}>
      <h1>Compte</h1>
      <div>
        <label htmlFor="email">Email :</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password :</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Chargement...' : 'Se connecter'}
      </button>
    </form>
  );
}

// Register Form Component
function RegisterForm() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      validateEmail(email);
      validatePassword(password);
      await register(email, password, username);
    } catch (err) {
      setError(err.error || 'Error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Sign up</label>
      <div>
        <label htmlFor="email">Email :</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="username">Username :</label>
        <input
          id="username"
          type="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password :</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className={isSubmitting ? styles.disabled : styles.button}
      >
        {isSubmitting ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  );
}

// Main Auth Component
export function AccountAuth() {
  const { loginWithOAuth } = useAuth();
  const [mode, setMode] = useState('login'); //switch login/register

  function renderForm() {
    switch (mode) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      default:
        return <LoginForm />;
    }
  }

  return (
    <div className={styles.loginContainer}>
      {renderForm()}
      {mode === 'login' ? (
        <button onClick={() => setMode('register')}>S'inscrire</button>
      ) : (
        <button onClick={() => setMode('login')}>Se connecter</button>
      )}
      <button onClick={() => loginWithOAuth()}>Se connecter via 42</button>
    </div>
  );
}
