import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // ✅ FIXED: removed extra /api
            const response = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'If this email is registered, a password reset link will be sent.');
                setEmail('');
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Unable to reach the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-content page-auth">
            <div className="auth-page-card glass-card">
                <h2>Reset Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="field-error">{error}</div>}

                    <button
                        type="submit"
                        className="button button-primary button-full"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="auth-help">
                        <Link to="/login">← Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;