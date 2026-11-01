import { StyledButton } from '../../Components/Buttons';
import { MainContainer, PageContainer } from '../../Components/Containers';
import { useGameSocket } from '../../Hooks/useGameSocket';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledInput } from '../../Components/Inputs';

export function OnlineMenu() {
    const navigate = useNavigate();
    const { connected, messages, send, on, off } = useGameSocket();
    const [newName, setNewName] = useState("");
    const [roomId, setRoomId] = useState("");
    const profileRequestedRef = useRef(false);

    // Message handlers
    const roomCreatedHandler = useCallback((data) => {
        navigate(`/room/${data.roomId}`);
    }, [navigate]);

    const profileHandler = useCallback((data) => {
        if(data.CurrentRoom) {
            navigate(`/room/${data.CurrentRoom}`);
        }
    }, [navigate]);

    const joinedRoomHandler = useCallback((data) => {
        navigate(`/room/${data.roomId}`);
    }, [navigate]);

    // Register event listeners
    useEffect(() => {
        on('roomCreated', roomCreatedHandler);
        on('profile', profileHandler);
        on('joinedRoom', joinedRoomHandler);

        // Cleanup on unmount
        return () => {
            off('roomCreated', roomCreatedHandler);
            off('profile', profileHandler);
            off('joinedRoom', joinedRoomHandler);
        };
    }, [on, off, roomCreatedHandler, profileHandler, joinedRoomHandler]);

    useEffect(() => {
        if (connected && !profileRequestedRef.current) {
            profileRequestedRef.current = true;
            send({ type: 'wsProfile' });
        }
    }, [connected, send]);

    async function createRoom() {
        console.log("sent");
        send({ type: "createRoom", data: { roomName: newName } });
    }

    async function joinRoom() {
        console.log("join sent");
        send({ type: 'joinRoom', data: { roomId: roomId } });
    }

    return (
        <MainContainer>
            <PageContainer>
                <p>{JSON.stringify({connected})}</p>
                {
                    messages.map(mes => (
                        <p key={mes.roomId}>{JSON.stringify(mes)}</p>
                    ))
                }
                <StyledInput onChange={e => setNewName(e.target.value)} value={newName} />
                <StyledButton onClick={createRoom} className="border-2! bg-amber-500!">Creer</StyledButton>
                <StyledInput onChange={e => setRoomId(e.target.value)} value={roomId} />
                <StyledButton onClick={joinRoom} className="border-2! bg-amber-500!">Rejoindre</StyledButton>
                <StyledButton onClick={() => send({ type: 'wsProfile' })}>Profile</StyledButton>
            </PageContainer>
        </MainContainer>
    );
}

    // OnlineMenu -> Connect the websocket
    // Bouton -> Create a room, Bouton -> Rejoindre une room (roomId)
    // Join a chat by default (room = chat)
    // Le host peut choisir un theme et lancer un quizz oui
    // send({roomId :"current-room", type: "requestStartQuiz", category:"harry-potter", difficulty:"1"})
    // await({type:"quizstarting"})
    // send({userId :"moi", type: "quizReady", value: "true"})
    // une fois que tt le monde est pret
    // broadcast(quizstarting)
    // frontend passe en mode quiz, et il attend les questions
    // backend, via attempt, envoie la premiere question (et check loading de question termine)
    // une fois que tt le monde 
    
    // RULES : 1 USER PEUT FAIRE PARTIE DUNE SEULE ROOM
    // 30/10: Create a room, await message "room created", une fois recu j'ouvre la page room, display chat

    // + tard : Bouton -> QuickGame (Rejoindre une room valide)