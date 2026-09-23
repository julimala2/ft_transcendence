import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import '../Styling/Stylesheet.css'
import styles from '../Styling/style.module.css'; 

function MainMenu({onPlay, onOnlinePlay, onSettings, onProfile}){
    return ( <>
        <div>MainMenu</div>
        <button onClick={onPlay} className={styles.button}>Play</button>
        <button onClick={onOnlinePlay} className={styles.button}>Test</button>
        <button onClick={onSettings} className={styles.button}>Settings</button>
        <button onClick={onProfile} className={styles.button}>Profile</button>
    </>
    );
}

export default MainMenu