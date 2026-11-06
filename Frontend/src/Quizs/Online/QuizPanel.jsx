import { StyledSeparator } from "../../Components/Separators";
import { StyledButton } from "../../Components/Buttons";
import { CategorySelector } from "./CategorySelector";
import { LengthSelector } from "./LengthSelector";
import { StyledDiv } from "../../Components/Containers"
import { useState, useEffect, useRef } from 'react';

export function QuizPanel({gameState,send}){
    const [category, setCategory] = useState("");
    const [length, setLength] = useState(5);
    const sendQuizProposition = () => {
        if(category.id != ''){
            send('quiz', {type : 'proposeQuiz', categoryId : category.id, count: length });
        }
    }

    return(
        <>
        <StyledDiv className="flex flex-col gap-2 pt-4 pb-4 w-1/2 justify-center-safe">                    
            {/* Voting phase TODO: Visual Time  */}
            {(!gameState) && <p>Gamestate absent</p>}
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
            <div className='h-full overflow-y-scroll'>
                <CategorySelector onChange={setCategory} value={category} />
            </div>
            <div className="flex flex-col items-center gap-3">
                <StyledSeparator/>
                <LengthSelector value={length} onChange={setLength}/>
            <StyledSeparator/>
                <StyledButton variant="bling" onClick={sendQuizProposition}>Vote</StyledButton>
            </div>
            </>)}

            {/* End vote phase */}
            {(gameState && (gameState.phase === "endVote") && (<>
                
            </>))}

            {/* Question phase */}
            {gameState?.phase === "question" && ( <>
                <p> Question : {gameState?.question.text} </p>
                {gameState.question.answers.map((answer, index) => {
                    return <StyledButton onClick={() => send("quiz", {type:"onAnswer", answerId: answer.id, time: 300})} key={index}>{answer.id} {answer.text} </StyledButton>
                })}
            </>)}

            {/* Reveal answer phase */}
            {gameState?.phase === "revealAnswers" && (<>
                <p>La bonne reponse etait : {gameState.correctAnswerId}</p>
            </>)}

            {/* End game phase */}
            {gameState?.phase === "endGame" && (<>
                <p>Fini ! Scores :</p>
                {/* {gameState.scores.map((score, index) => {
                    return <p key={index}>{ score.username} : {score.score}</p>
                })} */}
            </>)}
        </StyledDiv>
        </>
    )
}