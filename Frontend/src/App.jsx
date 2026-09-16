import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import './Stylesheet.css'
import styles from './style.module.css'; 
import Quizz from './quizz'
import BgImg from './Assets/background-blue.png'

function App() {
  return (
    <div>
          <>
          <p>Welcome!</p>
          <Quizz />
          </>
    </div>
  );
}

export default App;