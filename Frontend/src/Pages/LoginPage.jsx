import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Api/auth';
import { AuthWidget } from '../Components/AuthWidget';

export function LoginPage() {
    const { user, loading } = useAuth();
    const [searchParams] = useSearchParams();
    const oauthError = searchParams.get('error') === 'oauth';

    if (loading) return <p>Loading...</p>;
    if (user) return <Navigate to="/" replace />;

    return (
        <div>
            {oauthError && (
                <p style={{ color: 'red' }}>42 login failed. Try again or use email.</p>
            )}
            <AuthWidget />
        </div>
    );
}
