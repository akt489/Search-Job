import { Link } from 'react-router-dom';

function SavedJobsList({ jobs, onToggleSave }) {
    if (!jobs.length) {
        return <p className="empty-state">You have no saved jobs yet.</p>;
    }

    return (
        <div className="saved-jobs-grid">
            {jobs.map((job) => (
                <article key={job.id} className="saved-job-card">
                    <div>
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                        <p>{job.location}</p>
                    </div>
                    <div className="saved-actions">
                        <Link to={`/jobs/${job.id}`} className="button button-secondary small-button">
                            View
                        </Link>
                        <button type="button" className="button button-outline" onClick={() => onToggleSave(job.id)}>
                            Remove
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default SavedJobsList;
