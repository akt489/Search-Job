import { useMemo, useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import JobList from '../components/JobList';
import Pagination from '../components/Pagination';

const API_BASE = import.meta.env.VITE_API_URL || '';

function Jobs({ savedJobs, onToggleSave }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [filters, setFilters] = useState({
        category: 'All',
        location: 'All',
        employmentType: 'All',
        careerLevel: 'All',
        postedWithin: 'Any',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // Fetch all jobs from the API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/jobs`);
                if (!response.ok) throw new Error('Failed to load jobs');
                const data = await response.json();
                setJobs(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Unable to load jobs. Please try again later.');
                console.error('Jobs fetch error:', err);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter jobs based on search and filters
    const filteredJobs = useMemo(() => {
        const safeJobs = Array.isArray(jobs) ? jobs : [];
        return safeJobs.filter((job) => {
            // Search filter
            const matchesSearch =
                searchQuery.trim() === '' ||
                [job.title, job.company, job.category, job.description].some((value) =>
                    value?.toLowerCase().includes(searchQuery.toLowerCase())
                );

            // Category filter
            const matchesCategory = filters.category === 'All' || job.category === filters.category;

            // Location filter
            const matchesLocation = filters.location === 'All' || job.location === filters.location;

            // Employment type filter (maps to job.type or job.employmentType)
            const matchesType = filters.employmentType === 'All' || (job.type || job.employmentType) === filters.employmentType;

            // Career level filter
            const matchesLevel = filters.careerLevel === 'All' || true;

            // Posted within filter (uses posted_at)
            let matchesPosted = true;
            if (filters.postedWithin !== 'Any' && job.posted_at) {
                const postedDate = new Date(job.posted_at);
                const now = new Date();
                const daysAgo = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));

                if (filters.postedWithin === 'Last 24 hours') {
                    matchesPosted = daysAgo <= 1;
                } else if (filters.postedWithin === 'Last 3 days') {
                    matchesPosted = daysAgo <= 3;
                } else if (filters.postedWithin === 'Last 7 days') {
                    matchesPosted = daysAgo <= 7;
                } else if (filters.postedWithin === 'Last 14 days') {
                    matchesPosted = daysAgo <= 14;
                }
            }

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesType &&
                matchesLevel &&
                matchesPosted
            );
        });
    }, [jobs, filters, searchQuery]);

    // Pagination
    const jobsPerPage = 10;
    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));

    // Ensure current page is valid
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const pageJobs = filteredJobs.slice(
        (safeCurrentPage - 1) * jobsPerPage,
        safeCurrentPage * jobsPerPage
    );

    // Handlers
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchSubmit = (value) => {
        setSearchQuery(typeof value === 'string' ? value.trim() : searchQuery.trim());
        setCurrentPage(1);
    };

    const handleFilterChange = (event) => {
        setFilters((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
        setCurrentPage(1);
    };

    // Loading state
    if (loading) {
        return (
            <div className="page-content page-jobs">
                <div className="section-heading">
                    <div>
                        <h1>Explore open roles</h1>
                        <p>Loading jobs...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="page-content page-jobs">
                <div className="section-heading">
                    <div>
                        <h1>Explore open roles</h1>
                        <p className="error-message">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content page-jobs">
            <div className="section-heading">
                <div>
                    <h1>Explore open roles</h1>
                    <p>Search by role, company, location, and more to find the best match.</p>
                </div>
            </div>

            <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                placeholder="Search job title, company or category"
            />

            <div className="search-metadata">
                <p>
                    {searchQuery
                        ? `Filtering ${filteredJobs.length} matching roles for “${searchQuery}”.`
                        : `Use the search field above to filter open jobs by title, company, category, or skill.`}
                </p>
            </div>

            <div className="jobs-layout">
                <FilterPanel filters={filters} onChange={handleFilterChange} />

                <div className="jobs-main">
                    <div className="job-count-bar">
                        <p>
                            Showing {pageJobs.length} of {filteredJobs.length} jobs
                        </p>
                    </div>

                    {pageJobs.length > 0 ? (
                        <JobList
                            jobs={pageJobs}
                            savedJobs={savedJobs}
                            onToggleSave={onToggleSave}
                        />
                    ) : (
                        <div className="empty-state">
                            <h3>No jobs found</h3>
                            <p>Try adjusting your filters or search terms.</p>
                        </div>
                    )}

                    <Pagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default Jobs;