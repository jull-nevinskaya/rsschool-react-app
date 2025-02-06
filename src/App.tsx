import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Search from "./components/Search";
import CardList from "./components/CardList";
import NotFound from "./components/NotFound";
import useSearchTerm from "./hooks/useSearchTerm";
import "./App.css";

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useSearchTerm();
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
    <Router>
      <div className="container">
        <Search onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Navigate replace to="/search?page=1" />} />
          <Route path="/search" element={<CardList searchTerm={searchTerm} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <button className="error-button" onClick={handleThrowError}>
          Throw Error
        </button>
      </div>
    </Router>
  );
};

export default App;
