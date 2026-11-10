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
    const [time,setTime] = useState(0);
    const [profile,setProfile] = useState(null);
    const { user } = useAuth();
    const [tab, setTab] = useState('quiz'); //quiz | chat | members
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

        const handleTime= (data) => {
            setTime(data);
        }

        on('chat',newMessage);
        on('profile',handleProfile);
        on('errorRoom',handleError);
        on('roomInfo',handleInfo);
        on('endVote',handleEndVote);
        on('roomJoined',handleRoomJoined);
        on('gameState',handleGameState);
        on('mousePosition',handleMousePosition);
        on('time',handleTime);
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

    const panel = (name) => `${tab === name ? '' : 'hidden'} md:flex`;

    return (
        <MainContainer>
            <MouseTracker mouseChange={setMousePosition}/>
            {Object.entries(cursors).map(([username,pos]) => (
                <Cursor key={username} username={pos.username} x={window.innerWidth * pos.x} y={window.innerHeight * pos.y} />
            ))}
            <PageContainer>
                {error ? (
                    <>
                        <p>Error: Room doesn't exist.</p>
                        <StyledButton onClick={() => navigate("/quiz/online/")}>Back to menu</StyledButton>
                    </>
                    ) : (
                    <>
                    <div className="flex flex-col flex-1 min-h-0 w-full items-center gap-3">
                        <StyledDiv outerClassName='max-w-50 shrink-0' className='flex flex-row gap-3'>
                            <p className="text-white text-xl font-bold">{roomId}</p>
                            <button onClick={() => {navigator.clipboard.writeText(roomId)}}>📄</button>
                        </StyledDiv>

                        <div className="flex flex-1 min-h-0 w-full flex-col md:gap-3 md:flex-row">
                            <QuizPanel className={panel('quiz')} gameState={gameState} send={send} time={time}/>
                            <ChatPanel className={panel('chat')} messages={messages} sendMessage={sendMessage} roomId={roomId} members={members}/>
                        </div>
                        <nav className="md:hidden flex flex-row w-full gap-3">
                            {[['quiz', 'Quiz'], ['chat', 'Chat']].map(([id, label]) => (
                                <StyledButton
                                    key={id}
                                    onClick={() => setTab(id)}
                                    className={`w-full`}
                                    outerClassName="flex-1"
                                    variant={`bling`}
                                    selected={tab === id}
                                >
                                    {label}
                                </StyledButton>
                            ))}
                            <StyledButton className={`w-full`}
                                    outerClassName="flex-1"
                                    variant={`bling`}
                                    onClick={() => navigate("/")}
                                    >Menu</StyledButton>
                        </nav>
                    </div>
                    </>
                    )
                }
            </PageContainer>
        </MainContainer>
    )
}