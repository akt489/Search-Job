import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import jobsData from '../data/mockJobs';

function ApplyJob({ user, onSubmit }) {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const job = jobsData.find((item) => item.id === jobId);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!job) {
        return <p className="empty-state">This job is not available.</p>;
    }

    return (
        <div className="page-content page-apply">
            <ApplicationForm job={job} onSubmit={(applicationData) => {
                onSubmit(applicationData);
                navigate('/history');
            }} />
        </div>
    );
}

export default ApplyJob;
