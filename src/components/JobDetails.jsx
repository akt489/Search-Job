import { Link } from 'react-router-dom';

function JobDetails({ job, saved, onToggleSave }) {
  if (!job) {
    return <p className="empty-state">Job details not found.</p>;
  }

  return (
    <div className="job-details-layout">
      <article className="job-details-main">
        <div className="job-header">
          <div>
            <p className="eyebrow">{job.category}</p>
            <h1>{job.title}</h1>
            <p className="job-company-meta">
              {job.company} · {job.location}
            </p>
            <div className="job-status-row">
              <span>{job.employmentType}</span>
              <span>{job.careerLevel}</span>
              <span>{job.workMode}</span>
            </div>
          </div>
        </div>

        <section className="job-block">
          <h2>Job description</h2>
          <p>{job.description}</p>
        </section>

        <section className="job-block two-column-block">
          <div>
            <h2>Responsibilities</h2>
            <ul>
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Requirements</h2>
            <ul>
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </article>

      <aside className="job-details-sidebar">
        <div className="job-summary-panel">
          <div className="summary-row">
            <span>Salary</span>
            <strong>{job.salary}</strong>
          </div>
          <div className="summary-row">
            <span>Posted</span>
            <strong>{job.posted}</strong>
          </div>
          <div className="summary-row">
            <span>Apply by</span>
            <strong>{job.deadline}</strong>
          </div>
          <div className="summary-row">
            <span>Category</span>
            <strong>{job.category}</strong>
          </div>
          <div className="summary-row">
            <span>Location</span>
            <strong>{job.location}</strong>
          </div>
          <div className="sidebar-actions">
            <button
              type="button"
              className={saved ? 'button button-secondary saved' : 'button button-secondary'}
              onClick={() => onToggleSave(job.id)}
            >
              {saved ? 'Saved' : 'Save Job'}
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
