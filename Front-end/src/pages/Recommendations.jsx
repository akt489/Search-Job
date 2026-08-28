import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';

function Recommendations({ user }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recommendations, setRecommendations] = useState({
        jobs: [],
        reasoning: '',
        isFresh: false
    });

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('jobscout-token');

            const response = await fetch(`${API_BASE}/ai/recommendations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to load recommendations');

            const data = await response.json();
            setRecommendations(data);
            setError('');
        } catch (err) {
            setError('Unable to load recommendations. Please try again.');
            console.error('Recommendations error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('jobscout-token');

            const response = await fetch(`${API_BASE}/ai/refresh-recommendations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to refresh recommendations');

            const data = await response.json();
            setRecommendations(data);
            setError('');
        } catch (err) {
            setError('Unable to refresh recommendations. Please try again.');
            console.error('Refresh error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="page-content page-recommendations">
                <div className="section-heading">
                    <div>
                        <h1>✨ AI Job Recommendations</h1>
                        <p>Analyzing your profile and finding the best matches...</p>
                    </div>
                </div>
                <div className="loading-state">Loading recommendations...</div>
            </div>
        );
    }

    return (
        <div className="page-content page-recommendations">
            <div className="section-heading">
                <div>
                    <h1>✨ AI Job Recommendations</h1>
                    <p>Personalized job matches based on your skills and preferences</p>
                </div>
                <button className="button button-primary" onClick={handleRefresh}>
                    🔄 Refresh Recommendations
                </button>
            </div>

            {error && (
                <div className="error-message" style={{ color: 'var(--danger)', padding: '12px 16px', background: 'var(--panel-alt)', borderRadius: '12px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            {recommendations.reasoning && (
                <div className="ai-reasoning" style={{
                    background: 'var(--panel-alt)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    borderLeft: '4px solid var(--accent)'
                }}>
                    <strong>🤖 AI Reasoning:</strong>
                    <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>{recommendations.reasoning}</p>
                    {recommendations.isFresh && (
                        <small style={{ color: 'var(--muted)', display: 'block', marginTop: '8px' }}>
                            ⏱️ Generated just now
                        </small>
                    )}
                </div>
            )}

            {recommendations.jobs.length === 0 ? (
                <div className="empty-state">
                    <h3>No job matches found</h3>
                    <p>Update your profile with skills and preferences to get better recommendations.</p>
                    <Link to="/profile" className="button button-primary" style={{ marginTop: '12px' }}>
                        Update Profile
                    </Link>
                </div>
            ) : (
                <div className="job-list-grid">
                    {recommendations.jobs.map((job, index) => (
                        <div key={job.id} className="job-card">
                            <div className="job-card-header">
                                <h3>{job.title}</h3>
                                <span className="job-chip">
                                    #{index + 1} Match
                                </span>
                            </div>
                            <div className="job-company">{job.company}</div>
                            <div className="job-location">{job.location}</div>
                            <p className="job-description">{job.description?.slice(0, 150)}...</p>
                            <div className="job-tag-row">
                                <span className="job-tag">{job.category}</span>
                                {job.remote && <span className="job-tag">🌐 Remote</span>}
                                <span className="job-tag">{job.salary}</span>
                            </div>
                            <div className="job-card-footer">
                                <Link to={`/jobs/${job.id}`} className="button button-secondary">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Recommendations;