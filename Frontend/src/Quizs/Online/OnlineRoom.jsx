import { useNavigate, useParams } from 'react-router-dom';
import { MainContainer, PageContainer} from "../../Components/Containers";
import { useGameSocket } from '../../Hooks/useGameSocket';
import { useState, useEffect } from 'react';
import { StyledButton } from '../../Components/Buttons';
import { Navigate } from 'react-router-dom';

export function OnlineRoom(){
    const navigate = useNavigate();
    const {roomId} = useParams();
    const { connected, messages, sendChat, send } = useGameSocket();
    const [test, setTest] = useState('');
    let pending = false;

    // useEffect(() => {
    //     if(connected){
    //         send({type: "joinRoom", data:{roomId:roomId}});
    //         console.log('JoinRoom sent.');
    //     }
    // },[connected]);

    const handleSubmit = async e => {
        send({type: "chat", data:{text:test}});
        console.log('sent');
    };

    const handleQuit = async e => {
        send({type: "leaveRoom"});
        console.log('sent leave');
        navigate('/');
    };

    const handleStart = async e => {
        send({type: "quiz", data: {type:"setQuiz"}});
    }

    return (
        <MainContainer>
            <PageContainer>
                <p>Room id : {roomId}</p>
                <p>Connected : {JSON.stringify({connected})}</p>
                <div className='bg-slate-900 p-4 flex-col flex gap-2 rounded-2xl'>
                {
                    messages.map( mes => (
                        <p key={mes.roomId}>- {JSON.stringify(mes)}</p>))
                }
                </div>
                <input type="text" value={test} className='border-2' onChange={e => setTest(e.target.value)} />
                <button onClick={() => handleSubmit()} className='border-2 p-2 bg-amber-500' >bouton</button>
                <StyledButton onClick={() => handleQuit()} variant='danger'>Quitter</StyledButton>
                <StyledButton onClick={() => handleStart()} variant='success'>Start Quiz</StyledButton>
            </PageContainer>
        </MainContainer>
    )
}