import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { AllQuizs } from "../Components/AllQuizs";
import { CreateQuiz } from "../Api/quiz";

export function MyQuizs() {
    const {user} = useAuth();
    const [newName,setNewName] = useState('');
    const [newDescription,setNewDescription] = useState('');
    const [view,setView] = useState("list"); //Switch list/new
    const [newQuizMessage,setNewQuizMessage] = useState('');
    const [refreshKey,setRefreshKey] = useState(0);

    useEffect(() => {
        async function load() {

        }
    },[]);

    async function handleNewQuiz(name,description){
        try {
            await CreateQuiz(name,description);
            setNewQuizMessage({type:"success", text:"Quiz created !"});
            setNewName("");
            setNewDescription("");
            setRefreshKey((k) => k + 1);
        }
        catch(err){
            setNewQuizMessage({type: 'error', text: err.error || 'error'});
        }
    }

    return(
        <div className="page">
            <section className="card">
                <input placeholder="New Quiz name"
                    value={newName}
                    onChange={(e)=>setNewName(e.target.value)} />
                <input placeholder="New Quiz description"
                    value={newDescription}
                    onChange={(e)=>setNewDescription(e.target.value)} />
                <button onClick={() => handleNewQuiz(newName,newDescription)}>Create new quizz</button>
                {newQuizMessage && <p className={newQuizMessage.type}>{newQuizMessage.text}</p>}
                <AllQuizs key={refreshKey}/>
            </section>
        </div>
    )
}