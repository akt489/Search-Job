import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({ email: '', password: '', remember: false });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please enter email and password.');
            return;
        }
        setError('');
        onLogin({ email: formData.email, name: 'JobSeeker' });
        navigate('/dashboard');
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
