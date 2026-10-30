import { StyledButton } from '../../Components/Buttons';
import { MainContainer, PageContainer } from '../../Components/Containers';
import { useGameSocket } from '../../Hooks/useGameSocket';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledInput } from '../../Components/Inputs';

export function OnlineMenu() {
    const navigate = useNavigate();
    const { connected, messages, sendChat, send } = useGameSocket();
    const [newName, setNewName] = useState("");
    const [roomId, setRoomId] = useState("");
    
    useEffect(()=> {
        const last = messages[messages.length - 1];
        if(!last)
            return;
        switch(last.type){
            case 'roomCreated':
                navigate(`/room/${last.data.roomId}`);
        }
    }, [messages]);

    async function createRoom(){
        console.log("sent");
        send({ type: "createRoom", data:{roomName: "LaRoom" }});
    }




    // async function joinRoom() {
    //     console.log("join");
    //     send({ type: "joinRoom", data:{roomId: "1", roomName: "LaRoom"}});
    // }

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

    return (
        <MainContainer>
            <PageContainer>
                <p>{JSON.stringify({connected})}</p>
                <p>{JSON.stringify({messages})}</p>
                <StyledButton onClick={createRoom} className="border-2! bg-amber-500!">create</StyledButton>              
            </PageContainer>
        </MainContainer>
    );
}
