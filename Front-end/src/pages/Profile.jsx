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
    FileText,
    Link2,
    Upload,
    File,
    XCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

// ─── Inline Editor Modal ──────────────────────────────────
function InlineEditor({ isOpen, onClose, onSave, initialData, fields, title, isEditing }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    // ─── File Upload Handler ────────────────────────────────
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type & size
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Only JPEG, PNG, or PDF files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File must be under 5MB.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('section', title.toLowerCase()); // 'education', 'experience', etc.
        formData.append('itemIndex', '0'); // Will be replaced with actual index in parent

        try {
            const token = localStorage.getItem('jobscout-token');
            const res = await fetch(`${API_BASE}/profile/upload-file`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({ ...formData, file_url: data.fileUrl });
                alert('File uploaded successfully!');
            } else {
                const err = await res.json();
                alert(err.error || 'Upload failed.');
            }
        } catch (err) {
            console.error(err);
            alert('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="inline-editor glass-card">
            <div className="editor-header">
                <h4>{isEditing ? "Edit" : "Add"} {title}</h4>
                <button className="editor-close" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="editor-body">
                {fields.map((field) => {
                    if (field.key === 'file_upload') {
                        return (
                            <div className="form-group" key={field.key}>
                                <label>{field.label}</label>
                                <div className="file-upload-wrapper">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                    {uploading && <Loader2 size={18} className="spin" />}
                                    {formData.file_url && (
                                        <div className="uploaded-file">
                                            <File size={16} />
                                            <a href={formData.file_url} target="_blank" rel="noopener noreferrer">
                                                View Attachment
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, file_url: '' })}
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }
                    // Regular field rendering
                    return (
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
                    );
                })}
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

// ─── ProfileSection ────────────────────────────────────────
function ProfileSection({ title, icon: Icon, items, fields, onAdd, onEdit, onDelete, emptyMessage, renderItem }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // Pass the actual index to the editor for file upload
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
                                    <div>
                                        {renderItem(item)}
                                        {item.file_url && (
                                            <div className="file-attachment">
                                                <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                    <FileText size={14} /> View Attachment
                                                </a>
                                            </div>
                                        )}
                                    </div>
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
        education: [],
        projects: [],
        certifications: [],
        avatar_url: "",
    });

    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Editing states
    const [editingAbout, setEditingAbout] = useState(false);
    const [editingSkills, setEditingSkills] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingLocation, setEditingLocation] = useState(false);

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
                {/* ─── Profile Header ────────────────────────────────── */}
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
                            <div className="profile-title-editable">
                                {editingTitle ? (
                                    <div className="inline-edit-field">
                                        <input
                                            type="text"
                                            value={profile.title || ""}
                                            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                            placeholder="Add your professional title"
                                            autoFocus
                                        />
                                        <button
                                            className="button button-primary small-button"
                                            onClick={() => {
                                                updateProfile({ title: profile.title });
                                                setEditingTitle(false);
                                            }}
                                        >
                                            <Save size={16} /> Save
                                        </button>
                                        <button
                                            className="button button-secondary small-button"
                                            onClick={() => setEditingTitle(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="profile-title-display">
                                        <p className="profile-professional-title">{profile?.title || "Add your professional title"}</p>
                                        <button className="icon-btn" onClick={() => setEditingTitle(true)}><Pencil size={15} /></button>
                                    </div>
                                )}
                            </div>
                            <div className="profile-basic-info">
                                <div className="profile-location-editable">
                                    {editingLocation ? (
                                        <div className="inline-edit-field inline-edit-sm">
                                            <MapPin size={15} />
                                            <input
                                                type="text"
                                                value={profile.location || ""}
                                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                placeholder="Add location"
                                                autoFocus
                                            />
                                            <button
                                                className="button button-primary small-button"
                                                onClick={() => {
                                                    updateProfile({ location: profile.location });
                                                    setEditingLocation(false);
                                                }}
                                            >
                                                <Save size={14} /> Save
                                            </button>
                                            <button
                                                className="button button-secondary small-button"
                                                onClick={() => setEditingLocation(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span>
                                            <MapPin size={15} />
                                            {profile?.location || "Add location"}
                                            <button className="icon-btn" onClick={() => setEditingLocation(true)}><Pencil size={12} /></button>
                                        </span>
                                    )}
                                </div>
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

                {/* ─── Content Layout ────────────────────────────────── */}
                <div className="profile-layout-modern">
                    <main className="profile-main-modern">
                        {/* ─── About ──────────────────────────────────────── */}
                        <section className="profile-section-modern">
                            <div className="profile-section-header">
                                <div className="section-title-group">
                                    <div className="section-icon"><UserRound size={18} /></div>
                                    <h2>About</h2>
                                </div>
                                <button className="section-edit-btn" onClick={() => setEditingAbout(true)}>
                                    <Pencil size={15} />
                                </button>
                            </div>
                            <div className="about-content">
                                {profile.bio ? <p>{profile.bio}</p> : <div className="compact-empty"><UserRound size={20} /><span>Add your professional summary.</span></div>}
                            </div>
                            <InlineEditor
                                isOpen={editingAbout}
                                onClose={() => setEditingAbout(false)}
                                onSave={async (data) => {
                                    await updateProfile({ bio: data.bio });
                                    setEditingAbout(false);
                                }}
                                initialData={{ bio: profile.bio }}
                                fields={[
                                    { key: "bio", label: "Bio", type: "textarea", placeholder: "Tell us about yourself...", rows: 5 },
                                ]}
                                title="About"
                                isEditing={true}
                            />
                        </section>

                        {/* ─── Skills ────────────────────────────────────── */}
                        <section className="profile-section-modern skills-section">
                            <div className="profile-section-header">
                                <div className="section-title-group">
                                    <div className="section-icon purple"><Code2 size={18} /></div>
                                    <h2>Skills</h2>
                                    <span className="section-count">{profile.skills?.length || 0}</span>
                                </div>
                                <button className="section-edit-btn" onClick={() => setEditingSkills(true)}>
                                    <Pencil size={15} />
                                </button>
                            </div>
                            <div className="skills-modern-list">
                                {profile.skills?.length > 0 ? (
                                    profile.skills.map((skill, i) => <span key={i} className="skill-pill-modern">{skill}</span>)
                                ) : (
                                    <div className="compact-empty"><Code2 size={20} /><span>Add your skills to improve matches.</span></div>
                                )}
                            </div>
                            <InlineEditor
                                isOpen={editingSkills}
                                onClose={() => setEditingSkills(false)}
                                onSave={async (data) => {
                                    const arr = data.skills.split(",").map(s => s.trim()).filter(Boolean);
                                    await updateProfile({ skills: arr });
                                    setEditingSkills(false);
                                }}
                                initialData={{ skills: profile.skills?.join(", ") || "" }}
                                fields={[
                                    { key: "skills", label: "Skills (comma separated)", placeholder: "React, Node.js, Python" },
                                ]}
                                title="Skills"
                                isEditing={true}
                            />
                        </section>

                        {/* ─── Experience ────────────────────────────────── */}
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
                                { key: "file_upload", label: "Attachment (Certificate, etc.)", type: "file" },
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
                                    {item.file_url && (
                                        <div className="file-attachment">
                                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                <FileText size={14} /> View Attachment
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        />

                        {/* ─── Education ─────────────────────────────────── */}
                        <ProfileSection
                            title="Education"
                            icon={GraduationCap}
                            items={profile.education || []}
                            fields={[
                                { key: "institution", label: "Institution", placeholder: "University of ..." },
                                { key: "degree", label: "Degree", placeholder: "Bachelor's" },
                                { key: "field", label: "Field of Study", placeholder: "Computer Science" },
                                { key: "startDate", label: "Start Date", type: "date" },
                                { key: "endDate", label: "End Date", type: "date" },
                                { key: "description", label: "Description", type: "textarea", rows: 3 },
                                { key: "file_upload", label: "Attachment (Diploma, Certificate)", type: "file" },
                            ]}
                            onAdd={addItem("education")}
                            onEdit={editItem("education")}
                            onDelete={deleteItem("education")}
                            emptyMessage="No education added yet."
                            renderItem={(item) => (
                                <div>
                                    <h3>{item.degree} in {item.field}</h3>
                                    <span>{item.institution}</span>
                                    <p className="timeline-date">{item.startDate} — {item.endDate}</p>
                                    <p className="timeline-description">{item.description}</p>
                                    {item.file_url && (
                                        <div className="file-attachment">
                                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                <FileText size={14} /> View Attachment
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        />

                        {/* ─── Projects ──────────────────────────────────── */}
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
                                { key: "file_upload", label: "Project Image/PDF", type: "file" },
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
                                        {item.url && <a href={item.url} target="_blank" rel="noopener"><Link2 size={14} /> Website</a>}
                                        {item.github && <a href={item.github} target="_blank" rel="noopener"><Code2 size={14} /> GitHub</a>}
                                    </div>
                                    {item.file_url && (
                                        <div className="file-attachment">
                                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                <FileText size={14} /> View Attachment
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        />

                        {/* ─── Certifications ────────────────────────────── */}
                        <ProfileSection
                            title="Certifications"
                            icon={Award}
                            items={profile.certifications || []}
                            fields={[
                                { key: "name", label: "Certification Name", placeholder: "AWS Certified Developer" },
                                { key: "issuer", label: "Issuing Organization", placeholder: "Amazon Web Services" },
                                { key: "date", label: "Issue Date", type: "date" },
                                { key: "url", label: "Credential URL", placeholder: "https://..." },
                                { key: "file_upload", label: "Certificate File (PDF/Image)", type: "file" },
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
                                    {item.url && <a href={item.url} target="_blank" rel="noopener"><Link2 size={14} /> Credential</a>}
                                    {item.file_url && (
                                        <div className="file-attachment">
                                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                <FileText size={14} /> View Certificate
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </main>

                    {/* ─── Sidebar ────────────────────────────────────── */}
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
                                    { label: "Education", completed: profile.education?.length > 0 },
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

                {/* ─── Save Indicator ───────────────────────────────── */}
                {saving && <div className="profile-saving"><Loader2 size={17} className="spin" /> Saving changes...</div>}
                {message && <div className="profile-toast"><CheckCircle2 size={18} /> {message}</div>}
            </div>
        </div>
    );
}

export default Profile;