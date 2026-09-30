import { useState } from "react";
import { useAuth } from "../Api/auth";
import { ChangePasswordForm } from "../Components/ChangePasswordForm";
import { EditableField } from "../Components/EditableField";
import { Avatar } from "../Components/Avatar";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MyProfile(){
    const {user,logout,updateProfile} = useAuth();
    const [mode,setMode] = useState('view'); //Switch between view edit password ...

    switch (mode) {
        case 'edit':
            return (
                <div className="page">
                    <section className="card">
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
                    <button onClick={()=>setMode('view')}>Cancel</button>
                    </section>
                </div>
            )
        case 'password':
            return (
                        <ChangePasswordForm onDone={()=> setMode('view')}/>
            )
        default:
            return (
                <div className="page">
                        <section className="card">
                        <Avatar src={user.avatar_url} username={user.display_name} size={60} />
                        <label>Email : {user.email}</label>
                        <label>Username : {user.username}</label>
                        <label>DisplayName : {user.display_name}</label>
                        {/* <label>Avatar url:{user.avatar_url}</label> */}
                        <section className="card">
                            <button onClick={()=>setMode('edit')}>Edit profile</button>
                            <button onClick={()=>setMode('password')}>Change password</button>
                            <button onClick={()=>logout()}>Log out</button>
                        </section>
                    </section>
                </div>
            )
    }
}