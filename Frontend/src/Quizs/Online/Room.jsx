import { useNavigate, useParams } from 'react-router-dom';
import { MainContainer, PageContainer} from "../../Components/Containers";
import { useGameSocket } from '../../Hooks/useGameSocket';
import { useState, useEffect } from 'react';

export function Room(){
    const {roomId} = useParams();
    const { connected, messages, sendChat, send } = useGameSocket();
    const [test, setTest] = useState('');

    useEffect(() => {
        if(connected){
            send({type: "joinRoom", data:{roomId:roomId}});
            console.log('JoinRoom sent.');
        }
    },[connected]);

  const handleSubmit = async e => {
    send({type: "chat", data:{text:test}});
    console.log('sent');
    };

    return (
        <MainContainer>
            <PageContainer>
                <p>Room id : {roomId}</p>
                <p>Connected : {JSON.stringify({connected})}</p>
                <p>
                    {JSON.stringify(messages)}
                </p>
                    <input type="text" value={test} className='border-2' onChange={e => setTest(e.target.value)} />
                    <button onClick={() => handleSubmit()} className='border-2 p-2 bg-amber-500' >bouton</button>
            </PageContainer>
        </MainContainer>
    )
}