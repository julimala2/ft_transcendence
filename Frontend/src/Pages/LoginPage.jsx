import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Api/auth';
import { AuthWidget } from '../Components/AuthWidget';
import styles from '../Styling/LoginPage.module.css';

export function LoginPage() {
    const { user, loading } = useAuth();
    const [searchParams] = useSearchParams();
    const oauthError = searchParams.get('error') === 'oauth';

    // if (loading) return <p>Loading...</p>;
    if (user) return <Navigate to="/" replace />;

    return (
        <main className={`page ${styles.login}`}>
            {oauthError && (
                <p className={`alert alert-error ${styles.notice}`}>
                    42 login failed. Try again or use email.
                </p>
            )}
            <AuthWidget />
        </main>
    );
}
