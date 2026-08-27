import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function RegisterForm({ onSubmit, formData, onChange, errors }) {
  const fieldErrors = errors || {};

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>Create Your Account</h2>
      <p>Join SearchJob to save roles, track applications, and manage career progress.</p>

      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName || ''}
          onChange={onChange}
          placeholder="Jane Doe"
          required
          className={fieldErrors.fullName ? 'input-error' : ''}
          aria-invalid={fieldErrors.fullName ? 'true' : 'false'}
        />
        {fieldErrors.fullName && <p className="field-error" role="alert">{fieldErrors.fullName}</p>}
      </div>

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
          className={fieldErrors.email ? 'input-error' : ''}
          aria-invalid={fieldErrors.email ? 'true' : 'false'}
        />
        {fieldErrors.email && <p className="field-error" role="alert">{fieldErrors.email}</p>}
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
          className={fieldErrors.password ? 'input-error' : ''}
          aria-invalid={fieldErrors.password ? 'true' : 'false'}
        />
        {fieldErrors.password && <p className="field-error" role="alert">{fieldErrors.password}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword || ''}
          onChange={onChange}
          placeholder="••••••••"
          required
          className={fieldErrors.confirmPassword ? 'input-error' : ''}
          aria-invalid={fieldErrors.confirmPassword ? 'true' : 'false'}
        />
        {fieldErrors.confirmPassword && <p className="field-error" role="alert">{fieldErrors.confirmPassword}</p>}
      </div>

      {fieldErrors.form && <p className="field-error" role="alert">{fieldErrors.form}</p>}

      <button type="submit" className="button button-primary button-full">
        Register Account
      </button>

      <div className="auth-help">
        Already have an account? <Link to="/login" className="auth-link">Log in here</Link>
      </div>
    </form>
  );
}

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

RegisterForm.defaultProps = {
  errors: {},
};

export default RegisterForm;
