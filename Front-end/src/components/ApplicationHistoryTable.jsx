function ApplicationHistoryTable({ applications, jobs }) {
    // ✅ Safety check: ensure applications is an array
    if (!Array.isArray(applications) || applications.length === 0) {
        return <p className="empty-state">No applications have been submitted yet.</p>;
    }

    // ✅ Ensure jobs is an array (for find to work)
    const jobsArray = Array.isArray(jobs) ? jobs : [];

    return (
        <div className="history-table">
            <div className="history-row history-head">
                <span>Job Title</span>
                <span>Company</span>
                <span>Applied Date</span>
                <span>Status</span>
            </div>
            {applications.map((application) => {
                // ✅ Safe find with fallback
                const job = jobsArray.find((item) => item.id === application.jobId) || {};
                return (
                    <div key={`${application.jobId}-${application.appliedDate}`} className="history-row">
                        <span>{job.title || 'Unknown role'}</span>
                        <span>{job.company || '—'}</span>
                        <span>{application.appliedDate}</span>
                        <span className={`status-pill status-${application.status?.toLowerCase().replace(' ', '-') || 'submitted'}`}>
                            {application.status || 'Submitted'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default ApplicationHistoryTable;