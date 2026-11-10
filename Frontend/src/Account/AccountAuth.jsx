//Authentification widget containing both login and register + 42auth
//only use that (not loginForm/register etc...)

import { useState } from 'react';
import { motion } from "motion/react";
import { useAuth } from '../Hooks/useAuth';
import { StyledInput } from '../Components/Inputs'
import { StyledButton } from '../Components/Buttons'

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
    <form onSubmit={handleSubmit} className="w-full gap-5 flex flex-col items-center">
      <p className="text-2xl font-bold">Se connecter</p>
      <StyledInput 
        type="email"
        value={email}
        label="E-mail :"
        onChange={e => setEmail(e.target.value)}/>
      <StyledInput
        type="password"
        value={password}
        label="Mot de passe :"
        onChange={e => setPassword(e.target.value)}/>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <StyledButton type="submit" disabled={isSubmitting}> 
        {isSubmitting ? 'Chargement...' : 'Se connecter'}
        </StyledButton>
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
    <form onSubmit={handleSubmit} className="w-full gap-5 flex flex-col items-center">
      <p className="text-2xl font-bold">S'inscrire :</p>
      <div>
        <StyledInput
          id="email"
          type="email"
          label="E-mail :"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <StyledInput
          id="username"
          type="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          label="Pseudo :"
          required
        />
      </div>
      <div>
        <StyledInput
          id="password"
          type="password"
          label="Mot de passe :"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <StyledButton
        type="submit"
        disabled={isSubmitting}
        variant="success"
      >
        {isSubmitting ? 'En cours...' : `S'inscrire`}
      </StyledButton>
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
    <motion.div layout className="p-10 w-full gap-7 flex flex-col items-center">
      {renderForm()}
    <div className="flex flex-row gap-5">
      {mode === 'login' ? (
        <StyledButton variant="success" onClick={() => setMode('register')}>S'inscrire</StyledButton>
      ) : (
        <StyledButton onClick={() => setMode('login')}>Se connecter</StyledButton>
      )}
      <StyledButton variant="secondary" onClick={() => loginWithOAuth()}>Se connecter via 42</StyledButton>
      </div>
    </motion.div>
  );
}
