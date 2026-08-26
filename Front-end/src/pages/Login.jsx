import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const API_BASE = import.meta.env.VITE_API_URL || '';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({ email: '', password: '', remember: false });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please enter email and password.');
            return;
        }

        setError('');

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Login failed.');
                return;
            }

            onLogin(data.user, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Unable to reach the server. Please try again later.');
        }
    };

    return (
        <div className="page-content page-auth">
            <div className="auth-page-card">
                <LoginForm onSubmit={handleSubmit} formData={formData} onChange={handleChange} />
                {error && <p className="field-error">{error}</p>}
                <p className="auth-help">
                    Don’t have an account? <Link to="/register">Register here</Link>.
                </p>
            </div>
        </div>
    );
}

export default Login;
