import { useNavigate, useParams } from 'react-router-dom';
import { CardContainer, MainContainer, PageContainer, StyledDiv} from "../../Components/Containers";
import { useSocket } from '../../Hooks/SocketProvider';
import { useState, useEffect, useRef } from 'react';
import { StyledButton } from '../../Components/Buttons';
import { StyledInput } from '../../Components/Inputs';
import { useAuth } from '../../Hooks/useAuth';
import { CategorySelector } from './CategorySelector';
import { LengthSelector } from './LengthSelector';
import { Avatar } from '../../Components/Avatar';
import { getQuestionById } from '../../Api/questions';

//TODO : -Empecher l'envoi d'un message vide DONE
// -Recuperer les messages avec roomInfo et les afficher DONE
// -Formatter le chat (user / message) DONE
// -Invitation de debut de quizz
// -If user not connected, open a modal to ask him to connect
// -Fix memberList
// Normaliser la recup des anciens messages
// Actuellemente le front recup tout une array de messages
// Il faudrait 



export function OnlineRoom(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [length, setLength] = useState(5);
    const { roomId } = useParams();
    const { send, on, off, connected} = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMsg,setNewMsg] = useState('');
    const [profile,setProfile] = useState(null);
    const { user } = useAuth();
    const [error,setError] = useState(false);
    const messagesEndRef = useRef(null);
    const [members, setMembers] = useState([]);
    const [category, setCategory] = useState("");
    const [gameState,setGameState] = useState();

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
                console.log("no game state");
                setGameState(null);
            }
            else{
                setGameState(data);
            }
        }

        on('chat',newMessage);
        on('profile',handleProfile);
        on('errorRoom',handleError);
        on('roomInfo',handleInfo);
        on('endVote',handleEndVote);
        on('roomJoined',handleRoomJoined);
        on('gameState',handleGameState);
        return () => {
            off('chat', newMessage);
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (profile && roomId && roomId !== profile.CurrentRoom) {
            send('joinRoom', { roomId });
            send('quiz', {type : "requestGameState"});
        }
    }, [profile, roomId, send]);

    const sendMessage = () => {
        send('chat', {text: newMsg});
        setNewMsg('');
    }

    const getInfo = () => {
        send('roomInfo',{roomId: roomId});
    }

    const sendQuizProposition = () => {
        if(category.id != ''){
            send('quiz', {type : 'proposeQuiz', categoryId : category.id, count: length });
        }
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
                    <div className="flex flex-row w-2/3 h-[calc(100vh-400px)] gap-3">


                        <StyledDiv className="flex flex-col gap-2 h-full" outerClassName='w-1/3'>
                            {(!gameState || (gameState.phase === "vote")) && ( <>
                                <p className="text-white text-xl font-bold">RoomID: {roomId}</p>
                                <CategorySelector onChange={setCategory} />
                                <LengthSelector value={length} onChange={setLength}/>
                                <StyledButton onClick={sendQuizProposition}>Vote</StyledButton>
                            </>)}
                            {gameState?.phase === "question" && ( <>
                                <p> Question : {gameState?.question.text} </p>
                                {gameState.question.answers.map((answer, index) => {
                                   return <StyledButton onClick={() => send("quiz", {type:"onAnswer", answerId: answer.id, time: 300})} key={index}>{answer.id} {answer.text} </StyledButton>
                                })}
                                
                            </>)}
                            {gameState?.phase === "revealAnswers" && (<>
                                <p>La bonne reponse etait : {gameState.correctAnswerId}</p>
                            </>)}
                            {gameState?.phase === "endGame" && (<>
                                <p>Fini ! Scores :</p>
                                {/* {gameState.scores.map((score, index) => {
                                    return <p key={index}>{ score.username} : {score.score}</p>
                                })} */}
                            </>)}
                        </StyledDiv>
                        <div className="flex flex-col gap-2 w-2/3 h-full">
                            <div className="flex flex-row gap-2 h-[calc(100%-50px)]">
                                <StyledDiv outerClassName="w-full h-full" className="flex-2 h-full flex-col gap-2 p-4 overflow-y-scroll justify-start">
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

                                <div className="bg-gray-900 flex flex-col w-50 border-2 rounded-xl p-4 gap-2 h-full">
                                    <h3 className="text-white text-xl font-bold">Members</h3>
                                    <ul>
                                        {members.map((member, index) => (
                                            <li key={index} className="text-gray-300">
                                                {/* <Avatar src={member.avatar} username={member.user}/> */}
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