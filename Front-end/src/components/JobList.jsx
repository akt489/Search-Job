import JobCard from './JobCard';

function JobList({ jobs = [], savedJobs = [], onToggleSave }) {
    // ✅ Safety check: ensure jobs is an array
    if (!Array.isArray(jobs)) {
        return <p className="empty-state">No jobs available.</p>;
    }

    if (jobs.length === 0) {
        return <p className="empty-state">No jobs match your current search or filters.</p>;
    }

    return (
        <div className="job-list-grid">
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                    saved={savedJobs?.includes(job.id) || false}
                    onToggleSave={onToggleSave}
                />
            ))}
        </div>
    );
}

export default JobList;