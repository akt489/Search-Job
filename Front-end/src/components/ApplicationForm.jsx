import { useState } from 'react';

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
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Enter a valid email address.';
        if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required.';
        if (!formData.file) nextErrors.file = 'Upload your CV to continue.';
        return nextErrors;
    };

    const handleChange = (event) => {
        const { name, value, files, type } = event.target;
        if (type === 'file') {
            const file = files[0];
            const acceptedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (file && file.size > 5 * 1024 * 1024) {
                setErrors({ file: 'Maximum file size is 5 MB.' });
                return;
            }
            if (file && !acceptedTypes.includes(file.type)) {
                setErrors({ file: 'Upload a PDF or DOCX file only.' });
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
            jobId: job.id,
            ...formData,
            appliedDate: new Date().toLocaleDateString(),
            status: 'Applied',
        });
    };

    return (
        <form className="application-form" onSubmit={handleSubmit}>
            <div className="form-intro">
                <div>
                    <p className="eyebrow">Application</p>
                    <h2>Apply for {job.title}</h2>
                    <p>Submit your details and CV to connect with the hiring team.</p>
                </div>
                <div className="progress-pill">Step 1 of 3</div>
            </div>

            <div className="form-card">
                <section className="form-section">
                    <h3>Personal information</h3>
                    <div className="field-grid">
                        <label className="form-group">
                            <span>Full Name</span>
                            <input
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                className={errors.fullName ? 'input-error' : ''}
                            />
                            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                        </label>
                        <label className="form-group">
                            <span>Email</span>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </label>
                        <label className="form-group">
                            <span>Phone</span>
                            <input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(555) 010-2020"
                                className={errors.phone ? 'input-error' : ''}
                            />
                            {errors.phone && <span className="field-error">{errors.phone}</span>}
                        </label>
                    </div>
                </section>

                <section className="form-section">
                    <h3>Experience links</h3>
                    <div className="field-grid">
                        <label className="form-group">
                            <span>LinkedIn profile</span>
                            <input
                                name="linkedIn"
                                type="url"
                                value={formData.linkedIn}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/yourname"
                            />
                        </label>
                        <label className="form-group">
                            <span>Portfolio / Website</span>
                            <input
                                name="portfolio"
                                type="url"
                                value={formData.portfolio}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
                        </label>
                    </div>
                </section>

                <section className="form-section">
                    <h3>Cover letter</h3>
                    <label className="form-group">
                        <span>Message</span>
                        <textarea
                            name="coverLetter"
                            value={formData.coverLetter}
                            onChange={handleChange}
                            placeholder="Briefly introduce yourself and explain why you are a great fit."
                            rows={5}
                        />
                    </label>
                </section>

                <section className="form-section">
                    <h3>Resume upload</h3>
                    <label className="form-group">
                        <span>Upload CV</span>
                        <input
                            name="cvUpload"
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleChange}
                            className={errors.file ? 'input-error' : ''}
                        />
                        <small className="hint-text">Accepted formats: PDF, DOCX. Max size 5 MB.</small>
                        {errors.file && <span className="field-error">{errors.file}</span>}
                    </label>
                </section>
            </div>

            {message && <p className="form-status-message">{message}</p>}

            <div className="form-actions">
                <button type="submit" className="button button-primary">Submit application</button>
                <button type="button" className="button button-secondary" onClick={() => window.history.back()}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ApplicationForm;
