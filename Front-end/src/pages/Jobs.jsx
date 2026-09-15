import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Briefcase, ChevronDown, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import JobList from '../components/JobList';
import JobPreviewPanel from '../components/JobPreviewPanel';
import MobileFilterSheet from '../components/MobileFilterSheet';
import Pagination from '../components/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/AsyncState';
import { API_BASE, safeJson } from '../utils/api';

const DEFAULT_FILTERS = {
  category: 'All',
  workMode: 'All',
  employmentType: 'All',
  careerLevel: 'All',
  postedWithin: 'Any',
};

function Jobs({ savedJobs, onToggleSave }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [referenceTime] = useState(() => Date.now());

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/jobs`);
      const data = await safeJson(response, []);
      if (!response.ok) throw new Error(data?.error || 'Failed to load jobs');
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setJobs([]);
      setError('Unable to load jobs. Please try again.');
      console.error('Jobs fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetchJobs, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const normalizedLocation = locationQuery.trim().toLowerCase();
    const safeJobs = Array.isArray(jobs) ? jobs : [];
    const filtered = safeJobs.filter((job) => {
      const searchableText = [job.title, job.company, job.category, job.description, ...(Array.isArray(job.tags) ? job.tags : [])].filter(Boolean).join(' ').toLowerCase();
      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesLocation = !normalizedLocation || String(job.location || '').toLowerCase().includes(normalizedLocation);
      const matchesCategory = filters.category === 'All' || job.category === filters.category;
      const workMode = job.workMode || (job.remote ? 'Remote' : 'Office');
      const matchesWorkMode = filters.workMode === 'All' || workMode === filters.workMode;
      const matchesType = filters.employmentType === 'All' || (job.type || job.employmentType) === filters.employmentType;
      const matchesLevel = filters.careerLevel === 'All' || job.careerLevel === filters.careerLevel;
      let matchesPosted = true;
      if (filters.postedWithin !== 'Any' && job.posted_at) {
        const postedAt = new Date(job.posted_at).getTime();
        const daysAgo = Math.floor((referenceTime - postedAt) / (1000 * 60 * 60 * 24));
        const limit = filters.postedWithin === 'Last 24 hours' ? 1 : Number(filters.postedWithin.match(/\d+/)?.[0] || 365);
        matchesPosted = daysAgo <= limit;
      }
      return matchesSearch && matchesLocation && matchesCategory && matchesWorkMode && matchesType && matchesLevel && matchesPosted;
    });

    return filtered.sort((a, b) => {
      const first = new Date(a.posted_at || 0).getTime();
      const second = new Date(b.posted_at || 0).getTime();
      return sortOrder === 'oldest' ? first - second : second - first;
    });
  }, [filters, jobs, locationQuery, referenceTime, searchQuery, sortOrder]);

  const jobsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageJobs = filteredJobs.slice((safeCurrentPage - 1) * jobsPerPage, safeCurrentPage * jobsPerPage);
  const selectedJob = filteredJobs.find((job) => String(job.id) === String(selectedJobId)) || filteredJobs[0] || null;
  const activeFilters = [
    searchQuery.trim() && { key: 'search', label: searchQuery.trim(), remove: () => setSearchQuery('') },
    locationQuery.trim() && { key: 'location', label: locationQuery.trim(), remove: () => setLocationQuery('') },
    filters.category !== 'All' && { key: 'category', label: filters.category, remove: () => setFilters((current) => ({ ...current, category: 'All' })) },
    filters.workMode !== 'All' && { key: 'workMode', label: filters.workMode, remove: () => setFilters((current) => ({ ...current, workMode: 'All' })) },
    filters.employmentType !== 'All' && { key: 'employmentType', label: filters.employmentType, remove: () => setFilters((current) => ({ ...current, employmentType: 'All' })) },
    filters.careerLevel !== 'All' && { key: 'careerLevel', label: filters.careerLevel, remove: () => setFilters((current) => ({ ...current, careerLevel: 'All' })) },
    filters.postedWithin !== 'Any' && { key: 'postedWithin', label: filters.postedWithin, remove: () => setFilters((current) => ({ ...current, postedWithin: 'Any' })) },
  ].filter(Boolean);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setLocationQuery('');
    setSortOrder('newest');
    setCurrentPage(1);
  };

  const handleFilterChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
    setCurrentPage(1);
  };

  const updateSearchQuery = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const updateLocationQuery = (value) => {
    setLocationQuery(value);
    setCurrentPage(1);
  };

  const updateSortOrder = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="page-content page-jobs"><div className="page-title-block"><div><span className="field-kicker">SearchJob / jobs workspace</span><h1>Find open roles</h1><p>Search roles, companies, and skills. Compare the details that matter before you apply.</p></div></div><LoadingState label="Loading jobs" /></div>;
  }

  if (error) {
    return <div className="page-content page-jobs"><div className="page-title-block"><div><span className="field-kicker">SearchJob / jobs workspace</span><h1>Find open roles</h1><p>Search roles, companies, and skills. Compare the details that matter before you apply.</p></div></div><ErrorState title="Jobs are temporarily unavailable" message={error} onRetry={fetchJobs} /></div>;
  }

  return (
    <div className="page-content page-jobs">
      <div className="page-title-block"><div><span className="field-kicker">SearchJob / jobs workspace</span><h1>Find open roles</h1><p>Search roles, companies, and skills. Compare the details that matter before you apply.</p></div><div className="page-title-meta"><strong>{filteredJobs.length || 'No'} open roles</strong><span>Updated from the latest job data</span></div></div>

      <SearchBar value={searchQuery} onChange={(event) => updateSearchQuery(event.target.value)} onSubmit={(event) => { event.preventDefault(); setCurrentPage(1); }} locationValue={locationQuery} onLocationChange={(event) => updateLocationQuery(event.target.value)} sortValue={sortOrder} onSortChange={(event) => updateSortOrder(event.target.value)} />

      <div className="active-filter-bar">
        <span className="active-filter-label">Active filters</span>
        {activeFilters.length === 0 && <span className="active-filter-empty">None yet</span>}
        {activeFilters.map((filter) => <span className="filter-chip" key={filter.key}>{filter.label}<button type="button" onClick={filter.remove} aria-label={`Remove ${filter.label} filter`}><X size={13} /></button></span>)}
        {activeFilters.length > 0 && <button type="button" className="clear-filters-link" onClick={resetFilters}>Clear filters</button>}
      </div>

      <div className="mobile-filter-trigger-row">
        <button type="button" className="button button-secondary" onClick={() => setMobileFiltersOpen(true)}><Filter size={16} /> Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}</button>
        <Link to="/saved" className="button button-secondary"><Bookmark size={16} /> Saved roles</Link>
      </div>

      <div className="jobs-layout">
        <FilterPanel filters={filters} onChange={handleFilterChange} onApplyFilters={() => setCurrentPage(1)} onReset={resetFilters} />
        <section aria-label="Search results">
          <div className="job-count-bar"><div><strong className="results-heading">Results for your search</strong><p>Roles are ordered by posted date</p></div><label className="results-sort"><span>Sort by</span><select value={sortOrder} onChange={(event) => updateSortOrder(event.target.value)} aria-label="Sort results"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select><ChevronDown size={14} aria-hidden="true" /></label></div>
          {pageJobs.length > 0 ? <JobList jobs={pageJobs} savedJobs={savedJobs} onToggleSave={onToggleSave} compact selectedJobId={selectedJobId} onSelect={(job) => setSelectedJobId(job.id)} /> : <EmptyState title="No jobs found" message="Try adjusting your filters or search terms." action={resetFilters} actionLabel="Clear filters" />}
          <Pagination currentPage={safeCurrentPage} totalPages={totalPages} onChange={setCurrentPage} />
        </section>
        <JobPreviewPanel job={selectedJob} saved={selectedJob ? savedJobs.includes(selectedJob.id) || savedJobs.includes(String(selectedJob.id)) : false} onToggleSave={onToggleSave} />
      </div>

      {selectedJob && <Link className="mobile-sticky-apply jobs-mobile-apply" to={`/apply/${selectedJob.id}`}><Briefcase size={16} /> Apply to selected role</Link>}
      <MobileFilterSheet open={mobileFiltersOpen} filters={filters} onChange={handleFilterChange} onApplyFilters={() => setCurrentPage(1)} onReset={resetFilters} onClose={() => setMobileFiltersOpen(false)} />
    </div>
  );
}

export default Jobs;
