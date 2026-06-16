import { useMemo, useState } from 'react';
import companies from '../data/companies';
import SearchBar from '../components/SearchBar';

function FindCompany() {
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');

    const locations = useMemo(
        () => ['All', ...new Set(companies.map((company) => company.location))],
        [],
    );

    const filteredCompanies = useMemo(() => {
        return companies.filter((company) => {
            const matchesSearch = [company.name, company.industry, company.description]
                .join(' ')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesLocation = locationFilter === 'All' || company.location === locationFilter;
            return matchesSearch && matchesLocation;
        });
    }, [searchQuery, locationFilter]);

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchQuery(searchInput.trim());
    };

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
                    <select id="company-location" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
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
                    {searchQuery
                        ? `Showing ${filteredCompanies.length} company${filteredCompanies.length === 1 ? '' : 'ies'} for “${searchQuery}”`
                        : `Browse ${filteredCompanies.length} featured employers`}
                </p>
            </div>

            <div className="company-grid">
                {filteredCompanies.map((company) => (
                    <article key={company.id} className="company-card">
                        <div className="company-card-header">
                            <div>
                                <h2>{company.name}</h2>
                                <p className="company-industry">{company.industry}</p>
                            </div>
                            <span className="company-chip">{company.location}</span>
                        </div>
                        <p className="company-description">{company.description}</p>
                        <div className="company-contact-list">
                            <span>{company.phone}</span>
                            <a href={`mailto:${company.contact}`}>{company.contact}</a>
                            <a href={`https://${company.website}`} target="_blank" rel="noreferrer">{company.website}</a>
                        </div>
                    </article>
                ))}
                {filteredCompanies.length === 0 && (
                    <div className="empty-state">
                        <h3>No companies matched your search.</h3>
                        <p>Try a broader keyword or choose a different location.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindCompany;
