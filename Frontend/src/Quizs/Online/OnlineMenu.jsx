import { StyledButton } from '../../Components/Buttons';
import { MainContainer, PageContainer, StyledDiv } from '../../Components/Containers';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledInput } from '../../Components/Inputs';
import { useSocket } from '../../Hooks/SocketProvider';

export function OnlineMenu() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const {send, on, off } = useSocket();
    const [selectedRoomId,setSelectedRoomId] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        send('wsProfile')

        const handleProfile = (data) => {
            console.log("profile");
            setProfile(data);
            setLoading(false);
        }

        const roomCreated = (data) => {
            console.log("Created room",data);
            navigate(`/room/${data.roomId}`);
        }
        const roomJoined = (data) => {
            console.log("Join succesful",data);
            navigate(`/room/${data.roomId}`);
        }

        on('roomCreated',roomCreated);
        on('profile',handleProfile);
        on('roomJoined',roomJoined);
        return () => {
            off('roomCreated',roomCreated);
            off('profile',handleProfile);
            off('roomJoined',roomJoined);
        }
    }, [on,off, loading]);

    async function createRoom() {
        send("createRoom",{ roomName: newName });
    }

    async function joinRoom() {
        send("joinRoom",{roomId : selectedRoomId});
    }

    return (
        <MainContainer>
            <PageContainer>
        {loading ? (
            <p className="bg-red w-full">loading...</p>
            ) 
            : 
            (
                <>
                <StyledDiv className="gap-5 p-5">
                    <p>{JSON.stringify(profile)}</p>
                    <StyledInput onChange={e => setNewName(e.target.value)} value={newName} placeholder={"Nom de la room..."}/>
                    <StyledButton onClick={createRoom} className="border-2! bg-amber-500!">Creer</StyledButton>
                    <StyledInput onChange={e => setSelectedRoomId(e.target.value)} value={selectedRoomId} />
                    <StyledButton onClick={joinRoom} className="border-2! bg-amber-500!">Rejoindre</StyledButton>            
                </StyledDiv>
                </>
                )
            }
            </PageContainer>
        </MainContainer>
    )
}
