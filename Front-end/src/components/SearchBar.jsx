import { Search } from "lucide-react";

function SearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <div className="search-field-container">
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Search..."}
        />
        <button type="submit" className="button button-primary search-button">
          <Search size={18} />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;