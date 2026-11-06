import { StyledDiv } from "../../Components/Containers";
import { StyledInput } from "../../Components/Inputs";
import { StyledButton } from "../../Components/Buttons";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "../../Components/Avatar";


export function ChatPanel ({messages,sendMessage,roomId,members}){
    const messagesEndRef = useRef(null);
    const [newMsg,setNewMsg] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const text = newMsg.trim();
        if(!text) return;
        sendMessage(text);
        setNewMsg('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    return (  
        <div className="relative w-full h-full flex flex-col gap-3">
            <StyledDiv outerClassName="relative w-full h-full" className="flex-2 h-full flex-col gap-2 p-4 overflow-y-scroll justify-start">
                {messages && messages.length > 0 && (
                    messages.map((msg, index) => {
                        if (!msg || !msg.type) return null;
                        if (msg.type === 'chat') return <p key={index} className="text-white text-xl font-bold">{msg.user} - {msg.text}</p>;
                        if (msg.type === 'hasJoined') return <p key={index} className="text-green-700 text-sl">{msg.user} a rejoint la room {roomId}.</p>;
                        if (msg.type === 'player_left') return <p key={index} className="text-red-700 text-sl">{msg.user} a quitté la room {roomId}.</p>;
                        return null; 
                    })
                )}
                <div ref={messagesEndRef} />
            </StyledDiv>

            <div className="absolute top-2 right-2 max-h-[calc(100%-1rem)] border-amber-500 overflow-y-auto bg-slate-900 bg-opacity-60 border-2 rounded-xl p-2 gap-2 z-10"> 
                <ul>
                    {members.map((member, index) => (
                        <li key={index} className="text-gray-300 flex flex-row items-center gap-2">
                            <Avatar src={member.avatar} username={member.user} size={20}/>
                             {member.user}
                        </li>
                    ))}
                </ul>
            </div>
        <form className="flex flex-row w-full gap-2 justify-between" onSubmit={handleSubmit}>
            <StyledInput onChange={e => setNewMsg(e.target.value)} value={newMsg} placeholder="Votre message..."></StyledInput>
            <StyledButton type="submit">Envoyer</StyledButton>
        </form>
    </div>
    );
}