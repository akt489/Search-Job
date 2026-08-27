import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function SavedJobsList({ jobs = [], onToggleSave }) {
  const jobsList = Array.isArray(jobs) ? jobs : [];

  if (!jobsList.length) {
    return (
      <div className="empty-state" role="status">
        <p>You have no saved jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="saved-jobs-grid" aria-label="Saved Job Listings">
      {jobsList.map((job) => (
        <article key={job.id} className="saved-job-card">
          <div>
            <h3>{job.title || 'Untitled Role'}</h3>
            <p style={{ color: 'var(--accent)', fontWeight: 600 }}>{job.company || 'Unknown Company'}</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>📍 {job.location || 'Remote'}</p>
          </div>
          <div className="saved-actions">
            <Link to={`/jobs/${job.id}`} className="button button-secondary small-button">
              View
            </Link>
            <button
              type="button"
              className="button button-outline small-button"
              onClick={() => onToggleSave(job.id)}
              aria-label={`Remove ${job.title} from saved jobs`}
            >
              Remove
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

SavedJobsList.propTypes = {
  jobs: PropTypes.array,
  onToggleSave: PropTypes.func.isRequired,
};

SavedJobsList.defaultProps = {
  jobs: [],
};

export default SavedJobsList;
