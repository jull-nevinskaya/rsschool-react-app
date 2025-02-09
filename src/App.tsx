import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet, useParams, useSearchParams } from "react-router-dom";
import Search from "./components/search/Search.tsx";
import CardList from "./components/card-list/CardList.tsx";
import NotFound from "./components/404/NotFound.tsx";
import useSearchTerm from "./hooks/useSearchTerm";
import "./App.css";
import PokemonDetails from "./components/pokemon-details/PokemonDetails.tsx";

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
          <Route path="/search" element={<MainPage searchTerm={searchTerm} />}>
            <Route path="details/:id" element={<PokemonDetails />} />
          </Route>
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const page = searchParams.get("page") || "1";

  const handleCloseDetails = () => {
    if (id) {
      navigate(`/search?page=${page}`);
    }
  };

  return (
    <div className="cardlist-main">
      <div className="col-2" onClick={handleCloseDetails}>
        <CardList searchTerm={searchTerm} />
      </div>

      {id && (
        <div className="right-column">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default App;
