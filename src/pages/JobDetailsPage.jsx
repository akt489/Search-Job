import { useParams } from 'react-router-dom';
import JobDetails from '../components/JobDetails';
import jobsData from '../data/mockJobs';

function JobDetailsPage({ savedJobs, onToggleSave }) {
    const { jobId } = useParams();
    const job = jobsData.find((item) => item.id === jobId);

    return (
        <div className="page-content page-job-details">
            <JobDetails job={job} saved={savedJobs.includes(jobId)} onToggleSave={onToggleSave} />
        </div>
    );
}

export default JobDetailsPage;
