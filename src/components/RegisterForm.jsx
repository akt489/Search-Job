function RegisterForm({ onSubmit, formData, onChange, errors }) {
    return (
        <form className="auth-form" onSubmit={onSubmit}>
            <h2>Create your account</h2>
            <p>Join JobScout to save roles, track applications, and manage career progress.</p>

            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={onChange} placeholder="Jane Doe" required />
            {errors.fullName && <p className="field-error">{errors.fullName}</p>}

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="you@example.com" required />
            {errors.email && <p className="field-error">{errors.email}</p>}

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={onChange} placeholder="••••••••" required />
            {errors.password && <p className="field-error">{errors.password}</p>}

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={onChange} placeholder="••••••••" required />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}

            <button type="submit" className="button button-primary">Register</button>
        </form>
    );
}

export default RegisterForm;
