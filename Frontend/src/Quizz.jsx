import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import './Stylesheet.css'
import styles from './style.module.css'; 

class Question{
    constructor(question,answers,correctIndex){
        this.question = question;
        this.answers = answers;
        this.correctIndex = correctIndex;
    }
}

const DURATION = 5;

function DisplayQuestion({question, onAnswered}){
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [timeLeft, setTimeLeft] = useState(DURATION);
    const isCorrect = selectedIndex === question.correctIndex;


//Pas sur que c'est la proper way d'implementer un timer, a verifier
  useEffect(() => {
        if (selectedIndex !== null) return;

        const intervalId = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);
    
        return () => clearInterval(intervalId);

    }, [selectedIndex]);


    useEffect(() => {
        if(timeLeft <= 0 && selectedIndex === null) {
            setSelectedIndex(-1);
            onAnswered(false);
        }

    }, [timeLeft, selectedIndex]);
//Fin du timer

    const handleClick = (index) =>{
        if (selectedIndex !== null) return;

        setSelectedIndex(index);
        onAnswered(index === question.correctIndex);
    };
    

    //Est ce que c'est possib de modifier un style module plutot qu'override ? (DONE)
    const getButtonClass = (index) => { 
        if(selectedIndex === null) return styles.button;
        if(index === question.correctIndex) return `${styles.button} ${styles.correct}`;
        if(index === selectedIndex) return `${styles.button} ${styles.wrong}`;
        return `${styles.button} ${styles.disabled}`;
    }
    return (
        <>
            <div>{question.question}</div>
            <ul className={styles.list}>
                {question.answers.map((answer,index) => (
                    <li key ={index}>
                        <button 
                            onClick={()=>handleClick(index)}
                            disabled={selectedIndex !== null}
                            className={getButtonClass(index)}
                        >
                        {answer}
                        </button>
                    </li>
                ))}
            </ul>
            <div>
                {timeLeft}
            </div>
        </>
    )
}

function Quizz({onMenu}){
    const [questions] = useState(
        [
            new Question("2+2=?",["3","2","4","12"],2),
            new Question("Capitale du Listenbourg ?",["Carmenia","Missbalder","Costilla","Lurenberg"],3),
            new Question("Le javascript est ?",["Une erreur","Un language fort sympathique","Une danse peruvienne","Je sais pas"],1)
        ]
    )
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);

    const handleAnswered = (isCorrect) => {
        setAnswered(true);
        if (isCorrect) setScore (score + 1);
    }

    function nextQuestion(){
        setAnswered(false);
        setCurrentIndex(currentIndex + 1);
    }

    if (currentIndex >= questions.length){
        return (<>
            <div>Fin! Mon score: {score}</div>
            <button onClick={onMenu} className={styles.button}>Menu</button>
        </>
        );
    }

    return(
        <>
            <div style={{backgroundColor:"darkblue",textAlign:"center",padding:"20px"}}>
                <DisplayQuestion 
                    key={currentIndex} 
                    question={questions[currentIndex]} 
                    onAnswered={handleAnswered}
                />
                {answered && <button onClick={nextQuestion} className={styles.button}>Next</button>}
            </div>
        </>
    )
}

export default Quizz