import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { ChangePasswordForm } from "../Auth/ChangePasswordForm";
import { EditProfile } from "./ProfileEdit"
import styles from '../Styling/style.module.css'



export function MyProfile(){
    const {user,logout} = useAuth();
    const [mode,setMode] = useState('view'); //Switch between view edit password ...

    switch (mode) {
        case 'edit':
            return (
                <div className={styles.div}>
                    <EditProfile onDone={()=> setMode('view')}/>
                </div>
            )
        case 'password':
            return (
                <div className={styles.div}>
                    <ChangePasswordForm onDone={()=> setMode('view')}/>
                </div>
            )
        default:
            return (
                <div className={styles.div}>
                    {user.avatar_url && (<img src={user.avatar_url} alt="My avatar" width={80} height={80}/>
                    )}
                    <p>Username :{user.username}</p>
                    <p>Email :{user.email}</p>
                    <div>
                        <button onClick={()=>setMode('edit')} className={styles.button}>Edit profile</button>
                        <button onClick={()=>setMode('password')} className={styles.button}>Change password</button>
                        <button onClick={()=>logout()} className={styles.button}>Log out</button>
                    </div>
                </div>
            )
    }
}