import { PageContainer } from '../Components/Containers';
import { useSocket } from './SocketProvider';
import { useEffect, useState } from 'react';

export function Chat() {
  const { send, on, off } = useSocket();
  const [messages, setMessages] = useState([]);

  // 👇👇👇 ICI TU CRÉES LE HANDLER 👇👇👇
  useEffect(() => {
    // 🔥 TU DÉFINIS TA FONCTION (c'est ça, un handler !)
    const monHandler = (data) => {
      console.log("J'ai reçu un message !", data.text);
      setMessages(prev => [...prev, data.text]); // Ajoute le message à la liste
    };

    // 🔥 TU DONNES TA FONCTION au SocketProvider
    on('chat', monHandler); // <-- "Quand tu reçois 'chat', appelle monHandler !"

    // 🧹 Nettoyage : retire ta fonction quand le composant disparaît
    return () => off('chat', monHandler);
  }, [on, off]);

  // 👇 Fonction pour envoyer un message (pas un handler, juste un bouton)
  const envoyerMessage = () => {
    send('chat', { text: 'Hello les potes !' });
  };

  return (
    <PageContainer>
    <div>
      <button className="!border-2 p-5" onClick={envoyerMessage}>Envoyer</button>
      <div>
        {messages.map((msg, i) => <p key={i}>{msg}</p>)}
      </div>
    </div>
    </PageContainer>
  );
}