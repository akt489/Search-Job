import JobCard from './JobCard';

/**
 * @typedef {Object} JobListProps
 * @property {Array<any>} [jobs]
 * @property {Array<any>} [savedJobs]
 * @property {(jobId: any) => void} [onToggleSave]
 */

/**
 * @param {JobListProps} props
 */
function JobList({ jobs = [], savedJobs = [], onToggleSave }) {
    const jobList = Array.isArray(jobs) ? jobs : [];
    const savedList = Array.isArray(savedJobs) ? savedJobs : [];

    if (jobList.length === 0) {
        return <p className="empty-state">No jobs match your current search or filters.</p>;
    }

    return (
        <div className="job-list-grid">
            {jobList.map((job) => {
                const isSaved = savedList.includes(job.id) || savedList.includes(String(job.id)) || savedList.includes(Number(job.id));
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

export default JobList;