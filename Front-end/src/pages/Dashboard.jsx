import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import {
    Search,
    FileText,
    BriefcaseBusiness,
    Bookmark,
    UserRound,
    Sparkles,
    TrendingUp,
    Target,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Circle,
    Clock3,
    BarChart3,
    ChevronRight,
    Send,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

function Dashboard({ user, savedCount, applicationCount }) {
    const navigate = useNavigate();
    const [profileStrength, setProfileStrength] = useState({ percentage: 0, breakdown: [], reasoning: "" });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("jobscout-token");
                if (!token) return;

                // Profile
                const profRes = await fetch(`${API_BASE}/ai/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let profData = {};
                if (profRes.ok) profData = await profRes.json();

                // Calculate strength
                const items = [
                    { label: "Profile Photo", weight: 10, completed: !!user?.avatar },
                    { label: "Full Name", weight: 10, completed: !!user?.fullName },
                    { label: "Professional Title", weight: 10, completed: !!profData?.title },
                    { label: "Bio / About", weight: 15, completed: profData?.bio?.length > 20 },
                    { label: "Skills", weight: 15, completed: profData?.skills?.length > 0 },
                    { label: "Location", weight: 10, completed: !!profData?.location },
                    { label: "Experience", weight: 15, completed: profData?.experience?.length > 0 },
                    { label: "Education", weight: 10, completed: profData?.education_items?.length > 0 },
                    { label: "Resume Uploaded", weight: 5, completed: false },
                ];
                const total = items.reduce((s, i) => s + i.weight, 0);
                const completed = items.reduce((s, i) => s + (i.completed ? i.weight : 0), 0);
                const pct = Math.min(100, Math.round((completed / total) * 100));

                const breakdown = items.map(i => ({ ...i, status: i.completed ? "completed" : "pending" }));
                const reasoning = pct >= 80 ? "Great profile! You're ready to attract top employers." :
                    pct >= 50 ? "Good progress. Add more details to stand out." :
                        "Complete your profile to get noticed.";

                setProfileStrength({ percentage: pct, breakdown, reasoning });

                // Activity
                const actRes = await fetch(`${API_BASE}/jobs/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (actRes.ok) {
                    const data = await actRes.json();
                    setRecentActivity(data.slice(0, 5).map(a => ({
                        text: `Applied to "${a.title}" at ${a.company}`,
                        time: new Date(a.created_at).toLocaleDateString(),
                        status: a.status || "submitted"
                    })));
                }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchData();
    }, [user]);

    if (loading) return <div className="dashboard-loading"><div className="skeleton" style={{ height: 200 }} /></div>;

    const firstName = user?.fullName?.split(" ")[0] || "there";
    const completedItems = profileStrength.breakdown.filter(i => i.status === "completed").length;

    return (
        <div className="page-content page-dashboard">
            <div className="dashboard-container">
                <DashboardSidebar user={user} />
                <main className="dashboard-main">
                    {/* Hero */}
                    <section className="dashboard-hero">
                        <div className="hero-content">
                            <div className="hero-badge"><Sparkles size={15} /> YOUR CAREER DASHBOARD</div>
                            <h1>Good to see you, <span>{firstName}</span></h1>
                            <p>Your personalized workspace for discovering opportunities, tracking progress, and growing your career.</p>
                            <div className="hero-actions">
                                <button className="hero-primary-btn" onClick={() => navigate("/jobs")}>
                                    <Search size={18} /> Explore Jobs <ArrowRight size={17} />
                                </button>
                                <button className="hero-secondary-btn" onClick={() => navigate("/recommendations")}>
                                    <BrainCircuit size={18} /> Ask Career AI
                                </button>
                            </div>
                        </div>
                        <div className="hero-visual">
                            <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
                            <div className="hero-ai-card">
                                <div className="ai-card-icon"><BrainCircuit size={28} /></div>
                                <div><span>AI Career Assistant</span><strong>Ready to help you grow</strong></div>
                                <div className="ai-status"><span />Online</div>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="dashboard-stats-grid">
                        <div className="premium-stat-card">
                            <div className="stat-icon-wrapper blue"><Bookmark size={21} /></div>
                            <div className="stat-info"><span>Saved Jobs</span><strong>{savedCount || 0}</strong><small>Opportunities you saved</small></div>
                            <ChevronRight className="stat-arrow" size={18} />
                        </div>
                        <div className="premium-stat-card">
                            <div className="stat-icon-wrapper purple"><Send size={21} /></div>
                            <div className="stat-info"><span>Applications</span><strong>{applicationCount || 0}</strong><small>Track your applications</small></div>
                            <ChevronRight className="stat-arrow" size={18} />
                        </div>
                        <div className="premium-stat-card">
                            <div className="stat-icon-wrapper green"><Target size={21} /></div>
                            <div className="stat-info"><span>Profile Score</span><strong>{profileStrength.percentage}%</strong><small>Keep improving your profile</small></div>
                            <ChevronRight className="stat-arrow" size={18} />
                        </div>
                    </section>

                    {/* AI Insight + Profile */}
                    <section className="dashboard-insights-grid">
                        <div className="ai-insight-card">
                            <div className="insight-top">
                                <div className="insight-icon"><Sparkles size={22} /></div>
                                <div><span className="section-eyebrow">AI POWERED INSIGHT</span><h2>Your Career Insight</h2></div>
                            </div>
                            <p className="ai-insight-text">
                                {profileStrength.percentage >= 80
                                    ? "Your profile is looking strong. Continue applying to relevant opportunities and use AI recommendations to discover your best matches."
                                    : "Complete your professional profile to unlock better AI recommendations and increase your chances of matching with relevant opportunities."}
                            </p>
                            <div className="insight-recommendation">
                                <TrendingUp size={19} />
                                <div><strong>Recommended next step</strong><span>Improve your profile to increase your career match accuracy.</span></div>
                            </div>
                            <button className="insight-button" onClick={() => navigate("/recommendations")}>
                                Talk to Career AI <ArrowRight size={17} />
                            </button>
                        </div>

                        <div className="profile-strength-modern">
                            <div className="strength-top">
                                <div><span className="section-eyebrow">PROFILE PROGRESS</span><h2>Profile Strength</h2></div>
                                <BarChart3 size={22} />
                            </div>
                            <div className="strength-main">
                                <div className="progress-ring" style={{ "--progress": `${profileStrength.percentage * 3.6}deg` }}>
                                    <div className="progress-ring-inner"><strong>{profileStrength.percentage}%</strong><span>Complete</span></div>
                                </div>
                                <div className="strength-summary">
                                    <strong>{completedItems} of {profileStrength.breakdown.length}</strong>
                                    <span>Profile sections completed</span>
                                    <button onClick={() => navigate("/profile")}>Improve Profile <ArrowRight size={15} /></button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Checklist */}
                    <section className="profile-checklist-card">
                        <div className="section-header">
                            <div><span className="section-eyebrow">PROFILE CHECKLIST</span><h2>Complete your professional profile</h2></div>
                            <button onClick={() => navigate("/profile")}>View Profile <ArrowRight size={16} /></button>
                        </div>
                        <div className="checklist-grid">
                            {profileStrength.breakdown.map((item, i) => (
                                <div key={i} className={`checklist-item ${item.status}`}>
                                    {item.status === "completed" ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Activity + Quick Actions */}
                    <section className="dashboard-bottom-grid">
                        <div className="activity-card-modern">
                            <div className="section-header">
                                <div><span className="section-eyebrow">ACTIVITY</span><h2>Recent Applications</h2></div>
                                <button onClick={() => navigate("/history")}>View All <ArrowRight size={16} /></button>
                            </div>
                            {recentActivity.length === 0 ? (
                                <div className="modern-empty-state">
                                    <div className="empty-icon"><BriefcaseBusiness size={28} /></div>
                                    <h3>No activity yet</h3>
                                    <p>Start exploring opportunities and your application activity will appear here.</p>
                                    <button onClick={() => navigate("/jobs")}>Explore Jobs</button>
                                </div>
                            ) : (
                                <div className="modern-activity-list">
                                    {recentActivity.map((act, i) => (
                                        <div key={i} className="modern-activity-item">
                                            <div className="activity-icon"><BriefcaseBusiness size={18} /></div>
                                            <div className="activity-info"><p>{act.text}</p><span><Clock3 size={13} /> {act.time}</span></div>
                                            <span className={`status-pill status-${act.status}`}>{act.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="quick-actions-modern">
                            <div><span className="section-eyebrow">QUICK ACCESS</span><h2>Continue your journey</h2></div>
                            <div className="quick-action-list">
                                <button onClick={() => navigate("/recommendations")}>
                                    <div className="quick-icon purple"><Sparkles size={20} /></div>
                                    <div><strong>AI Recommendations</strong><span>Discover jobs matched to you</span></div>
                                    <ArrowRight size={18} />
                                </button>
                                <button onClick={() => navigate("/profile")}>
                                    <div className="quick-icon blue"><UserRound size={20} /></div>
                                    <div><strong>Update Profile</strong><span>Improve your professional profile</span></div>
                                    <ArrowRight size={18} />
                                </button>
                                <button onClick={() => navigate("/post-cv")}>
                                    <div className="quick-icon orange"><FileText size={20} /></div>
                                    <div><strong>Upload CV</strong><span>Make your profile more complete</span></div>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;