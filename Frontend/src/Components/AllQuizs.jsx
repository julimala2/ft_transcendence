import { useEffect, useState } from "react";
import { getAllQuizs, getQuizById } from "../Api/quiz";

export function AllQuizs(){
    const [quizs,setQuizs] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        
        async function load() {
            try{
                const data = await getAllQuizs({mine: true});
                if(!cancelled) {
                    setQuizs(data);
                }
                console.log(data);
            }
            catch(err) {
                if(!cancelled) setError(err.error || 'error getting quizs');
            }
            finally {
                if(!cancelled) setLoading(false);
            }
        }
        load();
        return() => {
        cancelled = true;
        };
    }, []);

    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-4">Mes Quizs</h2>
            <ul className="list">
                {quizs.map ((q) => (
                    <li key={q.id} className="card">- {q.title}</li>
                ))}
            </ul>
            <div className="mt-4">
                <a href="/quiz/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Créer un nouveau quiz
                </a>
            </div>
        </div>
    )
}