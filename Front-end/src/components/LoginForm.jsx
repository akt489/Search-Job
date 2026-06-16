import { Link } from 'react-router-dom';

function LoginForm({ onSubmit, formData, onChange }) {
    return (
        <form className="auth-form" onSubmit={onSubmit}>
            <h2>Welcome back</h2>
            <p>Sign in to access saved jobs, applications, and dashboard tools.</p>

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="you@example.com" required />

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={onChange} placeholder="••••••••" required />

            <div className="auth-row">
                <label className="checkbox-label">
                    <input type="checkbox" name="remember" checked={formData.remember} onChange={onChange} />
                    Remember me
                </label>
                <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="button button-primary">Login</button>
        </form>
    );
}

export default LoginForm;
