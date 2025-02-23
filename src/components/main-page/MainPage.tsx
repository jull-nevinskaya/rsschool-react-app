import React, { useState } from "react";
import { useNavigate, Outlet, useParams, useSearchParams } from "react-router-dom";
import Search from "../search/Search.tsx";
import CardList from "../card-list/CardList.tsx";
import useSearchTerm from "../../hooks/useSearchTerm.tsx";
import "../../App.css";
import { useTheme } from "../../hooks/useTheme.ts";
import Flyout from "../flyout/Flyout.tsx";

const MainPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useSearchTerm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const page = searchParams.get("page") || "1";
  const [hasError] = useState<boolean>(false);

  const handleCloseDetails = () => {
    if (id) {
      navigate(`/search?page=${page}`);
    }
  };

  if (hasError) {
    throw new Error("Test Error");
  }

  return (
    <div className={`container ${theme}`} onClick={handleCloseDetails} data-testid="container">
      <button className={`toggle-theme ${theme}`} onClick={toggleTheme}>
        Toggle Theme
      </button>
      <Search onSearch={setSearchTerm} />

      <div className="cardlist-main">
        <div className="col-2">
          <CardList searchTerm={searchTerm} />
        </div>

        {id && (
          <div className={`right-column ${theme}`} onClick={(e) => e.stopPropagation()} data-testid="details-panel">
            <Outlet />
          </div>
        )}
      </div>
      <Flyout />
    </div>
  );
};

export default MainPage;
