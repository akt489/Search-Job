import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

function Register({ onRegister }) {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = {};

        if (!formData.fullName.trim()) nextErrors.fullName = 'Please enter your name.';
        if (!formData.email.trim()) nextErrors.email = 'Please enter your email.';
        if (!formData.password) nextErrors.password = 'Please create a password.';
        if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        onRegister({ email: formData.email, name: formData.fullName });
        navigate('/dashboard');
    };

    return (
        <div className="page-content page-auth">
            <div className="auth-page-card">
                <RegisterForm onSubmit={handleSubmit} formData={formData} onChange={handleChange} errors={errors} />
                <p className="auth-help">
                    Already have an account? <Link to="/login">Login here</Link>.
                </p>
            </div>
        </div>
    );
}

export default Register;
