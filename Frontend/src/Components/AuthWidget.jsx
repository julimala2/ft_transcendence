//Authentification widget containing both login and register + 42auth
//only use that (not loginForm/register etc...)

import { useState } from "react";
import { useAuth } from "../Api/auth";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import styles from "../Styling/style.module.css"

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
        <div className={styles.div}>
            {renderForm()}
            <div>
            {mode === 'login' ? 
                (<button onClick={() => setMode('register')} className={styles.button}>
                    No account ? Sign up
                </button>) 
                :
                (<button onClick={() => setMode('login')} className={styles.button}>
                    Existing user ? Log in
                </button>
            )}
            </div>
            <div>
            <button onClick={() => loginWithOAuth()} className={styles.button42}>
                Login with 42
            </button>

            </div>
        </div>
    );
}