function FilterPanel({ filters, onChange, onApplyFilters }) {
    const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Human Resources', 'Data', 'Recruiting', 'Customer Success', 'Research'];
    const locations = ['All', 'Remote', 'New York, NY', 'Austin, TX', 'San Francisco, CA', 'Chicago, IL', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 'Miami, FL'];
    const employmentTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship'];
    const careerLevels = ['All', 'Entry Level', 'Mid Level', 'Senior'];
    const postedWithin = ['Any', 'Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 14 days'];

    return (
        <aside className="filter-panel">

            <div className="filter-section">
                <h4>Category</h4>
                <select name="category" value={filters.category} onChange={onChange}>
                    {categories.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <h4>Location</h4>
                <select name="location" value={filters.location} onChange={onChange}>
                    {locations.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <h4>Employment Type</h4>
                <select name="employmentType" value={filters.employmentType} onChange={onChange}>
                    {employmentTypes.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <h4>Career Level</h4>
                <select name="careerLevel" value={filters.careerLevel} onChange={onChange}>
                    {careerLevels.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <h4>Posted Within</h4>
                <select name="postedWithin" value={filters.postedWithin} onChange={onChange}>
                    {postedWithin.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                className="filter-apply-button"
                onClick={() => onApplyFilters?.(filters)}
            >
                Apply Filters
            </button>

        </aside>
    );
}

export default FilterPanel;