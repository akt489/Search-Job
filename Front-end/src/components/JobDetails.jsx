import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function JobDetails({ job, saved, onToggleSave }) {
  if (!job || typeof job !== 'object') {
    return (
      <div className="empty-state" role="status">
        <p>Job details not found.</p>
      </div>
    );
  }

  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <div className="job-details-layout">
      <article className="job-details-main">
        <div className="job-header">
          <div>
            <p className="eyebrow">{job.category || 'Job Opportunity'}</p>
            <h1>{job.title || 'Untitled Job'}</h1>
            <p className="job-company-meta">
              {job.company || 'Unknown Company'} &bull; {job.location || 'Unknown Location'}
            </p>
            <div className="job-status-row">
              <span>💼 {job.type || job.employmentType || 'Full Time'}</span>
              <span>🎯 {job.careerLevel || 'Mid Level'}</span>
              <span>🌐 {job.remote ? 'Remote' : 'On-site'}</span>
            </div>
          </div>
        </div>

        <section className="job-block" aria-labelledby="job-desc-heading">
          <h2 id="job-desc-heading">Job Description</h2>
          <p>{job.description || 'No description available for this role.'}</p>
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
              <p className="hint-text">No specific responsibilities listed.</p>
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
              <p className="hint-text">No specific requirements listed.</p>
            )}
          </div>
        </section>
      </article>

      <aside className="job-details-sidebar" aria-label="Job Summary">
        <div className="job-summary-panel">
          <div className="summary-row">
            <span>Salary</span>
            <strong>{job.salary || 'Competitive'}</strong>
          </div>
          <div className="summary-row">
            <span>Posted Date</span>
            <strong>{job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Recently'}</strong>
          </div>
          <div className="summary-row">
            <span>Apply Deadline</span>
            <strong>{job.deadline || 'Open until filled'}</strong>
          </div>
          <div className="summary-row">
            <span>Category</span>
            <strong>{job.category || 'General'}</strong>
          </div>
          <div className="summary-row">
            <span>Location</span>
            <strong>{job.location || 'Remote'}</strong>
          </div>
          <div className="sidebar-actions">
            <button
              type="button"
              className={saved ? 'button button-secondary saved' : 'button button-secondary'}
              onClick={() => onToggleSave(job.id)}
              aria-label={saved ? 'Remove job from saved' : 'Save job'}
            >
              {saved ? '⭐ Saved' : '🤍 Save Job'}
            </button>
            <Link to={`/apply/${job.id}`} className="button button-primary button-full">
              Apply Now
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

JobDetails.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    company: PropTypes.string,
    location: PropTypes.string,
    category: PropTypes.string,
    type: PropTypes.string,
    employmentType: PropTypes.string,
    careerLevel: PropTypes.string,
    remote: PropTypes.bool,
    salary: PropTypes.string,
    description: PropTypes.string,
    posted_at: PropTypes.string,
    deadline: PropTypes.string,
    responsibilities: PropTypes.array,
    requirements: PropTypes.array,
  }),
  saved: PropTypes.bool,
  onToggleSave: PropTypes.func.isRequired,
};

JobDetails.defaultProps = {
  job: null,
  saved: false,
};

export default JobDetails;