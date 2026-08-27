import { Link } from 'react-router-dom';

function JobDetails({ job, saved, onToggleSave }) {
  // ✅ Safety check: if job is not provided
  if (!job || typeof job !== 'object') {
    return <p className="empty-state">Job details not found.</p>;
  }

  // ✅ Ensure arrays exist with fallback
  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <div className="job-details-layout">
      <article className="job-details-main">
        <div className="job-header">
          <div>
            <p className="eyebrow">{job.category || 'N/A'}</p>
            <h1>{job.title || 'Untitled Job'}</h1>
            <p className="job-company-meta">
              {job.company || 'Unknown Company'} · {job.location || 'Unknown Location'}
            </p>
            <div className="job-status-row">
              <span>{job.type || job.employmentType || 'N/A'}</span>
              <span>{job.careerLevel || 'N/A'}</span>
              <span>{job.remote ? 'Remote' : 'On-site'}</span>
            </div>
          </div>
        </div>

        <section className="job-block">
          <h2>Job description</h2>
          <p>{job.description || 'No description available.'}</p>
        </section>

        <section className="job-block two-column-block">
          <div>
            <h2>Responsibilities</h2>
            {responsibilities.length > 0 ? (
              <ul>
                {responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No responsibilities listed.</p>
            )}
          </div>
          <div>
            <h2>Requirements</h2>
            {requirements.length > 0 ? (
              <ul>
                {requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No requirements listed.</p>
            )}
          </div>
        </section>
      </article>

      <aside className="job-details-sidebar">
        <div className="job-summary-panel">
          <div className="summary-row">
            <span>Salary</span>
            <strong>{job.salary || 'Not specified'}</strong>
          </div>
          <div className="summary-row">
            <span>Posted</span>
            <strong>{job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'N/A'}</strong>
          </div>
          <div className="summary-row">
            <span>Apply by</span>
            <strong>{job.deadline || 'Not specified'}</strong>
          </div>
          <div className="summary-row">
            <span>Category</span>
            <strong>{job.category || 'N/A'}</strong>
          </div>
          <div className="summary-row">
            <span>Location</span>
            <strong>{job.location || 'N/A'}</strong>
          </div>
          <div className="sidebar-actions">
            <button
              type="button"
              className={saved ? 'button button-secondary saved' : 'button button-secondary'}
              onClick={() => onToggleSave(job.id)}
            >
              {saved ? '⭐ Saved' : '🤍 Save Job'}
            </button>
            <Link to={`/apply/${job.id}`} className="button button-primary button-full">
              Apply now
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default JobDetails;