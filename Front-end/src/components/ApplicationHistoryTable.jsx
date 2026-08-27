import PropTypes from 'prop-types';

function ApplicationHistoryTable({ applications, jobs }) {
  // Safety check: ensure applications is an array
  if (!Array.isArray(applications) || applications.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No applications have been submitted yet.</p>
      </div>
    );
  }

  // Ensure jobs is an array (for find to work)
  const jobsArray = Array.isArray(jobs) ? jobs : [];

  return (
    <div className="history-table" role="region" aria-label="Application History">
      <div className="history-row history-head">
        <span>Job Title & Company</span>
        <span>Date Applied</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {applications.map((application) => {
        const job = jobsArray.find((item) => String(item.id) === String(application.jobId)) || {};
        const statusKey = application.status?.toLowerCase().replace(/\s+/g, '-') || 'submitted';
        const title = job.title || application.title || 'Unknown Role';
        const company = job.company || application.company || 'Unknown Company';
        const date = application.appliedDate || application.date || 'N/A';

        return (
          <div key={`${application.jobId}-${date}`} className="history-row">
            <div>
              <strong>{title}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{company}</div>
            </div>
            <span>{date}</span>
            <div>
              <span className={`status-pill status-${statusKey}`}>
                {application.status || 'Submitted'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Details</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

ApplicationHistoryTable.propTypes = {
  applications: PropTypes.array,
  jobs: PropTypes.array,
};

ApplicationHistoryTable.defaultProps = {
  applications: [],
  jobs: [],
};

export default ApplicationHistoryTable;