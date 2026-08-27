import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobDetails from '../components/JobDetails';

const API_BASE = import.meta.env.VITE_API_URL || '';

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

                const data = await response.json();
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
                <p>Loading job details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content page-job-details">
                <div className="empty-state">
                    <h3>{error}</h3>
                    <p>
                        <button
                            className="button button-secondary"
                            onClick={() => navigate('/jobs')}
                        >
                            Back to Jobs
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="page-content page-job-details">
                <div className="empty-state">
                    <h3>Job not found</h3>
                    <p>The job you're looking for doesn't exist or may have been removed.</p>
                    <p>
                        <button
                            className="button button-secondary"
                            onClick={() => navigate('/jobs')}
                        >
                            Browse All Jobs
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content page-job-details">
            <JobDetails
                job={job}
                saved={savedJobs.includes(jobId)}
                onToggleSave={onToggleSave}
            />
        </div>
    );
}

export default JobDetailsPage;