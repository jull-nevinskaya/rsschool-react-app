import React, { useState, useRef, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Search from "./components/Search";
import CardList from "./components/CardList";
import NotFound from "./components/NotFound";
import useSearchTerm from "./hooks/useSearchTerm";
import "./App.css";
import PokemonDetails from "./components/PokemonDetails";

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
          <Route path="/search" element={<MainPage searchTerm={searchTerm} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <button className="error-button" onClick={handleThrowError}>
          Throw Error
        </button>
      </div>
    </Router>
  );
};

const MainPage: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPokemon = searchParams.get("details");
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const handleCloseDetails = useCallback(
    (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        searchParams.delete("details");
        setSearchParams(searchParams);
      }
    },
    [searchParams, setSearchParams] // Добавляем зависимости
  );

  useEffect(() => {
    document.addEventListener("click", handleCloseDetails);
    return () => document.removeEventListener("click", handleCloseDetails);
  }, [handleCloseDetails]);

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div style={{ flex: 1 }}>
        <CardList searchTerm={searchTerm} />
      </div>

      {selectedPokemon && (
        <div ref={detailsRef} style={{ flex: 1, borderLeft: "1px solid #ccc", padding: "10px" }}
             onClick={(e) => e.stopPropagation()}>
          <PokemonDetails pokemonId={selectedPokemon} />
        </div>
      )}
    </div>
  );
};

export default App;
