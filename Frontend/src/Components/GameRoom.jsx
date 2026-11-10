import { useState } from 'react';

import { useParams } from 'react-router-dom';

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
      <div className="text-center mt-[50px]">
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
    <div className="w-full max-w-[600px] mx-auto border border-gray-200 rounded-lg flex flex-col h-[500px] bg-gray-50">
      {/* Status */}
      <div className="p-2.5 text-center text-sm font-semibold border-b border-gray-200">
        {connected ? (
          <span className="text-green-500">🟢 Connecté</span>
        ) : (
          <span className="text-red-500">🔴 Déconnecté</span>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-auto p-3.5 flex flex-col">
        <div className="flex flex-col gap-2.5">
          {messages.map((msg, idx) => (
            <div key={idx} className="bg-white p-2.5 rounded-lg border-l-4 border-blue-500 shadow-sm">
              <strong className="text-blue-500 text-sm mr-1.5">{msg.user}</strong>
              <p className="mt-1 text-gray-700 text-base">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2.5 p-3.5 border-t border-gray-200 bg-white">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Envoie un message..."
          disabled={!connected}
          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-md text-sm"
        />
        <button
          onClick={handleSendMessage}
          disabled={!connected}
          className="px-5 py-2.5 bg-blue-500 text-white border-none rounded-md cursor-pointer font-semibold text-sm"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

