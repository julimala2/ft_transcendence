import { useState } from 'react';

import { validatePassword } from './AccountAuth';
import { StyledButton } from '../Components/Buttons';
import { useAuth } from '../Hooks/useAuth';
import styles from './Styling/Account.module.css';

export function ChangePasswordForm({ onDone }) {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    if (newPassword !== confirmPassword) {
      throw { error: 'Both password do not match.' };
    }
    if (newPassword === oldPassword) {
      throw { error: 'New password must be different.' };
    }
    validatePassword(newPassword);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      validate();
      await changePassword(oldPassword, newPassword);

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
      setTimeout(() => onDone?.(), 5000);
    } catch (err) {
      setError(err.error || 'Error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Changing password</label>

      <div>
        <label htmlFor="oldPassword">Mot de passe actuel:</label>
        <input
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="newPassword">Nouveau mot de passe :</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirmez mot de passe :</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'lightgreen' }}>Mot de passe changé ✓</p>}
      <div className={styles.spacer} />
      <section className={styles.bottom_bar}>
        <StyledButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing ...' : 'Confirm'}
        </StyledButton>

        <StyledButton
          type="button"
          variant="secondary"
          onClick={onDone}
          disabled={isSubmitting}
        >
          Cancel
        </StyledButton>
      </section>
    </form>
  );
}
