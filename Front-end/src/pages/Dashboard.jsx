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

    const [profileStrength, setProfileStrength] = useState({
        percentage: 0,
        breakdown: [],
        reasoning: "",
        isLoading: true,
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileStrength = async () => {
            try {
                const token = localStorage.getItem("jobscout-token");
                if (!token) return;

                const profileRes = await fetch(`${API_BASE}/ai/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                let profileData = {};

                if (profileRes.ok) {
                    profileData = await profileRes.json();
                }

                const items = [
                    {
                        label: "Profile Photo",
                        weight: 10,
                        completed: !!user?.avatar,
                    },
                    {
                        label: "Full Name",
                        weight: 10,
                        completed: !!user?.fullName,
                    },
                    {
                        label: "Professional Title",
                        weight: 10,
                        completed: !!profileData?.title,
                    },
                    {
                        label: "Bio / About",
                        weight: 15,
                        completed:
                            !!profileData?.bio &&
                            profileData.bio.length > 20,
                    },
                    {
                        label: "Skills",
                        weight: 15,
                        completed: profileData?.skills?.length > 0,
                    },
                    {
                        label: "Location",
                        weight: 10,
                        completed: !!profileData?.location,
                    },
                    {
                        label: "Experience",
                        weight: 15,
                        completed: profileData?.experience?.length > 0,
                    },
                    {
                        label: "Education",
                        weight: 10,
                        completed:
                            profileData?.education_items?.length > 0,
                    },
                    {
                        label: "Resume Uploaded",
                        weight: 5,
                        completed: false,
                    },
                ];

                const completedWeight = items.reduce(
                    (sum, item) =>
                        sum + (item.completed ? item.weight : 0),
                    0
                );

                const totalWeight = items.reduce(
                    (sum, item) => sum + item.weight,
                    0
                );

                const percentage = Math.min(
                    100,
                    Math.round((completedWeight / totalWeight) * 100)
                );

                const breakdown = items.map((item) => ({
                    ...item,
                    status: item.completed
                        ? "completed"
                        : "pending",
                }));

                let reasoning = `Your profile is ${percentage}% complete. `;

                reasoning +=
                    percentage >= 80
                        ? "Your profile is looking strong and ready to attract opportunities."
                        : percentage >= 50
                            ? "You're making great progress. A few improvements could significantly increase your visibility."
                            : "Complete more of your profile to improve your recommendations and job matches.";

                const missingItems = items
                    .filter((item) => !item.completed)
                    .slice(0, 3);

                if (missingItems.length > 0) {
                    reasoning += ` Focus on: ${missingItems
                        .map((item) => item.label)
                        .join(", ")}.`;
                }

                setProfileStrength({
                    percentage,
                    breakdown,
                    reasoning,
                    isLoading: false,
                });

                const activityRes = await fetch(
                    `${API_BASE}/jobs/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (activityRes.ok) {
                    const history = await activityRes.json();

                    const activities = history
                        .slice(0, 5)
                        .map((app) => ({
                            text: `Applied to "${app.title}" at ${app.company}`,
                            time: new Date(
                                app.created_at
                            ).toLocaleDateString(),
                            status: app.status || "submitted",
                        }));

                    setRecentActivity(activities);
                }
            } catch (error) {
                console.error("Dashboard data error:", error);

                setProfileStrength((prev) => ({
                    ...prev,
                    isLoading: false,
                }));
            } finally {
                setLoading(false);
            }
        };

        fetchProfileStrength();
    }, [user]);

    const getStatusColor = (status) => {
        const colors = {
            applied: "status-applied",
            submitted: "status-submitted",
            interview: "status-interview",
            under_review: "status-under-review",
            rejected: "status-rejected",
            offer: "status-offer",
            accepted: "status-accepted",
        };

        return (
            colors[
            status?.toLowerCase().replace(" ", "_")
            ] || "status-submitted"
        );
    };

    const getStatusLabel = (status) => {
        if (!status) return "Submitted";

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1).replace("_", " ")
        );
    };

    if (loading || profileStrength.isLoading) {
        return (
            <div className="page-content page-dashboard">
                <div className="dashboard-loading">
                    <div className="skeleton skeleton-hero" />
                    <div className="skeleton-grid">
                        <div className="skeleton skeleton-stat" />
                        <div className="skeleton skeleton-stat" />
                        <div className="skeleton skeleton-stat" />
                    </div>
                    <div className="skeleton skeleton-large" />
                </div>
            </div>
        );
    }

    const firstName =
        user?.fullName?.split(" ")[0] || "there";

    const completedItems =
        profileStrength.breakdown.filter(
            (item) => item.status === "completed"
        ).length;

    return (
        <div className="page-content page-dashboard">
            <div className="dashboard-container">

                <DashboardSidebar user={user} />

                <main className="dashboard-main">

                    {/* HERO */}
                    <section className="dashboard-hero">
                        <div className="hero-content">

                            <div className="hero-badge">
                                <Sparkles size={15} />
                                <span>YOUR CAREER DASHBOARD</span>
                            </div>

                            <h1>
                                Good to see you,
                                <span> {firstName}</span>
                            </h1>

                            <p>
                                Your personalized workspace for discovering
                                opportunities, tracking progress, and growing
                                your career.
                            </p>

                            <div className="hero-actions">
                                <button
                                    className="hero-primary-btn"
                                    onClick={() => navigate("/jobs")}
                                >
                                    <Search size={18} />
                                    Explore Jobs
                                    <ArrowRight size={17} />
                                </button>

                                <button
                                    className="hero-secondary-btn"
                                    onClick={() => navigate("/ai-chat")}
                                >
                                    <BrainCircuit size={18} />
                                    Ask Career AI
                                </button>
                            </div>
                        </div>

                        <div className="hero-visual">

                            <div className="hero-orb orb-one" />
                            <div className="hero-orb orb-two" />

                            <div className="hero-ai-card">
                                <div className="ai-card-icon">
                                    <BrainCircuit size={28} />
                                </div>

                                <div>
                                    <span>AI Career Assistant</span>
                                    <strong>Ready to help you grow</strong>
                                </div>

                                <div className="ai-status">
                                    <span />
                                    Online
                                </div>
                            </div>

                        </div>
                    </section>


                    {/* STATS */}
                    <section className="dashboard-stats-grid">

                        <article className="premium-stat-card">
                            <div className="stat-icon-wrapper blue">
                                <Bookmark size={21} />
                            </div>

                            <div className="stat-info">
                                <span>Saved Jobs</span>
                                <strong>{savedCount || 0}</strong>
                                <small>
                                    Opportunities you saved
                                </small>
                            </div>

                            <ChevronRight className="stat-arrow" size={18} />
                        </article>


                        <article className="premium-stat-card">
                            <div className="stat-icon-wrapper purple">
                                <Send size={21} />
                            </div>

                            <div className="stat-info">
                                <span>Applications</span>
                                <strong>{applicationCount || 0}</strong>
                                <small>
                                    Track your applications
                                </small>
                            </div>

                            <ChevronRight className="stat-arrow" size={18} />
                        </article>


                        <article className="premium-stat-card">
                            <div className="stat-icon-wrapper green">
                                <Target size={21} />
                            </div>

                            <div className="stat-info">
                                <span>Profile Score</span>
                                <strong>
                                    {profileStrength.percentage}%
                                </strong>
                                <small>
                                    Keep improving your profile
                                </small>
                            </div>

                            <ChevronRight className="stat-arrow" size={18} />
                        </article>

                    </section>


                    {/* AI INSIGHT + PROFILE */}
                    <section className="dashboard-insights-grid">

                        {/* AI INSIGHT */}
                        <article className="ai-insight-card">

                            <div className="insight-top">

                                <div className="insight-icon">
                                    <Sparkles size={22} />
                                </div>

                                <div>
                                    <span className="section-eyebrow">
                                        AI POWERED INSIGHT
                                    </span>

                                    <h2>Your Career Insight</h2>
                                </div>

                            </div>

                            <p className="ai-insight-text">
                                {profileStrength.percentage >= 80
                                    ? "Your profile is looking strong. Continue applying to relevant opportunities and use AI recommendations to discover your best matches."
                                    : "Complete your professional profile to unlock better AI recommendations and increase your chances of matching with relevant opportunities."}
                            </p>

                            <div className="insight-recommendation">
                                <TrendingUp size={19} />

                                <div>
                                    <strong>Recommended next step</strong>
                                    <span>
                                        Improve your profile to increase your
                                        career match accuracy.
                                    </span>
                                </div>
                            </div>

                            <button
                                className="insight-button"
                                onClick={() => navigate("/ai-chat")}
                            >
                                Talk to Career AI
                                <ArrowRight size={17} />
                            </button>

                        </article>


                        {/* PROFILE STRENGTH */}
                        <article className="profile-strength-modern">

                            <div className="strength-top">
                                <div>
                                    <span className="section-eyebrow">
                                        PROFILE PROGRESS
                                    </span>

                                    <h2>Profile Strength</h2>
                                </div>

                                <BarChart3 size={22} />
                            </div>


                            <div className="strength-main">

                                <div
                                    className="progress-ring"
                                    style={{
                                        "--progress":
                                            `${profileStrength.percentage * 3.6}deg`,
                                    }}
                                >
                                    <div className="progress-ring-inner">
                                        <strong>
                                            {profileStrength.percentage}%
                                        </strong>
                                        <span>Complete</span>
                                    </div>
                                </div>


                                <div className="strength-summary">
                                    <strong>
                                        {completedItems} of{" "}
                                        {profileStrength.breakdown.length}
                                    </strong>

                                    <span>
                                        Profile sections completed
                                    </span>

                                    <button
                                        onClick={() =>
                                            navigate("/profile")
                                        }
                                    >
                                        Improve Profile
                                        <ArrowRight size={15} />
                                    </button>
                                </div>

                            </div>

                        </article>

                    </section>


                    {/* PROFILE CHECKLIST */}
                    <section className="profile-checklist-card">

                        <div className="section-header">
                            <div>
                                <span className="section-eyebrow">
                                    PROFILE CHECKLIST
                                </span>

                                <h2>
                                    Complete your professional profile
                                </h2>
                            </div>

                            <button
                                onClick={() => navigate("/profile")}
                            >
                                View Profile
                                <ArrowRight size={16} />
                            </button>
                        </div>


                        <div className="checklist-grid">

                            {profileStrength.breakdown.map(
                                (item, index) => (
                                    <div
                                        key={index}
                                        className={`checklist-item ${item.status
                                            }`}
                                    >

                                        {item.status === "completed" ? (
                                            <CheckCircle2 size={19} />
                                        ) : (
                                            <Circle size={19} />
                                        )}

                                        <span>{item.label}</span>

                                    </div>
                                )
                            )}

                        </div>

                    </section>


                    {/* RECENT ACTIVITY */}
                    <section className="dashboard-bottom-grid">

                        <article className="activity-card-modern">

                            <div className="section-header">

                                <div>
                                    <span className="section-eyebrow">
                                        ACTIVITY
                                    </span>

                                    <h2>Recent Applications</h2>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate("/history")
                                    }
                                >
                                    View All
                                    <ArrowRight size={16} />
                                </button>

                            </div>


                            {recentActivity.length === 0 ? (

                                <div className="modern-empty-state">

                                    <div className="empty-icon">
                                        <BriefcaseBusiness size={28} />
                                    </div>

                                    <h3>No activity yet</h3>

                                    <p>
                                        Start exploring opportunities and your
                                        application activity will appear here.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate("/jobs")
                                        }
                                    >
                                        Explore Jobs
                                    </button>

                                </div>

                            ) : (

                                <div className="modern-activity-list">

                                    {recentActivity.map(
                                        (activity, index) => (

                                            <div
                                                key={index}
                                                className="modern-activity-item"
                                            >

                                                <div className="activity-icon">
                                                    <BriefcaseBusiness size={18} />
                                                </div>

                                                <div className="activity-info">
                                                    <p>{activity.text}</p>

                                                    <span>
                                                        <Clock3 size={13} />
                                                        {activity.time}
                                                    </span>
                                                </div>

                                                <span
                                                    className={`status-pill ${getStatusColor(
                                                        activity.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        activity.status
                                                    )}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </article>


                        {/* QUICK ACTIONS */}
                        <article className="quick-actions-modern">

                            <div>
                                <span className="section-eyebrow">
                                    QUICK ACCESS
                                </span>

                                <h2>Continue your journey</h2>
                            </div>


                            <div className="quick-action-list">

                                <button
                                    onClick={() =>
                                        navigate("/recommendations")
                                    }
                                >
                                    <div className="quick-icon purple">
                                        <Sparkles size={20} />
                                    </div>

                                    <div>
                                        <strong>AI Recommendations</strong>
                                        <span>
                                            Discover jobs matched to you
                                        </span>
                                    </div>

                                    <ArrowRight size={18} />
                                </button>


                                <button
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                >
                                    <div className="quick-icon blue">
                                        <UserRound size={20} />
                                    </div>

                                    <div>
                                        <strong>Update Profile</strong>
                                        <span>
                                            Improve your professional profile
                                        </span>
                                    </div>

                                    <ArrowRight size={18} />
                                </button>


                                <button
                                    onClick={() =>
                                        navigate("/post-cv")
                                    }
                                >
                                    <div className="quick-icon orange">
                                        <FileText size={20} />
                                    </div>

                                    <div>
                                        <strong>Upload CV</strong>
                                        <span>
                                            Make your profile more complete
                                        </span>
                                    </div>

                                    <ArrowRight size={18} />
                                </button>

                            </div>

                        </article>

                    </section>

                </main>
            </div>
        </div>
    );
}

export default Dashboard;