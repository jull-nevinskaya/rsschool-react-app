import React, { useState } from "react";
import Search from "./components/Search";
import Results from "./components/Results";
import "./App.css";

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(
    localStorage.getItem("searchTerm") ?? ""
  );
  const [hasError, setHasError] = useState<boolean>(false);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleThrowError = () => {
    setHasError(true);
  };

  if (hasError) {
    throw new Error("Test Error");
  }

  return (
    <div className="container">
      <Search onSearch={handleSearch} />
      <Results searchTerm={searchTerm} />
      <button className="error-button" onClick={handleThrowError}>
        Throw Error
      </button>
    </div>
  );
};

export default App;
