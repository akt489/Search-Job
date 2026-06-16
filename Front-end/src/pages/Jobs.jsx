import { useMemo, useState } from 'react';
import jobsData from '../data/mockJobs';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import JobList from '../components/JobList';
import Pagination from '../components/Pagination';

function Jobs({ savedJobs, onToggleSave }) {
    const [searchQuery, setSearchQuery] = useState('');

    const [filters, setFilters] = useState({
        category: 'All',
        location: 'All',
        employmentType: 'All',
        careerLevel: 'All',
        postedWithin: 'Any',
    });

    const [currentPage, setCurrentPage] = useState(1);

    const filteredJobs = useMemo(() => {
        return jobsData.filter((job) => {
            const matchesSearch =
                searchQuery.trim() === '' ||
                [job.title, job.company, job.category, job.description].some((value) =>
                    value.toLowerCase().includes(searchQuery.toLowerCase())
                );

            const matchesCategory = filters.category === 'All' || job.category === filters.category;
            const matchesLocation = filters.location === 'All' || job.location === filters.location;
            const matchesType = filters.employmentType === 'All' || job.employmentType === filters.employmentType;
            const matchesLevel = filters.careerLevel === 'All' || job.careerLevel === filters.careerLevel;

            const matchesPosted =
                filters.postedWithin === 'Any' ||
                (filters.postedWithin === 'Last 24 hours' && job.posted.toLowerCase().includes('hour')) ||
                (filters.postedWithin === 'Last 3 days' && /hour|day/.test(job.posted.toLowerCase())) ||
                (filters.postedWithin === 'Last 7 days' && /day|week/.test(job.posted.toLowerCase())) ||
                (filters.postedWithin === 'Last 14 days' && /day|week/.test(job.posted.toLowerCase()));

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesType &&
                matchesLevel &&
                matchesPosted
            );
        });
    }, [filters, searchQuery]);

    const jobsPerPage = 10;
    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));

    const pageJobs = filteredJobs.slice(
        (currentPage - 1) * jobsPerPage,
        currentPage * jobsPerPage
    );

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchSubmit = (value) => {
        setSearchQuery(value.trim());
        setCurrentPage(1);
    };

    const handleFilterChange = (event) => {
        setFilters((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
        setCurrentPage(1);
    };

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

                    <JobList
                        jobs={pageJobs}
                        savedJobs={savedJobs}
                        onToggleSave={onToggleSave}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default Jobs;