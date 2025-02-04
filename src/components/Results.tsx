import { Component } from 'react';
import CardList from './CardList';

interface ResultsProps {
  searchTerm: string;
}

class Results extends Component<ResultsProps> {
  render() {
    return (
      <div className="results">
        <h2>Search Results</h2>
        <CardList searchTerm={this.props.searchTerm} />
      </div>
    );
  }
}

export default Results;
