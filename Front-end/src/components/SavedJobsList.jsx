import { Link } from 'react-router-dom';
import { BookmarkCheck, BriefcaseBusiness, MapPin } from 'lucide-react';
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
          <div className="saved-job-heading"><span className="company-mark" aria-hidden="true"><BookmarkCheck size={16} /></span><div><h3>{job.title || 'Untitled role'}</h3><p className="saved-job-company">{job.company || 'Company not listed'}</p></div></div>
          <div className="saved-job-meta"><span><MapPin size={14} /> {job.location || 'Location flexible'}</span><span><BriefcaseBusiness size={14} /> {job.employmentType || job.type || 'Full-time'}</span></div>
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
