import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { useGameSocket } from '../Hooks/useGameSocket';

export function GameRoom({ roomId: roomIdProp }) {
  const { user } = useAuth();
  const { roomId: roomIdParam } = useParams();
  const roomId = roomIdProp ?? roomIdParam;
  const { connected, messages, sendChat } = useGameSocket(roomId);
  const [inputText, setInputText] = useState('');
  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Vous devez être connecté pour accéder à cette page.</h2>
        <p>Veuillez vous connecter pour rejoindre le salon de jeu.</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendChat(inputText);
      setInputText('');
    }
  };

  return (
    <div style={styles.container}>
      {/* Status */}
      <div style={styles.status}>
        {connected ? (
          <span style={{ color: '#10b981' }}>🟢 Connecté</span>
        ) : (
          <span style={{ color: '#ef4444' }}>🔴 Déconnecté</span>
        )}
      </div>

      {/* Chat */}
      <div style={styles.chatBox}>
        <div style={styles.messagesList}>
          {messages.map((msg, idx) => (
            <div key={idx} style={styles.messageBubble}>
              <strong style={styles.username}>{msg.user}</strong>
              <p style={styles.text}>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Envoie un message..."
          disabled={!connected}
          style={styles.input}
        />
        <button
          onClick={handleSendMessage}
          disabled={!connected}
          style={styles.button}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    background: '#f9fafb',
  },
  status: {
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '1px solid #e5e7eb',
  },
  chatBox: {
    flex: 1,
    overflow: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageBubble: {
    background: 'white',
    padding: '10px 15px',
    borderRadius: '8px',
    borderLeft: '3px solid #3b82f6',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  username: {
    color: '#3b82f6',
    fontSize: '14px',
    marginRight: '5px',
  },
  text: {
    margin: '5px 0 0 0',
    color: '#374151',
    fontSize: '15px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    borderTop: '1px solid #e5e7eb',
    background: 'white',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  button: {
    padding: '10px 20px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
};
