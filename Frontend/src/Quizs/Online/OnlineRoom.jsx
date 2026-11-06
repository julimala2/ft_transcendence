import { useNavigate, useParams } from 'react-router-dom';
import { CardContainer, MainContainer, PageContainer, StyledDiv} from "../../Components/Containers";
import { useSocket } from '../../Hooks/SocketProvider';
import { useState, useEffect, useRef } from 'react';
import { StyledButton } from '../../Components/Buttons';
import { StyledInput } from '../../Components/Inputs';
import { useAuth } from '../../Hooks/useAuth';
import MouseTracker from '../../Components/MouseTracker';
import { Cursor } from '../../Components/Cursor';
import { QuizPanel } from './QuizPanel';
import { ChatPanel } from './ChatPanel';

//TODO : -Empecher l'envoi d'un message vide DONE
// -Recuperer les messages avec roomInfo et les afficher DONE
// -Formatter le chat (user / message) DONE
// -Invitation de debut de quizz
// -If user not connected, open a modal to ask him to connect
// -Fix memberList
// Normaliser la recup des anciens messages
// Actuellemente le front recup tout une array de messages
// Il faudrait 

//TODO DESIGN: -Mode quizz avec + grande fenetre
// - Mode responsive phone



export function OnlineRoom(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { roomId } = useParams();
    const { send, on, off, connected} = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMsg,setNewMsg] = useState('');
    const [profile,setProfile] = useState(null);
    const { user } = useAuth();
    const [error,setError] = useState(false);
    const [members, setMembers] = useState([]);
    const [gameState,setGameState] = useState();
    const [mousePosition,setMousePosition] = useState({});
    const [cursors, setCursors] = useState({});

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
            setMessages(data.messages);
            setMembers(data.members);
        }

        const handleEndVote = (data) => {
            setMessages(prev => [...prev, data]);
        }

        const handleRoomJoined = () => {
            getInfo();
        }

        const handleGameState = (data) => {
            if(!data || data.type == "noGameState"){
                setGameState(null);
            }
            else{
                setGameState(data);
            }
        }

        const handleMousePosition = (data) => {
            setCursors((prev) => ({
                ...prev,
                [data.username]: {username: data.user, x: data.x, y:data.y},
            }));
        };

        on('chat',newMessage);
        on('profile',handleProfile);
        on('errorRoom',handleError);
        on('roomInfo',handleInfo);
        on('endVote',handleEndVote);
        on('roomJoined',handleRoomJoined);
        on('gameState',handleGameState);
        on('mousePosition',handleMousePosition);
        return () => {
            off('chat', newMessage);
            off('mousePosition',handleMousePosition);
            off('profile', handleProfile);
            off('errorRoom',handleError);
            off('roomInfo',handleInfo);
            off('endVote',handleEndVote);
            off('roomJoined',handleRoomJoined);
            off('gameState', handleGameState);
            send('leaveRoom');
        };
    },[on,off, send]);

    useEffect(() => {
       
    }, [profile]);



    useEffect(() => {
        if (profile && roomId && roomId !== profile.CurrentRoom) {
            send('joinRoom', { roomId });
            send('quiz', {type : "requestGameState"});
        }
    }, [profile, roomId, send]);

    useEffect(() => {
        send('mousePosition',{x: mousePosition.x, y: mousePosition.y});
    },[mousePosition]);

    const sendMessage = (text) => {
        send('chat', {text});
    }

    const getInfo = () => {
        send('roomInfo',{roomId: roomId});
    }

    return (
        <MainContainer>
            <MouseTracker mouseChange={setMousePosition}/>
            {Object.entries(cursors).map(([username,pos]) => (
                <Cursor key={username} username={pos.username} x={pos.x} y={pos.y} />
            ))}
            <PageContainer>
                {error ? (
                    <>
                        <p>Error: Room doesn't exist.</p>
                        <StyledButton onClick={() => navigate("/quiz/online/")}>Back to menu</StyledButton>
                    </>
                    ) : ( 
                    <>
                        <div className="flex flex-col h-full w-full justify-center items-center gap-3">
                            <StyledDiv outerClassName='max-w-50' className='flex flex-row gap-3'>
                                <p className="text-white text-xl font-bold">{roomId}</p>
                                <button onClick={() => {navigator.clipboard.writeText(roomId)}}>📄</button>
                            </StyledDiv>
                            <div className="flex md:flex-row flex-col w-full h-full gap-3">
                                <QuizPanel gameState={gameState} send={send}/>
                                <ChatPanel messages={messages} sendMessage={sendMessage} roomId={roomId} members={members}/>
                            </div>
                        </div>
                    </>
                    )
                }
            </PageContainer>
        </MainContainer>
    )
}