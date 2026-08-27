import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SavedJobsList from '../components/SavedJobsList';

const API_BASE = import.meta.env.VITE_API_URL || '';

function SavedJobs({ savedJobs, onToggleSave }) {
    const [savedJobsData, setSavedJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const token = localStorage.getItem('jobscout-token'); // ✅ FIXED

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${API_BASE}/users/saved-jobs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('jobscout-token');
                        localStorage.removeItem('jobscout-user');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to load saved jobs');
                }

                const data = await response.json();
                setSavedJobsData(data);
            } catch (err) {
                setError('Unable to load your saved jobs. Please try again later.');
                console.error('Saved jobs fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, [navigate, savedJobs]);

    if (loading) {
        return (
            <div className="page-content page-saved">
                <div className="section-heading">
                    <div>
                        <h1>Saved jobs</h1>
                        <p>Loading your saved jobs...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content page-saved">
                <div className="section-heading">
                    <div>
                        <h1>Saved jobs</h1>
                        <p className="error-message">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content page-saved">
            <div className="section-heading">
                <div>
                    <h1>Saved jobs</h1>
                    <p>Keep track of opportunities you want to revisit.</p>
                </div>
            </div>

            {savedJobsData.length === 0 ? (
                <div className="empty-state">
                    <h3>No saved jobs yet</h3>
                    <p>Start exploring jobs and save the ones that interest you!</p>
                    <p>
                        <button
                            className="button button-primary"
                            onClick={() => navigate('/jobs')}
                        >
                            Browse Jobs
                        </button>
                    </p>
                </div>
            ) : (
                <SavedJobsList
                    jobs={savedJobsData}
                    onToggleSave={onToggleSave}
                />
            )}
        </div>
    );
}

export default SavedJobs;