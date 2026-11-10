import { StyledDiv } from "../../Components/Containers";
import { StyledInput } from "../../Components/Inputs";
import { StyledButton } from "../../Components/Buttons";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "../../Components/Avatar";


export function ChatPanel({ messages, sendMessage, roomId, members, className }) {
  const messagesEndRef = useRef(null);
  const [newMsg, setNewMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = newMsg.trim();
    if (!text) return;
    sendMessage(text);
    setNewMsg('');
  };

  // on scrolle le parent direct du sentinel (la liste), jamais les ancêtres
  useEffect(() => {
    const list = messagesEndRef.current?.parentElement;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`relative w-1/3 flex flex-col min-h-0 gap-3 ${className}`}>

      {/* zone bornée : sa taille ne dépend pas du contenu */}
      <div className="relative flex-1 min-h-0 w-full">
        <StyledDiv
          outerClassName="absolute inset-0"
          className="h-full flex flex-col gap-2 p-4 overflow-y-auto justify-start"
        >
          {messages?.map((msg, index) => {
            if (!msg?.type) return null;
            if (msg.type === 'chat') return <p key={index} className="text-white text-xl font-bold break-words">{msg.user} - {msg.text}</p>;
            if (msg.type === 'hasJoined') return <p key={index} className="text-green-700">{msg.user} a rejoint la room {roomId}.</p>;
            if (msg.type === 'player_left') return <p key={index} className="text-red-700">{msg.user} a quitté la room {roomId}.</p>;
            return null;
          })}
          <div ref={messagesEndRef} />
        </StyledDiv>

        {/* overlay membres, inchangé */}
        <div className="absolute top-2 right-2 max-h-[calc(100%-1rem)] overflow-y-auto bg-slate-900/60 border-2 border-amber-500 rounded-xl p-2 z-10">
          <ul>
            {members.map((member, index) => (
              <li key={index} className="text-gray-300 flex items-center gap-2">
                <Avatar src={member.avatar} username={member.user} size={20} />
                {member.user}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form className="flex flex-row w-full gap-2 justify-between shrink-0" onSubmit={handleSubmit}>
        <StyledInput onChange={e => setNewMsg(e.target.value)} value={newMsg} placeholder="Votre message..." />
        <StyledButton type="submit">Envoyer</StyledButton>
      </form>
    </div>
  );
}