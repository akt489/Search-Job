import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';

// ─── Sub-components ──────────────────────────────────────────

function ProfileHeader({ user, profile, onAvatarChange }) {
    return (
        <div className="profile-header glass-card">
            <div className="profile-avatar-section">
                <div className="profile-avatar">
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=4f46e5&color=fff&size=120`}
                        alt={user?.fullName}
                    />
                    <button className="avatar-upload-btn" onClick={onAvatarChange}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </button>
                </div>
                <div className="profile-name-title">
                    <h1>{user?.fullName || 'User'}</h1>
                    <p className="profile-title">{profile?.title || 'Professional'}</p>
                    <div className="profile-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {profile?.location || 'Add your location'}
                    </div>
                </div>
            </div>
            <div className="profile-actions">
                <button className="button button-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Profile
                </button>
            </div>
        </div>
    );
}

function ProfileAbout({ bio, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(bio || '');

    const handleSave = () => {
        onSave('bio', value);
        setIsEditing(false);
    };

    return (
        <div className="profile-section glass-card">
            <div className="section-header">
                <h3>About</h3>
                <button className="button-ghost" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>
            {isEditing ? (
                <div className="edit-bio">
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={4}
                    />
                    <button className="button button-primary" onClick={handleSave}>Save</button>
                </div>
            ) : (
                <p className="profile-bio">{bio || 'No bio added yet. Tell employers about yourself!'}</p>
            )}
        </div>
    );
}

function ProfileSkills({ skills, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(skills?.join(', ') || '');

    const handleSave = () => {
        const skillArray = value.split(',').map(s => s.trim()).filter(Boolean);
        onSave('skills', skillArray);
        setIsEditing(false);
    };

    return (
        <div className="profile-section glass-card">
            <div className="section-header">
                <h3>Skills</h3>
                <button className="button-ghost" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>
            {isEditing ? (
                <div className="edit-skills">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="React, Node.js, Python, AWS..."
                    />
                    <button className="button button-primary" onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div className="skills-tags">
                    {skills?.length > 0 ? (
                        skills.map((skill, i) => (
                            <span key={i} className="skill-tag">{skill}</span>
                        ))
                    ) : (
                        <p className="text-muted">No skills added yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}

function ProfileExperience({ experience, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState(experience || []);

    // ... similar edit pattern

    return (
        <div className="profile-section glass-card">
            <div className="section-header">
                <h3>Experience</h3>
                <button className="button-ghost">Add</button>
            </div>
            {items.length > 0 ? (
                items.map((exp, i) => (
                    <div key={i} className="experience-item">
                        <div className="exp-header">
                            <h4>{exp.title}</h4>
                            <span className="exp-company">{exp.company}</span>
                        </div>
                        <p className="exp-date">{exp.startDate} - {exp.endDate || 'Present'}</p>
                        <p className="exp-description">{exp.description}</p>
                    </div>
                ))
            ) : (
                <p className="text-muted">No experience added yet.</p>
            )}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────

function Profile({ user }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState({
        skills: [],
        preferences: [],
        location: '',
        experience_level: '',
        education: '',
        bio: '',
        title: '',
        experience: [],
        education_items: [],
        projects: [],
        certifications: [],
    });

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('jobscout-token');
            const response = await fetch(`${API_BASE}/ai/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfileUpdate = async (field, value) => {
        setSaving(true);
        try {
            const token = localStorage.getItem('jobscout-token');
            const updatedProfile = { ...profile, [field]: value };
            const response = await fetch(`${API_BASE}/ai/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });

            if (response.ok) {
                setProfile(updatedProfile);
                setMessage('✅ Profile updated!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('❌ Failed to update.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content page-profile">
                <div className="skeleton" style={{ height: '200px', marginBottom: '24px' }} />
                <div className="skeleton" style={{ height: '120px', marginBottom: '16px' }} />
                <div className="skeleton" style={{ height: '120px' }} />
            </div>
        );
    }

    return (
        <div className="page-content page-profile">
            <div className="profile-page">
                <ProfileHeader user={user} profile={profile} />

                <div className="profile-grid">
                    <div className="profile-main">
                        <ProfileAbout bio={profile.bio} onSave={handleProfileUpdate} />
                        <ProfileExperience experience={profile.experience} onSave={handleProfileUpdate} />
                    </div>
                    <div className="profile-sidebar">
                        <ProfileSkills skills={profile.skills} onSave={handleProfileUpdate} />
                        <div className="profile-section glass-card">
                            <h3>Profile Completion</h3>
                            <div className="completion-bar">
                                <div className="completion-fill" style={{ width: '60%' }} />
                            </div>
                            <p className="completion-text">60% complete</p>
                            <ul className="completion-checklist">
                                <li className="completed">✓ Profile photo</li>
                                <li className="completed">✓ Name & title</li>
                                <li className="completed">✓ Skills</li>
                                <li className="pending">○ Experience</li>
                                <li className="pending">○ Education</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {message && <div className="toast">{message}</div>}
            </div>
        </div>
    );
}

export default Profile;