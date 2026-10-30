import { StyledButton } from '../../Components/Buttons';
import { MainContainer, PageContainer } from '../../Components/Containers';
import { useGameSocket } from '../../Hooks/useGameSocket';

export function OnlineMenu() {
    const { connected, messages, sendChat,send } = useGameSocket();

    async function createRoom(){
        
        
    }
    console.log("sent");
    send({ type"roomname");
    return (
        <MainContainer>
            <PageContainer>
                <p>{JSON.stringify({connected})}</p>
                <StyledButton onClick={() => createRoom}>CreateRoom</StyledButton>
            </PageContainer>
        </MainContainer>
    );
}