import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import '../Styling/Stylesheet.css'
import styles from '../Styling/style.module.css'; 

function Blank({onMenu}){
    return ( <>
        <div>Blank Page for testing</div>
        <button onClick={onMenu} className={styles.button}>Menu</button>
    </>
    );
}

export default Blank