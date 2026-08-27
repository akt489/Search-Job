import PropTypes from 'prop-types';

function FilterPanel({ filters, onChange, onApplyFilters }) {
  const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Human Resources', 'Data', 'Recruiting', 'Customer Success', 'Research'];
  const locations = ['All', 'Remote', 'New York, NY', 'Austin, TX', 'San Francisco, CA', 'Chicago, IL', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 'Miami, FL'];
  const employmentTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship'];
  const careerLevels = ['All', 'Entry Level', 'Mid Level', 'Senior'];
  const postedWithin = ['Any', 'Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 14 days'];

  return (
    <aside className="filter-panel" aria-label="Job Filters">
      <div className="filter-section">
        <label htmlFor="filter-category">
          <h4>Category</h4>
        </label>
        <select
          id="filter-category"
          name="category"
          value={filters.category || 'All'}
          onChange={onChange}
        >
          {categories.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="filter-location">
          <h4>Location</h4>
        </label>
        <select
          id="filter-location"
          name="location"
          value={filters.location || 'All'}
          onChange={onChange}
        >
          {locations.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="filter-employment">
          <h4>Employment Type</h4>
        </label>
        <select
          id="filter-employment"
          name="employmentType"
          value={filters.employmentType || 'All'}
          onChange={onChange}
        >
          {employmentTypes.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="filter-career">
          <h4>Career Level</h4>
        </label>
        <select
          id="filter-career"
          name="careerLevel"
          value={filters.careerLevel || 'All'}
          onChange={onChange}
        >
          {careerLevels.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="filter-posted">
          <h4>Posted Within</h4>
        </label>
        <select
          id="filter-posted"
          name="postedWithin"
          value={filters.postedWithin || 'Any'}
          onChange={onChange}
        >
          {postedWithin.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="filter-apply-button button"
        onClick={() => onApplyFilters?.(filters)}
      >
        Apply Filters
      </button>
    </aside>
  );
}

FilterPanel.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string,
    location: PropTypes.string,
    employmentType: PropTypes.string,
    careerLevel: PropTypes.string,
    postedWithin: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func,
};

FilterPanel.defaultProps = {
  onApplyFilters: () => {},
};

export default FilterPanel;