import { Link } from 'react-router-dom';

type JobCardProps = {
  job: {
    id: string;
    title: string;
    company: string;
    description: string;
    posted: string;
    location: string;
    employmentType: string;
    careerLevel: string;
    workMode: string;
    tags: string[];
    salary: string;
    deadline: string;
  };
  saved: boolean;
  onToggleSave: (jobId: string) => void;
};

function JobCard({ job, saved, onToggleSave }: JobCardProps) {
  const preview = job.description.length > 120 ? `${job.description.slice(0, 120)}...` : job.description;

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div>
          <h3>{job.title}</h3>
          <Link to={`/jobs/${job.id}`} className="company-link">
            {job.company}
          </Link>
        </div>
        <button type="button" className={saved ? 'save-button saved' : 'save-button'} onClick={() => onToggleSave(job.id)}>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="job-meta">
        <span>{job.posted}</span>
        <span>{job.location}</span>
        <span>{job.employmentType}</span>
        <span>{job.careerLevel}</span>
        <span>{job.workMode}</span>
      </div>

      <p className="job-preview">{preview}</p>

      <div className="job-tag-row">
        {job.tags.map((tag) => (
          <span key={`${job.id}-${tag}`} className="job-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="job-card-footer">
        <span>{job.salary}</span>
        <span>Apply by {job.deadline}</span>
        <Link to={`/jobs/${job.id}`} className="button button-secondary small-button">
          View Details
        </Link>
      </div>
    </article>
  );
}

export default JobCard;
