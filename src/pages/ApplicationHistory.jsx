import ApplicationHistoryTable from '../components/ApplicationHistoryTable';
import jobsData from '../data/mockJobs';

function ApplicationHistory({ applications }) {
    return (
        <div className="page-content page-history">
            <div className="section-heading">
                <div>
                    <h1>Application history</h1>
                    <p>Track every role you've applied to and review its current status.</p>
                </div>
            </div>
            <ApplicationHistoryTable applications={applications} jobs={jobsData} />
        </div>
    );
}

export default ApplicationHistory;
