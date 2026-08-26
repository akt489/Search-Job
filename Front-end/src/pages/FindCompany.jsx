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

    // 1. Fetch locations from backend (for the dropdown)
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/jobs/locations`);
                if (!res.ok) throw new Error('Failed to load locations');
                const data = await res.json();
                setLocations(['All', ...data]);
            } catch (err) {
                console.error('Location fetch error:', err);
                // Fallback: if the endpoint doesn't exist yet, we'll just show 'All'
                setLocations(['All']);
            }
        };
        fetchLocations();
    }, []);

    // 2. Fetch companies whenever search or location changes
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                // Build query string for the backend
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (locationFilter !== 'All') params.append('location', locationFilter);

                const url = `${API_BASE_URL}/jobs?${params.toString()}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setCompanies(data);
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

    // 3. Debounce search input (wait 400ms after user stops typing)
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
        setSearchQuery(searchInput.trim()); // immediate search on Enter
    };

    // --- Render ---
    return (
        <div className="page-content page-companies">
            <div className="section-heading">
                <div>
                    <h1>Find your next company</h1>
                    <p>Search, compare, and connect with hiring teams across top employers.</p>
                </div>
            </div>

            <div className="company-search-panel">
                <SearchBar
                    value={searchInput}
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit}
                    placeholder="Search companies, industries, or locations"
                />
                <div className="company-filters">
                    <label htmlFor="company-location">Location</label>
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

            <div className="company-summary">
                <p>
                    {loading
                        ? 'Loading companies...'
                        : searchQuery
                            ? `Showing ${companies.length} company${companies.length === 1 ? '' : 'ies'} for “${searchQuery}”`
                            : `Browse ${companies.length} featured employers`}
                </p>
            </div>

            <div className="company-grid">
                {!loading &&
                    companies.map((job) => (
                        <article key={job.id} className="company-card">
                            <div className="company-card-header">
                                <div>
                                    <h2>{job.company}</h2>  {/* Changed from 'name' to 'company' */}
                                    <p className="company-industry">{job.category || job.type || 'N/A'}</p>  {/* Changed from 'industry' */}
                                </div>
                                <span className="company-chip">{job.location}</span>
                            </div>
                            <p className="company-description">{job.description}</p>
                            <div className="company-contact-list">
                                {/* Since phone/contact/website don't exist in the jobs table yet, 
                        we'll show a placeholder. Add them to the DB later if needed. */}
                                <span>Contact info coming soon</span>
                            </div>
                        </article>
                    ))}

                {!loading && companies.length === 0 && (
                    <div className="empty-state">
                        <h3>No companies matched your search.</h3>
                        <p>Try a broader keyword or choose a different location.</p>
                    </div>
                )}

                {loading && <div className="loading-state">Searching...</div>}
            </div>

        </div>
    );
}

export default FindCompany;