import { StyledSeparator } from "../../Components/Separators";
import { StyledButton } from "../../Components/Buttons";
import { CategorySelector } from "./CategorySelector";
import { LengthSelector } from "./LengthSelector";
import { StyledDiv } from "../../Components/Containers"
import { useState, useEffect, useRef } from 'react';

export function QuizPanel({className = '',gameState,send,time}){
    const [category, setCategory] = useState("");
    const [length, setLength] = useState(5);
    const sendQuizProposition = () => {
        if(category.id != ''){
            send('quiz', {type : 'proposeQuiz', categoryId : category.id, count: length });
        }
    }

    //TODO : -envoyer le texte de la reponse gagnante (ou une route getAnswerById dans le back)
    //       -envoyer le score dans le gamestate
    //       -envoyer cb de questions il reste

    return(
        <>
        <StyledDiv outerClassName={`${className} w-full min-h-0 flex-1`} className="flex flex-col gap-2 pt-4 pb-4 w-1/2 justify-center-safe">                    
            {/* Voting phase TODO: Visual Time  */}
            {(!gameState || (gameState.phase === "vote")) && ( <>
            {(gameState && gameState.quizList) ? (
                <> 
                    {gameState.quizList.map((quiz,index) => (
                        <StyledButton key={index} onClick={() => (send('quiz', {type : 'proposeQuiz', categoryId : quiz.categoryId, count: quiz.count }))} >{quiz.categoryName} - {quiz.count} questions - {quiz.nbVotes} votes</StyledButton>
                    ))}
                    <StyledSeparator/>
                </>
            ):(
                    <p className="font-bold text-l">Votez pour commencer un nouveau quiz !</p>
            )}
            {((gameState && gameState.phase === "vote") && (
                <p className="font-bold">Le vote se termine dans {Math.ceil(gameState.timer/1000)} secondes !</p>
            ))}
            <CategorySelector onChange={setCategory} value={category} />
            <div className="flex flex-col items-center gap-3">
                <StyledSeparator/>
                <LengthSelector value={length} onChange={setLength}/>
            <StyledSeparator/>
                <StyledButton onClick={sendQuizProposition}>Vote</StyledButton>
            </div>
            </>)}

            {/* End vote phase */}
            {(gameState && (gameState.phase === "endVote") && (<>
                <p> Resultat des votes </p>
                <StyledButton>{gameState.winner.categoryName}</StyledButton>
                <p> a gagne avec {gameState.winner.nbVotes} votes !</p>
                <p> Le quizz commence dans {Math.ceil(time/1000)} secondes</p>
            </>))}

            {/* Question phase */}
            {gameState?.phase === "question" && ( <>
            <div className="w-full flex flex-col md:pl-10 md:pr-10 gap-3 justify-center items-center">
                <p className="text-xl font-bold"> {Math.ceil(time/1000)} secondes restantes.</p>
                <p className="text-xl font-bold rounded-xl md:p-10 bg-blue-900"> Question : {gameState?.question.text} </p>
                {gameState.question.image && (
                    <div>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/quiz-images/${gameState.question.image.src}`}
                        alt={gameState.question.image.alt || 'Image de la question'}
                    />
                    </div>
                )}

                <div className="flex flex-col w-full max-w-100 align-center justify-center gap-3">

                {gameState.question.answers.map((answer, index) => {
                    return <StyledButton className=" text-xl font-bold p-4! w-full" onClick={() => send("quiz", {type:"onAnswer", answerId: answer.id, time: time})} key={index}>{answer.text}</StyledButton>
                })}
                </div>
            </div>
            </>)}

            {/* Reveal answer phase */}
            {gameState?.phase === "revealAnswers" && (<>
            <div className="w-full flex flex-col md:pl-10 md:pl-10 gap-3 justify-center items-center">
                <p className="text-xl font-bold">La bonne reponse etait : {}</p>
                <p className="text-xl font-bold"> {Math.ceil(time/1000)} secondes avant la prochaine question.</p>
            </div>
            </>)}

            {/* End game phase */}
            {gameState?.phase === "endGame" && (<>
                <p>Fini ! Scores :</p>
                <StyledButton onClick={() => {gameState.phase = "vote"}}>Retour</StyledButton>
                {/* {gameState.scores.map((score, index) => {
                    return <p key={index}>{ score.username} : {score.score}</p>
                })} */}
            </>)}
        </StyledDiv>
        </>
    )
}