import { useState } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { ChangePasswordForm } from './AccountPassword.jsx';
import { EditableField } from '../Components/EditableField';
import { Avatar } from '../Components/Avatar';
import styles from './Styling/Account.module.css';
import { AvatarUploader } from '../Components/AvatarUploader.jsx';
import { StyledButton } from '../Components/Buttons.jsx';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountProfile() {
  const { user, logout, updateProfile, uploadAvatar } = useAuth();
  const [mode, setMode] = useState('view'); //Switch between view edit password ...

  switch (mode) {
    case 'edit':
      return (
        <>
          <AvatarUploader user={user} uploadAvatar={uploadAvatar} />
          <label>Username :{user.username}</label>
          <EditableField
            label="Email :"
            value={user.email}
            placeholder="Email"
            validate={v => (!emailRegex.test(v) ? 'Invalid email' : null)}
            onSave={v => updateProfile({ email: v.toLowerCase() })}
          ></EditableField>
          <EditableField
            label="DisplayName :"
            value={user.display_name}
            placeholder="DisplayName"
            validate={v => (v.length === 0 ? 'Invalid display name' : null)}
            onSave={v => updateProfile({ display_name: v })}
          ></EditableField>
          <div className={styles.spacer} />
          <section className={styles.bottom_bar}>
            <button onClick={() => setMode('view')}>Cancel</button>
          </section>
        </>
      );

    case 'password':
      return <ChangePasswordForm onDone={() => setMode('view')} />;

    default:
      return (
        <>
          <Avatar
            src={user.avatar_url}
            username={user.display_name}
            size={60}
          />
          <label>Email : {user.email}</label>
          <label>Username : {user.username}</label>
          <label>DisplayName : {user.display_name}</label>
          <div className={styles.spacer} />
          {/* <label>Avatar url:{user.avatar_url}</label> */}
          <section className={styles.bottom_bar}>
            <StyledButton onClick={() => setMode('edit')}>
              Edit profile
            </StyledButton>
            <StyledButton onClick={() => setMode('password')}>
              Change password
            </StyledButton>
            <StyledButton onClick={() => logout()} variant="danger">
              Log out
            </StyledButton>
          </section>
        </>
      );
  }
}
