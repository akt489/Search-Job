function ApplicationHistoryTable({ applications, jobs }) {
    if (!applications.length) {
        return <p className="empty-state">No applications have been submitted yet.</p>;
    }

    return (
        <div className="history-table">
            <div className="history-row history-head">
                <span>Job Title</span>
                <span>Company</span>
                <span>Applied Date</span>
                <span>Status</span>
            </div>
            {applications.map((application) => {
                const job = jobs.find((item) => item.id === application.jobId) || {};
                return (
                    <div key={`${application.jobId}-${application.appliedDate}`} className="history-row">
                        <span>{job.title || 'Unknown role'}</span>
                        <span>{job.company || '—'}</span>
                        <span>{application.appliedDate}</span>
                        <span className={`status-pill status-${application.status.toLowerCase().replace(' ', '-')}`}>
                            {application.status}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default ApplicationHistoryTable;
