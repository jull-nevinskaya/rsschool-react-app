import React from "react";
import useSearchTerm from "../../hooks/useSearchTerm.tsx";

interface SearchProps {
  onSearch: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useSearchTerm();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    setSearchTerm(trimmedTerm);
    onSearch(trimmedTerm);
  };

  return (
    <div className="top-controls">
      <input
        type="text"
        className="search-input"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Enter Pokemon name..."
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default Search;
