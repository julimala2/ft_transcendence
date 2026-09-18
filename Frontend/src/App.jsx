import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import './Stylesheet.css'
import styles from './style.module.css'; 
import Quizz from './Quizz.jsx'
import MainMenu from './MainMenu.jsx';
import Settings from './Settings.jsx'
import BgImg from './Assets/background-blue.png'
import Blank from './Blank.jsx';

function App() {
  const [currentScreen, setCurrentScreen] = useState("menu"); // Current screen switch genre menu/quizz/settings/bref
  const [quizzSettings, setQuizzSettings] = useState({timerDuration: 5, numQuestions: 3}); //Quizz settings qui seront passes a la backend pour request les questions
  
  const goToSettings = () => setCurrentScreen("settings");
  const goToMenu = () => setCurrentScreen("menu");
  const goToBlank = () => setCurrentScreen("blank");

  const startQuizz = (chosenQuizzSettings) =>{
    setQuizzSettings(chosenQuizzSettings);
    setCurrentScreen("quizz");
  }

  const finishQuizz = () => {
    setCurrentScreen("menu");
  }

  switch (currentScreen) {
    case "quizz":
      return <Quizz onMenu={goToMenu}/>; //Todo : Modifier le quizz component pour qu'il prenne en params les settings voulus (et fasse la request backend etcetc)
    case "settings":
      return <Settings onMenu={goToMenu}/>;
    case "blank":
      return <Blank onMenu={goToMenu}/>
    default:
      return <MainMenu onPlay={startQuizz} onOnlinePlay={goToBlank} onSettings={goToSettings} onProfile={goToBlank}/>;
  }
}

export default App;