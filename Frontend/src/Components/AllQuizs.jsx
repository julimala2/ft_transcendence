import { use, useEffect, useState } from "react";
import { getAllQuizs, getQuizById } from "../Api/quiz";

export function AllQuizs(){
    const [quizs,setQuizs] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        
        async function load() {
            try{
                const data = await getAllQuizs();
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
            <ul className="list">
                {quizs.map ((q) => (
                    <li key={q.id} className="card">- {q.title}</li>
                ))}
            </ul>
        </div>
    )
}