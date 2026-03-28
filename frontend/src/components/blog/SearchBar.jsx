import { useState } from 'react';
import '../styles/SearchBar.scss';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search blogs by title or tags..."
        className="search-input"
      />
      <button type="submit" className="search-btn">
        🔍 Search
      </button>
    </form>
  );
};

export default SearchBar;
