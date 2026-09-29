import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './Stylesheet.css'
import styles from './style.module.css'; 
import { GameRoom } from './components/GameRoom';

function App() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [inputRoom, setInputRoom] = useState("");

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    if (inputRoom.trim()) {
      setRoomId(inputRoom);
      setInputRoom("");
    }
  }

  return (
    <div>
        {submitted ? <>
                    <Bonjour name={name || "toi"} />

                    {!roomId ? (
                      <form onSubmit={handleJoinRoom} style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                        <input
                          type="text"
                          value={inputRoom}
                          onChange={(e) => setInputRoom(e.target.value)}
                          placeholder="Entre l'ID de la room (ex: room-123)"
                          style={{ padding: '0.5rem', marginRight: '0.5rem', minWidth: '200px' }}
                        />
                        <button type="submit" style={{ padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
                          Join Room
                        </button>
                      </form>
                    ) : (
                      <>
                        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                          <p style={{ margin: '0.5rem 0', color: '#10b981' }}>
                            ✅ Connecté à: <strong>{roomId}</strong>
                          </p>
                          <button
                            onClick={() => setRoomId(null)}
                            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                          >
                            Changer de room
                          </button>
                        </div>
                        <GameRoom roomId={roomId} name={name} />
                      </>
                    )}

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