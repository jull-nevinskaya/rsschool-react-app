import React from "react";
import useSearchTerm from "../../hooks/useSearchTerm.tsx";
import { useTheme } from '../../ThemeContext.tsx';

interface SearchProps {
  onSearch: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const { theme } = useTheme();
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
    <div className={`top-controls ${theme}`}>
      <input
        type="text"
        className={`search-input ${theme}`}
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Enter Pokemon name..."
      />
      <button className={`search-button ${theme}`} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default Search;
