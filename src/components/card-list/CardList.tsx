import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../card/Card.tsx";
import Spinner from "../spinner/Spinner.tsx";
import Pagination from "../pagination/Pagination.tsx";
import { fetchPokemons } from "../../api/api.ts";

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const CardList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchPokemons(searchTerm, limit, offset)
      .then((results) => {
        setPokemons(results.pokemons);
        setTotalCount(results.totalCount);
      })
      .catch((error) => {
        console.error("API Fetch Error:", error);

        let errorMessage = "Unexpected error occurred. Please try again";

        if (error instanceof Error) {
          if (error.message.includes("404")) {
            errorMessage = "Pokemon not found. Let's try a different name";
          } else if (error.message.startsWith("4")) {
            errorMessage = "Invalid search query. Please try again";
          } else if (error.message.startsWith("5")) {
            errorMessage = "Server error. Please try again later";
          } else {
            errorMessage = "Network error. Please check your connection";
          }
        }

        setError(errorMessage);
        setPokemons([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchTerm, page, offset]);

  const handleClick = (id: number) => {
    navigate(`details/${id}?page=${page}`);
  };

  if (loading) return <Spinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
      <div className="col-1">
        <div className="card-list">
          {pokemons.length > 0 ? (
            pokemons.map((pokemon) => (
              <Card
                key={pokemon.id}
                id={pokemon.id}
                name={pokemon.name}
                image={pokemon.image}
                onClick={() => handleClick(pokemon.id)}
              />
            ))
          ) : (
            <p className="error-message">No Pokemon found for "{searchTerm}". Try a different name.</p>
          )}
        </div>

        {totalCount > limit && <Pagination totalItems={totalCount} itemsPerPage={limit} />}
      </div>
  );
};

export default CardList;
