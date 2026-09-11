import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './Stylesheet.css'
import styles from './style.module.css'; 

const listedefruits = [
  {id: 1, name:'pom'},
  {id: 2,name:'banan'},
  {id: 3,name:'poir'},
  {id: 4,name:'pesh'},
  {id: 5,name:'pestek'}
];

const gatos = ['tarte','flan','charlotte']
const [prems,deuz,troiz] = gatos

function MaListe() {
  return (
    <ul>
      {listedefruits.map(fruit =>
        <li key={fruit.id}>{fruit.id} is {fruit.name}</li>
      )}
    </ul>
  );
}

function Bonjour({name, age}) {
  return  <p>Bonjour, {name} ! {age} ans ca fait bcp la non</p>;
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)} className={styles.button}>
      Count: {count}
    </button>
  );
}

function Input(){
  return (<form>
    <label> Input : 
    <input type="text" />
    </label>
  </form>)
}

createRoot(document.getElementById('root')).render(
  <div>
    <p>Welcome!</p>
    <MaListe />
    <Bonjour name="bla" age={20} />
    <Counter />
    <Input />
  </div>
) 