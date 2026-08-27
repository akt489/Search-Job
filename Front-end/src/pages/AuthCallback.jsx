import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userParam = params.get('user');
        const redirect = params.get('redirect') || '/dashboard';
        const error = params.get('error');

        if (error) {
            navigate(`/login?error=${encodeURIComponent(error)}`);
            return;
        }

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                localStorage.setItem('jobscout-token', token);
                localStorage.setItem('jobscout-user', JSON.stringify(user));
                navigate(redirect);
            } catch (error) {
                console.error('Auth callback error:', error);
                navigate('/login?error=Failed to process login');
            }
        } else {
            navigate('/login?error=Missing authentication data');
        }
    }, [location, navigate]);

    return (
        <div className="page-content page-auth">
            <div className="auth-page-card">
                <h2>Logging you in...</h2>
                <p>Please wait while we complete your Google sign-in.</p>
            </div>
        </div>
    );
}

export default AuthCallback;