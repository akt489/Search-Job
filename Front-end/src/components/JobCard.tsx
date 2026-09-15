import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Banknote, Bookmark, BookmarkCheck, BriefcaseBusiness, Building2, CalendarDays, Clock3, Globe2, GraduationCap, MapPin } from 'lucide-react';
import { getCompanyInitials, getDeadlineLabel, getEmploymentType, getJobTags, getPostedLabel, getSalaryLabel, getWorkMode } from '../utils/jobFormatters';

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
  matchScore?: number;
  companyLogo?: string;
  [key: string]: any;
};

type JobCardProps = {
  job: JobType;
  saved: boolean;
  onToggleSave: (jobId: string | number) => void;
  compact?: boolean;
  selected?: boolean;
  onSelect?: (job: JobType) => void;
};

function JobCard({ job, saved, onToggleSave, compact = false, selected = false, onSelect }: JobCardProps) {
  const tags = getJobTags(job);
  const employmentType = getEmploymentType(job);
  const workMode = getWorkMode(job);
  const description = job.description || 'Review the role details to learn more about this opportunity.';

  if (compact) {
    const handleSelect = () => onSelect?.(job);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      if ((event.key === 'Enter' || event.key === ' ') && onSelect) {
        event.preventDefault();
        handleSelect();
      }
    };

    return (
      <article className={selected ? 'job-row is-selected' : 'job-row'} onClick={(event) => { if (!(event.target as HTMLElement).closest('a,button')) handleSelect(); }} onKeyDown={handleKeyDown} tabIndex={onSelect ? 0 : undefined} aria-current={selected ? 'true' : undefined} aria-labelledby={`job-title-${job.id}`}>
        <span className="company-mark" aria-hidden="true">{getCompanyInitials(job.company)}</span>
        <div className="job-row-main">
          <Link to={`/jobs/${job.id}`} className="job-title-link" id={`job-title-${job.id}`}>{job.title}</Link>
          <p className="job-company-name">{job.company || 'Company not listed'}</p>
          <div className="job-row-facts">
            <span><MapPin size={12} aria-hidden="true" /> {job.location || 'Location flexible'}</span>
            <span><Globe2 size={12} aria-hidden="true" /> {workMode}</span>
            <span><BriefcaseBusiness size={12} aria-hidden="true" /> {employmentType}</span>
          </div>
        </div>
        <div className="job-row-side">
          <span className="mono-label">{getPostedLabel(job)}</span>
          <button type="button" className={saved ? 'job-save-btn is-saved' : 'job-save-btn'} onClick={(event) => { event.stopPropagation(); onToggleSave(job.id); }} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} title={saved ? 'Remove from saved jobs' : 'Save job'}>
            {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="job-card-modern" aria-labelledby={`job-card-title-${job.id}`}>
      <div className="job-card-header">
        <span className="company-mark company-mark-large" aria-hidden="true">{getCompanyInitials(job.company)}</span>
        <button type="button" className={saved ? 'job-save-btn is-saved' : 'job-save-btn'} onClick={() => onToggleSave(job.id)} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} title={saved ? 'Remove from saved jobs' : 'Save job'}>
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="job-title-section">
        <Link to={`/jobs/${job.id}`} className="job-title-link"><h3 id={`job-card-title-${job.id}`}>{job.title}</h3></Link>
        <p className="job-company-name"><Building2 size={14} aria-hidden="true" /> {job.company || 'Company not listed'}</p>
      </div>
      {job.matchScore && <div className="job-match-note"><span>Profile match</span><strong>{job.matchScore}%</strong></div>}
      <div className="job-meta-modern">
        <span><MapPin size={14} aria-hidden="true" /> {job.location || 'Location flexible'}</span>
        <span><BriefcaseBusiness size={14} aria-hidden="true" /> {employmentType}</span>
        <span><Globe2 size={14} aria-hidden="true" /> {workMode}</span>
        {job.careerLevel && <span><GraduationCap size={14} aria-hidden="true" /> {job.careerLevel}</span>}
      </div>
      <p className="job-description-modern">{description}</p>
      {tags.length > 0 && <div className="job-tags-modern">{tags.map((tag) => <span key={`${job.id}-${tag}`}>{tag}</span>)}</div>}
      <div className="job-card-bottom">
        <div className="job-extra-info"><span><Banknote size={14} aria-hidden="true" /> {getSalaryLabel(job)}</span><span><CalendarDays size={14} aria-hidden="true" /> {getDeadlineLabel(job)}</span></div>
        <Link to={`/jobs/${job.id}`} className="job-details-btn">View job <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
      <div className="job-posted-info"><Clock3 size={13} aria-hidden="true" /> Posted {getPostedLabel(job)}</div>
    </article>
  );
}

export default JobCard;
