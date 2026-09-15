import PropTypes from 'prop-types';
import JobCard from './JobCard';
import { EmptyState } from './ui/AsyncState';

function JobList({ jobs = [], savedJobs = [], onToggleSave, compact = false, selectedJobId, onSelect }) {
  const jobList = Array.isArray(jobs) ? jobs : [];
  const savedList = Array.isArray(savedJobs) ? savedJobs : [];

  if (jobList.length === 0) {
    return <EmptyState title="No jobs found" message="Try adjusting your filters or search terms." />;
  }

  return (
    <div className={compact ? 'job-list job-list-rows' : 'job-list-grid'} aria-label="Job listings">
      {jobList.map((job) => {
        const isSaved = savedList.includes(job.id) || savedList.includes(String(job.id)) || savedList.includes(Number(job.id));
        return <JobCard key={job.id} job={job} saved={isSaved} onToggleSave={onToggleSave || (() => {})} compact={compact} selected={String(selectedJobId) === String(job.id)} onSelect={onSelect} />;
      })}
    </div>
  );
}

JobList.propTypes = {
  jobs: PropTypes.array,
  savedJobs: PropTypes.array,
  onToggleSave: PropTypes.func,
  compact: PropTypes.bool,
  selectedJobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
};

JobList.defaultProps = { jobs: [], savedJobs: [], onToggleSave: () => {}, compact: false, selectedJobId: null, onSelect: undefined };

export default JobList;
