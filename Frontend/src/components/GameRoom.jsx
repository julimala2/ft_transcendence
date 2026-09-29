import { useState } from 'react';
import { useGameSocket } from '../hooks/useGameSocket';

export function GameRoom({ roomId }) {
  const { connected, messages, sendChat } = useGameSocket(roomId);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendChat(inputText);
      setInputText('');
    }
  };

  return (
    <div className="game-room">
      <div className="status">
        {connected ? (
          <span style={{ color: 'green' }}>● Connecté</span>
        ) : (
          <span style={{ color: 'red' }}>● Déconnecté</span>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Envoie un message..."
          disabled={!connected}
        />
        <button onClick={handleSendMessage} disabled={!connected}>
          Envoyer
        </button>
      </div>
    </div>
  );
}
