import { useRef, useState } from 'react';
import { Avatar } from '../Components/Avatar';

const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp'];

export function AvatarUploader({ user, uploadAvatar }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onChange = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED.includes(file.type))
      return setError('PNG, JPEG ou WebP uniquement');
    if (file.size > MAX_SIZE) return setError('Fichier trop gros (2 Mo max)');

    setError(null);
    setBusy(true);
    try {
      await uploadAvatar(file);
    } catch {
      setError("L'upload a échoué");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Avatar src={user.avatar_url} username={user.display_name} size={60} />
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onChange}
        hidden
      />
      <button onClick={() => inputRef.current.click()} disabled={busy}>
        {busy ? 'Envoi…' : 'Change avatar'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
