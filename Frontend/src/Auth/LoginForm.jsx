import { useState } from 'react'
import { useAuth } from '../Context/AuthContext'

import '../Styling/Stylesheet.css'
import styles from '../Styling/style.module.css';

export function LoginForm() {
    const {login} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e){
        e.preventDefault();

        setError(null);
        setIsSubmitting(true);

        try{
            await login(email,password);
        }
        catch(err){
            setError(err.error || 'Error');
        } 
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='email'>Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    // required
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // required
                />
            </div>
        
        {error && <p style = {{color:'red'}}>{error}</p>}

        <button type="submit" disabled={isSubmitting} className={isSubmitting ? styles.disabled : styles.button}>
            {isSubmitting ? 'Logging in...' : 'Log in'} 
        </button>
        
        </form>
    )
}