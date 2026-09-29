import { Link } from "react-router-dom";
import styles from "../Styling/Buttons.module.css"

export function MenuButton(){
    return (
        <Link to={'/'} className={styles.menu}>Menu</Link>
    )
}

export function AboutButton(){
    
}