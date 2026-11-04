import { createContext } from "react";

export const RoomContext = createContext(null);

export function RoomProvider({children}) {
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [isInRoom,setIsInRoom] = useState(false);
    const [roomData, setRoomData] = useState({});

    const joinRoom = (roomId) => {

    }

    const leaveRoom = () => {

    }

    const createRoom = (roomName) => {

    }

    const sendMessage = (message) => {

    }

    return(
        <RoomContext.Provider value ={{
            currentRoomId,
            isInRoom,
            roomData,
            joinRoom,
            leaveRoom,
            createRoom,
            sendMessage,
        }}></RoomContext.Provider>
    );
}