import { useState } from 'react';
import PropTypes from 'prop-types';

function SearchBar({ value, onChange, onSubmit, placeholder }) {
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!value.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setError('');
    onSubmit(value.trim());
  };

  const handleChange = (event) => {
    setError('');
    onChange(event);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} noValidate role="search">
      <div className="search-field-container">
        <div className="search-field">
          <label htmlFor="search-input" className="sr-only">
            Search jobs
          </label>
          <input
            id="search-input"
            type="search"
            className="search-input"
            value={value}
            onChange={handleChange}
            placeholder={placeholder || 'Search by title, company, or keyword...'}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'search-error' : undefined}
          />
        </div>

        <button type="submit" className="button button-primary search-button">
          Search
        </button>
      </div>

      {error && (
        <p className="search-error" id="search-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: 'Search by title, company, or keyword...',
};

export default SearchBar;