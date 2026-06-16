import JobCard from './JobCard';

function JobList({ jobs, savedJobs, onToggleSave }) {
    if (!jobs.length) {
        return <p className="empty-state">No jobs match your current search or filters.</p>;
    }

    return (
        <div className="job-list-grid">
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onToggleSave={onToggleSave} />
            ))}
        </div>
    );
}

export default JobList;
