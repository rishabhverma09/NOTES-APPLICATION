import React, { useState, useEffect } from "react";

/**
 * SearchBar Component:
 * Allows users to search their notes by title or content.
 * Provides a dedicated Search button, a Clear button, and input handling.
 *
 * @param {string} value - Current search value
 * @param {function} onSearch - Callback when search is triggered
 * @param {function} onClear - Callback when search is cleared
 * @param {boolean} isSearching - Indicates search request in flight
 */
const SearchBar = ({ value = "", onSearch, onClear, isSearching = false }) => {
  const [term, setTerm] = useState(value);

  // Sync internal state if parent resets value externally
  useEffect(() => {
    setTerm(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleClear = () => {
    setTerm("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit} role="search">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search notes by title or content..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        {term && (
          <button
            type="button"
            className="search-clear-inline"
            onClick={handleClear}
            title="Clear search input"
            aria-label="Clear search input"
          >
            &times;
          </button>
        )}
      </div>

      <div className="search-buttons">
        <button
          type="submit"
          id="search-btn"
          className="btn btn-primary btn-sm"
          disabled={isSearching}
        >
          {isSearching ? (
            <span className="btn-loading">
              <span className="spinner-sm"></span> Searching...
            </span>
          ) : (
            "Search"
          )}
        </button>

        {term && (
          <button
            type="button"
            id="clear-search-btn"
            className="btn btn-secondary btn-sm"
            onClick={handleClear}
            disabled={isSearching}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
