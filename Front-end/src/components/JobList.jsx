import PropTypes from 'prop-types';
import JobCard from './JobCard';

function JobList({ jobs = [], savedJobs = [], onToggleSave }) {
  const jobList = Array.isArray(jobs) ? jobs : [];
  const savedList = Array.isArray(savedJobs) ? savedJobs : [];

  if (jobList.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No jobs match your current search or filters.</p>
      </div>
    );
  }

  return (
    <div className="job-list-grid" aria-label="Job listings">
      {jobList.map((job) => {
        const isSaved =
          savedList.includes(job.id) ||
          savedList.includes(String(job.id)) ||
          savedList.includes(Number(job.id));
        return (
          <JobCard
            key={job.id}
            job={job}
            saved={isSaved}
            onToggleSave={onToggleSave || (() => {})}
          />
        );
      })}
    </div>
  );
}

JobList.propTypes = {
  jobs: PropTypes.array,
  savedJobs: PropTypes.array,
  onToggleSave: PropTypes.func,
};

JobList.defaultProps = {
  jobs: [],
  savedJobs: [],
  onToggleSave: () => {},
};

export default JobList;