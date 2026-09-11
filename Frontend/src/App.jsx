import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './Stylesheet.css'
import styles from './style.module.css'; 

function App() {
  const [name, setName] = useState("");
  const [submitted,setSubmitted] = useState(false);

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
        {submitted ? <>
                    <Bonjour name={name || "toi"} /> 
                    <Counter />
                    </> 
                    : 
                    <>
                    <p>Welcome!</p>
                    <MyForm name={name} onChange={handleChange} onSubmit={handleSubmit}/>
                    </>
        }
    </div>
  );
}

function MyForm({ name, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        vos papiers svp :
        <input type="text" value={name} onChange={onChange} />
      </label>
    </form>
  );
}

function Bonjour({name}) {
  return  <p>Bonjour, {name} !</p>;
}

function Counter() {
  let [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)} className={styles.button}>
        le bouton
      </button>
    <p> Tu as click {(count) < 10 ? count : "trop de"} fois.</p>
    
    </div>
  );
}

export default App;