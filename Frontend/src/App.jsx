import { Dropdown } from "./Navigation/Dropdown"
import { Header } from "./Navigation/Header"
import styles from './Styling/style.module.css'; 

function App(){
    return(
        <>
        <Header/>
        <div className={styles.body}>
            <div className={styles.div} style={{marginTop:"50px",height:"50em",width:"75%"}}>
                <h1>Bonjour je suis un titre</h1>
                <p>Bonjour je suis un paragraphe</p>
                <label>Bonjour je suis un label</label>
            </div>
        </div>
        </>
    );
}

export default App