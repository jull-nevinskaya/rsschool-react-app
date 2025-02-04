import CardList from "./CardList";

interface ResultsProps {
  searchTerm: string;
}

const Results: React.FC<ResultsProps> = ({ searchTerm }) => {
  return (
    <div className="results">
      <h2>Search Results</h2>
      <CardList searchTerm={searchTerm} />
    </div>
  );
};

export default Results;
