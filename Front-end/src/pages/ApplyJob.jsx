import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';

const API_BASE = import.meta.env.VITE_API_URL || '';

function ApplyJob({ user, onSubmit }) {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchJob = async () => {
            try {
                const token = localStorage.getItem('jobscout-token'); // ✅ FIXED
                const response = await fetch(`${API_BASE}/jobs/${jobId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Job not found.');
                    } else if (response.status === 401) {
                        navigate('/login');
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
    }, [jobId, user, navigate]);

    const handleSubmit = async (applicationData) => {
        try {
            const token = localStorage.getItem('jobscout-token'); // ✅ FIXED
            const response = await fetch(`${API_BASE}/api/jobs/apply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId: jobId,
                    coverLetter: applicationData.coverLetter || '',
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                const data = await response.json();
                throw new Error(data.error || 'Application failed.');
            }

            if (onSubmit) {
                onSubmit(applicationData);
            }

            navigate('/history');
        } catch (err) {
            setError(err.message || 'Unable to submit application. Please try again.');
            console.error('Application submit error:', err);
        }
    };

    if (loading) {
        return (
            <div className="page-content page-apply">
                <p>Loading job details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content page-apply">
                <p className="empty-state">{error}</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="page-content page-apply">
                <p className="empty-state">This job is not available.</p>
            </div>
        );
    }

    return (
        <div className="page-content page-apply">
            <ApplicationForm
                job={job}
                onSubmit={handleSubmit}
                error={error}
            />
        </div>
    );
}

export default ApplyJob;