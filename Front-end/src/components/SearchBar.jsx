import { MapPin, Search } from 'lucide-react';
import PropTypes from 'prop-types';

function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search roles, companies, or skills',
  locationValue,
  onLocationChange,
  locationPlaceholder = 'Location',
  sortValue,
  onSortChange,
  buttonLabel = 'Search jobs',
}) {
  const advanced = locationValue !== undefined;

  return (
    <form className={advanced ? 'search-bar search-bar-advanced' : 'search-bar'} onSubmit={onSubmit} role="search">
      <label className="search-control" htmlFor="job-search-input">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search roles, companies, or skills</span>
        <input id="job-search-input" type="search" value={value} onChange={onChange} placeholder={placeholder} autoComplete="off" />
      </label>
      {advanced && (
        <label className="search-control search-location-control" htmlFor="job-location-input">
          <MapPin size={17} aria-hidden="true" />
          <span className="sr-only">Location</span>
          <input id="job-location-input" type="text" value={locationValue} onChange={onLocationChange} placeholder={locationPlaceholder} />
        </label>
      )}
      {sortValue !== undefined && (
        <label className="search-sort-control" htmlFor="job-sort-select">
          <span className="sr-only">Sort jobs</span>
          <select id="job-sort-select" value={sortValue} onChange={onSortChange} aria-label="Sort jobs">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      )}
      <button type="submit" className="button button-primary search-button">
        <Search size={16} aria-hidden="true" />
        <span>{buttonLabel}</span>
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  locationValue: PropTypes.string,
  onLocationChange: PropTypes.func,
  locationPlaceholder: PropTypes.string,
  sortValue: PropTypes.string,
  onSortChange: PropTypes.func,
  buttonLabel: PropTypes.string,
};

export default SearchBar;
