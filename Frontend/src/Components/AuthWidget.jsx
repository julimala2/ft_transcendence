//Authentification widget containing both login and register + 42auth
//only use that (not loginForm/register etc...)

import { useState } from "react";
import { useAuth } from "../Api/auth";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import styles from "../Styling/Login.module.css"

export function AuthWidget() {
    const {loginWithOAuth} = useAuth();
    const [mode, setMode] = useState('login'); //switch login/register

    function renderForm() {
        switch(mode){
            case 'login':
                return <LoginForm />;
            case 'register':
                return <RegisterForm />;
            default:
                return <LoginForm />;
        }
    }

    return (
        <div className="page">
            <div className="card">
            {renderForm()}
            {mode === 'login' ? 
                (<button onClick={() => setMode('register')}>
                    No account ? Sign up
                </button>) 
                :
                (<button onClick={() => setMode('login')}>
                    Existing user ? Log in
                </button>
            )}
            <button onClick={() => loginWithOAuth()}>
                Login with 42
            </button>
            </div>
        </div>
    );
}