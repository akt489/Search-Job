import { useState } from 'react';
import PropTypes from 'prop-types';

function ApplicationForm({ job, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    coverLetter: '',
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const nextErrors = {};
    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required.';
    if (!formData.file) nextErrors.file = 'Upload your CV to continue.';
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    if (type === 'file') {
      const file = files[0];
      const acceptedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (file && file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: 'Maximum file size is 5 MB.' }));
        return;
      }
      if (file && !acceptedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, file: 'Upload a PDF or DOCX file only.' }));
        return;
      }
      setErrors((prev) => ({ ...prev, file: undefined }));
      setFormData((prev) => ({ ...prev, file }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMessage('Please fix the highlighted fields and try again.');
      return;
    }

    setErrors({});
    setMessage('Your application has been submitted successfully.');
    onSubmit({
      jobId: job?.id,
      ...formData,
      appliedDate: new Date().toLocaleDateString(),
      status: 'Applied',
    });
  };

  return (
    <form className="application-form" onSubmit={handleSubmit} noValidate>
      <div className="form-intro">
        <div>
          <p className="eyebrow">Application</p>
          <h2>Apply for {job?.title || 'Job'}</h2>
          <p>Submit your details and CV to connect with the hiring team.</p>
        </div>
        <div className="progress-pill">Step 1 of 3</div>
      </div>

      <div className="form-card">
        <section className="form-section">
          <h3>Personal Information</h3>
          <div className="field-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={errors.fullName ? 'input-error' : ''}
                aria-required="true"
                aria-invalid={errors.fullName ? 'true' : 'false'}
              />
              {errors.fullName && <span className="field-error" role="alert">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={errors.email ? 'input-error' : ''}
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 010-2020"
                className={errors.phone ? 'input-error' : ''}
                aria-required="true"
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
              {errors.phone && <span className="field-error" role="alert">{errors.phone}</span>}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3>Experience Links</h3>
          <div className="field-grid">
            <div className="form-group">
              <label htmlFor="linkedIn">LinkedIn Profile</label>
              <input
                id="linkedIn"
                name="linkedIn"
                type="url"
                value={formData.linkedIn}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolio">Portfolio / Website</label>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3>Cover Letter</h3>
          <div className="form-group">
            <label htmlFor="coverLetter">Message / Intro</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Briefly introduce yourself and explain why you are a great fit."
              rows={5}
            />
          </div>
        </section>

        <section className="form-section">
          <h3>Resume / CV Upload *</h3>
          <div className="form-group">
            <label htmlFor="cvUpload">Upload CV (PDF, DOCX)</label>
            <input
              id="cvUpload"
              name="cvUpload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleChange}
              className={errors.file ? 'input-error' : ''}
              aria-required="true"
              aria-invalid={errors.file ? 'true' : 'false'}
            />
            <small className="hint-text">Accepted formats: PDF, DOCX. Maximum file size: 5 MB.</small>
            {errors.file && <span className="field-error" role="alert">{errors.file}</span>}
          </div>
        </section>
      </div>

      {message && (
        <p className={Object.keys(errors).length > 0 ? 'field-error' : 'form-status-message'} role="status">
          {message}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="button button-primary">
          Submit Application
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

ApplicationForm.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ApplicationForm;
