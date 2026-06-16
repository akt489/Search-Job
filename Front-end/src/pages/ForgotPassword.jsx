import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Unable to submit your request.');
            } else {
                setMessage(data.message || 'If the email exists, you will receive instructions shortly.');
            }
        } catch (err) {
            setError('Unable to reach the server. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-content page-auth">
            <div className="auth-page-card">
                <h2>Reset your password</h2>
                <p>Enter the email address for your account and we’ll send password reset instructions.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    {error && <p className="field-error">{error}</p>}
                    {message && <p className="field-success">{message}</p>}

                    <button type="submit" className="button button-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending…' : 'Send reset link'}
                    </button>
                </form>

                <p className="auth-help">
                    Remembered your password? <Link to="/login">Sign in</Link>.
                </p>
            </div>
        </div>
    );
}
