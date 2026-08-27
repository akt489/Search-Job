import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationHistoryTable from '../components/ApplicationHistoryTable';

const API_BASE = import.meta.env.VITE_API_URL || '';

function ApplicationHistory() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('jobscout-token'); // ✅ FIXED

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${API_BASE}/jobs/history`, {
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
                    throw new Error('Failed to load application history');
                }

                const data = await response.json();
                setApplications(data);
            } catch (err) {
                setError('Unable to load your application history. Please try again later.');
                console.error('History fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    if (loading) {
        return (
            <div className="page-content page-history">
                <div className="section-heading">
                    <div>
                        <h1>Application history</h1>
                        <p>Loading your applications...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content page-history">
                <div className="section-heading">
                    <div>
                        <h1>Application history</h1>
                        <p className="error-message">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content page-history">
            <div className="section-heading">
                <div>
                    <h1>Application history</h1>
                    <p>Track every role you've applied to and review its current status.</p>
                </div>
            </div>
            <ApplicationHistoryTable applications={applications} />
        </div>
    );
}

export default ApplicationHistory;