import { useState } from "react";
import { useAuth } from "../Api/auth";
import { ChangePasswordForm } from "../Components/ChangePasswordForm";
import styles from '../Styling/Profile.module.css'
import { EditableField } from "../Components/EditableField";
import { Avatar } from "../Components/Avatar";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MyProfile(){
    const {user,logout,updateProfile} = useAuth();
    const [mode,setMode] = useState('view'); //Switch between view edit password ...

    switch (mode) {
        case 'edit':
            return (
                <div className={styles.main}>
                    <div className={styles.card}>
                            <EditableField
                                label="Email :"
                                value={user.email}
                                placeholder="Email"
                                validate={(v)=> !emailRegex.test(v) ? "Invalid email" : null}
                                onSave={(v) => updateProfile({ email:v.toLowerCase() })}
                            ></EditableField>
                        <label>Username :{user.username}</label>
                            <EditableField
                                label="DisplayName :"
                                value={user.display_name}
                                placeholder="DisplayName"
                                validate={(v)=> v.length === 0 ? "Invalid display name" : null}
                                onSave={(v) => updateProfile({display_name:v})}
                            ></EditableField>
                    <button onClick={()=>setMode('view')} className={styles.button}>Cancel</button>
                    </div>
                </div>
            )
        case 'password':
            return (
                <div className={styles.main}>
                    <ChangePasswordForm onDone={()=> setMode('view')}/>
                </div>
            )
        default:
            return (
                <div className={styles.main}>
                        <div className={styles.card}>
                        <Avatar src={user.avatar_url} username={user.display_name} size={60} />
                        <label>Email :{user.email}</label>
                        <label>Username :{user.username}</label>
                        <label>DisplayName :{user.display_name}</label>
                        {/* <label>Avatar url:{user.avatar_url}</label> */}
                        <div>
                            <button onClick={()=>setMode('edit')} className={styles.button}>Edit profile</button>
                            <button onClick={()=>setMode('password')} className={styles.button}>Change password</button>
                            <button onClick={()=>logout()} className={styles.button}>Log out</button>
                        </div>
                    </div>
                </div>
            )
    }
}