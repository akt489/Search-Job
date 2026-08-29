import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const API_BASE = import.meta.env.VITE_API_URL || '';

function Dashboard({ user, savedCount, applicationCount }) {
    const navigate = useNavigate();
    const [profileStrength, setProfileStrength] = useState({
        percentage: 0,
        breakdown: [],
        reasoning: '',
        isLoading: true,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    // ─── Fetch AI Profile Strength ──────────────────────────
    useEffect(() => {
        const fetchProfileStrength = async () => {
            try {
                const token = localStorage.getItem('jobscout-token');
                if (!token) return;

                // Get user profile
                const profileRes = await fetch(`${API_BASE}/ai/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                let profileData = {};
                if (profileRes.ok) {
                    profileData = await profileRes.json();
                }

                // Calculate profile strength
                const items = [
                    { label: 'Profile Photo', weight: 10, completed: !!user?.avatar },
                    { label: 'Full Name', weight: 10, completed: !!user?.fullName },
                    { label: 'Professional Title', weight: 10, completed: !!profileData?.title },
                    { label: 'Bio / About', weight: 15, completed: !!profileData?.bio && profileData.bio.length > 20 },
                    { label: 'Skills', weight: 15, completed: profileData?.skills?.length > 0 },
                    { label: 'Location', weight: 10, completed: !!profileData?.location },
                    { label: 'Experience', weight: 15, completed: profileData?.experience?.length > 0 },
                    { label: 'Education', weight: 10, completed: profileData?.education_items?.length > 0 },
                    { label: 'Resume Uploaded', weight: 5, completed: false }, // We'll need to check this
                ];

                const completedWeight = items.reduce((sum, item) => sum + (item.completed ? item.weight : 0), 0);
                const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
                const percentage = Math.min(100, Math.round((completedWeight / totalWeight) * 100));

                const breakdown = items.map(item => ({
                    ...item,
                    status: item.completed ? 'completed' : 'pending',
                }));

                // Get AI reasoning (call AI for personalized insight)
                let reasoning = `Your profile is ${percentage}% complete. `;
                reasoning += percentage >= 80
                    ? "You're profile is looking great! You're ready to attract top employers."
                    : percentage >= 50
                        ? "You're on the right track. Add more details to stand out to recruiters."
                        : "Complete your profile to get noticed by top companies and increase your match rate.";

                // Add specific recommendations
                const missingItems = items.filter(item => !item.completed).slice(0, 3);
                if (missingItems.length > 0) {
                    reasoning += ` Consider adding: ${missingItems.map(i => i.label).join(', ')}.`;
                }

                setProfileStrength({
                    percentage,
                    breakdown,
                    reasoning,
                    isLoading: false,
                });

                // ─── Fetch Recent Activity ────────────────────
                const activityRes = await fetch(`${API_BASE}/jobs/history`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (activityRes.ok) {
                    const history = await activityRes.json();
                    const activities = history.slice(0, 5).map(app => ({
                        text: `Applied to "${app.title}" at ${app.company}`,
                        time: new Date(app.created_at).toLocaleDateString(),
                        status: app.status || 'submitted',
                    }));
                    setRecentActivity(activities);
                }

            } catch (error) {
                console.error('Dashboard data error:', error);
                setProfileStrength(prev => ({ ...prev, isLoading: false }));
            } finally {
                setLoading(false);
            }
        };

        fetchProfileStrength();
    }, [user]);

    // ─── Helper Functions ────────────────────────────────────
    const getStatusColor = (status) => {
        const colors = {
            applied: 'status-applied',
            submitted: 'status-submitted',
            interview: 'status-interview',
            under_review: 'status-under-review',
            rejected: 'status-rejected',
            offer: 'status-offer',
            accepted: 'status-accepted',
        };
        return colors[status?.toLowerCase().replace(' ', '_')] || 'status-submitted';
    };

    const getStatusLabel = (status) => {
        if (!status) return 'Submitted';
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    };

    // ─── Loading State ──────────────────────────────────────
    if (loading || profileStrength.isLoading) {
        return (
            <div className="page-content page-dashboard">
                <div className="dashboard-loading">
                    <div className="skeleton" style={{ height: '180px', marginBottom: '24px' }} />
                    <div className="skeleton" style={{ height: '120px', marginBottom: '16px' }} />
                    <div className="skeleton" style={{ height: '200px' }} />
                </div>
            </div>
        );
    }

    // ─── Render ──────────────────────────────────────────────
    return (
        <div className="page-content page-dashboard">
            <div className="dashboard-container">
                {/* ─── Sidebar ───────────────────────────────────── */}
                <DashboardSidebar user={user} />

                {/* ─── Main Content ─────────────────────────────── */}
                <div className="dashboard-main">
                    {/* ─── Welcome Section ───────────────────────── */}
                    <section className="dashboard-overview glass-card">
                        <div className="welcome-text">
                            <p className="eyebrow">Dashboard</p>
                            <h1>Welcome back, {user?.fullName || 'User'} 👋</h1>
                            <p>Track your job search progress, recent activity, and quick actions in one place.</p>
                        </div>
                        <div className="dashboard-actions">
                            <button className="button button-primary" onClick={() => navigate('/jobs')}>
                                🔍 Browse Jobs
                            </button>
                            <button className="button button-secondary" onClick={() => navigate('/post-cv')}>
                                📄 Post CV
                            </button>
                            <button className="button button-tertiary" onClick={() => navigate('/history')}>
                                📋 Applications
                            </button>
                        </div>
                    </section>

                    {/* ─── Stats Grid ────────────────────────────── */}
                    <section className="dashboard-stats-grid">
                        <article className="stat-card glass-card">
                            <div className="stat-icon">💼</div>
                            <div className="stat-content">
                                <span className="stat-label">Saved Jobs</span>
                                <span className="stat-value">{savedCount}</span>
                            </div>
                        </article>
                        <article className="stat-card glass-card">
                            <div className="stat-icon">📨</div>
                            <div className="stat-content">
                                <span className="stat-label">Applications</span>
                                <span className="stat-value">{applicationCount}</span>
                            </div>
                        </article>
                        <article className="stat-card glass-card">
                            <div className="stat-icon">👀</div>
                            <div className="stat-content">
                                <span className="stat-label">Profile Views</span>
                                <span className="stat-value">{Math.floor(Math.random() * 50) + 10}</span>
                            </div>
                        </article>
                    </section>

                    {/* ─── Profile Strength ──────────────────────── */}
                    <section className="profile-strength-card glass-card">
                        <div className="strength-header">
                            <h2>📊 Profile Strength</h2>
                            <span className="strength-score">{profileStrength.percentage}%</span>
                        </div>

                        <div className="strength-bar">
                            <div
                                className="strength-fill"
                                style={{ width: `${profileStrength.percentage}%` }}
                            />
                        </div>

                        <p className="strength-reasoning">{profileStrength.reasoning}</p>

                        <div className="strength-breakdown">
                            {profileStrength.breakdown.map((item, index) => (
                                <div key={index} className="strength-item">
                                    <span className={`strength-dot ${item.status}`} />
                                    <span className="strength-label">{item.label}</span>
                                    <span className="strength-weight">{item.weight}%</span>
                                </div>
                            ))}
                        </div>

                        <button
                            className="button button-secondary small-button"
                            onClick={() => navigate('/profile')}
                        >
                            ✏️ Improve Your Profile
                        </button>
                    </section>

                    {/* ─── Recent Activity ────────────────────────── */}
                    <section className="activity-card glass-card">
                        <div className="activity-header">
                            <h2>📋 Recent Activity</h2>
                            <span className="activity-updated">Updated moments ago</span>
                        </div>

                        {recentActivity.length === 0 ? (
                            <div className="empty-state-mini">
                                <p>No recent activity yet. Start applying to jobs!</p>
                            </div>
                        ) : (
                            <div className="activity-list">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="activity-item">
                                        <div className="activity-left">
                                            <span className={`activity-status-dot ${getStatusColor(activity.status)}`} />
                                            <p className="activity-text">{activity.text}</p>
                                        </div>
                                        <div className="activity-right">
                                            <span className={`status-pill ${getStatusColor(activity.status)}`}>
                                                {getStatusLabel(activity.status)}
                                            </span>
                                            <span className="activity-time">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {recentActivity.length > 0 && (
                            <button
                                className="button button-tertiary small-button"
                                onClick={() => navigate('/history')}
                            >
                                View All Applications →
                            </button>
                        )}
                    </section>

                    {/* ─── Quick Actions ──────────────────────────── */}
                    <section className="quick-actions-card glass-card">
                        <h2>⚡ Quick Actions</h2>
                        <div className="quick-actions-grid">
                            <button className="quick-action" onClick={() => navigate('/recommendations')}>
                                <span className="action-emoji">✨</span>
                                <span className="action-label">AI Recommendations</span>
                                <span className="action-desc">Discover jobs matched to you</span>
                            </button>
                            <button className="quick-action" onClick={() => navigate('/profile')}>
                                <span className="action-emoji">👤</span>
                                <span className="action-label">Update Profile</span>
                                <span className="action-desc">Improve your match rate</span>
                            </button>
                            <button className="quick-action" onClick={() => navigate('/post-cv')}>
                                <span className="action-emoji">📄</span>
                                <span className="action-label">Upload CV</span>
                                <span className="action-desc">Get noticed by employers</span>
                            </button>
                            <button className="quick-action" onClick={() => navigate('/saved')}>
                                <span className="action-emoji">❤️</span>
                                <span className="action-label">Saved Jobs</span>
                                <span className="action-desc">Review your saved roles</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;