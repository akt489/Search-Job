import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  GraduationCap,
  Building2,
  CheckCircle2,
  Mail,
  Send,
  Bookmark,
  BookmarkCheck,
  Share2,
  ArrowLeft,
  Sparkles,
  Clock,
  DollarSign,
  Users,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

function JobDetailPremium({ job, saved, onToggleSave }) {
  const [savedJobs, setSavedJobs] = useState([]);

  if (!job) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><BriefcaseBusiness size={32} /></div>
        <h2>Job not found</h2>
        <p>The job you're looking for may have been removed.</p>
        <Link to="/jobs" className="button button-primary">Browse Jobs</Link>
      </div>
    );
  }

  // ─── Mock "More Jobs" data ──────────────────────────────
  const moreJobs = [
    {
      id: 2,
      title: "DevOps & Telecloud Infrastructure Engineer",
      location: "Hybrid",
      posted: "September 29th, 2026",
    },
    {
      id: 3,
      title: "Customer Service Specialist",
      location: "Office",
      posted: "September 4th, 2026",
    },
    {
      id: 4,
      title: "B2B Sales & Business Development Executive",
      location: "Office",
      posted: "September 4th, 2026",
    },
  ];

  // ─── Mock "Similar Jobs" chips ──────────────────────────
  const similarTags = [
    "Jobs in IT, Computer Science and Software Engineering",
    "Jobs for Junior Level (1-3 years)",
    "Jobs in Addis Ababa",
  ];

  // ─── Share handler ──────────────────────────────────────
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Job link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  // ─── Toggle save ────────────────────────────────────────
  const handleToggleSave = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  // ─── Mock responsibilities ─────────────────────────────
  const responsibilities = [
    "Lead product strategy with cross-functional teams",
    "Develop and execute marketing campaigns",
    "Build scalable full-stack applications",
    "Drive B2B sales growth",
    "Craft intuitive user experiences",
  ];

  // ─── Mock requirements ──────────────────────────────────
  const requirements = [
    "Bachelor's degree in Computer Science or related field",
    "Minimum 2 years of professional experience",
    "Experience in B2B technology sales",
    "Strong communication and negotiation skills",
    "Willingness to contact and visit business clients",
  ];

  return (
    <div className="job-detail-premium">
      {/* ─── Top Navigation ────────────────────────────────── */}
      <div className="job-detail-topbar">
        <Link to="/jobs" className="back-to-jobs">
          <ArrowLeft size={18} /> Back to Jobs
        </Link>
        <button className="share-job-button" onClick={handleShare}>
          <Share2 size={18} /> Share
        </button>
      </div>

      {/* ─── Main Layout ──────────────────────────────────── */}
      <div className="job-detail-premium-layout">
        {/* ─── Left Column ────────────────────────────────── */}
        <div className="job-detail-body-left">
          {/* ─── Hero Card ────────────────────────────────── */}
          <div className="job-detail-hero glass-card">
            <div className="job-hero-content">
              <div className="job-company-avatar">
                <Building2 size={32} />
              </div>
              <div className="job-hero-info">
                <div className="job-category-badge">{job.category || "Technology"}</div>
                <h1>{job.title || "Technical B2B Sales & Implementation Specialist"}</h1>
                <div className="job-company-name">
                  <Building2 size={17} /> {job.company || "Ledger Technology PLC"}
                </div>
                <div className="job-meta-grid">
                  <div className="job-meta-item">
                    <MapPin size={17} /> <span>{job.location || "Addis Ababa"}</span>
                  </div>
                  <div className="job-meta-item">
                    <BriefcaseBusiness size={17} /> <span>{job.type || "Full-time"}</span>
                  </div>
                  <div className="job-meta-item">
                    <GraduationCap size={17} /> <span>Mid Level</span>
                  </div>
                  <div className="job-meta-item">
                    <Clock size={17} /> <span>Posted 2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── About the Job ────────────────────────────── */}
          <div className="job-detail-description glass-card">
            <div className="job-detail-description-title">
              <BriefcaseBusiness size={20} /> About the Job
            </div>
            <div className="job-detail-description-details">
              <p>
                Ledger Technology PLC is looking for a technically qualified B2B Sales & Implementation Specialist
                to support client acquisition, product demonstrations, onboarding, and technical implementation.
              </p>
            </div>
          </div>

          {/* ─── Requirements ──────────────────────────────── */}
          <div className="job-detail-description glass-card">
            <div className="job-detail-description-title">
              <CheckCircle2 size={20} /> Requirements
            </div>
            <div className="job-detail-description-details">
              <ul className="requirements-list-premium">
                {requirements.map((req, i) => (
                  <li key={i}><CheckCircle2 size={18} className="list-check" /> {req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ─── Requirement Skills ────────────────────────── */}
          <div className="job-detail-description glass-card">
            <div className="job-detail-description-title">
              <GraduationCap size={20} /> Requirement Skill
            </div>
            <div className="job-detail-description-details">
              <div className="skill-tags-premium">
                <span className="skill-tag">IT and software development</span>
                <span className="skill-tag">B2B Sales</span>
                <span className="skill-tag">SaaS Implementation</span>
                <span className="skill-tag">Technical Support</span>
                <span className="skill-tag">CRM Management</span>
              </div>
            </div>
          </div>

          {/* ─── How to Apply ──────────────────────────────── */}
          <div className="job-detail-description glass-card" id="how-to-apply-section">
            <div className="job-detail-description-title">
              <Mail size={20} /> How To Apply
            </div>
            <div className="job-detail-description-details">
              <p>
                Please send your CV, degree certificate, and evidence of relevant work experience to:
              </p>
              <a href="mailto:info@ledger.et" className="apply-email-link">
                <Mail size={18} /> info@ledger.et
              </a>
            </div>
          </div>
        </div>

        {/* ─── Right Column ───────────────────────────────── */}
        <div className="job-detail-right-side">
          {/* ─── More Jobs ──────────────────────────────────── */}
          <div className="job-detail-more-jobs-container glass-card">
            <div className="job-detail-more-jobs-header">
              <BriefcaseBusiness size={20} />
              <h3>More Jobs by {job.company || "Ledger Ethiopia"}</h3>
            </div>

            {moreJobs.map((moreJob) => (
              <div key={moreJob.id} className="job-detail-more-jobs-item">
                <div className="more-job-top">
                  <Link to={`/jobs/${moreJob.id}`} className="more-job-title">
                    {moreJob.title}
                  </Link>
                  <button
                    className={`save-job-icon ${savedJobs.includes(moreJob.id) ? "saved" : ""}`}
                    onClick={() => handleToggleSave(moreJob.id)}
                  >
                    {savedJobs.includes(moreJob.id) ? (
                      <BookmarkCheck size={20} />
                    ) : (
                      <Bookmark size={20} />
                    )}
                  </button>
                </div>
                <div className="more-job-meta">
                  <span><MapPin size={14} /> {moreJob.location}</span>
                  <span><CalendarDays size={14} /> {moreJob.posted}</span>
                </div>
                <div className="job-detail-horizontal-line" />
              </div>
            ))}
          </div>

          {/* ─── Similar Jobs ──────────────────────────────── */}
          <div className="job-detail-similar-jobs-container glass-card">
            <div className="job-detail-similar-jobs-header">
              <Sparkles size={20} />
              <h3>Search Similar Jobs in {job.title}</h3>
            </div>
            <div className="similar-tags-container">
              {similarTags.map((tag, i) => (
                <Link key={i} to={`/jobs?search=${encodeURIComponent(tag)}`} className="similar-tag">
                  <ChevronRight size={16} /> {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailPremium;