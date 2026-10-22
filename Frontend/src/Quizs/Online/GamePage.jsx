import { useParams } from 'react-router-dom';
import { GameRoom } from '../../Components/GameRoom';

export function GamePage() {
    const { roomId } = useParams();

    return (
        <main className="page">
            <GameRoom roomId={roomId} />
        </main>
    );
}
