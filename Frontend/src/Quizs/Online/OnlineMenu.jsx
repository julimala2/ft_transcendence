import { motion } from 'motion/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { StyledButton } from '../../Components/Buttons';
import { MainContainer, PageContainer, StyledDiv } from '../../Components/Containers';
import { StyledInput } from '../../Components/Inputs';
import { StyledSeparator } from '../../Components/Separators';
import { useSocket } from '../../Hooks/SocketProvider';
import { useAuth } from '../../Hooks/useAuth';

export function OnlineMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [rooms, setRooms] = useState([]);
    const [newName, setNewName] = useState("");
    const {send, on, off, connected, connectionError } = useSocket();
    const [selectedRoomId,setSelectedRoomId] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (connectionError) {
            setError(connectionError);
            setLoading(false);
            return;
        }
        if (!connected) return;

        const handleProfile = (data) => {
            setProfile(data);
            setLoading(false);
        }

        const roomCreated = (data) => {
            console.log("roomcreated");
            navigate(`/room/${data.roomId}`);
        }
        const roomJoined = (data) => {
            navigate(`/room/${data.roomId}`);
        }

        const errorRoom = (data) => {
            setError("La room n'existe pas");
        }

        on('profile',handleProfile);
        on('roomCreated',roomCreated);
        on('roomJoined',roomJoined);
        on('errorRoom',errorRoom);

        send('wsProfile');

        return () => {
            off('roomCreated',roomCreated);
            off('profile',handleProfile);
            off('roomJoined',roomJoined);
            off('errorRoom',errorRoom);
        }
    }, [connected, connectionError, on, off, send, navigate]);

    async function createRoom() {
        send("createRoom",{});
    }

    async function joinRoom() {
        send("joinRoom",{roomId : selectedRoomId});
    }

    return (
        <MainContainer>
            <PageContainer>
        {authLoading || (user && loading) ? (
                    <StyledDiv className="items-center gap-4 p-10">
                        <svg className="w-10 h-10 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
                        </svg>
                        <p className="font-bold text-xl text-amber-200 animate-pulse w-full text-center">Chargement...</p>
                    </StyledDiv>
            )
            : !user ?
            (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <StyledDiv className="items-center gap-6 p-8">
                        <p className="font-bold text-xl text-center w-full">Tu dois être connecté pour jouer en ligne.</p>
                        <StyledButton
                            onClick={() => navigate('/account', { state: { backgroundLocation: location.pathname } })}
                        >Se connecter</StyledButton>
                    </StyledDiv>
                </motion.div>
            )
            :
            (
                <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="font-[Slackey] text-4xl md:text-5xl text-center bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0px_0px_14px_rgba(234,179,8,0.45)]"
                    >
                        Mode en ligne
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex flex-col gap-6 md:flex-row w-full items-stretch"
                    >
                    <StyledDiv outerClassName="flex-1" className="flex flex-1 flex-col gap-4 p-6">
                        <div className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                                <line x1="13" y1="19" x2="19" y2="13" />
                                <line x1="16" y1="16" x2="20" y2="20" />
                                <line x1="19" y1="21" x2="21" y2="19" />
                            </svg>
                            <p className="font-bold text-xl bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Duels 1v1</p>
                        </div>
                        <StyledButton variant="bling" onClick={() => navigate('/quiz/online/lobby')}>
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polygon points="6 3 20 12 6 21 6 3" />
                                </svg>
                                Commencer un match
                            </span>
                        </StyledButton>
                    </StyledDiv>
                    <StyledDiv outerClassName="flex-1" className="flex flex-1 flex-col gap-5 p-6">
                        <div className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M3 10.5 12 3l9 7.5" />
                                <path d="M5 9.5V21h14V9.5" />
                            </svg>
                            <p className="font-bold text-xl bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Rooms privées</p>
                        </div>
                        <p className="text-center text-gray-300">
                            Crée une room et invite tes amis :
                        </p>
                        <StyledButton onClick={createRoom} className="w-full!">Créer une nouvelle room</StyledButton>
                        <StyledSeparator/>
                        <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); joinRoom();}}>
                            <p className="font-bold text-center">Rejoindre une room existante :</p>
                            <StyledInput
                                onChange={e => setSelectedRoomId(e.target.value)}
                                value={selectedRoomId}
                                placeholder="ID de la room à rejoindre"
                                className="text-white placeholder:text-gray-500! focus:border-amber-400! focus:outline-none!"
                            />
                            <StyledButton type="submit" className="w-full!">Rejoindre</StyledButton>
                        </form>
                        {error &&
                            <p className="w-full text-center font-bold text-red-400 bg-red-950/60 border-2 border-red-500 rounded-md p-2 shadow-[0px_0px_10px_2px_rgba(239,68,68,0.35)]">
                                Erreur : {error}
                            </p>
                        }
                    </StyledDiv>
                    </motion.div>
                </div>
                )
            }
            </PageContainer>
        </MainContainer>
    )
}
