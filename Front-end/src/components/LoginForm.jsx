import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function LoginForm({ onSubmit, formData, onChange }) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>Welcome Back</h2>
      <p>Sign in to access saved jobs, applications, and dashboard tools.</p>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={onChange}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password || ''}
          onChange={onChange}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      <div className="auth-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="remember"
            checked={!!formData.remember}
            onChange={onChange}
          />
          Remember me
        </label>
        <Link to="/forgot-password" className="auth-link">
          Forgot Password?
        </Link>
      </div>

      <button type="submit" className="button button-primary button-full">
        Sign In
      </button>

      <div className="auth-help">
        Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
      </div>
    </form>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    remember: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LoginForm;
