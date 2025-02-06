import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "./Card";
import Spinner from "./Spinner";
import Pagination from "./Pagination";
import { fetchPokemons } from "../api/api";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string;
  image: string;
}

interface CardListProps {
  searchTerm: string;
}

const CardList: React.FC<CardListProps> = ({ searchTerm }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

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
    searchParams.set("details", id.toString());
    setSearchParams(searchParams);
  };

  if (loading) return <Spinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div style={{ flex: 1 }}>
        <div className="card-list">
          {pokemons.length > 0 ? (
            pokemons.map((pokemon) => (
              <Card
                key={pokemon.id}
                id={pokemon.id}
                name={pokemon.name}
                image={pokemon.image}
                height={pokemon.height}
                weight={pokemon.weight}
                types={pokemon.types}
                onClick={() => handleClick(pokemon.id)}
              />
            ))
          ) : (
            <p className="error-message">No Pokemon found for "{searchTerm}". Try a different name.</p>
          )}
        </div>

        {totalCount > limit && <Pagination totalItems={totalCount} itemsPerPage={limit} />}
      </div>

    </div>
  );
};

export default CardList;
