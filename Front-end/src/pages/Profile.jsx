import { useState, useEffect, useMemo } from "react";
import {
    Camera,
    MapPin,
    Pencil,
    Save,
    X,
    Plus,
    BriefcaseBusiness,
    GraduationCap,
    Code2,
    Award,
    Sparkles,
    CheckCircle2,
    Circle,
    UserRound,
    Mail,
    Globe,
    ChevronRight,
    Loader2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";


/* =========================================================
   PROFILE HEADER
========================================================= */

function ProfileHeader({ user, profile, onEdit }) {
    const initials =
        user?.fullName
            ?.split(" ")
            .slice(0, 2)
            .map((name) => name[0])
            .join("")
            .toUpperCase() || "U";

    return (
        <section className="profile-hero-modern">

            {/* Decorative background */}

            <div className="profile-hero-pattern" />

            <div className="profile-hero-content">

                <div className="profile-avatar-wrapper">

                    <div className="profile-avatar-modern">

                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.fullName}
                            />
                        ) : (
                            <span>{initials}</span>
                        )}

                    </div>

                    <button
                        className="avatar-camera-btn"
                        aria-label="Change profile photo"
                    >
                        <Camera size={16} />
                    </button>

                </div>


                <div className="profile-identity">

                    <div className="profile-name-row">

                        <h1>
                            {user?.fullName || "Your Name"}
                        </h1>

                        <CheckCircle2
                            size={20}
                            className="profile-verified-icon"
                        />

                    </div>


                    <p className="profile-professional-title">
                        {profile?.title ||
                            "Add your professional title"}
                    </p>


                    <div className="profile-basic-info">

                        <span>
                            <MapPin size={15} />

                            {profile?.location ||
                                "Add location"}
                        </span>


                        {user?.email && (
                            <span>
                                <Mail size={15} />

                                {user.email}
                            </span>
                        )}

                    </div>

                </div>


                <div className="profile-hero-actions">

                    <button
                        className="profile-edit-main-btn"
                        onClick={onEdit}
                    >
                        <Pencil size={17} />

                        Edit Profile
                    </button>

                </div>

            </div>

        </section>
    );
}


/* =========================================================
   ABOUT SECTION
========================================================= */

function ProfileAbout({ bio, onSave }) {

    const [editing, setEditing] =
        useState(false);

    const [value, setValue] =
        useState(bio || "");

    useEffect(() => {
        setValue(bio || "");
    }, [bio]);


    const handleSave = () => {
        onSave("bio", value);
        setEditing(false);
    };


    return (
        <section className="profile-section-modern">

            <div className="profile-section-header">

                <div className="section-title-group">

                    <div className="section-icon">
                        <UserRound size={18} />
                    </div>

                    <h2>About</h2>

                </div>


                {!editing && (
                    <button
                        className="section-edit-btn"
                        onClick={() => setEditing(true)}
                    >
                        <Pencil size={15} />
                        Edit
                    </button>
                )}

            </div>


            {editing ? (

                <div className="profile-edit-area">

                    <textarea
                        value={value}
                        onChange={(e) =>
                            setValue(e.target.value)
                        }
                        placeholder="Tell employers about yourself, your experience, and career goals..."
                        rows={5}
                    />

                    <div className="edit-actions">

                        <button
                            className="cancel-edit-btn"
                            onClick={() =>
                                setEditing(false)
                            }
                        >
                            <X size={16} />
                            Cancel
                        </button>

                        <button
                            className="save-edit-btn"
                            onClick={handleSave}
                        >
                            <Save size={16} />
                            Save Changes
                        </button>

                    </div>

                </div>

            ) : (

                <div className="about-content">

                    {bio ? (

                        <p>{bio}</p>

                    ) : (

                        <div className="empty-section">

                            <Sparkles size={22} />

                            <div>

                                <strong>
                                    Tell your professional story
                                </strong>

                                <p>
                                    Add a short introduction about
                                    your skills, experience, and
                                    career goals.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setEditing(true)
                                }
                            >
                                Add About
                                <ChevronRight size={16} />
                            </button>

                        </div>

                    )}

                </div>

            )}

        </section>
    );
}


/* =========================================================
   SKILLS
========================================================= */

function ProfileSkills({ skills = [], onSave }) {

    const [editing, setEditing] =
        useState(false);

    const [value, setValue] =
        useState(skills.join(", "));

    useEffect(() => {
        setValue(skills.join(", "));
    }, [skills]);


    const handleSave = () => {

        const skillArray =
            value
                .split(",")
                .map((skill) =>
                    skill.trim()
                )
                .filter(Boolean);

        onSave(
            "skills",
            skillArray
        );

        setEditing(false);
    };


    return (
        <section className="profile-section-modern skills-section">

            <div className="profile-section-header">

                <div className="section-title-group">

                    <div className="section-icon purple">
                        <Code2 size={18} />
                    </div>

                    <h2>Skills</h2>

                    {skills.length > 0 && (
                        <span className="section-count">
                            {skills.length}
                        </span>
                    )}

                </div>


                {!editing && (
                    <button
                        className="section-edit-btn"
                        onClick={() =>
                            setEditing(true)
                        }
                    >
                        <Pencil size={15} />
                    </button>
                )}

            </div>


            {editing ? (

                <div className="profile-edit-area">

                    <input
                        value={value}
                        onChange={(e) =>
                            setValue(e.target.value)
                        }
                        placeholder="React, Node.js, Python..."
                    />

                    <small>
                        Separate skills using commas
                    </small>


                    <div className="edit-actions">

                        <button
                            className="cancel-edit-btn"
                            onClick={() =>
                                setEditing(false)
                            }
                        >
                            Cancel
                        </button>

                        <button
                            className="save-edit-btn"
                            onClick={handleSave}
                        >
                            Save
                        </button>

                    </div>

                </div>

            ) : (

                <div className="skills-modern-list">

                    {skills.length > 0 ? (

                        skills.map((skill, index) => (

                            <span
                                key={`${skill}-${index}`}
                                className="skill-pill-modern"
                            >
                                {skill}
                            </span>

                        ))

                    ) : (

                        <div className="compact-empty">

                            <Code2 size={20} />

                            <span>
                                Add skills to improve
                                your recommendations.
                            </span>

                        </div>

                    )}

                </div>

            )}

        </section>
    );
}


/* =========================================================
   EXPERIENCE
========================================================= */

function ProfileExperience({
    experience = [],
}) {

    return (
        <section className="profile-section-modern">

            <div className="profile-section-header">

                <div className="section-title-group">

                    <div className="section-icon orange">
                        <BriefcaseBusiness size={18} />
                    </div>

                    <h2>Experience</h2>

                </div>


                <button className="section-add-btn">

                    <Plus size={16} />

                    Add Experience

                </button>

            </div>


            {experience.length > 0 ? (

                <div className="timeline-list">

                    {experience.map(
                        (exp, index) => (

                            <div
                                className="timeline-item"
                                key={index}
                            >

                                <div className="timeline-marker">
                                    <BriefcaseBusiness
                                        size={15}
                                    />
                                </div>


                                <div className="timeline-content">

                                    <div className="timeline-heading">

                                        <div>

                                            <h3>
                                                {exp.title}
                                            </h3>

                                            <span>
                                                {exp.company}
                                            </span>

                                        </div>

                                        <button>
                                            <Pencil size={15} />
                                        </button>

                                    </div>


                                    <p className="timeline-date">

                                        {exp.startDate}

                                        {" — "}

                                        {exp.endDate ||
                                            "Present"}

                                    </p>


                                    {exp.description && (

                                        <p className="timeline-description">
                                            {exp.description}
                                        </p>

                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            ) : (

                <div className="profile-empty-large">

                    <div className="empty-icon">
                        <BriefcaseBusiness
                            size={26}
                        />
                    </div>

                    <h3>
                        Add your experience
                    </h3>

                    <p>
                        Show employers your work
                        history and professional
                        achievements.
                    </p>

                    <button className="section-add-btn">
                        <Plus size={16} />
                        Add Experience
                    </button>

                </div>

            )}

        </section>
    );
}


/* =========================================================
   EDUCATION
========================================================= */

function ProfileEducation({
    education = [],
}) {

    return (
        <section className="profile-section-modern">

            <div className="profile-section-header">

                <div className="section-title-group">

                    <div className="section-icon green">
                        <GraduationCap size={18} />
                    </div>

                    <h2>Education</h2>

                </div>

                <button className="section-add-btn">
                    <Plus size={16} />
                    Add Education
                </button>

            </div>


            {education.length > 0 ? (

                education.map(
                    (item, index) => (

                        <div
                            className="education-item"
                            key={index}
                        >

                            <div className="education-icon">
                                <GraduationCap size={20} />
                            </div>

                            <div>

                                <h3>
                                    {item.degree ||
                                        item.title}
                                </h3>

                                <p>
                                    {item.school ||
                                        item.institution}
                                </p>

                                <span>
                                    {item.startDate}

                                    {item.endDate &&
                                        ` — ${item.endDate}`}
                                </span>

                            </div>

                        </div>

                    )
                )

            ) : (

                <div className="compact-empty">

                    <GraduationCap size={20} />

                    <span>
                        Add your education background.
                    </span>

                </div>

            )}

        </section>
    );
}


/* =========================================================
   PROJECTS
========================================================= */

function ProfileProjects({
    projects = [],
}) {

    return (
        <section className="profile-section-modern">

            <div className="profile-section-header">

                <div className="section-title-group">

                    <div className="section-icon blue">
                        <Code2 size={18} />
                    </div>

                    <h2>Projects</h2>

                </div>

                <button className="section-add-btn">
                    <Plus size={16} />
                    Add Project
                </button>

            </div>


            {projects.length > 0 ? (

                <div className="projects-grid">

                    {projects.map(
                        (project, index) => (

                            <article
                                className="project-card-profile"
                                key={index}
                            >

                                <div className="project-card-icon">
                                    <Code2 size={20} />
                                </div>

                                <h3>
                                    {project.name ||
                                        project.title}
                                </h3>

                                <p>
                                    {project.description}
                                </p>


                                {project.link && (

                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Project
                                        <ChevronRight
                                            size={15}
                                        />
                                    </a>

                                )}

                            </article>

                        )
                    )}

                </div>

            ) : (

                <div className="compact-empty">

                    <Code2 size={20} />

                    <span>
                        Showcase projects you've built.
                    </span>

                </div>

            )}

        </section>
    );
}


/* =========================================================
   PROFILE COMPLETION
========================================================= */

function ProfileCompletion({
    user,
    profile,
}) {

    const checklist =
        useMemo(
            () => [
                {
                    label: "Profile photo",
                    completed: Boolean(
                        user?.avatar
                    ),
                },
                {
                    label: "Professional title",
                    completed: Boolean(
                        profile.title
                    ),
                },
                {
                    label: "About section",
                    completed: Boolean(
                        profile.bio
                    ),
                },
                {
                    label: "Skills",
                    completed:
                        profile.skills?.length > 0,
                },
                {
                    label: "Experience",
                    completed:
                        profile.experience?.length > 0,
                },
                {
                    label: "Education",
                    completed:
                        profile.education_items
                            ?.length > 0,
                },
            ],
            [user, profile]
        );


    const completedCount =
        checklist.filter(
            (item) => item.completed
        ).length;


    const percentage =
        Math.round(
            (completedCount /
                checklist.length) *
            100
        );


    return (
        <section className="profile-completion-card">

            <div className="completion-header">

                <div>

                    <span className="section-label">
                        PROFILE STRENGTH
                    </span>

                    <h3>
                        {percentage >= 80
                            ? "Looking great!"
                            : "Complete your profile"}
                    </h3>

                </div>


                <div className="completion-score">
                    {percentage}%
                </div>

            </div>


            <div className="completion-progress">

                <div
                    className="completion-progress-fill"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>


            <div className="completion-list">

                {checklist.map(
                    (item) => (

                        <div
                            key={item.label}
                            className={
                                item.completed
                                    ? "completion-item completed"
                                    : "completion-item"
                            }
                        >

                            {item.completed ? (
                                <CheckCircle2
                                    size={17}
                                />
                            ) : (
                                <Circle size={17} />
                            )}

                            <span>
                                {item.label}
                            </span>

                        </div>

                    )
                )}

            </div>

        </section>
    );
}


/* =========================================================
   MAIN PROFILE
========================================================= */

function Profile({ user }) {

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");


    const [profile, setProfile] =
        useState({
            skills: [],
            preferences: [],
            location: "",
            experience_level: "",
            education: "",
            bio: "",
            title: "",
            experience: [],
            education_items: [],
            projects: [],
            certifications: [],
        });


    /* FETCH PROFILE */

    const fetchProfile =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "jobscout-token"
                    );


                const response =
                    await fetch(
                        `${API_BASE}/ai/profile`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );


                if (response.ok) {

                    const data =
                        await response.json();

                    setProfile((prev) => ({
                        ...prev,
                        ...data,
                    }));

                }

            } catch (error) {

                console.error(
                    "Profile fetch error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {
        fetchProfile();
    }, []);


    /* UPDATE PROFILE */

    const handleProfileUpdate =
        async (field, value) => {

            setSaving(true);

            try {

                const token =
                    localStorage.getItem(
                        "jobscout-token"
                    );


                const updatedProfile = {
                    ...profile,
                    [field]: value,
                };


                const response =
                    await fetch(
                        `${API_BASE}/ai/profile`,
                        {
                            method: "POST",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    updatedProfile
                                ),
                        }
                    );


                if (response.ok) {

                    setProfile(
                        updatedProfile
                    );

                    setMessage(
                        "Profile updated successfully!"
                    );

                } else {

                    throw new Error(
                        "Update failed"
                    );

                }

            } catch (error) {

                setMessage(
                    "Unable to update profile."
                );

            } finally {

                setSaving(false);

                setTimeout(
                    () => setMessage(""),
                    3000
                );

            }

        };


    /* LOADING */

    if (loading) {

        return (

            <div className="page-content page-profile">

                <div className="profile-loading">

                    <div className="profile-skeleton hero" />

                    <div className="profile-skeleton content" />

                    <div className="profile-skeleton content" />

                </div>

            </div>

        );

    }


    return (

        <div className="page-content page-profile">

            <div className="profile-page-modern">


                {/* HEADER */}

                <ProfileHeader
                    user={user}
                    profile={profile}
                    onEdit={() =>
                        window.scrollTo({
                            top: 300,
                            behavior: "smooth",
                        })
                    }
                />


                {/* CONTENT */}

                <div className="profile-layout-modern">


                    {/* MAIN */}

                    <main className="profile-main-modern">

                        <ProfileAbout
                            bio={profile.bio}
                            onSave={
                                handleProfileUpdate
                            }
                        />


                        <ProfileExperience
                            experience={
                                profile.experience
                            }
                        />


                        <ProfileEducation
                            education={
                                profile.education_items
                            }
                        />


                        <ProfileProjects
                            projects={
                                profile.projects
                            }
                        />

                    </main>


                    {/* SIDEBAR */}

                    <aside className="profile-sidebar-modern">

                        <ProfileSkills
                            skills={
                                profile.skills
                            }
                            onSave={
                                handleProfileUpdate
                            }
                        />


                        <ProfileCompletion
                            user={user}
                            profile={profile}
                        />


                        {/* AI PROFILE TIP */}

                        <div className="profile-ai-tip">

                            <div className="profile-ai-tip-icon">
                                <Sparkles size={20} />
                            </div>

                            <div>

                                <span>
                                    AI CAREER TIP
                                </span>

                                <h4>
                                    A complete profile helps
                                    AI find better job matches.
                                </h4>

                                <button>
                                    Improve my profile
                                    <ChevronRight size={15} />
                                </button>

                            </div>

                        </div>

                    </aside>

                </div>


                {/* SAVING INDICATOR */}

                {saving && (

                    <div className="profile-saving">

                        <Loader2
                            size={17}
                            className="spin"
                        />

                        Saving changes...

                    </div>

                )}


                {/* TOAST */}

                {message && (

                    <div className="profile-toast">

                        <CheckCircle2 size={18} />

                        {message}

                    </div>

                )}

            </div>

        </div>

    );

}

export default Profile;