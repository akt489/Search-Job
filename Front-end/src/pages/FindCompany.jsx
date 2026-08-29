import { useMemo, useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function FindCompany() {
    const [companies, setCompanies] = useState([]);
    const [locations, setLocations] = useState(['All']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');

    // ─── Fetch Locations ──────────────────────────────────────
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/jobs/locations`);
                if (!res.ok) throw new Error('Failed to load locations');
                const data = await res.json();
                setLocations(['All', ...(Array.isArray(data) ? data : [])]);
            } catch (err) {
                console.error('Location fetch error:', err);
                setLocations(['All']);
            }
        };
        fetchLocations();
    }, []);

    // ─── Fetch Companies ──────────────────────────────────────
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (locationFilter !== 'All') params.append('location', locationFilter);

                const url = `${API_BASE_URL}/jobs?${params.toString()}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setCompanies(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                setError(err.message);
                setCompanies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [searchQuery, locationFilter]);

    // ─── Debounce Search ──────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput.trim());
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchQuery(searchInput.trim());
    };

    // ─── Render ──────────────────────────────────────────────
    return (
        <div className="page-content page-companies">
            {/* ─── Hero Section ─────────────────────────────────── */}
            <section className="companies-hero glass-card">
                <div className="hero-content">
                    <div className="hero-badge">🏢 Find Your Next Company</div>
                    <h1>Discover Top Employers</h1>
                    <p className="hero-description">
                        Search, compare, and connect with hiring teams across leading companies in Ethiopia and beyond.
                    </p>
                </div>
                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">{companies.length}+</span>
                        <span className="stat-label">Active Employers</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number">{locations.length - 1}</span>
                        <span className="stat-label">Locations</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number">⭐ 4.8</span>
                        <span className="stat-label">Average Rating</span>
                    </div>
                </div>
            </section>

            {/* ─── Search & Filter ─────────────────────────────── */}
            <div className="company-search-panel glass-card">
                <SearchBar
                    value={searchInput}
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit}
                    placeholder="Search companies, industries, or locations..."
                />
                <div className="company-filters">
                    <label htmlFor="company-location">📍 Location</label>
                    <select
                        id="company-location"
                        value={locationFilter}
                        onChange={(event) => setLocationFilter(event.target.value)}
                    >
                        {locations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ─── Results Summary ─────────────────────────────── */}
            <div className="company-summary glass-card">
                {loading ? (
                    <div className="summary-loading">
                        <span className="loading-spinner" />
                        <span>Searching for companies...</span>
                    </div>
                ) : searchQuery ? (
                    <p>
                        <strong>{companies.length}</strong> company{companies.length === 1 ? '' : 'ies'} found for “
                        <span className="search-highlight">{searchQuery}</span>”
                    </p>
                ) : (
                    <p>Browse <strong>{companies.length}</strong> featured employers</p>
                )}
            </div>

            {/* ─── Company Grid ────────────────────────────────── */}
            <div className="company-grid">
                {!loading &&
                    companies.map((job) => (
                        <article key={job.id} className="company-card glass-card">
                            <div className="company-card-header">
                                <div className="company-avatar">
                                    {job.company?.charAt(0) || 'C'}
                                </div>
                                <div className="company-info">
                                    <h2>{job.company || 'Unknown Company'}</h2>
                                    <p className="company-industry">
                                        {job.category || job.type || 'N/A'}
                                    </p>
                                </div>
                                <span className="company-chip">{job.location || 'Remote'}</span>
                            </div>

                            <p className="company-description">
                                {job.description || 'No description available.'}
                            </p>

                            <div className="company-meta">
                                {job.remote && <span className="meta-tag">🌐 Remote</span>}
                                {job.type && <span className="meta-tag">{job.type}</span>}
                                {job.salary && <span className="meta-tag salary">💰 {job.salary}</span>}
                            </div>

                            <div className="company-card-footer">
                                <div className="company-contact">
                                    {job.contact ? (
                                        <a href={`mailto:${job.contact}`} className="contact-link">
                                            📧 {job.contact}
                                        </a>
                                    ) : (
                                        <span className="contact-placeholder">📧 Contact info coming soon</span>
                                    )}
                                    {job.website && (
                                        <a
                                            href={`https://${job.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-link"
                                        >
                                            🌐 {job.website}
                                        </a>
                                    )}
                                </div>
                                <button className="button button-primary small-button">
                                    View Company →
                                </button>
                            </div>
                        </article>
                    ))}

                {!loading && companies.length === 0 && (
                    <div className="empty-state glass-card">
                        <div className="empty-icon">🔍</div>
                        <h3>No companies matched your search</h3>
                        <p>Try adjusting your search terms or filters to find more results.</p>
                        <button
                            className="button button-secondary"
                            onClick={() => {
                                setSearchInput('');
                                setSearchQuery('');
                                setLocationFilter('All');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="loading-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="company-card-skeleton">
                                <div className="skeleton" style={{ height: '60px', marginBottom: '12px' }} />
                                <div className="skeleton" style={{ height: '80px', marginBottom: '12px' }} />
                                <div className="skeleton" style={{ height: '40px' }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindCompany;