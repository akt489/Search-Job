import DashboardSidebar from '../components/DashboardSidebar';
import { useNavigate } from "react-router-dom";

function Dashboard({ user, savedCount, applicationCount }) {
    const navigate = useNavigate();

    return (
        <div className="page-content page-dashboard">
            <DashboardSidebar />
            <div className="dashboard-main">
                <section className="dashboard-overview">
                    <div>
                        <p className="eyebrow">Dashboard</p>
                        <h1>Welcome back, {user?.name || 'Applicant'}</h1>
                        <p>Track your job search progress, recent activity, and quick actions in one place.</p>
                    </div>
                    <div className="dashboard-actions">
                        <button className="button button-primary" onClick={() => navigate('/jobs')}>
                            Browse Jobs
                        </button>
                        <button className="button button-secondary" onClick={() => navigate('/post-cv')}>
                            Post CV
                        </button>
                        <button className="button button-tertiary" onClick={() => navigate('/history')}>
                            View Applications
                        </button>
                    </div>
                </section>

                <section className="dashboard-summary-grid">
                    <article className="dashboard-card summary-card">
                        <span className="summary-label">Total saved roles</span>
                        <h2>{savedCount}</h2>
                        <p>Roles you have bookmarked for review later.</p>
                    </article>
                    <article className="dashboard-card summary-card">
                        <span className="summary-label">Applications</span>
                        <h2>{applicationCount}</h2>
                        <p>Applications submitted or currently in review.</p>
                    </article>
                    <article className="dashboard-card summary-card">
                        <span className="summary-label">Profile strength</span>
                        <h2>78%</h2>
                        <p>Complete your profile to increase your match rate.</p>
                    </article>
                </section>

                <section className="dashboard-card activity-card">
                    <div className="activity-header">
                        <h2>Recent activity</h2>
                        <span>Updated moments ago</span>
                    </div>
                    <div className="activity-list">
                        <div className="activity-item">
                            <p className="activity-text">You saved 3 new jobs this week.</p>
                            <span className="activity-time">2h ago</span>
                        </div>
                        <div className="activity-item">
                            <p className="activity-text">Your application was viewed by a hiring manager.</p>
                            <span className="activity-time">1 day ago</span>
                        </div>
                        <div className="activity-item">
                            <p className="activity-text">A new match was found for your profile.</p>
                            <span className="activity-time">3 days ago</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
