import { useNavigate, useParams } from 'react-router-dom';
import { CardContainer, MainContainer, PageContainer} from "../../Components/Containers";
import { useSocket } from '../../Hooks/SocketProvider';
import { useState, useEffect, useRef } from 'react';
import { StyledButton } from '../../Components/Buttons';
import { StyledInput } from '../../Components/Inputs';
import { useAuth } from '../../Hooks/useAuth';
import { CategorySelector } from './CategorySelector';

//TODO : -Empecher l'envoi d'un message vide DONE
// -Recuperer les messages avec roomInfo et les afficher DONE
// -Formatter le chat (user / message) DONE
// -Invitation de debut de quizz
// -If user not connected, open a modal to ask him to connect
// -Fix memberList



export function OnlineRoom(){
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { send, on, off, connected} = useSocket();
    const [messages, setMessages] = useState([]);
    const [oldMessages,setOldMessages] = useState([]);
    const [newMsg,setNewMsg] = useState('');
    const [profile,setProfile] = useState(null);
    const { user, loading } = useAuth();
    const [error,setError] = useState(false);
    const messagesEndRef = useRef(null);
    const [members, setMembers] = useState([]);

    // Quit too fast before user has time to load
    // if(!user)
    //     navigate("/");

    useEffect(() => {
        if(!connected) return;
        send('wsProfile');
        send('roomInfo',{roomId: roomId});
        
        const handleProfile = (data) => {
            setProfile(data);
        }

        const newMessage = (data) => {
            if(!data)
            {
                console.log("error msg");
                return;
            }
            if(!data.type){
                console.log("error msg",data);
                return;
            }
            setMessages(prev => [...prev, data]);
            if (data.type === 'hasJoined' || data.type === 'player_left') {
                getInfo();
            }
        }

        const handleError = (data) => {
            setError(true);
        }

        const handleInfo = (data) => {
            setOldMessages(data.messages);
            setMembers(data.members);
            setMessages([]);
        }

        const handleEndVote = (data) => {
            console.log('endvote');
            setMessages(prev => [...prev,data.category]);
        }

        on('chat',newMessage);
        on('profile',handleProfile);
        on('errorRoom',handleError);
        on('roomInfo',handleInfo);
        on('endVote',handleEndVote);
        return () => {
            off('chat', newMessage);
            off('profile', handleProfile);
            off('errorRoom',handleError);
            off('roomInfo',handleInfo);
            off('endVote',handleEndVote);
            send('leaveRoom');
        };
    },[on,off, send]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, oldMessages]);

    useEffect(() => {
        if (profile && roomId && roomId !== profile.CurrentRoom) {
            console.log("🔹 joinRoom envoyé pour:", roomId);
            send('joinRoom', { roomId });
        }
    }, [profile, roomId, send]);

    const sendMessage = () => {
        send('chat', {text: newMsg});
        setNewMsg('');
    }

    const getInfo = () => {
        send('roomInfo',{roomId: roomId});
    }


    return (
        <MainContainer>
            <PageContainer>
                {error ? (
                    <>
                        <p>Error: Room doesn't exist.</p>
                        <StyledButton onClick={() => navigate("/quiz/online/")}>Back to menu</StyledButton>
                    </>
                ) : (
                    <div className="flex flex-row w-2/3 h-[calc(100vh-400px)] gap-2">
                        <div className="flex flex-col gap-2 w-1/3 h-full">
                            <div className="bg-gray-900 h-full p-6 rounded-xl w-full border-2 flex-col flex gap-2 items-center overflow-y-auto">
                                <p className="text-white text-xl font-bold">RoomID: {roomId}</p>
                                <CategorySelector />
                                <StyledButton onClick={() => send('quiz', { type:'proposeQuiz',categoryId:2,count:10 })}>Test Quiz start</StyledButton>
                                <StyledButton onClick={() => send('quiz', { type:'proposeQuiz',categoryId:5,count:25 })}>Test Quiz start</StyledButton>

                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-2/3 h-full">
                            <div className="flex flex-row gap-2 h-[calc(100%-50px)]">
                                <div className="flex flex-col gap-2 bg-gray-900 p-6 rounded-xl w-full border-2 flex-1 min-h-0 overflow-y-auto">
                                    {oldMessages && oldMessages.length > 0 && (
                                        oldMessages.map((msg, index) => {
                                            if(!msg || !msg.type) return null;
                                            if (msg.type === 'chat') return <p key={index} className="text-white text-xl font-bold">{msg.user} - {msg.text}</p>;
                                            if (msg.type === 'hasJoined') return <p key={index} className="text-green-500 text-xl font-bold">{msg.user} has joined the room.</p>;
                                            if (msg.type === 'player_left') return <p key={index} className="text-red-500 text-xl font-bold">{msg.user} has left the room.</p>;
                                            if (msg.type === 'endVote') return <p key={index}>{msg.category} vote ended</p>
                                            return null; 
                                        })
                                    )}
                                    {messages && messages.length > 0 && (
                                        messages.map((msg, index) => {
                                            if(!msg || !msg.type) return null;
                                            if (msg.type === 'chat') return <p key={index} className="text-white text-xl font-bold">{msg.user} - {msg.text}</p>;
                                            if (msg.type === 'hasJoined') return <p key={index} className="text-green-500 text-xl font-bold">{msg.user} has joined the room.</p>;
                                            if (msg.type === 'player_left') return <p key={index} className="text-red-500 text-xl font-bold">{msg.user} has left the room.</p>;
                                            if (msg.type === 'endVote') return <p key={index}>{msg.category} vote ended</p>
                                            return null; 
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="bg-gray-900 flex flex-col w-50 border-2 rounded-xl p-4 gap-2 h-full">
                                    <h3 className="text-white text-xl font-bold">Members</h3>
                                    <ul>
                                        {members.map((member, index) => (
                                            <li key={index} className="text-gray-300">
                                                -- {member.user}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <form className="flex flex-row w-full gap-2 justify-between h-[50px]" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                                <StyledInput onChange={e => setNewMsg(e.target.value)} value={newMsg} placeholder="Votre message..."></StyledInput>
                                <StyledButton type="submit">Envoyer</StyledButton>
                            </form>
                        </div>
                    </div>
                    )
                }
            </PageContainer>
        </MainContainer>
    )
}