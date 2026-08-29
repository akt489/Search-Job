import { useState, useEffect, useRef } from "react";
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
    ChevronRight,
    Loader2,
    Trash2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

// ─── Inline Editor Modal ──────────────────────────────────
function InlineEditor({ isOpen, onClose, onSave, initialData, fields, title, isEditing }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inline-editor glass-card">
            <div className="editor-header">
                <h4>{isEditing ? "Edit" : "Add"} {title}</h4>
                <button className="editor-close" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="editor-body">
                {fields.map((field) => (
                    <div className="form-group" key={field.key}>
                        <label>{field.label}</label>
                        {field.type === "textarea" ? (
                            <textarea
                                value={formData[field.key] || ""}
                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                placeholder={field.placeholder}
                                rows={field.rows || 3}
                            />
                        ) : field.type === "checkbox" ? (
                            <div className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData[field.key] || false}
                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                                />
                                <span>{field.label}</span>
                            </div>
                        ) : field.type === "date" ? (
                            <input
                                type="date"
                                value={formData[field.key] || ""}
                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            />
                        ) : (
                            <input
                                type={field.type || "text"}
                                value={formData[field.key] || ""}
                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                placeholder={field.placeholder}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="editor-actions">
                <button className="button button-primary small-button" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save
                </button>
                <button className="button button-secondary small-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

// ─── Profile Section Component ────────────────────────────
function ProfileSection({ title, icon: Icon, items, fields, onAdd, onEdit, onDelete, emptyMessage, renderItem }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = async (data) => {
        if (editingIndex !== null) {
            await onEdit(editingIndex, data);
            setEditingIndex(null);
        } else {
            await onAdd(data);
            setIsAdding(false);
        }
    };

    return (
        <section className="profile-section-modern">
            <div className="profile-section-header">
                <div className="section-title-group">
                    <div className="section-icon"><Icon size={18} /></div>
                    <h2>{title}</h2>
                </div>
                <button className="section-add-btn" onClick={() => setIsAdding(true)}>
                    <Plus size={16} /> Add
                </button>
            </div>

            {items.length === 0 ? (
                <div className="compact-empty">
                    <Icon size={20} />
                    <span>{emptyMessage}</span>
                </div>
            ) : (
                <div className="timeline-list">
                    {items.map((item, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-marker"><Icon size={15} /></div>
                            <div className="timeline-content">
                                <div className="timeline-heading">
                                    <div>{renderItem(item)}</div>
                                    <div className="item-actions">
                                        <button className="icon-btn" onClick={() => setEditingIndex(index)}><Pencil size={15} /></button>
                                        <button className="icon-btn danger" onClick={() => onDelete(index)}><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <InlineEditor
                isOpen={editingIndex !== null || isAdding}
                onClose={() => { setEditingIndex(null); setIsAdding(false); }}
                onSave={handleSave}
                initialData={editingIndex !== null ? items[editingIndex] : {}}
                fields={fields}
                title={title}
                isEditing={editingIndex !== null}
            />
        </section>
    );
}

// ─── Main Profile Component ────────────────────────────────
function Profile({ user }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [profile, setProfile] = useState({
        skills: [],
        location: "",
        bio: "",
        title: "",
        experience: [],
        education_items: [],
        projects: [],
        certifications: [],
        avatar_url: "",
    });

    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // ─── Fetch Profile ──────────────────────────────────────
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("jobscout-token");
            const res = await fetch(`${API_BASE}/ai/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setProfile((prev) => ({ ...prev, ...data }));
                if (data.avatar_url) setAvatarPreview(data.avatar_url);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    // ─── Update Profile ─────────────────────────────────────
    const updateProfile = async (updates) => {
        setSaving(true);
        try {
            const token = localStorage.getItem("jobscout-token");
            const newProfile = { ...profile, ...updates };
            const res = await fetch(`${API_BASE}/ai/profile`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProfile),
            });
            if (res.ok) {
                setProfile(newProfile);
                setMessage("Profile updated successfully!");
                setTimeout(() => setMessage(""), 3000);
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            setSaving(false);
        }
    };

    // ─── Avatar Upload ──────────────────────────────────────
    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }
        if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB."); return; }
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setAvatarPreview(dataUrl);
            // In production: upload to server and get URL, then updateProfile({ avatar_url: url })
            // For demo, we'll just use the data URL (note: this won't persist on backend refresh)
            updateProfile({ avatar_url: dataUrl });
        };
        reader.readAsDataURL(file);
    };

    // ─── Section CRUD ───────────────────────────────────────
    const addItem = (key) => async (data) => {
        const updated = [...(profile[key] || []), data];
        await updateProfile({ [key]: updated });
    };
    const editItem = (key) => async (index, data) => {
        const updated = [...(profile[key] || [])];
        updated[index] = data;
        await updateProfile({ [key]: updated });
    };
    const deleteItem = (key) => async (index) => {
        const updated = [...(profile[key] || [])];
        updated.splice(index, 1);
        await updateProfile({ [key]: updated });
    };

    if (loading) {
        return <div className="profile-loading"><div className="skeleton" style={{ height: 200 }} /></div>;
    }

    const initials = user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

    return (
        <div className="page-content page-profile">
            <div className="profile-page-modern">
                {/* Profile Header */}
                <section className="profile-hero-modern">
                    <div className="profile-hero-pattern" />
                    <div className="profile-hero-content">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar-modern" onClick={handleAvatarClick}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt={user?.fullName} />
                                ) : (
                                    <span>{initials}</span>
                                )}
                                <button className="avatar-camera-btn" type="button">
                                    <Camera size={16} />
                                </button>
                                <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>
                        <div className="profile-identity">
                            <div className="profile-name-row">
                                <h1>{user?.fullName || "Your Name"}</h1>
                                <CheckCircle2 size={20} className="profile-verified-icon" />
                            </div>
                            <p className="profile-professional-title">{profile?.title || "Add your professional title"}</p>
                            <div className="profile-basic-info">
                                <span><MapPin size={15} /> {profile?.location || "Add location"}</span>
                                {user?.email && <span><Mail size={15} /> {user.email}</span>}
                            </div>
                        </div>
                        <div className="profile-hero-actions">
                            <button className="profile-edit-main-btn" onClick={() => window.scrollTo({ top: 300, behavior: "smooth" })}>
                                <Pencil size={17} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Layout */}
                <div className="profile-layout-modern">
                    <main className="profile-main-modern">
                        {/* About */}
                        <section className="profile-section-modern">
                            <div className="profile-section-header">
                                <div className="section-title-group">
                                    <div className="section-icon"><UserRound size={18} /></div>
                                    <h2>About</h2>
                                </div>
                                <button className="section-edit-btn" onClick={() => {
                                    const bio = prompt("Enter your bio:", profile.bio || "");
                                    if (bio !== null) updateProfile({ bio });
                                }}><Pencil size={15} /></button>
                            </div>
                            <div className="about-content">
                                {profile.bio ? <p>{profile.bio}</p> : <div className="compact-empty"><UserRound size={20} /><span>Add your professional summary.</span></div>}
                            </div>
                        </section>

                        {/* Skills */}
                        <section className="profile-section-modern skills-section">
                            <div className="profile-section-header">
                                <div className="section-title-group">
                                    <div className="section-icon purple"><Code2 size={18} /></div>
                                    <h2>Skills</h2>
                                    <span className="section-count">{profile.skills?.length || 0}</span>
                                </div>
                                <button className="section-edit-btn" onClick={() => {
                                    const skills = prompt("Enter skills (comma separated):", profile.skills?.join(", ") || "");
                                    if (skills !== null) {
                                        const arr = skills.split(",").map(s => s.trim()).filter(Boolean);
                                        updateProfile({ skills: arr });
                                    }
                                }}><Pencil size={15} /></button>
                            </div>
                            <div className="skills-modern-list">
                                {profile.skills?.length > 0 ? (
                                    profile.skills.map((skill, i) => <span key={i} className="skill-pill-modern">{skill}</span>)
                                ) : (
                                    <div className="compact-empty"><Code2 size={20} /><span>Add your skills to improve matches.</span></div>
                                )}
                            </div>
                        </section>

                        {/* Experience */}
                        <ProfileSection
                            title="Experience"
                            icon={BriefcaseBusiness}
                            items={profile.experience || []}
                            fields={[
                                { key: "title", label: "Job Title", placeholder: "Software Engineer" },
                                { key: "company", label: "Company", placeholder: "TechCorp" },
                                { key: "location", label: "Location", placeholder: "Remote" },
                                { key: "startDate", label: "Start Date", type: "date" },
                                { key: "endDate", label: "End Date", type: "date" },
                                { key: "current", label: "Currently Working", type: "checkbox" },
                                { key: "description", label: "Description", type: "textarea", placeholder: "Describe your role...", rows: 4 },
                            ]}
                            onAdd={addItem("experience")}
                            onEdit={editItem("experience")}
                            onDelete={deleteItem("experience")}
                            emptyMessage="No experience added yet."
                            renderItem={(item) => (
                                <div>
                                    <h3>{item.title}</h3>
                                    <span>{item.company}</span>
                                    <p className="timeline-date">{item.startDate} — {item.current ? "Present" : item.endDate}</p>
                                    <p className="timeline-description">{item.description}</p>
                                </div>
                            )}
                        />

                        {/* Education */}
                        <ProfileSection
                            title="Education"
                            icon={GraduationCap}
                            items={profile.education_items || []}
                            fields={[
                                { key: "institution", label: "Institution", placeholder: "University of ..." },
                                { key: "degree", label: "Degree", placeholder: "Bachelor's" },
                                { key: "field", label: "Field of Study", placeholder: "Computer Science" },
                                { key: "startDate", label: "Start Date", type: "date" },
                                { key: "endDate", label: "End Date", type: "date" },
                                { key: "description", label: "Description", type: "textarea", rows: 3 },
                            ]}
                            onAdd={addItem("education_items")}
                            onEdit={editItem("education_items")}
                            onDelete={deleteItem("education_items")}
                            emptyMessage="No education added yet."
                            renderItem={(item) => (
                                <div>
                                    <h3>{item.degree} in {item.field}</h3>
                                    <span>{item.institution}</span>
                                    <p className="timeline-date">{item.startDate} — {item.endDate}</p>
                                    <p className="timeline-description">{item.description}</p>
                                </div>
                            )}
                        />

                        {/* Projects */}
                        <ProfileSection
                            title="Projects"
                            icon={Code2}
                            items={profile.projects || []}
                            fields={[
                                { key: "name", label: "Project Name", placeholder: "My Awesome Project" },
                                { key: "description", label: "Description", type: "textarea", placeholder: "What does it do?", rows: 3 },
                                { key: "technologies", label: "Technologies", placeholder: "React, Node.js" },
                                { key: "url", label: "Project URL", placeholder: "https://..." },
                                { key: "github", label: "GitHub URL", placeholder: "https://github.com/..." },
                            ]}
                            onAdd={addItem("projects")}
                            onEdit={editItem("projects")}
                            onDelete={deleteItem("projects")}
                            emptyMessage="No projects added yet."
                            renderItem={(item) => (
                                <div>
                                    <h3>{item.name}</h3>
                                    <p className="timeline-description">{item.description}</p>
                                    <div className="project-links">
                                        {item.url && <a href={item.url} target="_blank" rel="noopener">🔗 Website</a>}
                                        {item.github && <a href={item.github} target="_blank" rel="noopener">🐙 GitHub</a>}
                                    </div>
                                </div>
                            )}
                        />

                        {/* Certifications */}
                        <ProfileSection
                            title="Certifications"
                            icon={Award}
                            items={profile.certifications || []}
                            fields={[
                                { key: "name", label: "Certification Name", placeholder: "AWS Certified Developer" },
                                { key: "issuer", label: "Issuing Organization", placeholder: "Amazon Web Services" },
                                { key: "date", label: "Issue Date", type: "date" },
                                { key: "url", label: "Credential URL", placeholder: "https://..." },
                            ]}
                            onAdd={addItem("certifications")}
                            onEdit={editItem("certifications")}
                            onDelete={deleteItem("certifications")}
                            emptyMessage="No certifications added yet."
                            renderItem={(item) => (
                                <div>
                                    <h3>{item.name}</h3>
                                    <span>{item.issuer}</span>
                                    <p className="timeline-date">{item.date}</p>
                                    {item.url && <a href={item.url} target="_blank" rel="noopener">🔗 Credential</a>}
                                </div>
                            )}
                        />
                    </main>

                    {/* Sidebar */}
                    <aside className="profile-sidebar-modern">
                        <div className="profile-completion-card">
                            <div className="completion-header">
                                <div>
                                    <span className="section-label">PROFILE STRENGTH</span>
                                    <h3>Complete your profile</h3>
                                </div>
                                <div className="completion-score">80%</div>
                            </div>
                            <div className="completion-progress"><div className="completion-progress-fill" style={{ width: "80%" }} /></div>
                            <div className="completion-list">
                                {[
                                    { label: "Profile photo", completed: !!avatarPreview },
                                    { label: "Professional title", completed: !!profile.title },
                                    { label: "About section", completed: !!profile.bio },
                                    { label: "Skills", completed: profile.skills?.length > 0 },
                                    { label: "Experience", completed: profile.experience?.length > 0 },
                                    { label: "Education", completed: profile.education_items?.length > 0 },
                                ].map((item) => (
                                    <div key={item.label} className={`completion-item ${item.completed ? "completed" : ""}`}>
                                        {item.completed ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="profile-ai-tip">
                            <div className="profile-ai-tip-icon"><Sparkles size={20} /></div>
                            <div>
                                <span>AI CAREER TIP</span>
                                <h4>A complete profile helps AI find better job matches.</h4>
                                <button>Improve my profile <ChevronRight size={15} /></button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Save Indicator */}
                {saving && <div className="profile-saving"><Loader2 size={17} className="spin" /> Saving changes...</div>}
                {message && <div className="profile-toast"><CheckCircle2 size={18} /> {message}</div>}
            </div>
        </div>
    );
}

export default Profile;