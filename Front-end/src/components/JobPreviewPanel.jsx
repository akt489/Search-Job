import { Bookmark, BookmarkCheck, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, ExternalLink, Globe2, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { EmptyState } from './ui/AsyncState';
import { getDeadlineLabel, getEmploymentType, getJobTags, getPostedLabel, getSalaryLabel, getWorkMode } from '../utils/jobFormatters';

function JobPreviewPanel({ job, saved, onToggleSave }) {
  if (!job) {
    return (
      <aside className="job-preview-panel job-preview-panel-empty" aria-label="Selected role preview">
        <EmptyState title="Select a role" message="Choose a result to review its details before you apply." icon={BriefcaseBusiness} />
      </aside>
    );
  }

  const tags = getJobTags(job);
  const workMode = getWorkMode(job);
  const employmentType = getEmploymentType(job);

  return (
    <aside className="job-preview-panel" aria-labelledby={`preview-title-${job.id}`}>
      <div className="job-preview-header">
        <div className="job-preview-topline">
          <div className="job-company-heading">
            <span className="company-mark company-mark-large">{getCompanyInitials(job.company)}</span>
            <div>
              <span className="field-kicker">{job.category || 'Open role'}</span>
              <h2 id={`preview-title-${job.id}`}>{job.title}</h2>
              <p>{job.company || 'Company not listed'}</p>
            </div>
          </div>
          <button type="button" className={saved ? 'icon-button is-saved' : 'icon-button'} onClick={() => onToggleSave(job.id)} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} title={saved ? 'Remove from saved jobs' : 'Save job'}>
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
        <div className="job-preview-actions">
          <Link to={`/apply/${job.id}`} className="button button-primary"><Send size={16} /> Apply</Link>
          <Link to={`/jobs/${job.id}`} className="button button-secondary"><ExternalLink size={16} /> View job</Link>
        </div>
      </div>

      <dl className="job-fact-grid">
        <div><dt><MapPin size={13} /> Location</dt><dd>{job.location || 'Location flexible'}</dd></div>
        <div><dt><Globe2 size={13} /> Work mode</dt><dd>{workMode}</dd></div>
        <div><dt><BriefcaseBusiness size={13} /> Employment type</dt><dd>{employmentType}</dd></div>
        <div><dt>Salary</dt><dd>{getSalaryLabel(job)}</dd></div>
        <div><dt><Clock3 size={13} /> Posted</dt><dd>{getPostedLabel(job)}</dd></div>
        <div><dt><CalendarDays size={13} /> Deadline</dt><dd>{getDeadlineLabel(job)}</dd></div>
      </dl>

      <div className="job-preview-body">
        <section className="job-preview-section">
          <h3>Role overview</h3>
          <p>{job.description || 'Review the full role details to understand the responsibilities and expectations.'}</p>
          {tags.length > 0 && <div className="tag-list">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}
        </section>
        <section className="why-fit-panel">
          <div className="why-fit-heading"><CheckCircle2 size={16} /> Why it fits</div>
          <p>{job.matchScore ? `This role is marked as a ${job.matchScore}% match based on the available profile and role information.` : 'Compare the role requirements, work mode, and responsibilities with your profile before applying.'}</p>
          <small>Profile details used for this match</small>
        </section>
      </div>
    </aside>
  );
}

function getCompanyInitials(company = '') {
  return company.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'CO';
}

JobPreviewPanel.propTypes = {
  job: PropTypes.object,
  saved: PropTypes.bool,
  onToggleSave: PropTypes.func.isRequired,
};

JobPreviewPanel.defaultProps = { job: null, saved: false };

export default JobPreviewPanel;
