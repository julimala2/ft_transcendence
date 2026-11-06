import { StyledButton } from '../../Components/Buttons';
import { MainContainer, PageContainer, StyledDiv } from '../../Components/Containers';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledInput } from '../../Components/Inputs';
import { useSocket } from '../../Hooks/SocketProvider';
import { StyledSeparator } from '../../Components/Separators';

export function OnlineMenu() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [rooms, setRooms] = useState([]);
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
            navigate(`/room/${data.roomId}`);
        }
        const roomJoined = (data) => {
            navigate(`/room/${data.roomId}`);
        }

        const errorRoom = (data) => {
            setError("La room n'existe pas");
        }

        on('roomCreated',roomCreated);
        on('profile',handleProfile);
        on('roomJoined',roomJoined);
        on('errorRoom',errorRoom);
        return () => {
            off('roomCreated',roomCreated);
            off('profile',handleProfile);
            off('roomJoined',roomJoined);
            off('errorRoom',errorRoom);
        }
    }, [on,off, loading]);

    async function createRoom() {
        send("createRoom",{});
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
                <StyledDiv className="gap-5 p-5">
                    {/* <p>{JSON.stringify(profile)}</p> */}
                    <StyledButton onClick={createRoom} className="border-2! bg-amber-500!">Creer une nouvelle room</StyledButton>
                    <StyledSeparator/>
                    <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); joinRoom();}}>
                    <p className="font-bold">Rejoindre une room existante :</p>

                    <StyledInput onChange={e => setSelectedRoomId(e.target.value)} value={selectedRoomId} placeholder="ID de la room a rejoindre" />
                    
                    <StyledButton type="submit" className="border-2! bg-amber-500!">Rejoindre</StyledButton>
                   </form>
                    {error && 
                    <p className="text-red-500 w-full">Erreur : {error}</p>
                    }

                </StyledDiv>
                )
            }
            </PageContainer>
        </MainContainer>
    )
}
