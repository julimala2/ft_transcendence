import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import './Stylesheet.css'
import styles from './style.module.css'; 

function Settings({onMenu}){
    return ( <>
        <div>Settings</div>
        <button onClick={onMenu} className={styles.button}>Menu</button>
    </>
    );
}

export default Settings