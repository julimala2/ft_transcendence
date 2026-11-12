import { useState } from 'react';

import { ChangePasswordForm } from './AccountPassword.jsx';
import { Avatar } from '../Components/Avatar';
import { AvatarUploader } from '../Components/AvatarUploader.jsx';
import { EditableField } from '../Components/EditableField';
import { StyledButton } from '../Components/Buttons.jsx';
import { useAuth } from '../Hooks/useAuth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountProfile() {
  const { user, logout, updateProfile, uploadAvatar } = useAuth();
  const [mode, setMode] = useState('view'); //Switch between view edit password ...

  switch (mode) {
    case 'edit':
      return (
        <div className="flex flex-1 min-h-0 overflow-y-auto flex-col">
          <div className='flex p-2 items-center flex-col gap-3'>
          <AvatarUploader user={user} uploadAvatar={uploadAvatar} />
          <label className='text-xl font-bold'>Username :{user.username}</label>
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
          <div className="h-full" />
          <section className="flex justify-end gap-3">
            <StyledButton onClick={() => setMode('view')}>Retour</StyledButton>
          </section>
        </div>
        </div>
      );

    case 'password':
      return <ChangePasswordForm onDone={() => setMode('view')} />;

    default:
      return (
        <div className="flex flex-1 min-h-0 overflow-y-auto flex-col">
          <div className='flex p-2 items-center flex-col gap-3'>

          <Avatar
            src={user.avatar_url}
            username={user.display_name}
            size={100}
            />
          <label className='text-xl font-bold'>Email : {user.email}</label>
          <label className='text-xl font-bold'>Nom d'utilisateur : {user.username}</label>
          <label className='text-xl font-bold'>Pseudo : {user.display_name}</label>
          </div>
          <div className='flex flex-1'/>
          <section className="flex md:flex-row flex-col gap-3 justify-end">
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
        </div>
      );
  }
}
