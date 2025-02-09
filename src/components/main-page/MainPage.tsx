import React, { useState } from "react";
import { useNavigate, Outlet, useParams, useSearchParams } from "react-router-dom";
import Search from "../search/Search.tsx";
import CardList from "../card-list/CardList.tsx";
import useSearchTerm from "../../hooks/useSearchTerm.ts";
import "../../App.css";

const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useSearchTerm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const page = searchParams.get("page") || "1";
  const [hasError, setHasError] = useState<boolean>(false);

  const handleCloseDetails = () => {
    if (id) {
      navigate(`/search?page=${page}`);
    }
  };

  const handleThrowError = () => {
    setHasError(true);
  };

  if (hasError) {
    throw new Error("Test Error");
  }

  return (
    <div className="container" onClick={handleCloseDetails} data-testid="container">
      <Search onSearch={setSearchTerm} />

      <div className="cardlist-main">
        <div className="col-2">
          <CardList searchTerm={searchTerm} />
        </div>

        {id && (
          <div className="right-column" onClick={(e) => e.stopPropagation()} data-testid="details-panel">
            <Outlet />
          </div>
        )}
      </div>

      <button className="error-button" onClick={handleThrowError}>
        Throw Error
      </button>
    </div>
  );
};

export default MainPage;
