import { useState } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, ExternalLink, Globe2, GraduationCap, Mail, MapPin, Send, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDeadlineLabel, getEmploymentType, getJobTags, getPostedLabel, getSalaryLabel, getWorkMode, getCompanyInitials } from '../utils/jobFormatters';

function JobDetails({ job, saved, onToggleSave }) {
  const [shareLabel, setShareLabel] = useState('Share');
  if (!job) return null;

  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const tags = getJobTags(job);

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: job.title, text: `Check out ${job.title} at ${job.company}`, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setShareLabel('Link copied');
        window.setTimeout(() => setShareLabel('Share'), 2500);
      }
    } catch {
      setShareLabel('Share');
    }
  };

  return (
    <div className="job-detail-premium">
      <div className="job-detail-topbar"><Link to="/jobs" className="back-to-jobs"><ArrowLeft size={16} /> Back to jobs</Link><button type="button" className="share-job-button" onClick={handleShare}><Share2 size={16} /> {shareLabel}</button></div>
      <div className="job-detail-premium-layout">
        <main className="job-detail-body-left">
          <section className="job-detail-hero">
            <div className="job-hero-content"><div className="job-company-avatar" aria-hidden="true">{getCompanyInitials(job.company)}</div><div className="job-hero-info"><span className="job-category-badge">{job.category || 'Open role'}</span><h1>{job.title}</h1><p className="job-company-name">{job.company || 'Company not listed'}</p><div className="job-meta-grid"><span className="job-meta-item"><MapPin size={14} /> {job.location || 'Location flexible'}</span><span className="job-meta-item"><BriefcaseBusiness size={14} /> {getEmploymentType(job)}</span><span className="job-meta-item"><Globe2 size={14} /> {getWorkMode(job)}</span><span className="job-meta-item"><Clock3 size={14} /> Posted {getPostedLabel(job)}</span></div></div></div>
          </section>

          <section className="job-detail-description"><h2 className="job-detail-description-title"><BriefcaseBusiness size={17} /> Role overview</h2><div className="job-detail-description-details"><p>{job.description || 'This role does not include a description yet. Review the decision facts and contact the company for more information.'}</p></div></section>

          {responsibilities.length > 0 && <section className="job-detail-description"><h2 className="job-detail-description-title"><CheckCircle2 size={17} /> Responsibilities</h2><div className="job-detail-description-details"><ul className="requirements-list-premium">{responsibilities.map((item) => <li key={item}><CheckCircle2 size={16} className="list-check" />{item}</li>)}</ul></div></section>}
          {requirements.length > 0 && <section className="job-detail-description"><h2 className="job-detail-description-title"><GraduationCap size={17} /> Requirements</h2><div className="job-detail-description-details"><ul className="requirements-list-premium">{requirements.map((item) => <li key={item}><CheckCircle2 size={16} className="list-check" />{item}</li>)}</ul></div></section>}
          {tags.length > 0 && <section className="job-detail-description"><h2 className="job-detail-description-title"><GraduationCap size={17} /> Skills and tags</h2><div className="skill-tags-premium">{tags.map((tag) => <span key={tag} className="skill-tag">{tag}</span>)}</div></section>}
          <section className="job-detail-description" id="how-to-apply-section"><h2 className="job-detail-description-title"><Mail size={17} /> Application information</h2><div className="job-detail-description-details"><p>Use the application flow to submit your details and CV for this role.</p>{job.contactEmail && <a href={`mailto:${job.contactEmail}`} className="apply-email-link"><Mail size={15} /> {job.contactEmail}</a>}</div></section>
        </main>

        <aside className="job-detail-right-side" aria-label="Job decision facts"><section className="job-summary-panel"><div className="job-summary-heading"><span className="field-kicker">Decision facts</span><h2>Review before you apply</h2></div><div className="job-summary-actions"><Link to={`/apply/${job.id}`} className="button button-primary button-full"><Send size={16} /> Apply</Link><button type="button" className={saved ? 'button button-secondary button-full is-saved' : 'button button-secondary button-full'} onClick={() => onToggleSave(job.id)}>{saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}{saved ? 'Saved' : 'Save role'}</button></div><dl className="detail-facts-list"><div><dt><MapPin size={14} /> Location</dt><dd>{job.location || 'Location flexible'}</dd></div><div><dt><Globe2 size={14} /> Work mode</dt><dd>{getWorkMode(job)}</dd></div><div><dt><BriefcaseBusiness size={14} /> Employment type</dt><dd>{getEmploymentType(job)}</dd></div><div><dt>Salary</dt><dd>{getSalaryLabel(job)}</dd></div><div><dt><CalendarDays size={14} /> Deadline</dt><dd>{getDeadlineLabel(job)}</dd></div></dl><div className="decision-note"><CheckCircle2 size={16} /><div><strong>Compare the details</strong><p>Use the role overview, requirements, and profile fit to decide whether this is the right next step.</p></div></div></section><section className="job-summary-panel company-context"><span className="field-kicker">Company context</span><h2>{job.company || 'Company not listed'}</h2><p>Review the company information available with this role and use the jobs directory to compare other opportunities.</p><Link to="/companies" className="job-context-link">Explore companies <ExternalLink size={14} /></Link></section></aside>
      </div>
      <Link to={`/apply/${job.id}`} className="mobile-sticky-apply"><Send size={16} /> Apply to this role</Link>
    </div>
  );
}

export default JobDetails;
