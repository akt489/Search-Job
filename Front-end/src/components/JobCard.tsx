import React from 'react';
import { Link } from 'react-router-dom';

export type JobType = {
  id: string | number;
  title: string;
  company: string;
  location: string;
  category?: string;
  type?: string;
  employmentType?: string;
  careerLevel?: string;
  workMode?: string;
  remote?: boolean;
  salary?: string;
  description?: string;
  posted?: string;
  posted_at?: string;
  deadline?: string;
  tags?: string[];
  [key: string]: any;
};

export type JobCardProps = {
  job: JobType;
  saved: boolean;
  onToggleSave: (jobId: string | number) => void;
};

const JobCard: React.FC<JobCardProps> = ({ job, saved, onToggleSave }) => {
  const descriptionText = job.description || '';
  const preview = descriptionText.length > 120 ? `${descriptionText.slice(0, 120)}...` : descriptionText;
  
  const postedDate = job.posted || (job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Recently');
  const employmentType = job.employmentType || job.type || 'Full Time';
  const careerLevel = job.careerLevel || 'Mid Level';
  const workMode = job.workMode || (job.remote ? 'Remote' : 'On-site');
  const salaryText = job.salary || 'Competitive';
  const deadlineText = job.deadline || 'Open';

  const tags = Array.isArray(job.tags) 
    ? job.tags 
    : (job.category ? [job.category] : []);

  return (
    <article className="job-card" aria-labelledby={`job-title-${job.id}`}>
      <div className="job-card-top">
        <div>
          <h3 id={`job-title-${job.id}`}>{job.title}</h3>
          <Link to={`/jobs/${job.id}`} className="company-link">
            {job.company}
          </Link>
        </div>
        <button
          type="button"
          className={saved ? 'save-button saved' : 'save-button'}
          onClick={() => onToggleSave(String(job.id))}
          aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
        >
          {saved ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      <div className="job-meta">
        <span>📅 {postedDate}</span>
        <span>📍 {job.location}</span>
        <span>💼 {employmentType}</span>
        <span>🎯 {careerLevel}</span>
        <span>🌐 {workMode}</span>
      </div>

      {preview && <p className="job-preview">{preview}</p>}

      {tags.length > 0 && (
        <div className="job-tag-row">
          {tags.map((tag) => (
            <span key={`${job.id}-${tag}`} className="job-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="job-card-footer">
        <span>💰 {salaryText}</span>
        <span>⏳ Apply by {deadlineText}</span>
        <Link to={`/jobs/${job.id}`} className="button button-secondary small-button">
          View Details
        </Link>
      </div>
    </article>
  );
};

export default JobCard;
