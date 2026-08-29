import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // ✅ Import Link

const API_BASE = import.meta.env.VITE_API_URL || '';

function Profile({ user }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        skills: '',
        preferences: '',
        location: '',
        experience_level: '',
        education: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('jobscout-token');
                const response = await fetch(`${API_BASE}/ai/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        skills: data.skills?.join(', ') || '',
                        preferences: data.preferences?.join(', ') || '',
                        location: data.location || '',
                        experience_level: data.experience_level || '',
                        education: data.education || '',
                    });
                }
            } catch (error) {
                console.error('Profile fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('jobscout-token');
            const response = await fetch(`${API_BASE}/ai/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                    preferences: formData.preferences.split(',').map(s => s.trim()).filter(Boolean),
                    location: formData.location,
                    experience_level: formData.experience_level,
                    education: formData.education,
                }),
            });

            if (response.ok) {
                setMessage('✅ Profile updated successfully!');
            } else {
                setMessage('❌ Failed to update profile.');
            }
        } catch (error) {
            setMessage('❌ An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-state">Loading profile...</div>;
    }

    return (
        <div className="page-content page-profile">
            <div className="section-heading">
                <div>
                    <h1>👤 Your Profile</h1>
                    <p>Update your skills and preferences for better AI job recommendations</p>
                </div>
            </div>

            <div className="profile-card" style={{
                background: 'var(--panel)',
                padding: '28px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, Python, AWS"
                        />
                        <small className="hint-text">e.g. React, Node.js, Python</small>
                    </div>

                    <div className="form-group">
                        <label>Preferences (comma separated)</label>
                        <input
                            type="text"
                            name="preferences"
                            value={formData.preferences}
                            onChange={handleChange}
                            placeholder="Remote, Full-time, Startup"
                        />
                        <small className="hint-text">e.g. Remote, Full-time, Startup</small>
                    </div>

                    <div className="form-group">
                        <label>Preferred Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="San Francisco, Remote, Any"
                        />
                    </div>

                    <div className="form-group">
                        <label>Experience Level</label>
                        <select
                            name="experience_level"
                            value={formData.experience_level}
                            onChange={handleChange}
                        >
                            <option value="">Select experience level</option>
                            <option value="Entry">Entry Level</option>
                            <option value="Junior">Junior</option>
                            <option value="Mid">Mid Level</option>
                            <option value="Senior">Senior</option>
                            <option value="Lead">Lead</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Education</label>
                        <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            placeholder="B.S. Computer Science, MBA, etc."
                        />
                    </div>

                    {message && (
                        <div className="profile-message" style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            background: message.includes('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: message.includes('✅') ? 'var(--success)' : 'var(--danger)',
                        }}>
                            {message}
                        </div>
                    )}

                    <button type="submit" className="button button-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link to="/recommendations" className="button button-secondary">
                    ✨ Get Job Recommendations
                </Link>
            </div>
        </div>
    );
}

export default Profile;