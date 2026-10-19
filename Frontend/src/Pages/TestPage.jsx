import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../Api/api';
import { createQuestion, getAllQuestions } from '../Api/questions';
import { getQuizById, getQuizQuestions } from '../Api/quiz';

export default function TestPage(){
    
    const [test, setTest] = useState({});

    useEffect(() => {
            // Create a proper question object with required fields
            const newQuestion = {
                text: "question test",
                answers: [
                    { text: "Réponse 1", isCorrect: true },
                    { text: "Réponse 2", isCorrect: false }
                ],
                type: "multiple",
                difficulty: 1,
                explanation: "Explication de la bonne réponse",
                categoryId: 3,
                tags: ["test", "example"]
            };
            
            // Call createQuestion with the properly structured object
            createQuestion(newQuestion)
                .then(response => {
                    console.log("Question créée avec succès:", response);
                })
                .catch(error => {
                    console.error("Erreur lors de la création de la question:", error);
                });
                
            const data = getQuizById(1);
            console.log(data);
    },[]);

    return (
        <div className='page'>
            <p>bonjour</p>
            <li>
                {}
            </li>
        </div>
    )
}