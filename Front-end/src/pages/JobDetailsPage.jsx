import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobDetails from '../components/JobDetails';
import { API_BASE, safeJson } from '../utils/api';


function JobDetailsPage({ savedJobs, onToggleSave }) {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`${API_BASE}/jobs/${jobId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Job not found.');
                    } else {
                        throw new Error('Failed to load job details');
                    }
                    setJob(null);
                    return;
                }

                const data = await safeJson(response, {});
                setJob(data);
                setError('');
            } catch (err) {
                setError('Unable to load job details. Please try again later.');
                console.error('Job fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    if (loading) {
        return (
            <div className="page-content page-job-details">
                    <div className="state-panel state-panel-loading"><div className="loading-skeleton loading-skeleton-heading" /><span className="sr-only">Loading job details</span></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content page-job-details">
                <div className="state-panel state-panel-error"><div className="state-copy"><h2>{error}</h2><p>Return to the jobs workspace and choose another role.</p></div><button className="button button-secondary" onClick={() => navigate('/jobs')}>Back to jobs</button></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="page-content page-job-details">
                <div className="state-panel state-panel-empty"><div className="state-copy"><h2>Job not found</h2><p>The role may have been removed or is no longer available.</p></div><button className="button button-secondary" onClick={() => navigate('/jobs')}>Browse all jobs</button></div>
            </div>
        );
    }

    return (
        <div className="page-content page-job-details">
            <JobDetails
                job={job}
                    saved={savedJobs.includes(jobId) || savedJobs.includes(Number(jobId))}
                onToggleSave={onToggleSave}
            />
        </div>
    );
}

export default JobDetailsPage;