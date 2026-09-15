import PropTypes from 'prop-types';

const FILTER_GROUPS = [
  { name: 'category', label: 'Category', options: ['All', 'Engineering', 'Design', 'Marketing', 'Human Resources', 'Data', 'Recruiting', 'Customer Success', 'Research'] },
  { name: 'workMode', label: 'Work mode', options: ['All', 'Remote', 'Hybrid', 'Office'] },
  { name: 'employmentType', label: 'Employment type', options: ['All', 'Full Time', 'Part Time', 'Contract', 'Internship'] },
  { name: 'careerLevel', label: 'Career level', options: ['All', 'Entry Level', 'Mid Level', 'Senior'] },
  { name: 'postedWithin', label: 'Posted within', options: ['Any', 'Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 14 days'] },
];

function FilterPanel({ filters, onChange, onApplyFilters, onReset, mobile = false }) {
  const activeCount = Object.entries(filters).filter(([key, value]) => value && value !== 'All' && !(key === 'postedWithin' && value === 'Any')).length;

  return (
    <aside className={mobile ? 'filter-panel filter-panel-mobile' : 'filter-panel'} aria-label="Job filters">
      <div className="filter-panel-heading">
        <div>
          <h2>Refine results</h2>
          <span>{activeCount ? `${activeCount} active` : 'Start with a filter'}</span>
        </div>
      </div>

      {FILTER_GROUPS.map((group) => (
        <div className="filter-section" key={group.name}>
          <label htmlFor={`filter-${group.name}`}>{group.label}</label>
          <select id={`filter-${group.name}`} name={group.name} value={filters[group.name] || group.options[0]} onChange={onChange}>
            {group.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      ))}

      <div className="filter-panel-footer">
        <button type="button" className="button button-primary filter-apply-button" onClick={() => onApplyFilters?.(filters)}>Apply filters</button>
        <button type="button" className="button button-quiet filter-reset-button" onClick={onReset}>Clear all</button>
      </div>
    </aside>
  );
}

FilterPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func,
  onReset: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
};

FilterPanel.defaultProps = { onApplyFilters: () => {}, mobile: false };

export default FilterPanel;
