import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Monitor,
  DollarSign,
  CalendarDays,
  Clock,
  Bookmark,
  BookmarkCheck,
  Send,
  Building2,
  CheckCircle2,
  ListChecks,
  Share2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

function JobDetails({ job, saved, onToggleSave }) {
  if (!job || typeof job !== "object") {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><BriefcaseBusiness size={32} /></div>
        <h2>Job not found</h2>
        <p>The job you're looking for may have been removed.</p>
        <Link to="/jobs" className="button button-primary">Browse Jobs</Link>
      </div>
    );
  }

  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const employmentType = job.employmentType || job.type || "Full Time";
  const careerLevel = job.careerLevel || "Not specified";
  const workMode = job.workMode || (job.remote ? "Remote" : "On-site");
  const postedDate = job.posted_at ? new Date(job.posted_at).toLocaleDateString() : "Recently";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: job.title, text: `Check out: ${job.title} at ${job.company}`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Job link copied to clipboard!");
      }
    } catch (error) { console.error("Share failed:", error); }
  };

  return (
    <div className="job-details-page">
      {/* Top Bar */}
      <div className="job-details-topbar">
        <Link to="/jobs" className="back-to-jobs"><ArrowLeft size={18} /> Back to Jobs</Link>
        <button type="button" className="share-job-button" onClick={handleShare}>
          <Share2 size={18} /> <span>Share</span>
        </button>
      </div>

      {/* Hero */}
      <section className="job-details-hero glass-card">
        <div className="job-hero-content">
          <div className="job-company-avatar">
            {job.companyLogo ? <img src={job.companyLogo} alt={job.company} /> : <Building2 size={30} />}
          </div>
          <div className="job-hero-info">
            <div className="job-category-badge">{job.category || "Job Opportunity"}</div>
            <h1>{job.title || "Untitled Job"}</h1>
            <div className="job-company-name"><Building2 size={17} /> {job.company || "Unknown Company"}</div>
            <div className="job-meta-grid">
              <div className="job-meta-item"><MapPin size={17} /> <span>{job.location || "Location not specified"}</span></div>
              <div className="job-meta-item"><BriefcaseBusiness size={17} /> <span>{employmentType}</span></div>
              <div className="job-meta-item"><GraduationCap size={17} /> <span>{careerLevel}</span></div>
              <div className="job-meta-item"><Monitor size={17} /> <span>{workMode}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="job-details-layout">
        <main className="job-details-main">
          {/* Description */}
          <section className="job-content-card glass-card">
            <div className="job-section-header">
              <div className="section-icon"><BriefcaseBusiness size={20} /></div>
              <div><h2>About the Role</h2><p>Learn more about this opportunity</p></div>
            </div>
            <div className="job-description">
              {job.description ? <p>{job.description}</p> : <p className="hint-text">No description available.</p>}
            </div>
          </section>

          {/* Responsibilities */}
          <section className="job-content-card glass-card">
            <div className="job-section-header">
              <div className="section-icon"><ListChecks size={20} /></div>
              <div><h2>Responsibilities</h2><p>What you'll be doing</p></div>
            </div>
            {responsibilities.length > 0 ? (
              <ul className="modern-list">
                {responsibilities.map((item, i) => <li key={i}><CheckCircle2 size={19} className="list-check" /> <span>{item}</span></li>)}
              </ul>
            ) : <p className="hint-text">No specific responsibilities listed.</p>}
          </section>

          {/* Requirements */}
          <section className="job-content-card glass-card">
            <div className="job-section-header">
              <div className="section-icon"><GraduationCap size={20} /></div>
              <div><h2>Requirements</h2><p>Skills and qualifications needed</p></div>
            </div>
            {requirements.length > 0 ? (
              <ul className="modern-list requirements-list">
                {requirements.map((item, i) => <li key={i}><CheckCircle2 size={19} className="list-check" /> <span>{item}</span></li>)}
              </ul>
            ) : <p className="hint-text">No specific requirements listed.</p>}
          </section>

          {/* AI Insight */}
          <section className="ai-job-insight">
            <div className="ai-insight-header">
              <div className="ai-icon"><Sparkles size={22} /></div>
              <div><span>AI Career Assistant</span><h3>Want to know if this job matches you?</h3></div>
            </div>
            <p>Get a personalized AI analysis based on your skills, experience, and career goals.</p>
            <Link to={`/recommendations?job=${job.id}`} className="ai-analyze-button">
              <Sparkles size={18} /> Analyze My Match
            </Link>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="job-details-sidebar">
          <div className="job-summary-panel glass-card">
            <div className="summary-header"><h3>Job Overview</h3><span className="summary-status">Open</span></div>
            <div className="summary-divider" />
            <div className="summary-row">
              <div className="summary-label"><div className="summary-icon"><DollarSign size={17} /></div><span>Salary</span></div>
              <strong>{job.salary || "Competitive"}</strong>
            </div>
            <div className="summary-row">
              <div className="summary-label"><div className="summary-icon"><CalendarDays size={17} /></div><span>Posted</span></div>
              <strong>{postedDate}</strong>
            </div>
            <div className="summary-row">
              <div className="summary-label"><div className="summary-icon"><Clock size={17} /></div><span>Deadline</span></div>
              <strong>{job.deadline || "Open until filled"}</strong>
            </div>
            <div className="summary-row">
              <div className="summary-label"><div className="summary-icon"><MapPin size={17} /></div><span>Location</span></div>
              <strong>{job.location || "Remote"}</strong>
            </div>
            <div className="summary-divider" />
            <div className="sidebar-actions">
              <Link to={`/apply/${job.id}`} className="apply-now-button"><Send size={18} /> Apply Now</Link>
              <button type="button" className={saved ? "save-job-button saved" : "save-job-button"} onClick={() => onToggleSave(job.id)}>
                {saved ? <><BookmarkCheck size={18} /> Saved</> : <><Bookmark size={18} /> Save Job</>}
              </button>
            </div>
            <p className="apply-note">Make sure your profile is complete before applying.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

JobDetails.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string, company: PropTypes.string, companyLogo: PropTypes.string,
    location: PropTypes.string, category: PropTypes.string, type: PropTypes.string,
    employmentType: PropTypes.string, careerLevel: PropTypes.string, workMode: PropTypes.string,
    remote: PropTypes.bool, salary: PropTypes.string, description: PropTypes.string,
    posted_at: PropTypes.string, deadline: PropTypes.string,
    responsibilities: PropTypes.arrayOf(PropTypes.string),
    requirements: PropTypes.arrayOf(PropTypes.string),
  }),
  saved: PropTypes.bool,
  onToggleSave: PropTypes.func.isRequired,
};

JobDetails.defaultProps = { job: null, saved: false };
export default JobDetails;