import React, { Component } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
}

class Search extends Component<SearchProps> {
  state = {
    searchTerm: localStorage.getItem('searchTerm') || '',
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearch = () => {
    const trimmedTerm = this.state.searchTerm.trim();
    localStorage.setItem('searchTerm', trimmedTerm);
    this.props.onSearch(trimmedTerm);
  };

  render() {
    return (
      <div className="top-controls">
        <input
          type="text"
          className="search-input"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          placeholder="Enter Pokemon name..."
        />
        <button className="search-button" onClick={this.handleSearch}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;
