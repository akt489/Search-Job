import { useState } from 'react';

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
    <form className="search-bar" onSubmit={handleSubmit} noValidate>
      <label htmlFor="search-input" className="sr-only">
        Search jobs
      </label>

      <div className="search-field">
        <input
          id="search-input"
          type="search"
          className="search-input"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || 'Search by title, company, or keyword...'}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby="search-error"
        />

        <p
          className={`search-error ${error ? 'visible' : ''}`}
          id="search-error"
          role="alert"
        >
          {error || '\u00A0'}
        </p>
      </div>

      <button type="submit" className="button button-primary search-button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;